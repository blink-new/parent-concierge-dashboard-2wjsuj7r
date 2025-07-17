import { 
  Calendar, 
  CheckSquare, 
  FileText, 
  Home, 
  Settings, 
  Users, 
  X 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'calendar', name: 'Calendar', icon: Calendar },
  { id: 'children', name: 'Children', icon: Users },
  { id: 'tasks', name: 'Tasks', icon: CheckSquare },
  { id: 'documents', name: 'Documents', icon: FileText },
  { id: 'settings', name: 'Settings', icon: Settings },
]

export function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b md:hidden">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="font-semibold">Parent Concierge</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <Button
                      variant={activeTab === item.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-10",
                        activeTab === item.id && "bg-primary/10 text-primary hover:bg-primary/15"
                      )}
                      onClick={() => {
                        onTabChange(item.id)
                        onClose()
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm font-medium">Family Plan</p>
              <p className="text-xs text-muted-foreground">
                Manage unlimited children and events
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}