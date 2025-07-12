import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  Alert,
  CircularProgress,
  LinearProgress,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Divider,
  Autocomplete,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Schedule as LateIcon,
  EventNote as AttendanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as ReportIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Analytics as AnalyticsIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  School as SchoolIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import attendanceService from '../../services/attendanceService.js';
import courseService from '../../services/courseService.js';
import studentService from '../../services/studentService.js';

const AttendanceTracking = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState({});

  // Filter states
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [openMarkDialog, setOpenMarkDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Student Summary states
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentAnalytics, setStudentAnalytics] = useState(null);

  // Course Summary states
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courseAnalytics, setCourseAnalytics] = useState(null);

  const statuses = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'];
  const tabs = [
    'Daily Attendance',
    'Reports & Analytics',
    'Student Summary',
    'Course Summary',
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadAttendanceForDate(selectedDate);
    }
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, studentsData, statsData] = await Promise.all([
        courseService.getAllCourses(),
        studentService.getAllStudents(),
        attendanceService.getAttendanceStatistics(),
      ]);

      setCourses(coursesData);
      setStudents(studentsData);
      setStatistics(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data: ' + error.message);
      setLoading(false);
    }
  };

  const loadAttendanceForDate = async (date) => {
    try {
      const attendanceData = await attendanceService.getAttendanceByDate(date);
      setAttendanceRecords(attendanceData);
    } catch (error) {
      console.error('Error loading attendance for date:', error);
      setError('Failed to load attendance for selected date');
    }
  };

  const handleMarkAttendance = async (studentId, courseId, status) => {
    try {
      let attendance;
      if (status === 'PRESENT') {
        attendance = await attendanceService.markStudentPresent(
          studentId,
          courseId,
          selectedDate
        );
      } else if (status === 'ABSENT') {
        attendance = await attendanceService.markStudentAbsent(
          studentId,
          courseId,
          selectedDate
        );
      } else {
        // For LATE or EXCUSED, use the general create method
        attendance = await attendanceService.quickMarkAttendance(
          studentId,
          courseId,
          status
        );
      }

      setSuccess(`Attendance marked as ${status}`);
      loadAttendanceForDate(selectedDate);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to mark attendance: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return '#4caf50';
      case 'ABSENT':
        return '#f44336';
      case 'LATE':
        return '#ff9800';
      case 'EXCUSED':
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT':
        return <PresentIcon />;
      case 'ABSENT':
        return <AbsentIcon />;
      case 'LATE':
        return <LateIcon />;
      case 'EXCUSED':
        return <AttendanceIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const filteredAttendance = attendanceRecords.filter((record) => {
    const matchesSearch =
      !searchTerm ||
      record.student?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.student?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.student?.studentId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCourse =
      !selectedCourse || record.course?.courseCode === selectedCourse;
    const matchesStatus = !selectedStatus || record.status === selectedStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {[
        {
          title: 'Total Present Today',
          value: statistics.daily?.statusBreakdown?.PRESENT || 0,
          icon: PresentIcon,
          color: '#4caf50',
        },
        {
          title: 'Total Absent Today',
          value: statistics.daily?.statusBreakdown?.ABSENT || 0,
          icon: AbsentIcon,
          color: '#f44336',
        },
        {
          title: 'Attendance Rate Today',
          value: `${(statistics.daily?.attendanceRate || 0).toFixed(1)}%`,
          icon: TrendingUpIcon,
          color: '#2196f3',
        },
        {
          title: 'Monthly Average',
          value: `${(statistics.monthly?.monthlyAttendanceRate || 0).toFixed(
            1
          )}%`,
          icon: ReportIcon,
          color: '#9c27b0',
        },
      ].map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
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
  );

  const renderDailyAttendance = () => (
    <Box>
      {/* Date and Course Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <MenuItem value="">All Courses</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.courseCode} value={course.courseCode}>
                      {course.courseName} ({course.courseCode})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={() => loadAttendanceForDate(selectedDate)}
                sx={{ mr: 1 }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenMarkDialog(true)}
              >
                Mark Attendance
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Time Marked</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Notes</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow
                    key={record.id}
                    sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar sx={{ bgcolor: '#1976d2' }}>
                          {record.student?.firstName?.[0]}
                          {record.student?.lastName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {record.student?.firstName}{' '}
                            {record.student?.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {record.student?.studentId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {record.course?.courseName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {record.course?.courseCode}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={getStatusIcon(record.status)}
                        label={record.status}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(record.status)}20`,
                          color: getStatusColor(record.status),
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {record.markedAt
                          ? new Date(record.markedAt).toLocaleTimeString()
                          : 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {record.notes || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" sx={{ color: '#ff9800' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton size="small" sx={{ color: '#1976d2' }}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const renderReportsAnalytics = () => {
    const getAttendanceTrends = () => {
      // Simulate weekly attendance trends
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const attendanceRates = [92, 88, 95, 90];
      return { weeks, attendanceRates };
    };

    const getTopPerformingClasses = () => {
      return courses
        .slice(0, 5)
        .map((course) => ({
          ...course,
          attendanceRate: 85 + Math.random() * 15, // Simulate 85-100% attendance
        }))
        .sort((a, b) => b.attendanceRate - a.attendanceRate);
    };

    const getAtRiskStudents = () => {
      return students
        .slice(0, 10)
        .map((student) => ({
          ...student,
          attendanceRate: 40 + Math.random() * 30, // Simulate 40-70% attendance (at risk)
          daysAbsent: Math.floor(Math.random() * 10) + 5,
          trend: Math.random() > 0.5 ? 'improving' : 'declining',
        }))
        .filter((s) => s.attendanceRate < 75);
    };

    const trends = getAttendanceTrends();
    const topClasses = getTopPerformingClasses();
    const atRiskStudents = getAtRiskStudents();

    return (
      <Box>
        <Typography
          variant="h6"
          sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <AnalyticsIcon />
          Reports & Analytics
        </Typography>

        <Grid container spacing={3}>
          {/* Attendance Trends Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📈 Weekly Attendance Trends
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'end',
                    gap: 2,
                    p: 2,
                  }}
                >
                  {trends.weeks.map((week, index) => (
                    <Box
                      key={week}
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          height: `${trends.attendanceRates[index] * 2}px`,
                          backgroundColor: '#1976d2',
                          width: '100%',
                          borderRadius: '4px 4px 0 0',
                          mb: 1,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {week}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {trends.attendanceRates[index]}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📊 Today's Summary
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Total Students:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {students.length}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Present:</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', color: '#4caf50' }}
                      >
                        {Math.floor(students.length * 0.92)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Absent:</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', color: '#f44336' }}
                      >
                        {Math.floor(students.length * 0.08)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Attendance Rate:</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', color: '#1976d2' }}
                      >
                        92%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🎯 This Month
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Average Rate:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        89.5%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Best Day:</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', color: '#4caf50' }}
                      >
                        95% (Mon)
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant="body2">Trend:</Typography>
                      <Chip
                        label="Improving"
                        size="small"
                        icon={<TrendingUpIcon />}
                        sx={{ color: '#4caf50', bgcolor: '#e8f5e8' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Top Performing Classes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <StarIcon />
                  Top Performing Classes
                </Typography>
                <List dense>
                  {topClasses.map((course, index) => (
                    <ListItem key={course.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{ bgcolor: '#4caf50', width: 32, height: 32 }}
                        >
                          <Typography variant="caption">{index + 1}</Typography>
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={course.courseName}
                        secondary={`${
                          course.courseCode
                        } • ${course.attendanceRate.toFixed(1)}% attendance`}
                      />
                      <Chip
                        label={`${course.attendanceRate.toFixed(1)}%`}
                        size="small"
                        color="success"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* At-Risk Students */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <WarningIcon />
                  Students Requiring Attention
                </Typography>
                <List dense>
                  {atRiskStudents.slice(0, 5).map((student, index) => (
                    <ListItem key={student.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{ bgcolor: '#ff9800', width: 32, height: 32 }}
                        >
                          {student.user?.firstName?.[0]}
                          {student.user?.lastName?.[0]}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={`${student.user?.firstName} ${student.user?.lastName}`}
                        secondary={`${student.attendanceRate.toFixed(
                          1
                        )}% attendance • ${student.daysAbsent} days absent`}
                      />
                      <Chip
                        label={
                          student.trend === 'improving'
                            ? 'Improving'
                            : 'Declining'
                        }
                        size="small"
                        color={
                          student.trend === 'improving' ? 'success' : 'error'
                        }
                        icon={
                          student.trend === 'improving' ? (
                            <TrendingUpIcon />
                          ) : (
                            <TrendingDownIcon />
                          )
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Button variant="text" fullWidth size="small" sx={{ mt: 1 }}>
                  View All At-Risk Students
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Export Options */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <DownloadIcon />
                  Export Reports
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<DownloadIcon />}
                      onClick={() => setSuccess('Daily report exported!')}
                    >
                      Daily Report
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<DownloadIcon />}
                      onClick={() => setSuccess('Weekly report exported!')}
                    >
                      Weekly Report
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<DownloadIcon />}
                      onClick={() => setSuccess('Monthly report exported!')}
                    >
                      Monthly Report
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<DownloadIcon />}
                      onClick={() => setSuccess('Custom report exported!')}
                    >
                      Custom Report
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderStudentSummary = () => {
    const generateStudentAnalytics = (student) => {
      if (!student) return null;

      const totalDays = 30; // Last 30 days
      const presentDays = Math.floor(totalDays * (0.7 + Math.random() * 0.25)); // 70-95% attendance
      const absentDays = totalDays - presentDays;
      const attendanceRate = (presentDays / totalDays) * 100;

      // Generate daily attendance pattern for last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push({
          date: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
          status: Math.random() > 0.15 ? 'PRESENT' : 'ABSENT', // 85% chance of being present
        });
      }

      // Generate monthly trend
      const monthlyTrend = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        monthlyTrend.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          rate: 75 + Math.random() * 20, // 75-95% attendance
        });
      }

      return {
        totalDays,
        presentDays,
        absentDays,
        attendanceRate,
        last7Days,
        monthlyTrend,
        streak: Math.floor(Math.random() * 15) + 1, // Days present streak
        riskLevel:
          attendanceRate < 75 ? 'HIGH' : attendanceRate < 85 ? 'MEDIUM' : 'LOW',
      };
    };

    const handleStudentSelect = (studentId) => {
      setSelectedStudentId(studentId);
      const student = students.find((s) => s.id === studentId);
      setStudentAnalytics(generateStudentAnalytics(student));
    };

    const selectedStudent = students.find((s) => s.id === selectedStudentId);

    return (
      <Box>
        <Typography
          variant="h6"
          sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <PersonIcon />
          Student Attendance Summary
        </Typography>

        {/* Student Selection */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={students}
                  getOptionLabel={(student) =>
                    `${student.user?.firstName} ${student.user?.lastName} (${student.studentId})`
                  }
                  value={selectedStudent || null}
                  onChange={(event, newValue) => {
                    handleStudentSelect(newValue?.id || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Student"
                      placeholder="Search by name or student ID..."
                    />
                  )}
                  renderOption={(props, student) => (
                    <Box component="li" {...props}>
                      <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                        {student.user?.firstName?.[0]}
                        {student.user?.lastName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {student.user?.firstName} {student.user?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {student.studentId} • Grade: {student.grade}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Select a student to view detailed attendance analytics and
                  trends
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Student Analytics */}
        {selectedStudent && studentAnalytics ? (
          <Grid container spacing={3}>
            {/* Student Info Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#1976d2', width: 60, height: 60 }}>
                      {selectedStudent.user?.firstName?.[0]}
                      {selectedStudent.user?.lastName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {selectedStudent.user?.firstName}{' '}
                        {selectedStudent.user?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {selectedStudent.studentId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Grade: {selectedStudent.grade} -{' '}
                        {selectedStudent.section}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Risk Level */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Risk Level:
                    </Typography>
                    <Chip
                      label={studentAnalytics.riskLevel}
                      size="small"
                      color={
                        studentAnalytics.riskLevel === 'HIGH'
                          ? 'error'
                          : studentAnalytics.riskLevel === 'MEDIUM'
                          ? 'warning'
                          : 'success'
                      }
                      icon={<WarningIcon />}
                    />
                  </Box>

                  {/* Current Streak */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Current Streak:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: '#4caf50', fontWeight: 'bold' }}
                    >
                      {studentAnalytics.streak} days present
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Attendance Statistics */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📊 Attendance Overview (Last 30 Days)
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography
                          variant="h3"
                          sx={{ color: '#4caf50', fontWeight: 'bold' }}
                        >
                          {studentAnalytics.presentDays}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Days Present
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography
                          variant="h3"
                          sx={{ color: '#f44336', fontWeight: 'bold' }}
                        >
                          {studentAnalytics.absentDays}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Days Absent
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography
                          variant="h3"
                          sx={{ color: '#1976d2', fontWeight: 'bold' }}
                        >
                          {studentAnalytics.attendanceRate.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Attendance Rate
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography
                          variant="h3"
                          sx={{ color: '#ff9800', fontWeight: 'bold' }}
                        >
                          {studentAnalytics.totalDays}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Days
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Last 7 Days Pattern */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📅 Last 7 Days Pattern
                  </Typography>
                  <Grid container spacing={1}>
                    {studentAnalytics.last7Days.map((day, index) => (
                      <Grid item xs key={index}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {day.date}
                          </Typography>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor:
                                day.status === 'PRESENT'
                                  ? '#4caf50'
                                  : '#f44336',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mt: 0.5,
                              mx: 'auto',
                            }}
                          >
                            {day.status === 'PRESENT' ? (
                              <CheckIcon
                                sx={{ color: 'white', fontSize: '1rem' }}
                              />
                            ) : (
                              <Typography
                                variant="caption"
                                sx={{ color: 'white' }}
                              >
                                X
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Monthly Trend */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📈 6-Month Trend
                  </Typography>
                  <Box
                    sx={{
                      height: 150,
                      display: 'flex',
                      alignItems: 'end',
                      gap: 1,
                      p: 1,
                    }}
                  >
                    {studentAnalytics.monthlyTrend.map((month, index) => (
                      <Box
                        key={month.month}
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            height: `${month.rate}px`,
                            backgroundColor:
                              month.rate > 85
                                ? '#4caf50'
                                : month.rate > 75
                                ? '#ff9800'
                                : '#f44336',
                            width: '100%',
                            borderRadius: '2px 2px 0 0',
                            mb: 0.5,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {month.month}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                        >
                          {month.rate.toFixed(0)}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Action Items */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <CheckIcon />
                    Recommended Actions
                  </Typography>
                  <Grid container spacing={2}>
                    {studentAnalytics.riskLevel === 'HIGH' && (
                      <>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant="outlined"
                            fullWidth
                            color="error"
                            onClick={() =>
                              setSuccess('Parent notification sent!')
                            }
                          >
                            Notify Parents
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant="outlined"
                            fullWidth
                            color="warning"
                            onClick={() => setSuccess('Meeting scheduled!')}
                          >
                            Schedule Meeting
                          </Button>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setSuccess('Report generated!')}
                      >
                        Generate Report
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setSuccess('History exported!')}
                      >
                        Export History
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <PersonIcon
                sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Select a student to view their attendance summary
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Use the search above to find a student and view their detailed
                attendance analytics
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  const renderCourseSummary = () => {
    const generateCourseAnalytics = (course) => {
      if (!course) return null;

      const enrolledStudents = course.enrolledStudents || [];
      const totalStudents = enrolledStudents.length || 25; // Fallback for demo
      const avgAttendanceRate = 80 + Math.random() * 15; // 80-95% average

      // Generate weekly attendance data
      const weeklyData = [];
      for (let i = 4; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i * 7);
        weeklyData.push({
          week: `Week ${5 - i}`,
          date: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          attendanceRate: 75 + Math.random() * 20,
          presentStudents: Math.floor(
            totalStudents * (0.75 + Math.random() * 0.2)
          ),
        });
      }

      // Generate top performing students
      const topStudents = enrolledStudents
        .slice(0, 5)
        .map((student) => ({
          ...student,
          attendanceRate: 85 + Math.random() * 15,
          daysPresent: Math.floor(20 + Math.random() * 10),
        }))
        .sort((a, b) => b.attendanceRate - a.attendanceRate);

      // Generate attendance patterns by day of week
      const dayPatterns = [
        { day: 'Monday', rate: 88 + Math.random() * 10 },
        { day: 'Tuesday', rate: 90 + Math.random() * 8 },
        { day: 'Wednesday', rate: 85 + Math.random() * 12 },
        { day: 'Thursday', rate: 87 + Math.random() * 10 },
        { day: 'Friday', rate: 82 + Math.random() * 15 },
      ];

      return {
        totalStudents,
        avgAttendanceRate,
        weeklyData,
        topStudents,
        dayPatterns,
        totalClasses: 24, // Classes held so far
        avgClassSize: Math.floor(totalStudents * (avgAttendanceRate / 100)),
        trend:
          avgAttendanceRate > 85
            ? 'improving'
            : avgAttendanceRate > 75
            ? 'stable'
            : 'declining',
      };
    };

    const handleCourseSelect = (courseId) => {
      setSelectedCourseId(courseId);
      const course = courses.find((c) => c.id === courseId);
      setCourseAnalytics(generateCourseAnalytics(course));
    };

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);

    // Generate comparison data for all courses
    const courseComparison = courses
      .slice(0, 8)
      .map((course) => ({
        ...course,
        attendanceRate: 75 + Math.random() * 20,
        studentCount: Math.floor(20 + Math.random() * 15),
        trend:
          Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
      }))
      .sort((a, b) => b.attendanceRate - a.attendanceRate);

    return (
      <Box>
        <Typography
          variant="h6"
          sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <SchoolIcon />
          Course Attendance Summary
        </Typography>

        {/* Course Comparison Overview */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <AnalyticsIcon />
              Course Attendance Comparison
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Students</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Attendance Rate
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Trend</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseComparison.map((course, index) => (
                    <TableRow
                      key={course.id}
                      sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
                    >
                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {course.courseName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.courseCode}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {course.studentCount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={course.attendanceRate}
                            sx={{
                              width: 60,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor:
                                  course.attendanceRate > 85
                                    ? '#4caf50'
                                    : course.attendanceRate > 75
                                    ? '#ff9800'
                                    : '#f44336',
                              },
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold', minWidth: 45 }}
                          >
                            {course.attendanceRate.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            course.trend === 'up'
                              ? 'Improving'
                              : course.trend === 'down'
                              ? 'Declining'
                              : 'Stable'
                          }
                          size="small"
                          color={
                            course.trend === 'up'
                              ? 'success'
                              : course.trend === 'down'
                              ? 'error'
                              : 'default'
                          }
                          icon={
                            course.trend === 'up' ? (
                              <TrendingUpIcon />
                            ) : course.trend === 'down' ? (
                              <TrendingDownIcon />
                            ) : (
                              <AnalyticsIcon />
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => handleCourseSelect(course.id)}
                          disabled={selectedCourseId === course.id}
                        >
                          {selectedCourseId === course.id
                            ? 'Selected'
                            : 'View Details'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Course Selection */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={courses}
                  getOptionLabel={(course) =>
                    `${course.courseName} (${course.courseCode})`
                  }
                  value={selectedCourse || null}
                  onChange={(event, newValue) => {
                    handleCourseSelect(newValue?.id || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Course for Detailed Analysis"
                      placeholder="Search by course name or code..."
                    />
                  )}
                  renderOption={(props, course) => (
                    <Box component="li" {...props}>
                      <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                        <SchoolIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {course.courseName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course.courseCode} • {course.department}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Select a course to view detailed attendance analytics and
                  student performance
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Detailed Course Analytics */}
        {selectedCourse && courseAnalytics ? (
          <Grid container spacing={3}>
            {/* Course Info & Stats */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#1976d2', width: 60, height: 60 }}>
                      <SchoolIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {selectedCourse.courseName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedCourse.courseCode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedCourse.department}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <span>Total Students:</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {courseAnalytics.totalStudents}
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <span>Avg. Attendance:</span>
                      <span style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {courseAnalytics.avgAttendanceRate.toFixed(1)}%
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <span>Classes Held:</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {courseAnalytics.totalClasses}
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <span>Avg. Class Size:</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {courseAnalytics.avgClassSize}
                      </span>
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Overall Trend:
                    </Typography>
                    <Chip
                      label={
                        courseAnalytics.trend === 'improving'
                          ? 'Improving'
                          : courseAnalytics.trend === 'stable'
                          ? 'Stable'
                          : 'Needs Attention'
                      }
                      size="small"
                      color={
                        courseAnalytics.trend === 'improving'
                          ? 'success'
                          : courseAnalytics.trend === 'stable'
                          ? 'default'
                          : 'error'
                      }
                      icon={
                        courseAnalytics.trend === 'improving' ? (
                          <TrendingUpIcon />
                        ) : courseAnalytics.trend === 'stable' ? (
                          <AnalyticsIcon />
                        ) : (
                          <TrendingDownIcon />
                        )
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Weekly Attendance Trend */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📈 5-Week Attendance Trend
                  </Typography>
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'end',
                      gap: 2,
                      p: 2,
                    }}
                  >
                    {courseAnalytics.weeklyData.map((week, index) => (
                      <Box
                        key={week.week}
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Tooltip
                          title={`${week.presentStudents}/${courseAnalytics.totalStudents} students present`}
                        >
                          <Box
                            sx={{
                              height: `${week.attendanceRate * 1.5}px`,
                              backgroundColor:
                                week.attendanceRate > 85
                                  ? '#4caf50'
                                  : week.attendanceRate > 75
                                  ? '#ff9800'
                                  : '#f44336',
                              width: '100%',
                              borderRadius: '4px 4px 0 0',
                              mb: 1,
                              cursor: 'pointer',
                              '&:hover': { opacity: 0.8 },
                            }}
                          />
                        </Tooltip>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textAlign: 'center' }}
                        >
                          {week.week}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                        >
                          {week.attendanceRate.toFixed(1)}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Day of Week Patterns */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📅 Attendance by Day of Week
                  </Typography>
                  <List dense>
                    {courseAnalytics.dayPatterns.map((dayData) => (
                      <ListItem key={dayData.day} sx={{ px: 0 }}>
                        <ListItemText primary={dayData.day} />
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            minWidth: 120,
                          }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={dayData.rate}
                            sx={{
                              width: 60,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor:
                                  dayData.rate > 85
                                    ? '#4caf50'
                                    : dayData.rate > 75
                                    ? '#ff9800'
                                    : '#f44336',
                              },
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold', minWidth: 45 }}
                          >
                            {dayData.rate.toFixed(1)}%
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Top Performing Students */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <StarIcon />
                    Top Attending Students
                  </Typography>
                  <List dense>
                    {courseAnalytics.topStudents.map((student, index) => (
                      <ListItem key={student.id || index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Avatar
                            sx={{ bgcolor: '#4caf50', width: 32, height: 32 }}
                          >
                            <Typography variant="caption">
                              {index + 1}
                            </Typography>
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={`${student.user?.firstName || 'Student'} ${
                            student.user?.lastName || ''
                          }`}
                          secondary={`${student.attendanceRate.toFixed(
                            1
                          )}% attendance • ${student.daysPresent} days present`}
                        />
                        <Chip label="Excellent" size="small" color="success" />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Course Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <CheckIcon />
                    Course Management Actions
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<DownloadIcon />}
                        onClick={() => setSuccess('Course report exported!')}
                      >
                        Export Report
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<PeopleIcon />}
                        onClick={() => setSuccess('Student list generated!')}
                      >
                        Student List
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AnalyticsIcon />}
                        onClick={() => setSuccess('Analytics updated!')}
                      >
                        Update Analytics
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<PersonIcon />}
                        onClick={() => setSuccess('Teacher notified!')}
                      >
                        Notify Teacher
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <SchoolIcon
                sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Select a course to view detailed attendance analytics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Use the course comparison table above or search to find a
                specific course
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return renderDailyAttendance();
      case 1:
        return renderReportsAnalytics();
      case 2:
        return renderStudentSummary();
      case 3:
        return renderCourseSummary();
      default:
        return renderDailyAttendance();
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Attendance Tracking">
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
            Loading Attendance Data...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Attendance Tracking">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            📋 Attendance Tracking
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track, manage, and analyze student attendance across all courses
          </Typography>
        </Box>

        {/* Alerts */}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3, backgroundColor: '#e8f5e8' }}
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}
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
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Mark Attendance Dialog */}
        <Dialog
          open={openMarkDialog}
          onClose={() => setOpenMarkDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AttendanceIcon />
            Mark Attendance for {selectedDate}
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Course</InputLabel>
                  <Select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    {courses.map((course) => (
                      <MenuItem
                        key={course.courseCode}
                        value={course.courseCode}
                      >
                        {course.courseName} ({course.courseCode})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Student</InputLabel>
                  <Select
                    value={selectedStudent?.id || ''}
                    onChange={(e) => {
                      const student = students.find(
                        (s) => s.id === e.target.value
                      );
                      setSelectedStudent(student);
                    }}
                  >
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.user?.firstName} {student.user?.lastName} (
                        {student.studentId})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {selectedStudent && selectedCourse && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Mark attendance for: {selectedStudent.user?.firstName}{' '}
                    {selectedStudent.user?.lastName}
                  </Typography>
                  <Grid container spacing={2}>
                    {statuses.map((status) => (
                      <Grid item xs={6} sm={3} key={status}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={getStatusIcon(status)}
                          onClick={() => {
                            handleMarkAttendance(
                              selectedStudent.studentId,
                              selectedCourse,
                              status
                            );
                            setOpenMarkDialog(false);
                            setSelectedStudent(null);
                          }}
                          sx={{
                            color: getStatusColor(status),
                            borderColor: getStatusColor(status),
                            '&:hover': {
                              backgroundColor: `${getStatusColor(status)}20`,
                              borderColor: getStatusColor(status),
                            },
                          }}
                        >
                          {status}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                setOpenMarkDialog(false);
                setSelectedStudent(null);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default AttendanceTracking;
