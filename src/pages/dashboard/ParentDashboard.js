import {
  SmartToy as AIIcon,
  Add as AddIcon,
  School as ChildIcon,
  Payment as PaymentIcon,
  Grade as GradeIcon,
  MonetizationOn as MoneyIcon,
  TrendingUp as ProgressIcon,
  Assignment as AssignmentIcon,
  EventNote as AttendanceIcon,
  Message as MessageIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Link as LinkIcon,
  PersonAdd as PersonAddIcon,
  LinkOff as UnlinkIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import parentService from '../../services/parentService.js';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    children: [],
    stats: {
      totalChildren: 0,
      avgGrade: 0,
      pendingPayments: 0,
      upcomingEvents: 0,
    },
    recentActivity: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Student linking dialog state
  const [linkingDialog, setLinkingDialog] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [relationshipInput, setRelationshipInput] = useState('Parent');
  const [validationLoading, setValidationLoading] = useState(false);
  const [validatedStudent, setValidatedStudent] = useState(null);

  useEffect(() => {
    if (user?.email) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔄 Loading parent dashboard data for:', user.email);

      const data = await parentService.getParentDashboardData(user.email);
      setDashboardData(data);

      console.log('✅ Parent dashboard loaded successfully:', {
        children: data.children.length,
        stats: data.stats,
      });
    } catch (error) {
      console.error('❌ Error loading parent dashboard:', error);
      if (
        error.message.includes('Network Error') ||
        error.message.includes('ERR_CONNECTION_REFUSED')
      ) {
        setError(
          'Backend server is currently unavailable. Displaying sample data for demonstration purposes.'
        );
      } else {
        setError(`Failed to load dashboard data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleValidateStudentId = async () => {
    if (!studentIdInput.trim()) {
      setError('Please enter a Student ID');
      return;
    }

    setValidationLoading(true);
    setError('');

    try {
      const validation = await parentService.validateStudentId(
        studentIdInput.trim()
      );

      if (validation.isValid) {
        setValidatedStudent(validation.student);
        setSuccess("Student ID is valid! Click 'Link Child' to proceed.");
      } else {
        setError(validation.message);
        setValidatedStudent(null);
      }
    } catch (error) {
      setError(`Validation failed: ${error.message}`);
      setValidatedStudent(null);
    } finally {
      setValidationLoading(false);
    }
  };

  const handleLinkChild = async () => {
    if (!validatedStudent) {
      setError('Please validate a Student ID first');
      return;
    }

    try {
      setLoading(true);
      const result = await parentService.linkChildToParent(
        user.email,
        validatedStudent.studentId,
        relationshipInput
      );

      setSuccess(result.message);
      setLinkingDialog(false);
      setStudentIdInput('');
      setValidatedStudent(null);
      setRelationshipInput('Parent');

      // Reload dashboard data
      await loadDashboardData();
    } catch (error) {
      setError(`Failed to link child: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkChild = async (studentId) => {
    if (
      !window.confirm(
        'Are you sure you want to unlink this child from your account?'
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const result = await parentService.unlinkChildFromParent(
        user.email,
        studentId
      );
      setSuccess(result.message);
      await loadDashboardData();
    } catch (error) {
      setError(`Failed to unlink child: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderQuickStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#1976d2',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <ChildIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#1976d2' }}
            >
              {dashboardData.stats.totalChildren}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Linked Children
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#4caf50',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <GradeIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#4caf50' }}
            >
              {dashboardData.stats.avgGrade}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Average Grade
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#f44336',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <MoneyIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#f44336' }}
            >
              {dashboardData.stats.pendingPayments}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Payments
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#ff9800',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <AssignmentIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#ff9800' }}
            >
              {dashboardData.stats.upcomingEvents}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upcoming Events
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderLinkedChildren = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <ChildIcon />
            My Children ({dashboardData.children.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={() => setLinkingDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            }}
          >
            Link Child
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Link your children using their valid Student IDs. No enrollment needed
          - children must be registered by the school administration first.
        </Typography>

        {dashboardData.children.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'rgba(25, 118, 210, 0.04)',
            }}
          >
            <PersonAddIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No Children Linked
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Link your children to your account using their Student IDs
              provided by the school.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={() => setLinkingDialog(true)}
            >
              Link Your First Child
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {dashboardData.children.map((child, index) => (
              <Grid item xs={12} sm={6} md={4} key={child.studentId || index}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.04)' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {child.user?.firstName} {child.user?.lastName}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<UnlinkIcon />}
                      onClick={() => handleUnlinkChild(child.studentId)}
                    >
                      Unlink
                    </Button>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Student ID: {child.studentId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Grade: {child.grade} - Section {child.section}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Overall Grade: {child.overallGrade || 'N/A'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      size="small"
                      label={child.relationship || 'Child'}
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Linked:{' '}
                      {child.linkedAt
                        ? new Date(child.linkedAt).toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );

  const renderQuickActions = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PaymentIcon />}
              onClick={() => navigate('/parent/payments')}
              sx={{ mb: 1 }}
            >
              Payments & Billing
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ProgressIcon />}
              onClick={() => navigate('/parent/progress')}
              sx={{ mb: 1 }}
            >
              Progress Reports
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<MessageIcon />}
              onClick={() => navigate('/admin/communication')}
              sx={{ mb: 1 }}
            >
              Messages
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LinkIcon />}
              onClick={() => setLinkingDialog(true)}
              sx={{ mb: 1 }}
            >
              Link Child
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderRecentActivity = () => (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <AssignmentIcon />
          Recent Activity
        </Typography>
        <List>
          {dashboardData.recentActivity.length === 0 ? (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              No recent activity available.
            </Typography>
          ) : (
            dashboardData.recentActivity.map((activity, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  {activity.type === 'grade' && <GradeIcon color="primary" />}
                  {activity.type === 'payment' && (
                    <PaymentIcon color="success" />
                  )}
                  {activity.type === 'attendance' && (
                    <AttendanceIcon color="warning" />
                  )}
                  {activity.type === 'assignment' && (
                    <AssignmentIcon color="info" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={activity.text}
                  secondary={`${activity.time} • ${activity.childName}`}
                />
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );

  const renderLinkingDialog = () => (
    <Dialog
      open={linkingDialog}
      onClose={() => setLinkingDialog(false)}
      maxWidth="sm"
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
        <LinkIcon />
        Link Child to Your Account
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your child's Student ID to link them to your account. The
          Student ID must be valid and issued by the school.
        </Typography>

        <TextField
          fullWidth
          label="Student ID"
          value={studentIdInput}
          onChange={(e) => setStudentIdInput(e.target.value.toUpperCase())}
          placeholder="e.g., STU-2024-001"
          sx={{ mb: 2 }}
          helperText="Enter the Student ID exactly as provided by the school"
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Relationship</InputLabel>
          <Select
            value={relationshipInput}
            onChange={(e) => setRelationshipInput(e.target.value)}
            label="Relationship"
          >
            <MenuItem value="Parent">Parent</MenuItem>
            <MenuItem value="Guardian">Guardian</MenuItem>
            <MenuItem value="Father">Father</MenuItem>
            <MenuItem value="Mother">Mother</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleValidateStudentId}
          disabled={validationLoading || !studentIdInput.trim()}
          sx={{ mb: 2 }}
        >
          {validationLoading ? (
            <CircularProgress size={20} />
          ) : (
            'Validate Student ID'
          )}
        </Button>

        {validatedStudent && (
          <Paper sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.04)', mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', color: 'success.main' }}
            >
              ✓ Student Found
            </Typography>
            <Typography variant="body2">
              Name: {validatedStudent.user?.firstName}{' '}
              {validatedStudent.user?.lastName}
            </Typography>
            <Typography variant="body2">
              Grade: {validatedStudent.grade} - Section{' '}
              {validatedStudent.section}
            </Typography>
            <Typography variant="body2">
              Student ID: {validatedStudent.studentId}
            </Typography>
          </Paper>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setLinkingDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleLinkChild}
          disabled={!validatedStudent || loading}
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Link Child'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading && dashboardData.children.length === 0) {
    return (
      <DashboardLayout title="Parent Dashboard">
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
            Loading Parent Dashboard...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Parent Dashboard">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            👨‍👩‍👧‍👦 Parent Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {user?.firstName || 'Parent'}! Monitor your children's
            progress and manage payments.
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        {/* Quick Stats */}
        {renderQuickStats()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Linked Children */}
            {renderLinkedChildren()}
          </Grid>
          <Grid item xs={12}>
            {/* Recent Activity */}
            {renderRecentActivity()}
          </Grid>
        </Grid>

        {/* Student Linking Dialog */}
        {renderLinkingDialog()}
      </Box>
    </DashboardLayout>
  );
};

export default ParentDashboard;
