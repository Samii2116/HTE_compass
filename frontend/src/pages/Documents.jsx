import { FileText, Search, Upload, Filter, MoreVertical } from 'lucide-react'
import Header from '../components/layout/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const documents = [
  {
    name: 'HTE Staff Recruitment Guidelines 2025',
    category: 'Policy',
    size: '2.4 MB',
    updated: 'Mar 15, 2025',
    status: 'Indexed',
    variant: 'success',
  },
  {
    name: 'College Affiliation Renewal Checklist',
    category: 'Forms',
    size: '890 KB',
    updated: 'Mar 12, 2025',
    status: 'Pending Review',
    variant: 'warning',
  },
  {
    name: 'Budget Allocation Framework FY 2025-26',
    category: 'Finance',
    size: '1.8 MB',
    updated: 'Mar 10, 2025',
    status: 'Indexed',
    variant: 'success',
  },
  {
    name: 'Leave Policy for Teaching Staff',
    category: 'HR',
    size: '456 KB',
    updated: 'Mar 8, 2025',
    status: 'Indexed',
    variant: 'success',
  },
  {
    name: 'Engineering College Infrastructure Norms',
    category: 'Regulations',
    size: '3.1 MB',
    updated: 'Mar 5, 2025',
    status: 'Indexed',
    variant: 'success',
  },
  {
    name: 'Circular — Principal Meeting March 2025',
    category: 'Circulars',
    size: '320 KB',
    updated: 'Mar 1, 2025',
    status: 'Draft',
    variant: 'blue',
  },
]

export default function Documents() {
  return (
    <div>
      <Header
        title="Documents"
        description="Manage and browse department documents and policies"
        actions={
          <Button>
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        }
      />

      <Card className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
            />
          </div>
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </Card>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-raised">
              <th className="px-5 py-3.5 font-medium text-muted">Document</th>
              <th className="hidden px-5 py-3.5 font-medium text-muted md:table-cell">Category</th>
              <th className="hidden px-5 py-3.5 font-medium text-muted lg:table-cell">Size</th>
              <th className="hidden px-5 py-3.5 font-medium text-muted sm:table-cell">Updated</th>
              <th className="px-5 py-3.5 font-medium text-muted">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr
                key={doc.name}
                className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-hover"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-accent-blue/10 p-2">
                      <FileText className="h-4 w-4 text-accent-blue" />
                    </div>
                    <span className="font-medium text-slate-200">{doc.name}</span>
                  </div>
                </td>
                <td className="hidden px-5 py-4 text-muted md:table-cell">{doc.category}</td>
                <td className="hidden px-5 py-4 text-muted lg:table-cell">{doc.size}</td>
                <td className="hidden px-5 py-4 text-muted sm:table-cell">{doc.updated}</td>
                <td className="px-5 py-4">
                  <Badge variant={doc.variant}>{doc.status}</Badge>
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-overlay hover:text-slate-200"
                    aria-label="Document options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
