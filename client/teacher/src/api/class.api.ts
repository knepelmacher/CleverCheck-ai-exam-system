import { httpClient } from './httpClient'
import {type ClassModel } from '../models/Class'

export async function getClasses(): Promise<ClassModel[]> {
  const response = await httpClient.get<ClassModel[]>('/classes')
  return response.data
}

export async function createClass(className: string): Promise<void> {
  await httpClient.post('/classes', { class_name: className })
}

export async function updateClass(class_id: number, className: string): Promise<void> {
  await httpClient.put(`/classes/${class_id}`, { class_name: className })
}

export async function deleteClass(class_id: number): Promise<void> {
  await httpClient.delete(`/classes/${class_id}`)
}