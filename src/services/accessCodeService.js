import apiClient from "../config/api.js";

class AccessCodeService {
  // ====================
  // ACCESS CODE MANAGEMENT APIs
  // ====================

  async getAllAccessCodes() {
    try {
      const response = await apiClient.get("/api/access-codes");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch access codes");
    }
  }

  async getAccessCodeByCode(accessCode) {
    try {
      const response = await apiClient.get(`/api/access-codes/${accessCode}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch access code");
    }
  }

  async getAccessCodesByStudentId(studentId) {
    try {
      const response = await apiClient.get(`/api/access-codes/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch student access codes");
    }
  }

  async getAccessCodesByParentEmail(parentEmail) {
    try {
      const response = await apiClient.get(`/api/access-codes/parent/${parentEmail}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch parent access codes");
    }
  }

  async getValidUnusedCodes() {
    try {
      const response = await apiClient.get("/api/access-codes/valid");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch valid unused codes");
    }
  }

  async getValidUnusedCodesByType(codeType) {
    try {
      const response = await apiClient.get(`/api/access-codes/valid/${codeType}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch valid unused codes by type");
    }
  }

  // ====================
  // ACCESS CODE GENERATION APIs
  // ====================

  async generateStudentAccessCode(studentId) {
    try {
      const response = await apiClient.post(`/api/access-codes/generate/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to generate student access code");
    }
  }

  async generateStudentAndParentAccessCodes(studentId) {
    try {
      const response = await apiClient.post(`/api/access-codes/generate/student-and-parents/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to generate student and parent access codes");
    }
  }

  async generateParentAccessCodes(studentId) {
    try {
      const response = await apiClient.post(`/api/access-codes/generate/parents/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to generate parent access codes");
    }
  }

  async generateParentAccessCode(parentEmail, studentId) {
    try {
      const response = await apiClient.post("/api/access-codes/generate/parent", null, {
        params: { parentEmail, studentId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to generate parent access code");
    }
  }

  // ====================
  // ACCESS CODE VALIDATION AND USAGE APIs
  // ====================

  async validateAccessCode(accessCode, userType) {
    try {
      const response = await apiClient.post("/api/access-codes/validate", null, {
        params: { accessCode, userType }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to validate access code");
    }
  }

  async useAccessCode(accessCode, usedBy, userType) {
    try {
      const response = await apiClient.post("/api/access-codes/use", null, {
        params: { accessCode, usedBy, userType }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to use access code");
    }
  }

  // ====================
  // ACCESS CODE REGENERATION APIs
  // ====================

  async regenerateAccessCode(accessCodeId) {
    try {
      const response = await apiClient.put(`/api/access-codes/regenerate/${accessCodeId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to regenerate access code");
    }
  }

  async regenerateStudentAccessCode(studentId) {
    try {
      const response = await apiClient.put(`/api/access-codes/regenerate/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to regenerate student access code");
    }
  }

  async regenerateParentAccessCodes(studentId) {
    try {
      const response = await apiClient.put(`/api/access-codes/regenerate/parents/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to regenerate parent access codes");
    }
  }

  // ====================
  // ACCESS CODE MANAGEMENT APIs
  // ====================

  async revokeAccessCode(accessCodeId, reason) {
    try {
      const response = await apiClient.put(`/api/access-codes/revoke/${accessCodeId}`, null, {
        params: { reason }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to revoke access code");
    }
  }

  async cleanupExpiredCodes() {
    try {
      const response = await apiClient.post("/api/access-codes/cleanup-expired");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to cleanup expired codes");
    }
  }

  // ====================
  // STATISTICS AND REPORTING APIs
  // ====================

  async getAccessCodeStatistics() {
    try {
      const response = await apiClient.get("/api/access-codes/statistics");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch access code statistics");
    }
  }

  async getAccessCodesGeneratedBetween(startDate, endDate) {
    try {
      const response = await apiClient.get("/api/access-codes/reports/generated", {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch generated access codes report");
    }
  }

  async getAccessCodesUsedBetween(startDate, endDate) {
    try {
      const response = await apiClient.get("/api/access-codes/reports/used", {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch used access codes report");
    }
  }

  // ====================
  // BULK OPERATIONS APIs
  // ====================

  async bulkGenerateForStudents(studentIds) {
    try {
      const response = await apiClient.post("/api/access-codes/bulk/generate-for-students", studentIds);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to bulk generate access codes");
    }
  }

  // ====================
  // STUDENT SERVICE INTEGRATION
  // ====================

  async getStudentAccessCodes(studentId) {
    try {
      const response = await apiClient.get(`/students/${studentId}/access-codes`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch student access codes");
    }
  }

  async generateStudentAccessCodesFromStudentService(studentId) {
    try {
      const response = await apiClient.post(`/students/${studentId}/access-codes/generate`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to generate student access codes");
    }
  }

  async regenerateStudentAccessCodesFromStudentService(studentId) {
    try {
      const response = await apiClient.put(`/students/${studentId}/access-codes/regenerate`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to regenerate student access codes");
    }
  }

  // ====================
  // HELPER METHODS
  // ====================

  // Check if access code is valid format
  isValidAccessCodeFormat(accessCode) {
    // Expected format: STU-XXXX-XXXX-XXXX or PAR-XXXX-XXXX-XXXX
    const pattern = /^(STU|PAR)-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return pattern.test(accessCode);
  }

  // Get access code type from format
  getAccessCodeType(accessCode) {
    if (!this.isValidAccessCodeFormat(accessCode)) {
      return null;
    }
    return accessCode.startsWith('STU-') ? 'STUDENT' : 'PARENT';
  }

  // Get user type from access code
  getUserTypeFromAccessCode(accessCode) {
    const codeType = this.getAccessCodeType(accessCode);
    if (codeType === 'STUDENT') {
      return 'STUDENT_PORTAL';
    } else if (codeType === 'PARENT') {
      return 'PARENT_PORTAL';
    }
    return null;
  }

  // Format access code for display
  formatAccessCodeForDisplay(accessCode) {
    if (!accessCode) return '';
    // Add spaces for better readability: STU-1234-5678-9012 -> STU-1234 5678 9012
    return accessCode.replace(/(.{4})-(.{4})-(.{4})$/, '$1 $2 $3');
  }

  // Clean access code input (remove spaces, convert to uppercase)
  cleanAccessCodeInput(input) {
    if (!input) return '';
    return input.replace(/\s+/g, '').toUpperCase();
  }

  // Get access code status display text
  getStatusDisplayText(status) {
    const statusMap = {
      'ACTIVE': 'Active',
      'USED': 'Used',
      'EXPIRED': 'Expired',
      'REVOKED': 'Revoked'
    };
    return statusMap[status] || status;
  }

  // Get access code status color
  getStatusColor(status) {
    const colorMap = {
      'ACTIVE': '#4caf50',
      'USED': '#2196f3',
      'EXPIRED': '#ff9800',
      'REVOKED': '#f44336'
    };
    return colorMap[status] || '#757575';
  }

  // Calculate days until expiry
  getDaysUntilExpiry(expiryDate) {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // Check if access code is expiring soon (within 7 days)
  isExpiringSoon(expiryDate) {
    const daysUntilExpiry = this.getDaysUntilExpiry(expiryDate);
    return daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }

  // Generate display text for access code
  generateDisplayText(accessCode) {
    if (!accessCode) return '';

    const typeText = accessCode.codeType === 'STUDENT' ? 'Student' : 'Parent';
    const statusText = this.getStatusDisplayText(accessCode.status);
    const daysUntilExpiry = this.getDaysUntilExpiry(accessCode.expiryDate);

    let displayText = `${typeText} Access Code - ${statusText}`;

    if (accessCode.status === 'ACTIVE' && daysUntilExpiry !== null) {
      if (daysUntilExpiry > 0) {
        displayText += ` (Expires in ${daysUntilExpiry} days)`;
      } else {
        displayText += ' (Expired)';
      }
    }

    return displayText;
  }
}

export default new AccessCodeService();
