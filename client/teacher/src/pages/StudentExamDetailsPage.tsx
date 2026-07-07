import { useEffect, useState } from 'react'
import { Card, CardContent, Chip, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { getExamById } from '../api/exam.api'
import type { Exam } from '../models/Exam'

export default function StudentExamDetailsPage() {
  const { id, studentId } = useParams<{ id: string; studentId: string }>()
  const [exam, setExam] = useState<Exam | null>(null)

  useEffect(() => {
    if (id) {
      void getExamById(Number(id)).then(setExam)
    }
  }, [id])

  if (!exam) {
    return <Typography>טוען...</Typography>
  }

  const studentExam = exam.student_exams?.find((item) => item.student_id === Number(studentId))

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>פרטי מבחן לסטודנט</Typography>
        <Typography color="text.secondary">סקירה של התשובות, הציונים והסטטוס הסופי.</Typography>
      </Stack>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{exam.examName}</Typography>
            <Chip label={studentExam?.status ?? 'לא ניגש'} color="primary" />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography>ניקוד סופי: {studentExam?.score ?? 0}</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>שאלות</Typography>
          <List dense>
            {(exam.questions ?? []).map((question) => (
              <ListItem key={question.id} divider>
                <ListItemText
                  primary={question.question_text}
                  secondary={`ניקוד מקסימלי: ${question.max_score}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  )
}
