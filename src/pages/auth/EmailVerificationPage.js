import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material'
import {
  Email as EmailIcon,
  CheckCircle as CheckIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
  Timer as TimerIcon,
} from '@mui/icons-material'

import authService from '../../services/authService.js'
import { loginSuccess } from '../../store/slices/authSlice.js'

const EmailVerificationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // Get email and pending auth data from location state
  const { email, pendingAuthData } = location.state || {}

  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)

  // Redirect if no email provided
  useEffect(() => {
    if (!email || !pendingAuthData) {
      navigate('/login')
    }
  }, [email, pendingAuthData, navigate])

  // Timer for resend code
  useEffect(() => {
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

  const handleCodeChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) return

    const newCode = [...verificationCode]
    newCode[index] = value

    setVerificationCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, event) => {
    // Handle backspace to move to previous input
    if (event.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...verificationCode]

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i] || ''
    }

    setVerificationCode(newCode)
  }

  const handleVerifyCode = async () => {
    const code = verificationCode.join('')

    if (code.length !== 6) {
      setError('Please enter the complete 6-digit verification code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Verify the code with backend
      const verificationResult = await authService.verifyLoginCode(email, code)

      if (verificationResult.success) {
        // Complete the login process
        const userPayload = {
          user: pendingAuthData.user,
          role: pendingAuthData.role,
          token: pendingAuthData.token
        }

        dispatch(loginSuccess(userPayload))

        setSuccess('Email verified successfully! Redirecting to dashboard...')

        // Redirect to appropriate dashboard
        const dashboardPath = `/dashboard/${pendingAuthData.role.toLowerCase()}`
        setTimeout(() => navigate(dashboardPath), 1500)

      } else {
        setError('Invalid verification code. Please try again.')
      }
    } catch (error) {
      setError(error.message || 'Failed to verify code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setResendLoading(true)
    setError('')

    try {
      await authService.resendLoginVerificationCode(email)
      setSuccess('New verification code sent to your email address.')
      setResendTimer(60)
      setVerificationCode(['', '', '', '', '', ''])
    } catch (error) {
      setError(error.message || 'Failed to resend code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!email || !pendingAuthData) {
    return null // Will redirect in useEffect
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
            Email Verification
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Secure login verification
          </Typography>
        </Box>

        {/* Email Info */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
          p: 2,
          borderRadius: 2,
          mb: 4
        }}>
          <EmailIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Code sent to: <strong>{email}</strong>
          </Typography>
        </Box>

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

        {/* Instructions */}
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4 }}>
          Enter the 6-digit verification code sent to your email address to complete the login process.
        </Typography>

        {/* Code Input */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'center' }}>
            Verification Code
          </Typography>
          <Grid container spacing={1} justifyContent="center">
            {verificationCode.map((digit, index) => (
              <Grid item key={index}>
                <TextField
                  id={`code-input-${index}`}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      width: '50px',
                      height: '50px',
                      padding: '0'
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: digit ? 'primary.main' : 'grey.300',
                        borderWidth: digit ? 2 : 1,
                      },
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Timer */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3
        }}>
          <TimerIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            Code expires in: <strong>{formatTime(300)}</strong> {/* 5 minutes */}
          </Typography>
        </Box>

        {/* Verify Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleVerifyCode}
          disabled={loading || verificationCode.join('').length !== 6}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckIcon />}
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            py: 1.5,
            mb: 3
          }}
        >
          {loading ? 'Verifying...' : 'Verify & Login'}
        </Button>

        {/* Resend Code */}
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

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary">
            Having trouble?{' '}
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
            >
              Back to Login
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default EmailVerificationPage
