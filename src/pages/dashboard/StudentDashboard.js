import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  School as SchoolIcon,
  Grade as GradeIcon,
  Assignment as AssignmentIcon,
  EventNote as AttendanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Analytics as AnalyticsIcon,
  MenuBook as CourseIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  SmartToy as AIIcon,
  Chat as ChatIcon,
  Help as HelpIcon,
  AccessTime as TimeIcon,
  Room as RoomIcon,
} from '@mui/icons-material'

import DashboardLayout from '../../components/layout/DashboardLayout.js'
import studentService from '../../services/studentService.js'
import gradeService from '../../services/gradeService.js'

const StudentDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dashboardData, setDashboardData] = useState({})
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([])
  const [analytics, setAnalytics] = useState({})

  const { user } = useSelector((state) => state.auth)
  const tabs = ['Overview', 'My Courses', 'My Grades', 'Performance Analytics']

  // Mock student ID - in real app, get from auth context
  const currentStudentId = user?.email ? 'STU001' : 'STU001'

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Simulate loading with class-based access control
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Get student's class assignment and enrolled subjects
      const studentClassInfo = {
        studentId: currentStudentId,
        name: user?.firstName + ' ' + user?.lastName || 'Emma Thompson',
        grade: '10',
        section: 'A',
        rollNumber: 15,
        classTeacher: 'Mrs. Johnson',
        // Only show teachers and subjects assigned to this student's class
        enrolledSubjects: [
          {
            id: 'MATH10A',
            name: 'Mathematics',
            teacher: 'Prof. Sarah Johnson',
            teacherId: 'sarah.johnson@school.edu',
            classCode: '10A',
            currentGrade: 'A-',
            progress: 89,
            nextClass: 'Monday 09:00 AM',
            room: 'Room 101'
          },
          {
            id: 'PHYS10A',
            name: 'Physics',
            teacher: 'Dr. Mike Wilson',
            teacherId: 'mike.wilson@school.edu',
            classCode: '10A',
            currentGrade: 'B+',
            progress: 84,
            nextClass: 'Tuesday 10:00 AM',
            room: 'Lab 301'
          },
          {
            id: 'ENG10A',
            name: 'English Literature',
            teacher: 'Prof. Emily Davis',
            teacherId: 'emily.davis@school.edu',
            classCode: '10A',
            currentGrade: 'A',
            progress: 92,
            nextClass: 'Wednesday 11:00 AM',
            room: 'Room 205'
          },
          {
            id: 'CHEM10A',
            name: 'Chemistry',
            teacher: 'Dr. Robert Brown',
            teacherId: 'robert.brown@school.edu',
            classCode: '10A',
            currentGrade: 'B',
            progress: 81,
            nextClass: 'Thursday 02:00 PM',
            room: 'Lab 201'
          },
          {
            id: 'HIST10A',
            name: 'History',
            teacher: 'Dr. Lisa Smith',
            teacherId: 'lisa.smith@school.edu',
            classCode: '10A',
            currentGrade: 'B+',
            progress: 85,
            nextClass: 'Friday 09:00 AM',
            room: 'Room 105'
          }
        ],
        classmates: [
          { id: 'STU002', name: 'John Smith', rollNo: 16 },
          { id: 'STU003', name: 'Sarah Wilson', rollNo: 17 },
          { id: 'STU004', name: 'Michael Chen', rollNo: 18 },
          // ... other students in the same class
        ]
      }

      // Calculate overall stats from enrolled subjects only
      const totalSubjects = studentClassInfo.enrolledSubjects.length
      const averageProgress = studentClassInfo.enrolledSubjects.reduce(
        (sum, subject) => sum + subject.progress, 0
      ) / totalSubjects

      // Mock dashboard data based on class enrollment
      const mockDashboard = {
        studentInfo: studentClassInfo,
        currentGPA: 3.7,
        totalCredits: 45,
        upcomingAssignments: 5,
        overallProgress: Math.round(averageProgress),
        recentGrades: [
          { subject: 'Mathematics', grade: 'A-', date: '2025-01-10', teacher: 'Prof. Sarah Johnson' },
          { subject: 'Physics', grade: 'B+', date: '2025-01-09', teacher: 'Dr. Mike Wilson' },
          { subject: 'English Literature', grade: 'A', date: '2025-01-08', teacher: 'Prof. Emily Davis' }
        ],
        courses: studentClassInfo.enrolledSubjects.map(subject => ({
          id: subject.id,
          name: subject.name,
          teacher: subject.teacher,
          teacherId: subject.teacherId,
          grade: subject.currentGrade,
          progress: subject.progress,
          nextClass: subject.nextClass,
          room: subject.room,
          classCode: subject.classCode
        })),
        // Only show assignments from assigned teachers
        upcomingDeadlines: [
          {
            id: 1,
            title: 'Math Quiz 4',
            courseName: 'Mathematics',
            courseId: 'MATH10A',
            teacher: 'Prof. Sarah Johnson',
            dueDate: '2025-01-15',
            priority: 'high'
          },
          {
            id: 2,
            title: 'Physics Lab Report',
            courseName: 'Physics',
            courseId: 'PHYS10A',
            teacher: 'Dr. Mike Wilson',
            dueDate: '2025-01-17',
            priority: 'medium'
          },
          {
            id: 3,
            title: 'English Essay: Shakespeare',
            courseName: 'English Literature',
            courseId: 'ENG10A',
            teacher: 'Prof. Emily Davis',
            dueDate: '2025-01-20',
            priority: 'normal'
          }
        ]
      }

      const mockDeadlines = [
        { assignment: 'Math Quiz 4', course: 'Mathematics', dueDate: 'Tomorrow', priority: 'high' },
        { assignment: 'Science Lab Report', course: 'Physics', dueDate: 'Friday', priority: 'medium' },
        { assignment: 'Essay: Shakespeare Analysis', course: 'English', dueDate: 'Next Week', priority: 'low' }
      ]

      const mockAnalytics = {
        performanceTrend: 'good',
        subjectStrengths: ['Mathematics', 'English'],
        areasForImprovement: ['Chemistry'],
        studyTimeRecommendation: '2.5 hours/day',
        nextGoals: ['Improve Chemistry grade to B+', 'Maintain A- in Math']
      }

      setDashboardData(mockDashboard)
      setUpcomingDeadlines(mockDeadlines)
      setAnalytics(mockAnalytics)
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data: ' + error.message)
      setLoading(false)
    }
  }

  const getPerformanceTrendColor = (trend) => {
    switch (trend) {
      case 'excellent': return '#4caf50'
      case 'good': return '#8bc34a'
      case 'average': return '#ff9800'
      case 'needs_improvement': return '#f44336'
      default: return '#757575'
    }
  }

  const getPerformanceTrendIcon = (trend) => {
    switch (trend) {
      case 'excellent':
      case 'good':
        return <TrendingUpIcon />
      case 'needs_improvement':
        return <TrendingDownIcon />
      default:
        return <AnalyticsIcon />
    }
  }

  const renderStatsCards = () => {
    const stats = dashboardData.statistics || {}

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          {
            title: 'Current GPA',
            value: stats.currentGPA?.toFixed(2) || '0.00',
            icon: GradeIcon,
            color: '#2196f3',
            subtitle: 'Cumulative'
          },
          {
            title: 'Courses Enrolled',
            value: stats.totalCourses || 0,
            icon: CourseIcon,
            color: '#4caf50',
            subtitle: 'This semester'
          },
          {
            title: 'Attendance Rate',
            value: `${(stats.attendanceRate || 0).toFixed(1)}%`,
            icon: AttendanceIcon,
            color: '#ff9800',
            subtitle: 'Overall'
          },
          {
            title: 'Average Grade',
            value: `${(stats.averageGrade || 0).toFixed(1)}%`,
            icon: StarIcon,
            color: '#9c27b0',
            subtitle: 'This semester'
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card sx={{
              background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}20`, color: stat.color }}>
                    <stat.icon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  const renderOverview = () => (
    <Box>
      {/* Welcome Section */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', width: 60, height: 60 }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Welcome back, {dashboardData.student?.user?.firstName || 'Student'}!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {dashboardData.student?.grade} - {dashboardData.student?.section} |
                ID: {dashboardData.student?.studentId}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Keep up the great work! 📚
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Performance Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsIcon />
                Performance Summary
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="primary">
                      {dashboardData.statistics?.completedAssignments || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Assignments
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" color="warning.main">
                      {dashboardData.statistics?.pendingAssignments || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Assignments
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Performance Trend:
                  <Chip
                    label={dashboardData.statistics?.performanceTrend?.replace('_', ' ') || 'Stable'}
                    size="small"
                    icon={getPerformanceTrendIcon(dashboardData.statistics?.performanceTrend)}
                    sx={{
                      ml: 1,
                      bgcolor: `${getPerformanceTrendColor(dashboardData.statistics?.performanceTrend)}20`,
                      color: getPerformanceTrendColor(dashboardData.statistics?.performanceTrend)
                    }}
                  />
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon />
                Upcoming Deadlines
              </Typography>

              {upcomingDeadlines.length > 0 ? (
                <List dense>
                  {upcomingDeadlines.slice(0, 3).map((assignment, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <AssignmentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={assignment.title}
                        secondary={`${assignment.courseName} • Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No upcoming deadlines
                </Typography>
              )}

              <Button variant="text" fullWidth size="small" sx={{ mt: 1 }}>
                View All Assignments
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )

  const renderCourses = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CourseIcon />
        My Courses
      </Typography>

      <Grid container spacing={3}>
        {(dashboardData.courses || []).map((course, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#1976d2' }}>
                    <CourseIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {course.courseName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {course.courseCode}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Teacher:</strong> {course.teacher?.firstName} {course.teacher?.lastName}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Schedule:</strong> {course.schedule || 'TBD'}
                </Typography>

                <Chip
                  label={course.status || 'ACTIVE'}
                  size="small"
                  color={course.status === 'ACTIVE' ? 'success' : 'default'}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )

  const renderGrades = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <GradeIcon />
        My Grades
      </Typography>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assignment</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Score</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Letter Grade</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(dashboardData.grades || []).slice(0, 10).map((grade, index) => (
                  <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {grade.assignment?.title || 'Assignment'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {grade.course?.courseName || 'Course'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {grade.score || 0}/{grade.maxScore || 100}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(grade.percentage || 0).toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={grade.letterGrade || 'N/A'}
                        size="small"
                        sx={{
                          backgroundColor: `${gradeService.getLetterGradeColor(grade.letterGrade)}20`,
                          color: gradeService.getLetterGradeColor(grade.letterGrade),
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={grade.status || 'PENDING'}
                        size="small"
                        color={grade.status === 'PUBLISHED' ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )

  const renderAnalytics = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AnalyticsIcon />
        Performance Analytics
      </Typography>

      {analytics && Object.keys(analytics).length > 0 ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Academic Performance</Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Average Score: {analytics.averageScore?.toFixed(1) || 'N/A'}</Typography>
                  <Typography variant="body2">Average Percentage: {analytics.averagePercentage?.toFixed(1) || 'N/A'}%</Typography>
                  <Typography variant="body2">Total Grades: {analytics.totalGrades || 0}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Grade Distribution</Typography>
                <Box sx={{ mt: 2 }}>
                  {analytics.letterGradeDistribution && Object.entries(analytics.letterGradeDistribution).map(([grade, count]) => (
                    <Box key={grade} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{grade}:</Typography>
                      <Typography variant="body2">{count}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <AnalyticsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Performance analytics will be available once you have more grades
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )

  const renderTabContent = () => {
    switch (currentTab) {
      case 0: return renderOverview()
      case 1: return renderCourses()
      case 2: return renderGrades()
      case 3: return renderAnalytics()
      default: return renderOverview()
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Student Dashboard">
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading your dashboard...
          </Typography>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Student Dashboard">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
            🎓 Student Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track your academic progress and stay on top of your studies
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        {renderStatsCards()}

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}
      </Box>
    </DashboardLayout>
  )
}

export default StudentDashboard
