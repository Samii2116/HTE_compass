import { Bell, Shield, Palette, Globe, Save } from 'lucide-react'
import Header from '../components/layout/Header'
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const toggleSettings = [
  {
    id: 'notifications',
    icon: Bell,
    title: 'Email Notifications',
    description: 'Receive alerts for document updates and AI query summaries',
    enabled: true,
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Two-Factor Authentication',
    description: 'Add an extra layer of security to your account',
    enabled: false,
  },
]

export default function Settings() {
  return (
    <div>
      <Header
        title="Settings"
        description="Manage your HTE Compass preferences and account"
        actions={
          <Button>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" defaultValue="Admin User" />
            <Input label="Email" type="email" defaultValue="admin@hte.gov.in" />
            <Input label="Department" defaultValue="Higher & Technical Education" />
            <Input label="Role" defaultValue="Department Administrator" />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border-subtle p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent-purple/10 p-2">
                  <Palette className="h-4 w-4 text-accent-purple" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Theme</p>
                  <p className="text-xs text-muted">Dark mode with blue/purple accents</p>
                </div>
              </div>
              <span className="rounded-full bg-accent-blue/10 px-3 py-1 text-xs font-medium text-accent-blue">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border-subtle p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent-blue/10 p-2">
                  <Globe className="h-4 w-4 text-accent-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Language</p>
                  <p className="text-xs text-muted">Interface display language</p>
                </div>
              </div>
              <select className="rounded-lg border border-border bg-surface-overlay px-3 py-1.5 text-sm text-slate-200 focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20">
                <option>English</option>
                <option>Marathi</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security & Notifications</CardTitle>
            <CardDescription>Manage security and alert preferences</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {toggleSettings.map((setting) => {
              const Icon = setting.icon
              return (
              <div
                key={setting.id}
                className="flex items-center justify-between rounded-lg border border-border-subtle p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-surface-overlay p-2">
                    <Icon className="h-4 w-4 text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{setting.title}</p>
                    <p className="text-xs text-muted">{setting.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={setting.enabled}
                  className={[
                    'relative h-6 w-11 rounded-full transition-colors duration-200',
                    setting.enabled ? 'bg-gradient-accent' : 'bg-surface-overlay border border-border',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
                      setting.enabled ? 'translate-x-5' : 'translate-x-0.5',
                    ].join(' ')}
                  />
                </button>
              </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
