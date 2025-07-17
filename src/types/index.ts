export interface Child {
  id: string
  userId: string
  name: string
  birthDate?: string
  school?: string
  grade?: string
  notes?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  userId: string
  childId?: string
  title: string
  description?: string
  eventType: 'school' | 'medical' | 'activity' | 'birthday' | 'other'
  startDate: string
  endDate?: string
  startTime?: string
  endTime?: string
  location?: string
  isRecurring: boolean
  recurrencePattern?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: 'low' | 'medium' | 'high'
  status: 'upcoming' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  userId: string
  childId?: string
  title: string
  description?: string
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  isCompleted: boolean
  category?: 'homework' | 'chores' | 'medical' | 'other'
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  userId: string
  childId?: string
  title: string
  fileUrl: string
  fileType?: string
  category?: 'medical' | 'school' | 'legal' | 'other'
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  userId: string
  childId?: string
  title?: string
  content: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}