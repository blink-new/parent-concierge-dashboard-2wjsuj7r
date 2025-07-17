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
    // Use localStorage as primary storage due to database limitations
    try {
      const stored = localStorage.getItem('parent-concierge-children')
      if (stored) {
        const children = JSON.parse(stored)
        return children.filter((child: any) => child.userId === userId)
      }
      return []
    } catch (error) {
      console.error('Error fetching children from localStorage:', error)
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
      
      // Save to localStorage
      const stored = localStorage.getItem('parent-concierge-children')
      const children = stored ? JSON.parse(stored) : []
      children.unshift(child)
      localStorage.setItem('parent-concierge-children', JSON.stringify(children))
      
      return child
    } catch (error) {
      console.error('Error creating child:', error)
      throw error
    }
  },

  async update(id: string, data: any) {
    try {
      const stored = localStorage.getItem('parent-concierge-children')
      if (stored) {
        const children = JSON.parse(stored)
        const index = children.findIndex((child: any) => child.id === id)
        if (index !== -1) {
          children[index] = { ...children[index], ...data, updatedAt: getCurrentTimestamp() }
          localStorage.setItem('parent-concierge-children', JSON.stringify(children))
          return children[index]
        }
      }
      throw new Error('Child not found')
    } catch (error) {
      console.error('Error updating child:', error)
      throw error
    }
  },

  async delete(id: string) {
    try {
      const stored = localStorage.getItem('parent-concierge-children')
      if (stored) {
        const children = JSON.parse(stored)
        const filteredChildren = children.filter((child: any) => child.id !== id)
        localStorage.setItem('parent-concierge-children', JSON.stringify(filteredChildren))
        return true
      }
      return false
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
      const stored = localStorage.getItem('parent-concierge-events')
      if (stored) {
        const events = JSON.parse(stored)
        return events.filter((event: any) => event.userId === userId)
      }
      return []
    } catch (error) {
      console.error('Error fetching events from localStorage:', error)
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
      
      // Save to localStorage
      const stored = localStorage.getItem('parent-concierge-events')
      const events = stored ? JSON.parse(stored) : []
      events.unshift(event)
      localStorage.setItem('parent-concierge-events', JSON.stringify(events))
      
      return event
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  async update(id: string, data: any) {
    try {
      const stored = localStorage.getItem('parent-concierge-events')
      if (stored) {
        const events = JSON.parse(stored)
        const index = events.findIndex((event: any) => event.id === id)
        if (index !== -1) {
          events[index] = { ...events[index], ...data, updatedAt: getCurrentTimestamp() }
          localStorage.setItem('parent-concierge-events', JSON.stringify(events))
          return events[index]
        }
      }
      throw new Error('Event not found')
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  async delete(id: string) {
    try {
      const stored = localStorage.getItem('parent-concierge-events')
      if (stored) {
        const events = JSON.parse(stored)
        const filteredEvents = events.filter((event: any) => event.id !== id)
        localStorage.setItem('parent-concierge-events', JSON.stringify(filteredEvents))
        return true
      }
      return false
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
      const stored = localStorage.getItem('parent-concierge-tasks')
      if (stored) {
        const tasks = JSON.parse(stored)
        return tasks.filter((task: any) => task.userId === userId)
      }
      return []
    } catch (error) {
      console.error('Error fetching tasks from localStorage:', error)
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
      
      // Save to localStorage
      const stored = localStorage.getItem('parent-concierge-tasks')
      const tasks = stored ? JSON.parse(stored) : []
      tasks.unshift(task)
      localStorage.setItem('parent-concierge-tasks', JSON.stringify(tasks))
      
      return task
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  },

  async update(id: string, data: any) {
    try {
      const stored = localStorage.getItem('parent-concierge-tasks')
      if (stored) {
        const tasks = JSON.parse(stored)
        const index = tasks.findIndex((task: any) => task.id === id)
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...data, updatedAt: getCurrentTimestamp() }
          localStorage.setItem('parent-concierge-tasks', JSON.stringify(tasks))
          return tasks[index]
        }
      }
      throw new Error('Task not found')
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },

  async delete(id: string) {
    try {
      const stored = localStorage.getItem('parent-concierge-tasks')
      if (stored) {
        const tasks = JSON.parse(stored)
        const filteredTasks = tasks.filter((task: any) => task.id !== id)
        localStorage.setItem('parent-concierge-tasks', JSON.stringify(filteredTasks))
        return true
      }
      return false
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
      const stored = localStorage.getItem('parent-concierge-documents')
      if (stored) {
        const documents = JSON.parse(stored)
        return documents.filter((document: any) => document.userId === userId)
      }
      return []
    } catch (error) {
      console.error('Error fetching documents from localStorage:', error)
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
      
      // Save to localStorage
      const stored = localStorage.getItem('parent-concierge-documents')
      const documents = stored ? JSON.parse(stored) : []
      documents.unshift(document)
      localStorage.setItem('parent-concierge-documents', JSON.stringify(documents))
      
      return document
    } catch (error) {
      console.error('Error creating document:', error)
      throw error
    }
  },

  async update(id: string, data: any) {
    try {
      const stored = localStorage.getItem('parent-concierge-documents')
      if (stored) {
        const documents = JSON.parse(stored)
        const index = documents.findIndex((document: any) => document.id === id)
        if (index !== -1) {
          documents[index] = { ...documents[index], ...data, updatedAt: getCurrentTimestamp() }
          localStorage.setItem('parent-concierge-documents', JSON.stringify(documents))
          return documents[index]
        }
      }
      throw new Error('Document not found')
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  },

  async delete(id: string) {
    try {
      const stored = localStorage.getItem('parent-concierge-documents')
      if (stored) {
        const documents = JSON.parse(stored)
        const filteredDocuments = documents.filter((document: any) => document.id !== id)
        localStorage.setItem('parent-concierge-documents', JSON.stringify(filteredDocuments))
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }
}