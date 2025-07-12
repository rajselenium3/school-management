import apiClient from '../config/api.js';

class FinancialService {
  // ====================
  // FEE MANAGEMENT APIs
  // ====================

  // Get all fees
  async getAllFees() {
    try {
      const response = await apiClient.get('/fees');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch fees');
    }
  }

  // Get fee by ID
  async getFeeById(id) {
    try {
      const response = await apiClient.get(`/fees/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch fee');
    }
  }

  // Get fees by type
  async getFeesByType(feeType) {
    try {
      const response = await apiClient.get(`/fees/type/${feeType}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch fees by type'
      );
    }
  }

  // Get fees by academic year
  async getFeesByAcademicYear(academicYear) {
    try {
      const response = await apiClient.get(
        `/fees/academic-year/${academicYear}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch fees by academic year'
      );
    }
  }

  // Get applicable fees for student
  async getApplicableFeesForStudent(grade, department, academicYear) {
    try {
      const response = await apiClient.get('/fees/applicable', {
        params: { grade, department, academicYear },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch applicable fees'
      );
    }
  }

  // Create fee
  async createFee(feeData) {
    try {
      const response = await apiClient.post('/fees', feeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create fee');
    }
  }

  // Update fee
  async updateFee(id, feeData) {
    try {
      const response = await apiClient.put(`/fees/${id}`, feeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update fee');
    }
  }

  // Delete fee
  async deleteFee(id) {
    try {
      await apiClient.delete(`/fees/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete fee');
    }
  }

  // Get fee statistics
  async getFeeStatistics() {
    try {
      const response = await apiClient.get('/fees/statistics');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch fee statistics from backend:', error);
      // Return fallback data instead of throwing
      return {
        totalFees: 0,
        activeFees: 0,
        totalAmount: 0,
        error: error.response?.data?.message || 'Backend not available',
      };
    }
  }

  // ====================
  // PAYMENT MANAGEMENT APIs
  // ====================

  // Get all payments
  async getAllPayments() {
    try {
      const response = await apiClient.get('/payments');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch payments'
      );
    }
  }

  // Get payments by student
  async getPaymentsByStudentId(studentId) {
    try {
      const response = await apiClient.get(`/payments/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch student payments'
      );
    }
  }

  // Get payments by status
  async getPaymentsByStatus(status) {
    try {
      const response = await apiClient.get(`/payments/status/${status}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch payments by status'
      );
    }
  }

