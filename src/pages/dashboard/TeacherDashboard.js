import {
  SmartToy as AIIcon,
  Analytics as AnalyticsIcon,
  Assignment as AssignmentIcon,
  EventNote as AttendanceIcon,
  CheckCircle as CheckIcon,
  MenuBook as CourseIcon,
  Grade as GradeIcon,
  Message as MessageIcon,
  Notifications as NotificationIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Star as StarIcon,
  People as StudentsIcon,
  School as TeacherIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import teacherService from '../../services/teacherService.js';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    assignments: [],
    students: [],
    statistics: {
      totalStudents: 0,
      totalClasses: 0,
      avgAttendance: 0,
      pendingGrades: 0,
    },
    recentActivities: [],
    upcomingClasses: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔄 Loading teacher dashboard data for:', user.email);

      const data = await teacherService.getTeacherDashboard(user.email);
      setDashboardData(data);

      console.log('✅ Teacher dashboard loaded successfully:', {
        classes: data.assignments.length,
        students: data.students.length,
        statistics: data.statistics,
      });
    } catch (error) {
      console.error('❌ Error loading teacher dashboard:', error);
      if (
        error.message.includes('Network Error') ||
        error.message.includes('ERR_CONNECTION_REFUSED')
      ) {
        setError(
          'Backend server is currently unavailable. Displaying sample data for demonstration purposes.'
        );
      } else {
        setError(`Failed to load dashboard data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderQuickStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#1976d2',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <StudentsIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              {dashboardData.statistics.totalStudents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Students
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#4caf50',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <CourseIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#4caf50' }}
            >
              {dashboardData.statistics.totalClasses}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assigned Classes
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#ff9800',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <AttendanceIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#ff9800' }}
            >
              {dashboardData.statistics.avgAttendance}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Attendance
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#f44336',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <GradeIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#f44336' }}
            >
              {dashboardData.statistics.pendingGrades}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Grades
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAssignedClasses = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <CourseIcon />
          My Assigned Classes ({dashboardData.assignments.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Classes assigned to you by the administration. Students are
          automatically displayed based on these assignments.
        </Typography>
        <Grid container spacing={2}>
          {dashboardData.assignments.map((assignment, index) => (
            <Grid item xs={12} sm={6} md={4} key={assignment.id || index}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {assignment.className}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {assignment.grade} - Section {assignment.section}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Subject: {assignment.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Room: {assignment.room}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1,
                  }}
                >
                  <Chip
                    size="small"
                    label={`${assignment.studentCount} Students`}
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {assignment.schedule}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderAssignedStudents = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <StudentsIcon />
          My Students ({dashboardData.students.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Students automatically assigned to your classes. No manual enrollment
          needed.
        </Typography>
        {dashboardData.students.length === 0 ? (
          <Typography color="text.secondary">
            No students currently assigned to your classes.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {dashboardData.students.slice(0, 8).map((student, index) => (
              <Grid item xs={12} sm={6} md={3} key={student.id || index}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.04)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {`${student.user?.firstName || ''} ${
                      student.user?.lastName || ''
                    }`.trim()}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    ID: {student.studentId}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Class: {student.className}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 1,
                    }}
                  >
                    <Chip
                      size="small"
                      label={student.overallGrade || 'N/A'}
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {student.attendance || 0}% Attendance
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
            {dashboardData.students.length > 8 && (
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', mt: 2 }}
                >
                  And {dashboardData.students.length - 8} more students...
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </CardContent>
    </Card>
  );

  const renderRecentActivities = () => (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <NotificationIcon />
          Recent Activities
        </Typography>
        <List>
          {dashboardData.recentActivities.map((activity, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon>
                {activity.type === 'assignment' && (
                  <AssignmentIcon color="primary" />
                )}
                {activity.type === 'attendance' && (
                  <AttendanceIcon color="success" />
                )}
                {activity.type === 'grade' && <GradeIcon color="warning" />}
              </ListItemIcon>
              <ListItemText
                primary={activity.text}
                secondary={`${activity.time} • ${activity.class}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderQuickActions = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GradeIcon />}
              onClick={() => navigate('/teacher/gradebook')}
              sx={{ mb: 1 }}
            >
              Grade Book
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AttendanceIcon />}
              onClick={() => navigate('/admin/attendance')}
              sx={{ mb: 1 }}
            >
              Take Attendance
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AssignmentIcon />}
              onClick={() => navigate('/admin/assignments')}
              sx={{ mb: 1 }}
            >
              Assignments
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AIIcon />}
              onClick={() => navigate('/teacher/ai-assistant')}
              sx={{ mb: 1 }}
            >
              AI Assistant
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout title="Teacher Dashboard">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading Teacher Dashboard...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Teacher Dashboard">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            🎓 Teacher Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {user?.firstName || 'Teacher'}! Manage your classes
            and students.
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Quick Stats */}
        {renderQuickStats()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Assigned Classes */}
            {renderAssignedClasses()}
          </Grid>
          <Grid item xs={12}>
            {/* Assigned Students */}
            {renderAssignedStudents()}
          </Grid>
          <Grid item xs={12}>
            {/* Recent Activities */}
            {renderRecentActivities()}
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
