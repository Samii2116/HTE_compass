import { FileText, Search, Upload, RefreshCw } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { uploadDocument, getDocuments, triggerRepositoryIndex } from '../services/api'
import Header from '../components/layout/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Documents() {
  const fileInputRef = useRef(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [indexing, setIndexing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')

  const fetchDocs = async () => {
    try {
      setLoading(true)
      const data = await getDocuments()
      setDocuments(data)
    } catch (err) {
      console.error('Failed to load documents:', err)
      setMessage(`❌ Failed to load documents: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  const handleUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const result = await uploadDocument(file)
      setMessage(`✅ ${result.filename} uploaded successfully (${result.chunks_created} chunks indexed)`)
      await fetchDocs()
    } catch (err) {
      console.error('Upload Error:', err)
      setMessage(`❌ ${err instanceof Error ? err.message : 'Upload failed'}`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleReindex = async () => {
    try {
      setIndexing(true)
      const result = await triggerRepositoryIndex()
      setMessage(`✅ Re-indexed ${result.documents_indexed} documents (${result.total_chunks} total chunks)`)
      await fetchDocs()
    } catch (err) {
      console.error('Re-index Error:', err)
      setMessage(`❌ Re-index failed: ${err.message}`)
    } finally {
      setIndexing(false)
    }
  }

  const filteredDocs = documents.filter((doc) => {
    const term = searchTerm.toLowerCase()
    const titleMatch = (doc.title || '').toLowerCase().includes(term)
    const fileMatch = (doc.filename || '').toLowerCase().includes(term)
    const catMatch = (doc.category || '').toLowerCase().includes(term)
    return titleMatch || fileMatch || catMatch
  })

  return (
    <div>
      <Header
        title="Knowledge Repository"
        description="Centralized Maharashtra Government documents and policy repository"
        actions={
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleReindex} disabled={indexing || uploading}>
              <RefreshCw className={`h-4 w-4 ${indexing ? 'animate-spin' : ''}`} />
              {indexing ? 'Indexing...' : 'Re-index Repository'}
            </Button>
            <input
              type="file"
              accept=".pdf"
              hidden
              ref={fileInputRef}
              onChange={handleUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || indexing}
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        }
      />

      {message && (
        <div className="mb-4 rounded-lg border border-border bg-surface-overlay p-3 text-sm text-slate-200">
          {message}
        </div>
      )}

      <Card className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents by title, filename, or category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="overflow-hidden rounded-xl border border-border">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted">Loading repository documents...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">
            {searchTerm ? 'No matching documents found.' : 'No documents in repository. Upload a PDF or click Re-index.'}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-raised">
                <th className="px-5 py-3.5 font-medium text-muted">Document</th>
                <th className="hidden px-5 py-3.5 font-medium text-muted md:table-cell">Category</th>
                <th className="hidden px-5 py-3.5 font-medium text-muted lg:table-cell">Department</th>
                <th className="hidden px-5 py-3.5 font-medium text-muted lg:table-cell">Language</th>
                <th className="hidden px-5 py-3.5 font-medium text-muted lg:table-cell">Size</th>
                <th className="hidden px-5 py-3.5 font-medium text-muted sm:table-cell">Indexed Date</th>
                <th className="px-5 py-3.5 font-medium text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id || doc.filename}
                  className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-hover"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-accent-blue/10 p-2">
                        <FileText className="h-4 w-4 text-accent-blue" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200">{doc.title || doc.filename}</p>
                        <p className="truncate text-xs text-muted-foreground">{doc.filename}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 text-muted md:table-cell">{doc.category || 'General'}</td>
                  <td className="hidden px-5 py-4 text-muted lg:table-cell">{doc.department || 'Administrative'}</td>
                  <td className="hidden px-5 py-4 text-muted lg:table-cell">{doc.language || 'English'}</td>
                  <td className="hidden px-5 py-4 text-muted lg:table-cell">{doc.size || 'N/A'}</td>
                  <td className="hidden px-5 py-4 text-muted sm:table-cell">{doc.upload_date || 'Recent'}</td>
                  <td className="px-5 py-4">
                    <Badge variant={doc.variant || 'success'}>{doc.status || 'Indexed'}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
