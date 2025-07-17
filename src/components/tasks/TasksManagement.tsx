import { useState } from 'react'
import { Plus, Check, Clock, AlertCircle, Filter, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Task } from '@/types'

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: '1',
    userId: 'user1',
    childId: '1',
    title: 'Submit permission slip for field trip',
    description: 'Emma needs permission slip signed for the zoo field trip next week',
    dueDate: '2024-01-16',
    priority: 'high',
    isCompleted: false,
    category: 'other',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    childId: '1',
    title: 'Pack lunch for field trip',
    description: 'Prepare nut-free lunch for Emma\'s field trip',
    dueDate: '2024-01-17',
    priority: 'medium',
    isCompleted: false,
    category: 'other',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    userId: 'user1',
    childId: '2',
    title: 'Help with math homework',
    description: 'Alex needs help with algebra problems for tomorrow',
    dueDate: '2024-01-15',
    priority: 'medium',
    isCompleted: false,
    category: 'homework',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    userId: 'user1',
    childId: '1',
    title: 'Buy new soccer cleats',
    description: 'Emma has outgrown her current cleats',
    dueDate: '2024-01-20',
    priority: 'low',
    isCompleted: true,
    category: 'other',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    userId: 'user1',
    childId: '2',
    title: 'Schedule dentist appointment',
    description: 'Alex is due for his 6-month checkup',
    dueDate: '2024-01-25',
    priority: 'medium',
    isCompleted: false,
    category: 'medical',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

const mockChildren = [
  { id: '1', name: 'Emma' },
  { id: '2', name: 'Alex' }
]

export function TasksManagement() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterChild, setFilterChild] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    childId: 'general',
    dueDate: '',
    priority: 'medium' as Task['priority'],
    category: 'other' as Task['category']
  })

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'homework': return 'bg-blue-100 text-blue-800'
      case 'chores': return 'bg-purple-100 text-purple-800'
      case 'medical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'low': return <Check className="h-4 w-4 text-green-500" />
      default: return null
    }
  }

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const formatDueDate = (dueDate: string) => {
    if (!dueDate) return 'No due date'
    const date = new Date(dueDate)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesChild = filterChild === 'all' || task.childId === filterChild
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && !task.isCompleted) ||
                      (activeTab === 'completed' && task.isCompleted) ||
                      (activeTab === 'overdue' && !task.isCompleted && isOverdue(task.dueDate || ''))
    
    return matchesSearch && matchesPriority && matchesChild && matchesTab
  })

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date().toISOString() }
        : task
    ))
  }

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      userId: 'user1',
      childId: formData.childId || undefined,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      isCompleted: false,
      category: formData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setTasks([...tasks, newTask])
    setFormData({
      title: '',
      description: '',
      childId: '',
      dueDate: '',
      priority: 'medium',
      category: 'other'
    })
    setIsAddTaskOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      childId: 'general',
      dueDate: '',
      priority: 'medium',
      category: 'other'
    })
  }

  const getTaskCounts = () => {
    const all = tasks.length
    const pending = tasks.filter(t => !t.isCompleted).length
    const completed = tasks.filter(t => t.isCompleted).length
    const overdue = tasks.filter(t => !t.isCompleted && isOverdue(t.dueDate || '')).length
    
    return { all, pending, completed, overdue }
  }

  const taskCounts = getTaskCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks & Reminders</h1>
          <p className="text-muted-foreground">Keep track of important tasks and deadlines</p>
        </div>
        
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <Label htmlFor="child">Child</Label>
                <Select value={formData.childId} onValueChange={(value) => setFormData({ ...formData, childId: value })}>
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
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: Task['priority']) => setFormData({ ...formData, priority: value })}>
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
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value: Task['category']) => setFormData({ ...formData, category: value })}>
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
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddTask} disabled={!formData.title} className="flex-1">
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => { setIsAddTaskOpen(false); resetForm(); }} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterChild} onValueChange={setFilterChild}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Child" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Children</SelectItem>
                  {mockChildren.map(child => (
                    <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="ml-1">{taskCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            Pending
            <Badge variant="secondary" className="ml-1">{taskCounts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            Completed
            <Badge variant="secondary" className="ml-1">{taskCounts.completed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="overdue" className="gap-2">
            Overdue
            <Badge variant="destructive" className="ml-1">{taskCounts.overdue}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === 'all' ? 'No tasks match your current filters.' : 
                     activeTab === 'pending' ? 'No pending tasks found.' :
                     activeTab === 'completed' ? 'No completed tasks found.' :
                     'No overdue tasks found.'}
                  </p>
                  {activeTab === 'all' && (
                    <Button onClick={() => setIsAddTaskOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Your First Task
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => {
                const childName = mockChildren.find(c => c.id === task.childId)?.name
                const overdue = !task.isCompleted && isOverdue(task.dueDate || '')
                
                return (
                  <Card key={task.id} className={`hover:shadow-md transition-shadow ${overdue ? 'border-red-200 bg-red-50/50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.isCompleted}
                          onCheckedChange={() => handleToggleTask(task.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`font-medium ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            {getPriorityIcon(task.priority)}
                          </div>
                          
                          {task.description && (
                            <p className={`text-sm text-muted-foreground mb-2 ${task.isCompleted ? 'line-through' : ''}`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getPriorityColor(task.priority)} variant="secondary">
                              {task.priority}
                            </Badge>
                            
                            {task.category && (
                              <Badge className={getCategoryColor(task.category)} variant="secondary">
                                {task.category}
                              </Badge>
                            )}
                            
                            {childName && (
                              <Badge variant="outline">
                                {childName}
                              </Badge>
                            )}
                            
                            {task.dueDate && (
                              <Badge variant={overdue ? 'destructive' : 'outline'}>
                                {formatDueDate(task.dueDate)}
                              </Badge>
                            )}
                            
                            {task.isCompleted && (
                              <Badge className="bg-green-100 text-green-800" variant="secondary">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}