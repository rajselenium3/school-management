import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

import DashboardLayout from '../components/layout/DashboardLayout.js';

const ProfilePage = () => {
  const { user, role } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    department: '',
    grade: '',
    studentId: '',
    teacherId: '',
    bio: '',
    emergencyContact: '',
    parentName: '',
    parentPhone: '',
  });

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = () => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '+1-234-567-8900',
        address: user.address || '123 Main Street, City, State 12345',
        dateOfBirth: user.dateOfBirth || '1990-01-01',
        department: user.department || 'Computer Science',
        grade: user.grade || '10',
        studentId: user.studentId || 'STU001',
        teacherId: user.teacherId || 'TCH001',
        bio: user.bio || 'Welcome to the AI School Management System!',
        emergencyContact:
          user.emergencyContact || 'Emergency Contact: +1-234-567-8901',
        parentName: user.parentName || 'John Parent',
        parentPhone: user.parentPhone || '+1-234-567-8902',
      });

      // Load profile picture from localStorage or use default
      const savedPicture = localStorage.getItem(`profilePicture_${user.email}`);
      setProfilePicture(savedPicture || getDefaultAvatar());
    }
  };

  const getDefaultAvatar = () => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#d32f2f'];
    const colorIndex = (user?.email?.length || 0) % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${profileData.firstName} ${profileData.lastName}`
    )}&background=${colors[colorIndex].substring(1)}&color=fff&size=200`;
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call to save profile
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save to localStorage for demo purposes
      localStorage.setItem(
        `profileData_${user.email}`,
        JSON.stringify(profileData)
      );

      setEditing(false);
      console.log('Profile saved:', profileData);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      // Simulate upload to server
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save to localStorage for demo
      localStorage.setItem(`profilePicture_${user.email}`, profilePicture);

      setUploadDialog(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleSpecificFields = () => {
    switch (role) {
      case 'STUDENT':
        return [
          {
            key: 'studentId',
            label: 'Student ID',
            icon: BadgeIcon,
            value: profileData.studentId,
          },
          {
            key: 'grade',
            label: 'Grade',
            icon: SchoolIcon,
            value: `Grade ${profileData.grade}`,
          },
          {
            key: 'parentName',
            label: 'Parent/Guardian',
            icon: PersonIcon,
            value: profileData.parentName,
          },
          {
            key: 'parentPhone',
            label: 'Parent Phone',
            icon: PhoneIcon,
            value: profileData.parentPhone,
          },
          {
            key: 'emergencyContact',
            label: 'Emergency Contact',
            icon: PhoneIcon,
            value: profileData.emergencyContact,
          },
        ];
      case 'TEACHER':
        return [
          {
            key: 'teacherId',
            label: 'Teacher ID',
            icon: BadgeIcon,
            value: profileData.teacherId,
          },
          {
            key: 'department',
            label: 'Department',
            icon: WorkIcon,
            value: profileData.department,
          },
          {
            key: 'emergencyContact',
            label: 'Emergency Contact',
            icon: PhoneIcon,
            value: profileData.emergencyContact,
          },
        ];
      case 'ADMIN':
        return [
          {
            key: 'department',
            label: 'Department',
            icon: WorkIcon,
            value: 'Administration',
          },
          {
            key: 'emergencyContact',
            label: 'Emergency Contact',
            icon: PhoneIcon,
            value: profileData.emergencyContact,
          },
        ];
      case 'PARENT':
        return [
          {
            key: 'emergencyContact',
            label: 'Emergency Contact',
            icon: PhoneIcon,
            value: profileData.emergencyContact,
          },
        ];
      default:
        return [];
    }
  };

  const getProfileTitle = () => {
    switch (role) {
      case 'STUDENT':
        return '🎓 Student Profile';
      case 'TEACHER':
        return '👨‍🏫 Teacher Profile';
      case 'ADMIN':
        return '👑 Administrator Profile';
      case 'PARENT':
        return '👨‍👩‍👧‍👦 Parent Profile';
      default:
        return '👤 User Profile';
    }
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
            {getProfileTitle()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!editing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditing(true)}
                sx={{
                  background:
                    'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setEditing(false);
                    loadProfileData();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={
                    loading ? <CircularProgress size={16} /> : <SaveIcon />
                  }
                  onClick={handleSaveProfile}
                  disabled={loading}
                  sx={{
                    background:
                      'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Picture & Basic Info */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => setUploadDialog(true)}
                      sx={{
                        bgcolor: 'white',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'grey.100' },
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    src={profilePicture}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  >
                    {`${profileData.firstName[0] || ''}${
                      profileData.lastName[0] || ''
                    }`}
                  </Avatar>
                </Badge>

                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {profileData.firstName} {profileData.lastName}
                </Typography>

                <Chip
                  label={role}
                  color="primary"
                  sx={{ mb: 2, fontWeight: 'bold' }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {profileData.bio}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="action" fontSize="small" />
                    <Typography variant="body2">{profileData.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography variant="body2">{profileData.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      {profileData.address}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <PersonIcon />
                      Personal Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={profileData.firstName}
                          onChange={(e) =>
                            handleInputChange('firstName', e.target.value)
                          }
                          disabled={!editing}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={profileData.lastName}
                          onChange={(e) =>
                            handleInputChange('lastName', e.target.value)
                          }
                          disabled={!editing}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={profileData.email}
                          disabled={true} // Email usually can't be changed
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={profileData.phone}
                          onChange={(e) =>
                            handleInputChange('phone', e.target.value)
                          }
                          disabled={!editing}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange('dateOfBirth', e.target.value)
                          }
                          disabled={!editing}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Address"
                          value={profileData.address}
                          onChange={(e) =>
                            handleInputChange('address', e.target.value)
                          }
                          disabled={!editing}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          multiline
                          rows={3}
                          value={profileData.bio}
                          onChange={(e) =>
                            handleInputChange('bio', e.target.value)
                          }
                          disabled={!editing}
                          InputLabelProps={{ shrink: true }}
                          placeholder="Tell us about yourself..."
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Role-Specific Information */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <SchoolIcon />
                      {role} Information
                    </Typography>
                    <List>
                      {getRoleSpecificFields().map((field) => (
                        <ListItem key={field.key} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <field.icon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={field.label}
                            secondary={
                              editing ? (
                                <TextField
                                  fullWidth
                                  value={profileData[field.key]}
                                  onChange={(e) =>
                                    handleInputChange(field.key, e.target.value)
                                  }
                                  size="small"
                                  sx={{ mt: 1 }}
                                />
                              ) : (
                                field.value
                              )
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Account Settings */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <SecurityIcon />
                      Account Settings
                    </Typography>
                    <List>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <SecurityIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Change Password"
                          secondary="Update your account password"
                        />
                        <Button variant="outlined" size="small">
                          Change
                        </Button>
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <NotificationsIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Notification Preferences"
                          secondary="Manage email and push notifications"
                        />
                        <Button variant="outlined" size="small">
                          Configure
                        </Button>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Photo Upload Dialog */}
        <Dialog
          open={uploadDialog}
          onClose={() => setUploadDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              {profilePicture && (
                <Avatar
                  src={profilePicture}
                  sx={{ width: 150, height: 150, mx: 'auto', mb: 3 }}
                />
              )}

              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload-input"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="photo-upload-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                  sx={{ mb: 2 }}
                >
                  Choose Photo
                </Button>
              </label>

              {selectedFile && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Selected: {selectedFile.name} (
                  {Math.round(selectedFile.size / 1024)}KB)
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
            <Button
              onClick={handleUploadPhoto}
              variant="contained"
              disabled={!selectedFile || loading}
              startIcon={
                loading ? <CircularProgress size={16} /> : <SaveIcon />
              }
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default ProfilePage;
