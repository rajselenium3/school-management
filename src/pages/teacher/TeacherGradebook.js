import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  LinearProgress,
  Rating,
  Switch,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import {
  Search as SearchIcon,
  Grade as GradeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  SmartToy as AIIcon,
  Publish as PublishIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Star as StarIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import gradeService from '../../services/gradeService.js';
import courseService from '../../services/courseService.js';
import studentService from '../../services/studentService.js';

const TeacherGradebook = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [analytics, setAnalytics] = useState({});
  const [statistics, setStatistics] = useState({});

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  // Dialog states
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [gradeFormData, setGradeFormData] = useState({
    score: '',
    maxScore: 100,
    feedback: '',
    status: 'GRADED',
  });

  const tabs = [
    'My Gradebook',
    'Course Analytics',
    'AI Grading',
    'Grade Reports',
  ];
  const statuses = ['PENDING', 'GRADED', 'PUBLISHED', 'DRAFT'];
  const letterGrades = [
    'A+',
    'A',
    'A-',
    'B+',
    'B',
    'B-',
    'C+',
    'C',
    'C-',
    'D+',
    'D',
    'D-',
    'F',
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseGrades(selectedCourse);
      loadCourseAnalytics(selectedCourse);
    }
  }, [selectedCourse]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [coursesData, statsData] = await Promise.all([
        courseService.getAllCourses(), // In real app, filter by teacher
        gradeService.getGradeStatistics(),
      ]);

      setCourses(coursesData);
      setStatistics(statsData);

      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0].courseCode);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load gradebook data: ' + error.message);
      setLoading(false);
    }
  };

  const loadCourseGrades = async (courseCode) => {
    try {
      const gradesData = await gradeService.getGradesByCourse(courseCode);
      setGrades(gradesData);
    } catch (error) {
      console.error('Error loading course grades:', error);
      setError('Failed to load course grades');
    }
  };

  const loadCourseAnalytics = async (courseCode) => {
    try {
      const analyticsData = await gradeService.getCourseGradeAnalytics(
        courseCode
      );
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setGradeFormData({
      score: grade.score || '',
      maxScore: grade.maxScore || 100,
      feedback: grade.feedback || '',
      status: grade.status || 'GRADED',
    });
    setOpenGradeDialog(true);
  };

  const handleSaveGrade = async () => {
    try {
      const percentage = (gradeFormData.score / gradeFormData.maxScore) * 100;
      const letterGrade = gradeService.calculateLetterGrade(percentage);

      const updatedGradeData = {
        ...editingGrade,
        score: parseFloat(gradeFormData.score),
        maxScore: parseFloat(gradeFormData.maxScore),
        percentage,
        letterGrade,
        feedback: gradeFormData.feedback,
        status: gradeFormData.status,
      };

      const updatedGrade = await gradeService.updateGrade(
        editingGrade.id,
        updatedGradeData
      );

      const updatedGrades = grades.map((g) =>
        g.id === editingGrade.id ? updatedGrade : g
      );
      setGrades(updatedGrades);

      setOpenGradeDialog(false);
      setEditingGrade(null);
      setSuccess('Grade updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update grade: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePublishGrade = async (gradeId) => {
    try {
      const publishedGrade = await gradeService.publishGrade(gradeId);
      const updatedGrades = grades.map((g) =>
        g.id === gradeId ? publishedGrade : g
      );
      setGrades(updatedGrades);
      setSuccess('Grade published successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to publish grade: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAIGrading = async (gradeId) => {
    try {
      // Simulate AI grading with random values
      const aiScore = 75 + Math.random() * 25;
      const confidence = 0.8 + Math.random() * 0.2;
      const feedback = `AI Generated Feedback: Good understanding of the concepts with room for improvement in specific areas.`;

      const aiGradedGrade = await gradeService.generateAIGrade(
        gradeId,
        aiScore,
        confidence,
        feedback
      );
      const updatedGrades = grades.map((g) =>
        g.id === gradeId ? aiGradedGrade : g
      );
      setGrades(updatedGrades);
      setSuccess('AI grading completed!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('AI grading failed: ' + error.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredGrades = grades.filter((grade) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      grade.student?.firstName?.toLowerCase().includes(searchLower) ||
      grade.student?.lastName?.toLowerCase().includes(searchLower) ||
      grade.student?.studentId?.toLowerCase().includes(searchLower) ||
      grade.assignment?.title?.toLowerCase().includes(searchLower);

    const matchesStatus = !statusFilter || grade.status === statusFilter;
    const matchesGrade = !gradeFilter || grade.letterGrade === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {[
        {
          title: 'Total Grades',
          value: statistics.total || 0,
          icon: GradeIcon,
          color: '#2196f3',
        },
        {
          title: 'Pending Grades',
          value: statistics.pending || 0,
          icon: AssignmentIcon,
          color: '#ff9800',
        },
        {
          title: 'Graded',
          value: statistics.graded || 0,
          icon: CheckIcon,
          color: '#4caf50',
        },
        {
          title: 'AI Generated',
          value: statistics.aiGenerated || 0,
          icon: AIIcon,
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

  const renderGradebook = () => (
    <Box>
      {/* Course and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Select Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  {courses.map((course) => (
                    <MenuItem key={course.courseCode} value={course.courseCode}>
                      {course.courseName} ({course.courseCode})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search students or assignments..."
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

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => loadCourseGrades(selectedCourse)}
                  size="small"
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  size="small"
                >
                  Export
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AIIcon />}
                  sx={{
                    background:
                      'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                  }}
                  size="small"
                >
                  AI Grade All
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assignment</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Score</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Letter Grade
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>AI</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGrades.map((grade) => (
                  <TableRow
                    key={grade.id}
                    sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar sx={{ bgcolor: '#1976d2' }}>
                          {grade.student?.firstName?.[0]}
                          {grade.student?.lastName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {grade.student?.firstName} {grade.student?.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {grade.student?.studentId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {grade.assignment?.title || 'Assignment'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Due: {grade.assignment?.dueDate || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {grade.score || 0}/{grade.maxScore || 100}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(grade.percentage || 0).toFixed(1)}%
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={grade.letterGrade || 'N/A'}
                        size="small"
                        sx={{
                          backgroundColor: `${gradeService.getLetterGradeColor(
                            grade.letterGrade
                          )}20`,
                          color: gradeService.getLetterGradeColor(
                            grade.letterGrade
                          ),
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={grade.status || 'PENDING'}
                        size="small"
                        sx={{
                          backgroundColor: `${gradeService.getStatusColor(
                            grade.status
                          )}20`,
                          color: gradeService.getStatusColor(grade.status),
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      {grade.aiGrading?.aiGenerated ? (
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <AIIcon sx={{ color: '#9c27b0', fontSize: '1rem' }} />
                          <Typography variant="caption">
                            {(grade.aiGrading.confidence * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Manual
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit Grade">
                          <IconButton
                            size="small"
                            onClick={() => handleEditGrade(grade)}
                            sx={{ color: '#ff9800' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {grade.status !== 'PUBLISHED' && (
                          <Tooltip title="Publish Grade">
                            <IconButton
                              size="small"
                              onClick={() => handlePublishGrade(grade.id)}
                              sx={{ color: '#4caf50' }}
                            >
                              <PublishIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {!grade.aiGrading?.aiGenerated && (
                          <Tooltip title="AI Grade">
                            <IconButton
                              size="small"
                              onClick={() => handleAIGrading(grade.id)}
                              sx={{ color: '#9c27b0' }}
                            >
                              <AIIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
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
  );

  const renderAnalytics = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        📊 Course Analytics
      </Typography>
      {analytics && Object.keys(analytics).length > 0 ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Class Performance Overview
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Average Score: {analytics.averageScore?.toFixed(1) || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Average Percentage:{' '}
                    {analytics.averagePercentage?.toFixed(1) || 'N/A'}%
                  </Typography>
                  <Typography variant="body2">
                    Passing Rate: {analytics.passingRate?.toFixed(1) || 'N/A'}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Grade Distribution
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {analytics.letterGradeDistribution &&
                    Object.entries(analytics.letterGradeDistribution).map(
                      ([grade, count]) => (
                        <Box
                          key={grade}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2">{grade}:</Typography>
                          <Typography variant="body2">{count}</Typography>
                        </Box>
                      )
                    )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No analytics data available for the selected course.
        </Typography>
      )}
    </Box>
  );

  const renderGradeDialog = () => (
    <Dialog
      open={openGradeDialog}
      onClose={() => setOpenGradeDialog(false)}
      maxWidth="md"
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
        <GradeIcon />
        Edit Grade
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Score"
              type="number"
              value={gradeFormData.score}
              onChange={(e) =>
                setGradeFormData({ ...gradeFormData, score: e.target.value })
              }
              inputProps={{ min: 0, max: gradeFormData.maxScore }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Max Score"
              type="number"
              value={gradeFormData.maxScore}
              onChange={(e) =>
                setGradeFormData({ ...gradeFormData, maxScore: e.target.value })
              }
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={gradeFormData.status}
                onChange={(e) =>
                  setGradeFormData({ ...gradeFormData, status: e.target.value })
                }
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Letter Grade:{' '}
              {gradeService.calculateLetterGrade(
                (gradeFormData.score / gradeFormData.maxScore) * 100
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Percentage:{' '}
              {((gradeFormData.score / gradeFormData.maxScore) * 100).toFixed(
                1
              )}
              %
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Feedback"
              multiline
              rows={4}
              value={gradeFormData.feedback}
              onChange={(e) =>
                setGradeFormData({ ...gradeFormData, feedback: e.target.value })
              }
              placeholder="Enter feedback for the student..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setOpenGradeDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSaveGrade}
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          }}
        >
          Save Grade
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return renderGradebook();
      case 1:
        return renderAnalytics();
      case 2:
        return (
          <Typography variant="h6" color="text.secondary">
            🤖 AI Grading features will be implemented here
          </Typography>
        );
      case 3:
        return (
          <Typography variant="h6" color="text.secondary">
            📊 Grade Reports will be implemented here
          </Typography>
        );
      default:
        return renderGradebook();
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Teacher Gradebook">
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
            Loading Gradebook...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Teacher Gradebook">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            📊 Teacher Gradebook
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage grades, track student progress, and generate analytics
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
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Grade Edit Dialog */}
        {renderGradeDialog()}
      </Box>
    </DashboardLayout>
  );
};

export default TeacherGradebook;
