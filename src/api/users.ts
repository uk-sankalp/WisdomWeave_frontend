import { api } from './client'
import type { UserResponse, UserProfileResponse, UpdateProfileRequest } from '../types'

export async function me(): Promise<UserResponse> {
  const raw = await api<Record<string, unknown>>('/users/me')
  return {
    ...raw,
    avatarUrl: (raw.avatarUrl ?? raw.avatar_url ?? null) as string | null,
  } as UserResponse
}

export async function getProfile(): Promise<UserProfileResponse> {
  const raw = await api<Record<string, unknown>>('/users/me/profile')
  return {
    ...raw,
    avatarUrl: (raw.avatarUrl ?? raw.avatar_url ?? null) as string | null,
  } as UserProfileResponse
}

export async function updateProfile(body: UpdateProfileRequest): Promise<UserResponse> {
  return api<UserResponse>('/users/me/profile', {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function uploadAvatar(file: File): Promise<UserResponse> {
  const form = new FormData()
  form.append('file', file)
  return api<UserResponse>('/users/me/avatar', {
    method: 'POST',
    body: form,
  })
}

export async function deleteAvatar(): Promise<UserResponse> {
  return api<UserResponse>('/users/me/avatar', { method: 'DELETE' })
}
