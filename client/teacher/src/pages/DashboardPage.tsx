import { Box, Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import { AssignmentTurnedIn, Quiz, School, TrendingUp } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { getExams } from '../api/exam.api'
import type { Exam } from '../models/Exam'

export default function DashboardPage() {
  const [exams, setExams] = useState<Exam[]>([])

  useEffect(() => {
    void getExams().then(setExams)
  }, [])

  const passedCount = exams.filter((exam) => exam.student_exams?.some((studentExam) => (studentExam.score ?? 0) >= 60)).length
  const pendingCount = exams.filter((exam) => exam.status !== 'published').length

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>לוח מחוונים</Typography>
      <Typography color="text.secondary">סקירה מהירה של המבחנים וההתקדמות בכיתה.</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Quiz color="primary" />
              <Box>
                <Typography variant="h5">{exams.length}</Typography>
                <Typography color="text.secondary">מבחנים</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <AssignmentTurnedIn color="primary" />
              <Box>
                <Typography variant="h5">{passedCount}</Typography>
                <Typography color="text.secondary">עברו</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <School color="primary" />
              <Box>
                <Typography variant="h5">{pendingCount}</Typography>
                <Typography color="text.secondary">טיוטות</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TrendingUp color="primary" />
              <Box>
                <Typography variant="h5">92%</Typography>
                <Typography color="text.secondary">שיעור הצלחה</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>מבחנים אחרונים</Typography>
        <Stack spacing={1.5}>
          {exams.slice(0, 4).map((exam) => (
            <Box key={exam.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography fontWeight={700}>{exam.examName}</Typography>
                <Typography color="text.secondary">{exam.status === 'published' ? 'פורסם' : 'טיוטה'}</Typography>
              </Box>
              <Chip label={exam.status === 'published' ? 'פעיל' : 'טיוטה'} color={exam.status === 'published' ? 'primary' : 'default'} />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  )
}
