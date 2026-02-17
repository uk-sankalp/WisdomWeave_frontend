import { api } from './client'
import type { PostResponse, CreatePostRequest, PageResponse } from '../types'

export async function getPost(id: number): Promise<PostResponse> {
  return api<PostResponse>(`/posts/${id}`)
}

export async function listPosts(page = 0, size = 5): Promise<PageResponse<PostResponse>> {
  const res = await api<PageResponse<PostResponse>>(
    `/posts?page=${page}&size=${size}`
  )
  return res
}

export async function searchPosts(
  keyword: string,
  page = 0,
  size = 5
): Promise<PageResponse<PostResponse>> {
  const params = new URLSearchParams({
    keyword,
    page: String(page),
    size: String(size),
  })
  return api<PageResponse<PostResponse>>(`/posts/search?${params}`)
}

export async function createPost(body: CreatePostRequest): Promise<PostResponse> {
  return api<PostResponse>('/posts', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
