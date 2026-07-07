import { httpClient } from './httpClient'

export interface StudentDTO {
  id: number
  first_name: string
  last_name: string
  class_id: number
  is_active: boolean
}

export interface StudentPayload {
  student_id: number
  first_name: string
  last_name: string
  class_id: number
  password?: string
  is_active?: boolean
}

export async function getStudents(): Promise<StudentDTO[]> {
  const response = await httpClient.get<StudentDTO[]>('/students')
  return response.data
}

export async function getStudent(id: number): Promise<StudentDTO> {
  const response = await httpClient.get<StudentDTO>(`/students/${id}`)
  return response.data
}

export async function createStudent(payload: StudentPayload): Promise<void> {
  await httpClient.post('/students', payload)
}

export async function updateStudent(id: number, payload: Partial<StudentPayload>): Promise<void> {
  await httpClient.put(`/students/${id}`, { ...payload, student_id: id })
}

export async function deleteStudent(id: number): Promise<void> {
  await httpClient.delete(`/students/${id}`)
}
