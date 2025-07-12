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
  Rating,
  Autocomplete,
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
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Assessment as GradeIcon,
  EventNote as AttendanceIcon,
  SmartToy as AIIcon,
  Business as DepartmentIcon,
  MenuBook as SubjectIcon,
  Timeline as PerformanceIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import teacherService from '../../services/teacherService.js';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view'
  const [currentTab, setCurrentTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    user: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
    },
    // Professional Information
    employeeId: '',
    department: '',
    subjects: [],
    qualification: '',
    experienceYears: 0,
    joiningDate: '',
    employmentType: 'FULL_TIME',
    // Performance Metrics (will be calculated)
    performanceScore: 0,
    studentRating: 0,
    classesAssigned: 0,
    totalStudents: 0,
    attendanceRate: 100,
    aiRecommendations: [],
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  // For import functionality
  const fileInputRef = useRef(null);

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
    'Administration',
  ];

  const subjects = [
    'Mathematics',
    'English Literature',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'Computer Science',
    'Physical Education',
    'Art',
    'Music',
    'French',
    'Spanish',
    'Economics',
    'Psychology',
    'Sociology',
  ];

  const employmentTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'SUBSTITUTE'];
  const genders = ['MALE', 'FEMALE', 'OTHER'];
  const enrollmentSteps = [
    'Personal Info',
    'Professional Details',
    'Subjects & Skills',
    'Performance Setup',
  ];

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const teachersData = await teacherService.getAllTeachers();
      setTeachers(teachersData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading teachers:', error);
      setError('Failed to load teachers: ' + error.message);
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddTeacher = () => {
    setDialogMode('add');
    setSelectedTeacher(null);
    setActiveStep(0);
    resetFormData();
    setFormErrors({});
    setOpenDialog(true);
  };

  const resetFormData = () => {
    setFormData({
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
      },
      employeeId: '',
      department: '',
      subjects: [],
      qualification: '',
      experienceYears: 0,
      joiningDate: '',
      employmentType: 'FULL_TIME',
      performanceScore: 0,
      studentRating: 0,
      classesAssigned: 0,
      totalStudents: 0,
      attendanceRate: 100,
      aiRecommendations: [],
    });
  };

  const handleEditTeacher = (teacher) => {
    setDialogMode('edit');
    setSelectedTeacher(teacher);
    setActiveStep(0);
    setFormData({
      user: teacher.user || {},
      employeeId: teacher.employeeId || '',
      department: teacher.department || '',
      subjects: teacher.subjects || [],
      qualification: teacher.qualification || '',
      experienceYears: teacher.experienceYears || 0,
      joiningDate: teacher.joiningDate || '',
      employmentType: teacher.employmentType || 'FULL_TIME',
      performanceScore: teacher.performanceScore || 0,
      studentRating: teacher.studentRating || 0,
      classesAssigned: teacher.classesAssigned || 0,
      totalStudents: teacher.totalStudents || 0,
      attendanceRate: teacher.attendanceRate || 100,
      aiRecommendations: teacher.aiRecommendations || [],
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleViewTeacher = (teacher) => {
    setDialogMode('view');
    setSelectedTeacher(teacher);
    setCurrentTab(0);
    setOpenDialog(true);
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherService.deleteTeacher(teacherId);
        setTeachers(teachers.filter((t) => t.id !== teacherId));
        setSuccess('Teacher deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete teacher: ' + error.message);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // --- FORM VALIDATION ---
  const validateStep = (step) => {
    let errors = {};
    if (step === 0) {
      if (!formData.user.firstName)
        errors['user.firstName'] = 'First name is required';
      if (!formData.user.lastName)
        errors['user.lastName'] = 'Last name is required';
      if (!formData.user.email) errors['user.email'] = 'Email is required';
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.user.email))
        errors['user.email'] = 'Invalid email';
      if (!formData.user.dateOfBirth)
        errors['user.dateOfBirth'] = 'Date of birth is required';
      if (!formData.user.gender) errors['user.gender'] = 'Gender is required';
    }
    if (step === 1) {
      if (!formData.employeeId)
        errors['employeeId'] = 'Employee ID is required';
      if (!formData.department) errors['department'] = 'Department is required';
      if (!formData.employmentType)
        errors['employmentType'] = 'Employment type is required';
      if (!formData.joiningDate)
        errors['joiningDate'] = 'Joining date is required';
      if (!formData.qualification)
        errors['qualification'] = 'Qualification is required';
    }
    if (step === 2) {
      if (!formData.subjects || formData.subjects.length === 0)
        errors['subjects'] = 'At least one subject is required';
    }
    if (step === 3) {
      if (formData.performanceScore < 0 || formData.performanceScore > 100)
        errors['performanceScore'] = 'Score must be 0-100';
      if (formData.studentRating < 0 || formData.studentRating > 5)
        errors['studentRating'] = 'Rating must be 0-5';
      if (formData.classesAssigned < 0)
        errors['classesAssigned'] = 'Cannot be negative';
      if (formData.totalStudents < 0)
        errors['totalStudents'] = 'Cannot be negative';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAll = () => {
    let allErrors = {};

    // Validate each step and collect errors
    for (let i = 0; i < enrollmentSteps.length; i++) {
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
      if (!formData.user.firstName)
        errors['user.firstName'] = 'First name is required';
      if (!formData.user.lastName)
        errors['user.lastName'] = 'Last name is required';
      if (!formData.user.email) errors['user.email'] = 'Email is required';
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.user.email))
        errors['user.email'] = 'Invalid email';
      if (!formData.user.dateOfBirth)
        errors['user.dateOfBirth'] = 'Date of birth is required';
      if (!formData.user.gender) errors['user.gender'] = 'Gender is required';
    }
    if (step === 1) {
      if (!formData.employeeId)
        errors['employeeId'] = 'Employee ID is required';
      if (!formData.department) errors['department'] = 'Department is required';
      if (!formData.employmentType)
        errors['employmentType'] = 'Employment type is required';
      if (!formData.joiningDate)
        errors['joiningDate'] = 'Joining date is required';
      if (!formData.qualification)
        errors['qualification'] = 'Qualification is required';
    }
    if (step === 2) {
      if (!formData.subjects || formData.subjects.length === 0)
        errors['subjects'] = 'At least one subject is required';
    }
    if (step === 3) {
      if (formData.performanceScore < 0 || formData.performanceScore > 100)
        errors['performanceScore'] = 'Score must be 0-100';
      if (formData.studentRating < 0 || formData.studentRating > 5)
        errors['studentRating'] = 'Rating must be 0-5';
      if (formData.classesAssigned < 0)
        errors['classesAssigned'] = 'Cannot be negative';
      if (formData.totalStudents < 0)
        errors['totalStudents'] = 'Cannot be negative';
    }
    return errors;
  };

  const handleSaveTeacher = async () => {
    if (!validateAll()) {
      setError('Please fix the errors in the form before saving.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      const teacherData = {
        ...formData,
        performanceScore: formData.performanceScore || 85.0,
        studentRating: formData.studentRating || 4.0,
        attendanceRate: formData.attendanceRate || 100.0,
      };

      if (dialogMode === 'add') {
        const newTeacher = await teacherService.createTeacher(teacherData);
        setTeachers([...teachers, newTeacher]);
        setSuccess('Teacher added successfully!');
      } else if (dialogMode === 'edit') {
        const updatedTeacher = await teacherService.updateTeacher(
          selectedTeacher.id,
          teacherData
        );
        const updatedTeachers = teachers.map((t) =>
          t.id === selectedTeacher.id ? updatedTeacher : t
        );
        setTeachers(updatedTeachers);
        setSuccess('Teacher updated successfully!');
      }

      setOpenDialog(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to save teacher: ' + error.message);
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
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStepNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, enrollmentSteps.length - 1));
    }
  };

  const handleStepBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      teacher.user?.firstName?.toLowerCase().includes(searchLower) ||
      teacher.user?.lastName?.toLowerCase().includes(searchLower) ||
      teacher.user?.email?.toLowerCase().includes(searchLower) ||
      teacher.employeeId?.toLowerCase().includes(searchLower) ||
      teacher.department?.toLowerCase().includes(searchLower);

    const matchesDepartment =
      !departmentFilter || teacher.department === departmentFilter;
    const matchesEmploymentType =
      !employmentTypeFilter || teacher.employmentType === employmentTypeFilter;
    const matchesSubject =
      !subjectFilter ||
      (teacher.subjects && teacher.subjects.includes(subjectFilter));

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesEmploymentType &&
      matchesSubject
    );
  });

  const getPerformanceColor = (score) => {
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#8bc34a';
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    return 'Needs Improvement';
  };

  // --- EXPORT/IMPORT FUNCTIONALITY ---
  const handleExport = () => {
    const dataStr = JSON.stringify(teachers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers_export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error('Invalid file format');
        // Optionally, validate structure of each teacher object
        // Save each teacher (could be optimized)
        let importedTeachers = [];
        for (const t of imported) {
          // Remove id if present to avoid conflicts
          const { id, ...teacherData } = t;
          try {
            const newTeacher = await teacherService.createTeacher(teacherData);
            importedTeachers.push(newTeacher);
          } catch (err) {
            // skip or handle error for this teacher
          }
        }
        setTeachers((prev) => [...prev, ...importedTeachers]);
        setSuccess('Teachers imported successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to import: ' + err.message);
        setTimeout(() => setError(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {[
        {
          title: 'Total Teachers',
          value: teachers.length,
          icon: PersonIcon,
          color: '#2196f3',
        },
        {
          title: 'Active Teachers',
          value: teachers.filter((t) => t.employmentType === 'FULL_TIME')
            .length,
          icon: WorkIcon,
          color: '#4caf50',
        },
        {
          title: 'Departments',
          value: new Set(teachers.map((t) => t.department)).size,
          icon: DepartmentIcon,
          color: '#ff9800',
        },
        {
          title: 'High Performers',
          value: teachers.filter((t) => t.performanceScore >= 90).length,
          icon: StarIcon,
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

  const renderEnrollmentForm = () => {
    const renderStepContent = (step) => {
      switch (step) {
        case 0: // Personal Info
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.user.firstName}
                  onChange={(e) =>
                    handleFormChange('user.firstName', e.target.value)
                  }
                  required
                  error={!!formErrors['user.firstName']}
                  helperText={formErrors['user.firstName']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.user.lastName}
                  onChange={(e) =>
                    handleFormChange('user.lastName', e.target.value)
                  }
                  required
                  error={!!formErrors['user.lastName']}
                  helperText={formErrors['user.lastName']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.user.email}
                  onChange={(e) =>
                    handleFormChange('user.email', e.target.value)
                  }
                  required
                  error={!!formErrors['user.email']}
                  helperText={formErrors['user.email']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.user.phone}
                  onChange={(e) =>
                    handleFormChange('user.phone', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.user.dateOfBirth}
                  onChange={(e) =>
                    handleFormChange('user.dateOfBirth', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                  error={!!formErrors['user.dateOfBirth']}
                  helperText={formErrors['user.dateOfBirth']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors['user.gender']}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.user.gender}
                    onChange={(e) =>
                      handleFormChange('user.gender', e.target.value)
                    }
                    required
                  >
                    {genders.map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors['user.gender'] && (
                    <FormHelperText>{formErrors['user.gender']}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={formData.user.address}
                  onChange={(e) =>
                    handleFormChange('user.address', e.target.value)
                  }
                />
              </Grid>
            </Grid>
          );

        case 1: // Professional Details
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  value={formData.employeeId}
                  onChange={(e) =>
                    handleFormChange('employeeId', e.target.value)
                  }
                  required
                  error={!!formErrors['employeeId']}
                  helperText={formErrors['employeeId']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors['department']}>
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
                  {formErrors['department'] && (
                    <FormHelperText>{formErrors['department']}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors['employmentType']}>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    value={formData.employmentType}
                    onChange={(e) =>
                      handleFormChange('employmentType', e.target.value)
                    }
                    required
                  >
                    {employmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors['employmentType'] && (
                    <FormHelperText>
                      {formErrors['employmentType']}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Joining Date"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) =>
                    handleFormChange('joiningDate', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                  error={!!formErrors['joiningDate']}
                  helperText={formErrors['joiningDate']}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Qualification"
                  value={formData.qualification}
                  onChange={(e) =>
                    handleFormChange('qualification', e.target.value)
                  }
                  placeholder="e.g., M.A. in Mathematics, B.Ed."
                  required
                  error={!!formErrors['qualification']}
                  helperText={formErrors['qualification']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience (Years)"
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) =>
                    handleFormChange('experienceYears', Number(e.target.value))
                  }
                  inputProps={{ min: 0, max: 50 }}
                />
              </Grid>
            </Grid>
          );

        case 2: // Subjects & Skills
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Subject Specializations
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={subjects}
                  value={formData.subjects}
                  onChange={(event, newValue) => {
                    handleFormChange('subjects', newValue);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Subjects Taught"
                      placeholder="Select subjects..."
                      helperText={
                        formErrors['subjects'] ||
                        'Select all subjects this teacher can teach'
                      }
                      error={!!formErrors['subjects']}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Additional skills and certifications can be added later
                  through the teacher profile.
                </Typography>
              </Grid>
            </Grid>
          );

        case 3: // Performance Setup
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Initial Performance Setup
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  These values can be updated later based on actual performance
                  data.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Classes Assigned"
                  type="number"
                  value={formData.classesAssigned}
                  onChange={(e) =>
                    handleFormChange('classesAssigned', Number(e.target.value))
                  }
                  inputProps={{ min: 0 }}
                  error={!!formErrors['classesAssigned']}
                  helperText={formErrors['classesAssigned']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Students"
                  type="number"
                  value={formData.totalStudents}
                  onChange={(e) =>
                    handleFormChange('totalStudents', Number(e.target.value))
                  }
                  inputProps={{ min: 0 }}
                  error={!!formErrors['totalStudents']}
                  helperText={formErrors['totalStudents']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Initial Performance Score"
                  type="number"
                  value={formData.performanceScore}
                  onChange={(e) =>
                    handleFormChange('performanceScore', Number(e.target.value))
                  }
                  inputProps={{ min: 0, max: 100 }}
                  helperText={
                    formErrors['performanceScore'] ||
                    'Initial performance score (0-100)'
                  }
                  error={!!formErrors['performanceScore']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Initial Student Rating"
                  type="number"
                  value={formData.studentRating}
                  onChange={(e) =>
                    handleFormChange('studentRating', Number(e.target.value))
                  }
                  inputProps={{ min: 0, max: 5, step: 0.1 }}
                  helperText={
                    formErrors['studentRating'] ||
                    'Initial student rating (0-5)'
                  }
                  error={!!formErrors['studentRating']}
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
          {enrollmentSteps.map((label) => (
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
            {activeStep < enrollmentSteps.length - 1 ? (
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
                onClick={handleSaveTeacher}
                sx={{
                  background:
                    'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                }}
              >
                {dialogMode === 'add' ? 'Add Teacher' : 'Save Changes'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  const renderTeacherDialog = () => (
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
        <WorkIcon />
        {dialogMode === 'add'
          ? 'Add New Teacher'
          : dialogMode === 'edit'
          ? 'Edit Teacher Information'
          : 'Teacher Profile'}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3, px: 4 }}>
        {dialogMode === 'view' && selectedTeacher ? (
          <Box>
            <Typography variant="h6">Teacher Details</Typography>
            <Typography>
              Name: {selectedTeacher.user?.firstName}{' '}
              {selectedTeacher.user?.lastName}
            </Typography>
            <Typography>Email: {selectedTeacher.user?.email}</Typography>
            <Typography>Department: {selectedTeacher.department}</Typography>
            <Typography>Employee ID: {selectedTeacher.employeeId}</Typography>
            {selectedTeacher.subjects &&
              selectedTeacher.subjects.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Subjects:</Typography>
                  <Box
                    sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}
                  >
                    {selectedTeacher.subjects.map((subject) => (
                      <Chip key={subject} label={subject} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
          </Box>
        ) : (
          renderEnrollmentForm()
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setOpenDialog(false)}>
          {dialogMode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {dialogMode === 'view' && (
          <Button
            onClick={() => {
              handleEditTeacher(selectedTeacher);
            }}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
              px: 3,
            }}
          >
            Edit Teacher
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <DashboardLayout title="Teacher Management">
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
            Loading Teachers...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Teacher Management">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            👩‍🏫 Teacher Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage faculty, track performance, and optimize teaching assignments
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
                  placeholder="Search teachers..."
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
                  <InputLabel>Employment</InputLabel>
                  <Select
                    value={employmentTypeFilter}
                    onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {employmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.replace('_', ' ')}
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
                  <input
                    type="file"
                    accept="application/json"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImport}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddTeacher}
                    sx={{
                      background:
                        'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    }}
                  >
                    Add Teacher
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Teacher</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Employee ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Department
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Subjects</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Performance
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Classes</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow
                      key={teacher.id}
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
                            {teacher.user?.firstName?.[0] || 'T'}
                            {teacher.user?.lastName?.[0] || 'E'}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 'bold' }}
                            >
                              {teacher.user?.firstName || 'N/A'}{' '}
                              {teacher.user?.lastName || ''}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {teacher.user?.email || 'No email'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                        >
                          {teacher.employeeId || 'N/A'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={teacher.department || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}
                        >
                          {teacher.subjects && teacher.subjects.length > 0 ? (
                            teacher.subjects
                              .slice(0, 2)
                              .map((subject, index) => (
                                <Chip
                                  key={index}
                                  label={subject}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              ))
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              No subjects
                            </Typography>
                          )}
                          {teacher.subjects && teacher.subjects.length > 2 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              +{teacher.subjects.length - 2}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: getPerformanceColor(
                                teacher.performanceScore || 0
                              ),
                            }}
                          >
                            {(teacher.performanceScore || 0).toFixed(0)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={teacher.performanceScore || 0}
                            sx={{
                              mt: 0.5,
                              height: 4,
                              borderRadius: 2,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getPerformanceColor(
                                  teacher.performanceScore || 0
                                ),
                              },
                            }}
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Rating
                            value={teacher.studentRating || 0}
                            readOnly
                            size="small"
                            precision={0.1}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({(teacher.studentRating || 0).toFixed(1)})
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {teacher.classesAssigned || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {teacher.totalStudents || 0} students
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Profile">
                            <IconButton
                              size="small"
                              onClick={() => handleViewTeacher(teacher)}
                              sx={{ color: '#1976d2' }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditTeacher(teacher)}
                              sx={{ color: '#ff9800' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTeacher(teacher.id)}
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
        {renderTeacherDialog()}
      </Box>
    </DashboardLayout>
  );
};

export default TeacherManagement;
