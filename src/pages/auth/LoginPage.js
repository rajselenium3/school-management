import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
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
  Chip,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material'
import {
  School as SchoolIcon,
  SmartToy as BrainIcon,
  People as UsersIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
} from '@mui/icons-material'

import authService from '../../services/authService.js'
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice.js'
import './LoginPage.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Check for messages from other pages (like registration success)
  const locationMessage = location.state?.message
  const prefillEmail = location.state?.email

  React.useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail)
    }
  }, [prefillEmail])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    dispatch(loginStart())

    try {
      console.log('🔐 Attempting login with:', { email })

      // SECURITY FIX: Don't send role selection to backend - let backend determine role from database
      const response = await authService.login({
        email,
        password
        // role removed - backend should determine this from user's actual role in database
      })

      console.log('✅ Login response:', response)

      // Check if email verification is required
      if (response.requiresEmailVerification) {
        console.log('📧 Email verification required, redirecting...')
        navigate('/email-verification', {
          state: {
            email: response.email,
            pendingAuthData: {
              user: {
                uid: response.email,
                email: response.email,
                displayName: `${response.firstName} ${response.lastName}`,
                firstName: response.firstName,
                lastName: response.lastName,
              },
              role: response.roles[0] || role?.toUpperCase() || 'ADMIN',
              token: response.token
            }
          }
        })
        return
      }

      // SECURITY FIX: Use ONLY the role from database response, ignore form selection
      const primaryRole = response.roles && response.roles.length > 0
        ? response.roles[0]
        : null

      if (!primaryRole) {
        throw new Error('Invalid user account - no role assigned. Please contact administrator.')
      }

      console.log('👤 Using database role:', primaryRole, '(ignoring form selection for security)')

      const userPayload = {
        user: {
          uid: response.email,
          email: response.email,
          displayName: `${response.firstName} ${response.lastName}`,
          firstName: response.firstName,
          lastName: response.lastName,
        },
        role: primaryRole,
        token: response.token
      }

      console.log('📤 Dispatching loginSuccess with:', userPayload)
      dispatch(loginSuccess(userPayload))

      const dashboardPath = `/dashboard/${primaryRole.toLowerCase()}`
      console.log('🧭 Navigating to:', dashboardPath)
      navigate(dashboardPath)
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed. Please check your credentials.')
      dispatch(loginFailure(error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoRole) => {
    setLoading(true)
    setError('')
    dispatch(loginStart())

    try {
      console.log('🎭 Direct demo login for:', demoRole)

      // Use direct demo login to bypass backend entirely
      const response = await authService.directDemoLogin(demoRole)
      console.log('✅ Demo login response:', response)

      // Extract primary role from roles array
      const primaryRole = response.roles && response.roles.length > 0
        ? response.roles[0]
        : demoRole.toUpperCase()

      console.log('👤 Demo setting role:', primaryRole)

      const userPayload = {
        user: {
          uid: response.email,
          email: response.email,
          displayName: `${response.firstName} ${response.lastName}`,
          firstName: response.firstName,
          lastName: response.lastName,
        },
        role: primaryRole,
        token: response.token
      }

      console.log('📤 Demo dispatching loginSuccess with:', userPayload)
      dispatch(loginSuccess(userPayload))

      const dashboardPath = `/dashboard/${primaryRole.toLowerCase()}`
      console.log('🧭 Demo navigating to:', dashboardPath)
      navigate(dashboardPath)
    } catch (error) {
      console.error('Demo login error:', error)
      setError(`Demo login failed: ${error.message}`)
      dispatch(loginFailure(error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    dispatch(loginStart())

    try {
      console.log('🔐 Attempting Google OAuth login')

      const response = await authService.googleLogin()
      console.log('✅ Google login response:', response)

      // Check if email verification is required
      if (response.requiresEmailVerification) {
        console.log('📧 Email verification required for Google login, redirecting...')
        navigate('/email-verification', {
          state: {
            email: response.email,
            pendingAuthData: {
              user: {
                uid: response.email,
                email: response.email,
                displayName: response.displayName,
                firstName: response.firstName,
                lastName: response.lastName,
              },
              role: response.roles[0] || 'STUDENT',
              token: response.token
            }
          }
        })
        return
      }

      // Complete login if no verification required
      const userPayload = {
        user: {
          uid: response.email,
          email: response.email,
          displayName: response.displayName,
          firstName: response.firstName,
          lastName: response.lastName,
        },
        role: response.roles[0] || 'STUDENT',
        token: response.token
      }

      dispatch(loginSuccess(userPayload))
      const dashboardPath = `/dashboard/${userPayload.role.toLowerCase()}`
      navigate(dashboardPath)

    } catch (error) {
      console.error('Google login error:', error)
      setError(error.message || 'Google login failed. Please try again.')
      dispatch(loginFailure(error.message))
    } finally {
      setLoading(false)
    }
  }

  // Debug function to check demo mode status
  const checkDemoStatus = () => {
    const token = localStorage.getItem('authToken')
    const demoFlag = localStorage.getItem('demoMode')
    const isDemo = (token && token.startsWith('demo-jwt-')) || demoFlag === 'true'

    console.log('🔍 Demo Status Check:', {
      token: token ? token.substring(0, 30) + '...' : 'none',
      demoFlag,
      isDemo,
      localStorage: {
        authToken: localStorage.getItem('authToken'),
        userRole: localStorage.getItem('userRole'),
        demoMode: localStorage.getItem('demoMode'),
        userInfo: localStorage.getItem('userInfo')
      }
    })
  }

  return (
    <Box className="login-page">
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Left Side - Branding */}
        <Grid item xs={12} lg={7} className="login-branding">
          <Box className="branding-content">
            <Box className="branding-header">
              <SchoolIcon className="branding-icon" />
              <Typography variant="h3" className="branding-title">
                EduAI Management
              </Typography>
            </Box>
            <Typography variant="h6" className="branding-subtitle">
              Comprehensive AI-powered school management system for modern education
            </Typography>

            <Grid container spacing={3} className="features-grid">
              <Grid item xs={12} sm={6}>
                <Box className="feature-card">
                  <BrainIcon className="feature-icon brain" />
                  <Typography variant="h6" className="feature-title">
                    AI-Powered Insights
                  </Typography>
                  <Typography variant="body2" className="feature-description">
                    Intelligent analytics and predictive modeling for better decision making
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="feature-card">
                  <UsersIcon className="feature-icon users" />
                  <Typography variant="h6" className="feature-title">
                    User Management
                  </Typography>
                  <Typography variant="body2" className="feature-description">
                    Comprehensive role-based access control for all stakeholders
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="feature-card">
                  <ScheduleIcon className="feature-icon schedule" />
                  <Typography variant="h6" className="feature-title">
                    Smart Scheduling
                  </Typography>
                  <Typography variant="body2" className="feature-description">
                    AI-optimized timetable management and resource allocation
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box className="feature-card">
                  <AnalyticsIcon className="feature-icon analytics" />
                  <Typography variant="h6" className="feature-title">
                    Analytics Dashboard
                  </Typography>
                  <Typography variant="body2" className="feature-description">
                    Real-time performance tracking and comprehensive reporting
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid item xs={12} lg={5} className="login-form-container">
          <Paper className="login-form-paper">
            <Typography variant="h4" className="login-title">
              Sign In
            </Typography>
            <Typography variant="body1" className="login-subtitle">
              Enter your credentials to access the school management system
            </Typography>

            {locationMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {locationMessage}
              </Alert>
            )}

            {error && (
              <Alert severity="error" className="login-error">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.edu"
                className="form-field"
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-field"
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* SECURITY FIX: Removed role selection - role comes from your account in database */}
              {/* Your role is automatically determined based on your registered account */}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                className="login-button"
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" />
                    <span style={{ marginLeft: 8 }}>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                to="/forgot-password"
                style={{ color: '#1976d2', textDecoration: 'none' }}
              >
                Forgot your password?
              </Link>
            </Box>

            {/* Google Login */}
            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={handleGoogleLogin}
                disabled={loading}
                startIcon={<GoogleIcon />}
                sx={{
                  borderColor: '#db4437',
                  color: '#db4437',
                  '&:hover': {
                    borderColor: '#c23321',
                    backgroundColor: '#ffeaea'
                  }
                }}
              >
                {loading ? 'Connecting...' : 'Continue with Google'}
              </Button>
            </Box>

            <Divider className="login-divider">
              <Chip label="Quick Demo Access" size="small" />
            </Divider>

            <Box className="demo-buttons">
              <Button
                variant="outlined"
                size="small"
                className="demo-button"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
              >
                Admin Demo
              </Button>
              <Button
                variant="outlined"
                size="small"
                className="demo-button"
                onClick={() => handleDemoLogin('teacher')}
                disabled={loading}
              >
                Teacher Demo
              </Button>
              <Button
                variant="outlined"
                size="small"
                className="demo-button"
                onClick={() => handleDemoLogin('student')}
                disabled={loading}
              >
                Student Demo
              </Button>
              <Button
                variant="outlined"
                size="small"
                className="demo-button"
                onClick={() => handleDemoLogin('parent')}
                disabled={loading}
              >
                Parent Demo
              </Button>
            </Box>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LoginPage
