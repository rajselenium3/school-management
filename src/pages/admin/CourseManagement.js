import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Tooltip,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
  Switch,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  MenuBook as BookIcon,
  Schedule as ScheduleIcon,
  Assessment as GradeIcon,
  EventNote as AttendanceIcon,
  SmartToy as AIIcon,
  Business as DepartmentIcon,
  Class as ClassIcon,
  People as PeopleIcon,
  Timeline as AnalyticsIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import courseService from '../../services/courseService.js';
import teacherService from '../../services/teacherService.js';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view'
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statistics, setStatistics] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    description: '',
    department: '',
    credits: 3,
    grade: '',
    semester: '',
    teacher: {
      teacherId: '',
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      employeeId: '',
    },
    capacity: 30,
    schedule: '',
    classroom: '',
    startDate: '',
    endDate: '',
    status: 'UPCOMING',
    aiGradingEnabled: true,
  });

  const departments = [
    'Mathematics',
    'English',
    'Science',
    'Social Studies',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'Languages',
    'Physical Education',
    'Art',
    'Music',
    'Library',
  ];

  const grades = [
    'Pre-K',
    'K',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  const semesters = ['Fall 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025'];
  const statuses = ['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
  const courseSteps = [
    'Basic Info',
    'Teacher Assignment',
    'Schedule & Capacity',
    'Settings',
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, teachersData, statsData] = await Promise.all([
        courseService.getAllCourses(),
        teacherService.getAllTeachers(),
        courseService.getCourseStatistics(),
      ]);
      setCourses(coursesData);
      setTeachers(teachersData);
      setStatistics(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data: ' + error.message);
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddCourse = () => {
    setDialogMode('add');
    setSelectedCourse(null);
    setActiveStep(0);
    resetFormData();
    setFormErrors({});
    setOpenDialog(true);
  };

  const resetFormData = () => {
    setFormData({
      courseCode: '',
      courseName: '',
      description: '',
      department: '',
      credits: 3,
      grade: '',
      semester: '',
      teacher: {
        teacherId: '',
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        employeeId: '',
      },
      capacity: 30,
      schedule: '',
      classroom: '',
      startDate: '',
      endDate: '',
      status: 'UPCOMING',
      aiGradingEnabled: true,
    });
  };

  const handleEditCourse = (course) => {
    setDialogMode('edit');
    setSelectedCourse(course);
    setActiveStep(0);
    setFormErrors({});
    setFormData({
      courseCode: course.courseCode || '',
      courseName: course.courseName || '',
      description: course.description || '',
      department: course.department || '',
      credits: course.credits || 3,
      grade: course.grade || '',
      semester: course.semester || '',
      teacher: course.teacher || {
        teacherId: '',
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        employeeId: '',
      },
      capacity: course.capacity || 30,
      schedule: course.schedule || '',
      classroom: course.classroom || '',
      startDate: course.startDate || '',
      endDate: course.endDate || '',
      status: course.status || 'UPCOMING',
      aiGradingEnabled:
        course.aiGradingEnabled !== undefined ? course.aiGradingEnabled : true,
    });
    setOpenDialog(true);
  };

  const handleViewCourse = (course) => {
    setDialogMode('view');
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseId);
        setCourses(courses.filter((c) => c.id !== courseId));
        setSuccess('Course deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete course: ' + error.message);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // --- Form Validation ---
  const validateStep = (step) => {
    let errors = {};
    if (step === 0) {
      if (!formData.courseCode.trim())
        errors.courseCode = 'Course code is required';
      if (!formData.courseName.trim())
        errors.courseName = 'Course name is required';
      if (!formData.department) errors.department = 'Department is required';
      if (!formData.grade) errors.grade = 'Grade level is required';
      if (!formData.semester) errors.semester = 'Semester is required';
      if (!formData.credits || formData.credits < 1 || formData.credits > 6)
        errors.credits = 'Credits must be between 1 and 6';
    }
    if (step === 1) {
      if (!formData.teacher.teacherId)
        errors.teacher = 'Teacher assignment is required';
    }
    if (step === 2) {
      if (
        !formData.capacity ||
        formData.capacity < 5 ||
        formData.capacity > 100
      )
        errors.capacity = 'Capacity must be between 5 and 100';
      if (!formData.startDate) errors.startDate = 'Start date is required';
      if (!formData.endDate) errors.endDate = 'End date is required';
      if (
        formData.startDate &&
        formData.endDate &&
        formData.startDate > formData.endDate
      )
        errors.endDate = 'End date must be after start date';
    }
    if (step === 3) {
      if (!formData.status) errors.status = 'Status is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAll = () => {
    let allErrors = {};

    // Validate each step and collect errors
    for (let i = 0; i < courseSteps.length; i++) {
      const stepErrors = validateStepAndReturn(i);
      allErrors = { ...allErrors, ...stepErrors };
    }

    setFormErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  // Helper function that returns errors instead of setting state
  const validateStepAndReturn = (step) => {
    let errors = {};
    if (step === 0) {
      if (!formData.courseCode.trim())
        errors.courseCode = 'Course code is required';
      if (!formData.courseName.trim())
        errors.courseName = 'Course name is required';
      if (!formData.department) errors.department = 'Department is required';
      if (!formData.grade) errors.grade = 'Grade level is required';
      if (!formData.semester) errors.semester = 'Semester is required';
      if (!formData.credits || formData.credits < 1 || formData.credits > 6)
        errors.credits = 'Credits must be between 1 and 6';
    }
    if (step === 1) {
      if (!formData.teacher.teacherId)
        errors.teacher = 'Teacher assignment is required';
    }
    if (step === 2) {
      if (
        !formData.capacity ||
        formData.capacity < 5 ||
        formData.capacity > 100
      )
        errors.capacity = 'Capacity must be between 5 and 100';
      if (!formData.startDate) errors.startDate = 'Start date is required';
      if (!formData.endDate) errors.endDate = 'End date is required';
      if (
        formData.startDate &&
        formData.endDate &&
        formData.startDate > formData.endDate
      )
        errors.endDate = 'End date must be after start date';
    }
    if (step === 3) {
      if (!formData.status) errors.status = 'Status is required';
    }
    return errors;
  };

  const handleSaveCourse = async () => {
    if (!validateAll()) {
      setError('Please fix the errors in the form before saving.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      if (dialogMode === 'add') {
        const newCourse = await courseService.createCourse(formData);
        setCourses([...courses, newCourse]);
        setSuccess('Course created successfully!');
      } else if (dialogMode === 'edit') {
        const updatedCourse = await courseService.updateCourse(
          selectedCourse.id,
          formData
        );
        const updatedCourses = courses.map((c) =>
          c.id === selectedCourse.id ? updatedCourse : c
        );
        setCourses(updatedCourses);
        setSuccess('Course updated successfully!');
      }

      setOpenDialog(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to save course: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    // Remove error for this field
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleTeacherSelect = (teacher) => {
    if (teacher) {
      setFormData((prev) => ({
        ...prev,
        teacher: {
          teacherId: teacher.id,
          firstName: teacher.user?.firstName || '',
          lastName: teacher.user?.lastName || '',
          email: teacher.user?.email || '',
          department: teacher.department || '',
          employeeId: teacher.employeeId || '',
        },
      }));
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.teacher;
        return newErrors;
      });
    }
  };

  const handleStepNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, courseSteps.length - 1));
    }
  };

  const handleStepBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const filteredCourses = courses.filter((course) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      course.courseName?.toLowerCase().includes(searchLower) ||
      course.courseCode?.toLowerCase().includes(searchLower) ||
      course.teacher?.firstName?.toLowerCase().includes(searchLower) ||
      course.teacher?.lastName?.toLowerCase().includes(searchLower) ||
      course.department?.toLowerCase().includes(searchLower);

    const matchesDepartment =
      !departmentFilter || course.department === departmentFilter;
    const matchesStatus = !statusFilter || course.status === statusFilter;
    const matchesGrade = !gradeFilter || course.grade === gradeFilter;

    return matchesSearch && matchesDepartment && matchesStatus && matchesGrade;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return '#4caf50';
      case 'UPCOMING':
        return '#2196f3';
      case 'COMPLETED':
        return '#9e9e9e';
      case 'CANCELLED':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {[
        {
          title: 'Total Courses',
          value: statistics.total || 0,
          icon: BookIcon,
          color: '#2196f3',
        },
        {
          title: 'Active Courses',
          value: statistics.active || 0,
          icon: ClassIcon,
          color: '#4caf50',
        },
        {
          title: 'Upcoming Courses',
          value: statistics.upcoming || 0,
          icon: ScheduleIcon,
          color: '#ff9800',
        },
        {
          title: 'Departments',
          value: statistics.departments || 0,
          icon: DepartmentIcon,
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

  const renderCourseForm = () => {
    const renderStepContent = (step) => {
      switch (step) {
        case 0: // Basic Info
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Course Code"
                  value={formData.courseCode}
                  onChange={(e) =>
                    handleFormChange('courseCode', e.target.value)
                  }
                  required
                  placeholder="e.g., MATH101"
                  error={!!formErrors.courseCode}
                  helperText={formErrors.courseCode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Course Name"
                  value={formData.courseName}
                  onChange={(e) =>
                    handleFormChange('courseName', e.target.value)
                  }
                  required
                  placeholder="e.g., Introduction to Algebra"
                  error={!!formErrors.courseName}
                  helperText={formErrors.courseName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    handleFormChange('description', e.target.value)
                  }
                  placeholder="Course description and objectives..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.department}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department}
                    onChange={(e) =>
                      handleFormChange('department', e.target.value)
                    }
                    required
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.department && (
                    <FormHelperText>{formErrors.department}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.grade}>
                  <InputLabel>Grade Level</InputLabel>
                  <Select
                    value={formData.grade}
                    onChange={(e) => handleFormChange('grade', e.target.value)}
                    required
                  >
                    {grades.map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        Grade {grade}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.grade && (
                    <FormHelperText>{formErrors.grade}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) =>
                    handleFormChange('credits', Number(e.target.value))
                  }
                  inputProps={{ min: 1, max: 6 }}
                  error={!!formErrors.credits}
                  helperText={formErrors.credits}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.semester}>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={formData.semester}
                    onChange={(e) =>
                      handleFormChange('semester', e.target.value)
                    }
                    required
                  >
                    {semesters.map((semester) => (
                      <MenuItem key={semester} value={semester}>
                        {semester}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.semester && (
                    <FormHelperText>{formErrors.semester}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          );

        case 1: // Teacher Assignment
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Assign Teacher
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  options={teachers}
                  getOptionLabel={(teacher) =>
                    `${teacher.user?.firstName || ''} ${
                      teacher.user?.lastName || ''
                    } (${teacher.employeeId || 'N/A'})`
                  }
                  value={
                    teachers.find((t) => t.id === formData.teacher.teacherId) ||
                    null
                  }
                  onChange={(event, newValue) => handleTeacherSelect(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Teacher"
                      placeholder="Search by name or employee ID..."
                      required
                      error={!!formErrors.teacher}
                      helperText={formErrors.teacher}
                    />
                  )}
                  renderOption={(props, teacher) => (
                    <Box component="li" {...props}>
                      <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                        {teacher.user?.firstName?.[0]}
                        {teacher.user?.lastName?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {teacher.user?.firstName} {teacher.user?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {teacher.department} - {teacher.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>
              {formData.teacher.teacherId && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Selected Teacher
                      </Typography>
                      <Typography>
                        <strong>Name:</strong> {formData.teacher.firstName}{' '}
                        {formData.teacher.lastName}
                      </Typography>
                      <Typography>
                        <strong>Email:</strong> {formData.teacher.email}
                      </Typography>
                      <Typography>
                        <strong>Department:</strong>{' '}
                        {formData.teacher.department}
                      </Typography>
                      <Typography>
                        <strong>Employee ID:</strong>{' '}
                        {formData.teacher.employeeId}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          );

        case 2: // Schedule & Capacity
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Schedule and Capacity
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    handleFormChange('capacity', Number(e.target.value))
                  }
                  inputProps={{ min: 5, max: 100 }}
                  helperText={
                    formErrors.capacity || 'Maximum number of students'
                  }
                  error={!!formErrors.capacity}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Classroom"
                  value={formData.classroom}
                  onChange={(e) =>
                    handleFormChange('classroom', e.target.value)
                  }
                  placeholder="e.g., Room 101, Lab A"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Schedule"
                  value={formData.schedule}
                  onChange={(e) => handleFormChange('schedule', e.target.value)}
                  placeholder="e.g., Mon/Wed/Fri 9:00-10:00 AM"
                  helperText="Enter the class schedule"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleFormChange('startDate', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                  error={!!formErrors.startDate}
                  helperText={formErrors.startDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleFormChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                  error={!!formErrors.endDate}
                  helperText={formErrors.endDate}
                />
              </Grid>
            </Grid>
          );

        case 3: // Settings
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Course Settings
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    required
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.status && (
                    <FormHelperText>{formErrors.status}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.aiGradingEnabled}
                      onChange={(e) =>
                        handleFormChange('aiGradingEnabled', e.target.checked)
                      }
                    />
                  }
                  label="Enable AI Grading"
                />
              </Grid>
            </Grid>
          );

        default:
          return null;
      }
    };

    return (
      <Box>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {courseSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleStepBack}>
            Back
          </Button>
          <Box>
            {activeStep < courseSteps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleStepNext}
                sx={{
                  background:
                    'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSaveCourse}
                sx={{
                  background:
                    'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                }}
              >
                {dialogMode === 'add' ? 'Create Course' : 'Save Changes'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  const renderCourseDialog = () => (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      maxWidth="lg"
      fullWidth
      sx={{ '& .MuiDialog-paper': { minHeight: '80vh' } }}
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
        <BookIcon />
        {dialogMode === 'add'
          ? 'Create New Course'
          : dialogMode === 'edit'
          ? 'Edit Course Information'
          : 'Course Details'}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 1, px: 4 }}>
        {dialogMode === 'view' && selectedCourse ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              {selectedCourse.courseName}
            </Typography>
            <Typography>
              <strong>Course Code:</strong> {selectedCourse.courseCode}
            </Typography>
            <Typography>
              <strong>Department:</strong> {selectedCourse.department}
            </Typography>
            <Typography>
              <strong>Teacher:</strong> {selectedCourse.teacher?.firstName}{' '}
              {selectedCourse.teacher?.lastName}
            </Typography>
            <Typography>
              <strong>Credits:</strong> {selectedCourse.credits}
            </Typography>
            <Typography>
              <strong>Capacity:</strong> {selectedCourse.capacity}
            </Typography>
            <Typography>
              <strong>Status:</strong> {selectedCourse.status}
            </Typography>
            {selectedCourse.description && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Description:</Typography>
                <Typography>{selectedCourse.description}</Typography>
              </Box>
            )}
            {selectedCourse.enrolledStudents &&
              selectedCourse.enrolledStudents.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    Enrolled Students ({selectedCourse.enrolledStudents.length})
                  </Typography>
                  <Box
                    sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}
                  >
                    {selectedCourse.enrolledStudents
                      .slice(0, 5)
                      .map((student, index) => (
                        <Chip
                          key={index}
                          label={`${student.firstName} ${student.lastName}`}
                          size="small"
                        />
                      ))}
                    {selectedCourse.enrolledStudents.length > 5 && (
                      <Chip
                        label={`+${
                          selectedCourse.enrolledStudents.length - 5
                        } more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              )}
          </Box>
        ) : (
          renderCourseForm()
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={() => setOpenDialog(false)}>
          {dialogMode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {dialogMode === 'view' && (
          <Button
            onClick={() => {
              handleEditCourse(selectedCourse);
            }}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
              px: 3,
            }}
          >
            Edit Course
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  // --- Export/Import Functionality ---
  const handleExport = () => {
    // Export filteredCourses as JSON
    const dataStr = JSON.stringify(filteredCourses, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'courses_export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    setImportDialogOpen(true);
  };

  const handleImportFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const importedCourses = JSON.parse(text);
      if (!Array.isArray(importedCourses))
        throw new Error('Invalid file format');
      // Optionally, validate each course object here
      // For demo, just add to the list (simulate backend import)
      // In real app, you might want to POST to backend
      setCourses((prev) => [...prev, ...importedCourses]);
      setSuccess('Courses imported successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setImportDialogOpen(false);
    } catch (err) {
      setError('Failed to import courses: ' + err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const renderImportDialog = () => (
    <Dialog
      open={importDialogOpen}
      onClose={() => setImportDialogOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Import Courses</DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 1 }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Select a <b>JSON</b> file containing an array of course objects to
          import.
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadIcon />}
          fullWidth
        >
          Choose File
          <input
            type="file"
            accept="application/json"
            hidden
            ref={fileInputRef}
            onChange={handleImportFileChange}
          />
        </Button>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <DashboardLayout title="Course Management">
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
            Loading Courses...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Course Management">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            📚 Course Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Create and manage courses, assign teachers, and track enrollment
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

        {/* Actions and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box
                  sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    size="small"
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    size="small"
                    onClick={handleImportClick}
                  >
                    Import
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddCourse}
                    sx={{
                      background:
                        'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    }}
                  >
                    Create Course
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Teacher</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Department
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Enrollment
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Schedule</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow
                      key={course.id}
                      sx={{
                        '&:hover': { backgroundColor: '#f8f9fa' },
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <Avatar sx={{ bgcolor: '#1976d2' }}>
                            <BookIcon />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 'bold' }}
                            >
                              {course.courseName || 'N/A'}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {course.courseCode || 'No code'} •{' '}
                              {course.credits || 0} credits
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {course.teacher?.firstName || 'N/A'}{' '}
                            {course.teacher?.lastName || ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.teacher?.employeeId || 'No ID'}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={course.department || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {course.enrolledStudents?.length || 0}/
                            {course.capacity || 0}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={
                              course.capacity
                                ? ((course.enrolledStudents?.length || 0) /
                                    course.capacity) *
                                  100
                                : 0
                            }
                            sx={{
                              mt: 0.5,
                              height: 4,
                              borderRadius: 2,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor:
                                  (course.enrolledStudents?.length || 0) /
                                    (course.capacity || 1) >
                                  0.8
                                    ? '#f44336'
                                    : '#4caf50',
                              },
                            }}
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {course.schedule || 'TBD'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course.classroom || 'No room'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={course.status || 'UNKNOWN'}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(
                              course.status
                            )}20`,
                            color: getStatusColor(course.status),
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewCourse(course)}
                              sx={{ color: '#1976d2' }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditCourse(course)}
                              sx={{ color: '#ff9800' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteCourse(course.id)}
                              sx={{ color: '#f44336' }}
                            >
                              <DeleteIcon fontSize="small" />
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

        {/* Dialog */}
        {renderCourseDialog()}
        {renderImportDialog()}
      </Box>
    </DashboardLayout>
  );
};

export default CourseManagement;
