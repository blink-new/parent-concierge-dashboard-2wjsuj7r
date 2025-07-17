import { useState } from 'react'
import { Bell, Check, X, Clock, AlertCircle, Calendar, CheckSquare, Users, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Notification {
  id: string
  type: 'event' | 'task' | 'reminder' | 'system'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'event',
    title: 'Soccer Practice Reminder',
    message: 'Emma has soccer practice in 1 hour at Community Center',
    timestamp: '2024-01-15T15:00:00Z',
    isRead: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'task',
    title: 'Task Due Soon',
    message: 'Submit permission slip for field trip is due today',
    timestamp: '2024-01-15T09:00:00Z',
    isRead: false,
    priority: 'high'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Weekly Planning',
    message: 'Time to review and plan next week\'s activities',
    timestamp: '2024-01-14T18:00:00Z',
    isRead: true,
    priority: 'medium'
  },
  {
    id: '4',
    type: 'system',
    title: 'New Family Member',
    message: 'Grandma Mary has joined your family group',
    timestamp: '2024-01-14T12:00:00Z',
    isRead: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'event',
    title: 'Doctor Appointment',
    message: 'Emma\'s checkup appointment is tomorrow at 2:30 PM',
    timestamp: '2024-01-14T10:00:00Z',
    isRead: false,
    priority: 'medium'
  }
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'event': return <Calendar className="h-4 w-4 text-blue-500" />
      case 'task': return <CheckSquare className="h-4 w-4 text-green-500" />
      case 'reminder': return <Clock className="h-4 w-4 text-orange-500" />
      case 'system': return <Users className="h-4 w-4 text-purple-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/50'
      case 'low': return 'border-l-green-500 bg-green-50/50'
      default: return 'border-l-gray-500 bg-gray-50/50'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const filterNotifications = (type?: string) => {
    if (!type || type === 'all') return notifications
    return notifications.filter(n => n.type === type)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="event" className="text-xs">Events</TabsTrigger>
            <TabsTrigger value="task" className="text-xs">Tasks</TabsTrigger>
            <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-96">
            <TabsContent value="all" className="m-0">
              <NotificationList 
                notifications={filterNotifications('all')}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                getNotificationIcon={getNotificationIcon}
                getPriorityColor={getPriorityColor}
                formatTimestamp={formatTimestamp}
              />
            </TabsContent>
            
            <TabsContent value="event" className="m-0">
              <NotificationList 
                notifications={filterNotifications('event')}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                getNotificationIcon={getNotificationIcon}
                getPriorityColor={getPriorityColor}
                formatTimestamp={formatTimestamp}
              />
            </TabsContent>
            
            <TabsContent value="task" className="m-0">
              <NotificationList 
                notifications={filterNotifications('task')}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                getNotificationIcon={getNotificationIcon}
                getPriorityColor={getPriorityColor}
                formatTimestamp={formatTimestamp}
              />
            </TabsContent>
            
            <TabsContent value="system" className="m-0">
              <NotificationList 
                notifications={filterNotifications('system')}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                getNotificationIcon={getNotificationIcon}
                getPriorityColor={getPriorityColor}
                formatTimestamp={formatTimestamp}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {notifications.length === 0 && (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  getNotificationIcon: (type: Notification['type']) => JSX.Element
  getPriorityColor: (priority: Notification['priority']) => string
  formatTimestamp: (timestamp: string) => string
}

function NotificationList({ 
  notifications, 
  onMarkAsRead, 
  onDelete, 
  getNotificationIcon, 
  getPriorityColor, 
  formatTimestamp 
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No notifications in this category</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
            !notification.isRead ? 'bg-blue-50/30' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {notification.title}
                </p>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {notification.message}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(notification.timestamp)}
                </span>
                
                <div className="flex items-center gap-1">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkAsRead(notification.id)}
                      className="h-6 px-2 text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(notification.id)}
                    className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}