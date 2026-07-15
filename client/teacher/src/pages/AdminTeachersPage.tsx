import { useEffect, useMemo, useState } from 'react'
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
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../api/teacher.api'
import type { TeacherDTO } from '../api/teacher.api'
import BackButton from '../components/BackButton'

interface FormData {
  teacher_id: string
  first_name: string
  last_name: string
  email: string
  password: string
  role: string
  is_active: boolean
}

const emptyForm: FormData = {
  teacher_id: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: 'teacher',
  is_active: true,
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherDTO[]>([])
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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.teacher_id || form.teacher_id.length < 5 || !/^\d+$/.test(form.teacher_id))
      newErrors.teacher_id = 'תעודת זהות חייבת להכיל לפחות 5 ספרות'
    if (!form.first_name.trim()) newErrors.first_name = 'שדה חובה'
    if (!form.last_name.trim()) newErrors.last_name = 'שדה חובה'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'דוא"ל לא תקין'
    if (!editingId) {
      if (!form.password) newErrors.password = 'שדה חובה'
      else if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/.test(form.password))
        newErrors.password = 'לפחות 8 תווים — אותיות באנגלית, מספרים וסימנים'
    } else if (form.password && !/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/.test(form.password)) {
      newErrors.password = 'לפחות 8 תווים — אותיות באנגלית, מספרים וסימנים'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const fetchTeachers = async () => {
    try {
      const data = await getTeachers()
      setTeachers(data)
    } catch {
      showSnackbar('שגיאה בטעינת המורים', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const openAddDialog = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (teacher: TeacherDTO) => {
    setEditingId(teacher.id)
    setForm({
      teacher_id: String(teacher.id),
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
      password: '',
      role: teacher.role,
      is_active: teacher.is_active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      const payload = {
        teacher_id: Number(form.teacher_id),
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        role: form.role,
        is_active: form.is_active,
        ...(form.password ? { password: form.password } : {}),
      }

      if (editingId) {
        await updateTeacher(editingId, payload)
        showSnackbar('המורה עודכן בהצלחה', 'success')
      } else {
        await createTeacher(payload)
        showSnackbar('המורה נוסף בהצלחה', 'success')
      }

      setDialogOpen(false)
      fetchTeachers()
    } catch {
      showSnackbar('שגיאה בשמירת המורה', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTeacher(id)
      showSnackbar('המורה נמחק בהצלחה', 'success')
      setDeleteConfirmId(null)
      fetchTeachers()
    } catch {
      showSnackbar('שגיאה במחיקת המורה', 'error')
    }
  }

  const sortedTeachers = useMemo(
    () => [...teachers].sort((a, b) => a.last_name.localeCompare(b.last_name, 'he')),
    [teachers],
  )

  const updateField = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  if (loading) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>ניהול מורים</Typography>
        <Typography color="text.secondary">טוען...</Typography>
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <BackButton to="/admin" />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700}>ניהול מורים</Typography>
          <Typography color="text.secondary">{teachers.length} מורים במערכת</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog} sx={{ gap: 0.5 }}>
          הוסף מורה
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 700 }}>שם משפחה</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>שם פרטי</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ת"ז</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>דוא"ל</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>תפקיד</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>סטטוס</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center', minWidth: 100 }}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  אין מורים להצגה
                </TableCell>
              </TableRow>
            ) : (
              sortedTeachers.map((teacher) => (
                <TableRow key={teacher.id} hover>
                  <TableCell>{teacher.last_name}</TableCell>
                  <TableCell>{teacher.first_name}</TableCell>
                  <TableCell>{teacher.id}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={teacher.role === 'admin' ? 'מנהל' : 'מורה'}
                      color={teacher.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={teacher.is_active ? 'פעיל' : 'לא פעיל'}
                      color={teacher.is_active ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="עריכה">
                        <IconButton size="small" color="primary" onClick={() => openEditDialog(teacher)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="מחיקה">
                        <IconButton size="small" color="error" onClick={() => setDeleteConfirmId(teacher.id)}>
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
          {editingId ? 'עריכת מורה' : 'הוספת מורה חדש'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="תעודת זהות"
              value={form.teacher_id}
              onChange={updateField('teacher_id')}
              disabled={!!editingId}
              required
              fullWidth
              error={Boolean(errors.teacher_id)}
              helperText={errors.teacher_id}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="שם פרטי"
                value={form.first_name}
                onChange={updateField('first_name')}
                required
                fullWidth
                error={Boolean(errors.first_name)}
                helperText={errors.first_name}
              />
              <TextField
                label="שם משפחה"
                value={form.last_name}
                onChange={updateField('last_name')}
                required
                fullWidth
                error={Boolean(errors.last_name)}
                helperText={errors.last_name}
              />
            </Stack>
            <TextField
              label="דוא״ל"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              required
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <TextField
              label={editingId ? 'סיסמה חדשה (השאר ריק כדי לא לשנות)' : 'סיסמה'}
              type="password"
              value={form.password}
              onChange={updateField('password')}
              required={!editingId}
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
            <TextField
              label="תפקיד"
              value={form.role}
              onChange={updateField('role')}
              select
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="teacher">מורה</option>
              <option value="admin">מנהל</option>
            </TextField>
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
        <DialogTitle sx={{ fontWeight: 700 }}>מחיקת מורה</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק מורה זה? פעולה זו אינה הפיכה.</Typography>
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
