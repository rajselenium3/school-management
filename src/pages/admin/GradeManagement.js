import React from 'react';
import { Typography, Box } from '@mui/material';
import DashboardLayout from '../../components/layout/DashboardLayout.js';

const GradeManagement = () => {
  return (
    <DashboardLayout title="Grade Management">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Grade Management
        </Typography>
        <Typography variant="body1">
          Grade management features are being developed...
        </Typography>
      </Box>
    </DashboardLayout>
  );
};

export default GradeManagement;
