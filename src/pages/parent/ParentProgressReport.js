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
  Tabs,
  Tab,
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
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';

const ParentProgressReport = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('spring-2025');
  const [childrenData, setChildrenData] = useState([]);

  useEffect(() => {
    loadChildrenProgressData();
  }, [selectedSemester]);

  const loadChildrenProgressData = async () => {
    setLoading(true);
    try {
      // Simulate loading children progress data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockChildrenData = [
        {
          id: 1,
          name: 'Emma Thompson',
          studentId: 'STU001',
          grade: '10th Grade',
          section: 'A',
          rollNumber: '15',
          classTeacher: 'Mrs. Johnson',
          overallRank: 3,
          totalStudents: 32,
          overallGPA: 3.7,
          overallPercentage: 87.5,
          attendancePercentage: 96.5,
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
            },
          ],
          strengths: ['English Literature', 'Mathematics', 'Biology'],
          improvementAreas: ['Chemistry', 'Physics'],
          teacherComments: [
            {
              subject: 'Mathematics',
              teacher: 'Prof. Johnson',
              comment:
                'Emma shows excellent problem-solving skills and consistent performance. Keep up the great work!',
            },
            {
              subject: 'English Literature',
              teacher: 'Prof. Davis',
              comment:
                'Outstanding analytical and creative writing abilities. Emma participates actively in class discussions.',
            },
            {
              subject: 'Chemistry',
              teacher: 'Dr. Brown',
              comment:
                'Needs to focus more on practical applications. Encourage more lab practice at home.',
            },
          ],
          recentActivities: [
            {
              date: '2025-01-10',
              activity: 'Scored A in Mathematics Quiz',
              type: 'achievement',
            },
            {
              date: '2025-01-08',
              activity: 'Submitted English Literature Essay',
              type: 'assignment',
            },
            {
              date: '2025-01-05',
              activity: 'Participated in Science Fair',
              type: 'extracurricular',
            },
          ],
          upcomingEvents: [
            {
              date: '2025-01-15',
              event: 'Parent-Teacher Conference',
              type: 'meeting',
            },
            {
              date: '2025-01-20',
              event: 'Chemistry Practical Exam',
              type: 'exam',
            },
            {
              date: '2025-01-25',
              event: 'Annual Sports Day',
              type: 'event',
            },
          ],
        },
      ];

      setChildrenData(mockChildrenData);
    } catch (error) {
      console.error('Error loading children progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentChild = childrenData[selectedChild];

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

  const getActivityIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <TrophyIcon color="success" />;
      case 'assignment':
        return <ReportIcon color="info" />;
      case 'extracurricular':
        return <StarIcon color="primary" />;
      default:
        return <PersonIcon />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
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

  if (!currentChild) {
    return (
      <DashboardLayout>
        <Alert severity="info">No children data available.</Alert>
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
            📊 Child's Academic Progress Report
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

        {/* Child Selection Tabs */}
        {childrenData.length > 1 && (
          <Card sx={{ mb: 4 }}>
            <Tabs
              value={selectedChild}
              onChange={(e, newValue) => setSelectedChild(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {childrenData.map((child, index) => (
                <Tab key={index} label={child.name} />
              ))}
            </Tabs>
          </Card>
        )}

        {/* Child Information */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {currentChild.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Student ID
                    </Typography>
                    <Typography variant="body1">
                      {currentChild.studentId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Grade & Section
                    </Typography>
                    <Typography variant="body1">
                      {currentChild.grade} - {currentChild.section}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Roll Number
                    </Typography>
                    <Typography variant="body1">
                      {currentChild.rollNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">
                      Class Teacher
                    </Typography>
                    <Typography variant="body1">
                      {currentChild.classTeacher}
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
                    {currentChild.name?.charAt(0)}
                  </Avatar>
                  <Chip
                    icon={<TrophyIcon />}
                    label={`Rank ${currentChild.overallRank}${getRankSuffix(
                      currentChild.overallRank
                    )} out of ${currentChild.totalStudents}`}
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
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 'bold', color: '#4caf50' }}
                >
                  {currentChild.overallGPA}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Overall GPA
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 'bold', color: '#2196f3' }}
                >
                  {currentChild.overallPercentage}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Overall Percentage
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 'bold', color: '#ff9800' }}
                >
                  {currentChild.overallRank}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Class Rank
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 'bold', color: '#9c27b0' }}
                >
                  {currentChild.attendancePercentage}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Attendance
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
                      Marks
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Percentage
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Grade
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Class Average
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Rank
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      Trend
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentChild.subjects?.map((subject, index) => (
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
                          {subject.obtainedMarks}/{subject.totalMarks}
                        </Typography>
                      </TableCell>
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

        {/* Teacher Comments */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Teacher Comments
            </Typography>
            {currentChild.teacherComments?.map((comment, index) => (
              <Alert
                key={index}
                severity="info"
                sx={{ mb: 2 }}
                icon={<PersonIcon />}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {comment.subject} - {comment.teacher}
                </Typography>
                <Typography variant="body2">{comment.comment}</Typography>
              </Alert>
            ))}
          </CardContent>
        </Card>

        {/* Performance Analysis & Activities */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <StarIcon />
                  Strengths
                </Typography>
                {currentChild.strengths?.map((strength, index) => (
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
                {currentChild.improvementAreas?.map((area, index) => (
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

          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                {currentChild.recentActivities
                  ?.slice(0, 3)
                  .map((activity, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      {getActivityIcon(activity.type)}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {activity.activity}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.date}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Events
                </Typography>
                {currentChild.upcomingEvents
                  ?.slice(0, 3)
                  .map((event, index) => (
                    <Alert key={index} severity="info" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {event.event}
                      </Typography>
                      <Typography variant="caption">
                        {event.date} • {event.type}
                      </Typography>
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

export default ParentProgressReport;
