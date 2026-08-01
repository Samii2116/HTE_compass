import { useEffect, useState } from 'react'
import {
  FileText,
  Layers,
  Bot,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'
import Header from '../components/layout/Header'
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { getStats } from '../services/api'

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStats()
        setStatsData(data)
      } catch (err) {
        console.error('Failed to load dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    {
      label: 'Repository Documents',
      value: loading ? '...' : (statsData?.total_documents ?? 0),
      icon: FileText,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
      tag: 'Active',
    },
    {
      label: 'Vector Chunks Indexed',
      value: loading ? '...' : (statsData?.total_chunks ?? 0),
      icon: Layers,
      color: 'text-accent-purple',
      bg: 'bg-accent-purple/10',
      tag: 'FAISS Store',
    },
    {
      label: 'Total Queries Resolved',
      value: loading ? '...' : (statsData?.total_queries ?? 0),
      icon: Bot,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      tag: 'AI RAG',
    },
    {
      label: 'Index Status',
      value: loading ? '...' : (statsData?.index_status || 'Healthy'),
      icon: Activity,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      tag: 'System',
    },
  ]

  const recentActivityList = statsData?.recent_activity || []

  return (
    <div>
      <Header
        title="Dashboard"
        description="Overview of HTE Compass administrative activity & Knowledge Repository status"
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
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} hover>
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  {stat.tag}
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
            <CardDescription>Live updates from the Government Repository</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            {recentActivityList.length === 0 ? (
              <div className="p-4 text-sm text-muted">No activity logged yet.</div>
            ) : (
              recentActivityList.map((item, idx) => (
                <div
                  key={`${item.title}-${idx}`}
                  className="flex items-start justify-between gap-4 rounded-lg border border-border-subtle bg-surface p-4 transition-colors hover:border-border"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-200">{item.title}</p>
                      <Badge variant={item.variant || 'blue'}>{item.badge || 'System'}</Badge>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted">{item.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative & officer portal tasks</CardDescription>
          </CardHeader>
          <div className="space-y-2">
            {[
              { label: 'Ask AI Assistant', to: '/assistant' },
              { label: 'Browse Repository', to: '/documents' },
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
