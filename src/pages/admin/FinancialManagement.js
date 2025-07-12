import {
  Add as AddIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  CheckCircle as CheckIcon,
  DateRange as DateIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  Description as InvoiceIcon,
  AttachMoney as MoneyIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
  Assessment as ReportIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Send as SendIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Upload as UploadIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import financialService from '../../services/financialService.js';
import studentService from '../../services/studentService.js';

const FinancialManagement = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [students, setStudents] = useState([]);
  const [financialOverview, setFinancialOverview] = useState({});

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Dialog states
  const [openFeeDialog, setOpenFeeDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states
  const [feeForm, setFeeForm] = useState(financialService.createFeeTemplate());
  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    feeId: '',
    amount: '',
    paymentMethod: 'CASH',
    transactionId: '',
  });
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: '',
    academicYear: '2024-25',
    term: 'SEMESTER_1',
    feeIds: [],
  });

  const tabs = [
    'Financial Dashboard',
    'Fee Management',
    'Payment Processing',
    'Invoice Management',
  ];
  const feeTypes = financialService.getFeeTypes();
  const paymentMethods = financialService.getPaymentMethods();
  const academicYears = financialService.getAcademicYears();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Loading financial data from Spring Boot backend...');

      const [feesData, paymentsData, invoicesData, studentsData, overviewData] =
        await Promise.all([
          financialService.getAllFees(),
          financialService.getAllPayments(),
          financialService.getAllInvoices(),
          studentService.getAllStudents(),
          financialService.getFinancialOverview(),
        ]);

      setFees(feesData);
      setPayments(paymentsData);
      setInvoices(invoicesData);
      setStudents(studentsData);
      setFinancialOverview(overviewData);

      // Check if we have any backend errors and show info message
      if (
        overviewData?.errors &&
        Object.values(overviewData.errors).some((err) => err)
      ) {
        const errorMessages = Object.entries(overviewData.errors)
          .filter(([_, error]) => error)
          .map(([service, error]) => `${service}: ${error}`);

        setError(
          `⚠️ Some data may not be available. Backend status: ${errorMessages.join(
            ', '
          )}. Make sure your Spring Boot backend is running on port 8080.`
        );
      } else {
        console.log('✅ Financial data loaded successfully from backend');
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ Error loading financial data:', error);
      setError(
        `Failed to connect to Spring Boot backend: ${error.message}. Please ensure the backend is running on port 8080.`
      );
      setLoading(false);
    }
  };

  // Fee Management Functions
  const handleCreateFee = () => {
    setDialogMode('add');
    setSelectedItem(null);
    setFeeForm(financialService.createFeeTemplate());
    setOpenFeeDialog(true);
  };

  const handleEditFee = (fee) => {
    setDialogMode('edit');
    setSelectedItem(fee);
    setFeeForm(fee);
    setOpenFeeDialog(true);
  };

  const handleSaveFee = async () => {
    try {
      if (dialogMode === 'add') {
        const newFee = await financialService.createFee(feeForm);
        setFees([newFee, ...fees]);
        setSuccess('Fee created successfully!');
      } else if (dialogMode === 'edit') {
        const updatedFee = await financialService.updateFee(
          selectedItem.id,
          feeForm
        );
        setFees(fees.map((f) => (f.id === selectedItem.id ? updatedFee : f)));
        setSuccess('Fee updated successfully!');
      }
      setOpenFeeDialog(false);

      // Refresh financial overview statistics after fee operations (mandatory)
      const updatedOverview = await financialService.getFinancialOverview();
      setFinancialOverview(updatedOverview);
      console.log('✅ Financial overview refreshed after fee operation');

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(`Failed to save fee: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteFee = async (feeId) => {
    if (window.confirm('Are you sure you want to delete this fee?')) {
      try {
        await financialService.deleteFee(feeId);
        setFees(fees.filter((f) => f.id !== feeId));
        setSuccess('Fee deleted successfully!');

        // Refresh financial overview statistics after fee deletion (mandatory)
        const updatedOverview = await financialService.getFinancialOverview();
        setFinancialOverview(updatedOverview);
        console.log('✅ Financial overview refreshed after fee deletion');

        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(`Failed to delete fee: ${error.message}`);
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  // Payment Processing Functions
  const handleProcessPayment = () => {
    setDialogMode('add');
    setPaymentForm({
      studentId: '',
      feeId: '',
      amount: '',
      paymentMethod: 'CASH',
      transactionId: '',
    });
    setOpenPaymentDialog(true);
  };

  const handleSavePayment = async () => {
    try {
      const newPayment = await financialService.quickPayment(
        paymentForm.studentId,
        paymentForm.feeId,
        Number.parseFloat(paymentForm.amount),
        paymentForm.paymentMethod,
        paymentForm.transactionId || `TXN${Date.now()}`
      );
      setPayments([newPayment, ...payments]);
      setSuccess('Payment processed successfully!');
      setOpenPaymentDialog(false);

      // Refresh financial overview statistics after successful payment (mandatory)
      const updatedOverview = await financialService.getFinancialOverview();
      setFinancialOverview(updatedOverview);
      console.log('✅ Financial overview refreshed after payment');

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(`Failed to process payment: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Invoice Management Functions
  const handleGenerateInvoice = () => {
    setDialogMode('add');
    setInvoiceForm({
      studentId: '',
      academicYear: '2024-25',
      term: 'SEMESTER_1',
      feeIds: [],
    });
    setOpenInvoiceDialog(true);
  };

  const handleSaveInvoice = async () => {
    try {
      const newInvoice = await financialService.generateInvoice(
        invoiceForm.studentId,
        invoiceForm.academicYear,
        invoiceForm.term,
        invoiceForm.feeIds
      );
      setInvoices([newInvoice, ...invoices]);
      setSuccess('Invoice generated successfully!');
      setOpenInvoiceDialog(false);

      // Refresh financial overview statistics after successful invoice creation (mandatory)
      const updatedOverview = await financialService.getFinancialOverview();
      setFinancialOverview(updatedOverview);
      console.log('✅ Financial overview refreshed after invoice creation');

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(`Failed to generate invoice: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const renderStatsCards = () => {
    const stats = financialOverview.summary || {};
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          {
            title: 'Total Revenue',
            value: financialService.formatCurrency(stats.totalRevenue),
            icon: MoneyIcon,
            color: '#4caf50',
            subtitle: 'All time',
          },
          {
            title: 'Monthly Revenue',
            value: financialService.formatCurrency(stats.monthlyRevenue),
            icon: TrendingUpIcon,
            color: '#2196f3',
            subtitle: 'This month',
          },
          {
            title: 'Pending Payments',
            value: stats.pendingPayments || 0,
            icon: ScheduleIcon,
            color: '#ff9800',
            subtitle: 'Awaiting payment',
          },
          {
            title: 'Collection Rate',
            value: `${(stats.collectionRate || 0).toFixed(1)}%`,
            icon: AnalyticsIcon,
            color: '#9c27b0',
            subtitle: 'Overall efficiency',
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
  };

  const renderDashboard = () => (
    <Box>
      {/* Quick Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <ReportIcon />
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateFee}
                sx={{
                  background:
                    'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                }}
              >
                Create Fee
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={handleProcessPayment}
                sx={{
                  background:
                    'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                }}
              >
                Process Payment
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<InvoiceIcon />}
                onClick={handleGenerateInvoice}
                sx={{
                  background:
                    'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
                }}
              >
                Generate Invoice
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => setSuccess('Financial report exported!')}
              >
                Export Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <WarningIcon />
                Overdue Payments
              </Typography>
              <List dense>
                {payments
                  .filter((p) => p.status === 'PENDING')
                  .slice(0, 5)
                  .map((payment, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{ bgcolor: '#f44336', width: 32, height: 32 }}
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
                        )} - ${payment.fee?.feeName || 'Fee'}`}
                      />
                      <Chip label="Overdue" size="small" color="error" />
                    </ListItem>
                  ))}
              </List>
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
                <CheckIcon />
                Recent Payments
              </Typography>
              <List dense>
                {payments
                  .filter((p) => p.status === 'COMPLETED')
                  .slice(0, 5)
                  .map((payment, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar
                          sx={{ bgcolor: '#4caf50', width: 32, height: 32 }}
                        >
                          <CheckIcon fontSize="small" />
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderFeeManagement = () => (
    <Box>
      {/* Header Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search fees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Fee Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {feeTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateFee}
                sx={{
                  background:
                    'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                }}
              >
                Add Fee
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Fees Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fee Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fees
                  .filter((fee) => {
                    const matchesSearch =
                      !searchTerm ||
                      fee.feeName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      fee.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase());
                    const matchesType =
                      !typeFilter || fee.feeType === typeFilter;
                    const matchesStatus =
                      !statusFilter || fee.status === statusFilter;
                    return matchesSearch && matchesType && matchesStatus;
                  })
                  .map((fee) => (
                    <TableRow
                      key={fee.id}
                      sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
                    >
                      <TableCell>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                        >
                          <Avatar sx={{ bgcolor: '#1976d2' }}>
                            <MoneyIcon />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 'bold' }}
                            >
                              {fee.feeName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {fee.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={fee.feeType}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {financialService.formatCurrency(fee.amount)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{fee.category}</Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={fee.status}
                          size="small"
                          sx={{
                            backgroundColor: `${financialService.getStatusColor(
                              fee.status
                            )}20`,
                            color: financialService.getStatusColor(fee.status),
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {fee.dueDate
                            ? new Date(fee.dueDate).toLocaleDateString()
                            : 'N/A'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit Fee">
                            <IconButton
                              size="small"
                              onClick={() => handleEditFee(fee)}
                              sx={{ color: '#ff9800' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete Fee">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteFee(fee.id)}
                              sx={{ color: '#f44336' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const renderPaymentProcessing = () => (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <PaymentIcon />
        Payment Processing
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Payment processing interface will be displayed here with comprehensive
        payment tracking, transaction management, refund processing, and payment
        analytics.
      </Typography>
    </Box>
  );

  const renderInvoiceManagement = () => (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <InvoiceIcon />
        Invoice Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Invoice management interface will be displayed here with invoice
        generation, bulk invoice creation, payment tracking, and invoice
        analytics.
      </Typography>
    </Box>
  );

  const renderFeeDialog = () => (
    <Dialog
      open={openFeeDialog}
      onClose={() => setOpenFeeDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <MoneyIcon />
        {dialogMode === 'add' ? 'Create New Fee' : 'Edit Fee'}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fee Name"
              value={feeForm.feeName}
              onChange={(e) =>
                setFeeForm({ ...feeForm, feeName: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={feeForm.amount}
              onChange={(e) =>
                setFeeForm({
                  ...feeForm,
                  amount: Number.parseFloat(e.target.value),
                })
              }
              inputProps={{ min: 0 }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Fee Type</InputLabel>
              <Select
                value={feeForm.feeType}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, feeType: e.target.value })
                }
              >
                {feeTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={feeForm.category}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, category: e.target.value })
                }
              >
                {financialService.getFeeCategories().map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={feeForm.description}
              onChange={(e) =>
                setFeeForm({ ...feeForm, description: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Academic Year</InputLabel>
              <Select
                value={feeForm.academicYear}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, academicYear: e.target.value })
                }
              >
                {academicYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={feeForm.dueDate || ''}
              onChange={(e) =>
                setFeeForm({ ...feeForm, dueDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={feeForm.mandatory}
                  onChange={(e) =>
                    setFeeForm({ ...feeForm, mandatory: e.target.checked })
                  }
                />
              }
              label="Mandatory Fee"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setOpenFeeDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSaveFee}
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          }}
        >
          {dialogMode === 'add' ? 'Create Fee' : 'Update Fee'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderPaymentDialog = () => (
    <Dialog
      open={openPaymentDialog}
      onClose={() => setOpenPaymentDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <PaymentIcon />
        Process Payment
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              options={students}
              getOptionLabel={(student) =>
                `${student.user?.firstName} ${student.user?.lastName} (${student.studentId})`
              }
              onChange={(event, newValue) => {
                setPaymentForm({
                  ...paymentForm,
                  studentId: newValue?.studentId || '',
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select Student" required />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={fees}
              getOptionLabel={(fee) =>
                `${fee.feeName} - ${financialService.formatCurrency(
                  fee.amount
                )}`
              }
              onChange={(event, newValue) => {
                setPaymentForm({
                  ...paymentForm,
                  feeId: newValue?.id || '',
                  amount: newValue?.amount || '',
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select Fee" required />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={paymentForm.amount}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, amount: e.target.value })
              }
              inputProps={{ min: 0 }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentForm.paymentMethod}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentMethod: e.target.value,
                  })
                }
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Transaction ID (Optional)"
              value={paymentForm.transactionId}
              onChange={(e) =>
                setPaymentForm({
                  ...paymentForm,
                  transactionId: e.target.value,
                })
              }
              placeholder="Auto-generated if empty"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSavePayment}
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          }}
        >
          Process Payment
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return renderDashboard();
      case 1:
        return renderFeeManagement();
      case 2:
        return renderPaymentProcessing();
      case 3:
        return renderInvoiceManagement();
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Financial Management">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading Financial Data...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Financial Management">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            💰 Financial Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Comprehensive fee tracking, payment processing, and financial
            analytics
          </Typography>
        </Box>

        {/* Alerts */}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3, backgroundColor: '#e8f5e8' }}
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        {renderStatsCards()}

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        </Card>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Dialogs */}
        {renderFeeDialog()}
        {renderPaymentDialog()}
      </Box>
    </DashboardLayout>
  );
};

export default FinancialManagement;
