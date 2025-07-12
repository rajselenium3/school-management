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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Divider,
  Alert,
} from '@mui/material'
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  EventAvailable as AttendanceIcon,
  MonetizationOn as FinanceIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  Dashboard as DashboardIcon,
  DateRange as DateRangeIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Remove as NoChangeIcon,
} from '@mui/icons-material'

import DashboardLayout from '../../components/layout/DashboardLayout.js'

const Analytics = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  const [refreshing, setRefreshing] = useState(false)
  const [analytics, setAnalytics] = useState({})

  const tabs = ['Overview', 'Academic Performance', 'Attendance Trends', 'Financial Analysis', 'User Engagement']

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Simulate loading analytics data
      await new Promise(resolve => setTimeout(resolve, 1500))

      setAnalytics({
        overview: {
          kpis: [
            {
              title: 'Total Students',
              value: 1247,
              change: 5.2,
              trend: 'up',
              icon: PeopleIcon,
              color: '#1976d2'
            },
            {
              title: 'Active Teachers',
              value: 89,
              change: 2.1,
              trend: 'up',
              icon: SchoolIcon,
              color: '#388e3c'
            },
            {
              title: 'Course Completion',
              value: '94.7%',
              change: 1.8,
              trend: 'up',
              icon: AssignmentIcon,
              color: '#f57c00'
            },
            {
              title: 'Average GPA',
              value: 3.42,
              change: -0.3,
              trend: 'down',
              icon: GradeIcon,
              color: '#7b1fa2'
            }
          ],
          enrollment: {
            current: 1247,
            target: 1300,
            progress: 95.8,
            trend: [
              { month: 'Jan', students: 1180 },
              { month: 'Feb', students: 1195 },
              { month: 'Mar', students: 1210 },
              { month: 'Apr', students: 1225 },
              { month: 'May', students: 1240 },
              { month: 'Jun', students: 1247 }
            ]
          }
        },
        academic: {
          gradeDistribution: [
            { grade: 'A', count: 342, percentage: 27.4 },
            { grade: 'B', count: 456, percentage: 36.6 },
            { grade: 'C', count: 287, percentage: 23.0 },
            { grade: 'D', count: 98, percentage: 7.9 },
            { grade: 'F', count: 64, percentage: 5.1 }
          ],
          subjectPerformance: [
            { subject: 'Mathematics', average: 3.8, trend: 'up', improvement: 0.2 },
            { subject: 'English', average: 3.6, trend: 'stable', improvement: 0.0 },
            { subject: 'Science', average: 3.7, trend: 'up', improvement: 0.1 },
            { subject: 'History', average: 3.4, trend: 'down', improvement: -0.1 },
            { subject: 'Arts', average: 3.9, trend: 'up', improvement: 0.3 }
          ],
          assignmentStats: {
            totalAssignments: 847,
            avgCompletionRate: 94.2,
            avgTimeToComplete: '3.2 days',
            onTimeSubmissions: 89.7
          }
        },
        attendance: {
          overall: 94.5,
          trend: 'up',
          byGrade: [
            { grade: '9th', rate: 96.2, students: 312 },
            { grade: '10th', rate: 94.8, students: 298 },
            { grade: '11th', rate: 93.1, students: 321 },
            { grade: '12th', rate: 93.9, students: 316 }
          ],
          dailyTrend: [
            { day: 'Mon', rate: 95.2 },
            { day: 'Tue', rate: 96.1 },
            { day: 'Wed', rate: 94.8 },
            { day: 'Thu', rate: 93.7 },
            { day: 'Fri', rate: 92.1 }
          ],
          seasonalTrend: [
            { month: 'Jan', rate: 93.2 },
            { month: 'Feb', rate: 94.1 },
            { month: 'Mar', rate: 95.8 },
            { month: 'Apr', rate: 96.2 },
            { month: 'May', rate: 94.9 },
            { month: 'Jun', rate: 93.1 }
          ]
        },
        financial: {
          revenue: {
            total: 2456789,
            tuitionFees: 1987456,
            additionalFees: 469333,
            growth: 8.5
          },
          expenses: {
            total: 2134567,
            salaries: 1456789,
            facilities: 345678,
            technology: 123456,
            other: 208644
          },
          collections: {
            rate: 96.8,
            outstanding: 234567,
            overdue: 45678
          },
          trends: [
            { month: 'Jan', revenue: 408000, expenses: 355000 },
            { month: 'Feb', revenue: 412000, expenses: 358000 },
            { month: 'Mar', revenue: 419000, expenses: 362000 },
            { month: 'Apr', revenue: 415000, expenses: 359000 },
            { month: 'May', revenue: 421000, expenses: 364000 },
            { month: 'Jun', revenue: 425000, expenses: 367000 }
          ]
        },
        engagement: {
          userActivity: {
            dailyActiveUsers: 892,
            weeklyActiveUsers: 1156,
            monthlyActiveUsers: 1247,
            avgSessionDuration: '24 minutes'
          },
          featureUsage: [
            { feature: 'Assignments', usage: 89.2, users: 1112 },
            { feature: 'Grades', usage: 95.8, users: 1194 },
            { feature: 'Attendance', usage: 87.4, users: 1090 },
            { feature: 'Communication', usage: 73.6, users: 918 },
            { feature: 'Reports', usage: 56.3, users: 702 }
          ],
          deviceUsage: [
            { device: 'Desktop', percentage: 58.3 },
            { device: 'Mobile', percentage: 35.7 },
            { device: 'Tablet', percentage: 6.0 }
          ]
        }
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalytics()
    setRefreshing(false)
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <ArrowUpIcon color="success" fontSize="small" />
      case 'down': return <ArrowDownIcon color="error" fontSize="small" />
      default: return <NoChangeIcon color="action" fontSize="small" />
    }
  }

  const renderKPICard = (kpi) => (
    <Grid item xs={12} sm={6} lg={3} key={kpi.title}>
      <Card sx={{
        background: `linear-gradient(135deg, ${kpi.color}15 0%, ${kpi.color}05 100%)`,
        border: `1px solid ${kpi.color}30`
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar sx={{ bgcolor: kpi.color, width: 40, height: 40 }}>
              <kpi.icon />
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {getTrendIcon(kpi.trend)}
              <Typography
                variant="caption"
                color={kpi.trend === 'up' ? 'success.main' : kpi.trend === 'down' ? 'error.main' : 'text.secondary'}
                sx={{ fontWeight: 'bold' }}
              >
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: kpi.color, mb: 0.5 }}>
            {typeof kpi.value === 'number' ? formatNumber(kpi.value) : kpi.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {kpi.title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* KPI Cards */}
      {analytics.overview?.kpis?.map(renderKPICard)}

      {/* Enrollment Progress */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon />
              Enrollment Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Current: {analytics.overview?.enrollment?.current}</Typography>
                <Typography variant="body2">Target: {analytics.overview?.enrollment?.target}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={analytics.overview?.enrollment?.progress}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {analytics.overview?.enrollment?.progress}% of annual target reached
              </Typography>
            </Box>

            <Typography variant="subtitle2" gutterBottom>Monthly Trend:</Typography>
            <List dense>
              {analytics.overview?.enrollment?.trend?.slice(-3).map((item, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText
                    primary={item.month}
                    secondary={`${item.students} students`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssessmentIcon />
              Quick Statistics
            </Typography>
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <AttendanceIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Average Attendance"
                  secondary={`${analytics.attendance?.overall}% this month`}
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <AssignmentIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Assignment Completion"
                  secondary={`${analytics.academic?.assignmentStats?.avgCompletionRate}% average rate`}
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <FinanceIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Fee Collection Rate"
                  secondary={`${analytics.financial?.collections?.rate}% collected`}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderAcademicPerformance = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Grade Distribution</Typography>
            {analytics.academic?.gradeDistribution?.map((grade, index) => (
              <Box key={grade.grade} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Grade {grade.grade}</Typography>
                  <Typography variant="body2">{grade.count} students ({grade.percentage}%)</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={grade.percentage}
                  sx={{ height: 6, borderRadius: 3 }}
                  color={index < 2 ? 'success' : index < 4 ? 'primary' : 'error'}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Subject Performance</Typography>
            <List>
              {analytics.academic?.subjectPerformance?.map((subject) => (
                <ListItem key={subject.subject} sx={{ px: 0 }}>
                  <ListItemText
                    primary={subject.subject}
                    secondary={`Average GPA: ${subject.average}`}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getTrendIcon(subject.trend)}
                    <Typography
                      variant="caption"
                      color={subject.trend === 'up' ? 'success.main' : subject.trend === 'down' ? 'error.main' : 'text.secondary'}
                    >
                      {subject.improvement > 0 ? '+' : ''}{subject.improvement}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Assignment Statistics</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {analytics.academic?.assignmentStats?.totalAssignments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Assignments
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {analytics.academic?.assignmentStats?.avgCompletionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completion Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    {analytics.academic?.assignmentStats?.avgTimeToComplete}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Time to Complete
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                    {analytics.academic?.assignmentStats?.onTimeSubmissions}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    On-time Submissions
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderAttendanceTrends = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Overall Attendance</Typography>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {analytics.attendance?.overall}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                {getTrendIcon(analytics.attendance?.trend)}
                <Typography variant="caption" color="success.main">
                  Trending upward
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Attendance by Grade</Typography>
            {analytics.attendance?.byGrade?.map((grade) => (
              <Box key={grade.grade} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{grade.grade} Grade</Typography>
                  <Typography variant="body2">{grade.rate}% ({grade.students} students)</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={grade.rate}
                  sx={{ height: 6, borderRadius: 3 }}
                  color={grade.rate > 95 ? 'success' : grade.rate > 90 ? 'primary' : 'warning'}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Daily Attendance Pattern</Typography>
            {analytics.attendance?.dailyTrend?.map((day) => (
              <Box key={day.day} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2">{day.day}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={day.rate}
                    sx={{ width: 100, height: 4, borderRadius: 2 }}
                  />
                  <Typography variant="caption">{day.rate}%</Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Seasonal Trends</Typography>
            {analytics.attendance?.seasonalTrend?.map((month) => (
              <Box key={month.month} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2">{month.month}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={month.rate}
                    sx={{ width: 100, height: 4, borderRadius: 2 }}
                  />
                  <Typography variant="caption">{month.rate}%</Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderFinancialAnalysis = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Revenue Overview</Typography>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold', mb: 1 }}>
              {formatCurrency(analytics.financial?.revenue?.total)}
            </Typography>
            <Typography variant="caption" color="success.main">
              +{analytics.financial?.revenue?.growth}% growth
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">Tuition Fees</Typography>
              <Typography variant="h6" color="primary.main">
                {formatCurrency(analytics.financial?.revenue?.tuitionFees)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">Additional Fees</Typography>
              <Typography variant="h6" color="secondary.main">
                {formatCurrency(analytics.financial?.revenue?.additionalFees)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Expense Breakdown</Typography>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold', mb: 2 }}>
              {formatCurrency(analytics.financial?.expenses?.total)}
            </Typography>
            <List dense>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Salaries"
                  secondary={formatCurrency(analytics.financial?.expenses?.salaries)}
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Facilities"
                  secondary={formatCurrency(analytics.financial?.expenses?.facilities)}
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Technology"
                  secondary={formatCurrency(analytics.financial?.expenses?.technology)}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Collections</Typography>
            <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold', mb: 1 }}>
              {analytics.financial?.collections?.rate}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Collection Rate
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2">Outstanding</Typography>
              <Typography variant="h6" color="warning.main">
                {formatCurrency(analytics.financial?.collections?.outstanding)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">Overdue</Typography>
              <Typography variant="h6" color="error.main">
                {formatCurrency(analytics.financial?.collections?.overdue)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Monthly Financial Trends</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Revenue vs Expenses comparison for the last 6 months
            </Alert>
            {analytics.financial?.trends?.map((trend) => (
              <Box key={trend.month} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>{trend.month}</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption">Revenue: {formatCurrency(trend.revenue)}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(trend.revenue / 450000) * 100}
                      color="success"
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption">Expenses: {formatCurrency(trend.expenses)}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(trend.expenses / 450000) * 100}
                      color="error"
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Typography variant="body2" color={trend.revenue > trend.expenses ? 'success.main' : 'error.main'}>
                    {formatCurrency(trend.revenue - trend.expenses)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderUserEngagement = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>User Activity</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {analytics.engagement?.userActivity?.dailyActiveUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily Active Users
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {analytics.engagement?.userActivity?.monthlyActiveUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Active Users
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Average Session Duration: <strong>{analytics.engagement?.userActivity?.avgSessionDuration}</strong>
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Device Usage</Typography>
            {analytics.engagement?.deviceUsage?.map((device) => (
              <Box key={device.device} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{device.device}</Typography>
                  <Typography variant="body2">{device.percentage}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={device.percentage}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Feature Usage Analytics</Typography>
            <List>
              {analytics.engagement?.featureUsage?.map((feature) => (
                <ListItem key={feature.feature} sx={{ px: 0 }}>
                  <ListItemText
                    primary={feature.feature}
                    secondary={`${feature.users} users`}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                    <LinearProgress
                      variant="determinate"
                      value={feature.usage}
                      sx={{ flex: 1, height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="body2">{feature.usage}%</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderTabContent = () => {
    switch (currentTab) {
      case 0: return renderOverview()
      case 1: return renderAcademicPerformance()
      case 2: return renderAttendanceTrends()
      case 3: return renderFinancialAnalysis()
      case 4: return renderUserEngagement()
      default: return renderOverview()
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Analytics">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 2 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading analytics data...
          </Typography>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Analytics">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
              📊 Analytics Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Comprehensive insights and performance metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
              >
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="quarter">This Quarter</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
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
        {renderTabContent()}
      </Box>
    </DashboardLayout>
  )
}

export default Analytics
