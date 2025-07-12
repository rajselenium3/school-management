import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  EventNote as EventNoteIcon,
  SmartToy as PsychologyIcon,
  Analytics as AnalyticsIcon,
  Message as MessageIcon,
  AttachMoney as AttachMoneyIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Grade as GradeIcon,
  Storage as DataIcon,
} from '@mui/icons-material';
import authService from '../../services/authService.js';
import { logout } from '../../store/slices/authSlice.js';
import { toggleSidebar } from '../../store/slices/uiSlice.js';
import './DashboardLayout.css';

const drawerWidth = 280;
const collapsedDrawerWidth = 65;

const DashboardLayout = ({ children, title }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [schoolConfig, setSchoolConfig] = useState({
    name: 'EduAI Management',
    logo: null,
    nameColor: '#ffffff',
    nameFontSize: '1.2rem', // Add school name font size customization
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, role } = useSelector((state) => state.auth);
  const uiState = useSelector((state) => state.ui);
  const sidebarOpen = uiState?.sidebarOpen ?? true;

  console.log('🎛️ DashboardLayout rendering with:', {
    title,
    role,
    user: user?.email,
    uiStateExists: !!uiState,
    sidebarOpen,
    schoolConfig,
  });

  // Load school configuration and listen for changes
  React.useEffect(() => {
    const loadSchoolConfig = () => {
      const savedConfig = localStorage.getItem('schoolConfig');
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          console.log('📚 Loading school config:', config);
          setSchoolConfig({
            name: config.name || 'EduAI Management',
            logo: config.logo || null,
            nameColor: config.nameColor || '#ffffff',
            nameFontSize: config.nameFontSize || '1.2rem',
          });
        } catch (error) {
          console.error('Error parsing school config:', error);
        }
      }
    };

    // Load initially
    loadSchoolConfig();

    // Listen for storage changes (when settings are updated)
    const handleStorageChange = (e) => {
      if (e.key === 'schoolConfig') {
        loadSchoolConfig();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events for same-window updates
    const handleSchoolConfigUpdate = () => {
      loadSchoolConfig();
    };

    window.addEventListener('schoolConfigUpdated', handleSchoolConfigUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'schoolConfigUpdated',
        handleSchoolConfigUpdate
      );
    };
  }, []);

  const handleDrawerToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleProfileMenuClose();
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        text: 'Dashboard',
        icon: DashboardIcon,
        path: `/dashboard/${role?.toLowerCase()}`,
      },
    ];

    switch (role?.toLowerCase()) {
      case 'admin':
        return [
          ...baseItems,
          {
            text: 'Students',
            icon: PeopleIcon,
            path: '/dashboard/admin/students',
          },
          {
            text: 'Teachers',
            icon: SchoolIcon,
            path: '/dashboard/admin/teachers',
          },
          { text: 'Courses', icon: BookIcon, path: '/dashboard/admin/courses' },
          {
            text: 'Assignments',
            icon: AssignmentIcon,
            path: '/dashboard/admin/assignments',
          },
          { text: 'Grades', icon: GradeIcon, path: '/dashboard/admin/grades' },
          {
            text: 'Attendance',
            icon: EventNoteIcon,
            path: '/dashboard/admin/attendance',
          },
          {
            text: 'AI Insights',
            icon: PsychologyIcon,
            path: '/dashboard/admin/ai-insights',
          },
          {
            text: 'Analytics',
            icon: AnalyticsIcon,
            path: '/dashboard/admin/analytics',
          },
          {
            text: 'Communication',
            icon: MessageIcon,
            path: '/dashboard/admin/communication',
          },
          {
            text: 'Financial',
            icon: AttachMoneyIcon,
            path: '/dashboard/admin/financial',
          },
          {
            text: 'Data Management',
            icon: DataIcon,
            path: '/dashboard/admin/data-management',
          },
          {
            text: 'Settings',
            icon: SettingsIcon,
            path: '/dashboard/admin/settings',
          },
        ];
      case 'teacher':
        return [
          ...baseItems,
          {
            text: 'My Students',
            icon: PeopleIcon,
            path: '/dashboard/teacher/students',
          },
          {
            text: 'My Courses',
            icon: BookIcon,
            path: '/dashboard/teacher/courses',
          },
          {
            text: 'Assignments',
            icon: AssignmentIcon,
            path: '/dashboard/teacher/assignments',
          },
          {
            text: 'Gradebook',
            icon: GradeIcon,
            path: '/dashboard/teacher/grades',
          },
          {
            text: 'Attendance',
            icon: EventNoteIcon,
            path: '/dashboard/teacher/attendance',
          },
          {
            text: 'AI Assistant',
            icon: PsychologyIcon,
            path: '/dashboard/teacher/ai-assistant',
          },
          {
            text: 'Messages',
            icon: MessageIcon,
            path: '/dashboard/teacher/messages',
          },
        ];
      case 'student':
        return [
          ...baseItems,
          {
            text: 'My Courses',
            icon: BookIcon,
            path: '/dashboard/student/courses',
          },
          {
            text: 'Assignments',
            icon: AssignmentIcon,
            path: '/dashboard/student/assignments',
          },
          {
            text: 'My Grades',
            icon: GradeIcon,
            path: '/dashboard/student/grades',
          },
          {
            text: 'Progress Report',
            icon: AnalyticsIcon,
            path: '/dashboard/student/progress-report',
          },
          {
            text: 'Schedule',
            icon: EventNoteIcon,
            path: '/dashboard/student/schedule',
          },
          {
            text: 'AI Tutor',
            icon: PsychologyIcon,
            path: '/dashboard/student/ai-tutor',
          },
          {
            text: 'Messages',
            icon: MessageIcon,
            path: '/dashboard/student/messages',
          },
        ];
      case 'parent':
        return [
          ...baseItems,
          {
            text: 'My Children',
            icon: PeopleIcon,
            path: '/dashboard/parent/children',
          },
          {
            text: 'Progress Report',
            icon: AnalyticsIcon,
            path: '/dashboard/parent/progress-report',
          },
          { text: 'Grades', icon: GradeIcon, path: '/dashboard/parent/grades' },
          {
            text: 'Attendance',
            icon: EventNoteIcon,
            path: '/dashboard/parent/attendance',
          },
          {
            text: 'Communication',
            icon: MessageIcon,
            path: '/dashboard/parent/communication',
          },
          {
            text: 'Payments',
            icon: AttachMoneyIcon,
            path: '/dashboard/parent/payments',
          },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const drawer = (
    <div className="sidebar-content">
      <div className="sidebar-user">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {(sidebarOpen || !isMobile) && (
            <Box className="user-info">
              <Avatar className="user-avatar">
                {user?.displayName?.charAt(0) ||
                  user?.firstName?.charAt(0) ||
                  role?.charAt(0).toUpperCase()}
              </Avatar>
              <Box className="user-details">
                <Typography variant="subtitle2" className="user-name">
                  {user?.displayName ||
                    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                    'Demo User'}
                </Typography>
                <Chip
                  label={
                    role?.charAt(0) + role?.slice(1).toLowerCase() || 'User'
                  }
                  size="small"
                  className="user-role"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
          )}

          {/* Menu Toggle Button */}
          <IconButton
            onClick={handleDrawerToggle}
            className="drawer-toggle"
            size="small"
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)',
                color: '#1976d2',
              },
            }}
          >
            <ChevronLeftIcon
              sx={{
                transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </IconButton>
        </Box>
      </div>

      <Divider />

      <List className="sidebar-nav">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = window.location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                selected={isActive}
              >
                <ListItemIcon className="nav-icon">
                  <Icon />
                </ListItemIcon>
                {(sidebarOpen || !isMobile) && (
                  <ListItemText primary={item.text} className="nav-text" />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box className="dashboard-layout">
      {/* Fixed Header - Independent from Drawer */}
      <AppBar
        position="fixed"
        className="dashboard-appbar"
        sx={{
          width: '100%',
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2',
          height: 64,
        }}
      >
        <Toolbar
          className="dashboard-toolbar"
          sx={{
            minHeight: '64px !important',
            height: 64,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
          }}
        >
          {/* Left side - School Logo, Open Sidebar Button, and School Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {/* Open Sidebar Button (when collapsed) */}
            {!sidebarOpen && !isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* School Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {schoolConfig.logo ? (
                <Avatar
                  src={schoolConfig.logo}
                  sx={{ width: 40, height: 40 }}
                />
              ) : (
                <SchoolIcon sx={{ fontSize: 32, color: 'white' }} />
              )}
            </Box>

            {/* School Name - Immediately after logo */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: schoolConfig.nameColor || '#ffffff',
                fontSize: schoolConfig.nameFontSize || '1.2rem',
                letterSpacing: '0.5px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap',
                ml: 1, // Small margin after the logo
              }}
            >
              {schoolConfig.name || 'EduAI Management'}
            </Typography>
          </Box>

          {/* Right side - Notifications and Account */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                onClick={handleNotificationMenuOpen}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Account Menu */}
            <Tooltip title="Account">
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: isMobile
            ? 0
            : sidebarOpen
            ? drawerWidth
            : collapsedDrawerWidth,
          flexShrink: 0,
        }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? sidebarOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              top: 64, // Position below the fixed header
              height: 'calc(100vh - 64px)', // Adjust height to account for header
              border: 'none', // Remove border to eliminate gaps
              boxShadow: '2px 0 4px rgba(0,0,0,0.08)', // Subtle shadow
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        className="dashboard-main"
        sx={{
          flexGrow: 1,
          width: isMobile
            ? '100%'
            : `calc(100% - ${
                sidebarOpen ? drawerWidth : collapsedDrawerWidth
              }px)`,
          ml: isMobile ? 0 : 0, // Remove left margin to eliminate gap
          mt: '64px', // Account for fixed header
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          // Remove padding to eliminate gaps
          p: 0,
          backgroundColor: '#f5f5f5',
          position: 'relative',
        }}
      >
        <div className="dashboard-content">{children}</div>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate('/dashboard/profile');
          }}
        >
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate('/dashboard/settings');
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="body2">
            New student enrollment: Sarah Johnson
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="body2">
            AI Alert: Student performance decline detected
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Typography variant="body2">
            Schedule conflict resolved automatically
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardLayout;
