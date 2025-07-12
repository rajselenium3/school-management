import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  Avatar,
  Divider,
  LinearProgress,
  Tooltip,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Grade as GradeIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import assignmentService from '../../services/assignmentService.js';
import {
  fetchSubmissionsByStudent,
  createSubmission,
  updateSubmissionContent,
  submitAssignment,
  setSubmissionFormData,
  clearSubmissionForm,
  addAttachment,
  removeAttachment,
} from '../../store/slices/submissionSlice.js';

const StudentAssignments = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    currentUserSubmissions,
    submissionForm,
    loading,
    error,
    success,
    creating,
    updating,
  } = useSelector((state) => state.submissions);

  const [currentTab, setCurrentTab] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionDialog, setSubmissionDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const tabs = ['My Assignments', 'Submitted', 'Graded', 'Overdue'];

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      // In a real app, we'd get assignments for the student's enrolled courses
      const allAssignments = await assignmentService.getAllAssignments();
      setAssignments(
        allAssignments.map((a) => assignmentService.formatAssignment(a))
      );

      // Load student's submissions
      if (user?.studentId) {
        dispatch(fetchSubmissionsByStudent(user.studentId));
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  };

  const getAssignmentStatus = (assignment) => {
    const submission = currentUserSubmissions.find(
      (s) => s.assignment?.id === assignment.id
    );
    if (!submission) return 'not_started';
    if (submission.status === 'GRADED') return 'graded';
    if (submission.status === 'SUBMITTED' || submission.status === 'LATE')
      return 'submitted';
    return 'draft';
  };

  const getSubmissionForAssignment = (assignment) => {
    return currentUserSubmissions.find(
      (s) => s.assignment?.id === assignment.id
    );
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const status = getAssignmentStatus(assignment);

    switch (currentTab) {
      case 0:
        return true; // All assignments
      case 1:
        return status === 'submitted'; // Submitted
      case 2:
        return status === 'graded'; // Graded
      case 3:
        return (
          status !== 'submitted' &&
          status !== 'graded' &&
          new Date(assignment.dueDate) < new Date()
        ); // Overdue
      default:
        return true;
    }
  });

  const handleStartAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    dispatch(
      setSubmissionFormData({
        assignmentId: assignment.id,
        textContent: '',
        attachments: [],
        isDraft: true,
      })
    );
    setSubmissionDialog(true);
  };

  const handleEditSubmission = (assignment) => {
    const submission = getSubmissionForAssignment(assignment);
    setSelectedAssignment(assignment);
    dispatch(
      setSubmissionFormData({
        assignmentId: assignment.id,
        textContent: submission?.textContent || '',
        attachments: submission?.attachments || [],
        isDraft: submission?.status === 'DRAFT',
      })
    );
    setSubmissionDialog(true);
  };

  const handleViewSubmission = (assignment) => {
    const submission = getSubmissionForAssignment(assignment);
    setSelectedSubmission(submission);
    setSelectedAssignment(assignment);
    setViewDialog(true);
  };

  const handleSaveSubmission = async () => {
    try {
      const existingSubmission = getSubmissionForAssignment(selectedAssignment);

      if (existingSubmission) {
        // Update existing submission
        await dispatch(
          updateSubmissionContent({
            submissionId: existingSubmission.id,
            textContent: submissionForm.textContent,
            attachments: submissionForm.attachments,
          })
        ).unwrap();
      } else {
        // Create new submission
        await dispatch(
          createSubmission({
            assignmentId: selectedAssignment.id,
            studentId: user.studentId,
            textContent: submissionForm.textContent,
            attachments: submissionForm.attachments,
          })
        ).unwrap();
      }

      setSubmissionDialog(false);
      dispatch(clearSubmissionForm());
      loadStudentData(); // Refresh data
    } catch (error) {
      console.error('Error saving submission:', error);
    }
  };

  const handleSubmitAssignment = async () => {
    try {
      const submission = getSubmissionForAssignment(selectedAssignment);
      if (submission) {
        await dispatch(submitAssignment(submission.id)).unwrap();
        setSubmissionDialog(false);
        dispatch(clearSubmissionForm());
        loadStudentData(); // Refresh data
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  const handleAddAttachment = () => {
    // In a real app, this would open a file picker
    const fileName = prompt('Enter attachment name (demo):');
    if (fileName) {
      dispatch(
        addAttachment({
          name: fileName,
          url: `/uploads/${fileName}`,
          size: Math.floor(Math.random() * 1000000),
        })
      );
    }
  };

  const renderAssignmentCard = (assignment) => {
    const status = getAssignmentStatus(assignment);
    const submission = getSubmissionForAssignment(assignment);
    const isOverdue = new Date(assignment.dueDate) < new Date();

    let statusColor, statusText, statusIcon;
    switch (status) {
      case 'graded':
        statusColor = '#4caf50';
        statusText = 'Graded';
        statusIcon = <GradeIcon />;
        break;
      case 'submitted':
        statusColor = '#2196f3';
        statusText =
          submission?.status === 'LATE' ? 'Late Submission' : 'Submitted';
        statusIcon = <CheckIcon />;
        break;
      case 'draft':
        statusColor = '#ff9800';
        statusText = 'In Progress';
        statusIcon = <DescriptionIcon />;
        break;
      default:
        statusColor = isOverdue ? '#f44336' : '#757575';
        statusText = isOverdue ? 'Overdue' : 'Not Started';
        statusIcon = isOverdue ? <WarningIcon /> : <AssignmentIcon />;
    }

    return (
      <Grid item xs={12} md={6} lg={4} key={assignment.id}>
        <Card
          sx={{
            height: '100%',
            border:
              isOverdue && status === 'not_started'
                ? '2px solid #f44336'
                : '1px solid #e0e0e0',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: statusColor }}>{statusIcon}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {assignment.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {assignment.course?.courseName}
                </Typography>
              </Box>
            </Box>

            <Chip
              label={statusText}
              size="small"
              sx={{
                backgroundColor: `${statusColor}20`,
                color: statusColor,
                mb: 2,
              }}
            />

            <Typography variant="body2" sx={{ mb: 2, minHeight: 40 }}>
              {assignment.description}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ScheduleIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Due: {assignment.formattedDueDate}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <GradeIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Max Score: {assignment.maxScore} points
              </Typography>
            </Box>

            {status === 'graded' && submission?.score && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="primary">
                  Your Score: {submission.score}/{assignment.maxScore} (
                  {submission.percentage?.toFixed(1)}%)
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={submission.percentage || 0}
                  sx={{ mt: 1 }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {status === 'not_started' && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleStartAssignment(assignment)}
                  sx={{
                    background:
                      'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  }}
                >
                  Start Assignment
                </Button>
              )}

              {status === 'draft' && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleEditSubmission(assignment)}
                    color="warning"
                  >
                    Continue
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewSubmission(assignment)}
                  >
                    Preview
                  </Button>
                </>
              )}

              {(status === 'submitted' || status === 'graded') && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewSubmission(assignment)}
                >
                  View Details
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const renderSubmissionDialog = () => (
    <Dialog
      open={submissionDialog}
      onClose={() => setSubmissionDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{selectedAssignment?.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {selectedAssignment?.description}
          </Typography>
          <Typography variant="body2">
            Due: {selectedAssignment?.formattedDueDate}
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={8}
          label="Your Response"
          value={submissionForm.textContent}
          onChange={(e) =>
            dispatch(setSubmissionFormData({ textContent: e.target.value }))
          }
          placeholder="Enter your assignment response here..."
          sx={{ mb: 3 }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Attachments
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AttachIcon />}
            onClick={handleAddAttachment}
            size="small"
          >
            Add Attachment
          </Button>
        </Box>

        {submissionForm.attachments?.length > 0 && (
          <List dense>
            {submissionForm.attachments.map((attachment, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => dispatch(removeAttachment(index))}
                  >
                    <DownloadIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={attachment.name}
                  secondary={`${(attachment.size / 1024).toFixed(1)} KB`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSubmissionDialog(false)}>Cancel</Button>
        <Button onClick={handleSaveSubmission} disabled={creating || updating}>
          Save Draft
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmitAssignment}
          disabled={!submissionForm.textContent?.trim() || creating || updating}
          startIcon={<SendIcon />}
        >
          Submit Assignment
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderViewDialog = () => (
    <Dialog
      open={viewDialog}
      onClose={() => setViewDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {selectedAssignment?.title} - Submission Details
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Response:
        </Typography>
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="body1">
            {selectedSubmission?.textContent || 'No content available'}
          </Typography>
        </Paper>

        {selectedSubmission?.score && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Grade:
            </Typography>
            <Typography variant="body1">
              {selectedSubmission.score}/{selectedAssignment?.maxScore} points (
              {selectedSubmission.percentage?.toFixed(1)}%)
            </Typography>
            <Typography variant="body2" color="primary">
              Letter Grade: {selectedSubmission.letterGrade}
            </Typography>
          </Box>
        )}

        {selectedSubmission?.feedback && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Feedback:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#e3f2fd' }}>
              <Typography variant="body1">
                {selectedSubmission.feedback}
              </Typography>
            </Paper>
          </Box>
        )}

        {selectedSubmission?.aiGrading?.aiFeedback && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              AI Feedback:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#f3e5f5' }}>
              <Typography variant="body1">
                {selectedSubmission.aiGrading.aiFeedback}
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setViewDialog(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <DashboardLayout title="My Assignments">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Assignments">
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
        >
          📚 My Assignments
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          View and submit your course assignments
        </Typography>

        {/* Alerts */}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => dispatch(clearSuccess())}
          >
            {success}
          </Alert>
        )}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => dispatch(clearError())}
          >
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Card>

        {/* Assignment Cards */}
        <Grid container spacing={3}>
          {filteredAssignments.map(renderAssignmentCard)}
        </Grid>

        {filteredAssignments.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AssignmentIcon
              sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              No assignments found for this category
            </Typography>
          </Box>
        )}

        {/* Dialogs */}
        {renderSubmissionDialog()}
        {renderViewDialog()}
      </Box>
    </DashboardLayout>
  );
};

export default StudentAssignments;
