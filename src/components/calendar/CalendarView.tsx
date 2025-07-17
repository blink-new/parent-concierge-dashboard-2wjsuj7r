import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Filter, Calendar as CalendarIcon, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'
import { eventsService, childrenService } from '@/lib/database'
import { Event } from '@/types'

export function CalendarView() {
  const [events, setEvents] = useState<Event[]>([])
  const [children, setChildren] = useState<any[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'other' as Event['eventType'],
    childId: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    isRecurring: false,
    recurrencePattern: 'weekly' as Event['recurrencePattern'],
    priority: 'medium' as Event['priority']
  })

  // Load user and data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await blink.auth.me()
        setUser(currentUser)
        
        // Load events and children
        const [eventsData, childrenData] = await Promise.all([
          eventsService.getAll(currentUser.id),
          childrenService.getAll(currentUser.id)
        ])
        
        setEvents(eventsData)
        setChildren(childrenData)
      } catch (error) {
        console.error('Failed to load data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load calendar data',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getEventTypeColor = (type: Event['eventType']) => {
    switch (type) {
      case 'school': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'medical': return 'bg-red-100 text-red-800 border-red-200'
      case 'activity': return 'bg-green-100 text-green-800 border-green-200'
      case 'birthday': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event.startDate === dateString)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleAddEvent = async () => {
    if (!user || !formData.title || !formData.startDate) return
    
    try {
      const eventData = {
        userId: user.id,
        childId: formData.childId || null,
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        isRecurring: formData.isRecurring,
        recurrencePattern: formData.isRecurring ? formData.recurrencePattern : null,
        priority: formData.priority,
        status: 'upcoming'
      }
      
      if (isEditMode && selectedEvent) {
        // Update existing event
        await eventsService.update(selectedEvent.id, eventData)
        const updatedEvents = events.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, ...eventData, updatedAt: new Date().toISOString() }
            : event
        )
        setEvents(updatedEvents)
        toast({
          title: 'Success',
          description: 'Event updated successfully'
        })
      } else {
        // Create new event
        const newEvent = await eventsService.create(eventData)
        setEvents([...events, newEvent])
        toast({
          title: 'Success',
          description: 'Event created successfully'
        })
      }
      
      resetForm()
      setIsAddEventOpen(false)
      setIsEditMode(false)
      setSelectedEvent(null)
    } catch (error) {
      console.error('Failed to save event:', error)
      toast({
        title: 'Error',
        description: 'Failed to save event',
        variant: 'destructive'
      })
    }
  }

  const handleEditEvent = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      eventType: event.eventType,
      childId: event.childId || '',
      startDate: event.startDate,
      endDate: event.endDate || '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      location: event.location || '',
      isRecurring: !!event.isRecurring,
      recurrencePattern: event.recurrencePattern || 'weekly',
      priority: event.priority
    })
    setSelectedEvent(event)
    setIsEditMode(true)
    setIsAddEventOpen(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventsService.delete(eventId)
      setEvents(events.filter(event => event.id !== eventId))
      setSelectedEvent(null)
      toast({
        title: 'Success',
        description: 'Event deleted successfully'
      })
    } catch (error) {
      console.error('Failed to delete event:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'other',
      childId: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      isRecurring: false,
      recurrencePattern: 'weekly',
      priority: 'medium'
    })
    setIsEditMode(false)
    setSelectedEvent(null)
  }

  const days = getDaysInMonth(currentDate)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage your family's events and schedule</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={view === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('month')}
              className="rounded-r-none"
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('week')}
              className="rounded-none border-x"
            >
              Week
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('day')}
              className="rounded-l-none"
            >
              Day
            </Button>
          </div>
          
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditMode ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter event title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={formData.eventType} onValueChange={(value: Event['eventType']) => setFormData({ ...formData, eventType: value })}>
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
                  <Label htmlFor="child">Child</Label>
                  <Select value={formData.childId} onValueChange={(value) => setFormData({ ...formData, childId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select child (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All children</SelectItem>
                      {children.map(child => (
                        <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: Event['priority']) => setFormData({ ...formData, priority: value })}>
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
                    id="recurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
                  />
                  <Label htmlFor="recurring">Recurring event</Label>
                </div>
                
                {formData.isRecurring && (
                  <div>
                    <Label htmlFor="recurrence">Repeat</Label>
                    <Select value={formData.recurrencePattern} onValueChange={(value: Event['recurrencePattern']) => setFormData({ ...formData, recurrencePattern: value })}>
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddEvent} disabled={!formData.title || !formData.startDate} className="flex-1">
                    {isEditMode ? 'Update Event' : 'Add Event'}
                  </Button>
                  <Button variant="outline" onClick={() => { setIsAddEventOpen(false); resetForm(); }} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day)
              const isToday = day && day.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border rounded-lg ${
                    day ? 'bg-white hover:bg-muted/50' : 'bg-muted/20'
                  } ${isToday ? 'ring-2 ring-primary' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => {
                          const childName = children.find(c => c.id === event.childId)?.name
                          return (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded border cursor-pointer ${getEventTypeColor(event.eventType)}`}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`} />
                                <span className="truncate">{event.title}</span>
                              </div>
                              {childName && (
                                <div className="text-xs opacity-75">{childName}</div>
                              )}
                            </div>
                          )
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getEventTypeColor(selectedEvent.eventType)}>
                    {selectedEvent.eventType}
                  </Badge>
                  <Badge className={`${getPriorityColor(selectedEvent.priority)} text-white`}>
                    {selectedEvent.priority}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEvent.startDate}</span>
                  {selectedEvent.startTime && <span>at {selectedEvent.startTime}</span>}
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">📍</span>
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
                
                {selectedEvent.childId && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">👤</span>
                    <span>{children.find(c => c.id === selectedEvent.childId)?.name}</span>
                  </div>
                )}
                
                {selectedEvent.isRecurring && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">🔄</span>
                    <span>Repeats {selectedEvent.recurrencePattern}</span>
                  </div>
                )}
              </div>
              
              {selectedEvent.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 gap-2"
                  onClick={() => {
                    setSelectedEvent(null)
                    handleEditEvent(selectedEvent)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive gap-2"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}