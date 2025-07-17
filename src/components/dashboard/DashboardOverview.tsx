import { Calendar, CheckSquare, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function DashboardOverview() {
  // Mock data - will be replaced with real data later
  const stats = [
    {
      title: "Today's Events",
      value: "3",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pending Tasks",
      value: "7",
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "This Week",
      value: "12",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Children",
      value: "2",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ]

  const upcomingEvents = [
    {
      id: '1',
      title: 'Soccer Practice',
      child: 'Emma',
      time: '4:00 PM',
      type: 'activity',
      priority: 'medium'
    },
    {
      id: '2',
      title: 'Math Test',
      child: 'Alex',
      time: '9:00 AM',
      type: 'school',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Doctor Appointment',
      child: 'Emma',
      time: '2:30 PM',
      type: 'medical',
      priority: 'high'
    }
  ]

  const recentTasks = [
    {
      id: '1',
      title: 'Submit permission slip',
      child: 'Alex',
      dueDate: 'Today',
      completed: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Pack lunch for field trip',
      child: 'Emma',
      dueDate: 'Tomorrow',
      completed: false,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Buy school supplies',
      child: 'Both',
      dueDate: 'This week',
      completed: true,
      priority: 'low'
    }
  ]

  const children = [
    {
      id: '1',
      name: 'Emma',
      age: 8,
      school: 'Riverside Elementary',
      grade: '3rd Grade',
      avatar: '/avatars/emma.png'
    },
    {
      id: '2',
      name: 'Alex',
      age: 12,
      school: 'Lincoln Middle School',
      grade: '7th Grade',
      avatar: '/avatars/alex.png'
    }
  ]

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'school': return 'bg-blue-100 text-blue-800'
      case 'medical': return 'bg-red-100 text-red-800'
      case 'activity': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Children Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Children
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {children.map((child) => (
              <div key={child.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <Avatar>
                  <AvatarImage src={child.avatar} />
                  <AvatarFallback>{child.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{child.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {child.grade} • {child.school}
                  </p>
                </div>
                <Badge variant="secondary">{child.age} years</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Today's Events
              <Button variant="outline" size="sm">View Calendar</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{event.title}</p>
                    <Badge className={getEventTypeColor(event.type)} variant="secondary">
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {event.child} • {event.time}
                  </p>
                </div>
                <Badge className={getPriorityColor(event.priority)} variant="secondary">
                  {event.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Tasks
            <Button variant="outline" size="sm">View All Tasks</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </p>
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {task.child} • Due {task.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {task.completed && (
                    <Badge className="bg-green-100 text-green-800" variant="secondary">
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}