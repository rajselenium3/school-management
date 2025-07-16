import apiClient from '../config/api.js';

class IDConfigurationService {
  // ====================
  // ID CONFIGURATION APIs
  // ====================

  // Get all ID configurations
  async getAllConfigurations() {
    try {
      const response = await apiClient.get('/id-configurations');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch ID configurations'
      );
    }
  }

  // Get active ID configurations
  async getActiveConfigurations() {
    try {
      const response = await apiClient.get('/id-configurations/active');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Failed to fetch active ID configurations'
      );
    }
  }

  // Get ID configuration by ID
  async getConfigurationById(id) {
    try {
      const response = await apiClient.get(`/id-configurations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch ID configuration'
      );
    }
  }

  // Get ID configuration by type
  async getConfigurationByType(idType) {
    try {
      const response = await apiClient.get(`/id-configurations/type/${idType}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Failed to fetch ID configuration by type'
      );
    }
  }

  // Create new ID configuration
  async createConfiguration(configData) {
    try {
      const response = await apiClient.post('/id-configurations', configData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to create ID configuration'
      );
    }
  }

  // Update ID configuration
  async updateConfiguration(id, configData) {
    try {
      const response = await apiClient.put(
        `/id-configurations/${id}`,
        configData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to update ID configuration'
      );
    }
  }

  // Delete ID configuration
  async deleteConfiguration(id) {
    try {
      await apiClient.delete(`/id-configurations/${id}`);
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete ID configuration'
      );
    }
  }

  // Reset counter for ID type
  async resetCounter(idType, newCounter) {
    try {
      const response = await apiClient.post(
        '/id-configurations/reset-counter',
        null,
        {
          params: { idType, newCounter },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to reset counter'
      );
    }
  }

  // Preview next ID
  async previewNextId(idType, grade = null, section = null) {
    try {
      const params = { idType };
      if (grade) params.grade = grade;
      if (section) params.section = section;

      const response = await apiClient.get('/id-configurations/preview', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to preview next ID'
      );
    }
  }

  // Generate new ID
  async generateId(idType, grade = null, section = null) {
    try {
      const params = { idType };
      if (grade) params.grade = grade;
      if (section) params.section = section;

      const response = await apiClient.post(
        '/id-configurations/generate',
        null,
        { params }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate ID');
    }
  }

  // Validate if ID is duplicate
  async validateDuplicate(idType, id) {
    try {
      const response = await apiClient.get(
        '/id-configurations/validate-duplicate',
        {
          params: { idType, id },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to validate ID');
    }
  }

  // Initialize default configurations
  async initializeDefaults() {
    try {
      const response = await apiClient.post(
        '/id-configurations/initialize-defaults'
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Failed to initialize default configurations'
      );
    }
  }

  // Get ID generation statistics
  async getStatistics() {
    try {
      const response = await apiClient.get('/id-configurations/statistics');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to get statistics'
      );
    }
  }

  // ====================
  // HELPER METHODS
  // ====================

  // Get available ID types
  getIdTypes() {
    return [
      { value: 'STUDENT_ID', label: 'Student ID' },
      { value: 'ADMISSION_NUMBER', label: 'Admission Number' },
      { value: 'ROLL_NUMBER', label: 'Roll Number' },
      { value: 'EMPLOYEE_ID', label: 'Employee ID' },
    ];
  }

  // Get format placeholders
  getFormatPlaceholders() {
    return [
      { placeholder: '{YEAR}', description: 'Current year (e.g., 2024)' },
      { placeholder: '{GRADE}', description: 'Grade level (e.g., 10)' },
      { placeholder: '{SECTION}', description: 'Section (e.g., A)' },
      {
        placeholder: '{COUNTER:n}',
        description: 'Sequential counter with n digits padding',
      },
      {
        placeholder: '{COUNTER}',
        description: 'Sequential counter without padding',
      },
    ];
  }

  // Validate format string
  validateFormat(format) {
    const errors = [];

    if (!format || format.trim() === '') {
      errors.push('Format is required');
      return errors;
    }

    // Check for valid placeholders
    const validPlaceholders = ['{YEAR}', '{GRADE}', '{SECTION}'];
    const counterPattern = /\{COUNTER(?::\d+)?\}/g;

    // Remove valid placeholders and counter patterns
    let cleanFormat = format;
    validPlaceholders.forEach((placeholder) => {
      cleanFormat = cleanFormat.replaceAll(placeholder, '');
    });
    cleanFormat = cleanFormat.replace(counterPattern, '');

    // Check for invalid placeholders (anything remaining in curly braces)
    const invalidPlaceholders = cleanFormat.match(/\{[^}]*\}/g);
    if (invalidPlaceholders) {
      errors.push(`Invalid placeholders: ${invalidPlaceholders.join(', ')}`);
    }

    // Check if counter is present
    if (!format.includes('{COUNTER')) {
      errors.push('Format must include a {COUNTER} or {COUNTER:n} placeholder');
    }

    return errors;
  }

  // Generate sample ID
  generateSampleId(format, options = {}) {
    const {
      year = new Date().getFullYear(),
      grade = '10',
      section = 'A',
      counter = 1,
    } = options;

    let sampleId = format;

    // Replace placeholders
    sampleId = sampleId.replace('{YEAR}', year.toString());
    sampleId = sampleId.replace('{GRADE}', grade);
    sampleId = sampleId.replace('{SECTION}', section);

    // Handle counter with padding
    const counterMatch = sampleId.match(/\{COUNTER:(\d+)\}/);
    if (counterMatch) {
      const padding = parseInt(counterMatch[1]);
      const paddedCounter = counter.toString().padStart(padding, '0');
      sampleId = sampleId.replace(/\{COUNTER:\d+\}/, paddedCounter);
    } else {
      sampleId = sampleId.replace('{COUNTER}', counter.toString());
    }

    return sampleId;
  }

  // Create default configuration templates
  createDefaultConfigurations() {
    return [
      {
        idType: 'STUDENT_ID',
        prefix: 'STU',
        length: 12,
        currentCounter: 0,
        separator: '-',
        includeYear: true,
        includeGradeSection: true,
        format: 'STU-{YEAR}-{GRADE}-{SECTION}-{COUNTER:4}',
        description: 'Student ID format: STU-2024-10-A-0001',
        active: true,
      },
      {
        idType: 'ADMISSION_NUMBER',
        prefix: 'ADM',
        length: 10,
        currentCounter: 0,
        separator: '',
        includeYear: true,
        includeGradeSection: false,
        format: 'ADM{YEAR}{COUNTER:5}',
        description: 'Admission Number format: ADM20240001',
        active: true,
      },
      {
        idType: 'ROLL_NUMBER',
        prefix: '',
        length: 3,
        currentCounter: 0,
        separator: '',
        includeYear: false,
        includeGradeSection: false,
        format: '{COUNTER:3}',
        description: 'Roll Number format: 001, 002, 003...',
        active: true,
      },
      {
        idType: 'EMPLOYEE_ID',
        prefix: 'EMP',
        length: 8,
        currentCounter: 0,
        separator: '',
        includeYear: true,
        includeGradeSection: false,
        format: 'EMP{YEAR}{COUNTER:3}',
        description: 'Employee ID format: EMP2024001',
        active: true,
      },
    ];
  }
}

export default new IDConfigurationService();
