import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { BarChart as BarChartIcon } from '@mui/icons-material'
import { Link, useParams } from 'react-router-dom'
import { getExamById } from '../api/exam.api'
import type { Exam } from '../models/Exam'
import BackButton from '../components/BackButton'

const CHART_H = 220; const CHART_W = 600; const MARGIN = { top: 10, right: 20, bottom: 50, left: 35 }
const Y_MAX = 100; const Y_STEP = 10
const COLORS = ['#ff7a00', '#ff9800', '#ffc107', '#4caf50', '#2196f3', '#9c27b0', '#e91e63', '#00bcd4']

function BarChart({ data }: { data: { name: string; score: number }[] }) {
  if (!data.length) return null
  const innerW = CHART_W - MARGIN.left - MARGIN.right
  const innerH = CHART_H - MARGIN.top - MARGIN.bottom
  const barW = Math.max(20, Math.min(60, innerW / data.length - 8))
  const yTicks = Array.from({ length: Y_MAX / Y_STEP + 1 }, (_, i) => i * Y_STEP)

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" mb={2}>התפלגות ציונים</Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" style={{ maxWidth: CHART_W }}>
          {/* Y axis */}
          {yTicks.map((y) => (
            <g key={y}>
              <line x1={MARGIN.left} y1={MARGIN.top + innerH - (y / Y_MAX) * innerH}
                x2={CHART_W - MARGIN.right} y2={MARGIN.top + innerH - (y / Y_MAX) * innerH}
                stroke="#e0e0e0" strokeDasharray="4 2" />
              <text x={MARGIN.left - 8} y={MARGIN.top + innerH - (y / Y_MAX) * innerH + 4}
                textAnchor="end" fontSize={11} fill="#888">{y}</text>
            </g>
          ))}
          {/* Bars */}
          {data.map((d, i) => {
            const barH = Math.max(2, (d.score / Y_MAX) * innerH)
            const x = MARGIN.left + (innerW / data.length) * i + (innerW / data.length - barW) / 2
            const y = MARGIN.top + innerH - barH
            return (
              <g key={i}>
                <rect x={x} y={y} width={barW} height={barH} rx={4}
                  fill={COLORS[i % COLORS.length]} opacity={0.85} />
                <text x={x + barW / 2} y={MARGIN.top + innerH + 16}
                  textAnchor="end" fontSize={10} fill="#666"
                  transform={`rotate(-30 ${x + barW / 2} ${MARGIN.top + innerH + 16})`}>
                  {d.name}
                </text>
                <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#333">
                  {d.score}
                </text>
              </g>
            )
          })}
          {/* X axis */}
          <line x1={MARGIN.left} y1={MARGIN.top + innerH} x2={CHART_W - MARGIN.right} y2={MARGIN.top + innerH} stroke="#888" />
        </svg>
      </Box>
    </Paper>
  )
}

export default function ExamResultsPage() {
  const { id } = useParams<{ id: string }>()
  const [exam, setExam] = useState<Exam | null>(null)
  const [chartVisible, setChartVisible] = useState(false)

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

  if (!exam) return <Typography>טוען...</Typography>

  const statusLabel = (s?: string | null) => s === 'passed' ? 'עבר' : s === 'submitted' ? 'נשלח' : s ?? 'טרם'

  return (
    <Stack spacing={3}>
      <BackButton to="/exams" />
      <Box>
        <Typography variant="h4" fontWeight={700}>תוצאות {exam.examName}</Typography>
        <Typography color="text.secondary">מעקב אחר ציונים וסטטוס הגשה.</Typography>
      </Box>
            {!chartVisible ? (
        <Button variant="outlined" startIcon={<BarChartIcon />} onClick={() => setChartVisible(true)} sx={{ alignSelf: 'flex-start', gap: 0.5 }}>
          הצג גרף ציונים
        </Button>
      ) : (
        <>
          <Button variant="outlined" color="inherit" onClick={() => setChartVisible(false)} sx={{ alignSelf: 'flex-start' }}>
            הסתר גרף ציונים
          </Button>
          <BarChart data={chartData} />
        </>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>סטודנט</TableCell>
              <TableCell>ניקוד</TableCell>
              <TableCell>סטיית תקן</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell sx={{ textAlign: 'center', minWidth: 80 }}>פעולה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(exam.student_exams ?? []).map((se) => {
              const deviation = se.score != null ? Math.round((se.score - avgScore) * 10) / 10 : null
              return (
              <TableRow key={se.id}>
                <TableCell>{se.student ? `${se.student.first_name} ${se.student.last_name}` : `סטודנט ${se.student_id}`}</TableCell>
                <TableCell>{se.score ?? 0}</TableCell>
                <TableCell>{deviation != null ? (deviation > 0 ? `+${deviation}` : `${deviation}`) : '-'}</TableCell>
                <TableCell>{statusLabel(se.status)}</TableCell>
                <TableCell><Link to={`/exams/${exam.id}/results/${se.student_id}`}>פרטים</Link></TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

    </Stack>
  )
}
