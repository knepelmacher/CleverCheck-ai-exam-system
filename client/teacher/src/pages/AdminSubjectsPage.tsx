import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Tooltip,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../api/subject.api'
import type { Subject } from '../models/Subject'
import BackButton from '../components/BackButton'

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects()
      setSubjects(data)
    } catch {
      showSnackbar('שגיאה בטעינת המקצועות', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const openAddDialog = () => {
    setEditingId(null)
    setName('')
    setError('')
    setDialogOpen(true)
  }

  const openEditDialog = (subject: Subject) => {
    setEditingId(subject.subject_id)
    setName(subject.subject_name)
    setError('')
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('שם מקצוע הוא שדה חובה')
      return
    }

    try {
      if (editingId) {
        await updateSubject(editingId, name.trim())
        showSnackbar('המקצוע עודכן בהצלחה', 'success')
      } else {
        await createSubject(name.trim())
        showSnackbar('המקצוע נוסף בהצלחה', 'success')
      }
      setDialogOpen(false)
      fetchSubjects()
    } catch {
      showSnackbar('שגיאה בשמירת המקצוע', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteSubject(id)
      showSnackbar('המקצוע נמחק בהצלחה', 'success')
      setDeleteConfirmId(null)
      fetchSubjects()
    } catch {
      showSnackbar('שגיאה במחיקת המקצוע', 'error')
    }
  }

  if (loading) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>ניהול מקצועות</Typography>
        <Typography color="text.secondary">טוען...</Typography>
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <BackButton to="/admin" />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700}>ניהול מקצועות</Typography>
          <Typography color="text.secondary">{subjects.length} מקצועות במערכת</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog} sx={{ gap: 0.5 }}>
          הוסף מקצוע
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 700 }}>מזהה</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>שם המקצוע</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center', minWidth: 100 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  אין מקצועות להצגה
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((subject) => (
                <TableRow key={subject.subject_id} hover>
                  <TableCell>{subject.subject_id}</TableCell>
                  <TableCell>{subject.subject_name}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="עריכה">
                        <IconButton size="small" color="primary" onClick={() => openEditDialog(subject)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחיקה">
                        <IconButton size="small" color="error" onClick={() => setDeleteConfirmId(subject.subject_id)}>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingId ? 'עריכת מקצוע' : 'הוספת מקצוע חדש'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="שם המקצוע"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            required
            fullWidth
            autoFocus
            error={Boolean(error)}
            helperText={error}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">ביטול</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingId ? 'עדכן' : 'הוסף'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>מחיקת מקצוע</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק מקצוע זה? פעולה זו אינה הפיכה.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteConfirmId(null)} color="inherit">ביטול</Button>
          <Button variant="contained" color="error" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>
            מחק
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}
