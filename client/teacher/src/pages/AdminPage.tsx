import { Box, Grid, Stack, Typography, Card, CardContent } from '@mui/material'
import {
  Groups, School, MenuBook, AdminPanelSettings,
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { keyframes } from '@mui/system'

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const cards = [
  {
    title: 'ניהול תלמידים',
    desc: 'הוסף, ערוך או מחק תלמידים. צפה ברשימת תלמידים ממוינת לפי כיתה ושם.',
    icon: <Groups sx={{ fontSize: 42 }} />,
    color: '#6366f1',
    to: '/admin/students',
    btnLabel: 'לניהול תלמידים',
    stats: 'ניהול מסד נתונים',
  },
  {
    title: 'ניהול מורים',
    desc: 'נהל הרשאות, הוסף מורים חדשים ושמור על נתוני משתמשים מעודכנים.',
    icon: <School sx={{ fontSize: 42 }} />,
    color: '#22c55e',
    to: '/admin/teachers',
    btnLabel: 'לניהול מורים',
    stats: 'הרשאות והגדרות',
  },
  {
    title: 'ניהול מקצועות',
    desc: 'הוסף, ערוך או הסר מקצועות לימוד. ארגן את תוכנית הלימודים.',
    icon: <MenuBook sx={{ fontSize: 42 }} />,
    color: '#f43f5e',
    to: '/admin/subjects',
    btnLabel: 'לניהול מקצועות',
    stats: 'תוכנית לימודים',
  },
  {
    title: 'ניהול כיתות',
    desc: 'הוסף, ערוך או הסר כיתות לימוד. ארגן חלוקה לכיתות.',
    icon: <MenuBook sx={{ fontSize: 42 }} />,
    color: '#f43f5e',
    to: '/admin/classes',
    btnLabel: 'לניהול כיתות',
    stats: 'חלוקה לכיתות',
  },
]

export default function AdminPage() {
  return (
    <Stack spacing={3}>
      <Box sx={{ animation: `${fadeInUp} 0.5s ease-out` }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
          <AdminPanelSettings sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" fontWeight={800} fontSize={{ xs: '1.5rem', md: '1.85rem' }}>
            לוח ניהול
          </Typography>
        </Stack>
        <Typography color="text.secondary" fontSize="0.95rem" sx={{ mr: '44px' }}>
          ניהול תלמידים, מורים ומקצועות לימוד — הכל במקום אחד.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {cards.map((card, i) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Card
              component={Link}
              to={card.to}
              sx={{
                height: '100%',
                textDecoration: 'none',
                animation: `${fadeInUp} 0.5s ease-out ${0.1 + i * 0.1}s both`,
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 4,
                  background: card.color,
                },
              }}
            >
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box
                  sx={{
                    width: 56, height: 56,
                    borderRadius: 3,
                    bgcolor: `${card.color}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color,
                    mb: 2,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h6" fontWeight={700} mb={0.5} color="text.primary">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2} lineHeight={1.7}>
                  {card.desc}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.5, py: 0.5,
                    borderRadius: 999,
                    bgcolor: `${card.color}10`,
                    color: card.color,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                >
                  {card.stats}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
