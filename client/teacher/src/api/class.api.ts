import { httpClient } from './httpClient'

export interface ClassDTO {
  id: number
  className: string
}

export async function getClasses(): Promise<ClassDTO[]> {
  const response = await httpClient.get<ClassDTO[]>('/classes')
  return response.data
}
