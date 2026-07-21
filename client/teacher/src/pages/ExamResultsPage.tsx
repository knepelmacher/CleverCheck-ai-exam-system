import { useEffect, useMemo, useState } from 'react'
import {
  Box, Button, Card, CardContent, Chip, Grid,
  Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography, LinearProgress,
} from '@mui/material'
import {
  TrendingUp,
  EmojiEvents,
  Functions,
  Timeline,
} from '@mui/icons-material'
import { Link, useParams } from 'react-router-dom'
import { keyframes } from '@mui/system'
import { getExamById } from '../api/exam.api'
import type { Exam } from '../models/Exam'
import BackButton from '../components/BackButton'

const growBar = keyframes`
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

const COLORS = ['#ff7a00', '#ff9800', '#ffc107', '#6366f1', '#22c55e', '#f43f5e', '#0891b2', '#8b5cf6']

export default function ExamResultsPage() {
  const { id } = useParams<{ id: string }>()
  const [exam, setExam] = useState<Exam | null>(null)

  useEffect(() => {
    if (id) void getExamById(Number(id)).then(setExam)
  }, [id])

  const chartData = useMemo(() =>
    (exam?.student_exams ?? [])
      .filter((se) => se.score != null)
      .map((se) => ({
        name: se.student ? `${se.student.first_name} ${se.student.last_name}` : `תלמיד ${se.student_id}`,
        score: se.score!,
      })),
    [exam],
  )

  const avgScore = useMemo(() => {
    if (!chartData.length) return 0
    return Math.round((chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length) * 10) / 10
  }, [chartData])

  const maxScore = useMemo(() => Math.max(...chartData.map((d) => d.score), 1), [chartData])
  const minScore = useMemo(() => Math.min(...chartData.map((d) => d.score), 0), [chartData])

  if (!exam) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Typography color="text.secondary">טוען...</Typography>
    </Box>
  )

  const statusLabel = (s?: string | null) =>
    s === 'passed' ? 'עבר' : s === 'submitted' ? 'נשלח' : s ?? '-'

  return (
    <Stack spacing={3}>
      <BackButton to="/exams" />

      {/* Header */}
      <Box sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
        <Typography variant="h4" fontWeight={800} fontSize={{ xs: '1.5rem', md: '1.85rem' }}>
          תוצאות {exam.examName}
        </Typography>
        <Typography color="text.secondary" fontSize="0.95rem">
          מעקב אחר ציונים, סטטיסטיקות והתפלגות.
        </Typography>
      </Box>

      {/* Stats summary cards */}
      <Grid container spacing={2} sx={{ animation: `${fadeIn} 0.5s ease-out 0.1s both` }}>
        {[
          { label: 'ממוצע כיתתי', value: `${avgScore}%`, icon: <Functions />, color: 'primary.main' },
          { label: 'ציון גבוה ביותר', value: `${maxScore}%`, icon: <EmojiEvents />, color: '#22c55e' },
          { label: 'ציון נמוך ביותר', value: `${minScore}%`, icon: <TrendingUp />, color: '#f43f5e' },
          { label: 'נבחנים', value: chartData.length, icon: <Timeline />, color: '#6366f1' },
        ].map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                  <Box sx={{ color: stat.color, '& .MuiSvgIcon-root': { fontSize: 20 } }}>{stat.icon}</Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.8rem">
                    {stat.label}
                  </Typography>
                </Stack>
                <Typography variant="h4" fontWeight={800} fontSize="1.6rem">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bar chart — always visible */}
      {chartData.length > 0 && (
        <Card sx={{ animation: `${fadeIn} 0.5s ease-out 0.2s both` }}>
          <CardContent sx={{ p: { xs: 2, md: 3 }, '&:last-child': { pb: { xs: 2, md: 3 } } }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              התפלגות ציונים
            </Typography>
            <Box sx={{ width: '100%', height: 280 }}>
              <svg viewBox="0 0 700 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                {/* Y-axis grid */}
                {[0, 20, 40, 60, 80, 100].map((val) => {
                  const y = 215 - (val / 100) * 210
                  return (
                    <g key={val}>
                      <line x1="45" y1={y} x2="690" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                      <text x="38" y={y + 5} fill="#94a3b8" fontSize="11" textAnchor="end">{val}</text>
                    </g>
                  )
                })}

                {/* Bars */}
                {chartData.map((d, i) => {
                  const barW = Math.max(18, Math.min(52, 480 / chartData.length - 6))
                  const barH = Math.max(4, (d.score / 100) * 210)
                  const x = 55 + (680 - 55) / chartData.length * i + ((680 - 55) / chartData.length - barW) / 2
                  const y = 215 - barH
                  return (
                    <g key={i} style={{ animation: `${growBar} 0.6s ease-out ${0.05 * i}s both`, transformOrigin: `${x + barW / 2}px 215px` }}>
                      <rect
                        x={x} y={y}
                        width={barW} height={barH}
                        rx={6}
                        fill={COLORS[i % COLORS.length]}
                        opacity={0.88}
                      >
                        <animate attributeName="opacity" from="0.5" to="0.88" dur="0.5s" fill="freeze" />
                      </rect>
                      {/* Score label on top */}
                      <text x={x + barW / 2} y={y - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#333">
                        {d.score}
                      </text>
                      {/* X-axis label */}
                      <text
                        x={x + barW / 2} y={238}
                        textAnchor="end" fontSize={10} fill="#94a3b8"
                        transform={`rotate(-35 ${x + barW / 2} 238)`}
                      >
                        {d.name.length > 10 ? d.name.slice(0, 10) + '..' : d.name}
                      </text>
                    </g>
                  )
                })}

                {/* X axis line */}
                <line x1="45" y1="215" x2="690" y2="215" stroke="#d1d5db" strokeWidth="1" />
              </svg>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Student scores table */}
      <Card sx={{ animation: `${fadeIn} 0.5s ease-out 0.3s both` }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>סטודנט</TableCell>
                <TableCell>ניקוד</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <span>ציון</span>
                    <Box component="span" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>(פס התקדמות)</Box>
                  </Stack>
                </TableCell>
                <TableCell>סטיית תקן</TableCell>
                <TableCell>סטטוס</TableCell>
                <TableCell sx={{ textAlign: 'center', minWidth: 80 }}>פעולה</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(exam.student_exams ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    אין ציונים להצגה
                  </TableCell>
                </TableRow>
              ) : (
                (exam.student_exams ?? []).map((se) => {
                  const deviation = se.score != null ? Math.round((se.score - avgScore) * 10) / 10 : null
                  const scorePercent = se.score != null ? se.score : 0
                  return (
                    <TableRow key={se.id} hover>
                      <TableCell>
                        <Typography fontWeight={600} fontSize="0.9rem">
                          {se.student ? `${se.student.last_name} ${se.student.first_name}` : `סטודנט ${se.student_id}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700} fontSize="1rem">
                          {se.score ?? '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: 140 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LinearProgress
                            variant="determinate"
                            value={scorePercent}
                            sx={{
                              flex: 1,
                              height: 10,
                              borderRadius: 5,
                              bgcolor: 'rgba(255,122,0,0.08)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                bgcolor: scorePercent >= 60 ? '#22c55e' : scorePercent >= 30 ? '#ff9800' : '#f43f5e',
                              },
                            }}
                          />
                          <Typography fontSize="0.8rem" fontWeight={600} width={36} textAlign="right">
                            {scorePercent}%
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={deviation != null ? (deviation > 0 ? `+${deviation}` : `${deviation}`) : '-'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: 2,
                            bgcolor: deviation != null
                              ? deviation > 0 ? 'rgba(34,197,94,0.10)' : 'rgba(244,63,94,0.08)'
                              : 'transparent',
                            color: deviation != null
                              ? deviation > 0 ? '#22c55e' : '#f43f5e'
                              : 'text.secondary',
                            fontSize: '0.8rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabel(se.status)}
                          size="small"
                          color={se.status === 'passed' ? 'success' : 'default'}
                          variant={se.status === 'passed' ? 'filled' : 'outlined'}
                          sx={{ fontWeight: 600, borderRadius: 2, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          component={Link}
                          to={`/exams/${exam.id}/results/${se.student_id}`}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 2, fontWeight: 600 }}
                        >
                          פרטים
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  )
}
