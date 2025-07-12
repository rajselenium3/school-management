import React, { useState, useEffect } from 'react'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  Stepper,
  Step,
  StepLabel,
  Switch,
  FormControlLabel,
  Autocomplete,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Visibility as ViewIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Grade as GradeIcon,
  SmartToy as AIIcon,
  ContentCopy as CopyIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  DateRange as DateIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material'

import DashboardLayout from '../../components/layout/DashboardLayout.js'
import assignmentService from '../../services/assignmentService.js'
import courseService from '../../services/courseService.js'

const AssignmentManagement = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Data states
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [statistics, setStatistics] = useState({})
  const [analytics, setAnalytics] = useState({})

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Dialog states
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false)
  const [dialogMode, setDialogMode] = useState('add') // 'add', 'edit', 'view'
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [activeStep, setActiveStep] = useState(0)

  // Form state
  const [formData, setFormData] = useState(assignmentService.createAssignmentTemplate())

  const tabs = ['My Assignments', 'Create Assignment', 'Assignment Analytics', 'Due Soon']
  const assignmentTypes = assignmentService.getAssignmentTypes()
  const assignmentSteps = ['Basic Info', 'Details & Instructions', 'Grading & Rubric', 'Distribution']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [assignmentsData, coursesData, statsData] = await Promise.all([
        assignmentService.getAllAssignments(), // In real app, filter by teacher
        courseService.getAllCourses(),
        assignmentService.getAssignmentStatistics()
      ])

      setAssignments(assignmentsData.map(a => assignmentService.formatAssignment(a)))
      setCourses(coursesData)
      setStatistics(statsData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load assignment data: ' + error.message)
      setLoading(false)
    }
  }

  const handleCreateAssignment = () => {
    setDialogMode('add')
    setSelectedAssignment(null)
    setActiveStep(0)
    setFormData(assignmentService.createAssignmentTemplate())
    setOpenAssignmentDialog(true)
  }

  const handleEditAssignment = (assignment) => {
    setDialogMode('edit')
    setSelectedAssignment(assignment)
    setActiveStep(0)
    setFormData({
      ...assignment,
      course: assignment.course?.id || '',
      dueDate: new Date(assignment.dueDate).toISOString().slice(0, 16)
    })
    setOpenAssignmentDialog(true)
  }

  const handleViewAssignment = (assignment) => {
    setDialogMode('view')
    setSelectedAssignment(assignment)
    setOpenAssignmentDialog(true)
  }

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentService.deleteAssignment(assignmentId)
        setAssignments(assignments.filter(a => a.id !== assignmentId))
        setSuccess('Assignment deleted successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } catch (error) {
        setError('Failed to delete assignment: ' + error.message)
        setTimeout(() => setError(''), 3000)
      }
    }
  }

  const handleDuplicateAssignment = async (assignment) => {
    try {
      const newTitle = `${assignment.title} (Copy)`
      const duplicatedAssignment = await assignmentService.duplicateAssignment(assignment.id, newTitle)
      const formattedAssignment = assignmentService.formatAssignment(duplicatedAssignment)
      setAssignments([formattedAssignment, ...assignments])
      setSuccess('Assignment duplicated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to duplicate assignment: ' + error.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSaveAssignment = async () => {
    try {
      // Find selected course
      const selectedCourse = courses.find(c => c.id === formData.course)
      if (!selectedCourse) {
        setError('Please select a course')
        return
      }

      const assignmentData = {
        ...formData,
        course: selectedCourse,
        dueDate: new Date(formData.dueDate).toISOString()
      }

      if (dialogMode === 'add') {
        const newAssignment = await assignmentService.createAssignment(assignmentData)
        const formattedAssignment = assignmentService.formatAssignment(newAssignment)
        setAssignments([formattedAssignment, ...assignments])
        setSuccess('Assignment created successfully!')
      } else if (dialogMode === 'edit') {
        const updatedAssignment = await assignmentService.updateAssignment(selectedAssignment.id, assignmentData)
        const formattedAssignment = assignmentService.formatAssignment(updatedAssignment)
        const updatedAssignments = assignments.map(a =>
          a.id === selectedAssignment.id ? formattedAssignment : a
        )
        setAssignments(updatedAssignments)
        setSuccess('Assignment updated successfully!')
      }

      setOpenAssignmentDialog(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to save assignment: ' + error.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStepNext = () => {
    setActiveStep(prev => Math.min(prev + 1, assignmentSteps.length - 1))
  }

  const handleStepBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0))
  }

  const filteredAssignments = assignments.filter(assignment => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = !searchTerm ||
      assignment.title?.toLowerCase().includes(searchLower) ||
      assignment.description?.toLowerCase().includes(searchLower) ||
      assignment.course?.courseName?.toLowerCase().includes(searchLower)

    const matchesType = !typeFilter || assignment.type === typeFilter
    const matchesCourse = !courseFilter || assignment.course?.id === courseFilter

    return matchesSearch && matchesType && matchesCourse
  })

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {[
        { title: 'Total Assignments', value: statistics.totalAssignments || 0, icon: AssignmentIcon, color: '#2196f3' },
        { title: 'Due Soon', value: statistics.upcomingAssignments || 0, icon: ScheduleIcon, color: '#ff9800' },
        { title: 'Pending Grading', value: statistics.pendingGrading || 0, icon: GradeIcon, color: '#f44336' },
        { title: 'AI Enabled', value: assignments.filter(a => a.aiGradingEnabled).length, icon: AIIcon, color: '#9c27b0' },
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

  const renderAssignmentsList = () => (
    <Box>
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search assignments..."
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

            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {assignmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <MenuItem value="">All Courses</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.courseName}
                    </MenuItem>
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
                >
                  Export
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateAssignment}
                  sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}
                >
                  Create Assignment
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assignment</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Submissions</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Grading</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: assignment.statusColor }}>
                          <AssignmentIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {assignment.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Max Score: {assignment.maxScore} points
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {assignment.course?.courseName || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {assignment.course?.courseCode || 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={assignment.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {assignment.formattedDueDate}
                        </Typography>
                        <Chip
                          label={assignment.urgency}
                          size="small"
                          sx={{
                            backgroundColor: `${assignment.statusColor}20`,
                            color: assignment.statusColor,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {assignment.submissions || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignment.submissionRate}% submitted
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {assignment.graded || 0}/{assignment.submissions || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignment.gradingProgress}% graded
                        </Typography>
                        {assignment.aiGradingEnabled && (
                          <AIIcon sx={{ fontSize: '1rem', color: '#9c27b0', ml: 0.5 }} />
                        )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Assignment">
                          <IconButton
                            size="small"
                            onClick={() => handleViewAssignment(assignment)}
                            sx={{ color: '#1976d2' }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Assignment">
                          <IconButton
                            size="small"
                            onClick={() => handleEditAssignment(assignment)}
                            sx={{ color: '#ff9800' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Duplicate Assignment">
                          <IconButton
                            size="small"
                            onClick={() => handleDuplicateAssignment(assignment)}
                            sx={{ color: '#4caf50' }}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Assignment">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteAssignment(assignment.id)}
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
    </Box>
  )

  const renderCreateAssignment = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AddIcon />
        Create New Assignment
      </Typography>

      <Card>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateAssignment}
            sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}
          >
            Start Creating Assignment
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Create assignments with detailed instructions, rubrics, and AI-powered grading.
            Distribute to your courses and track student submissions.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )

  const renderAnalytics = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AnalyticsIcon />
        Assignment Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Assignment Distribution</Typography>
              <Box sx={{ mt: 2 }}>
                {statistics.assignmentsByType && Object.entries(statistics.assignmentsByType).map(([type, count]) => (
                  <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{type}:</Typography>
                    <Typography variant="body2">{count}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Submission Rates</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Average Submission Rate: {(statistics.averageSubmissionRate || 0).toFixed(1)}%
                </Typography>
                <Typography variant="body2">
                  Total Assignments: {statistics.totalAssignments || 0}
                </Typography>
                <Typography variant="body2">
                  Pending Grading: {statistics.pendingGrading || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )

  const renderDueSoon = () => {
    const dueSoonAssignments = assignments.filter(a => {
      const dueDate = new Date(a.dueDate)
      const now = new Date()
      const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
      return daysDiff >= 0 && daysDiff <= 7
    })

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScheduleIcon />
          Assignments Due Soon
        </Typography>

        {dueSoonAssignments.length > 0 ? (
          <Grid container spacing={3}>
            {dueSoonAssignments.map((assignment, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: assignment.statusColor }}>
                        <AssignmentIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {assignment.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {assignment.course?.courseName}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={assignment.urgency}
                      size="small"
                      sx={{
                        backgroundColor: `${assignment.statusColor}20`,
                        color: assignment.statusColor,
                        mb: 1
                      }}
                    />

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Submissions: {assignment.submissions || 0}
                    </Typography>

                    <Typography variant="body2">
                      Graded: {assignment.graded || 0}/{assignment.submissions || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No assignments due in the next 7 days
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    )
  }

  const renderAssignmentForm = () => {
    const renderStepContent = (step) => {
      switch (step) {
        case 0: // Basic Info
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assignment Title"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  required
                  placeholder="e.g., Chapter 5 Homework, Quiz on Functions"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Assignment Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    required
                  >
                    {assignmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={formData.course}
                    onChange={(e) => handleFormChange('course', e.target.value)}
                    required
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.courseName} ({course.courseCode})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Score"
                  type="number"
                  value={formData.maxScore}
                  onChange={(e) => {
                    const value = e.target.value
                    // Remove leading zeros and handle empty string
                    const cleanedValue = value === '' ? '' : Number(value)
                    handleFormChange('maxScore', cleanedValue)
                  }}
                  onFocus={(e) => {
                    // Remove leading zeros when field gets focus
                    if (e.target.value && Number(e.target.value) > 0) {
                      e.target.value = Number(e.target.value).toString()
                    }
                  }}
                  inputProps={{
                    min: 1,
                    step: 1
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => handleFormChange('dueDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          )

        case 1: // Details & Instructions
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Brief description of the assignment..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructions"
                  multiline
                  rows={6}
                  value={formData.instructions}
                  onChange={(e) => handleFormChange('instructions', e.target.value)}
                  placeholder="Detailed instructions for students..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => {
                    const value = e.target.value
                    // Remove leading zeros and handle empty string
                    const cleanedValue = value === '' ? '' : Number(value)
                    handleFormChange('weight', cleanedValue)
                  }}
                  onFocus={(e) => {
                    // Remove leading zeros when field gets focus
                    if (e.target.value && Number(e.target.value) >= 0) {
                      e.target.value = Number(e.target.value).toString()
                    }
                  }}
                  inputProps={{
                    min: 0,
                    step: 0.1
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="Weight in final grade calculation"
                />
              </Grid>
            </Grid>
          )

        case 2: // Grading & Rubric
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.aiGradingEnabled}
                      onChange={(e) => handleFormChange('aiGradingEnabled', e.target.checked)}
                    />
                  }
                  label="Enable AI-Assisted Grading"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Rubric and grading criteria can be added here. For now, basic grading settings are applied.
                </Typography>
              </Grid>
            </Grid>
          )

        case 3: // Distribution
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Distribution Summary
                </Typography>
                <Typography variant="body1">
                  <strong>Assignment:</strong> {formData.title}
                </Typography>
                <Typography variant="body1">
                  <strong>Course:</strong> {courses.find(c => c.id === formData.course)?.courseName}
                </Typography>
                <Typography variant="body1">
                  <strong>Due Date:</strong> {new Date(formData.dueDate).toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Max Score:</strong> {formData.maxScore} points
                </Typography>
                <Typography variant="body1">
                  <strong>AI Grading:</strong> {formData.aiGradingEnabled ? 'Enabled' : 'Disabled'}
                </Typography>
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
          {assignmentSteps.map((label) => (
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
            {activeStep < assignmentSteps.length - 1 ? (
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
                onClick={handleSaveAssignment}
                startIcon={<SendIcon />}
                sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' }}
              >
                {dialogMode === 'add' ? 'Create & Distribute' : 'Save Changes'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    )
  }

  const renderAssignmentDialog = () => (
    <Dialog
      open={openAssignmentDialog}
      onClose={() => setOpenAssignmentDialog(false)}
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
        <AssignmentIcon />
        {dialogMode === 'add' ? 'Create New Assignment' :
         dialogMode === 'edit' ? 'Edit Assignment' : 'Assignment Details'}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {dialogMode === 'view' && selectedAssignment ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              {selectedAssignment.title}
            </Typography>
            <Typography><strong>Course:</strong> {selectedAssignment.course?.courseName}</Typography>
            <Typography><strong>Type:</strong> {selectedAssignment.type}</Typography>
            <Typography><strong>Due Date:</strong> {selectedAssignment.formattedDueDate}</Typography>
            <Typography><strong>Max Score:</strong> {selectedAssignment.maxScore} points</Typography>
            <Typography><strong>AI Grading:</strong> {selectedAssignment.aiGradingEnabled ? 'Enabled' : 'Disabled'}</Typography>
            {selectedAssignment.description && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Description:</Typography>
                <Typography>{selectedAssignment.description}</Typography>
              </Box>
            )}
          </Box>
        ) : (
          renderAssignmentForm()
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setOpenAssignmentDialog(false)}>
          {dialogMode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {dialogMode === 'view' && (
          <Button
            onClick={() => {
              handleEditAssignment(selectedAssignment)
            }}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)' }}
          >
            Edit Assignment
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )

  const renderTabContent = () => {
    switch (currentTab) {
      case 0: return renderAssignmentsList()
      case 1: return renderCreateAssignment()
      case 2: return renderAnalytics()
      case 3: return renderDueSoon()
      default: return renderAssignmentsList()
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Assignment Management">
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
            Loading Assignments...
          </Typography>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Assignment Management">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
            📝 Assignment Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Create, distribute, and manage assignments with AI-powered grading
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

        {/* Assignment Dialog */}
        {renderAssignmentDialog()}
      </Box>
    </DashboardLayout>
  )
}

export default AssignmentManagement
