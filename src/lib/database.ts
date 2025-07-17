import { blink } from '@/blink/client'

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
    try {
      return await blink.db.children.list({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      console.error('Error fetching children:', error)
      return []
    }
  },

  async create(data: any) {
    try {
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
    } catch (error) {
      console.error('Error creating child:', error)
      throw error
    }
  },

  async update(id: string, data: any) {
    try {
      return await blink.db.children.update(id, {
        ...data,
        updatedAt: getCurrentTimestamp()
      })
    } catch (error) {
      console.error('Error updating child:', error)
      throw error
    }
  },

  async delete(id: string) {
    try {
      return await blink.db.children.delete(id)
    } catch (error) {
      console.error('Error deleting child:', error)
      throw error
    }
  }
}

// Events operations
export const eventsService = {
  async getAll(userId: string) {
    try {
      return await blink.db.events.list({
        where: { userId },
        orderBy: { startDate: 'asc' }
      })
    } catch (error) {
      console.error('Error fetching events:', error)
      return []
    }
  },

  async create(data: any) {
    try {
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
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  async update(id: string, data: any) {
    try {
      return await blink.db.events.update(id, {
        ...data,
        updatedAt: getCurrentTimestamp()
      })
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  async delete(id: string) {
    try {
      return await blink.db.events.delete(id)
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }
}

// Tasks operations
export const tasksService = {
  async getAll(userId: string) {
    try {
      return await blink.db.tasks.list({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  },

  async create(data: any) {
    try {
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
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  },

  async update(id: string, data: any) {
    try {
      return await blink.db.tasks.update(id, {
        ...data,
        updatedAt: getCurrentTimestamp()
      })
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },

  async delete(id: string) {
    try {
      return await blink.db.tasks.delete(id)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }
}

// Documents operations
export const documentsService = {
  async getAll(userId: string) {
    try {
      return await blink.db.documents.list({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      console.error('Error fetching documents:', error)
      return []
    }
  },

  async create(data: any) {
    try {
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
    } catch (error) {
      console.error('Error creating document:', error)
      throw error
    }
  },

  async update(id: string, data: any) {
    try {
      return await blink.db.documents.update(id, {
        ...data,
        updatedAt: getCurrentTimestamp()
      })
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  },

  async delete(id: string) {
    try {
      return await blink.db.documents.delete(id)
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }
}