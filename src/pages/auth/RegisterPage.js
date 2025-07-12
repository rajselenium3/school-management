import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  FormHelperText,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon,
  PhotoCamera as PhotoCameraIcon,
  CloudUpload as UploadIcon,
  VpnKey as PasscodeIcon,
  FamilyRestroom as ChildIcon,
} from '@mui/icons-material'

import authService from '../../services/authService.js'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profilePicture, setProfilePicture] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  // Form validation state
  const [formErrors, setFormErrors] = useState({})

  // Form data with passcode and child mapping
  const [formData, setFormData] = useState({
    // Step 1: Access Verification
    accessCode: '',

    // Step 2: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',

    // Step 3: Security
    password: '',
    confirmPassword: '',

    // Step 4: Role-specific info
    // For Parents
    childId: '',

    // For Students/Teachers (auto-filled after passcode verification)
    department: '',
    employmentType: '',
    grade: '',
    section: '',
  })

  const steps = ['Access Verification', 'Basic Information', 'Security Setup', 'Role-Specific Info', 'Confirmation']

  // Validate passcode and populate role info
  const validateAccessCode = async () => {
    try {
      setLoading(true)
      setError('')

      // Check access codes from localStorage (temporary until backend endpoints are added)
      const accessCodes = JSON.parse(localStorage.getItem('access_codes') || '[]')
      const validCode = accessCodes.find(code =>
        code.code === formData.accessCode.toUpperCase() &&
        !code.isUsed &&
        new Date(code.validUntil) > new Date()
      )

      if (!validCode) {
        setFormErrors({ accessCode: 'Invalid or expired access code' })
        return false
      }

      // Auto-populate role
      setFormData(prev => ({
        ...prev,
        role: validCode.role
      }))

      setSuccess('Access code verified successfully!')
      return true
    } catch (err) {
      setError('Failed to verify access code: ' + err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Validate child ID for parents
  const validateChildId = async () => {
    try {
      if (formData.role !== 'PARENT') return true

      // Check parent-child mappings from localStorage (temporary until backend endpoints are added)
      const mappings = JSON.parse(localStorage.getItem('parent_child_mappings') || '[]')
      const validMapping = mappings.find(mapping =>
        mapping.childId === formData.childId.toUpperCase() &&
        mapping.isActive
      )

      if (!validMapping) {
        setFormErrors({ childId: 'Invalid child ID or child not found' })
        return false
      }

      setSuccess('Child ID verified successfully!')
      return true
    } catch (err) {
      setError('Failed to verify child ID: ' + err.message)
      return false
    }
  }

  // Form validation
  const validateStep = (step) => {
    let errors = {}

    switch (step) {
      case 0: // Access Verification
        if (!formData.accessCode.trim()) {
          errors.accessCode = 'Access code is required'
        }
        break

      case 1: // Basic Information
        if (!formData.firstName.trim()) errors.firstName = 'First name is required'
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
        if (!formData.email.trim()) errors.email = 'Email is required'
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) errors.email = 'Invalid email'
        if (!formData.phone.trim()) errors.phone = 'Phone number is required'
        break

      case 2: // Security Setup
        if (!formData.password) errors.password = 'Password is required'
        else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters'
        if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password'
        else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match'
        break

      case 3: // Role-specific
        if (formData.role === 'PARENT' && !formData.childId.trim()) {
          errors.childId = 'Child ID is required for parent registration'
        }
        break

      default:
        break
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) return

    // Special validation for access code step
    if (currentStep === 0) {
      const isValid = await validateAccessCode()
      if (!isValid) return
    }

    // Special validation for child ID step
    if (currentStep === 3 && formData.role === 'PARENT') {
      const isValid = await validateChildId()
      if (!isValid) return
    }

    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Profile picture must be less than 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }

      setSelectedFile(file)
      setError('')

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicture(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const getDefaultAvatar = () => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f']
    const colorIndex = (formData.firstName?.length || 0) % colors.length
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${formData.firstName} ${formData.lastName}`
    )}&background=${colors[colorIndex].substring(1)}&color=fff&size=200`
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    try {
      setLoading(true)
      setError('')

      // Mark access code as used (temporary localStorage solution)
      const accessCodes = JSON.parse(localStorage.getItem('access_codes') || '[]')
      const updatedCodes = accessCodes.map(code =>
        code.code === formData.accessCode.toUpperCase()
          ? { ...code, isUsed: true, usedBy: formData.email }
          : code
      )
      localStorage.setItem('access_codes', JSON.stringify(updatedCodes))

      // Save profile picture to localStorage for demo mode
      if (profilePicture) {
        localStorage.setItem(`profilePicture_${formData.email.trim().toLowerCase()}`, profilePicture)
      }

      // Register user via auth service
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        profilePicture,
        // Role-specific data
        childId: formData.role === 'PARENT' ? formData.childId : undefined,
        department: formData.department,
        grade: formData.grade,
        section: formData.section,
      })

      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Access Verification
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Enter the access code provided by your school administrator to begin registration.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Access Code"
                value={formData.accessCode}
                onChange={(e) => handleInputChange('accessCode', e.target.value.toUpperCase())}
                placeholder="e.g., S12345678"
                error={!!formErrors.accessCode}
                helperText={formErrors.accessCode || 'Contact your school administrator if you need an access code'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasscodeIcon />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: { textTransform: 'uppercase' },
                  maxLength: 9
                }}
                required
              />
            </Grid>
          </Grid>
        )

      case 1: // Basic Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Access verified! Role: <strong>{formData.role}</strong>
              </Alert>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                required
              />
            </Grid>
          </Grid>
        )

      case 2: // Security Setup
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={!!formErrors.password}
                helperText={formErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
          </Grid>
        )

      case 3: // Role-specific Information
        if (formData.role === 'PARENT') {
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Enter your child's ID to link your parent account.
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Child ID"
                  value={formData.childId}
                  onChange={(e) => handleInputChange('childId', e.target.value.toUpperCase())}
                  placeholder="e.g., CHD12345678"
                  error={!!formErrors.childId}
                  helperText={formErrors.childId || 'Contact the school office to get your child\'s ID'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ChildIcon />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    style: { textTransform: 'uppercase' },
                    maxLength: 11
                  }}
                  required
                />
              </Grid>
            </Grid>
          )
        }

        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Your {formData.role.toLowerCase()} account is almost ready!
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                Additional account details will be configured by your administrator after registration.
              </Typography>
            </Grid>
          </Grid>
        )

      case 4: // Confirmation
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Please review your information before submitting.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom>Registration Summary</Typography>
                <Typography><strong>Name:</strong> {formData.firstName} {formData.lastName}</Typography>
                <Typography><strong>Email:</strong> {formData.email}</Typography>
                <Typography><strong>Phone:</strong> {formData.phone}</Typography>
                <Typography><strong>Role:</strong> {formData.role}</Typography>
                {formData.role === 'PARENT' && (
                  <Typography><strong>Child ID:</strong> {formData.childId}</Typography>
                )}
                {profilePicture && (
                  <Typography><strong>Profile Picture:</strong> ✓ Uploaded</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <Box>
                <Avatar
                  src={profilePicture || getDefaultAvatar()}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                >
                  {`${formData.firstName[0] || ''}${formData.lastName[0] || ''}`}
                </Avatar>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-picture-upload"
                  type="file"
                  onChange={handleFileSelect}
                />
                <label htmlFor="profile-picture-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 1 }}
                  >
                    {profilePicture ? 'Change Profile Picture' : 'Upload Profile Picture'}
                  </Button>
                </label>
                {selectedFile && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                  </Typography>
                )}
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                  Supported formats: JPG, PNG, GIF (Max 5MB)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 3
    }}>
      <Paper elevation={12} sx={{
        p: 4,
        maxWidth: 600,
        width: '100%',
        mx: 2,
        borderRadius: 3
      }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar sx={{
            mx: 'auto',
            bgcolor: 'primary.main',
            width: 56,
            height: 56,
            mb: 2
          }}>
            <SchoolIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join our school management system
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>
          {renderStepContent()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 0 || loading}
            startIcon={<BackIcon />}
          >
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4
              }}
            >
              Create Account
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4
              }}
            >
              Next
            </Button>
          )}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default RegisterPage
