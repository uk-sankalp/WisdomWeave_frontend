import { api } from './client'
import type { AdminDashboard } from '../types'

export async function getDashboard(): Promise<AdminDashboard> {
  return api<AdminDashboard>('/admin/dashboard')
}
