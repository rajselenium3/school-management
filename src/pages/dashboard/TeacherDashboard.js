import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  School as TeacherIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  People as StudentsIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Message as MessageIcon,
  SmartToy as AIIcon,
  MenuBook as CourseIcon,
  EventNote as AttendanceIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  Notifications as NotificationIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';

const TeacherDashboard = () => {
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
      // Simulate loading dashboard data with class-based filtering
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get teacher's assigned classes from localStorage or API
      const teacherAssignments = {
        teacherId: user?.email || 'sarah.johnson@school.edu',
        assignedClasses: [
          {
            id: 'MATH10A',
            name: 'Math 10A',
            grade: '10',
            section: 'A',
            subject: 'Mathematics',
            students: [
              { id: 'STU001', name: 'Emma Thompson', rollNo: 15 },
              { id: 'STU002', name: 'John Smith', rollNo: 16 },
              { id: 'STU003', name: 'Sarah Wilson', rollNo: 17 },
              // ... more students
            ],
          },
          {
            id: 'MATH10B',
            name: 'Math 10B',
            grade: '10',
            section: 'B',
            subject: 'Mathematics',
            students: [
              { id: 'STU025', name: 'Michael Johnson', rollNo: 12 },
              { id: 'STU026', name: 'Lisa Brown', rollNo: 13 },
              // ... more students
            ],
          },
          {
            id: 'ALG11A',
            name: 'Algebra 11A',
            grade: '11',
            section: 'A',
            subject: 'Advanced Mathematics',
            students: [
              { id: 'STU050', name: 'David Lee', rollNo: 8 },
              { id: 'STU051', name: 'Maria Garcia', rollNo: 9 },
              // ... more students
            ],
          },
        ],
      };

      // Calculate total students from assigned classes only
      const totalAssignedStudents = teacherAssignments.assignedClasses.reduce(
        (total, cls) => total + cls.students.length,
        0
      );

      setDashboardData({
        teacherAssignments,
        classes: teacherAssignments.assignedClasses.map((cls) => ({
          id: cls.id,
          name: cls.name,
          students: cls.students.length,
          nextClass: getNextClassTime(cls.name),
          room: getClassRoom(cls.name),
          grade: cls.grade,
          section: cls.section,
          subject: cls.subject,
        })),
        stats: {
          totalStudents: totalAssignedStudents,
          assignedClasses: teacherAssignments.assignedClasses.length,
          pendingGrades: 15,
          upcomingClasses: 3,
          unreadMessages: 4,
        },
        recentActivity: [
          {
            type: 'assignment',
            text: `15 students from Math 10A submitted Quiz 3`,
            time: '2 hours ago',
          },
          {
            type: 'message',
            text: "New message from Parent - Mrs. Thompson (Emma's mother)",
            time: '3 hours ago',
          },
          {
            type: 'grade',
            text: 'Grades published for Math 10B Chapter 5 Test',
            time: '1 day ago',
          },
        ],
        upcomingTasks: [
          {
            task: 'Grade Math 10A Quiz 3',
            due: 'Today 5:00 PM',
            priority: 'high',
            class: 'Math 10A',
          },
          {
            task: 'Prepare lesson plan for Algebra 11A',
            due: 'Tomorrow',
            priority: 'medium',
            class: 'Algebra 11A',
          },
          {
            task: 'Parent-teacher conference - Emma Thompson',
            due: 'Friday 3:00 PM',
            priority: 'normal',
            class: 'Math 10A',
          },
        ],
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for class scheduling
  const getNextClassTime = (className) => {
    const schedule = {
      'Math 10A': '09:00 AM',
      'Math 10B': '11:00 AM',
      'Algebra 11A': '02:00 PM',
    };
    return schedule[className] || 'TBD';
  };

  const getClassRoom = (className) => {
    const rooms = {
      'Math 10A': 'Room 101',
      'Math 10B': 'Room 101',
      'Algebra 11A': 'Room 203',
    };
    return rooms[className] || 'TBD';
  };

  const quickActions = [
    {
      title: 'AI Teaching Assistant',
      description: 'Get help with lesson planning and content creation',
      icon: AIIcon,
      color: '#1976d2',
      path: '/dashboard/teacher/ai-assistant',
    },
    {
      title: 'Messages',
      description: 'Communicate with students, parents, and colleagues',
      icon: MessageIcon,
      color: '#4caf50',
      path: '/dashboard/teacher/messages',
    },
    {
      title: 'Gradebook',
      description: 'Manage grades and assessments',
      icon: GradeIcon,
      color: '#ff9800',
      path: '/dashboard/teacher/grades',
    },
    {
      title: 'My Classes',
      description: 'View and manage your classes',
      icon: CourseIcon,
      color: '#9c27b0',
      path: '/dashboard/teacher/courses',
    },
    {
      title: 'Assignments',
      description: 'Create and manage assignments',
      icon: AssignmentIcon,
      color: '#f44336',
      path: '/dashboard/teacher/assignments',
    },
    {
      title: 'Student Management',
      description: 'View student information and progress',
      icon: StudentsIcon,
      color: '#795548',
      path: '/dashboard/teacher/students',
    },
    {
      title: 'Attendance',
      description: 'Track student attendance',
      icon: AttendanceIcon,
      color: '#607d8b',
      path: '/dashboard/teacher/attendance',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Teacher Dashboard">
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
            👨‍🏫 Teacher Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {user?.firstName || 'Teacher'}! Ready to inspire and
            educate? Here's your teaching dashboard.
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
                  <StudentsIcon />
                </Avatar>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', color: '#1976d2' }}
                >
                  {dashboardData.stats?.totalStudents}
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
                    bgcolor: '#ff9800',
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
                  sx={{ fontWeight: 'bold', color: '#ff9800' }}
                >
                  {dashboardData.stats?.pendingGrades}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Grades
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
                  <ScheduleIcon />
                </Avatar>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', color: '#4caf50' }}
                >
                  {dashboardData.stats?.upcomingClasses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Classes Today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: '#9c27b0',
                    mx: 'auto',
                    mb: 1,
                    width: 48,
                    height: 48,
                  }}
                >
                  <MessageIcon />
                </Avatar>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', color: '#9c27b0' }}
                >
                  {dashboardData.stats?.unreadMessages}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New Messages
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
                <Grid item xs={12} sm={6} md={3} key={index}>
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
                        sx={{ fontWeight: 'bold', mb: 1 }}
                      >
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
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
          {/* Today's Classes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <ScheduleIcon />
                  Today's Classes
                </Typography>
                <List>
                  {dashboardData.classes?.map((cls, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}
                        >
                          <SchoolIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={cls.name}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {cls.students} students • {cls.room}
                            </Typography>
                            <Typography variant="caption" color="primary.main">
                              Next: {cls.nextClass}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/dashboard/teacher/courses')}
                >
                  View All Classes
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
                              activity.type === 'assignment'
                                ? '#4caf50'
                                : activity.type === 'message'
                                ? '#2196f3'
                                : '#ff9800',
                            width: 32,
                            height: 32,
                          }}
                        >
                          {activity.type === 'assignment' ? (
                            <AssignmentIcon fontSize="small" />
                          ) : activity.type === 'message' ? (
                            <MessageIcon fontSize="small" />
                          ) : (
                            <GradeIcon fontSize="small" />
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

          {/* Upcoming Tasks */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <TimeIcon />
                  Upcoming Tasks
                </Typography>
                <List>
                  {dashboardData.upcomingTasks?.map((task, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor:
                              task.priority === 'high'
                                ? '#f44336'
                                : task.priority === 'medium'
                                ? '#ff9800'
                                : '#4caf50',
                            width: 32,
                            height: 32,
                          }}
                        >
                          {task.priority === 'high' ? (
                            <WarningIcon fontSize="small" />
                          ) : (
                            <CheckIcon fontSize="small" />
                          )}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={task.task}
                        secondary={`Due: ${task.due}`}
                      />
                      <Chip
                        label={task.priority}
                        size="small"
                        color={
                          task.priority === 'high'
                            ? 'error'
                            : task.priority === 'medium'
                            ? 'warning'
                            : 'success'
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

export default TeacherDashboard;
