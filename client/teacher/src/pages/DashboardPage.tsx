// import { Box, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material'
// import { AssignmentTurnedIn, CheckCircle, Quiz, School, TrendingUp } from '@mui/icons-material'
// import { useEffect, useState } from 'react'
// import { getExams, getExamStats } from '../api/exam.api'
// import type { Exam } from '../models/Exam'
// import type { ExamStats } from '../api/exam.api'
// import { getExamStatusInfo } from '../utils/examStatus'

// export default function DashboardPage() {
//   const [exams, setExams] = useState<Exam[] | null>(null)
//   const [stats, setStats] = useState<ExamStats | null>(null)

//   useEffect(() => {
//     getExams().then(setExams).catch(() => {})
//     getExamStats().then(setStats).catch(() => {})
//   }, [])

//   const loading = exams === null || stats === null

//   const statCards = [
//     { icon: <Quiz color="primary" />, k: 'totalExams' as const, label: 'מבחנים' },
//     { icon: <AssignmentTurnedIn color="primary" />, k: 'closedCount' as const, label: 'נסגרו' },
//     { icon: <CheckCircle color="primary" />, k: 'activeCount' as const, label: 'פעילים' },
//     { icon: <School color="primary" />, k: 'draftCount' as const, label: 'טיוטות' },
//     { icon: <TrendingUp color="primary" />, k: 'averageScore' as const, label: 'שיעור הצלחה', suffix: '%' },
//   ]

//   return (
//     <Stack spacing={3}>
//       <Typography variant="h4" fontWeight={700}>לוח מחוונים</Typography>
//       <Typography color="text.secondary">סקירה מהירה של המבחנים וההתקדמות בכיתה.</Typography>

//       <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//         {statCards.map((card) => (
//           <Paper key={card.label} sx={{ p: 2.5, flex: '1 1 0', minWidth: 140 }}>
//             <Stack direction="row" spacing={2} alignItems="center">
//               {card.icon}
//               <Box>
//                 {stats ? (
//                   <Typography variant="h5">{stats[card.k]}{card.suffix ?? ''}</Typography>
//                 ) : (
//                   <CircularProgress size={24} />
//                 )}
//                 <Typography color="text.secondary">{card.label}</Typography>
//               </Box>
//             </Stack>
//           </Paper>
//         ))}
//       </Box>

//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h6" mb={2}>מבחנים אחרונים</Typography>
//         <Stack spacing={1.5}>
//           {!exams ? (
//             <Box display="flex" justifyContent="center" py={4}>
//               <CircularProgress />
//             </Box>
//           ) : exams.length === 0 ? (
//             <Typography color="text.secondary" textAlign="center" py={2}>אין מבחנים להצגה</Typography>
//           ) : (
//             exams.slice(0, 4).map((exam) => {
//               const statusInfo = getExamStatusInfo(exam.status)
//               return (
//                 <Box key={exam.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <Typography fontWeight={700}>{exam.examName}</Typography>
//                   <Chip label={statusInfo.label} color={statusInfo.color} size="small" />
//                 </Box>
//               )
//             })
//           )}
//         </Stack>
//       </Paper>
//     </Stack>
//   )
// }


import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  AssignmentTurnedIn,
  CheckCircle,
  Quiz,
  School,
  TrendingUp,
} from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { getExams, getExamStats } from '../api/exam.api'
import type { Exam } from '../models/Exam'
import type { ExamStats } from '../api/exam.api'
import { getExamStatusInfo } from '../utils/examStatus'

export default function DashboardPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [stats, setStats] = useState<ExamStats>({
    totalExams: 0,
    activeCount: 0,
    draftCount: 0,
    closedCount: 0,
    averageScore: 0,
  })

useEffect(() => {
  void getExams()
    .then(setExams)

  setTimeout(() => {
    void getExamStats()
      .then(setStats)
  }, 500)

}, [])

  const statCards = [
    {
      icon: <Quiz color="primary" />,
      k: 'totalExams' as const,
      label: 'מבחנים',
    },
    {
      icon: <AssignmentTurnedIn color="primary" />,
      k: 'closedCount' as const,
      label: 'נסגרו',
    },
    {
      icon: <CheckCircle color="primary" />,
      k: 'activeCount' as const,
      label: 'פעילים',
    },
    {
      icon: <School color="primary" />,
      k: 'draftCount' as const,
      label: 'טיוטות',
    },
    {
      icon: <TrendingUp color="primary" />,
      k: 'averageScore' as const,
      label: 'שיעור הצלחה',
      suffix: '%',
    },
  ]

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        לוח מחוונים
      </Typography>

      <Typography color="text.secondary">
        סקירה מהירה של המבחנים וההתקדמות בכיתה.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {statCards.map((card) => (
          <Paper
            key={card.label}
            sx={{
              p: 2.5,
              flex: '1 1 0',
              minWidth: 140,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              {card.icon}

              <Box>
                <Typography variant="h5">
                  {stats[card.k]}
                  {card.suffix ?? ''}
                </Typography>

                <Typography color="text.secondary">
                  {card.label}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          מבחנים אחרונים
        </Typography>

        <Stack spacing={1.5}>
          {exams.length === 0 ? (
            <Typography
              color="text.secondary"
              textAlign="center"
              py={2}
            >
              אין מבחנים להצגה
            </Typography>
          ) : (
            exams.slice(0, 4).map((exam) => {
              const statusInfo = getExamStatusInfo(exam.status)

              return (
                <Box
                  key={exam.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography fontWeight={700}>
                    {exam.examName}
                  </Typography>

                  <Chip
                    label={statusInfo.label}
                    color={statusInfo.color}
                    size="small"
                  />
                </Box>
              )
            })
          )}
        </Stack>
      </Paper>
    </Stack>
  )
}
