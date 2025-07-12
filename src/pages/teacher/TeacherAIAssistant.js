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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  SmartToy as AIIcon,
  Send as SendIcon,
  School as TeacherIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Grade as GradeIcon,
  Analytics as AnalyticsIcon,
  MenuBook as LessonIcon,
  People as ClassIcon,
  Assessment as TestIcon,
  Schedule as ScheduleIcon,
  Help as HelpIcon,
  Lightbulb as IdeaIcon,
  Create as CreateIcon,
  MoreVert as MoreIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  AutoAwesome as MagicIcon,
  Psychology as BrainIcon,
} from '@mui/icons-material';

import DashboardLayout from '../../components/layout/DashboardLayout.js';

const TeacherAIAssistant = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState('general');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [generatorDialog, setGeneratorDialog] = useState(false);
  const [generatorType, setGeneratorType] = useState('');
  const messagesEndRef = useRef(null);

  const tabs = [
    'AI Chat',
    'Lesson Planner',
    'Content Generator',
    'Class Analytics',
  ];

  const teachingTools = [
    {
      id: 'general',
      name: 'General Teaching Help',
      icon: HelpIcon,
      color: '#1976d2',
    },
    {
      id: 'lesson',
      name: 'Lesson Planning',
      icon: LessonIcon,
      color: '#4caf50',
    },
    {
      id: 'assignment',
      name: 'Assignment Creation',
      icon: AssignmentIcon,
      color: '#ff9800',
    },
    {
      id: 'assessment',
      name: 'Assessment Design',
      icon: TestIcon,
      color: '#9c27b0',
    },
    {
      id: 'classroom',
      name: 'Classroom Management',
      icon: ClassIcon,
      color: '#795548',
    },
    {
      id: 'analytics',
      name: 'Student Analytics',
      icon: AnalyticsIcon,
      color: '#e91e63',
    },
  ];

  const quickPrompts = [
    'Create a lesson plan for quadratic equations',
    'Generate quiz questions about photosynthesis',
    'Help me explain complex concepts simply',
    'Design a project-based learning activity',
    'Create rubric for essay assessment',
    'Suggest classroom engagement strategies',
  ];

  const contentGenerators = [
    {
      type: 'lesson',
      name: 'Lesson Plan Generator',
      desc: 'Create detailed lesson plans',
    },
    {
      type: 'quiz',
      name: 'Quiz Generator',
      desc: 'Generate quiz questions and answers',
    },
    {
      type: 'assignment',
      name: 'Assignment Creator',
      desc: 'Design homework and projects',
    },
    {
      type: 'rubric',
      name: 'Rubric Builder',
      desc: 'Create assessment rubrics',
    },
    {
      type: 'worksheet',
      name: 'Worksheet Maker',
      desc: 'Generate practice worksheets',
    },
    {
      type: 'explanation',
      name: 'Concept Explainer',
      desc: 'Break down complex topics',
    },
  ];

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: 1,
        type: 'ai',
        content:
          "Hello! I'm your AI Teaching Assistant. I'm here to help you with lesson planning, content creation, classroom management, and student assessment. What would you like to work on today?",
        timestamp: new Date(),
        tool: 'general',
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
      tool: selectedTool,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const aiResponse = generateTeachingResponse(inputMessage, selectedTool);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        tool: selectedTool,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTeachingResponse = (question, tool) => {
    const responses = {
      lesson: [
        'Great idea for a lesson plan! Let me help you structure this effectively...',
        "For this lesson planning request, I'll provide a comprehensive framework...",
        "Let's create an engaging lesson that captures student interest...",
      ],
      assignment: [
        "Excellent assignment concept! Here's how we can design this to maximize learning...",
        "For this assignment, let's ensure clear objectives and fair assessment...",
        "I'll help you create an assignment that's both challenging and achievable...",
      ],
      assessment: [
        'Assessment design is crucial for student success. For this topic...',
        "Let's create an assessment that truly measures student understanding...",
        "Here's how we can design a fair and comprehensive assessment...",
      ],
      classroom: [
        'Classroom management is key to effective teaching. For this situation...',
        "Let's explore strategies that create a positive learning environment...",
        'Here are some proven techniques for this classroom challenge...',
      ],
      analytics: [
        'Student data can provide valuable insights. Let me analyze this for you...',
        'Based on the patterns I see, here are some recommendations...',
        'This data suggests several strategies we could implement...',
      ],
      general: [
        "That's a great teaching question! Let me provide some professional guidance...",
        'As your AI teaching assistant, I recommend the following approach...',
        "Here's how we can tackle this educational challenge together...",
      ],
    };

    const toolResponses = responses[tool] || responses.general;
    const baseResponse =
      toolResponses[Math.floor(Math.random() * toolResponses.length)];

    const detailedResponse = `${baseResponse}

📚 **Teaching Strategy:**
• Start with clear learning objectives
• Use engaging activities and examples
• Include formative assessment throughout
• Provide opportunities for student interaction

🎯 **Implementation Tips:**
• Differentiate for various learning styles
• Include real-world applications
• Use technology effectively when appropriate
• Plan for different pacing needs

📊 **Assessment Ideas:**
• Formative: Quick polls, exit tickets, discussions
• Summative: Projects, presentations, traditional tests
• Peer assessment and self-reflection opportunities

Would you like me to elaborate on any specific aspect or help you develop this further?`;

    return detailedResponse;
  };

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  const handleContentGenerator = (type) => {
    setGeneratorType(type);
    setGeneratorDialog(true);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content:
          "Chat cleared! I'm ready to help with your teaching needs. What would you like to work on?",
        timestamp: new Date(),
        tool: 'general',
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
                AI Teaching Assistant
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
                        <TeacherIcon fontSize="small" />
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
                      <Typography variant="body2">
                        AI is analyzing your request...
                      </Typography>
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
                placeholder="Ask about lesson planning, assignments, classroom management..."
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
          {/* Teaching Tools */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🛠️ Teaching Tools
                </Typography>
                <List dense>
                  {teachingTools.map((tool) => (
                    <ListItem
                      key={tool.id}
                      button
                      selected={selectedTool === tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{ bgcolor: tool.color, width: 32, height: 32 }}
                        >
                          <tool.icon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={tool.name} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Prompts */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💡 Quick Prompts
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      onClick={() => handleQuickPrompt(prompt)}
                      sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                      {prompt}
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
          Share with Colleagues
        </MenuItem>
      </Menu>
    </Grid>
  );

  const renderLessonPlannerTab = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        AI-powered lesson planning is coming soon! This feature will help you
        create comprehensive lesson plans automatically.
      </Alert>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LessonIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Lesson Templates
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Pre-built templates for different subjects and grade levels
              </Typography>
              <Button variant="contained" size="small">
                Browse Templates
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MagicIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI Lesson Builder
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Generate custom lessons based on learning objectives
              </Typography>
              <Button variant="contained" color="warning" size="small">
                Create Lesson
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Curriculum Planner
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Plan entire units and align with standards
              </Typography>
              <Button variant="contained" color="success" size="small">
                Plan Curriculum
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderContentGeneratorTab = () => (
    <Grid container spacing={3}>
      {contentGenerators.map((generator, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <CreateIcon color="primary" />
                <Typography variant="h6">{generator.name}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                {generator.desc}
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleContentGenerator(generator.type)}
                fullWidth
              >
                Generate
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderAnalyticsTab = () => (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Advanced class analytics are coming soon! This will provide insights
        into student performance and engagement.
      </Alert>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧠 Class Analytics Features
          </Typography>
          <Typography variant="body1" paragraph>
            Our AI will soon analyze your class data to provide actionable
            insights:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Student performance trends and predictions" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Engagement metrics and recommendations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Learning gaps identification" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Personalized intervention suggestions" />
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
        return renderLessonPlannerTab();
      case 2:
        return renderContentGeneratorTab();
      case 3:
        return renderAnalyticsTab();
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
            🤖 AI Teaching Assistant
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your intelligent assistant for lesson planning, content creation,
            and classroom management
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

        {/* Content Generator Dialog */}
        <Dialog
          open={generatorDialog}
          onClose={() => setGeneratorDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {contentGenerators.find((g) => g.type === generatorType)?.name}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              This content generator will help you create {generatorType}{' '}
              materials automatically. Please provide some details about what
              you'd like to generate.
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              This feature is coming soon! It will integrate with our AI to
              generate high-quality educational content.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGeneratorDialog(false)}>Close</Button>
            <Button variant="contained" disabled>
              Generate (Coming Soon)
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default TeacherAIAssistant;
