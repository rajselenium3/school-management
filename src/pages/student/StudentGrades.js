import React from 'react';
import { Typography, Box } from '@mui/material';
import DashboardLayout from '../../components/layout/DashboardLayout.js';

const StudentGrades = () => {
  return (
    <DashboardLayout title="My Grades">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Grades
        </Typography>
        <Typography variant="body1">
          Student grades features are being developed...
        </Typography>
      </Box>
    </DashboardLayout>
  );
};

export default StudentGrades;
