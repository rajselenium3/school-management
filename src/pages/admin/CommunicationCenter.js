import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Badge,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Message as MessageIcon,
  Send as SendIcon,
  Announcement as AnnouncementIcon,
  Notifications as NotificationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  Attachment as AttachmentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  Star as StarIcon,
  Archive as ArchiveIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';

const CommunicationCenter = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Dialog states
  const [messageDialog, setMessageDialog] = useState(false);
  const [announcementDialog, setAnnouncementDialog] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Form states
  const [messageForm, setMessageForm] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'normal',
    attachments: [],
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    audience: 'all',
    priority: 'normal',
    expiryDate: '',
    sendEmail: true,
  });

  const tabs = [
    'Messages',
    'Announcements',
    'Notifications',
    'Parent Communication',
  ];

  useEffect(() => {
    loadCommunicationData();
  }, []);

  const loadCommunicationData = async () => {
    setLoading(true);
    try {
      // Simulate loading communication data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessages([
        {
          id: 1,
          from: 'Sarah Johnson',
          fromRole: 'Teacher',
          subject: 'Math Assignment Questions',
          content:
            'Hi, I have some questions about the new curriculum changes for the math department...',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          priority: 'normal',
          avatar: '/avatar1.jpg',
        },
        {
          id: 2,
          from: 'Mike Parent',
          fromRole: 'Parent',
          subject: 'Meeting Request',
          content:
            "I would like to schedule a meeting to discuss my child's progress in science class...",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: true,
          priority: 'high',
          avatar: '/avatar2.jpg',
        },
        {
          id: 3,
          from: 'Emma Thompson',
          fromRole: 'Student',
          subject: 'Assignment Deadline Extension',
          content:
            'Due to illness, I need to request an extension for the history essay...',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: true,
          priority: 'normal',
          avatar: '/avatar3.jpg',
        },
      ]);

      setAnnouncements([
        {
          id: 1,
          title: 'Parent-Teacher Conference Schedule',
          content:
            'Parent-teacher conferences will be held next week. Please check the schedule and book your slots.',
          author: 'Admin Office',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          audience: 'parents',
          priority: 'high',
          views: 124,
          status: 'active',
        },
        {
          id: 2,
          title: 'New Library Hours',
          content:
            'The library will have extended hours starting Monday. New hours: 7:00 AM - 8:00 PM.',
          author: 'Library Staff',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          audience: 'all',
          priority: 'normal',
          views: 89,
          status: 'active',
        },
        {
          id: 3,
          title: 'Science Fair Registration Open',
          content:
            'Registration for the annual science fair is now open. Deadline: March 15th.',
          author: 'Science Department',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          audience: 'students',
          priority: 'normal',
          views: 156,
          status: 'active',
        },
      ]);

      setNotifications([
        {
          id: 1,
          type: 'assignment',
          title: 'New Assignment Posted',
          content: 'Physics - Chapter 5 Problem Set has been posted',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false,
          icon: 'assignment',
        },
        {
          id: 2,
          type: 'grade',
          title: 'Grades Published',
          content: 'Math Quiz 3 grades are now available',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          icon: 'grade',
        },
        {
          id: 3,
          type: 'attendance',
          title: 'Attendance Alert',
          content: '3 students marked absent today',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: true,
          icon: 'warning',
        },
      ]);
    } catch (error) {
      console.error('Error loading communication data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      const newMessage = {
        id: messages.length + 1,
        to: messageForm.recipient,
        subject: messageForm.subject,
        content: messageForm.content,
        priority: messageForm.priority,
        timestamp: new Date(),
        sent: true,
      };

      // Add to messages list (in real app, would send to server)
      console.log('Sending message:', newMessage);

      setMessageDialog(false);
      setMessageForm({
        recipient: '',
        subject: '',
        content: '',
        priority: 'normal',
        attachments: [],
      });

      // Show success message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      const newAnnouncement = {
        id: announcements.length + 1,
        title: announcementForm.title,
        content: announcementForm.content,
        audience: announcementForm.audience,
        priority: announcementForm.priority,
        author: 'Current User',
        timestamp: new Date(),
        views: 0,
        status: 'active',
      };

      setAnnouncements([newAnnouncement, ...announcements]);
      setAnnouncementDialog(false);
      setAnnouncementForm({
        title: '',
        content: '',
        audience: 'all',
        priority: 'normal',
        expiryDate: '',
        sendEmail: true,
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      default:
        return '#4caf50';
    }
  };

  const renderMessages = () => (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">
          Inbox ({messages.filter((m) => !m.read).length} unread)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setMessageDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          }}
        >
          Compose Message
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <List>
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem
                    button
                    onClick={() => setSelectedConversation(message)}
                    sx={{
                      bgcolor: message.read
                        ? 'transparent'
                        : 'rgba(25, 118, 210, 0.04)',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        badgeContent=""
                        color="primary"
                        variant="dot"
                        invisible={message.read}
                      >
                        <Avatar
                          sx={{ bgcolor: getPriorityColor(message.priority) }}
                        >
                          {message.from[0]}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: message.read ? 'normal' : 'bold',
                            }}
                          >
                            {message.from}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(message.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: message.read ? 'normal' : 'bold',
                            }}
                          >
                            {message.subject}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {message.content.substring(0, 80)}...
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={message.fromRole}
                              size="small"
                              variant="outlined"
                            />
                            {message.priority === 'high' && (
                              <Chip
                                label="High Priority"
                                size="small"
                                color="error"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton>
                        <StarIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {selectedConversation ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedConversation.subject}
                </Typography>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: getPriorityColor(selectedConversation.priority),
                      width: 32,
                      height: 32,
                    }}
                  >
                    {selectedConversation.from[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {selectedConversation.from}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedConversation.fromRole}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" paragraph>
                  {selectedConversation.content}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" startIcon={<ReplyIcon />}>
                    Reply
                  </Button>
                  <Button size="small" startIcon={<ForwardIcon />}>
                    Forward
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <MessageIcon
                  sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Select a message to view
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  const renderAnnouncements = () => (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">
          Announcements ({announcements.length} active)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAnnouncementDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
          }}
        >
          Create Announcement
        </Button>
      </Box>

      <Grid container spacing={3}>
        {announcements.map((announcement) => (
          <Grid item xs={12} md={6} key={announcement.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {announcement.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" paragraph>
                  {announcement.content}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    By {announcement.author} •{' '}
                    {formatTimestamp(announcement.timestamp)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ViewIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {announcement.views} views
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={announcement.audience}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={announcement.priority}
                    size="small"
                    color={
                      announcement.priority === 'high' ? 'error' : 'default'
                    }
                  />
                  <Chip
                    label={announcement.status}
                    size="small"
                    color="success"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderNotifications = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Notifications
      </Typography>

      <Card>
        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    sx={{ bgcolor: notification.read ? '#e0e0e0' : '#1976d2' }}
                  >
                    <NotificationIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {notification.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(notification.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <MoreIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </Box>
  );

  const renderParentCommunication = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Parent Communication Hub
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <EmailIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Email Parents
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Send targeted emails to parent groups
              </Typography>
              <Button variant="contained" fullWidth>
                Compose Email
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Schedule Meetings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Book parent-teacher conferences
              </Typography>
              <Button variant="contained" fullWidth color="warning">
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <VideoCallIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Virtual Meetings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Host online parent meetings
              </Typography>
              <Button variant="contained" fullWidth color="success">
                Start Meeting
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return renderMessages();
      case 1:
        return renderAnnouncements();
      case 2:
        return renderNotifications();
      case 3:
        return renderParentCommunication();
      default:
        return renderMessages();
    }
  };

  return (
    <DashboardLayout title="Communication Center">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            📨 Communication Center
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage all school communications in one place
          </Typography>
        </Box>

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab}
                    {index === 0 &&
                      messages.filter((m) => !m.read).length > 0 && (
                        <Badge
                          badgeContent={messages.filter((m) => !m.read).length}
                          color="primary"
                        />
                      )}
                    {index === 2 &&
                      notifications.filter((n) => !n.read).length > 0 && (
                        <Badge
                          badgeContent={
                            notifications.filter((n) => !n.read).length
                          }
                          color="error"
                        />
                      )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Message Dialog */}
        <Dialog
          open={messageDialog}
          onClose={() => setMessageDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Compose Message</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Recipient"
                  value={messageForm.recipient}
                  onChange={(e) =>
                    setMessageForm((prev) => ({
                      ...prev,
                      recipient: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Priority</InputLabel>
                  <Select
                    value={messageForm.priority}
                    onChange={(e) =>
                      setMessageForm((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={messageForm.subject}
                  onChange={(e) =>
                    setMessageForm((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Message"
                  value={messageForm.content}
                  onChange={(e) =>
                    setMessageForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMessageDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSendMessage}
              startIcon={<SendIcon />}
              disabled={
                !messageForm.recipient ||
                !messageForm.subject ||
                !messageForm.content
              }
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>

        {/* Announcement Dialog */}
        <Dialog
          open={announcementDialog}
          onClose={() => setAnnouncementDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={announcementForm.title}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Audience</InputLabel>
                  <Select
                    value={announcementForm.audience}
                    onChange={(e) =>
                      setAnnouncementForm((prev) => ({
                        ...prev,
                        audience: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="students">Students Only</MenuItem>
                    <MenuItem value="teachers">Teachers Only</MenuItem>
                    <MenuItem value="parents">Parents Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel shrink>Priority</InputLabel>
                  <Select
                    value={announcementForm.priority}
                    onChange={(e) =>
                      setAnnouncementForm((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Content"
                  value={announcementForm.content}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={announcementForm.sendEmail}
                      onChange={(e) =>
                        setAnnouncementForm((prev) => ({
                          ...prev,
                          sendEmail: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Send email notification to audience"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAnnouncementDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateAnnouncement}
              startIcon={<AnnouncementIcon />}
              disabled={!announcementForm.title || !announcementForm.content}
            >
              Create Announcement
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default CommunicationCenter;
