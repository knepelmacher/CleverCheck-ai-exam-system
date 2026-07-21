import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar, Avatar, Box, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider, Drawer,
  IconButton, List, ListItemButton, ListItemIcon, ListItemText,
  Menu, MenuItem, Toolbar, Typography,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  Group as GroupIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'

const SIDEBAR_WIDTH = 260

const navItems = [
  { label: 'לוח בקרה', path: '/dashboard', icon: <DashboardIcon /> },
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

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo area */}
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Box
          component={Link}
          to="/dashboard"
          sx={{ display: 'block', textDecoration: 'none' }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="Gradex"
            sx={{ width: '100%', maxWidth: 180, height: 'auto', mb: 1 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          הבודק החכם למבחנים
        </Typography>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation */}
      <List sx={{ px: 1.5, pt: 1.5, flex: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path) && item.path !== '/dashboard'
            ? location.pathname.startsWith(item.path)
            : location.pathname === item.path
          const isDashboard = item.label === 'לוח בקרה' && location.pathname === '/dashboard'
          const isActive = item.label === 'לוח בקרה' ? isDashboard : active

          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              selected={isActive}
              sx={{
                borderRadius: 3,
                mb: 0.5,
                py: 1.2,
                '&.Mui-selected': {
                  bgcolor: 'rgba(255, 122, 0, 0.10)',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(255, 122, 0, 0.14)' },
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 122, 0, 0.06)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.95rem' }} />
            </ListItemButton>
          )
        })}
      </List>

      {/* Bottom user area */}
      <Divider sx={{ mx: 2 }} />
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700, width: 38, height: 38, fontSize: '0.85rem' }}>
          {initials}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={600} fontSize="0.9rem" noWrap>
            {user?.first_name} {user?.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
            {user?.role === 'admin' ? 'מנהל' : 'מורה'}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setLogoutOpen(true)} sx={{ color: 'text.secondary' }}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: 'none' },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.92)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src="/logo.png"
            alt="Gradex"
            sx={{ width: 120, height: 'auto' }}
          />
          <Avatar
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{ bgcolor: 'primary.main', cursor: 'pointer', fontWeight: 700, width: 36, height: 36, fontSize: '0.8rem' }}
          >
            {initials}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Desktop sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: SIDEBAR_WIDTH },
          flexShrink: { md: 0 },
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Drawer
          variant="permanent"
          anchor="right"
          open
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              borderLeft: '1px solid rgba(255, 122, 0, 0.10)',
              bgcolor: 'white',
              boxShadow: '4px 0 24px rgba(0,0,0,0.03)',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { md: 'none' } }}
      >
        <Box sx={{ width: SIDEBAR_WIDTH }}>
          {sidebarContent}
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, md: 3 },
          pt: { xs: '72px', md: 3 },
          bgcolor: '#fef9f4',
          minHeight: '100vh',
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        }}
      >
        <Outlet />
      </Box>

      {/* User menu popover */}
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

      {/* Logout dialog */}
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
