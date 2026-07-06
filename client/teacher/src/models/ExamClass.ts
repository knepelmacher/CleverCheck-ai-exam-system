import type { ClassModel } from "./Class"
import type { Exam } from "./Exam"

export interface ExamClass {
  id?: number
  class_id: number
  exam_id: number
  class_name?: string
  class_?: ClassModel
  exam?: Exam
}
