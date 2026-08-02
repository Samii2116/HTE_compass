import { useState, useEffect } from 'react'
import { Bell, Shield, Palette, Globe, Save, Check } from 'lucide-react'
import Header from '../components/layout/Header'
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Settings() {
  const [language, setLanguage] = useState(() => localStorage.getItem('hte_language') || 'English')
  const [theme, setTheme] = useState(() => localStorage.getItem('hte_theme') || 'dark')
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('hte_language', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('hte_theme', theme)
    if (theme === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  const handleLanguageChange = (e) => {
    const val = e.target.value
    setLanguage(val)
    localStorage.setItem('hte_language', val)
    setSavedMessage(`Language set to ${val}`)
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem('hte_theme', nextTheme)
    setSavedMessage(`Theme updated to ${nextTheme} mode`)
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleSave = () => {
    setSavedMessage('Settings saved successfully!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

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

  return (
    <div>
      <Header
        title="Settings"
        description="Manage your HTE Compass preferences and account"
        actions={
          <div className="flex items-center gap-3">
            {savedMessage && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                {savedMessage}
              </span>
            )}
            <Button onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
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
                  <p className="text-xs text-muted">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleThemeToggle}
                className="rounded-full bg-accent-blue/10 px-3 py-1 text-xs font-medium text-accent-blue hover:bg-accent-blue/20 transition-colors"
              >
                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border-subtle p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent-blue/10 p-2">
                  <Globe className="h-4 w-4 text-accent-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Language</p>
                  <p className="text-xs text-muted">Interface and AI response language</p>
                </div>
              </div>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="rounded-lg border border-border bg-surface-overlay px-3 py-1.5 text-sm text-slate-200 focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
              >
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
                <option value="Hindi">Hindi</option>
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
