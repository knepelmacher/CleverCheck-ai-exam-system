import type { Subject } from '../models/Subject'
import { httpClient } from './httpClient'


export async function getSubjects(): Promise<Subject[]> {
  const response = await httpClient.get<Subject[]>('/subjects')
  return response.data
}

export async function createSubject(subject_name: string): Promise<void> {
  await httpClient.post('/subjects', { subject_name })
}

export async function updateSubject(subject_id: number, subject_name: string): Promise<void> {
  await httpClient.put(`/subjects/${subject_id}`, { subject_name })
}

export async function deleteSubject(subject_id: number): Promise<void> {
  await httpClient.delete(`/subjects/${subject_id}`)
}
