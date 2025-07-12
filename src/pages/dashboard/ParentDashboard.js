import {
  Assignment as AssignmentIcon,
  EventNote as AttendanceIcon,
  CheckCircle as CheckIcon,
  People as ChildrenIcon,
  Grade as GradeIcon,
  Message as MessageIcon,
  Notifications as NotificationIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Star as StarIcon,
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
  Grid,
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

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading parent dashboard data for:', user.email);

      // Get children for this parent
      const response = await fetch(
        `/api/parents/${encodeURIComponent(user.email)}/children`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch children: ${response.statusText}`);
      }

      const children = await response.json();
      console.log('👶 Children data loaded:', children);

      if (children.length === 0) {
        setDashboardData({
          children: [],
          stats: {
            totalChildren: 0,
            avgGrade: 'N/A',
            totalUpcomingAssignments: 0,
            pendingPayments: 0,
          },
          recentActivity: [],
          upcomingEvents: [],
        });
        setLoading(false);
        return;
      }

      // Process children data and calculate statistics
      const processedChildren = [];
      let totalUpcomingAssignments = 0;
      let pendingPayments = 0;
      const recentActivity = [];

      for (const child of children) {
        try {
          // Get child's grade and attendance data
          const gradeResponse = await fetch(
            `/api/grades/student/${child.studentId}`
          );
          const grades = gradeResponse.ok ? await gradeResponse.json() : [];

          const attendanceResponse = await fetch(
            `/api/attendance/student/${child.studentId}`
          );
          const attendance = attendanceResponse.ok
            ? await attendanceResponse.json()
            : [];

          const assignmentResponse = await fetch(
            `/api/assignments/student/${child.studentId}`
          );
          const assignments = assignmentResponse.ok
            ? await assignmentResponse.json()
            : [];

          // Calculate average grade
          const avgGrade =
            grades.length > 0
              ? (
                  grades.reduce((sum, g) => sum + (g.marks || 0), 0) /
                  grades.length
                ).toFixed(1)
              : 'N/A';

          // Calculate attendance percentage
          const attendancePercentage =
            attendance.length > 0
              ? Math.round(
                  (attendance.filter((a) => a.status === 'PRESENT').length /
                    attendance.length) *
                    100
                )
              : 0;

          // Count upcoming assignments
          const upcomingAssignments = assignments.filter(
            (a) => a.dueDate && new Date(a.dueDate) > new Date()
          ).length;
          totalUpcomingAssignments += upcomingAssignments;

          // Get recent grades for activity
          const recentGrades = grades
            .sort(
              (a, b) =>
                new Date(b.submissionDate || b.createdAt) -
                new Date(a.submissionDate || a.createdAt)
            )
            .slice(0, 3);

          processedChildren.push({
            ...child,
            name: `${child.user?.firstName || ''} ${
              child.user?.lastName || ''
            }`.trim(),
            grade: `${child.grade} Grade`,
            overallGrade: avgGrade,
            attendance: attendancePercentage,
            upcomingAssignments,
            recentGrades: recentGrades.map((g) => ({
              subject: g.course?.courseName || g.subject || 'Unknown',
              grade: g.letterGrade || `${g.marks}%`,
              date: g.submissionDate || g.createdAt,
            })),
          });

          // Add to recent activity
          recentGrades.forEach((grade) => {
            recentActivity.push({
              type: 'grade',
              text: `${child.user?.firstName} received ${
                grade.letterGrade || grade.marks + '%'
              } in ${grade.course?.courseName || 'a subject'}`,
              time: getTimeAgo(grade.submissionDate || grade.createdAt),
            });
          });
        } catch (error) {
          console.warn(
            `Could not load complete data for child ${child.studentId}:`,
            error
          );
          processedChildren.push({
            ...child,
            name: `${child.user?.firstName || ''} ${
              child.user?.lastName || ''
            }`.trim(),
            grade: `${child.grade} Grade`,
            overallGrade: 'N/A',
            attendance: 0,
            upcomingAssignments: 0,
            recentGrades: [],
          });
        }
      }

      // Try to get pending payments
      try {
        const paymentsResponse = await fetch(
          `/api/payments/search?status=PENDING`
        );
        const allPendingPayments = paymentsResponse.ok
          ? await paymentsResponse.json()
          : [];

        // Filter payments for this parent's children
        const childrenIds = children.map((c) => c.studentId);
        pendingPayments = allPendingPayments.filter((p) =>
          childrenIds.includes(p.student?.studentId)
        ).length;
      } catch (error) {
        console.warn('Could not load pending payments:', error);
      }

      setDashboardData({
        children: processedChildren,
        stats: {
          totalChildren: children.length,
          avgGrade:
            processedChildren.length > 0
              ? (
                  processedChildren.reduce(
                    (sum, c) => sum + (Number.parseFloat(c.overallGrade) || 0),
                    0
                  ) / processedChildren.length
                ).toFixed(1)
              : 'N/A',
          totalUpcomingAssignments,
          pendingPayments,
        },
        recentActivity: recentActivity.slice(0, 10),
        upcomingEvents: [
          {
            event: 'Parent-Teacher Conference',
            date: 'Contact school for schedule',
            type: 'meeting',
          },
        ],
      });

      console.log('✅ Parent dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading parent dashboard data:', error);
      setDashboardData({
        children: [],
        stats: {
          totalChildren: 0,
          avgGrade: 'N/A',
          totalUpcomingAssignments: 0,
          pendingPayments: 0,
        },
        recentActivity: [],
        upcomingEvents: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Recently';
  };

  const quickActions = [
    {
      title: 'My Children',
      description: "View your children's information and progress",
      icon: ChildrenIcon,
      color: '#1976d2',
      path: '/dashboard/parent/children',
    },
    {
      title: 'Grades & Progress',
      description: 'Monitor academic performance',
      icon: GradeIcon,
      color: '#4caf50',
      path: '/dashboard/parent/grades',
    },
    {
      title: 'Payments',
      description: 'Manage school fees and payments',
      icon: PaymentIcon,
      color: '#ff9800',
      path: '/dashboard/parent/payments',
    },
    {
      title: 'Communication',
      description: 'Messages from teachers and school',
      icon: MessageIcon,
      color: '#9c27b0',
      path: '/dashboard/parent/communication',
    },
    {
      title: 'Attendance',
      description: 'View attendance records',
      icon: AttendanceIcon,
      color: '#f44336',
      path: '/dashboard/parent/attendance',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            👨‍👩‍👧‍👦 Parent Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {user?.firstName || 'Parent'}! Stay connected with
            your child's education and progress.
          </Typography>
        </Box>

        {/* Quick Stats */}
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
                  <ChildrenIcon />
                </Avatar>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', color: '#1976d2' }}
                >
                  {dashboardData.stats?.totalChildren}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Children
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
                  <GradeIcon />
                </Avatar>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', color: '#4caf50' }}
                >
                  {dashboardData.stats?.avgGrade}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Grade
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
                  <AssignmentIcon />
                </Avatar>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', color: '#ff9800' }}
                >
                  {dashboardData.stats?.totalUpcomingAssignments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upcoming Assignments
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
                  <PaymentIcon />
                </Avatar>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', color: '#f44336' }}
                >
                  {dashboardData.stats?.pendingPayments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Payments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <StarIcon />
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={index}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: action.color,
                          mx: 'auto',
                          mb: 2,
                          width: 56,
                          height: 56,
                        }}
                      >
                        <action.icon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', mb: 1, fontSize: '1rem' }}
                      >
                        {action.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: '0.8rem' }}
                      >
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Children Overview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <ChildrenIcon />
                  My Children
                </Typography>
                {dashboardData.children?.map((child, index) => (
                  <Paper
                    key={index}
                    sx={{ p: 2, mb: 2, bgcolor: 'rgba(25, 118, 210, 0.04)' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {child.name}
                      </Typography>
                      <Chip label={child.overallGrade} color="success" />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {child.grade}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Typography variant="caption">
                        Attendance: {child.attendance}%
                      </Typography>
                      <Typography variant="caption">
                        Upcoming: {child.upcomingAssignments} assignments
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Recent Grades:
                    </Typography>
                    {child.recentGrades.map((grade, idx) => (
                      <Chip
                        key={idx}
                        label={`${grade.subject}: ${grade.grade}`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Paper>
                ))}
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/dashboard/parent/children')}
                >
                  View Detailed Information
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <NotificationIcon />
                  Recent Activity
                </Typography>
                <List>
                  {dashboardData.recentActivity?.map((activity, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor:
                              activity.type === 'grade'
                                ? '#4caf50'
                                : activity.type === 'assignment'
                                ? '#2196f3'
                                : '#ff9800',
                            width: 32,
                            height: 32,
                          }}
                        >
                          {activity.type === 'grade' ? (
                            <GradeIcon fontSize="small" />
                          ) : activity.type === 'assignment' ? (
                            <AssignmentIcon fontSize="small" />
                          ) : (
                            <AttendanceIcon fontSize="small" />
                          )}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.text}
                        secondary={activity.time}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Events */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <ScheduleIcon />
                  Upcoming Events
                </Typography>
                <List>
                  {dashboardData.upcomingEvents?.map((event, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor:
                              event.type === 'meeting'
                                ? '#f44336'
                                : event.type === 'event'
                                ? '#4caf50'
                                : '#ff9800',
                            width: 32,
                            height: 32,
                          }}
                        >
                          {event.type === 'meeting' ? (
                            <MessageIcon fontSize="small" />
                          ) : event.type === 'event' ? (
                            <SchoolIcon fontSize="small" />
                          ) : (
                            <AssignmentIcon fontSize="small" />
                          )}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={event.event}
                        secondary={event.date}
                      />
                      <Chip
                        label={event.type}
                        size="small"
                        color={
                          event.type === 'meeting'
                            ? 'error'
                            : event.type === 'event'
                            ? 'success'
                            : 'warning'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default ParentDashboard;
