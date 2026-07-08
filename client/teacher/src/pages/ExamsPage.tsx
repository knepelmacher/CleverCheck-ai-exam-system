import { useEffect, useState } from 'react'
import { Box, Button, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { getExams } from '../api/exam.api'
import type { Exam } from '../models/Exam'
import { getExamStatusInfo } from '../utils/examStatus'

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])

  useEffect(() => {
    void getExams().then(setExams)
  }, [])

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
        <Box>
          <Typography variant="h4" fontWeight={700}>מבחנים</Typography>
          <Typography color="text.secondary">נהל מבחנים, פתח תוצאות וערוך שאלות.</Typography>
        </Box>
        <Button component={Link} to="/exams/new" variant="contained">יצירת מבחן חדש</Button>
      </Stack>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>שם מבחן</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>מורה</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>סטטוס</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>שאלות</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>{exam.examName}</TableCell>
                <TableCell>{exam.teacherName ?? exam.teacherID}</TableCell>
                <TableCell>
                  <Chip label={getExamStatusInfo(exam.status).label} color={getExamStatusInfo(exam.status).color} />
                </TableCell>
                <TableCell>{exam.questionCount ?? exam.questions?.length ?? 0}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button component={Link} to={`/exams/${exam.id}`} size="small" variant="outlined">פתח</Button>
                    <Button component={Link} to={`/exams/${exam.id}/results`} size="small" variant="text">תוצאות</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
