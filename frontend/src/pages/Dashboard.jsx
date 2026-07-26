import {
  FileText,
  Users,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Bot,
} from 'lucide-react'
import Header from '../components/layout/Header'
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

const stats = [
  {
    label: 'Active Documents',
    value: '1,284',
    change: '+12%',
    icon: FileText,
    color: 'text-accent-blue',
    bg: 'bg-accent-blue/10',
  },
  {
    label: 'Queries Today',
    value: '342',
    change: '+28%',
    icon: Bot,
    color: 'text-accent-purple',
    bg: 'bg-accent-purple/10',
  },
  {
    label: 'Staff Users',
    value: '89',
    change: '+3',
    icon: Users,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Avg. Response Time',
    value: '1.2s',
    change: '-18%',
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
]

const recentActivity = [
  {
    title: 'Policy document indexed',
    description: 'HTE Staff Recruitment Guidelines 2025',
    time: '10 min ago',
    badge: 'Documents',
    variant: 'blue',
  },
  {
    title: 'AI query resolved',
    description: 'Leave policy clarification for engineering colleges',
    time: '25 min ago',
    badge: 'Assistant',
    variant: 'purple',
  },
  {
    title: 'Analytics report generated',
    description: 'Monthly department activity summary',
    time: '1 hour ago',
    badge: 'Analytics',
    variant: 'success',
  },
  {
    title: 'Document upload pending',
    description: 'Affiliation renewal checklist — review required',
    time: '2 hours ago',
    badge: 'Pending',
    variant: 'warning',
  },
]

export default function Dashboard() {
  return (
    <div>
      <Header
        title="Dashboard"
        description="Overview of HTE Compass administrative activity"
        actions={
          <Link to="/assistant">
            <Button>
              <Bot className="h-4 w-4" />
              Open AI Assistant
            </Button>
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
          <Card key={stat.label} hover>
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-100">{stat.value}</p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across the department portal</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.title}
                className="flex items-start justify-between gap-4 rounded-lg border border-border-subtle bg-surface p-4 transition-colors hover:border-border"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-200">{item.title}</p>
                    <Badge variant={item.variant}>{item.badge}</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">{item.description}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <div className="space-y-2">
            {[
              { label: 'Ask AI Assistant', to: '/assistant' },
              { label: 'Browse Documents', to: '/documents' },
              { label: 'View Analytics', to: '/analytics' },
              { label: 'Manage Settings', to: '/settings' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between rounded-lg border border-border-subtle px-4 py-3 text-sm text-slate-300 transition-colors hover:border-accent-blue/30 hover:bg-surface-hover hover:text-slate-100"
              >
                {label}
                <ArrowUpRight className="h-4 w-4 text-muted" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
