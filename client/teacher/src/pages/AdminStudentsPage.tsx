import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
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
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Tooltip,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../api/student.api'
import { getClasses } from '../api/class.api'
import type { StudentDTO } from '../api/student.api'
import type { ClassDTO } from '../api/class.api'

interface FormData {
  student_id: string
  first_name: string
  last_name: string
  class_id: string
  password: string
  is_active: boolean
}

const emptyForm: FormData = {
  student_id: '',
  first_name: '',
  last_name: '',
  class_id: '',
  password: '',
  is_active: true,
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentDTO[]>([])
  const [classes, setClasses] = useState<ClassDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const fetchData = async () => {
    try {
      const studentsData = await getStudents()
      setStudents(studentsData)
    } catch (err) {
      console.error('Failed to load students:', err)
      showSnackbar('שגיאה בטעינת התלמידים', 'error')
    }

    try {
      const classesData = await getClasses()
      setClasses(classesData)
    } catch (err) {
      console.error('Failed to load classes:', err)
      showSnackbar('שגיאה בטעינת הכיתות', 'error')
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const getClassName = (classId: number): string => {
    const cls = classes.find((c) => c.id === classId)
    return cls?.className ?? `כיתה ${classId}`
  }

  const openAddDialog = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (student: StudentDTO) => {
    setEditingId(student.id)
    setForm({
      student_id: String(student.id),
      first_name: student.first_name,
      last_name: student.last_name,
      class_id: String(student.class_id),
      password: '',
      is_active: student.is_active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      const payload = {
        student_id: Number(form.student_id),
        first_name: form.first_name,
        last_name: form.last_name,
        class_id: Number(form.class_id),
        is_active: form.is_active,
        ...(form.password ? { password: form.password } : {}),
      }

      if (editingId) {
        await updateStudent(editingId, payload)
        showSnackbar('התלמיד עודכן בהצלחה', 'success')
      } else {
        await createStudent(payload)
        showSnackbar('התלמיד נוסף בהצלחה', 'success')
      }

      setDialogOpen(false)
      fetchData()
    } catch {
      showSnackbar('שגיאה בשמירת התלמיד', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id)
      showSnackbar('התלמיד נמחק בהצלחה', 'success')
      setDeleteConfirmId(null)
      fetchData()
    } catch {
      showSnackbar('שגיאה במחיקת התלמיד', 'error')
    }
  }

  const updateField = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  if (loading) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>ניהול תלמידים</Typography>
        <Typography color="text.secondary">טוען...</Typography>
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700}>ניהול תלמידים</Typography>
          <Typography color="text.secondary">{students.length} תלמידים במערכת</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
          הוסף תלמיד
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 700 }}>ת"ז</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>שם פרטי</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>שם משפחה</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>כיתה</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>סטטוס</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  אין תלמידים להצגה
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.first_name}</TableCell>
                  <TableCell>{student.last_name}</TableCell>
                  <TableCell>
                    <Chip label={getClassName(student.class_id)} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={student.is_active ? 'פעיל' : 'לא פעיל'}
                      color={student.is_active ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="עריכה">
                        <IconButton size="small" color="primary" onClick={() => openEditDialog(student)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחיקה">
                        <IconButton size="small" color="error" onClick={() => setDeleteConfirmId(student.id)}>
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
          {editingId ? 'עריכת תלמיד' : 'הוספת תלמיד חדש'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="תעודת זהות"
              value={form.student_id}
              onChange={updateField('student_id')}
              disabled={!!editingId}
              required
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="שם פרטי"
                value={form.first_name}
                onChange={updateField('first_name')}
                required
                fullWidth
              />
              <TextField
                label="שם משפחה"
                value={form.last_name}
                onChange={updateField('last_name')}
                required
                fullWidth
              />
            </Stack>
            <TextField
              label="כיתה"
              value={form.class_id}
              onChange={updateField('class_id')}
              select
              required
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="">בחר כיתה</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </TextField>
            <TextField
              label={editingId ? 'סיסמה חדשה (השאר ריק כדי לא לשנות)' : 'סיסמה'}
              type="password"
              value={form.password}
              onChange={updateField('password')}
              required={!editingId}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.is_active}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                />
              }
              label="משתמש פעיל"
            />
          </Stack>
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
        <DialogTitle sx={{ fontWeight: 700 }}>מחיקת תלמיד</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק תלמיד זה? פעולה זו אינה הפיכה.</Typography>
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
