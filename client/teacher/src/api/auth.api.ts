import { httpClient } from './httpClient'
import type { Teacher } from '../models/Teacher'
import type { LoginPayload } from '../models/Auth'

export async function login(payload: LoginPayload): Promise<Teacher> {
  const response = await httpClient.post<Teacher>('/auth_teacher/login', {
    username: payload.username,
    password: payload.password,
  })

  // Check for authentication failure
  if ((response.data as any) === 'NONE' || (response.data as any)?.error === 'NONE') {
    throw new Error('Invalid username or password')
  }

  return response.data
}

export async function me(): Promise<Teacher> {
  const response = await httpClient.get<Teacher>('/auth_teacher/me')
  return response.data
}

export async function logout(): Promise<void> {
  try {
    await httpClient.post('/auth_teacher/logout')
  } catch {
    // Intentionally ignored
  }
}
