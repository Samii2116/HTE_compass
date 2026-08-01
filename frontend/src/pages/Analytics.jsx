import { useEffect, useState } from 'react'
import { BarChart3, Layers, FileText, Globe, CheckCircle2, Bot } from 'lucide-react'
import Header from '../components/layout/Header'
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { getStats } from '../services/api'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStats()
        setStats(data)
      } catch (err) {
        console.error('Failed to load analytics stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const totalDocs = stats?.total_documents ?? 0
  const totalChunks = stats?.total_chunks ?? 0
  const totalQueries = stats?.total_queries ?? 0
  const indexStatus = stats?.index_status || 'Healthy'

  const categoryDist = stats?.category_distribution || {}
  const languageDist = stats?.language_distribution || {}

  const metrics = [
    { label: 'Total Documents', value: loading ? '...' : totalDocs, icon: FileText, color: 'text-accent-blue' },
    { label: 'Total Chunks', value: loading ? '...' : totalChunks, icon: Layers, color: 'text-accent-purple' },
    { label: 'Total Queries', value: loading ? '...' : totalQueries, icon: Bot, color: 'text-emerald-400' },
    { label: 'Repository Health', value: loading ? '...' : indexStatus, icon: CheckCircle2, color: 'text-amber-400' },
  ]

  return (
    <div>
      <Header
        title="Repository Analytics"
        description="Core infrastructure insights, knowledge coverage, and content distribution"
        actions={
          <Badge variant="blue">
            <CheckCircle2 className="mr-1 inline h-3 w-3" />
            Live Repository Status
          </Badge>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} hover>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{label}</p>
              <div className="rounded-lg bg-surface-overlay p-2">
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-100">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Breakdown of indexed documents by policy category</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            {Object.keys(categoryDist).length === 0 ? (
              <div className="p-4 text-sm text-muted">No category data available yet.</div>
            ) : (
              Object.entries(categoryDist).map(([cat, count]) => {
                const percentage = totalDocs > 0 ? Math.round((count / totalDocs) * 100) : 0
                return (
                  <div key={cat}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-300">{cat}</span>
                      <span className="text-muted">{count} doc{count > 1 ? 's' : ''} ({percentage}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-gradient-accent"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
            <CardDescription>Indexed documents by official language</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {Object.keys(languageDist).length === 0 ? (
              <div className="p-4 text-sm text-muted">No language data available yet.</div>
            ) : (
              Object.entries(languageDist).map(([lang, count]) => {
                const share = totalDocs > 0 ? `${Math.round((count / totalDocs) * 100)}%` : '0%'
                return (
                  <div
                    key={lang}
                    className="flex items-center justify-between rounded-lg border border-border-subtle px-4 py-3 transition-colors hover:border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-accent-purple/10 p-2">
                        <Globe className="h-4 w-4 text-accent-purple" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{lang}</p>
                        <p className="text-xs text-muted">{count} document{count > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-accent-blue">{share}</span>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
