export interface User {
  id: number
  role: 'teacher' | 'student' | 'admin'
  first_name: string
  last_name: string
  isAdmin?: boolean
}
