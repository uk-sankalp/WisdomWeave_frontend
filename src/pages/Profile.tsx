import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile, updateProfile, uploadAvatar, deleteAvatar } from '../api/users'
import { Avatar } from '../components/Layout'
import type { UserProfileResponse } from '../types'
import './Profile.css'

export function Profile() {
  const { user, refreshUser } = useAuth()
  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    getProfile()
      .then((p) => {
        setProfile(p)
        setUsername(p.username)
        setBio(p.bio ?? '')
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateProfile({ username, bio })
      await refreshUser()
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const startEditing = () => {
    setUsername(profile?.username ?? '')
    setBio(profile?.bio ?? '')
    setError('')
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setUsername(profile?.username ?? '')
    setBio(profile?.bio ?? '')
    setError('')
    setIsEditing(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarLoading(true)
    try {
      await uploadAvatar(file)
      const p = await getProfile()
      setProfile(p)
      await refreshUser()
    } catch {
      setError('Failed to upload avatar')
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setAvatarLoading(true)
    try {
      await deleteAvatar()
      const p = await getProfile()
      setProfile(p)
      await refreshUser()
    } catch {
      setError('Failed to remove avatar')
    } finally {
      setAvatarLoading(false)
    }
  }

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  if (!user) return null
  if (loading) return <div className="container"><p className="muted">Loading…</p></div>

  return (
    <div className="container">
      <h1 className="page-title">Profile</h1>
      <div className="profile-card card">
        <div className="profile-header">
          <div className="avatar-wrap">
            <Avatar url={profile?.avatarUrl ?? null} alt={profile?.username ?? user.username} size={80} />
            {isEditing && (
              avatarLoading ? (
                <span className="avatar-loading">Updating…</span>
              ) : (
                <div className="avatar-actions">
                  <label className="avatar-upload-btn">
                    <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                    Upload
                  </label>
                  {profile?.avatarUrl && (
                    <button type="button" onClick={handleRemoveAvatar} className="avatar-remove-btn">
                      Remove
                    </button>
                  )}
                </div>
              )
            )}
          </div>
          <div className="profile-meta">
            <p className="profile-email">{profile?.email ?? user.email}</p>
            <p className="profile-joined">Joined {profile?.createdAt ? formatDate(profile.createdAt) : '—'}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="A short bio…"
              />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <div className="profile-form-actions">
              <button type="button" onClick={cancelEditing} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-view">
              <div className="profile-view-field">
                <span className="profile-view-label">Username</span>
                <p className="profile-view-value">{profile?.username ?? '—'}</p>
              </div>
              <div className="profile-view-field">
                <span className="profile-view-label">Bio</span>
                <p className="profile-view-value">{profile?.bio ? profile.bio : '—'}</p>
              </div>
            </div>
            <button type="button" onClick={startEditing} className="btn-primary">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  )
}
