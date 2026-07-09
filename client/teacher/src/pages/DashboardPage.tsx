import { Box, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { AssignmentTurnedIn, CheckCircle, Quiz, School, TrendingUp } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { getExams, getExamStats } from '../api/exam.api'
import type { Exam } from '../models/Exam'
import type { ExamStats } from '../api/exam.api'
import { getExamStatusInfo } from '../utils/examStatus'

export default function DashboardPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [stats, setStats] = useState<ExamStats | null>(null)

  useEffect(() => {
    void getExams().then(setExams)
    void getExamStats().then(setStats)
  }, [])

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>לוח מחוונים</Typography>
      <Typography color="text.secondary">סקירה מהירה של המבחנים וההתקדמות בכיתה.</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[
          { icon: <Quiz color="primary" />, key: 'totalExams', label: 'מבחנים' },
          { icon: <AssignmentTurnedIn color="primary" />, key: 'closedCount', label: 'נסגרו' },
          { icon: <CheckCircle color="primary" />, key: 'activeCount', label: 'פעילים' },
          { icon: <School color="primary" />, key: 'draftCount', label: 'טיוטות' },
          { icon: <TrendingUp color="primary" />, key: 'averageScore', label: 'שיעור הצלחה', suffix: '%' },
        ].map((card) => (
          <Paper key={card.label} sx={{ p: 2.5, flex: '1 1 0', minWidth: 140 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              {card.icon}
              <Box>
                {stats ? (
                  <Typography variant="h5">
                    {stats[card.key as keyof ExamStats]}{card.suffix ?? ''}
                  </Typography>
                ) : (
                  <CircularProgress size={24} />
                )}
                <Typography color="text.secondary">{card.label}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>מבחנים אחרונים</Typography>
        <Stack spacing={1.5}>
          {exams.slice(0, 4).map((exam) => {
            const statusInfo = getExamStatusInfo(exam.status)
            return (
              <Box key={exam.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight={700}>{exam.examName}</Typography>
                <Chip label={statusInfo.label} color={statusInfo.color} size="small" />
              </Box>
            )
          })}
        </Stack>
      </Paper>
    </Stack>
  )
}
