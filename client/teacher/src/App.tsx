import { Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import './App.css'
import TeacherLayout from './components/layout/TeacherLayout'
import RouteGuard from './components/RouteGuard'
import { theme } from './theme'
import LoginPage from './pages/Login'
import DashboardPage from './pages/DashboardPage'
import ExamsPage from './pages/ExamsPage'
import ExamEditorPage from './pages/ExamEditorPage'
import ExamResultsPage from './pages/ExamResultsPage'
import StudentExamDetailsPage from './pages/StudentExamDetailsPage'
import AdminPage from './pages/AdminPage'
import AdminStudentsPage from './pages/AdminStudentsPage'
import AdminTeachersPage from './pages/AdminTeachersPage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<RouteGuard allowedRoles={['teacher', 'admin']} />}>
          <Route element={<TeacherLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/exams/new" element={<ExamEditorPage />} />
            <Route path="/exams/:id" element={<ExamEditorPage />} />
            <Route path="/exams/:id/results" element={<ExamResultsPage />} />
            <Route path="/exams/:id/results/:studentId" element={<StudentExamDetailsPage />} />
          </Route>
        </Route>
        <Route element={<RouteGuard allowedRoles={['admin']} />}>
          <Route element={<TeacherLayout />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/teachers" element={<AdminTeachersPage />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
