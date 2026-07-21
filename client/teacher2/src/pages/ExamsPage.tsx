import { useEffect, useState } from 'react'
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton, Paper, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Tooltip, Typography,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { getExams, deleteExam } from '../api/exam.api'
import type { Exam } from '../models/Exam'
import { getExamStatusInfo } from '../utils/examStatus'

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
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, textAlign: 'center', minWidth: 160 }}>פעולות</TableCell>
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
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    <Button component={Link} to={`/exams/${exam.id}`} size="small" variant="outlined">פתח</Button>
                    <Button component={Link} to={`/exams/${exam.id}/results`} size="small" variant="text">תוצאות</Button>
                    <Tooltip title="מחיקה">
                      <IconButton size="small" color="error" onClick={() => setDeleteId(exam.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
