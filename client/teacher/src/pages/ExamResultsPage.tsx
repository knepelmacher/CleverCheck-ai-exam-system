import { useEffect, useState } from 'react'
import { Box, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { getExamById } from '../api/exam.api'
import type { Exam } from '../models/Exam'

export default function ExamResultsPage() {
  const { id } = useParams<{ id: string }>()
  const [exam, setExam] = useState<Exam | null>(null)

  useEffect(() => {
    if (id) {
      void getExamById(Number(id)).then(setExam)
    }
  }, [id])

  if (!exam) {
    return <Typography>טוען...</Typography>
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700}>תוצאות {exam.examName}</Typography>
        <Typography color="text.secondary">מעקב אחר ציונים וסטטוס הגשה.</Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>סטודנט</TableCell>
              <TableCell>ניקוד</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell>פעולה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(exam.student_exams ?? []).map((studentExam) => (
              <TableRow key={studentExam.id}>
                <TableCell>
                  {studentExam.student ? `${studentExam.student.first_name} ${studentExam.student.last_name}` : `סטודנט ${studentExam.student_id}`}
                </TableCell>
                <TableCell>{studentExam.score ?? 0}</TableCell>
                <TableCell>
                  <Chip label={studentExam.status ?? 'לא ניגש'} color={studentExam.status === 'passed' ? 'primary' : 'default'} />
                </TableCell>
                <TableCell>
                  <Link to={`/exams/${exam.id}/results/${studentExam.student_id}`}>פרטים</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
