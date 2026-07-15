import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar, Avatar, Box, Button, CssBaseline, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider, Drawer,
  IconButton, List, ListItemButton, ListItemIcon, ListItemText,
  Menu, MenuItem, Toolbar, Typography,
} from '@mui/material'
import { Menu as MenuIcon, Dashboard as DashboardIcon, Quiz as QuizIcon, Group as GroupIcon, Logout as LogoutIcon } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'לוח מחוונים', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'מבחנים', path: '/exams', icon: <QuizIcon /> },
  { label: 'ניהול', path: '/admin', icon: <GroupIcon /> },
]

export default function TeacherLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`

  const handleLogout = async () => {
    setMenuAnchor(null)
    setLogoutOpen(false)
    await signOut()
    navigate('/login')
  }

  const toolbar = (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      {/* Right: logo + hamburger */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          component={Link}
          to="/dashboard"
          variant="h6"
          sx={{ fontWeight: 800, color: 'primary.main', textDecoration: 'none', letterSpacing: 1, fontSize: '1.4rem' }}
        >
          Gradex
        </Typography>
        <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Center: desktop nav */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path)
          return (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                color: active ? 'primary.main' : 'text.secondary',
                fontWeight: active ? 700 : 400,
                gap: 0.5,
                '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
              }}
            >
              {item.label}
            </Button>
          )
        })}
      </Box>

      {/* Left: avatar with menu */}
      <Box>
        <Avatar
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ bgcolor: 'primary.main', cursor: 'pointer', fontWeight: 700, width: 40, height: 40, fontSize: '0.9rem' }}
        >
          {initials}
        </Avatar>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { mt: 1, borderRadius: 2, minWidth: 180 } } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography fontWeight={700}>{user?.first_name} {user?.last_name}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.role === 'admin' ? 'מנהל' : 'מורה'}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setMenuAnchor(null); setLogoutOpen(true) }}>
            <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
            התנתקות
          </MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', maxWidth: '100%', bgcolor: 'grey.50' }}>
      <CssBaseline />
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>{toolbar}</AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', px: 2, mb: 0.5 }}>Gradex</Typography>
          <Typography variant="body2" sx={{ px: 2, mb: 2, color: 'text.secondary' }}>{user?.first_name} {user?.last_name}</Typography>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.path} component={Link} to={item.path} selected={location.pathname.startsWith(item.path)} onClick={() => setMobileOpen(false)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={() => { setMobileOpen(false); setLogoutOpen(true) }}>
              <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
              <ListItemText primary="התנתקות" sx={{ color: 'error.main' }} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>התנתקות מהמערכת</DialogTitle>
        <DialogContent>
          <DialogContentText>פעולה זו תנתק אותך לחלוטין מהמערכת. יהיה עליך להתחבר מחדש כדי לגשת לחשבונך.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutOpen(false)} color="inherit">ביטול</Button>
          <Button variant="contained" color="error" onClick={handleLogout}>התנתק</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
