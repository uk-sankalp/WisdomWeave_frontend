import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listPosts, searchPosts } from '../api/posts'
import type { PostResponse } from '../types'
import './Home.css'

export function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const size = 5

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    const fetch = keyword
      ? searchPosts(keyword, page, size)
      : listPosts(page, size)
    fetch
      .then((res) => {
        if (!cancelled) {
          setPosts(res.content)
          setTotalPages(res.totalPages)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [page, keyword])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setKeyword(searchInput.trim())
    setPage(0)
  }

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  return (
    <div className="container">
      <div className="home-header">
        <h1 className="page-title">Posts</h1>
        {user?.role === 'ADMIN' && (
          <Link to="/posts/new" className="btn-new-post">New post</Link>
        )}
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search posts…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error-msg">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="muted">No posts yet.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id} className="post-item card">
              <Link to={`/posts/${post.id}`} className="post-link">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-meta">
                  {post.author} · {formatDate(post.createdAt)}
                </p>
                <p className="post-excerpt">
                  {post.content.slice(0, 160)}
                  {post.content.length > 160 ? '…' : ''}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
