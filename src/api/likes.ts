import { api } from './client'

export async function getLikeCount(postId: number): Promise<number> {
  return api<number>(`/posts/${postId}/likes`)
}

export async function like(postId: number): Promise<void> {
  return api<void>(`/posts/${postId}/likes`, { method: 'POST' })
}

export async function unlike(postId: number): Promise<void> {
  return api<void>(`/posts/${postId}/likes`, { method: 'DELETE' })
}
