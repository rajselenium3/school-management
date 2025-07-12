import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'

import { loginSuccess, logout } from './store/slices/authSlice.js'
import ProtectedRoute from './components/common/ProtectedRoute.js'
import LoginPage from './pages/auth/LoginPage.js'
import RegisterPage from './pages/auth/RegisterPage.js'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.js'
import EmailVerificationPage from './pages/auth/EmailVerificationPage.js'
import AdminDashboard from './pages/dashboard/AdminDashboard.js'
import TeacherDashboard from './pages/dashboard/TeacherDashboard.js'
import StudentDashboard from './pages/dashboard/StudentDashboard.js'
import ParentDashboard from './pages/dashboard/ParentDashboard.js'
import StudentManagement from './pages/admin/StudentManagement.js'
import TeacherManagement from './pages/admin/TeacherManagement.js'
import CourseManagement from './pages/admin/CourseManagement.js'
import AssignmentManagement from './pages/admin/AssignmentManagement.js'
import GradeManagement from './pages/admin/GradeManagement.js'
import AttendanceTracking from './pages/admin/AttendanceTracking.js'
import FinancialManagement from './pages/admin/FinancialManagement.js'
import CommunicationCenter from './pages/admin/CommunicationCenter.js'
import AIInsights from './pages/admin/AIInsights.js'
import Analytics from './pages/admin/Analytics.js'
import Settings from './pages/admin/Settings.js'
import DataManagement from './pages/admin/DataManagement.js'
import TeacherGradebook from './pages/teacher/TeacherGradebook.js'
import TeacherAIAssistant from './pages/teacher/TeacherAIAssistant.js'
import TeacherMessages from './pages/teacher/TeacherMessages.js'
import StudentGrades from './pages/student/StudentGrades.js'
import StudentAssignments from './pages/student/StudentAssignments.js'
import StudentCourses from './pages/student/StudentCourses.js'
import StudentSchedule from './pages/student/StudentSchedule.js'
import StudentAITutor from './pages/student/StudentAITutor.js'
import StudentProgressReport from './pages/student/StudentProgressReport.js'
import ParentPayments from './pages/parent/ParentPayments.js'
import ParentProgressReport from './pages/parent/ParentProgressReport.js'
import ProfilePage from './pages/ProfilePage.js'
import NotFound from './pages/NotFound.js'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading, user, role } = useSelector((state) => state.auth)

  // Debug logging
  console.log('🔍 App.js Auth State:', {
    isAuthenticated,
    loading,
    role,
    userEmail: user?.email,
    pathname: window.location.pathname
  })

  useEffect(() => {
    // Check for existing authentication on app load
    const token = localStorage.getItem('authToken')
    const userRole = localStorage.getItem('userRole')
    const userInfo = localStorage.getItem('userInfo')

    if (token && userRole && userInfo) {
      console.log('🔍 Restoring authentication from localStorage:', { userRole, token: token.substring(0, 20) + '...' })
      try {
        const user = JSON.parse(userInfo)
        dispatch(loginSuccess({
          user,
          role: userRole,
          token
        }))
      } catch (error) {
        console.error('Error parsing stored user info:', error)
        // Clear corrupted data
        localStorage.removeItem('authToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userInfo')
        dispatch(logout())
      }
    }
  }, [dispatch])

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/email-verification"
          element={<EmailVerificationPage />}
        />

        {/* Admin Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/students"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/teachers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <TeacherManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/courses"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CourseManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/assignments"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AssignmentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/grades"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <GradeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/attendance"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AttendanceTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/financial"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <FinancialManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/communication"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CommunicationCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/ai-insights"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AIInsights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/data-management"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DataManagement />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/dashboard/teacher"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/courses"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <CourseManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/assignments"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <AssignmentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/grades"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherGradebook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/students"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/attendance"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <AttendanceTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/ai-assistant"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherAIAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/messages"
          element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherMessages />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/courses"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/assignments"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/grades"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentGrades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <AttendanceTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/schedule"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/ai-tutor"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentAITutor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/messages"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <CommunicationCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/progress-report"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentProgressReport />
            </ProtectedRoute>
          }
        />

        {/* Parent Routes */}
        <Route
          path="/dashboard/parent"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent/children"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent/grades"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <StudentGrades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent/attendance"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <AttendanceTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent/communication"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <CommunicationCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent/payments"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ParentPayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent/progress-report"
          element={
            <ProtectedRoute allowedRoles={['PARENT']}>
              <ParentProgressReport />
            </ProtectedRoute>
          }
        />

        {/* Shared Routes - Multiple roles can access */}
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Redirect legacy routes */}
        <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
        <Route path="/teacher" element={<Navigate to="/dashboard/teacher" replace />} />
        <Route path="/student" element={<Navigate to="/dashboard/student" replace />} />
        <Route path="/parent" element={<Navigate to="/dashboard/parent" replace />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
