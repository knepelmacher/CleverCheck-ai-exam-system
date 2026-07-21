import { useEffect, useState } from 'react'
import {
  Box, Button, Card, Chip, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Tooltip, Typography,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { keyframes } from '@mui/system'
import { getExams, deleteExam } from '../api/exam.api'
import type { Exam } from '../models/Exam'
import { getExamStatusInfo } from '../utils/examStatus'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const loadExams = () => { void getExams().then(setExams) }

  useEffect(() => { loadExams() }, [])

  const handleDelete = async () => {
    if (deleteId == null) return
    await deleteExam(deleteId)
    setDeleteId(null)
    loadExams()
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
          <Box>
            <Typography variant="h4" fontWeight={800} fontSize={{ xs: '1.5rem', md: '1.85rem' }}>
              מבחנים
            </Typography>
            <Typography color="text.secondary" fontSize="0.95rem">
              נהל מבחנים, פתח תוצאות וערוך שאלות.
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/exams/new"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ gap: 0.5, px: 3 }}
          >
            יצירת מבחן חדש
          </Button>
        </Stack>
      </Box>

      <Card sx={{ animation: `${fadeIn} 0.5s ease-out 0.1s both` }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>שם מבחן</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>מורה</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>סטטוס</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>שאלות</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main', textAlign: 'center', minWidth: 180 }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    <Stack spacing={1} alignItems="center">
                      <Typography color="text.secondary" fontSize="1rem">אין מבחנים להצגה</Typography>
                      <Button component={Link} to="/exams/new" variant="outlined" startIcon={<AddIcon />} size="small">
                        צור מבחן ראשון
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam) => (
                  <TableRow key={exam.id} hover sx={{ animation: `${fadeIn} 0.4s ease-out` }}>
                    <TableCell>
                      <Typography fontWeight={600} fontSize="0.95rem">
                        {exam.examName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize="0.9rem">
                        {exam.teacherName ?? exam.teacherID}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getExamStatusInfo(exam.status).label}
                        color={getExamStatusInfo(exam.status).color}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 32,
                          height: 28,
                          px: 1,
                          borderRadius: 2,
                          bgcolor: 'rgba(255,122,0,0.08)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: 'primary.main',
                        }}
                      >
                        {exam.questionCount ?? exam.questions?.length ?? 0}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="עריכת מבחן">
                          <IconButton component={Link} to={`/exams/${exam.id}`} size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="תוצאות">
                          <IconButton component={Link} to={`/exams/${exam.id}/results`} size="small" color="info">
                            <AssessmentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="מחיקה">
                          <IconButton size="small" color="error" onClick={() => setDeleteId(exam.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={deleteId != null} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>מחיקת מבחן</DialogTitle>
        <DialogContent>
          <DialogContentText>
            האם אתה בטוח שברצונך למחוק מבחן זה? פעולה זו אינה הפיכה.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} color="inherit">ביטול</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>מחק</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
