import { api } from './client'
import type { CommentResponse, CreateCommentRequest } from '../types'

export async function listComments(postId: number): Promise<CommentResponse[]> {
  return api<CommentResponse[]>(`/posts/${postId}/comments`)
}

export async function addComment(
  postId: number,
  body: CreateCommentRequest
): Promise<CommentResponse> {
  return api<CommentResponse>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
