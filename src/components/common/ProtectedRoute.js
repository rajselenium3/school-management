import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { Box, Typography, Paper } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import './ProtectedRoute.css'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useSelector((state) => state.auth)

  if (loading) {
    return (
      <Box className="protected-route-loading">
        <div className="loading-spinner" />
        <Typography variant="body2" className="loading-text">
          Verifying access...
        </Typography>
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <Box className="protected-route-unauthorized">
        <Paper className="unauthorized-container">
          <LockIcon className="unauthorized-icon" />
          <Typography variant="h5" className="unauthorized-title">
            Access Denied
          </Typography>
          <Typography variant="body1" className="unauthorized-message">
            You don't have permission to access this page.
          </Typography>
          <Typography variant="body2" className="unauthorized-role">
            Your role: <strong>{role}</strong>
          </Typography>
          <Typography variant="body2" className="unauthorized-required">
            Required roles: <strong>{allowedRoles.join(', ')}</strong>
          </Typography>
        </Paper>
      </Box>
    )
  }

  return <div className="protected-route-content">{children}</div>
}

export default ProtectedRoute
