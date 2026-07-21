import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, CircularProgress } from '@mui/material'

interface RouteGuardProps {
  allowedRoles?: Array<'teacher' | 'admin'>
}

export default function RouteGuard({ allowedRoles = ['teacher', 'admin'] }: RouteGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !(allowedRoles as string[]).includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
