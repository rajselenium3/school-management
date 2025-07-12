import React, { useState, useEffect, useRef } from 'react'
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
  FormHelperText,
} from '@mui/material'
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
  Assessment as GradeIcon,
  EventNote as AttendanceIcon,
  FamilyRestroom as FamilyIcon,
  LocalHospital as MedicalIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material'

import DashboardLayout from '../../components/layout/DashboardLayout.js'
import studentService from '../../services/studentService.js'

const StudentManagement = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [dialogMode, setDialogMode] = useState('add') // 'add', 'edit', 'view'
  const [currentTab, setCurrentTab] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    // Academic Information
    studentId: '',
    grade: '',
    section: '',
    rollNumber: '',
    enrollmentDate: '',
    admissionNumber: '',
    academicStatus: 'ACTIVE',
    // Parent Information
    parents: [{
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      relationship: 'FATHER',
    }],
    emergencyContact: '',
    emergencyContactPhone: '',
    // Medical Information
    medicalInfo: {
      bloodGroup: '',
      allergies: [],
      medications: [],
      specialNeeds: '',
      emergencyMedicalContact: '',
    },
  })

  // Form validation state
  const [formErrors, setFormErrors] = useState({})

  // Export/Import
  const fileInputRef = useRef(null)

  const grades = ['Pre-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const sections = ['A', 'B', 'C', 'D', 'E']
  const academicStatuses = ['ACTIVE', 'SUSPENDED', 'GRADUATED', 'DROPPED_OUT', 'TRANSFERRED']
  const genders = ['MALE', 'FEMALE', 'OTHER']
  const relationships = ['FATHER', 'MOTHER', 'GUARDIAN', 'OTHER']
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  const enrollmentSteps = ['Personal Info', 'Academic Details', 'Parent/Guardian', 'Medical Info']

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const studentsData = await studentService.getAllStudents()
      setStudents(studentsData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading students:', error)
      setError('Failed to load students: ' + error.message)
      setLoading(false)
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleAddStudent = () => {
    setDialogMode('add')
    setSelectedStudent(null)
    setActiveStep(0)
    resetFormData()
    setFormErrors({})
    setOpenDialog(true)
  }

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
      studentId: '',
      grade: '',
      section: '',
      rollNumber: '',
      enrollmentDate: '',
      admissionNumber: '',
      academicStatus: 'ACTIVE',
      parents: [{
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        relationship: 'FATHER',
      }],
      emergencyContact: '',
      emergencyContactPhone: '',
      medicalInfo: {
        bloodGroup: '',
        allergies: [],
        medications: [],
        specialNeeds: '',
        emergencyMedicalContact: '',
      },
    })
  }

  const handleEditStudent = (student) => {
    setDialogMode('edit')
    setSelectedStudent(student)
    setActiveStep(0)
    setFormErrors({})
    setFormData({
      user: student.user || {},
      studentId: student.studentId || '',
      grade: student.grade || '',
      section: student.section || '',
      rollNumber: student.rollNumber || '',
      enrollmentDate: student.enrollmentDate || '',
      admissionNumber: student.admissionNumber || '',
      academicStatus: student.academicStatus || 'ACTIVE',
      parents: student.parents || [{ firstName: '', lastName: '', email: '', phone: '', relationship: 'FATHER' }],
      emergencyContact: student.emergencyContact || '',
      emergencyContactPhone: student.emergencyContactPhone || '',
      medicalInfo: student.medicalInfo || {
        bloodGroup: '',
        allergies: [],
        medications: [],
        specialNeeds: '',
        emergencyMedicalContact: '',
      },
    })
    setOpenDialog(true)
  }

  const handleViewStudent = (student) => {
    setDialogMode('view')
    setSelectedStudent(student)
    setCurrentTab(0)
    setOpenDialog(true)
  }

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(studentId)
        setStudents(students.filter(s => s.id !== studentId))
        setSuccess('Student deleted successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        setError('Failed to delete student: ' + error.message)
        setTimeout(() => setError(''), 3000)
      }
    }
  }

  // Form validation logic
  const validateStep = (step) => {
    let errors = {}
    if (step === 0) {
      if (!formData.user.firstName) errors['user.firstName'] = 'First name is required'
      if (!formData.user.lastName) errors['user.lastName'] = 'Last name is required'
      if (!formData.user.email) errors['user.email'] = 'Email is required'
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.user.email)) errors['user.email'] = 'Invalid email'
      if (!formData.user.dateOfBirth) errors['user.dateOfBirth'] = 'Date of birth is required'
      if (!formData.user.gender) errors['user.gender'] = 'Gender is required'
    }
    if (step === 1) {
      if (!formData.studentId) errors['studentId'] = 'Student ID is required'
      if (!formData.admissionNumber) errors['admissionNumber'] = 'Admission number is required'
      if (!formData.grade) errors['grade'] = 'Grade is required'
      if (!formData.section) errors['section'] = 'Section is required'
      if (!formData.rollNumber) errors['rollNumber'] = 'Roll number is required'
      if (!formData.enrollmentDate) errors['enrollmentDate'] = 'Enrollment date is required'
    }
    if (step === 2) {
      if (!formData.parents[0]?.firstName) errors['parents.0.firstName'] = 'First name is required'
      if (!formData.parents[0]?.lastName) errors['parents.0.lastName'] = 'Last name is required'
      if (!formData.parents[0]?.email) errors['parents.0.email'] = 'Email is required'
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.parents[0]?.email)) errors['parents.0.email'] = 'Invalid email'
      if (!formData.parents[0]?.phone) errors['parents.0.phone'] = 'Phone is required'
    }
    // No required fields for step 3
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveStudent = async () => {
    // Validate all steps before saving
    let allValid = true
    for (let i = 0; i < enrollmentSteps.length; i++) {
      if (!validateStep(i)) {
        setActiveStep(i)
        allValid = false
        break
      }
    }
    if (!allValid) return

    try {
      const studentData = {
        ...formData,
        currentGPA: 0.0,
        attendanceRate: 100.0,
        aiInsights: {
          riskScore: 0,
          performanceTrend: 'STABLE',
          recommendations: [],
          subjectPerformance: {},
        }
      }

      if (dialogMode === 'add') {
        const newStudent = await studentService.createStudent(studentData)
        setStudents([...students, newStudent])
        setSuccess('Student enrolled successfully!')
      } else if (dialogMode === 'edit') {
        const updatedStudent = await studentService.updateStudent(selectedStudent.id, studentData)
        const updatedStudents = students.map(s =>
          s.id === selectedStudent.id ? updatedStudent : s
        )
        setStudents(updatedStudents)
        setSuccess('Student updated successfully!')
      }

      setOpenDialog(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to save student: ' + error.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleStepNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, enrollmentSteps.length - 1))
    }
  }

  const handleStepBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      (student.user?.firstName?.toLowerCase().includes(searchLower)) ||
      (student.user?.lastName?.toLowerCase().includes(searchLower)) ||
      (student.user?.email?.toLowerCase().includes(searchLower)) ||
      (student.studentId?.toLowerCase().includes(searchLower)) ||
      (student.rollNumber?.toLowerCase().includes(searchLower))

    const matchesGrade = !gradeFilter || student.grade === gradeFilter
    const matchesSection = !sectionFilter || student.section === sectionFilter
    const matchesStatus = !statusFilter || student.academicStatus === statusFilter

    return matchesSearch && matchesGrade && matchesSection && matchesStatus
  })

  const getRiskColor = (score) => {
    if (score <= 25) return '#4caf50'
    if (score <= 50) return '#ff9800'
    return '#f44336'
  }

  const getRiskLevel = (score) => {
    if (score <= 25) return 'Low'
    if (score <= 50) return 'Medium'
    return 'High'
  }

  // Export students as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(students, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students_export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import students from JSON
  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
    fileInputRef.current?.click()
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const text = await file.text()
      const imported = JSON.parse(text)
      if (!Array.isArray(imported)) throw new Error('Invalid file format')
      // Optionally, validate structure here
      // Save to backend (optional) or just update state
      setStudents(imported)
      setSuccess('Students imported successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to import students: ' + err.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {[
        { title: 'Total Students', value: students.length, icon: PersonIcon, color: '#2196f3' },
        { title: 'Active Students', value: students.filter(s => s.academicStatus === 'ACTIVE').length, icon: GroupIcon, color: '#4caf50' },
        { title: 'New This Month', value: '5', icon: TrendingUpIcon, color: '#ff9800' },
        { title: 'At Risk', value: students.filter(s => s.aiInsights && s.aiInsights.riskScore > 50).length, icon: AssignmentIcon, color: '#f44336' },
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
                  onChange={(e) => handleFormChange('user.firstName', e.target.value)}
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
                  onChange={(e) => handleFormChange('user.lastName', e.target.value)}
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
                  onChange={(e) => handleFormChange('user.email', e.target.value)}
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
                  onChange={(e) => handleFormChange('user.phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.user.dateOfBirth}
                  onChange={(e) => handleFormChange('user.dateOfBirth', e.target.value)}
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
                    onChange={(e) => handleFormChange('user.gender', e.target.value)}
                    required
                  >
                    {genders.map((gender) => (
                      <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                    ))}
                  </Select>
                  {formErrors['user.gender'] && <FormHelperText>{formErrors['user.gender']}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={formData.user.address}
                  onChange={(e) => handleFormChange('user.address', e.target.value)}
                />
              </Grid>
            </Grid>
          )

        case 1: // Academic Details
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student ID"
                  value={formData.studentId}
                  onChange={(e) => handleFormChange('studentId', e.target.value)}
                  required
                  error={!!formErrors['studentId']}
                  helperText={formErrors['studentId']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Admission Number"
                  value={formData.admissionNumber}
                  onChange={(e) => handleFormChange('admissionNumber', e.target.value)}
                  required
                  error={!!formErrors['admissionNumber']}
                  helperText={formErrors['admissionNumber']}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!formErrors['grade']}>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={formData.grade}
                    onChange={(e) => handleFormChange('grade', e.target.value)}
                    required
                  >
                    {grades.map((grade) => (
                      <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                    ))}
                  </Select>
                  {formErrors['grade'] && <FormHelperText>{formErrors['grade']}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!formErrors['section']}>
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={formData.section}
                    onChange={(e) => handleFormChange('section', e.target.value)}
                    required
                  >
                    {sections.map((section) => (
                      <MenuItem key={section} value={section}>{section}</MenuItem>
                    ))}
                  </Select>
                  {formErrors['section'] && <FormHelperText>{formErrors['section']}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Roll Number"
                  value={formData.rollNumber}
                  onChange={(e) => handleFormChange('rollNumber', e.target.value)}
                  required
                  error={!!formErrors['rollNumber']}
                  helperText={formErrors['rollNumber']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Enrollment Date"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => handleFormChange('enrollmentDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                  error={!!formErrors['enrollmentDate']}
                  helperText={formErrors['enrollmentDate']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Academic Status</InputLabel>
                  <Select
                    value={formData.academicStatus}
                    onChange={(e) => handleFormChange('academicStatus', e.target.value)}
                  >
                    {academicStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )

        case 2: // Parent/Guardian Info
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Parent/Guardian Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent/Guardian First Name"
                  value={formData.parents[0]?.firstName || ''}
                  onChange={(e) => {
                    const newParents = [...formData.parents]
                    newParents[0] = { ...newParents[0], firstName: e.target.value }
                    setFormData(prev => ({ ...prev, parents: newParents }))
                    setFormErrors(prev => ({ ...prev, ['parents.0.firstName']: undefined }))
                  }}
                  required
                  error={!!formErrors['parents.0.firstName']}
                  helperText={formErrors['parents.0.firstName']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent/Guardian Last Name"
                  value={formData.parents[0]?.lastName || ''}
                  onChange={(e) => {
                    const newParents = [...formData.parents]
                    newParents[0] = { ...newParents[0], lastName: e.target.value }
                    setFormData(prev => ({ ...prev, parents: newParents }))
                    setFormErrors(prev => ({ ...prev, ['parents.0.lastName']: undefined }))
                  }}
                  required
                  error={!!formErrors['parents.0.lastName']}
                  helperText={formErrors['parents.0.lastName']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent/Guardian Email"
                  type="email"
                  value={formData.parents[0]?.email || ''}
                  onChange={(e) => {
                    const newParents = [...formData.parents]
                    newParents[0] = { ...newParents[0], email: e.target.value }
                    setFormData(prev => ({ ...prev, parents: newParents }))
                    setFormErrors(prev => ({ ...prev, ['parents.0.email']: undefined }))
                  }}
                  required
                  error={!!formErrors['parents.0.email']}
                  helperText={formErrors['parents.0.email']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent/Guardian Phone"
                  value={formData.parents[0]?.phone || ''}
                  onChange={(e) => {
                    const newParents = [...formData.parents]
                    newParents[0] = { ...newParents[0], phone: e.target.value }
                    setFormData(prev => ({ ...prev, parents: newParents }))
                    setFormErrors(prev => ({ ...prev, ['parents.0.phone']: undefined }))
                  }}
                  required
                  error={!!formErrors['parents.0.phone']}
                  helperText={formErrors['parents.0.phone']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Relationship</InputLabel>
                  <Select
                    value={formData.parents[0]?.relationship || 'FATHER'}
                    onChange={(e) => {
                      const newParents = [...formData.parents]
                      newParents[0] = { ...newParents[0], relationship: e.target.value }
                      setFormData(prev => ({ ...prev, parents: newParents }))
                    }}
                  >
                    {relationships.map((rel) => (
                      <MenuItem key={rel} value={rel}>{rel}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )

        case 3: // Medical Info
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                  Medical Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Blood Group</InputLabel>
                  <Select
                    value={formData.medicalInfo.bloodGroup}
                    onChange={(e) => handleFormChange('medicalInfo.bloodGroup', e.target.value)}
                  >
                    {bloodGroups.map((group) => (
                      <MenuItem key={group} value={group}>{group}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Medical Contact"
                  value={formData.medicalInfo.emergencyMedicalContact}
                  onChange={(e) => handleFormChange('medicalInfo.emergencyMedicalContact', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Special Needs or Medical Conditions"
                  multiline
                  rows={3}
                  value={formData.medicalInfo.specialNeeds}
                  onChange={(e) => handleFormChange('medicalInfo.specialNeeds', e.target.value)}
                />
              </Grid>
            </Grid>
          )

        default:
          return null
      }
    }

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
          <Button
            disabled={activeStep === 0}
            onClick={handleStepBack}
          >
            Back
          </Button>
          <Box>
            {activeStep < enrollmentSteps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleStepNext}
                sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSaveStudent}
                sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' }}
              >
                {dialogMode === 'add' ? 'Enroll Student' : 'Save Changes'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    )
  }

  const renderStudentDialog = () => (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      maxWidth="lg"
      fullWidth
      sx={{ '& .MuiDialog-paper': { minHeight: '80vh' } }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <SchoolIcon />
        {dialogMode === 'add' ? 'Enroll New Student' :
         dialogMode === 'edit' ? 'Edit Student Information' : 'Student Profile'}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 1, px: 4 }}>
        {dialogMode === 'view' && selectedStudent ? (
          <Box>
            <Typography variant="h6">Student Details</Typography>
            <Typography>Name: {selectedStudent.user?.firstName} {selectedStudent.user?.lastName}</Typography>
            <Typography>Email: {selectedStudent.user?.email}</Typography>
            <Typography>Grade: {selectedStudent.grade}</Typography>
            <Typography>Section: {selectedStudent.section}</Typography>
          </Box>
        ) : (
          renderEnrollmentForm()
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={() => setOpenDialog(false)}>
          {dialogMode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {dialogMode === 'view' && (
          <Button
            onClick={() => {
              handleEditStudent(selectedStudent)
            }}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
              px: 3
            }}
          >
            Edit Student
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )

  if (loading) {
    return (
      <DashboardLayout title="Student Management">
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
            Loading Students...
          </Typography>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Student Management">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
            👨‍🎓 Student Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage student enrollment, track academic progress, and monitor performance
          </Typography>
        </Box>

        {/* Alerts */}
        {success && (
          <Alert severity="success" sx={{ mb: 3, backgroundColor: '#e8f5e8' }} onClose={() => setSuccess('')}>
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
                  placeholder="Search students..."
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
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                  >
                    <MenuItem value="">All Grades</MenuItem>
                    {grades.map((grade) => (
                      <MenuItem key={grade} value={grade}>Grade {grade}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                  >
                    <MenuItem value="">All Sections</MenuItem>
                    {sections.map((section) => (
                      <MenuItem key={section} value={section}>Section {section}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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
                    onClick={handleAddStudent}
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    }}
                  >
                    Enroll Student
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID / Roll No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Grade & Section</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>GPA</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Attendance</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>AI Risk</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      sx={{
                        '&:hover': { backgroundColor: '#f8f9fa' },
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#1976d2' }}>
                            {student.user?.firstName?.[0] || 'S'}{student.user?.lastName?.[0] || 'T'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {student.user?.firstName || 'N/A'} {student.user?.lastName || ''}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {student.user?.email || 'No email'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {student.studentId || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Roll: {student.rollNumber || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`${student.grade || 'N/A'}${student.section || ''}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: (student.currentGPA || 0) >= 3.5 ? '#4caf50' :
                                     (student.currentGPA || 0) >= 3.0 ? '#ff9800' : '#f44336'
                            }}
                          >
                            {(student.currentGPA || 0).toFixed(1)}
                          </Typography>
                          <StarIcon
                            sx={{
                              fontSize: '1rem',
                              color: (student.currentGPA || 0) >= 3.5 ? '#4caf50' :
                                     (student.currentGPA || 0) >= 3.0 ? '#ff9800' : '#f44336'
                            }}
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {(student.attendanceRate || 0).toFixed(1)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={student.attendanceRate || 0}
                            sx={{
                              mt: 0.5,
                              height: 4,
                              borderRadius: 2,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: (student.attendanceRate || 0) >= 95 ? '#4caf50' :
                                               (student.attendanceRate || 0) >= 85 ? '#ff9800' : '#f44336'
                              }
                            }}
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: getRiskColor(student.aiInsights?.riskScore || 0)
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color: getRiskColor(student.aiInsights?.riskScore || 0)
                            }}
                          >
                            {getRiskLevel(student.aiInsights?.riskScore || 0)}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={student.academicStatus || 'ACTIVE'}
                          size="small"
                          color={(student.academicStatus || 'ACTIVE') === 'ACTIVE' ? 'success' : 'default'}
                        />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Profile">
                            <IconButton
                              size="small"
                              onClick={() => handleViewStudent(student)}
                              sx={{ color: '#1976d2' }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEditStudent(student)}
                              sx={{ color: '#ff9800' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteStudent(student.id)}
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
        {renderStudentDialog()}
      </Box>
    </DashboardLayout>
  )
}

export default StudentManagement
