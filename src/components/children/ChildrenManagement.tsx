import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash2, Calendar, FileText, CheckSquare, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Child } from '@/types'
import { childrenService } from '@/lib/database'
import { blink } from '@/blink/client'

// Local storage key for children data
const CHILDREN_STORAGE_KEY = 'parent-concierge-children'

// Mock data for demonstration
const mockChildren: Child[] = [
  {
    id: '1',
    userId: 'demo-user',
    name: 'Emma Johnson',
    birthDate: '2015-03-15',
    school: 'Riverside Elementary',
    grade: '3rd Grade',
    notes: 'Loves soccer and art. Allergic to peanuts.',
    avatarUrl: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: 'demo-user',
    name: 'Alex Johnson',
    birthDate: '2011-08-22',
    school: 'Lincoln Middle School',
    grade: '7th Grade',
    notes: 'Plays basketball. Needs glasses for reading.',
    avatarUrl: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export function ChildrenManagement() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingLocalStorage, setUsingLocalStorage] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    school: '',
    grade: '',
    notes: ''
  })

  // Load children from localStorage
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(CHILDREN_STORAGE_KEY)
      if (stored) {
        const parsedChildren = JSON.parse(stored)
        setChildren(parsedChildren)
      } else {
        // Use mock data if no local storage data exists
        setChildren(mockChildren)
        localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(mockChildren))
      }
      setUsingLocalStorage(true)
    } catch (err) {
      console.error('Error loading from localStorage:', err)
      setChildren(mockChildren)
      setUsingLocalStorage(true)
    }
  }

  // Save children to localStorage
  const saveToLocalStorage = (childrenData: Child[]) => {
    try {
      localStorage.setItem(CHILDREN_STORAGE_KEY, JSON.stringify(childrenData))
    } catch (err) {
      console.error('Error saving to localStorage:', err)
    }
  }

  const loadChildren = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const user = await blink.auth.me()
      if (user) {
        // Try to load from database first
        try {
          const childrenData = await childrenService.getAll(user.id)
          setChildren(childrenData)
          setUsingLocalStorage(false)
        } catch (dbError) {
          console.error('Database error, falling back to localStorage:', dbError)
          setError('Database temporarily unavailable. Using local storage.')
          loadFromLocalStorage()
        }
      } else {
        // No user, use mock data
        setChildren(mockChildren)
        setUsingLocalStorage(true)
      }
    } catch (error) {
      console.error('Failed to load children:', error)
      setError('Failed to load children data.')
      loadFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }, [])

  // Load children on component mount
  useEffect(() => {
    loadChildren()
  }, [loadChildren])

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  const handleAddChild = async () => {
    try {
      const user = await blink.auth.me()
      const userId = user?.id || 'demo-user'

      const newChild: Child = {
        id: generateId(),
        userId,
        name: formData.name,
        birthDate: formData.birthDate,
        school: formData.school,
        grade: formData.grade,
        notes: formData.notes,
        avatarUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (usingLocalStorage) {
        // Add to local storage
        const updatedChildren = [newChild, ...children]
        setChildren(updatedChildren)
        saveToLocalStorage(updatedChildren)
      } else {
        // Try to add to database
        try {
          const createdChild = await childrenService.create({
            userId,
            name: formData.name,
            birthDate: formData.birthDate,
            school: formData.school,
            grade: formData.grade,
            notes: formData.notes
          })
          setChildren([createdChild, ...children])
        } catch (dbError) {
          console.error('Database error, saving to localStorage:', dbError)
          const updatedChildren = [newChild, ...children]
          setChildren(updatedChildren)
          saveToLocalStorage(updatedChildren)
          setUsingLocalStorage(true)
          setError('Database temporarily unavailable. Changes saved locally.')
        }
      }
      
      setFormData({ name: '', birthDate: '', school: '', grade: '', notes: '' })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to add child:', error)
    }
  }

  const handleEditChild = (child: Child) => {
    setEditingChild(child)
    setFormData({
      name: child.name,
      birthDate: child.birthDate || '',
      school: child.school || '',
      grade: child.grade || '',
      notes: child.notes || ''
    })
  }

  const handleUpdateChild = async () => {
    if (!editingChild) return
    
    try {
      const updatedData = {
        name: formData.name,
        birthDate: formData.birthDate,
        school: formData.school,
        grade: formData.grade,
        notes: formData.notes,
        updatedAt: new Date().toISOString()
      }

      if (usingLocalStorage) {
        // Update in local storage
        const updatedChildren = children.map(child =>
          child.id === editingChild.id ? { ...child, ...updatedData } : child
        )
        setChildren(updatedChildren)
        saveToLocalStorage(updatedChildren)
      } else {
        // Try to update in database
        try {
          await childrenService.update(editingChild.id, updatedData)
          setChildren(children.map(child =>
            child.id === editingChild.id ? { ...child, ...updatedData } : child
          ))
        } catch (dbError) {
          console.error('Database error, updating localStorage:', dbError)
          const updatedChildren = children.map(child =>
            child.id === editingChild.id ? { ...child, ...updatedData } : child
          )
          setChildren(updatedChildren)
          saveToLocalStorage(updatedChildren)
          setUsingLocalStorage(true)
          setError('Database temporarily unavailable. Changes saved locally.')
        }
      }
      
      setEditingChild(null)
      setFormData({ name: '', birthDate: '', school: '', grade: '', notes: '' })
    } catch (error) {
      console.error('Failed to update child:', error)
    }
  }

  const handleDeleteChild = async (childId: string) => {
    try {
      if (usingLocalStorage) {
        // Delete from local storage
        const updatedChildren = children.filter(child => child.id !== childId)
        setChildren(updatedChildren)
        saveToLocalStorage(updatedChildren)
      } else {
        // Try to delete from database
        try {
          await childrenService.delete(childId)
          setChildren(children.filter(child => child.id !== childId))
        } catch (dbError) {
          console.error('Database error, deleting from localStorage:', dbError)
          const updatedChildren = children.filter(child => child.id !== childId)
          setChildren(updatedChildren)
          saveToLocalStorage(updatedChildren)
          setUsingLocalStorage(true)
          setError('Database temporarily unavailable. Changes saved locally.')
        }
      }
    } catch (error) {
      console.error('Failed to delete child:', error)
    }
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Children</h1>
            <p className="text-muted-foreground">Manage your children's profiles and information</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Storage Mode Alert */}
      {usingLocalStorage && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Currently using local storage. Your data is saved in your browser and will persist between sessions.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Children</h1>
          <p className="text-muted-foreground">Manage your children's profiles and information</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Child
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Child</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter child's name"
                />
              </div>
              
              <div>
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  placeholder="Enter school name"
                />
              </div>
              
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-K">Pre-K</SelectItem>
                    <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                    <SelectItem value="1st Grade">1st Grade</SelectItem>
                    <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                    <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                    <SelectItem value="4th Grade">4th Grade</SelectItem>
                    <SelectItem value="5th Grade">5th Grade</SelectItem>
                    <SelectItem value="6th Grade">6th Grade</SelectItem>
                    <SelectItem value="7th Grade">7th Grade</SelectItem>
                    <SelectItem value="8th Grade">8th Grade</SelectItem>
                    <SelectItem value="9th Grade">9th Grade</SelectItem>
                    <SelectItem value="10th Grade">10th Grade</SelectItem>
                    <SelectItem value="11th Grade">11th Grade</SelectItem>
                    <SelectItem value="12th Grade">12th Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any important notes (allergies, preferences, etc.)"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddChild} disabled={!formData.name} className="flex-1">
                  Add Child
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <Card key={child.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={child.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(child.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{child.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {child.birthDate && (
                      <Badge variant="secondary">{calculateAge(child.birthDate)} years</Badge>
                    )}
                    {child.grade && (
                      <Badge variant="outline">{child.grade}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {child.school && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">School</p>
                  <p className="text-sm">{child.school}</p>
                </div>
              )}
              
              {child.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm line-clamp-2">{child.notes}</p>
                </div>
              )}
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Events</span>
                  </div>
                  <p className="text-sm font-semibold">0</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <CheckSquare className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Tasks</span>
                  </div>
                  <p className="text-sm font-semibold">0</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Docs</span>
                  </div>
                  <p className="text-sm font-semibold">0</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleEditChild(child)}
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteChild(child.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingChild} onOpenChange={() => setEditingChild(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Child</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter child's name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-birthDate">Birth Date</Label>
              <Input
                id="edit-birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-school">School</Label>
              <Input
                id="edit-school"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                placeholder="Enter school name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-grade">Grade</Label>
              <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pre-K">Pre-K</SelectItem>
                  <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                  <SelectItem value="1st Grade">1st Grade</SelectItem>
                  <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                  <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                  <SelectItem value="4th Grade">4th Grade</SelectItem>
                  <SelectItem value="5th Grade">5th Grade</SelectItem>
                  <SelectItem value="6th Grade">6th Grade</SelectItem>
                  <SelectItem value="7th Grade">7th Grade</SelectItem>
                  <SelectItem value="8th Grade">8th Grade</SelectItem>
                  <SelectItem value="9th Grade">9th Grade</SelectItem>
                  <SelectItem value="10th Grade">10th Grade</SelectItem>
                  <SelectItem value="11th Grade">11th Grade</SelectItem>
                  <SelectItem value="12th Grade">12th Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any important notes (allergies, preferences, etc.)"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdateChild} disabled={!formData.name} className="flex-1">
                Update Child
              </Button>
              <Button variant="outline" onClick={() => setEditingChild(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {children.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No children added yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first child to begin managing their events and activities.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Child
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}