import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Switch,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Extension as IntegrationIcon,
  Backup as BackupIcon,
  Update as UpdateIcon,
  Storage as DatabaseIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Storage as StorageIcon,
  CloudQueue as CloudSyncIcon,
  Key as VpnKeyIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import { useSelector } from 'react-redux';

const Settings = () => {
  const { role } = useSelector((state) => state.auth);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // School configuration state
  const [schoolConfig, setSchoolConfig] = useState({
    schoolName: 'EduAI Management School',
    schoolLogo: null,
    schoolNameColor: '#ffffff',
    schoolNameFontSize: '1.2rem',
    schoolAddress: '123 Education Street, Learning City, LC 12345',
    schoolPhone: '+1-234-567-8900',
    schoolEmail: 'admin@eduai-school.com',
    schoolWebsite: 'https://eduai-school.com',
  });

  // Settings state
  const [settings, setSettings] = useState({
    system: {
      schoolName: 'EduAI Management School',
      schoolCode: 'EDU001',
      address: '123 Education Street, Learning City, LC 12345',
      phone: '+1-234-567-8900',
      email: 'admin@eduai-school.com',
      website: 'https://eduai-school.com',
      timezone: 'America/New_York',
      language: 'en',
      currency: 'USD',
      academicYear: '2024-2025',
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: false,
        maxAttempts: 5,
        lockoutDuration: 30,
      },
      sessionTimeout: 120,
      twoFactorAuth: false,
      ipWhitelist: '',
      auditLogging: true,
      dataEncryption: true,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      assignmentReminders: true,
      gradeNotifications: true,
      attendanceAlerts: true,
      systemAlerts: true,
      weeklyReports: true,
    },
    integrations: {
      googleWorkspace: {
        enabled: false,
        clientId: '',
        domain: '',
      },
      microsoft365: {
        enabled: false,
        tenantId: '',
        clientId: '',
      },
      zoom: {
        enabled: false,
        apiKey: '',
        apiSecret: '',
      },
      canvas: {
        enabled: false,
        apiUrl: '',
        apiToken: '',
      },
    },
    appearance: {
      theme: 'light',
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
      compactMode: false,
      showAnimations: true,
      customLogo: '',
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      cloudBackup: false,
      lastBackup: new Date().toISOString(),
    },
  });

  // Role-based tabs
  const getTabsForRole = () => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return [
          'General',
          'Security',
          'Notifications',
          'Integrations',
          'Appearance',
          'Backup & Data',
          'School Branding',
        ];
      case 'teacher':
        return ['Profile', 'Notifications', 'Appearance'];
      case 'student':
        return ['Profile', 'Notifications', 'Appearance'];
      case 'parent':
        return ['Profile', 'Notifications', 'Communication'];
      default:
        return ['Profile', 'Notifications'];
    }
  };

  const tabs = getTabsForRole();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Simulate loading settings from server
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Load school configuration from localStorage
      const savedSchoolConfig = localStorage.getItem('schoolConfig');
      if (savedSchoolConfig) {
        const config = JSON.parse(savedSchoolConfig);
        setSchoolConfig({
          schoolName: config.name || 'EduAI Management School',
          schoolLogo: config.logo || null,
          schoolNameColor: config.nameColor || '#ffffff',
          schoolNameFontSize: config.nameFontSize || '1.2rem',
          schoolAddress:
            config.address || '123 Education Street, Learning City, LC 12345',
          schoolPhone: config.phone || '+1-234-567-8900',
          schoolEmail: config.email || 'admin@eduai-school.com',
          schoolWebsite: config.website || 'https://eduai-school.com',
        });
      }

      // Settings already initialized in state
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate saving settings to server
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Settings saved:', settings);

      // Save school configuration to localStorage
      localStorage.setItem(
        'schoolConfig',
        JSON.stringify({
          name: schoolConfig.schoolName,
          logo: schoolConfig.schoolLogo,
          nameColor: schoolConfig.schoolNameColor,
          nameFontSize: schoolConfig.schoolNameFontSize,
          address: schoolConfig.schoolAddress,
          phone: schoolConfig.schoolPhone,
          email: schoolConfig.schoolEmail,
          website: schoolConfig.schoolWebsite,
        })
      );

      // Dispatch custom event to update school branding across the app
      window.dispatchEvent(new CustomEvent('schoolConfigUpdated'));

      // Show success message
      alert('Settings saved successfully! School branding has been updated.');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleNestedSettingChange = (category, subcategory, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...prev[category][subcategory],
          [field]: value,
        },
      },
    }));
  };

  const handleSchoolConfigChange = (field, value) => {
    setSchoolConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        alert('Logo file must be less than 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        handleSchoolConfigChange('schoolLogo', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderGeneralSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <SchoolIcon />
              School Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Name"
                  value={settings.system.schoolName}
                  onChange={(e) =>
                    handleSettingChange('system', 'schoolName', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Code"
                  value={settings.system.schoolCode}
                  onChange={(e) =>
                    handleSettingChange('system', 'schoolCode', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={settings.system.address}
                  onChange={(e) =>
                    handleSettingChange('system', 'address', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={settings.system.phone}
                  onChange={(e) =>
                    handleSettingChange('system', 'phone', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={settings.system.email}
                  onChange={(e) =>
                    handleSettingChange('system', 'email', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={settings.system.website}
                  onChange={(e) =>
                    handleSettingChange('system', 'website', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Academic Year"
                  value={settings.system.academicYear}
                  onChange={(e) =>
                    handleSettingChange(
                      'system',
                      'academicYear',
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <LanguageIcon />
              Regional Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel shrink>Timezone</InputLabel>
                  <Select
                    value={settings.system.timezone}
                    onChange={(e) =>
                      handleSettingChange('system', 'timezone', e.target.value)
                    }
                  >
                    <MenuItem value="America/New_York">
                      Eastern Time (ET)
                    </MenuItem>
                    <MenuItem value="America/Chicago">
                      Central Time (CT)
                    </MenuItem>
                    <MenuItem value="America/Denver">
                      Mountain Time (MT)
                    </MenuItem>
                    <MenuItem value="America/Los_Angeles">
                      Pacific Time (PT)
                    </MenuItem>
                    <MenuItem value="UTC">UTC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel shrink>Language</InputLabel>
                  <Select
                    value={settings.system.language}
                    onChange={(e) =>
                      handleSettingChange('system', 'language', e.target.value)
                    }
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                    <MenuItem value="zh">Chinese</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel shrink>Currency</InputLabel>
                  <Select
                    value={settings.system.currency}
                    onChange={(e) =>
                      handleSettingChange('system', 'currency', e.target.value)
                    }
                  >
                    <MenuItem value="USD">USD - US Dollar</MenuItem>
                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                    <MenuItem value="GBP">GBP - British Pound</MenuItem>
                    <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
                    <MenuItem value="AUD">AUD - Australian Dollar</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <VpnKeyIcon />
              Password Policy
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Length"
                  type="number"
                  value={settings.security.passwordPolicy.minLength}
                  onChange={(e) =>
                    handleNestedSettingChange(
                      'security',
                      'passwordPolicy',
                      'minLength',
                      parseInt(e.target.value)
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: 6, max: 20 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Login Attempts"
                  type="number"
                  value={settings.security.passwordPolicy.maxAttempts}
                  onChange={(e) =>
                    handleNestedSettingChange(
                      'security',
                      'passwordPolicy',
                      'maxAttempts',
                      parseInt(e.target.value)
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: 3, max: 10 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Password Requirements:
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        settings.security.passwordPolicy.requireUppercase
                      }
                      onChange={(e) =>
                        handleNestedSettingChange(
                          'security',
                          'passwordPolicy',
                          'requireUppercase',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Require uppercase letters"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        settings.security.passwordPolicy.requireLowercase
                      }
                      onChange={(e) =>
                        handleNestedSettingChange(
                          'security',
                          'passwordPolicy',
                          'requireLowercase',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Require lowercase letters"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          'security',
                          'passwordPolicy',
                          'requireNumbers',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Require numbers"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.passwordPolicy.requireSymbols}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          'security',
                          'passwordPolicy',
                          'requireSymbols',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Require special characters"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <ShieldIcon />
              Access & Security
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    handleSettingChange(
                      'security',
                      'sessionTimeout',
                      parseInt(e.target.value)
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: 15, max: 480 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) =>
                        handleSettingChange(
                          'security',
                          'twoFactorAuth',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Enable Two-Factor Authentication"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.auditLogging}
                      onChange={(e) =>
                        handleSettingChange(
                          'security',
                          'auditLogging',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Enable Audit Logging"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.dataEncryption}
                      onChange={(e) =>
                        handleSettingChange(
                          'security',
                          'dataEncryption',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Enable Data Encryption"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="IP Whitelist (comma-separated)"
                  value={settings.security.ipWhitelist}
                  onChange={(e) =>
                    handleSettingChange(
                      'security',
                      'ipWhitelist',
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  placeholder="192.168.1.0/24, 10.0.0.0/8"
                  helperText="Leave empty to allow all IPs"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <NotificationsIcon />
              Notification Channels
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) =>
                      handleSettingChange(
                        'notifications',
                        'emailNotifications',
                        e.target.checked
                      )
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive browser push notifications"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) =>
                      handleSettingChange(
                        'notifications',
                        'pushNotifications',
                        e.target.checked
                      )
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Types
            </Typography>
            <List>
              {[
                {
                  key: 'assignmentReminders',
                  label: 'Assignment Reminders',
                  desc: 'Upcoming assignment deadlines',
                },
                {
                  key: 'gradeNotifications',
                  label: 'Grade Notifications',
                  desc: 'New grades published',
                },
                {
                  key: 'attendanceAlerts',
                  label: 'Attendance Alerts',
                  desc: 'Attendance-related notifications',
                },
                {
                  key: 'systemAlerts',
                  label: 'System Alerts',
                  desc: 'System maintenance and updates',
                },
                {
                  key: 'weeklyReports',
                  label: 'Weekly Reports',
                  desc: 'Weekly summary reports',
                },
              ].map((item) => (
                <ListItem key={item.key}>
                  <ListItemText primary={item.label} secondary={item.desc} />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications[item.key]}
                      onChange={(e) =>
                        handleSettingChange(
                          'notifications',
                          item.key,
                          e.target.checked
                        )
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderIntegrationSettings = () => (
    <Grid container spacing={3}>
      {Object.entries(settings.integrations).map(([key, integration]) => (
        <Grid item xs={12} key={key}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                  {key === 'googleWorkspace'
                    ? 'Google Workspace'
                    : key === 'microsoft365'
                    ? 'Microsoft 365'
                    : key === 'zoom'
                    ? 'Zoom'
                    : 'Canvas LMS'}
                </Typography>
                <Switch
                  checked={integration.enabled}
                  onChange={(e) =>
                    handleNestedSettingChange(
                      'integrations',
                      key,
                      'enabled',
                      e.target.checked
                    )
                  }
                />
              </Box>
              {integration.enabled && (
                <Grid container spacing={2}>
                  {Object.entries(integration)
                    .filter(([field]) => field !== 'enabled')
                    .map(([field, value]) => (
                      <Grid item xs={12} md={6} key={field}>
                        <TextField
                          fullWidth
                          label={field
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                          value={value}
                          onChange={(e) =>
                            handleNestedSettingChange(
                              'integrations',
                              key,
                              field,
                              e.target.value
                            )
                          }
                          type={
                            field.includes('Secret') || field.includes('Token')
                              ? 'password'
                              : 'text'
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderAppearanceSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <PaletteIcon />
              Theme & Appearance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Theme</InputLabel>
                  <Select
                    value={settings.appearance.theme}
                    onChange={(e) =>
                      handleSettingChange('appearance', 'theme', e.target.value)
                    }
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto (System)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Primary Color"
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) =>
                    handleSettingChange(
                      'appearance',
                      'primaryColor',
                      e.target.value
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.appearance.compactMode}
                      onChange={(e) =>
                        handleSettingChange(
                          'appearance',
                          'compactMode',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Compact Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.appearance.showAnimations}
                      onChange={(e) =>
                        handleSettingChange(
                          'appearance',
                          'showAnimations',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Show Animations"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderBackupSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <BackupIcon />
              Backup Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.backup.autoBackup}
                      onChange={(e) =>
                        handleSettingChange(
                          'backup',
                          'autoBackup',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Enable Automatic Backups"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Backup Frequency</InputLabel>
                  <Select
                    value={settings.backup.backupFrequency}
                    onChange={(e) =>
                      handleSettingChange(
                        'backup',
                        'backupFrequency',
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Retention Days"
                  type="number"
                  value={settings.backup.retentionDays}
                  onChange={(e) =>
                    handleSettingChange(
                      'backup',
                      'retentionDays',
                      parseInt(e.target.value)
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: 7, max: 365 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Last Backup:{' '}
                  {new Date(settings.backup.lastBackup).toLocaleString()}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<BackupIcon />}
                  sx={{ mt: 1 }}
                >
                  Start Manual Backup
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSchoolBrandingSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <SchoolIcon />
              School Information & Branding
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Name"
                  value={schoolConfig.schoolName}
                  onChange={(e) =>
                    handleSchoolConfigChange('schoolName', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  helperText="This will be displayed throughout the system"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    School Name Color
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                      type="color"
                      value={schoolConfig.schoolNameColor}
                      onChange={(e) =>
                        handleSchoolConfigChange(
                          'schoolNameColor',
                          e.target.value
                        )
                      }
                      style={{
                        width: '60px',
                        height: '40px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Preview:
                        <span
                          style={{
                            color: schoolConfig.schoolNameColor,
                            marginLeft: '8px',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                          }}
                        >
                          {schoolConfig.schoolName}
                        </span>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Color: {schoolConfig.schoolNameColor}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    School Name Font Size
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: '200px' }}>
                      <input
                        type="range"
                        min="0.8"
                        max="2.0"
                        step="0.1"
                        value={parseFloat(schoolConfig.schoolNameFontSize)}
                        onChange={(e) =>
                          handleSchoolConfigChange(
                            'schoolNameFontSize',
                            `${e.target.value}rem`
                          )
                        }
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: '4px',
                          background: '#ddd',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Preview:
                        <span
                          style={{
                            color: schoolConfig.schoolNameColor,
                            fontSize: schoolConfig.schoolNameFontSize,
                            marginLeft: '8px',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                          }}
                        >
                          {schoolConfig.schoolName}
                        </span>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Size: {schoolConfig.schoolNameFontSize} (Min: 0.8rem,
                        Max: 2.0rem)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    School Logo
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    {schoolConfig.schoolLogo ? (
                      <Avatar
                        src={schoolConfig.schoolLogo}
                        sx={{ width: 64, height: 64 }}
                      />
                    ) : (
                      <Avatar
                        sx={{ width: 64, height: 64, bgcolor: '#1976d2' }}
                      >
                        <SchoolIcon />
                      </Avatar>
                    )}
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="logo-upload"
                        type="file"
                        onChange={handleLogoUpload}
                      />
                      <label htmlFor="logo-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          size="small"
                        >
                          Upload Logo
                        </Button>
                      </label>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Recommended: 256x256px, PNG format
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="School Address"
                  value={schoolConfig.schoolAddress}
                  onChange={(e) =>
                    handleSchoolConfigChange('schoolAddress', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Phone"
                  value={schoolConfig.schoolPhone}
                  onChange={(e) =>
                    handleSchoolConfigChange('schoolPhone', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Email"
                  type="email"
                  value={schoolConfig.schoolEmail}
                  onChange={(e) =>
                    handleSchoolConfigChange('schoolEmail', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Website"
                  value={schoolConfig.schoolWebsite}
                  onChange={(e) =>
                    handleSchoolConfigChange('schoolWebsite', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderNonAdminSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {role} Settings
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              You have access to limited settings. Contact your administrator
              for additional configuration options.
            </Alert>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.appearance?.theme || 'light'}
                    onChange={(e) =>
                      handleNestedSettingChange(
                        'appearance',
                        'theme',
                        'theme',
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto (System)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.system?.language || 'en'}
                    onChange={(e) =>
                      handleSettingChange('system', 'language', e.target.value)
                    }
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Notification Preferences:
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        settings.notifications?.emailNotifications !== false
                      }
                      onChange={(e) =>
                        handleSettingChange(
                          'notifications',
                          'emailNotifications',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        settings.notifications?.pushNotifications !== false
                      }
                      onChange={(e) =>
                        handleSettingChange(
                          'notifications',
                          'pushNotifications',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Push Notifications"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    if (role?.toLowerCase() !== 'admin') {
      return renderNonAdminSettings();
    }

    switch (currentTab) {
      case 0:
        return renderGeneralSettings();
      case 1:
        return renderSecuritySettings();
      case 2:
        return renderNotificationSettings();
      case 3:
        return renderIntegrationSettings();
      case 4:
        return renderAppearanceSettings();
      case 5:
        return renderBackupSettings();
      case 6:
        return renderSchoolBrandingSettings();
      default:
        return renderGeneralSettings();
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
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
            >
              ⚙️{' '}
              {role?.toLowerCase() === 'admin'
                ? 'System Settings'
                : 'My Settings'}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {role?.toLowerCase() === 'admin'
                ? 'Configure your school management system'
                : 'Manage your personal preferences and settings'}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={handleSaveSettings}
            disabled={saving}
            sx={{
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Card>

        {/* Tab Content */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '40vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          renderTabContent()
        )}
      </Box>
    </DashboardLayout>
  );
};

export default Settings;
