import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Send as SendIcon,
  CheckCircle as CheckIcon,
  School as SchoolIcon,
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'

import authService from '../../services/authService.js'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendLoading, setResendLoading] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    resetToken: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Timer for resend code
  const [resendTimer, setResendTimer] = useState(0)

  const steps = ['Enter Email', 'Verify Code', 'Reset Password']

  React.useEffect(() => {
    let interval = null
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /[0-9]/.test(password)
  }

  const handleSendResetCode = async () => {
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      await authService.requestPasswordReset(formData.email)
      setSuccess('Password reset code sent to your email address. Please check your inbox.')
      setCurrentStep(1)
      setResendTimer(60) // 60 seconds before resend is allowed
    } catch (error) {
      setError(error.message || 'Failed to send reset code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendLoading(true)
    setError('')

    try {
      await authService.requestPasswordReset(formData.email)
      setSuccess('New reset code sent to your email address.')
      setResendTimer(60)
    } catch (error) {
      setError(error.message || 'Failed to resend code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!formData.verificationCode || formData.verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Verify the code (this would normally validate with backend)
      const response = await authService.verifyResetCode(formData.email, formData.verificationCode)
      setFormData(prev => ({ ...prev, resetToken: response.resetToken }))
      setSuccess('Code verified successfully. Please set your new password.')
      setCurrentStep(2)
    } catch (error) {
      setError(error.message || 'Invalid or expired verification code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!validatePassword(formData.newPassword)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and numbers')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      await authService.resetPassword({
        email: formData.email,
        resetToken: formData.resetToken,
        newPassword: formData.newPassword,
      })

      setSuccess('Password reset successfully! You can now login with your new password.')

      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Password reset successfully! Please login with your new password.',
            email: formData.email
          }
        })
      }, 3000)

    } catch (error) {
      setError(error.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Enter Your Email Address
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
              We'll send a 6-digit verification code to your registered email address.
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your registered email"
              sx={{ mb: 3 }}
              required
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSendResetCode}
              disabled={loading || !formData.email}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                py: 1.5
              }}
            >
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </Button>
          </Box>
        )

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Enter Verification Code
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
              We sent a 6-digit code to <strong>{formData.email}</strong>
            </Typography>

            <TextField
              fullWidth
              label="6-Digit Code"
              value={formData.verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setFormData(prev => ({ ...prev, verificationCode: value }))
              }}
              InputLabelProps={{ shrink: true }}
              placeholder="000000"
              inputProps={{
                maxLength: 6,
                style: { textAlign: 'center', fontSize: '1.2em', letterSpacing: '0.5em' }
              }}
              sx={{ mb: 3 }}
              required
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyCode}
              disabled={loading || formData.verificationCode.length !== 6}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                py: 1.5,
                mb: 2
              }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Didn't receive the code?
              </Typography>
              <Button
                variant="text"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || resendLoading}
                startIcon={resendLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
                sx={{ textTransform: 'none' }}
              >
                {resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : resendLoading
                    ? 'Sending...'
                    : 'Resend Code'
                }
              </Button>
            </Box>
          </Box>
        )

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
              Set New Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
              Create a strong password for your account security.
            </Typography>

            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              helperText="Must be at least 8 characters with uppercase, lowercase, and numbers"
              sx={{ mb: 3 }}
              required
            />

            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              error={formData.confirmPassword && formData.newPassword !== formData.confirmPassword}
              helperText={
                formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
              sx={{ mb: 3 }}
              required
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleResetPassword}
              disabled={loading || !formData.newPassword || !formData.confirmPassword}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
              sx={{
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                py: 1.5
              }}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Paper sx={{
        maxWidth: 500,
        width: '100%',
        p: 4,
        borderRadius: 3,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Reset Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Secure password recovery process
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Step Content */}
        <Box sx={{ mb: 4 }}>
          {renderStepContent(currentStep)}
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/login')}
            sx={{ textTransform: 'none' }}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default ForgotPasswordPage
