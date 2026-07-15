import type { Exam } from "./Exam"
import type { TeacherClass } from "./TeacherClass"

export interface Teacher {
  id: number
  first_name: string
  last_name: string
  email: string
  is_active: boolean
  role: string
  password_hash?: string
  exams?: Exam[]
  teacher_classes?: TeacherClass[]
}

