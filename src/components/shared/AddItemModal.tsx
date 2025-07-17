import { useState } from 'react'
import { Plus, Calendar, CheckSquare, Users, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Event, Task } from '@/types'

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAddEvent?: (event: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  onAddTask?: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
}

const mockChildren = [
  { id: '1', name: 'Emma' },
  { id: '2', name: 'Alex' }
]

export function AddItemModal({ isOpen, onClose, onAddEvent, onAddTask }: AddItemModalProps) {
  const [selectedType, setSelectedType] = useState<'event' | 'task' | null>(null)
  
  // Event form data
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    eventType: 'other' as Event['eventType'],
    childId: 'all',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    isRecurring: false,
    recurrencePattern: 'weekly' as Event['recurrencePattern'],
    priority: 'medium' as Event['priority']
  })
  
  // Task form data
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    childId: 'general',
    dueDate: '',
    priority: 'medium' as Task['priority'],
    category: 'other' as Task['category']
  })

  const handleClose = () => {
    setSelectedType(null)
    resetForms()
    onClose()
  }

  const resetForms = () => {
    setEventData({
      title: '',
      description: '',
      eventType: 'other',
      childId: 'all',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      isRecurring: false,
      recurrencePattern: 'weekly',
      priority: 'medium'
    })
    
    setTaskData({
      title: '',
      description: '',
      childId: 'general',
      dueDate: '',
      priority: 'medium',
      category: 'other'
    })
  }

  const handleAddEvent = () => {
    if (!onAddEvent || !eventData.title || !eventData.startDate) return
    
    onAddEvent({
      childId: eventData.childId === 'all' ? undefined : eventData.childId,
      title: eventData.title,
      description: eventData.description,
      eventType: eventData.eventType,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      location: eventData.location,
      isRecurring: eventData.isRecurring,
      recurrencePattern: eventData.isRecurring ? eventData.recurrencePattern : undefined,
      priority: eventData.priority,
      status: 'upcoming'
    })
    
    handleClose()
  }

  const handleAddTask = () => {
    if (!onAddTask || !taskData.title) return
    
    onAddTask({
      childId: taskData.childId === 'general' ? undefined : taskData.childId,
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      isCompleted: false,
      category: taskData.category
    })
    
    handleClose()
  }

  const quickActions = [
    {
      id: 'event',
      title: 'Add Event',
      description: 'Schedule appointments, activities, or school events',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
      available: !!onAddEvent
    },
    {
      id: 'task',
      title: 'Add Task',
      description: 'Create reminders and to-do items',
      icon: CheckSquare,
      color: 'bg-green-100 text-green-600',
      available: !!onAddTask
    },
    {
      id: 'child',
      title: 'Add Child',
      description: 'Add a new child profile',
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      available: false // Will be implemented later
    },
    {
      id: 'document',
      title: 'Upload Document',
      description: 'Store important files and documents',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600',
      available: false // Will be implemented later
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedType === 'event' ? 'Add New Event' : 
             selectedType === 'task' ? 'Add New Task' : 
             'Quick Add'}
          </DialogTitle>
        </DialogHeader>

        {!selectedType ? (
          // Quick action selection
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.filter(action => action.available).map((action) => {
              const Icon = action.icon
              return (
                <Card
                  key={action.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedType(action.id as 'event' | 'task')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : selectedType === 'event' ? (
          // Event form
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-title">Title *</Label>
              <Input
                id="event-title"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            
            <div>
              <Label htmlFor="event-type">Event Type</Label>
              <Select value={eventData.eventType} onValueChange={(value: Event['eventType']) => setEventData({ ...eventData, eventType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="event-child">Child</Label>
              <Select value={eventData.childId} onValueChange={(value) => setEventData({ ...eventData, childId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select child (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All children</SelectItem>
                  {mockChildren.map(child => (
                    <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-start-date">Start Date *</Label>
                <Input
                  id="event-start-date"
                  type="date"
                  value={eventData.startDate}
                  onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="event-end-date">End Date</Label>
                <Input
                  id="event-end-date"
                  type="date"
                  value={eventData.endDate}
                  onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-start-time">Start Time</Label>
                <Input
                  id="event-start-time"
                  type="time"
                  value={eventData.startTime}
                  onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="event-end-time">End Time</Label>
                <Input
                  id="event-end-time"
                  type="time"
                  value={eventData.endTime}
                  onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                value={eventData.location}
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>
            
            <div>
              <Label htmlFor="event-priority">Priority</Label>
              <Select value={eventData.priority} onValueChange={(value: Event['priority']) => setEventData({ ...eventData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="event-recurring"
                checked={eventData.isRecurring}
                onCheckedChange={(checked) => setEventData({ ...eventData, isRecurring: checked })}
              />
              <Label htmlFor="event-recurring">Recurring event</Label>
            </div>
            
            {eventData.isRecurring && (
              <div>
                <Label htmlFor="event-recurrence">Repeat</Label>
                <Select value={eventData.recurrencePattern} onValueChange={(value: Event['recurrencePattern']) => setEventData({ ...eventData, recurrencePattern: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="Enter event description"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddEvent} disabled={!eventData.title || !eventData.startDate} className="flex-1">
                Add Event
              </Button>
              <Button variant="outline" onClick={() => setSelectedType(null)} className="flex-1">
                Back
              </Button>
            </div>
          </div>
        ) : (
          // Task form
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Title *</Label>
              <Input
                id="task-title"
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            
            <div>
              <Label htmlFor="task-child">Child</Label>
              <Select value={taskData.childId} onValueChange={(value) => setTaskData({ ...taskData, childId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select child (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General task</SelectItem>
                  {mockChildren.map(child => (
                    <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={taskData.priority} onValueChange={(value: Task['priority']) => setTaskData({ ...taskData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="task-category">Category</Label>
                <Select value={taskData.category} onValueChange={(value: Task['category']) => setTaskData({ ...taskData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homework">Homework</SelectItem>
                    <SelectItem value="chores">Chores</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input
                id="task-due-date"
                type="date"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddTask} disabled={!taskData.title} className="flex-1">
                Add Task
              </Button>
              <Button variant="outline" onClick={() => setSelectedType(null)} className="flex-1">
                Back
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}