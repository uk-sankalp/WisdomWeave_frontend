import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboard } from '../api/admin'
import type { AdminDashboard } from '../types'
import './AdminDashboard.css'

export function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState<AdminDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      navigate('/')
      return
    }
    if (!user) return
    getDashboard()
      .then(setData)
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [user, authLoading, navigate])

  if (!user || user.role !== 'ADMIN') return null
  if (loading) return <div className="container"><p className="muted">Loading…</p></div>
  if (error) return <div className="container"><p className="error-msg">{error}</p></div>
  if (!data) return null

  return (
    <div className="container">
      <h1 className="page-title">Admin dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card card">
          <span className="dashboard-value">{data.posts}</span>
          <span className="dashboard-label">Posts</span>
        </div>
        <div className="dashboard-card card">
          <span className="dashboard-value">{data.users}</span>
          <span className="dashboard-label">Users</span>
        </div>
        <div className="dashboard-card card">
          <span className="dashboard-value">{data.likes}</span>
          <span className="dashboard-label">Likes</span>
        </div>
      </div>
    </div>
  )
}
