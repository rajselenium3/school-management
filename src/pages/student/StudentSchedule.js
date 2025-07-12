import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Room as RoomIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Today as TodayIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Event as EventIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';

const StudentSchedule = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, [currentWeek]);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      // Simulate loading schedule
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockSchedule = [
        {
          day: 'Monday',
          date: '2025-01-13',
          classes: [
            {
              time: '08:00 - 09:30',
              subject: 'Mathematics',
              teacher: 'Prof. Johnson',
              room: 'Room 101',
              type: 'lecture',
            },
            {
              time: '10:00 - 11:30',
              subject: 'English Literature',
              teacher: 'Dr. Smith',
              room: 'Room 205',
              type: 'seminar',
            },
            {
              time: '13:00 - 14:30',
              subject: 'Physics',
              teacher: 'Prof. Wilson',
              room: 'Lab 301',
              type: 'lab',
            },
            {
              time: '15:00 - 16:30',
              subject: 'Computer Science',
              teacher: 'Dr. Anderson',
              room: 'Room 401',
              type: 'practical',
            },
          ],
        },
        {
          day: 'Tuesday',
          date: '2025-01-14',
          classes: [
            {
              time: '08:00 - 09:30',
              subject: 'Chemistry',
              teacher: 'Dr. Brown',
              room: 'Lab 201',
              type: 'lab',
            },
            {
              time: '10:00 - 11:30',
              subject: 'History',
              teacher: 'Prof. Davis',
              room: 'Room 105',
              type: 'lecture',
            },
            {
              time: '13:00 - 14:30',
              subject: 'Mathematics',
              teacher: 'Prof. Johnson',
              room: 'Room 101',
              type: 'tutorial',
            },
            {
              time: '15:00 - 16:30',
              subject: 'Physical Education',
              teacher: 'Coach Miller',
              room: 'Gymnasium',
              type: 'practical',
            },
          ],
        },
        {
          day: 'Wednesday',
          date: '2025-01-15',
          classes: [
            {
              time: '08:00 - 09:30',
              subject: 'Biology',
              teacher: 'Dr. Garcia',
              room: 'Lab 302',
              type: 'lab',
            },
            {
              time: '10:00 - 11:30',
              subject: 'Art',
              teacher: 'Ms. Taylor',
              room: 'Art Studio',
              type: 'workshop',
            },
            {
              time: '13:00 - 14:30',
              subject: 'English Literature',
              teacher: 'Dr. Smith',
              room: 'Room 205',
              type: 'discussion',
            },
          ],
        },
        {
          day: 'Thursday',
          date: '2025-01-16',
          classes: [
            {
              time: '08:00 - 09:30',
              subject: 'Mathematics',
              teacher: 'Prof. Johnson',
              room: 'Room 101',
              type: 'lecture',
            },
            {
              time: '10:00 - 11:30',
              subject: 'Physics',
              teacher: 'Prof. Wilson',
              room: 'Room 301',
              type: 'lecture',
            },
            {
              time: '13:00 - 14:30',
              subject: 'Computer Science',
              teacher: 'Dr. Anderson',
              room: 'Room 401',
              type: 'project',
            },
            {
              time: '15:00 - 16:30',
              subject: 'Music',
              teacher: 'Mr. Thompson',
              room: 'Music Room',
              type: 'practice',
            },
          ],
        },
        {
          day: 'Friday',
          date: '2025-01-17',
          classes: [
            {
              time: '08:00 - 09:30',
              subject: 'Chemistry',
              teacher: 'Dr. Brown',
              room: 'Room 201',
              type: 'lecture',
            },
            {
              time: '10:00 - 11:30',
              subject: 'History',
              teacher: 'Prof. Davis',
              room: 'Room 105',
              type: 'presentation',
            },
            {
              time: '13:00 - 14:30',
              subject: 'Study Hall',
              teacher: 'Various',
              room: 'Library',
              type: 'study',
            },
          ],
        },
      ];

      setSchedule(mockSchedule);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClassTypeColor = (type) => {
    switch (type) {
      case 'lecture':
        return 'primary';
      case 'lab':
        return 'success';
      case 'tutorial':
        return 'warning';
      case 'practical':
        return 'info';
      case 'seminar':
        return 'secondary';
      case 'workshop':
        return 'error';
      default:
        return 'default';
    }
  };

  const getWeekDates = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1); // Get Monday

    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <DashboardLayout>
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
            📅 My Schedule
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigateWeek(-1)}>
              <PrevIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ minWidth: 200, textAlign: 'center' }}
            >
              Week of {formatDate(getWeekDates()[0])}
            </Typography>
            <IconButton onClick={() => navigateWeek(1)}>
              <NextIcon />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<TodayIcon />}
              onClick={() => setCurrentWeek(new Date())}
            >
              Today
            </Button>
          </Box>
        </Box>

        {/* Weekly Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {schedule.map((day) => (
            <Grid item xs={12} md={2.4} key={day.day}>
              <Card
                sx={{
                  height: '100%',
                  border: isToday(new Date(day.date))
                    ? '2px solid #1976d2'
                    : '1px solid #e0e0e0',
                }}
              >
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {day.day}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                    {isToday(new Date(day.date)) && (
                      <Chip
                        label="Today"
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {day.classes.length} classes
                  </Typography>

                  {day.classes.slice(0, 3).map((cls, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="caption" display="block">
                        {cls.time.split(' - ')[0]}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {cls.subject}
                      </Typography>
                    </Box>
                  ))}

                  {day.classes.length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                      +{day.classes.length - 3} more
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Detailed Schedule */}
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <EventIcon />
              Detailed Weekly Schedule
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Monday</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tuesday</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Wednesday</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Thursday</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Friday</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    '08:00 - 09:30',
                    '10:00 - 11:30',
                    '13:00 - 14:30',
                    '15:00 - 16:30',
                  ].map((timeSlot) => (
                    <TableRow key={timeSlot}>
                      <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
                        {timeSlot}
                      </TableCell>
                      {schedule.map((day) => {
                        const classInSlot = day.classes.find(
                          (cls) => cls.time === timeSlot
                        );
                        return (
                          <TableCell key={day.day} sx={{ minWidth: 200 }}>
                            {classInSlot ? (
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ fontWeight: 'bold' }}
                                >
                                  {classInSlot.subject}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    mt: 0.5,
                                  }}
                                >
                                  <PersonIcon fontSize="small" color="action" />
                                  <Typography variant="caption">
                                    {classInSlot.teacher}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                  }}
                                >
                                  <RoomIcon fontSize="small" color="action" />
                                  <Typography variant="caption">
                                    {classInSlot.room}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={classInSlot.type}
                                  size="small"
                                  color={getClassTypeColor(classInSlot.type)}
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Free period
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TodayIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Today's Classes
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  View your classes for today
                </Typography>
                <Button variant="contained" size="small">
                  View Today
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <EventIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Upcoming Events
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Check upcoming school events
                </Typography>
                <Button variant="contained" color="success" size="small">
                  View Events
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ScheduleIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Schedule Changes
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Check for any schedule updates
                </Typography>
                <Button variant="contained" color="warning" size="small">
                  Check Updates
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default StudentSchedule;
