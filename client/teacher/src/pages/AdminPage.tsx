import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function AdminPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700}>לוח ניהול</Typography>
        <Typography color="text.secondary">ניהול תלמידים ומורים מהירה ונוחה.</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>ניהול תלמידים</Typography>
              <Typography color="text.secondary" mb={2}>הוסף, ערוך או מחק תלמידים.</Typography>
              <Button component={Link} to="/admin/students" variant="contained">לניהול תלמידים</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>ניהול מורים</Typography>
              <Typography color="text.secondary" mb={2}>שמור על הרשאות ונתוני משתמשים.</Typography>
              <Button component={Link} to="/admin/teachers" variant="contained">לניהול מורים</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}
