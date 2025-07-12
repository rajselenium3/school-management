import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  Book as BookIcon,
  Person as TeacherIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  People as StudentsIcon,
  AccessTime as TimeIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import courseService from '../../services/courseService.js';
import assignmentService from '../../services/assignmentService.js';

const StudentCourses = () => {
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentCourses();
  }, []);

  const loadStudentCourses = async () => {
    try {
      setLoading(true);
      // In a real app, we'd fetch only courses the student is enrolled in
      const allCourses = await courseService.getAllCourses();

      // Filter for courses where student is enrolled (demo purposes - show all)
      const enrolledCourses = allCourses.filter(
        (course) =>
          course.status === 'ACTIVE' ||
          course.enrolledStudents?.some((s) => s.studentId === user?.studentId)
      );

      setCourses(enrolledCourses);
      setLoading(false);
    } catch (error) {
      console.error('Error loading courses:', error);
      setLoading(false);
    }
  };

  const handleViewCourseDetails = async (course) => {
    try {
      setSelectedCourse(course);

      // Load assignments for this course
      const assignments = await assignmentService.getAssignmentsByCourseCode(
        course.courseCode
      );
      setCourseAssignments(
        assignments.map((a) => assignmentService.formatAssignment(a))
      );

      setDetailsDialog(true);
    } catch (error) {
      console.error('Error loading course details:', error);
    }
  };

  const calculateCourseProgress = (course) => {
    // Demo calculation - in real app would be based on completed assignments
    const totalAssignments =
      courseAssignments.length || Math.floor(Math.random() * 10) + 5;
    const completedAssignments = Math.floor(totalAssignments * 0.7); // 70% completion demo
    return {
      total: totalAssignments,
      completed: completedAssignments,
      percentage:
        totalAssignments > 0
          ? (completedAssignments / totalAssignments) * 100
          : 0,
    };
  };

  const calculateAverageGrade = (course) => {
    // Demo calculation - in real app would be based on actual grades
    return {
      average: 85.5 + Math.random() * 10, // Demo grade between 85-95
      letterGrade: 'A-',
    };
  };

  const getUpcomingAssignments = (course) => {
    // Demo data - in real app would filter by course and due date
    return courseAssignments
      .filter((assignment) => {
        const dueDate = new Date(assignment.dueDate);
        const now = new Date();
        const daysDiff = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
        );
        return daysDiff >= 0 && daysDiff <= 7;
      })
      .slice(0, 3);
  };

  const renderCourseCard = (course) => {
    const progress = calculateCourseProgress(course);
    const gradeInfo = calculateAverageGrade(course);
    const upcomingAssignments = getUpcomingAssignments(course);

    return (
      <Grid item xs={12} md={6} lg={4} key={course.id}>
        <Card
          sx={{
            height: '100%',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            },
            transition: 'all 0.3s ease',
          }}
          onClick={() => handleViewCourseDetails(course)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor:
                    course.department === 'COMPUTER_SCIENCE'
                      ? '#2196f3'
                      : course.department === 'MATHEMATICS'
                      ? '#4caf50'
                      : course.department === 'SCIENCE'
                      ? '#ff9800'
                      : '#9c27b0',
                  width: 56,
                  height: 56,
                }}
              >
                <BookIcon fontSize="large" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {course.courseName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.courseCode}
                </Typography>
                <Chip
                  label={course.department?.replace('_', ' ')}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, minHeight: 40 }}>
                {course.description}
              </Typography>
            </Box>

            {/* Teacher Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TeacherIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {course.teacher?.firstName} {course.teacher?.lastName}
              </Typography>
            </Box>

            {/* Schedule */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ScheduleIcon fontSize="small" color="action" />
              <Typography variant="body2">
                {course.schedule || 'MWF 10:00-11:00 AM'}
              </Typography>
            </Box>

            {/* Current Grade */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                Current Grade: {gradeInfo.average.toFixed(1)}% (
                {gradeInfo.letterGrade})
              </Typography>
              <LinearProgress
                variant="determinate"
                value={gradeInfo.average}
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
                color={
                  gradeInfo.average >= 90
                    ? 'success'
                    : gradeInfo.average >= 80
                    ? 'primary'
                    : 'warning'
                }
              />
            </Box>

            {/* Progress */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Course Progress: {progress.completed}/{progress.total}{' '}
                assignments
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress.percentage}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>

            {/* Quick Stats */}
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
            >
              <Typography variant="caption" color="text.secondary">
                {upcomingAssignments.length} upcoming
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {course.credits || 3} credits
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const renderCourseDetailsDialog = () => (
    <Dialog
      open={detailsDialog}
      onClose={() => setDetailsDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#1976d2' }}>
            <BookIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">{selectedCourse?.courseName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedCourse?.courseCode} •{' '}
              {selectedCourse?.teacher?.firstName}{' '}
              {selectedCourse?.teacher?.lastName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Course Info */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Course Information
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedCourse?.description}
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Department"
                    secondary={selectedCourse?.department?.replace('_', ' ')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StudentsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Enrolled Students"
                    secondary={selectedCourse?.enrolledStudents?.length || 0}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Schedule"
                    secondary={selectedCourse?.schedule || 'MWF 10:00-11:00 AM'}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Upcoming Assignments */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Assignments
              </Typography>

              {courseAssignments.length > 0 ? (
                <List dense>
                  {courseAssignments.slice(0, 5).map((assignment, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AssignmentIcon
                          color={
                            assignment.urgency === 'Overdue'
                              ? 'error'
                              : 'primary'
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={assignment.title}
                        secondary={`Due: ${assignment.formattedDueDate} • ${assignment.maxScore} pts`}
                      />
                      <Chip
                        label={assignment.urgency}
                        size="small"
                        sx={{
                          backgroundColor: `${assignment.statusColor}20`,
                          color: assignment.statusColor,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No upcoming assignments
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Grade Summary */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Grade Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      A-
                    </Typography>
                    <Typography variant="body2">Current Grade</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      85.5%
                    </Typography>
                    <Typography variant="body2">Average Score</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      12/15
                    </Typography>
                    <Typography variant="body2">Completed</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setDetailsDialog(false)}>Close</Button>
        <Button variant="contained" href={`/dashboard/student/assignments`}>
          View Assignments
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <DashboardLayout title="My Courses">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Courses">
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
        >
          📖 My Courses
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          View your enrolled courses and track your progress
        </Typography>

        {/* Courses Grid */}
        <Grid container spacing={3}>
          {courses.map(renderCourseCard)}
        </Grid>

        {courses.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BookIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No courses found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You are not enrolled in any courses yet
            </Typography>
          </Box>
        )}

        {/* Course Details Dialog */}
        {renderCourseDetailsDialog()}
      </Box>
    </DashboardLayout>
  );
};

export default StudentCourses;
