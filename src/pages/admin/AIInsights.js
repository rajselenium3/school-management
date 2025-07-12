import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tab,
  Tabs,
  LinearProgress,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  SmartToy as AIIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material'

import DashboardLayout from '../../components/layout/DashboardLayout.js'

const AIInsights = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [insights, setInsights] = useState({})

  const tabs = ['Performance Analytics', 'Predictive Insights', 'Student Risk Assessment', 'AI Recommendations']

  useEffect(() => {
    loadAIInsights()
  }, [])

  const loadAIInsights = async () => {
    try {
      setLoading(true)
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000))

      setInsights({
        performanceAnalytics: {
          overallPerformance: 87.5,
          improvementTrend: '+12.3%',
          criticalMetrics: [
            { metric: 'Assignment Completion Rate', value: 94.2, status: 'excellent' },
            { metric: 'Average Grade Performance', value: 82.7, status: 'good' },
            { metric: 'Student Engagement Score', value: 78.9, status: 'good' },
            { metric: 'Teacher Efficiency Index', value: 91.3, status: 'excellent' },
          ]
        },
        predictiveInsights: [
          {
            title: 'Grade Performance Forecast',
            description: 'Based on current trends, 89% of students are likely to maintain or improve their grades next quarter.',
            confidence: 92,
            impact: 'high',
            category: 'academic'
          },
          {
            title: 'Resource Optimization',
            description: 'AI recommends reallocating 15% of library resources to STEM subjects for optimal learning outcomes.',
            confidence: 87,
            impact: 'medium',
            category: 'resources'
          },
          {
            title: 'Teacher Workload Balance',
            description: 'Predicted teacher burnout risk in Math department. Suggest redistributing assignments.',
            confidence: 78,
            impact: 'high',
            category: 'staffing'
          }
        ],
        riskAssessment: {
          atRiskStudents: 12,
          criticalCases: 3,
          interventionSuccess: 84.6,
          students: [
            {
              name: 'Alex Johnson',
              grade: '10',
              riskLevel: 'high',
              factors: ['Declining grades', 'Low attendance', 'Missing assignments'],
              recommendation: 'Immediate counselor intervention and personalized learning plan'
            },
            {
              name: 'Maria Garcia',
              grade: '11',
              riskLevel: 'medium',
              factors: ['Inconsistent performance', 'Social challenges'],
              recommendation: 'Peer mentoring program and study group assignment'
            },
            {
              name: 'David Chen',
              grade: '9',
              riskLevel: 'medium',
              factors: ['Math difficulties', 'Test anxiety'],
              recommendation: 'Math tutoring and anxiety management support'
            }
          ]
        },
        recommendations: [
          {
            title: 'Implement Adaptive Learning Paths',
            description: 'Personalized learning sequences based on individual student progress data.',
            priority: 'high',
            impact: 'Potential 15-20% improvement in learning outcomes',
            timeline: '2-3 months',
            category: 'curriculum'
          },
          {
            title: 'Enhanced Teacher Professional Development',
            description: 'Focus on digital pedagogy and AI-assisted teaching methods.',
            priority: 'medium',
            impact: 'Improved teaching efficiency by 25%',
            timeline: '1-2 months',
            category: 'training'
          },
          {
            title: 'Predictive Attendance Monitoring',
            description: 'Early warning system for attendance patterns and interventions.',
            priority: 'high',
            impact: 'Reduce chronic absenteeism by 30%',
            timeline: '1 month',
            category: 'engagement'
          }
        ]
      })
    } catch (error) {
      console.error('Error loading AI insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAIInsights()
    setRefreshing(false)
  }

  const renderPerformanceAnalytics = () => (
    <Grid container spacing={3}>
      {/* Overall Performance Score */}
      <Grid item xs={12} md={4}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <AIIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {insights.performanceAnalytics?.overallPerformance}%
            </Typography>
            <Typography variant="h6">
              Overall Performance Score
            </Typography>
            <Chip
              label={`${insights.performanceAnalytics?.improvementTrend} vs last month`}
              sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Critical Metrics */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon />
              Critical Performance Metrics
            </Typography>
            <List>
              {insights.performanceAnalytics?.criticalMetrics?.map((metric, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {metric.status === 'excellent' ?
                      <CheckIcon color="success" /> :
                      <TrendingUpIcon color="primary" />
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary={metric.metric}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={metric.value}
                          sx={{ width: 200, height: 8, borderRadius: 4 }}
                          color={metric.status === 'excellent' ? 'success' : 'primary'}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {metric.value}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* AI Analysis Summary */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PsychologyIcon />
              AI Performance Analysis
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Our AI has analyzed 10,000+ data points from the last 3 months to generate these insights.
            </Alert>
            <Typography variant="body1" paragraph>
              <strong>Key Findings:</strong> The school is performing exceptionally well with an overall performance score of 87.5%.
              Student engagement has improved by 12.3% compared to last month, indicating effective teaching strategies and curriculum delivery.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Strengths:</strong> Assignment completion rates and teacher efficiency are outstanding.
              The implementation of digital learning tools has shown significant positive impact.
            </Typography>
            <Typography variant="body1">
              <strong>Areas for Improvement:</strong> Student engagement scores suggest room for enhancement in interactive learning methods.
              Consider implementing more hands-on activities and peer collaboration opportunities.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderPredictiveInsights = () => (
    <Grid container spacing={3}>
      {insights.predictiveInsights?.map((insight, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{
                  bgcolor: insight.impact === 'high' ? '#f44336' : '#ff9800',
                  width: 32,
                  height: 32
                }}>
                  <InsightsIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {insight.title}
                </Typography>
              </Box>

              <Typography variant="body2" paragraph>
                {insight.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  AI Confidence Level
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={insight.confidence}
                  sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                  color={insight.confidence > 85 ? 'success' : 'primary'}
                />
                <Typography variant="caption" color="text.secondary">
                  {insight.confidence}% confident
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={insight.impact}
                  size="small"
                  color={insight.impact === 'high' ? 'error' : 'warning'}
                />
                <Chip
                  label={insight.category}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  const renderRiskAssessment = () => (
    <Grid container spacing={3}>
      {/* Risk Overview */}
      <Grid item xs={12} md={4}>
        <Card sx={{ background: 'linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <WarningIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {insights.riskAssessment?.atRiskStudents}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Students At Risk
            </Typography>
            <Typography variant="body2">
              {insights.riskAssessment?.criticalCases} critical cases requiring immediate attention
            </Typography>
            <Chip
              label={`${insights.riskAssessment?.interventionSuccess}% intervention success rate`}
              sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Risk Assessment Details */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon />
              Individual Risk Assessments
            </Typography>
            {insights.riskAssessment?.students?.map((student, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{student.name}</Typography>
                    <Chip
                      label={student.riskLevel}
                      color={student.riskLevel === 'high' ? 'error' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Grade {student.grade}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Risk Factors:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {student.factors.map((factor, idx) => (
                      <Chip key={idx} label={factor} size="small" variant="outlined" />
                    ))}
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    AI Recommendation:
                  </Typography>
                  <Typography variant="body2">
                    {student.recommendation}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderRecommendations = () => (
    <Grid container spacing={3}>
      {insights.recommendations?.map((rec, index) => (
        <Grid item xs={12} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{
                    bgcolor: rec.priority === 'high' ? '#f44336' : '#ff9800',
                    width: 40,
                    height: 40
                  }}>
                    <LightbulbIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {rec.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        label={rec.priority}
                        size="small"
                        color={rec.priority === 'high' ? 'error' : 'warning'}
                      />
                      <Chip
                        label={rec.category}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={rec.timeline}
                        size="small"
                        sx={{ bgcolor: '#e3f2fd' }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Button variant="contained" size="small">
                  Implement
                </Button>
              </Box>

              <Typography variant="body1" paragraph>
                {rec.description}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Expected Impact:
              </Typography>
              <Typography variant="body2" color="success.main">
                {rec.impact}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  const renderTabContent = () => {
    switch (currentTab) {
      case 0: return renderPerformanceAnalytics()
      case 1: return renderPredictiveInsights()
      case 2: return renderRiskAssessment()
      case 3: return renderRecommendations()
      default: return renderPerformanceAnalytics()
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="AI Insights">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            AI is analyzing your data...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This may take a few moments
          </Typography>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="AI Insights">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
              🤖 AI Insights & Analytics
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Intelligent analysis and predictive recommendations for your school
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
            >
              Export Report
            </Button>
            <Button
              variant="contained"
              startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              {refreshing ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </Box>
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
  )
}

export default AIInsights
