import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { DashboardOverview } from './components/dashboard/DashboardOverview'
import { ChildrenManagement } from './components/children/ChildrenManagement'
import { CalendarView } from './components/calendar/CalendarView'
import { TasksManagement } from './components/tasks/TasksManagement'
import { DocumentsManagement } from './components/documents/DocumentsManagement'
import { SettingsManagement } from './components/settings/SettingsManagement'
import { AddItemModal } from './components/shared/AddItemModal'
import { Button } from './components/ui/button'
import { Loader2 } from 'lucide-react'
import { Event, Task } from './types'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  const handleAddEvent = (eventData: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      userId: user?.id || 'user1',
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEvents(prev => [...prev, newEvent])
  }

  const handleAddTask = (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      userId: user?.id || 'user1',
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTasks(prev => [...prev, newTask])
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'calendar':
        return <CalendarView />
      case 'children':
        return <ChildrenManagement />
      case 'tasks':
        return <TasksManagement />
      case 'documents':
        return <DocumentsManagement />
      case 'settings':
        return <SettingsManagement />
      default:
        return <DashboardOverview />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Parent Concierge...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">PC</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Parent Concierge</h1>
          <p className="text-muted-foreground mb-8">
            Your personal admin dashboard for managing children's events, activities, and tasks.
          </p>
          <Button onClick={() => blink.auth.login()} size="lg" className="w-full">
            Sign In to Get Started
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1 flex flex-col md:ml-0">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onAddClick={handleAddClick}
          />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEvent={handleAddEvent}
        onAddTask={handleAddTask}
      />
    </div>
  )
}

export default App