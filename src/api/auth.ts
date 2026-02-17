import { api } from './client'
import type { UserResponse, LoginRequest, RegisterRequest } from '../types'

export async function login(body: LoginRequest): Promise<{ token: string }> {
  return api<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function register(body: RegisterRequest): Promise<UserResponse> {
  return api<UserResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
