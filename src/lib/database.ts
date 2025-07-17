import { blink } from '@/blink/client'

// Database initialization and schema setup
export const initializeDatabase = async () => {
  try {
    // Create children table
    await blink.db.query(`
      CREATE TABLE IF NOT EXISTS children (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        birth_date TEXT,
        school TEXT,
        grade TEXT,
        notes TEXT,
        avatar_url TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `)

    // Create events table
    await blink.db.query(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        child_id TEXT,
        title TEXT NOT NULL,
        description TEXT,
        event_type TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        start_time TEXT,
        end_time TEXT,
        location TEXT,
        is_recurring INTEGER DEFAULT 0,
        recurrence_pattern TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'upcoming',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `)

    // Create tasks table
    await blink.db.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        child_id TEXT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        priority TEXT DEFAULT 'medium',
        is_completed INTEGER DEFAULT 0,
        category TEXT DEFAULT 'other',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `)

    // Create documents table
    await blink.db.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        child_id TEXT,
        title TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_type TEXT,
        category TEXT DEFAULT 'other',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `)

    // Create notes table
    await blink.db.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        child_id TEXT,
        title TEXT,
        content TEXT NOT NULL,
        tags TEXT, -- JSON array as string
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `)

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

// Helper functions for database operations
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const getCurrentTimestamp = () => {
  return new Date().toISOString()
}

// Children operations
export const childrenService = {
  async getAll(userId: string) {
    return await blink.db.children.list({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  },

  async create(data: any) {
    const child = {
      id: generateId(),
      userId: data.userId,
      name: data.name,
      birthDate: data.birthDate || null,
      school: data.school || null,
      grade: data.grade || null,
      notes: data.notes || null,
      avatarUrl: data.avatarUrl || null,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    }
    return await blink.db.children.create(child)
  },

  async update(id: string, data: any) {
    return await blink.db.children.update(id, {
      ...data,
      updatedAt: getCurrentTimestamp()
    })
  },

  async delete(id: string) {
    return await blink.db.children.delete(id)
  }
}

// Events operations
export const eventsService = {
  async getAll(userId: string) {
    return await blink.db.events.list({
      where: { userId },
      orderBy: { startDate: 'asc' }
    })
  },

  async create(data: any) {
    const event = {
      id: generateId(),
      userId: data.userId,
      childId: data.childId || null,
      title: data.title,
      description: data.description || null,
      eventType: data.eventType,
      startDate: data.startDate,
      endDate: data.endDate || null,
      startTime: data.startTime || null,
      endTime: data.endTime || null,
      location: data.location || null,
      isRecurring: data.isRecurring ? 1 : 0,
      recurrencePattern: data.recurrencePattern || null,
      priority: data.priority || 'medium',
      status: data.status || 'upcoming',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    }
    return await blink.db.events.create(event)
  },

  async update(id: string, data: any) {
    return await blink.db.events.update(id, {
      ...data,
      updatedAt: getCurrentTimestamp()
    })
  },

  async delete(id: string) {
    return await blink.db.events.delete(id)
  }
}

// Tasks operations
export const tasksService = {
  async getAll(userId: string) {
    return await blink.db.tasks.list({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  },

  async create(data: any) {
    const task = {
      id: generateId(),
      userId: data.userId,
      childId: data.childId || null,
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate || null,
      priority: data.priority || 'medium',
      isCompleted: data.isCompleted ? 1 : 0,
      category: data.category || 'other',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    }
    return await blink.db.tasks.create(task)
  },

  async update(id: string, data: any) {
    return await blink.db.tasks.update(id, {
      ...data,
      updatedAt: getCurrentTimestamp()
    })
  },

  async delete(id: string) {
    return await blink.db.tasks.delete(id)
  }
}

// Documents operations
export const documentsService = {
  async getAll(userId: string) {
    return await blink.db.documents.list({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  },

  async create(data: any) {
    const document = {
      id: generateId(),
      userId: data.userId,
      childId: data.childId || null,
      title: data.title,
      fileUrl: data.fileUrl,
      fileType: data.fileType || null,
      category: data.category || 'other',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp()
    }
    return await blink.db.documents.create(document)
  },

  async update(id: string, data: any) {
    return await blink.db.documents.update(id, {
      ...data,
      updatedAt: getCurrentTimestamp()
    })
  },

  async delete(id: string) {
    return await blink.db.documents.delete(id)
  }
}