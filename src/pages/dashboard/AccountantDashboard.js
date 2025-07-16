import {
  AccountBalance as AccountBalanceIcon,
  Analytics as AnalyticsIcon,
  Assessment as ReportIcon,
  AttachMoney as MoneyIcon,
  CreditCard as PaymentIcon,
  Description as InvoiceIcon,
  GetApp as ExportIcon,
  MonetizationOn as FeeIcon,
  Payment as CollectionIcon,
  Receipt as ReceiptIcon,
  Schedule as DueDateIcon,
  TrendingUp as TrendingUpIcon,
  Warning as OverdueIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import financialService from '../../services/financialService.js';

const AccountantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading accountant dashboard data...');

      // Load comprehensive financial data
      const [overviewData, paymentsData, invoicesData, feesData] =
        await Promise.allSettled([
          financialService.getFinancialOverview(),
          financialService.getAllPayments(),
          financialService.getAllInvoices(),
          financialService.getAllFees(),
        ]);

      const overview =
        overviewData.status === 'fulfilled' ? overviewData.value : {};
      const payments =
        paymentsData.status === 'fulfilled' ? paymentsData.value : [];
      const invoices =
        invoicesData.status === 'fulfilled' ? invoicesData.value : [];
      const fees = feesData.status === 'fulfilled' ? feesData.value : [];

      // Calculate today's collections
      const today = new Date().toDateString();
      const todayCollections = payments
        .filter(
          (p) =>
            p.paymentDate &&
            new Date(p.paymentDate).toDateString() === today &&
            p.status === 'COMPLETED'
        )
        .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

      // Calculate pending collections
      const pendingInvoices = invoices.filter(
        (i) => i.status === 'SENT' || i.status === 'OVERDUE'
      );
      const pendingAmount = pendingInvoices.reduce(
        (sum, i) => sum + (i.totalAmount || 0),
        0
      );

      // Calculate overdue amounts
      const overdueInvoices = invoices.filter(
        (i) =>
          i.status === 'OVERDUE' ||
          (i.dueDate && new Date(i.dueDate) < new Date())
      );
      const overdueAmount = overdueInvoices.reduce(
        (sum, i) => sum + (i.totalAmount || 0),
        0
      );

      // Recent transactions
      const recentPayments = payments
        .filter((p) => p.status === 'COMPLETED')
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
        .slice(0, 10);

      setDashboardData({
        overview,
        stats: {
          totalRevenue: overview.summary?.totalRevenue || 0,
          monthlyRevenue: overview.summary?.monthlyRevenue || 0,
          todayCollections: todayCollections,
          pendingAmount: pendingAmount,
          overdueAmount: overdueAmount,
          totalInvoices: invoices.length,
          pendingInvoices: pendingInvoices.length,
          overdueInvoices: overdueInvoices.length,
          activeFees: fees.filter((f) => f.status === 'ACTIVE').length,
        },
        recentPayments,
        pendingInvoices: pendingInvoices.slice(0, 5),
        overdueInvoices: overdueInvoices.slice(0, 5),
      });

      console.log('✅ Accountant dashboard data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading accountant dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Fee Collection',
      description: 'Collect advance fees and generate receipts',
      icon: CollectionIcon,
      color: '#4caf50',
      path: '/dashboard/accountant/fee-collection',
    },
    {
      title: 'Payment Processing',
      description: 'Process payments and manage transactions',
      icon: PaymentIcon,
      color: '#2196f3',
      path: '/dashboard/accountant/payments',
    },
    {
      title: 'Invoice Management',
      description: 'Generate and manage student invoices',
      icon: InvoiceIcon,
      color: '#ff9800',
      path: '/dashboard/accountant/invoices',
    },
    {
      title: 'Fee Configuration',
      description: 'Configure fee structures and rules',
      icon: FeeIcon,
      color: '#9c27b0',
      path: '/dashboard/accountant/fee-config',
    },
    {
      title: 'Financial Reports',
      description: 'Generate comprehensive financial reports',
      icon: ReportIcon,
      color: '#f44336',
      path: '/dashboard/accountant/reports',
    },
    {
      title: 'Accounting',
      description: 'Ledgers, Trial Balance, and Daybook',
      icon: AccountBalanceIcon,
      color: '#00bcd4',
      path: '/dashboard/accountant/accounting',
    },
    {
      title: 'Payment Gateways',
      description: 'Manage online payment integrations',
      icon: CreditCard,
      color: '#795548',
      path: '/dashboard/accountant/gateways',
    },
    {
      title: 'Excel Import',
      description: 'Import fee data from Excel files',
      icon: ExportIcon,
      color: '#607d8b',
      path: '/dashboard/accountant/import',
    },
  ];

  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[
        {
          title: "Today's Collections",
          value: financialService.formatCurrency(
            dashboardData.stats?.todayCollections || 0
          ),
          icon: MoneyIcon,
          color: '#4caf50',
          subtitle: 'Total collected today',
        },
        {
          title: 'Monthly Revenue',
          value: financialService.formatCurrency(
            dashboardData.stats?.monthlyRevenue || 0
          ),
          icon: TrendingUpIcon,
          color: '#2196f3',
          subtitle: 'This month',
        },
        {
          title: 'Pending Collections',
          value: financialService.formatCurrency(
            dashboardData.stats?.pendingAmount || 0
          ),
          icon: DueDateIcon,
          color: '#ff9800',
          subtitle: `${dashboardData.stats?.pendingInvoices || 0} invoices`,
        },
        {
          title: 'Overdue Amount',
          value: financialService.formatCurrency(
            dashboardData.stats?.overdueAmount || 0
          ),
          icon: OverdueIcon,
          color: '#f44336',
          subtitle: `${dashboardData.stats?.overdueInvoices || 0} overdue`,
        },
      ].map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stat.subtitle}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}20`,
                    color: stat.color,
                    width: 56,
                    height: 56,
                  }}
                >
                  <stat.icon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderQuickActions = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <AnalyticsIcon />
          Financial Operations
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate(action.path)}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: action.color,
                      mx: 'auto',
                      mb: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <action.icon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', mb: 1, fontSize: '1rem' }}
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: '0.8rem' }}
                  >
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderRecentActivity = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <ReceiptIcon />
              Recent Payments
            </Typography>
            <List dense>
              {dashboardData.recentPayments
                ?.slice(0, 5)
                .map((payment, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar
                        sx={{ bgcolor: '#4caf50', width: 32, height: 32 }}
                      >
                        <MoneyIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={`${payment.student?.firstName || 'Student'} ${
                        payment.student?.lastName || ''
                      }`}
                      secondary={`${financialService.formatCurrency(
                        payment.totalAmount
                      )} - ${payment.paymentMethod}`}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </ListItem>
                ))}
            </List>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/dashboard/accountant/payments')}
            >
              View All Payments
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <OverdueIcon />
              Overdue Invoices
            </Typography>
            <List dense>
              {dashboardData.overdueInvoices?.map((invoice, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: '#f44336', width: 32, height: 32 }}>
                      <OverdueIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={`Invoice #${invoice.invoiceNumber || index + 1}`}
                    secondary={`${financialService.formatCurrency(
                      invoice.totalAmount
                    )} - Due: ${
                      invoice.dueDate
                        ? new Date(invoice.dueDate).toLocaleDateString()
                        : 'N/A'
                    }`}
                  />
                  <Chip label="Overdue" size="small" color="error" />
                </ListItem>
              ))}
            </List>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/dashboard/accountant/invoices')}
            >
              Manage Invoices
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <Typography variant="h6">Loading Accountant Dashboard...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            💰 Accountant Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {user?.firstName || 'Accountant'}! Manage all
            financial operations and accounting tasks.
          </Typography>
        </Box>

        {/* Statistics Cards */}
        {renderStatsCards()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Recent Activity */}
        {renderRecentActivity()}
      </Box>
    </DashboardLayout>
  );
};

export default AccountantDashboard;
