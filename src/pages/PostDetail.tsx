import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getPost } from '../api/posts'
import { listComments, addComment } from '../api/comments'
import { getLikeCount, like, unlike } from '../api/likes'
import type { PostResponse, CommentResponse } from '../types'
import './PostDetail.css'

export function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [post, setPost] = useState<PostResponse | null>(null)
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [likeCount, setLikeCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likePending, setLikePending] = useState(false)

  const postId = id ? parseInt(id, 10) : NaN

  useEffect(() => {
    if (!id || Number.isNaN(postId)) return
    let cancelled = false
    setLoading(true)
    setError('')
    Promise.all([
      getPost(postId),
      listComments(postId),
      getLikeCount(postId),
    ])
      .then(([p, c, l]) => {
        if (!cancelled) {
          setPost(p)
          setComments(c)
          setLikeCount(l)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id, postId])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !user) return
    setSubmittingComment(true)
    try {
      const newComment = await addComment(postId, { comment: commentText.trim() })
      setComments((prev) => [newComment, ...prev])
      setCommentText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleLike = async () => {
    if (!user || likePending) return
    const previouslyLiked = liked
    setLikePending(true)
    try {
      if (previouslyLiked) {
        await unlike(postId)
        setLiked(false)
        setLikeCount((c) => Math.max(0, c - 1))
      } else {
        await like(postId)
        setLiked(true)
        setLikeCount((c) => c + 1)
      }
    } catch {
      setLiked(previouslyLiked)
    } finally {
      setLikePending(false)
    }
  }

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  if (loading) return <div className="container"><p className="muted">Loading…</p></div>
  if (error || !post) return <div className="container"><p className="error-msg">{error || 'Post not found'}</p><Link to="/">Back to posts</Link></div>

  return (
    <div className="container">
      <Link to="/" className="back-link">← Posts</Link>
      <article className="post-detail card">
        <h1 className="post-detail-title">{post.title}</h1>
        <p className="post-detail-meta">{post.author} · {formatDate(post.createdAt)}</p>
        <div className="post-detail-content">{post.content}</div>
        <div className="post-actions">
          {user ? (
            <button
              type="button"
              onClick={handleLike}
              className="like-btn"
              disabled={likePending}
              aria-pressed={liked}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              {liked ? '♥' : '♡'} {likeCount}
            </button>
          ) : (
            <span className="like-count">♡ {likeCount}</span>
          )}
        </div>
      </article>

      <section className="comments-section">
        <h2 className="comments-title">Comments</h2>
        {user && (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
              rows={2}
              required
            />
            <button type="submit" className="btn-primary" disabled={submittingComment}>
              {submittingComment ? 'Posting…' : 'Post comment'}
            </button>
          </form>
        )}
        <ul className="comment-list">
          {comments.length === 0 ? (
            <li className="muted">No comments yet.</li>
          ) : (
            comments.map((c) => (
              <li key={c.id} className="comment-item card">
                <p className="comment-text">{c.comment}</p>
                <p className="comment-meta">{c.author} · {formatDate(c.createdAt)}</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  )
}
