export type Role = 'USER' | 'ADMIN'

export interface UserResponse {
  id: number
  username: string
  email: string
  avatarUrl: string | null
  role: Role
}

export interface UserProfileResponse {
  id: number
  username: string
  email: string
  bio: string | null
  avatarUrl: string | null
  role: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface UpdateProfileRequest {
  username?: string
  bio?: string
}

export interface PostResponse {
  id: number
  title: string
  content: string
  published: boolean
  author: string
  createdAt: string
}

export interface CreatePostRequest {
  title: string
  content: string
  published: boolean
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface CommentResponse {
  id: number
  comment: string
  author: string
  createdAt: string
}

export interface CreateCommentRequest {
  comment: string
}

export interface AdminDashboard {
  posts: number
  users: number
  likes: number
}
