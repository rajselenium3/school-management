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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
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
  IconButton,
  Menu,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Message as MessageIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  School as AdminIcon,
  People as StudentsIcon,
  SupervisorAccount as ParentsIcon,
  Attachment as AttachmentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  Star as StarIcon,
  Archive as ArchiveIcon,
  Inbox as InboxIcon,
  Drafts as DraftsIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  PriorityHigh as PriorityIcon,
  AccessTime as TimeIcon,
  CheckCircle as ReadIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';

const TeacherMessages = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [composeDialog, setComposeDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);

  // Compose message form
  const [composeForm, setComposeForm] = useState({
    recipients: [],
    subject: '',
    content: '',
    priority: 'normal',
    attachments: [],
  });

  const tabs = ['Inbox', 'Sent', 'Drafts', 'Archive'];

  const messageCategories = [
    { id: 'all', name: 'All Messages', icon: InboxIcon },
    { id: 'admin', name: 'From Administration', icon: AdminIcon },
    { id: 'teachers', name: 'From Teachers', icon: PersonIcon },
    { id: 'parents', name: 'From Parents', icon: ParentsIcon },
    { id: 'system', name: 'System Messages', icon: MessageIcon },
  ];

  const recipientGroups = [
    {
      id: 'admin',
      name: 'Administration',
      members: ['John Admin', 'Jane Principal'],
    },
    {
      id: 'teachers',
      name: 'All Teachers',
      members: ['Sarah Johnson', 'Mike Wilson', 'Emily Davis'],
    },
    {
      id: 'math_dept',
      name: 'Math Department',
      members: ['Sarah Johnson', 'Robert Lee'],
    },
    { id: 'parents_10a', name: 'Class 10A Parents', members: ['Parent Group'] },
  ];

  useEffect(() => {
    loadMessages();
  }, [currentTab]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      // Simulate loading messages
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockMessages = [
        {
          id: 1,
          from: 'John Admin',
          fromRole: 'Administrator',
          subject: 'Staff Meeting Reminder',
          content:
            'Please remember we have a staff meeting tomorrow at 3 PM in the main conference room. We will discuss the upcoming parent-teacher conferences and new curriculum updates.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          priority: 'high',
          category: 'admin',
          avatar: '/avatar-admin.jpg',
        },
        {
          id: 2,
          from: 'Parent: Mrs. Thompson',
          fromRole: 'Parent',
          subject: "Question about Emma's Math Progress",
          content:
            "Hi, I wanted to ask about Emma's recent performance in mathematics. She seems to be struggling with the new algebra concepts. Could we schedule a brief meeting to discuss?",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: true,
          priority: 'normal',
          category: 'parents',
          avatar: '/avatar-parent.jpg',
        },
        {
          id: 3,
          from: 'Sarah Johnson',
          fromRole: 'Teacher',
          subject: 'Collaboration on Science Fair',
          content:
            'Hey! I was thinking we could collaborate on the upcoming science fair. My students are working on physics projects and I think some cross-subject integration with math would be great.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: true,
          priority: 'normal',
          category: 'teachers',
          avatar: '/avatar-teacher.jpg',
        },
        {
          id: 4,
          from: 'System',
          fromRole: 'System',
          subject: 'Grade Submission Deadline',
          content:
            'Reminder: Quarter grades are due by Friday, March 15th at 5:00 PM. Please ensure all grades are entered into the system before the deadline.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          read: false,
          priority: 'high',
          category: 'system',
          avatar: '/avatar-system.jpg',
        },
      ];

      setMessages(mockMessages);

      // Group messages into conversations
      const conversationMap = new Map();
      mockMessages.forEach((msg) => {
        const key = msg.from;
        if (!conversationMap.has(key)) {
          conversationMap.set(key, {
            id: key,
            participant: msg.from,
            role: msg.fromRole,
            lastMessage: msg,
            unreadCount: msg.read ? 0 : 1,
            messages: [msg],
          });
        } else {
          const conv = conversationMap.get(key);
          conv.messages.push(msg);
          if (!msg.read) conv.unreadCount++;
          if (msg.timestamp > conv.lastMessage.timestamp) {
            conv.lastMessage = msg;
          }
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (
      !composeForm.subject ||
      !composeForm.content ||
      composeForm.recipients.length === 0
    ) {
      return;
    }

    setLoading(true);
    try {
      // Simulate sending message
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newMessage = {
        id: messages.length + 1,
        to: composeForm.recipients,
        subject: composeForm.subject,
        content: composeForm.content,
        priority: composeForm.priority,
        timestamp: new Date(),
        sent: true,
      };

      console.log('Message sent:', newMessage);
      setComposeDialog(false);
      setComposeForm({
        recipients: [],
        subject: '',
        content: '',
        priority: 'normal',
        attachments: [],
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComposeFormChange = (field, value) => {
    setComposeForm((prev) => ({ ...prev, [field]: value }));
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

  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case 'administrator':
      case 'admin':
        return AdminIcon;
      case 'teacher':
        return PersonIcon;
      case 'parent':
        return ParentsIcon;
      case 'system':
        return MessageIcon;
      default:
        return PersonIcon;
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderInboxTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
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
              <Typography variant="h6">
                Conversations ({conversations.length})
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setComposeDialog(true)}
              >
                Compose
              </Button>
            </Box>

            <TextField
              fullWidth
              size="small"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
              sx={{ mb: 2 }}
            />

            <List>
              {conversations.map((conversation) => (
                <ListItem
                  key={conversation.id}
                  button
                  selected={selectedConversation?.id === conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={conversation.unreadCount}
                      color="primary"
                    >
                      <Avatar
                        sx={{
                          bgcolor: getPriorityColor(
                            conversation.lastMessage.priority
                          ),
                        }}
                      >
                        {conversation.participant[0]}
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
                          variant="subtitle2"
                          sx={{
                            fontWeight:
                              conversation.unreadCount > 0 ? 'bold' : 'normal',
                          }}
                        >
                          {conversation.participant}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(conversation.lastMessage.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight:
                              conversation.unreadCount > 0 ? 'bold' : 'normal',
                          }}
                        >
                          {conversation.lastMessage.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {conversation.lastMessage.content.substring(0, 50)}...
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={conversation.role}
                            size="small"
                            variant="outlined"
                          />
                          {conversation.lastMessage.priority === 'high' && (
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
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        {selectedConversation ? (
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: getPriorityColor(
                        selectedConversation.lastMessage.priority
                      ),
                    }}
                  >
                    {selectedConversation.participant[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedConversation.participant}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedConversation.role}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton size="small">
                    <ReplyIcon />
                  </IconButton>
                  <IconButton size="small">
                    <ForwardIcon />
                  </IconButton>
                  <IconButton size="small">
                    <ArchiveIcon />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {selectedConversation.messages.map((message) => (
                  <Paper
                    key={message.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: message.read
                        ? 'transparent'
                        : 'rgba(25, 118, 210, 0.04)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: message.read ? 'normal' : 'bold' }}
                      >
                        {message.subject}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {message.timestamp.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body1" paragraph>
                      {message.content}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {message.priority === 'high' && (
                        <Chip
                          label="High Priority"
                          size="small"
                          color="error"
                        />
                      )}
                      <Chip
                        label={message.read ? 'Read' : 'Unread'}
                        size="small"
                        color={message.read ? 'success' : 'primary'}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Quick Reply:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Type your reply..."
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" startIcon={<SendIcon />}>
                  Send Reply
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <MessageIcon
                sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Select a conversation to view messages
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );

  const renderComposeDialog = () => (
    <Dialog
      open={composeDialog}
      onClose={() => setComposeDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Compose Message</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Recipients</InputLabel>
              <Select
                multiple
                value={composeForm.recipients}
                onChange={(e) =>
                  handleComposeFormChange('recipients', e.target.value)
                }
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {recipientGroups.map((group) => (
                  <MenuItem key={group.id} value={group.name}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Subject"
              value={composeForm.subject}
              onChange={(e) =>
                handleComposeFormChange('subject', e.target.value)
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={composeForm.priority}
                onChange={(e) =>
                  handleComposeFormChange('priority', e.target.value)
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
              label="Message"
              value={composeForm.content}
              onChange={(e) =>
                handleComposeFormChange('content', e.target.value)
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setComposeDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSendMessage}
          startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
          disabled={
            loading ||
            !composeForm.subject ||
            !composeForm.content ||
            composeForm.recipients.length === 0
          }
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return renderInboxTab();
      case 1:
      case 2:
      case 3:
        return (
          <Alert severity="info">
            This section is coming soon! It will show your{' '}
            {tabs[currentTab].toLowerCase()} messages.
          </Alert>
        );
      default:
        return renderInboxTab();
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
            📨 Messages
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setComposeDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            }}
          >
            Compose Message
          </Button>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  color="primary.main"
                  sx={{ fontWeight: 'bold' }}
                >
                  {messages.filter((m) => !m.read).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unread Messages
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  color="success.main"
                  sx={{ fontWeight: 'bold' }}
                >
                  {messages.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Messages
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  color="warning.main"
                  sx={{ fontWeight: 'bold' }}
                >
                  {messages.filter((m) => m.priority === 'high').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Priority
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  color="info.main"
                  sx={{ fontWeight: 'bold' }}
                >
                  {conversations.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Conversations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Compose Dialog */}
        {renderComposeDialog()}
      </Box>
    </DashboardLayout>
  );
};

export default TeacherMessages;
