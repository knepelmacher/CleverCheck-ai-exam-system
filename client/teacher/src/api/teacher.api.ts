import { httpClient } from './httpClient'

export interface TeacherDTO {
  id: number
  first_name: string
  last_name: string
  email: string
  is_active: boolean
  role: string
}

export interface TeacherPayload {
  teacher_id: number
  first_name: string
  last_name: string
  email: string
  password?: string
  is_active?: boolean
  role?: string
}

export async function getTeachers(): Promise<TeacherDTO[]> {
  const response = await httpClient.get<TeacherDTO[]>('/teachers')
  return response.data
}

export async function getTeacher(id: number): Promise<TeacherDTO> {
  const response = await httpClient.get<TeacherDTO>(`/teachers/${id}`)
  return response.data
}

export async function createTeacher(payload: TeacherPayload): Promise<void> {
  await httpClient.post('/teachers', payload)
}

export async function updateTeacher(id: number, payload: Partial<TeacherPayload>): Promise<void> {
  await httpClient.put(`/teachers/${id}`, { ...payload, teacher_id: id })
}

export async function deleteTeacher(id: number): Promise<void> {
  await httpClient.delete(`/teachers/${id}`)
}
