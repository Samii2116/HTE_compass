import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import Dashboard from '../pages/Dashboard'
import AIAssistant from '../pages/AIAssistant'
import Documents from '../pages/Documents'
import Analytics from '../pages/Analytics'
import Settings from '../pages/Settings'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="assistant" element={<AIAssistant />} />
        <Route path="documents" element={<Documents />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
