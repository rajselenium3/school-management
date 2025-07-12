import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  CircularProgress,
  LinearProgress,
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  Analytics as AnalyticsIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Assessment as ReportIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';

const StudentProgressReport = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('spring-2025');
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    loadProgressData();
  }, [selectedSemester]);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      // Simulate loading progress data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockProgressData = {
        student: {
          name: 'Emma Thompson',
          studentId: 'STU001',
          grade: '10th Grade',
          section: 'A',
          rollNumber: '15',
        },
        semester: {
          name: 'Spring 2025',
          startDate: '2025-01-08',
          endDate: '2025-05-25',
        },
        overallRank: 3,
        totalStudents: 32,
        overallGPA: 3.7,
        overallPercentage: 87.5,
        subjects: [
          {
            name: 'Mathematics',
            teacher: 'Prof. Johnson',
            totalMarks: 500,
            obtainedMarks: 445,
            percentage: 89.0,
            letterGrade: 'A',
            classHighest: 485,
            classAverage: 375,
            subjectRank: 2,
            trend: 'up',
            assignments: [
              { name: 'Algebra Test', marks: 38, total: 40 },
              { name: 'Geometry Quiz', marks: 28, total: 30 },
              { name: 'Calculus Project', marks: 47, total: 50 },
            ],
          },
          {
            name: 'Physics',
            teacher: 'Dr. Wilson',
            totalMarks: 500,
            obtainedMarks: 420,
            percentage: 84.0,
            letterGrade: 'B+',
            classHighest: 475,
            classAverage: 350,
            subjectRank: 4,
            trend: 'up',
            assignments: [
              { name: 'Mechanics Test', marks: 35, total: 40 },
              { name: 'Optics Lab', marks: 27, total: 30 },
              { name: 'Thermodynamics Project', marks: 43, total: 50 },
            ],
          },
          {
            name: 'Chemistry',
            teacher: 'Dr. Brown',
            totalMarks: 500,
            obtainedMarks: 405,
            percentage: 81.0,
            letterGrade: 'B+',
            classHighest: 465,
            classAverage: 340,
            subjectRank: 6,
            trend: 'stable',
            assignments: [
              { name: 'Organic Chemistry Test', marks: 32, total: 40 },
              { name: 'Lab Practical', marks: 26, total: 30 },
              { name: 'Chemical Bonding Project', marks: 41, total: 50 },
            ],
          },
          {
            name: 'English Literature',
            teacher: 'Prof. Davis',
            totalMarks: 500,
            obtainedMarks: 460,
            percentage: 92.0,
            letterGrade: 'A',
            classHighest: 475,
            classAverage: 380,
            subjectRank: 1,
            trend: 'up',
            assignments: [
              { name: 'Shakespeare Analysis', marks: 39, total: 40 },
              { name: 'Poetry Quiz', marks: 29, total: 30 },
              { name: 'Creative Writing', marks: 48, total: 50 },
            ],
          },
          {
            name: 'History',
            teacher: 'Dr. Smith',
            totalMarks: 500,
            obtainedMarks: 425,
            percentage: 85.0,
            letterGrade: 'B+',
            classHighest: 450,
            classAverage: 360,
            subjectRank: 3,
            trend: 'up',
            assignments: [
              { name: 'World War II Essay', marks: 36, total: 40 },
              { name: 'Ancient Civilizations Quiz', marks: 28, total: 30 },
              { name: 'Historical Timeline Project', marks: 45, total: 50 },
            ],
          },
          {
            name: 'Biology',
            teacher: 'Dr. Garcia',
            totalMarks: 500,
            obtainedMarks: 440,
            percentage: 88.0,
            letterGrade: 'A-',
            classHighest: 470,
            classAverage: 370,
            subjectRank: 2,
            trend: 'up',
            assignments: [
              { name: 'Cell Biology Test', marks: 37, total: 40 },
              { name: 'Genetics Lab', marks: 27, total: 30 },
              { name: 'Ecosystem Project', marks: 46, total: 50 },
            ],
          },
        ],
        strengths: ['English Literature', 'Mathematics', 'Biology'],
        improvementAreas: ['Chemistry', 'Physics'],
        recommendations: [
          'Focus more on Chemistry practical applications',
          'Strengthen Physics problem-solving skills',
          'Continue excellent performance in English and Math',
        ],
      };

      setProgressData(mockProgressData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
      case 'A+':
        return '#4caf50';
      case 'A-':
        return '#8bc34a';
      case 'B+':
        return '#ff9800';
      case 'B':
        return '#ff9800';
      case 'B-':
        return '#ff5722';
      case 'C+':
      case 'C':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      default:
        return <AnalyticsIcon color="action" />;
    }
  };

  const getRankSuffix = (rank) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Progress Report">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2' }}
          >
            📊 Academic Progress Report
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Semester</InputLabel>
              <Select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <MenuItem value="spring-2025">Spring 2025</MenuItem>
                <MenuItem value="fall-2024">Fall 2024</MenuItem>
                <MenuItem value="spring-2024">Spring 2024</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </Box>
        </Box>

        {/* Student Information */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {progressData.student?.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Student ID
                    </Typography>
                    <Typography variant="body1">
                      {progressData.student?.studentId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Grade & Section
                    </Typography>
                    <Typography variant="body1">
                      {progressData.student?.grade} -{' '}
                      {progressData.student?.section}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Roll Number
                    </Typography>
                    <Typography variant="body1">
                      {progressData.student?.rollNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Semester
                    </Typography>
                    <Typography variant="body1">
                      {progressData.semester?.name}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: '#1976d2',
                      fontSize: '2rem',
                    }}
                  >
                    {progressData.student?.name?.charAt(0)}
                  </Avatar>
                  <Chip
                    icon={<TrophyIcon />}
                    label={`Rank ${progressData.overallRank}${getRankSuffix(
                      progressData.overallRank
                    )} out of ${progressData.totalStudents}`}
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Overall Performance */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 'bold', color: '#4caf50' }}
                >
                  {progressData.overallGPA}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Overall GPA
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 'bold', color: '#2196f3' }}
                >
                  {progressData.overallPercentage}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Overall Percentage
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 'bold', color: '#ff9800' }}
                >
                  {progressData.overallRank}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Class Rank
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Subject-wise Performance */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <ReportIcon />
              Subject-wise Performance
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Teacher</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Marks Obtained
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Total Marks
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Percentage
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Grade
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Class Highest
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Class Average
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Subject Rank
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Trend
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {progressData.subjects?.map((subject, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                    >
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 'bold' }}
                        >
                          {subject.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{subject.teacher}</TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {subject.obtainedMarks}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{subject.totalMarks}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {subject.percentage}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={subject.percentage}
                            sx={{
                              width: '100%',
                              mt: 0.5,
                              height: 6,
                              borderRadius: 3,
                            }}
                            color={
                              subject.percentage >= 90
                                ? 'success'
                                : subject.percentage >= 80
                                ? 'info'
                                : subject.percentage >= 70
                                ? 'warning'
                                : 'error'
                            }
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={subject.letterGrade}
                          size="small"
                          sx={{
                            backgroundColor: `${getGradeColor(
                              subject.letterGrade
                            )}20`,
                            color: getGradeColor(subject.letterGrade),
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {subject.classHighest}
                      </TableCell>
                      <TableCell align="center">
                        {subject.classAverage}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${subject.subjectRank}${getRankSuffix(
                            subject.subjectRank
                          )}`}
                          size="small"
                          color={
                            subject.subjectRank <= 3
                              ? 'success'
                              : subject.subjectRank <= 10
                              ? 'info'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        {getTrendIcon(subject.trend)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Performance Analysis */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <StarIcon />
                  Strengths
                </Typography>
                {progressData.strengths?.map((strength, index) => (
                  <Chip
                    key={index}
                    label={strength}
                    color="success"
                    sx={{ mr: 1, mb: 1 }}
                    icon={<StarIcon />}
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <TrendingUpIcon />
                  Areas for Improvement
                </Typography>
                {progressData.improvementAreas?.map((area, index) => (
                  <Chip
                    key={index}
                    label={area}
                    color="warning"
                    sx={{ mr: 1, mb: 1 }}
                    icon={<TrendingUpIcon />}
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Teacher Recommendations
                </Typography>
                {progressData.recommendations?.map((recommendation, index) => (
                  <Alert key={index} severity="info" sx={{ mb: 1 }}>
                    {recommendation}
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default StudentProgressReport;
