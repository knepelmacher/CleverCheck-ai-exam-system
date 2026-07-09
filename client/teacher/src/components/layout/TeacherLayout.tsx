import { useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { Menu as MenuIcon, Dashboard as DashboardIcon, Quiz as QuizIcon, AssignmentTurnedIn as AssignmentTurnedInIcon, Group as GroupIcon, Logout as LogoutIcon } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'

const drawerWidth = 240

const navigationItems = [
  { label: 'לוח מחוונים', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'מבחנים', path: '/exams', icon: <QuizIcon /> },
  { label: 'תוצאות', path: '/exams/1/results', icon: <AssignmentTurnedInIcon /> },
  { label: 'ניהול', path: '/admin', icon: <GroupIcon /> },
]

export default function TeacherLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const currentTitle = useMemo(() => {
    if (location.pathname.includes('/admin')) return 'ניהול מערכת'
    if (location.pathname.includes('/exams/new')) return 'יצירת מבחן'
    if (location.pathname.includes('/results')) return 'תוצאות מבחן'
    if (location.pathname.includes('/exams')) return 'מבחנים'
    return 'לוח מחוונים'
  }, [location.pathname])

  const handleDrawerToggle = () => setMobileOpen((value) => !value)

  const handleLogoutClick = () => setLogoutOpen(true)

  const handleLogoutConfirm = async () => {
    setLogoutOpen(false)
    await signOut()
    navigate('/')
  }

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'background.default' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          CleverCheck
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItemButton key={item.path} component={Link} to={item.path} selected={location.pathname.startsWith(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleLogoutClick}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="התנתקות" />
        </ListItemButton>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {currentTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.first_name} {user?.last_name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        <Toolbar />
        <Outlet />
      </Box>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>התנתקות מהמערכת</DialogTitle>
        <DialogContent>
          <DialogContentText>
            פעולה זו תנתק אותך לחלוטין מהמערכת. יהיה עליך להתחבר מחדש כדי לגשת לחשבונך.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutOpen(false)} color="inherit">ביטול</Button>
          <Button variant="contained" color="error" onClick={handleLogoutConfirm}>
            התנתק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
