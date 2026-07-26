import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import Header from '../components/layout/Header'
import Card, { CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const metrics = [
  { label: 'Total Queries', value: '8,429', trend: '+14.2%', up: true },
  { label: 'Documents Accessed', value: '3,156', trend: '+8.7%', up: true },
  { label: 'Resolution Rate', value: '94.3%', trend: '+2.1%', up: true },
  { label: 'Avg. Session Duration', value: '4m 32s', trend: '-0.8%', up: false },
]

const topQueries = [
  { query: 'Faculty recruitment policy', count: 342, percentage: 85 },
  { query: 'Leave policy for teaching staff', count: 287, percentage: 72 },
  { query: 'Affiliation renewal process', count: 214, percentage: 54 },
  { query: 'Budget allocation guidelines', count: 178, percentage: 45 },
  { query: 'Infrastructure compliance norms', count: 156, percentage: 39 },
]

const departmentUsage = [
  { dept: 'Engineering', queries: 1240, share: '42%' },
  { dept: 'Technical Education', queries: 890, share: '30%' },
  { dept: 'Higher Education', queries: 520, share: '18%' },
  { dept: 'Administration', queries: 290, share: '10%' },
]

export default function Analytics() {
  return (
    <div>
      <Header
        title="Analytics"
        description="Insights into platform usage and query patterns"
        actions={
          <Badge variant="blue">
            <Activity className="mr-1 inline h-3 w-3" />
            Last 30 days
          </Badge>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, trend, up }) => (
          <Card key={label} hover>
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
            <div className="mt-2 flex items-center gap-1">
              {up ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
              )}
              <span className={`text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Queries</CardTitle>
            <CardDescription>Most frequently asked questions this month</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            {topQueries.map(({ query, count, percentage }) => (
              <div key={query}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{query}</span>
                  <span className="text-muted">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-gradient-accent"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Usage</CardTitle>
            <CardDescription>Query distribution by department</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {departmentUsage.map(({ dept, queries, share }) => (
              <div
                key={dept}
                className="flex items-center justify-between rounded-lg border border-border-subtle px-4 py-3 transition-colors hover:border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent-purple/10 p-2">
                    <BarChart3 className="h-4 w-4 text-accent-purple" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{dept}</p>
                    <p className="text-xs text-muted">{queries} queries</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-accent-blue">{share}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
