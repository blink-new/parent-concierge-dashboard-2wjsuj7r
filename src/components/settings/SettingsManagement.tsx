import { useState } from 'react'
import { User, Bell, Shield, Users, CreditCard, Download, Trash2, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function SettingsManagement() {
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    bio: 'Busy mom of two amazing kids, Emma and Alex. Love staying organized!'
  })

  const [notifications, setNotifications] = useState({
    emailReminders: true,
    pushNotifications: true,
    weeklyDigest: true,
    eventReminders: true,
    taskDeadlines: true,
    childUpdates: true
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    shareCalendar: false,
    allowInvites: true,
    dataExport: true
  })

  const [familyMembers] = useState([
    {
      id: '1',
      name: 'John Johnson',
      email: 'john.johnson@example.com',
      role: 'Parent',
      status: 'Active',
      joinedAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Grandma Mary',
      email: 'mary.johnson@example.com',
      role: 'Caregiver',
      status: 'Pending',
      joinedAt: '2024-01-15'
    }
  ])

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'caregiver',
    message: ''
  })

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    console.log('Saving profile:', profileData)
    // Show success toast
  }

  const handleSaveNotifications = () => {
    // In a real app, this would save to the backend
    console.log('Saving notifications:', notifications)
    // Show success toast
  }

  const handleSavePrivacy = () => {
    // In a real app, this would save to the backend
    console.log('Saving privacy:', privacy)
    // Show success toast
  }

  const handleInviteMember = () => {
    // In a real app, this would send an invitation
    console.log('Inviting member:', inviteData)
    setInviteData({ email: '', role: 'caregiver', message: '' })
    setIsInviteOpen(false)
    // Show success toast
  }

  const handleExportData = () => {
    // In a real app, this would trigger data export
    console.log('Exporting data...')
    // Show success toast
  }

  const handleDeleteAccount = () => {
    // In a real app, this would show confirmation and delete account
    console.log('Delete account requested')
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'parent': return 'bg-blue-100 text-blue-800'
      case 'caregiver': return 'bg-green-100 text-green-800'
      case 'family': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and family preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="family" className="gap-2">
            <Users className="h-4 w-4" />
            Family
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/avatars/profile.png" />
                  <AvatarFallback className="text-lg">SJ</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveProfile} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-reminders">Email Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for upcoming events and tasks
                    </p>
                  </div>
                  <Switch
                    id="email-reminders"
                    checked={notifications.emailReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailReminders: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get instant notifications on your device
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-digest">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly summary of family activities and upcoming events
                    </p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="event-reminders">Event Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications 24 hours and 1 hour before events
                    </p>
                  </div>
                  <Switch
                    id="event-reminders"
                    checked={notifications.eventReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, eventReminders: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="task-deadlines">Task Deadlines</Label>
                    <p className="text-sm text-muted-foreground">
                      Reminders for approaching task due dates
                    </p>
                  </div>
                  <Switch
                    id="task-deadlines"
                    checked={notifications.taskDeadlines}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, taskDeadlines: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="child-updates">Child Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about your children's activities and milestones
                    </p>
                  </div>
                  <Switch
                    id="child-updates"
                    checked={notifications.childUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, childUpdates: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private - Only family members</SelectItem>
                      <SelectItem value="friends">Friends - Family and invited users</SelectItem>
                      <SelectItem value="public">Public - Anyone can view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share-calendar">Share Calendar</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow family members to view and edit your calendar
                    </p>
                  </div>
                  <Switch
                    id="share-calendar"
                    checked={privacy.shareCalendar}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, shareCalendar: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow-invites">Allow Invitations</Label>
                    <p className="text-sm text-muted-foreground">
                      Let family members invite others to events and activities
                    </p>
                  </div>
                  <Switch
                    id="allow-invites"
                    checked={privacy.allowInvites}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, allowInvites: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-export">Data Export</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow exporting your family data for backup purposes
                    </p>
                  </div>
                  <Switch
                    id="data-export"
                    checked={privacy.dataExport}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, dataExport: checked })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSavePrivacy} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
                <Button variant="outline" onClick={handleExportData} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Management */}
        <TabsContent value="family">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Family Members</CardTitle>
                  <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Users className="h-4 w-4" />
                        Invite Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Invite Family Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="invite-email">Email Address</Label>
                          <Input
                            id="invite-email"
                            type="email"
                            value={inviteData.email}
                            onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                            placeholder="Enter email address"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="invite-role">Role</Label>
                          <Select value={inviteData.role} onValueChange={(value) => setInviteData({ ...inviteData, role: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="parent">Parent - Full access</SelectItem>
                              <SelectItem value="caregiver">Caregiver - Limited access</SelectItem>
                              <SelectItem value="family">Family - View only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="invite-message">Personal Message (Optional)</Label>
                          <Textarea
                            id="invite-message"
                            value={inviteData.message}
                            onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                            placeholder="Add a personal message to the invitation..."
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleInviteMember} disabled={!inviteData.email} className="flex-1">
                            Send Invitation
                          </Button>
                          <Button variant="outline" onClick={() => setIsInviteOpen(false)} className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(member.role)} variant="secondary">
                          {member.role}
                        </Badge>
                        <Badge className={getStatusColor(member.status)} variant="secondary">
                          {member.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Family Sharing Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Shared Calendar Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow all family members to view and edit the family calendar
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Task Assignment</Label>
                      <p className="text-sm text-muted-foreground">
                        Let family members assign tasks to each other
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Document Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Share uploaded documents with all family members
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                  <div>
                    <h3 className="font-semibold">Family Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Unlimited children, 1GB storage, priority support
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$9.99</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      💳
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: '2024-01-01', amount: '$9.99', status: 'Paid' },
                    { date: '2023-12-01', amount: '$9.99', status: 'Paid' },
                    { date: '2023-11-01', amount: '$9.99', status: 'Paid' }
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{invoice.date}</p>
                        <p className="text-sm text-muted-foreground">Family Plan</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{invoice.amount}</span>
                        <Badge className="bg-green-100 text-green-800" variant="secondary">
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}