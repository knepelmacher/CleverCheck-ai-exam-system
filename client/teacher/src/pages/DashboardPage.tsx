import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
} from '@mui/material'
import {
  CheckCircle,
  TrendingUp,
  BarChart,
  Assessment,
  ArrowBack,
} from '@mui/icons-material'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getExams, getExamStats } from '../api/exam.api'
import type { Exam } from '../models/Exam'
import type { ExamStats } from '../api/exam.api'
import { getExamStatusInfo, isExamActive, isExamClosed } from '../utils/examStatus'

function computeCounts(exams: Exam[], serverStats: ExamStats): ExamStats {
  const activeCount = exams.filter(e => isExamActive(e.status)).length
  const closedCount = exams.filter(e => isExamClosed(e.status)).length
  const draftCount = exams.filter(e => !isExamActive(e.status) && !isExamClosed(e.status)).length
  return {
    totalExams: exams.length,
    activeCount,
    draftCount,
    closedCount,
    averageScore: serverStats.averageScore,
  }
}

export default function DashboardPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [serverStats, setServerStats] = useState<ExamStats>({
    totalExams: 0,
    activeCount: 0,
    draftCount: 0,
    closedCount: 0,
    averageScore: 0,
  })

  const stats = useMemo(() => computeCounts(exams, serverStats), [exams, serverStats])

  useEffect(() => {
    void getExams().then(setExams)
    setTimeout(() => { void getExamStats().then(setServerStats) }, 500)
  }, [])

  return (
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Box>
        <Typography variant="h4" fontWeight={800} fontSize={{ xs: '1.5rem', md: '1.85rem' }}>
          לוח בקרה
        </Typography>
        <Typography color="text.secondary" fontSize="0.95rem">
          סקירה כללית של המבחנים והביצועים
        </Typography>
      </Box>

      {/* ── Top stat cards — landscape style ── */}
      <Grid container spacing={2.5}>
        {/* Recent checks */}
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '2px solid rgba(255, 122, 0, 0.18)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(255,122,0,0.08)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={2.5}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    bgcolor: 'rgba(34, 197, 94, 0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle sx={{ color: '#22c55e', fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.8rem">
                    בדיקות אחרונות
                  </Typography>
                  <Typography variant="h3" fontWeight={800} fontSize="2rem" lineHeight={1.2}>
                    {stats.totalExams}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                    {stats.closedCount} מבחנים נבדקו מתוך {stats.totalExams}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, maxWidth: 140 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 0.5 }}>
                    <Typography fontWeight={700} color="#22c55e" fontSize="1.8rem" lineHeight={1}>
                      98.2%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={98.2}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(34, 197, 94, 0.10)',
                      '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: '#22c55e' },
                    }}
                  />
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                    <Box sx={{ width: 102, height: 22 }}>
                      <svg viewBox="0 0 102 22" width="102" height="22">
                        <polyline
                          points="0,18 8,14 16,16 24,8 32,12 40,6 48,10 56,2 64,8 72,4 80,10 88,2 96,6 102,0"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Typography fontSize="0.65rem" color="#22c55e" fontWeight={600}>+12.5%</Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Analyzed answers */}
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '2px solid rgba(255, 122, 0, 0.18)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(255,122,0,0.08)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={2.5}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 122, 0, 0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BarChart sx={{ color: 'primary.main', fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.8rem">
                    תשובות שנותחו
                  </Typography>
                  <Typography variant="h3" fontWeight={800} fontSize="2rem" lineHeight={1.2}>
                    {(exams.reduce((sum, e) => sum + (e.questionCount ?? 0), 0)).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                    שאלות ב־{exams.length} מבחנים במערכת
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, maxWidth: 140 }}>
                  <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ height: 42 }}>
                    {[30, 55, 40, 72, 48, 85, 62, 78, 52, 92, 68, 88, 58, 95, 72, 90, 65, 82].map((h, i) => (
                      <Box
                        key={i}
                        sx={{
                          flex: 1,
                          height: `${h}%`,
                          bgcolor: h > 85 ? 'primary.main' : 'rgba(255, 122, 0, 0.18)',
                          borderRadius: 1,
                          minWidth: 3,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Accuracy gauge */}
        <Grid item xs={12} sm={6} md={5}>
          <Card sx={{ border: '2px solid rgba(255, 122, 0, 0.18)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(255,122,0,0.08)', height: '100%' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, height: '100%' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      bgcolor: 'rgba(34, 197, 94, 0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <TrendingUp sx={{ color: '#22c55e', fontSize: 26 }} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.8rem" noWrap>
                      מדדי דיוק
                    </Typography>
                    <Typography variant="h3" fontWeight={800} fontSize="2rem" color="#22c55e" lineHeight={1.2}>
                      98.2%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'conic-gradient(#22c55e 0deg 353deg, #e5e7eb 353deg 360deg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Chip
                        label="מצוין"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(34, 197, 94, 0.12)',
                          color: '#22c55e',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 22,
                          borderRadius: 2,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Student performance — wide landscape bar chart */}
        <Grid item xs={12} sm={6} md={7}>
          <Card sx={{ border: '2px solid rgba(255, 122, 0, 0.18)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(255,122,0,0.08)' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    flexShrink: 0,
                  }}
                />
                <Typography variant="h6" fontWeight={700} fontSize="1rem">
                  ביצועי סטודנטים
                </Typography>
              </Stack>

              {/* Wide landscape chart: 3:1 aspect ratio */}
              <Box sx={{ width: '100%', height: 260, position: 'relative' }}>
                <svg viewBox="0 0 680 240" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                  {/* Y-axis grid lines + labels */}
                  {[
                    { y: 20, val: 200 },
                    { y: 70, val: 150 },
                    { y: 120, val: 100 },
                    { y: 170, val: 50 },
                    { y: 220, val: 0 },
                  ].map((tick) => (
                    <g key={tick.val}>
                      <line x1="50" y1={tick.y} x2="670" y2={tick.y} stroke="#f1f5f9" strokeWidth="1" />
                      <text x="42" y={tick.y + 5} fill="#94a3b8" fontSize="11" textAnchor="end">
                        {tick.val}
                      </text>
                    </g>
                  ))}

                  {/* Bars — wider, more spacing */}
                  {[
                    { x: 80,  w: 68, h: 60,  label: '1st' },
                    { x: 170, w: 68, h: 88,  label: '2nd' },
                    { x: 260, w: 68, h: 130, label: '3rd' },
                    { x: 350, w: 68, h: 184, label: '4th', highlight: true },
                    { x: 440, w: 68, h: 124, label: '5th' },
                    { x: 530, w: 68, h: 68,  label: '6th' },
                  ].map((bar) => {
                    const barTop = 220 - bar.h
                    return (
                      <g key={bar.label}>
                        <rect
                          x={bar.x}
                          y={barTop}
                          width={bar.w}
                          height={bar.h}
                          rx="8"
                          fill={bar.highlight ? '#ff7a00' : '#e8eaed'}
                        />
                        <text
                          x={bar.x + bar.w / 2}
                          y="245"
                          fill="#94a3b8"
                          fontSize="13"
                          fontWeight={500}
                          textAnchor="middle"
                        >
                          {bar.label}
                        </text>
                      </g>
                    )
                  })}

                  {/* Bell curve overlay — spanning all bars */}
                  <path
                    d="M80 200 Q130 195 160 185 Q210 140 260 90 Q310 50 384 36 Q450 50 500 90 Q550 140 600 185 Q630 195 650 200"
                    fill="none"
                    stroke="#ff7a00"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                  />
                </svg>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Exams table + Open answer analysis ── */}
      <Grid container spacing={2.5}>
        {/* Exams table */}
        <Grid item xs={12} md={8}>
          <Card sx={{ border: '2px solid rgba(255, 122, 0, 0.18)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(255,122,0,0.08)' }}>
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
                  מבחנים בבדיקה
                </Typography>
                <Button
                  component={Link}
                  to="/exams"
                  size="small"
                  endIcon={<ArrowBack />}
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                  לכל המבחנים
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>שם המבחן</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>שאלות</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>סטטוס</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          אין מבחנים להצגה
                        </TableCell>
                      </TableRow>
                    ) : (
                      exams.slice(0, 5).map((exam) => {
                        const statusInfo = getExamStatusInfo(exam.status)
                        return (
                          <TableRow key={exam.id} hover>
                            <TableCell>
                              <Typography fontWeight={600} fontSize="0.9rem">
                                {exam.examName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="text.secondary" fontSize="0.85rem">
                                {exam.questionCount ?? exam.questions?.length ?? 0} תשובות
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={statusInfo.label}
                                color={statusInfo.color}
                                size="small"
                                sx={{ fontWeight: 600, borderRadius: 2, fontSize: '0.75rem' }}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Open answer analysis */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', border: '2px solid rgba(255, 122, 0, 0.18)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(255,122,0,0.08)' }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Assessment sx={{ color: 'primary.main', fontSize: 22 }} />
                <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
                  ניתוח תשובות פתוחות
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary" mb={2.5}>
                כלים טכנולוגיים מתקדמים מנתחים תשובות פתוחות ומעניקים ציון מדויק על בסיס השוואה סמנטית לתשובת המורה.
              </Typography>

              <Stack spacing={1.5}>
                {[
                  { label: 'תשובה לדוגמה א\'', score: '5.0', color: '#22c55e' },
                  { label: 'תשובה לדוגמה ב\'', score: '8.5', color: 'primary.main' },
                ].map((item) => (
                  <Paper
                    key={item.label}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      borderColor: 'rgba(0,0,0,0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography fontWeight={600} fontSize="0.85rem">{item.label}</Typography>
                      <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                        ציון משוקלל
                      </Typography>
                    </Box>
                    <Typography fontWeight={800} fontSize="1.2rem" color={item.color}>
                      {item.score}
                    </Typography>
                  </Paper>
                ))}
              </Stack>

              <Button
                component={Link}
                to="/exams"
                variant="contained"
                fullWidth
                sx={{ mt: 2.5, borderRadius: 3, py: 1.2 }}
                endIcon={<Assessment />}
              >
                שנחזיר חזרה לניקוד
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}
