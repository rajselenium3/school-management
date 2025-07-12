import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  SmartToy as AIIcon,
  Send as SendIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  MenuBook as BookIcon,
  Quiz as QuizIcon,
  Help as HelpIcon,
  Lightbulb as IdeaIcon,
  Science as ScienceIcon,
  Calculate as MathIcon,
  Language as LanguageIcon,
  History as HistoryIcon,
  Palette as ArtIcon,
  MoreVert as MoreIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';

const StudentAITutor = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('general');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const messagesEndRef = useRef(null);

  const tabs = ['AI Chat', 'Study Help', 'Practice Quiz', 'Study Plan'];

  const subjects = [
    { id: 'general', name: 'General Help', icon: HelpIcon, color: '#1976d2' },
    { id: 'math', name: 'Mathematics', icon: MathIcon, color: '#4caf50' },
    { id: 'science', name: 'Science', icon: ScienceIcon, color: '#ff9800' },
    { id: 'english', name: 'English', icon: LanguageIcon, color: '#9c27b0' },
    { id: 'history', name: 'History', icon: HistoryIcon, color: '#795548' },
    { id: 'art', name: 'Arts', icon: ArtIcon, color: '#e91e63' },
  ];

  const predefinedQuestions = [
    'Help me understand quadratic equations',
    'Explain photosynthesis in simple terms',
    'How do I write a good essay introduction?',
    'What caused World War I?',
    'Help me with algebra homework',
    'Explain the water cycle',
  ];

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: 1,
        type: 'ai',
        content:
          "Hi! I'm your AI Study Tutor. I'm here to help you with your studies, answer questions, and provide personalized learning assistance. What would you like to learn about today?",
        timestamp: new Date(),
        subject: 'general',
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      subject: selectedSubject,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse = generateAIResponse(inputMessage, selectedSubject);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        subject: selectedSubject,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = (question, subject) => {
    const responses = {
      math: [
        'Great question about mathematics! Let me break this down step by step...',
        'For this math problem, I recommend starting with the basic principles...',
        "Mathematics can be tricky, but let's approach this systematically...",
      ],
      science: [
        "That's a fascinating science question! Let me explain the concepts involved...",
        'Science is all about understanding how things work. In this case...',
        "Let's explore this scientific concept together...",
      ],
      english: [
        'Excellent question about English! Language and literature are so rich...',
        "For this English topic, let's consider the key elements...",
        "Writing and language skills are crucial. Here's how to approach this...",
      ],
      history: [
        'History is full of interesting stories and lessons. Regarding your question...',
        "Let's explore the historical context and significance of this topic...",
        'Understanding history helps us understand the present. In this case...',
      ],
      general: [
        "That's a great question! Let me help you understand this better...",
        "I'm here to help with your studies. Let me explain this concept...",
        "Learning is a journey, and I'm here to guide you through it...",
      ],
    };

    const subjectResponses = responses[subject] || responses.general;
    const baseResponse =
      subjectResponses[Math.floor(Math.random() * subjectResponses.length)];

    // Add subject-specific detailed response
    const detailedResponse = `${baseResponse}

📚 **Key Points:**
• This topic is important for your ${
      subject !== 'general' ? subject : 'overall'
    } understanding
• Let's break it down into manageable parts
• I'll provide examples to make it clearer

🎯 **Study Tips:**
• Practice regularly with similar problems
• Connect this concept to what you already know
• Don't hesitate to ask follow-up questions

Would you like me to explain any specific part in more detail?`;

    return detailedResponse;
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content:
          "Chat cleared! I'm ready to help you with new questions. What would you like to learn about?",
        timestamp: new Date(),
        subject: 'general',
      },
    ]);
  };

  const renderChatTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card
          sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <AIIcon />
                AI Study Tutor
              </Typography>
              <Box>
                <IconButton onClick={clearChat} size="small">
                  <ClearIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => setMenuAnchor(e.currentTarget)}
                  size="small"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                mb: 2,
                p: 1,
                bgcolor: '#f5f5f5',
                borderRadius: 2,
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent:
                      message.type === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      maxWidth: '80%',
                    }}
                  >
                    {message.type === 'ai' && (
                      <Avatar
                        sx={{
                          bgcolor: '#1976d2',
                          mr: 1,
                          width: 32,
                          height: 32,
                        }}
                      >
                        <AIIcon fontSize="small" />
                      </Avatar>
                    )}
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: message.type === 'user' ? '#1976d2' : 'white',
                        color: message.type === 'user' ? 'white' : 'inherit',
                        borderRadius: 2,
                        boxShadow: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: 'pre-wrap' }}
                      >
                        {message.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 1,
                          opacity: 0.7,
                          fontSize: '0.7rem',
                        }}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Paper>
                    {message.type === 'user' && (
                      <Avatar
                        sx={{
                          bgcolor: '#4caf50',
                          ml: 1,
                          width: 32,
                          height: 32,
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    )}
                  </Box>
                </Box>
              ))}
              {loading && (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
                >
                  <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                    <AIIcon fontSize="small" />
                  </Avatar>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2">AI is thinking...</Typography>
                    </Box>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask me anything about your studies..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && !e.shiftKey && handleSendMessage()
                }
                multiline
                maxRows={3}
                disabled={loading}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                sx={{ minWidth: 56 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Grid container spacing={2}>
          {/* Subject Selection */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📚 Study Subjects
                </Typography>
                <List dense>
                  {subjects.map((subject) => (
                    <ListItem
                      key={subject.id}
                      button
                      selected={selectedSubject === subject.id}
                      onClick={() => setSelectedSubject(subject.id)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{ bgcolor: subject.color, width: 32, height: 32 }}
                        >
                          <subject.icon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={subject.name} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Questions */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💡 Quick Questions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {predefinedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuickQuestion(question)}
                      sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                      {question}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <DownloadIcon sx={{ mr: 1 }} />
          Export Chat
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ShareIcon sx={{ mr: 1 }} />
          Share Session
        </MenuItem>
      </Menu>
    </Grid>
  );

  const renderStudyHelpTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <BookIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Study Guides
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Get personalized study guides for your subjects
            </Typography>
            <Button variant="contained" size="small">
              Generate Guide
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <IdeaIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Concept Explanations
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Get detailed explanations of complex topics
            </Typography>
            <Button variant="contained" color="warning" size="small">
              Explain Concept
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <QuizIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Practice Problems
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Solve practice problems with step-by-step solutions
            </Typography>
            <Button variant="contained" color="success" size="small">
              Start Practice
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderQuizTab = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        AI-powered practice quizzes are coming soon! This feature will provide
        personalized quizzes based on your learning progress.
      </Alert>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧠 Practice Quiz Feature
          </Typography>
          <Typography variant="body1" paragraph>
            Our AI tutor will soon be able to create custom practice quizzes
            tailored to your learning needs. Features will include:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Adaptive difficulty based on your performance" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Subject-specific question generation" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Instant feedback and explanations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Progress tracking and analytics" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  const renderStudyPlanTab = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Personalized study plans are coming soon! This feature will help you
        organize your learning schedule.
      </Alert>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Study Plan Feature
          </Typography>
          <Typography variant="body1" paragraph>
            Our AI will help create personalized study plans based on your
            goals, schedule, and learning pace. Features will include:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Customized study schedules" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Goal-based learning paths" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Progress tracking and adjustments" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Integration with your class schedule" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return renderChatTab();
      case 1:
        return renderStudyHelpTab();
      case 2:
        return renderQuizTab();
      case 3:
        return renderStudyPlanTab();
      default:
        return renderChatTab();
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            🤖 AI Study Tutor
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your personal AI assistant for learning and homework help
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
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}
      </Box>
    </DashboardLayout>
  );
};

export default StudentAITutor;
