import {
  Add as AddIcon,
  AccountBalance as BankIcon,
  CheckCircle as CheckIcon,
  CreditCard as CreditCardIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  MonetizationOn as MoneyIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
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
  Grid,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import DashboardLayout from '../../components/layout/DashboardLayout.js';
import financialService from '../../services/financialService.js';
import parentService from '../../services/parentService.js';

const ParentPayments = () => {
  const [loading, setLoading] = useState(true);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Backend integrated data states
  const [children, setChildren] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({
    totalDue: 0,
    paidThisYear: 0,
    pendingPayments: 0,
    nextDueDate: null,
  });

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.email) {
      loadParentData();
    }
  }, [user]);

  const loadParentData = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔄 Loading parent payment data for:', user.email);

      // Step 1: Get children from backend using parent service
      const childrenData = await parentService.getChildrenByParentEmail(
        user.email
      );

      if (childrenData.length === 0) {
        console.log('⚠️ No children found for parent:', user.email);
        setChildren([]);
        setError(
          'No children found linked to your account. Please contact the school administration to set up parent-child relationships.'
        );
        setLoading(false);
        return;
      }

      console.log('👶 Children data loaded:', childrenData);
      setChildren(childrenData);

      // Step 2: Load financial data for all children
      const allInvoices = [];
      const allPayments = [];
      let totalDue = 0;
      let paidThisYear = 0;
      let pendingCount = 0;
      let nextDueDate = null;

      for (const child of childrenData) {
        try {
          // Get invoices for this child
          const childInvoices = await financialService.getInvoicesByStudentId(
            child.studentId
          );
          allInvoices.push(
            ...childInvoices.map((invoice) => ({
              ...invoice,
              childName: `${child.user?.firstName || ''} ${
                child.user?.lastName || ''
              }`.trim(),
              childId: child.studentId,
            }))
          );

          // Get payments for this child
          const childPayments = await financialService.getPaymentsByStudentId(
            child.studentId
          );
          allPayments.push(
            ...childPayments.map((payment) => ({
              ...payment,
              childName: `${child.user?.firstName || ''} ${
                child.user?.lastName || ''
              }`.trim(),
              childId: child.studentId,
            }))
          );

          // Calculate outstanding balance
          const outstandingResponse =
            await financialService.getStudentOutstandingAmount(child.studentId);
          const outstanding = outstandingResponse.outstandingAmount || 0;
          totalDue += outstanding;
        } catch (error) {
          console.warn(
            `Could not load financial data for child ${child.studentId}:`,
            error
          );
        }
      }

      // Calculate summary statistics
      const currentYear = new Date().getFullYear();
      const paymentsThisYear = allPayments.filter(
        (payment) =>
          payment.paymentDate &&
          new Date(payment.paymentDate).getFullYear() === currentYear &&
          payment.status === 'COMPLETED'
      );
      paidThisYear = paymentsThisYear.reduce(
        (sum, payment) => sum + (payment.totalAmount || 0),
        0
      );

      const pendingInvoices = allInvoices.filter(
        (invoice) => invoice.status === 'SENT' || invoice.status === 'OVERDUE'
      );
      pendingCount = pendingInvoices.length;

      // Find next due date
      const upcomingInvoices = pendingInvoices
        .filter((invoice) => invoice.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

      if (upcomingInvoices.length > 0) {
        nextDueDate = upcomingInvoices[0].dueDate;
      }

      setInvoices(allInvoices);
      setPayments(allPayments);
      setSummary({
        totalDue,
        paidThisYear,
        pendingPayments: pendingCount,
        nextDueDate,
      });

      console.log('✅ Parent financial data loaded successfully', {
        children: childrenData.length,
        invoices: allInvoices.length,
        payments: allPayments.length,
        summary: { totalDue, paidThisYear, pendingCount },
      });
    } catch (error) {
      console.error('❌ Error loading parent data:', error);
      setError(`Failed to load payment information: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMakePayment = async () => {
    if (!selectedInvoice) return;

    setLoading(true);
    setError('');

    try {
      // Process payment through backend
      const payment = await financialService.quickPayment(
        selectedInvoice.childId,
        selectedInvoice.fee?.id,
        selectedInvoice.totalAmount,
        paymentMethod,
        `PAY-${Date.now()}`
      );

      setSuccess(
        `Payment of ${financialService.formatCurrency(
          selectedInvoice.totalAmount
        )} processed successfully!`
      );
      setPaymentDialog(false);
      setSelectedInvoice(null);

      // Refresh data after payment
      await loadParentData();

      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Payment processing error:', error);
      setError(`Payment failed: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
      case 'COMPLETED':
        return '#4caf50';
      case 'PENDING':
      case 'SENT':
        return '#ff9800';
      case 'OVERDUE':
      case 'FAILED':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'Paid';
      case 'SENT':
        return 'Pending';
      case 'OVERDUE':
        return 'Overdue';
      case 'COMPLETED':
        return 'Completed';
      case 'PENDING':
        return 'Pending';
      case 'FAILED':
        return 'Failed';
      default:
        return status || 'Unknown';
    }
  };

  const renderPaymentSummary = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#f44336',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <MoneyIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#f44336' }}
            >
              {financialService.formatCurrency(summary.totalDue)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Outstanding
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#4caf50',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <CheckIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#4caf50' }}
            >
              {financialService.formatCurrency(summary.paidThisYear)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paid This Year
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#ff9800',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <ScheduleIcon />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#ff9800' }}
            >
              {summary.pendingPayments}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Invoices
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                bgcolor: '#2196f3',
                mx: 'auto',
                mb: 1,
                width: 48,
                height: 48,
              }}
            >
              <ScheduleIcon />
            </Avatar>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: '#2196f3' }}
            >
              {summary.nextDueDate
                ? new Date(summary.nextDueDate).toLocaleDateString()
                : 'No due dates'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Next Due Date
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderChildrenOverview = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <SchoolIcon />
          My Children ({children.length})
        </Typography>
        <Grid container spacing={2}>
          {children.map((child, index) => (
            <Grid item xs={12} sm={6} md={4} key={child.studentId || index}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {`${child.user?.firstName || ''} ${
                    child.user?.lastName || ''
                  }`.trim()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Student ID: {child.studentId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Grade: {child.grade}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    size="small"
                    label={child.department || 'N/A'}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderPendingInvoices = () => {
    const pendingInvoices = invoices.filter(
      (invoice) => invoice.status === 'SENT' || invoice.status === 'OVERDUE'
    );

    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <WarningIcon />
            Pending Invoices ({pendingInvoices.length})
          </Typography>
          {pendingInvoices.length === 0 ? (
            <Typography color="text.secondary">
              No pending invoices at this time.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Child</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Invoice #</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingInvoices.map((invoice, index) => (
                    <TableRow
                      key={invoice.id || index}
                      sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {invoice.childName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {invoice.invoiceNumber || `INV-${index + 1}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {financialService.formatCurrency(invoice.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {invoice.dueDate
                            ? new Date(invoice.dueDate).toLocaleDateString()
                            : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(invoice.status)}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(
                              invoice.status
                            )}20`,
                            color: getStatusColor(invoice.status),
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<PaymentIcon />}
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setPaymentDialog(true);
                          }}
                          sx={{
                            background:
                              'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                          }}
                        >
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderPaymentHistory = () => {
    const completedPayments = payments.filter(
      (payment) => payment.status === 'COMPLETED'
    );

    return (
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <HistoryIcon />
            Payment History ({completedPayments.length})
          </Typography>
          {completedPayments.length === 0 ? (
            <Typography color="text.secondary">
              No payment history available.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Child</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Receipt</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedPayments
                    .sort(
                      (a, b) =>
                        new Date(b.paymentDate) - new Date(a.paymentDate)
                    )
                    .slice(0, 10)
                    .map((payment, index) => (
                      <TableRow
                        key={payment.id || index}
                        sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}
                      >
                        <TableCell>
                          <Typography variant="body2">
                            {payment.paymentDate
                              ? new Date(
                                  payment.paymentDate
                                ).toLocaleDateString()
                              : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {payment.childName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {financialService.formatCurrency(
                              payment.totalAmount
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.paymentMethod}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {payment.receiptNumber || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(payment.status)}
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(
                                payment.status
                              )}20`,
                              color: getStatusColor(payment.status),
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderPaymentDialog = () => (
    <Dialog
      open={paymentDialog}
      onClose={() => setPaymentDialog(false)}
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
        {selectedInvoice && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(76, 175, 80, 0.04)' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Child:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedInvoice.childName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Invoice #:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedInvoice.invoiceNumber || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Amount:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', color: '#4caf50' }}
                  >
                    {financialService.formatCurrency(
                      selectedInvoice.totalAmount
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Due Date:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedInvoice.dueDate
                      ? new Date(selectedInvoice.dueDate).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Payment Method"
              >
                <MenuItem value="CARD">Credit/Debit Card</MenuItem>
                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="ONLINE">Online Payment</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info" sx={{ mb: 2 }}>
              This is a demo payment system. In production, this would integrate
              with a real payment gateway.
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleMakePayment}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Process Payment'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading && children.length === 0) {
    return (
      <DashboardLayout title="Payments & Billing">
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
            Loading Payment Information...
          </Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Payments & Billing">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
          >
            💳 Payments & Billing
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage payments and view billing information for your children
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

        {/* Payment Summary */}
        {renderPaymentSummary()}

        {/* Children Overview */}
        {renderChildrenOverview()}

        {/* Pending Invoices */}
        {renderPendingInvoices()}

        {/* Payment History */}
        {renderPaymentHistory()}

        {/* Payment Dialog */}
        {renderPaymentDialog()}
      </Box>
    </DashboardLayout>
  );
};

export default ParentPayments;
