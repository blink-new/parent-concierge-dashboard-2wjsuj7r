import { useState } from 'react'
import { Upload, FileText, Download, Trash2, Eye, Search, Filter, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Document } from '@/types'

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: '1',
    userId: 'user1',
    childId: '1',
    title: 'Emma - Medical Records',
    fileUrl: '/documents/emma-medical.pdf',
    fileType: 'application/pdf',
    category: 'medical',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    childId: '1',
    title: 'Soccer Registration Form',
    fileUrl: '/documents/soccer-registration.pdf',
    fileType: 'application/pdf',
    category: 'other',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '3',
    userId: 'user1',
    childId: '2',
    title: 'Alex - School Report Card',
    fileUrl: '/documents/alex-report-card.pdf',
    fileType: 'application/pdf',
    category: 'school',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '4',
    userId: 'user1',
    title: 'Family Insurance Policy',
    fileUrl: '/documents/insurance-policy.pdf',
    fileType: 'application/pdf',
    category: 'legal',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

const mockChildren = [
  { id: '1', name: 'Emma' },
  { id: '2', name: 'Alex' }
]

export function DocumentsManagement() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterChild, setFilterChild] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadData, setUploadData] = useState({
    title: '',
    childId: 'family',
    category: 'other' as Document['category']
  })

  const getCategoryColor = (category: Document['category']) => {
    switch (category) {
      case 'medical': return 'bg-red-100 text-red-800 border-red-200'
      case 'school': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'legal': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getFileIcon = (fileType?: string) => {
    if (fileType?.includes('pdf')) return '📄'
    if (fileType?.includes('image')) return '🖼️'
    if (fileType?.includes('word')) return '📝'
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return '📊'
    return '📁'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory
    const matchesChild = filterChild === 'all' || 
                      (filterChild === 'family' && !doc.childId) || 
                      doc.childId === filterChild
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'recent' && new Date(doc.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                      (activeTab === 'medical' && doc.category === 'medical') ||
                      (activeTab === 'school' && doc.category === 'school')
    
    return matchesSearch && matchesCategory && matchesChild && matchesTab
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!uploadData.title) {
        setUploadData({ ...uploadData, title: file.name.replace(/\.[^/.]+$/, '') })
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploadData.title) return

    // In a real app, you would upload to storage service
    const newDocument: Document = {
      id: Date.now().toString(),
      userId: 'user1',
      childId: uploadData.childId === 'family' ? undefined : uploadData.childId,
      title: uploadData.title,
      fileUrl: URL.createObjectURL(selectedFile), // Mock URL
      fileType: selectedFile.type,
      category: uploadData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setDocuments([newDocument, ...documents])
    resetUploadForm()
    setIsUploadOpen(false)
  }

  const resetUploadForm = () => {
    setSelectedFile(null)
    setUploadData({
      title: '',
      childId: 'family',
      category: 'other'
    })
  }

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId))
  }

  const handleDownload = (doc: Document) => {
    // In a real app, this would download from storage
    const link = document.createElement('a')
    link.href = doc.fileUrl
    link.download = doc.title
    link.click()
  }

  const getDocumentCounts = () => {
    const all = documents.length
    const recent = documents.filter(d => new Date(d.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
    const medical = documents.filter(d => d.category === 'medical').length
    const school = documents.filter(d => d.category === 'school').length
    
    return { all, recent, medical, school }
  }

  const documentCounts = getDocumentCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Store and organize important family documents</p>
        </div>
        
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Select File *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="Enter document title"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={uploadData.category} onValueChange={(value: Document['category']) => setUploadData({ ...uploadData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="child">Child</Label>
                <Select value={uploadData.childId} onValueChange={(value) => setUploadData({ ...uploadData, childId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select child (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family document</SelectItem>
                    {mockChildren.map(child => (
                      <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || !uploadData.title} 
                  className="flex-1"
                >
                  Upload Document
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { setIsUploadOpen(false); resetUploadForm(); }} 
                  className="flex-1"
                >
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
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterChild} onValueChange={setFilterChild}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Child" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Children</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  {mockChildren.map(child => (
                    <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="ml-1">{documentCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="recent" className="gap-2">
            Recent
            <Badge variant="secondary" className="ml-1">{documentCounts.recent}</Badge>
          </TabsTrigger>
          <TabsTrigger value="medical" className="gap-2">
            Medical
            <Badge variant="secondary" className="ml-1">{documentCounts.medical}</Badge>
          </TabsTrigger>
          <TabsTrigger value="school" className="gap-2">
            School
            <Badge variant="secondary" className="ml-1">{documentCounts.school}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredDocuments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'all' ? 'No documents match your current filters.' : 
                   activeTab === 'recent' ? 'No recent documents found.' :
                   activeTab === 'medical' ? 'No medical documents found.' :
                   'No school documents found.'}
                </p>
                {activeTab === 'all' && (
                  <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Your First Document
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => {
                const childName = mockChildren.find(c => c.id === doc.childId)?.name
                
                return (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="text-2xl">{getFileIcon(doc.fileType)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(doc.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge className={getCategoryColor(doc.category)} variant="secondary">
                          {doc.category}
                        </Badge>
                        
                        {childName && (
                          <Badge variant="outline">
                            {childName}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Storage Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: 45.2 MB</span>
              <span>Available: 954.8 MB</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '4.5%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground">
              Family Plan includes 1GB of document storage
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}