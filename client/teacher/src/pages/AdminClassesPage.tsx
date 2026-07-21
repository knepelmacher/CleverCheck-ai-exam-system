import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  Card,
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { keyframes } from '@mui/system'
import { getClasses, createClass, updateClass, deleteClass } from '../api/class.api'
import BackButton from '../components/BackButton'

interface ClassItem {
  id: number
  className: string
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([])
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

  const fetchClasses = async () => {
    try {
      const data = await getClasses()
      // API returns { id, className } — map to our local type
      setClasses(data as unknown as ClassItem[])
    } catch {
      showSnackbar('שגיאה בטעינת הכיתות', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
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

  const openEditDialog = (item: ClassItem) => {
    setEditingId(item.id)
    setName(item.className)
    setError('')
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('שם כיתה הוא שדה חובה')
      return
    }

    try {
      if (editingId) {
        await updateClass(editingId, name.trim())
        showSnackbar('הכיתה עודכנה בהצלחה', 'success')
      } else {
        await createClass(name.trim())
        showSnackbar('הכיתה נוספה בהצלחה', 'success')
      }
      setDialogOpen(false)
      fetchClasses()
    } catch {
      showSnackbar('שגיאה בשמירת הכיתה', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteClass(id)
      showSnackbar('הכיתה נמחקה בהצלחה', 'success')
      setDeleteConfirmId(null)
      fetchClasses()
    } catch {
      showSnackbar('שגיאה במחיקת הכיתה', 'error')
    }
  }

  if (loading) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>ניהול כיתות</Typography>
        <Typography color="text.secondary">טוען...</Typography>
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <BackButton to="/admin" />

      <Box sx={{ animation: `${fadeIn} 0.5s ease-out` }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={800} fontSize={{ xs: '1.5rem', md: '1.85rem' }}>
              ניהול כיתות
            </Typography>
            <Typography color="text.secondary" fontSize="0.95rem">
              {classes.length} כיתות במערכת
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog} sx={{ gap: 0.5 }}>
            הוסף כיתה
          </Button>
        </Box>
      </Box>

      <Card sx={{ animation: `${fadeIn} 0.5s ease-out 0.1s both` }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>מזהה</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>שם הכיתה</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.main', textAlign: 'center', minWidth: 100 }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    <Stack spacing={1} alignItems="center">
                      <Typography color="text.secondary">אין כיתות להצגה</Typography>
                      <Button variant="outlined" startIcon={<AddIcon />} size="small" onClick={openAddDialog}>
                        הוסף כיתה ראשונה
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography fontWeight={600} fontSize="0.9rem">{item.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600} fontSize="0.95rem">{item.className}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="עריכה">
                          <IconButton size="small" color="primary" onClick={() => openEditDialog(item)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="מחיקה">
                          <IconButton size="small" color="error" onClick={() => setDeleteConfirmId(item.id)}>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingId ? 'עריכת כיתה' : 'הוספת כיתה חדשה'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="שם הכיתה"
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
        <DialogTitle sx={{ fontWeight: 700 }}>מחיקת כיתה</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק כיתה זו? פעולה זו אינה הפיכה.</Typography>
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