  // Get overdue payments
  async getOverduePayments() {
    try {
      const response = await apiClient.get('/payments/overdue');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch overdue payments'
      );
    }
  }

  // Initiate payment
  async initiatePayment(studentId, feeId, amount, paymentMethod) {
    try {
      const response = await apiClient.post(
        '/payments/initiate',
        {},
        {
          params: { studentId, feeId, amount, paymentMethod },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to initiate payment'
      );
    }
  }

  // Process payment
  async processPayment(paymentId, transactionId, paymentGateway) {
    try {
      const response = await apiClient.post(
        `/payments/${paymentId}/process`,
        {},
        {
          params: { transactionId, paymentGateway },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to process payment'
      );
    }
  }

  // Quick payment
  async quickPayment(studentId, feeId, amount, paymentMethod, transactionId) {
    try {
      const response = await apiClient.post(
        '/payments/quick-payment',
        {},
        {
          params: { studentId, feeId, amount, paymentMethod, transactionId },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to process quick payment'
      );
    }
  }

  // Get payment statistics
  async getPaymentStatistics() {
    try {
      const response = await apiClient.get('/payments/statistics');
      return response.data;
    } catch (error) {
      console.error(
        '❌ Failed to fetch payment statistics from backend:',
        error
      );
      // Return fallback data instead of throwing
      return {
        totalPayments: 0,
        completedPayments: 0,
        pendingPayments: 0,
        totalAmount: 0,
        error: error.response?.data?.message || 'Backend not available',
      };
    }
  }

  // Get revenue data
  async getRevenueData() {
    try {
      const response = await apiClient.get('/payments/revenue');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch revenue data from backend:', error);
      // Return fallback data instead of throwing
      return {
        totalRevenue: 0,
        thisMonthRevenue: 0,
        thisYearRevenue: 0,
        revenueGrowth: 0,
        error: error.response?.data?.message || 'Backend not available',
      };
    }
  }

  // Get student outstanding amount
  async getStudentOutstandingAmount(studentId) {
    try {
      const response = await apiClient.get(
        `/payments/student/${studentId}/outstanding`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch outstanding amount'
      );
    }
  }

  // ====================
  // INVOICE MANAGEMENT APIs
  // ====================

  // Get all invoices
  async getAllInvoices() {
    try {
      const response = await apiClient.get('/invoices');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch invoices'
      );
    }
  }

  // Get invoice by ID
  async getInvoiceById(id) {
    try {
      const response = await apiClient.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch invoice'
      );
    }
  }

  // Get invoices by student
  async getInvoicesByStudentId(studentId) {
    try {
      const response = await apiClient.get(`/invoices/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch student invoices'
      );
    }
  }

  // Get invoices by status
  async getInvoicesByStatus(status) {
    try {
      const response = await apiClient.get(`/invoices/status/${status}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch invoices by status'
      );
    }
  }

  // Get overdue invoices
  async getOverdueInvoices() {
    try {
      const response = await apiClient.get('/invoices/overdue');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch overdue invoices'
      );
    }
  }

  // Generate invoice
  async generateInvoice(studentId, academicYear, term, feeIds) {
    try {
      const response = await apiClient.post('/invoices/generate', feeIds, {
        params: { studentId, academicYear, term },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to generate invoice'
      );
    }
  }

  // Generate bulk invoices
  async generateBulkInvoices(academicYear, term, studentIds) {
    try {
      const response = await apiClient.post(
        '/invoices/bulk-generate',
        studentIds,
        {
          params: { academicYear, term },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to generate bulk invoices'
      );
    }
  }

  // Send invoice
  async sendInvoice(invoiceId) {
    try {
      const response = await apiClient.post(`/invoices/${invoiceId}/send`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to send invoice'
      );
    }
  }

  // Mark invoice as paid
  async markInvoiceAsPaid(invoiceId, paidAmount) {
    try {
      const response = await apiClient.post(
        `/invoices/${invoiceId}/mark-paid`,
        {},
        {
          params: { paidAmount },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to mark invoice as paid'
      );
    }
  }

  // Get invoice statistics
  async getInvoiceStatistics() {
    try {
      const response = await apiClient.get('/invoices/statistics');
      return response.data;
    } catch (error) {
      console.error(
        '❌ Failed to fetch invoice statistics from backend:',
        error
      );
      // Return fallback data instead of throwing
      return {
        totalInvoices: 0,
        paidInvoices: 0,
        overdueInvoices: 0,
        pendingAmount: 0,
        collectionRate: 0,
        error: error.response?.data?.message || 'Backend not available',
      };
    }
  }

  // Get student outstanding balance
  async getStudentOutstandingBalance(studentId) {
    try {
      const response = await apiClient.get(
        `/invoices/student/${studentId}/outstanding`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch outstanding balance'
      );
    }
  }

  // ====================
  // DASHBOARD & ANALYTICS
  // ====================

  // Get dashboard statistics
  async getDashboardStatistics() {
    try {
      const [feeStats, paymentStats, invoiceStats] = await Promise.all([
        apiClient.get('/fees/dashboard-stats'),
        apiClient.get('/payments/dashboard-stats'),
        apiClient.get('/invoices/dashboard-stats'),
      ]);

      return {
        fees: feeStats.data,
        payments: paymentStats.data,
        invoices: invoiceStats.data,
      };
    } catch (error) {
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  // Get comprehensive financial overview
  async getFinancialOverview() {
    try {
      // Use Promise.allSettled to handle partial failures gracefully
      const [feesResult, paymentsResult, invoicesResult, revenueResult] =
        await Promise.allSettled([
          this.getFeeStatistics(),
          this.getPaymentStatistics(),
          this.getInvoiceStatistics(),
          this.getRevenueData(),
        ]);

      // Extract data or use fallback values
      const fees = feesResult.status === 'fulfilled' ? feesResult.value : {};
      const payments =
        paymentsResult.status === 'fulfilled' ? paymentsResult.value : {};
      const invoices =
        invoicesResult.status === 'fulfilled' ? invoicesResult.value : {};
      const revenue =
        revenueResult.status === 'fulfilled' ? revenueResult.value : {};

      return {
        fees,
        payments,
        invoices,
        revenue,
        summary: {
          totalRevenue: revenue.totalRevenue || 0,
          monthlyRevenue: revenue.thisMonthRevenue || 0,
          pendingPayments: payments.pendingPayments || 0,
          overdueInvoices: invoices.overdueInvoices || 0,
          collectionRate: invoices.collectionRate || 0,
        },
        // Add error information for debugging
        errors: {
          fees:
            feesResult.status === 'rejected'
              ? feesResult.reason?.message
              : null,
          payments:
            paymentsResult.status === 'rejected'
              ? paymentsResult.reason?.message
              : null,
          invoices:
            invoicesResult.status === 'rejected'
              ? invoicesResult.reason?.message
              : null,
          revenue:
            revenueResult.status === 'rejected'
              ? revenueResult.reason?.message
              : null,
        },
      };
    } catch (error) {
      console.error('Error in getFinancialOverview:', error);
      // Return empty structure instead of throwing to prevent page crashes
      return {
        fees: {},
        payments: {},
        invoices: {},
        revenue: {},
        summary: {
          totalRevenue: 0,
          monthlyRevenue: 0,
          pendingPayments: 0,
          overdueInvoices: 0,
          collectionRate: 0,
        },
        errors: {
          overview: error.message,
        },
      };
    }
  }

  // ====================
  // HELPER METHODS
  // ====================

  // Get fee types
  getFeeTypes() {
    return [
      'TUITION',
      'LIBRARY',
      'LAB',
      'SPORTS',
      'TRANSPORT',
      'HOSTEL',
      'EXAMINATION',
      'MISCELLANEOUS',
    ];
  }

  // Get fee categories
  getFeeCategories() {
    return ['MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME'];
  }

  // Get payment methods
  getPaymentMethods() {
    return ['CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE', 'UPI', 'CHEQUE'];
  }

  // Get payment statuses
  getPaymentStatuses() {
    return ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'];
  }

  // Get invoice statuses
  getInvoiceStatuses() {
    return ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'];
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  }

  // Get status color
  getStatusColor(status) {
    const statusColors = {
      // Payment statuses
      COMPLETED: '#4caf50',
      PENDING: '#ff9800',
      FAILED: '#f44336',
      REFUNDED: '#2196f3',
      CANCELLED: '#9e9e9e',

      // Invoice statuses
      PAID: '#4caf50',
      SENT: '#2196f3',
      DRAFT: '#9e9e9e',
      OVERDUE: '#f44336',

      // Fee statuses
      ACTIVE: '#4caf50',
      INACTIVE: '#9e9e9e',
    };
    return statusColors[status] || '#757575';
  }

  // Create fee template
  createFeeTemplate() {
    return {
      feeName: '',
      description: '',
      amount: 0,
      feeType: 'TUITION',
      category: 'MONTHLY',
      academicYear: '2024-25',
      applicableGrades: [],
      applicableDepartments: [],
      mandatory: true,
      dueDate: null,
      lateFeeAmount: 0,
      lateFeePercentage: 0,
      discountRules: [],
      scholarshipEligible: false,
      status: 'ACTIVE',
    };
  }

  // Calculate late fee
  calculateLateFee(fee, currentDate) {
    if (!fee.dueDate || new Date(fee.dueDate) >= new Date(currentDate)) {
      return 0;
    }

    if (fee.lateFeeAmount) {
      return fee.lateFeeAmount;
    }

    if (fee.lateFeePercentage) {
      return (fee.amount * fee.lateFeePercentage) / 100;
    }

    return 0;
  }

  // Calculate discount
  calculateDiscount(fee, discountType) {
    if (!fee.discountRules || fee.discountRules.length === 0) {
      return 0;
    }

    const applicableRule = fee.discountRules.find(
      (rule) =>
        rule.discountType === discountType &&
        rule.active &&
        this.isDiscountRuleValid(rule)
    );

    if (!applicableRule) return 0;

    if (applicableRule.discountType === 'PERCENTAGE') {
      return (fee.amount * applicableRule.discountValue) / 100;
    } else if (applicableRule.discountType === 'FIXED_AMOUNT') {
      return Math.min(fee.amount, applicableRule.discountValue);
    }

    return 0;
  }

  // Check if discount rule is valid
  isDiscountRuleValid(rule) {
    const now = new Date();
    const validFrom = rule.validFrom ? new Date(rule.validFrom) : null;
    const validTo = rule.validTo ? new Date(rule.validTo) : null;

    return (!validFrom || now >= validFrom) && (!validTo || now <= validTo);
  }

  // Get academic years
  getAcademicYears() {
    return ['2023-24', '2024-25', '2025-26'];
  }

  // Get terms
  getTerms() {
    return [
      'SEMESTER_1',
      'SEMESTER_2',
      'QUARTERLY_1',
      'QUARTERLY_2',
      'QUARTERLY_3',
      'QUARTERLY_4',
      'YEARLY',
    ];
  }
}

export default new FinancialService();
