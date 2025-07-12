import apiClient from '../config/api.js'

class AssignmentService {
  // ====================
  // ASSIGNMENT MANAGEMENT APIs
  // ====================

  // Get all assignments
  async getAllAssignments() {
    // Check demo mode FIRST - don't hit backend if in demo mode
    if (this.isDemoMode()) {
      console.log('🎭 Demo mode: Using demo assignment data')
      const demoDataService = await import('./demoDataService.js')
      return await demoDataService.default.getAssignments()
    }

    try {
      const response = await apiClient.get('/assignments')
      return response.data
    } catch (error) {
      // Fallback to demo data on backend error
      console.log('🎭 Backend error: Falling back to demo assignment data')
      const demoDataService = await import('./demoDataService.js')
      return await demoDataService.default.getAssignments()
    }
  }

  // Get assignment by ID
  async getAssignmentById(id) {
    try {
      const response = await apiClient.get(`/assignments/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignment')
    }
  }

  // Get assignments by course code
  async getAssignmentsByCourseCode(courseCode) {
    try {
      const response = await apiClient.get(`/assignments/course/${courseCode}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments by course')
    }
  }

  // Get assignments by teacher
  async getAssignmentsByTeacher(teacherId) {
    try {
      const response = await apiClient.get(`/assignments/teacher/${teacherId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teacher assignments')
    }
  }

  // Get assignments by type
  async getAssignmentsByType(type) {
    try {
      const response = await apiClient.get(`/assignments/type/${type}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments by type')
    }
  }

  // Search assignments
  async searchAssignments(searchTerm) {
    try {
      const response = await apiClient.get('/assignments/search', {
        params: { searchTerm }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search assignments')
    }
  }

  // Get assignments due soon
  async getAssignmentsDueSoon(days = 7) {
    try {
      const response = await apiClient.get('/assignments/due-soon', {
        params: { days }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments due soon')
    }
  }

  // Get overdue assignments
  async getOverdueAssignments() {
    try {
      const response = await apiClient.get('/assignments/overdue')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch overdue assignments')
    }
  }

  // Get assignments pending grading
  async getAssignmentsPendingGrading() {
    try {
      const response = await apiClient.get('/assignments/pending-grading')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments pending grading')
    }
  }

  // Get AI grading enabled assignments
  async getAIGradingEnabledAssignments() {
    try {
      const response = await apiClient.get('/assignments/ai-grading-enabled')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch AI grading enabled assignments')
    }
  }

  // Get assignments by date range
  async getAssignmentsByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get('/assignments/date-range', {
        params: { startDate, endDate }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments by date range')
    }
  }

  // Get recent assignments
  async getRecentAssignments(days = 30) {
    try {
      const response = await apiClient.get('/assignments/recent', {
        params: { days }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recent assignments')
    }
  }

  // Get assignments requiring attention
  async getAssignmentsRequiringAttention() {
    try {
      const response = await apiClient.get('/assignments/requiring-attention')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments requiring attention')
    }
  }

  // Create assignment
  async createAssignment(assignmentData) {
    try {
      const response = await apiClient.post('/assignments', assignmentData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create assignment')
    }
  }

  // Update assignment
  async updateAssignment(id, assignmentData) {
    try {
      const response = await apiClient.put(`/assignments/${id}`, assignmentData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update assignment')
    }
  }

  // Delete assignment
  async deleteAssignment(id) {
    try {
      await apiClient.delete(`/assignments/${id}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete assignment')
    }
  }

  // Duplicate assignment
  async duplicateAssignment(id, newTitle) {
    try {
      const response = await apiClient.post(`/assignments/${id}/duplicate`, {}, {
        params: { newTitle }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to duplicate assignment')
    }
  }

  // Bulk create assignments
  async bulkCreateAssignments(assignments) {
    try {
      const response = await apiClient.post('/assignments/bulk', assignments)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create bulk assignments')
    }
  }

  // Advanced search
  async searchAssignmentsByCriteria(titleSearch, types, courseCodes) {
    try {
      const response = await apiClient.get('/assignments/search-advanced', {
        params: { titleSearch, types, courseCodes }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search assignments')
    }
  }

  // Get assignment statistics
  async getAssignmentStatistics() {
    // Check demo mode FIRST - don't hit backend if in demo mode
    if (this.isDemoMode()) {
      console.log('🎭 Demo mode: Using demo assignment statistics')
      const demoDataService = await import('./demoDataService.js')
      return await demoDataService.default.getAssignmentStatistics()
    }

    try {
      const response = await apiClient.get('/assignments/statistics')
      return response.data
    } catch (error) {
      // Fallback to demo data on backend error
      console.log('🎭 Backend error: Falling back to demo assignment statistics')
      const demoDataService = await import('./demoDataService.js')
      return await demoDataService.default.getAssignmentStatistics()
    }
  }

  // Helper method to check if we're in demo mode
  isDemoMode() {
    const token = localStorage.getItem('authToken')
    return token && token.startsWith('demo-jwt-')
  }

  // Get teacher analytics
  async getTeacherAssignmentAnalytics(teacherId) {
    try {
      const response = await apiClient.get(`/assignments/teacher/${teacherId}/analytics`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teacher analytics')
    }
  }

  // Get course analytics
  async getCourseAssignmentAnalytics(courseId) {
    try {
      const response = await apiClient.get(`/assignments/course/${courseId}/analytics`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course analytics')
    }
  }

  // Get dashboard statistics
  async getDashboardStatistics() {
    try {
      const response = await apiClient.get('/assignments/dashboard-stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics')
    }
  }

  // ====================
  // SUBMISSION MANAGEMENT APIs
  // ====================

  // Get all submissions
  async getAllSubmissions() {
    try {
      const response = await apiClient.get('/submissions')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submissions')
    }
  }

  // Get submission by ID
  async getSubmissionById(id) {
    try {
      const response = await apiClient.get(`/submissions/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submission')
    }
  }

  // Get submissions by assignment
  async getSubmissionsByAssignment(assignmentId) {
    try {
      const response = await apiClient.get(`/submissions/assignment/${assignmentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submissions by assignment')
    }
  }

  // Get submissions by student
  async getSubmissionsByStudent(studentId) {
    // Check demo mode FIRST
    if (this.isDemoMode()) {
      console.log('🎭 Demo mode: Getting demo submissions for student:', studentId)

      // Get submissions from localStorage
      const existingSubmissions = JSON.parse(localStorage.getItem('demoSubmissions') || '[]')
      const studentSubmissions = existingSubmissions.filter(s =>
        s.student?.studentId === studentId || s.student?.id === studentId
      )

      return studentSubmissions
    }

    try {
      const response = await apiClient.get(`/submissions/student/${studentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submissions by student')
    }
  }

  // Get submission by assignment and student
  async getSubmissionByAssignmentAndStudent(assignmentId, studentId) {
    // Check demo mode FIRST
    if (this.isDemoMode()) {
      console.log('🎭 Demo mode: Getting demo submission for assignment:', assignmentId, 'student:', studentId)

      // Get submission from localStorage
      const existingSubmissions = JSON.parse(localStorage.getItem('demoSubmissions') || '[]')
      const submission = existingSubmissions.find(s =>
        (s.assignment?.id === assignmentId || s.assignment === assignmentId) &&
        (s.student?.studentId === studentId || s.student?.id === studentId)
      )

      return submission || null
    }

    try {
      const response = await apiClient.get(`/submissions/assignment/${assignmentId}/student/${studentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submission')
    }
  }

  // Create submission
  async createSubmission(assignmentId, studentId, textContent, attachments = []) {
    // Check demo mode FIRST
    if (this.isDemoMode()) {
      console.log('🎭 Demo mode: Creating demo submission')
      // Create a mock submission
      const mockSubmission = {
        id: `sub-${Date.now()}`,
        assignment: { id: assignmentId },
        student: { id: studentId, studentId },
        textContent,
        attachments: attachments || [],
        status: 'DRAFT',
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }

      // Store in localStorage for demo persistence
      const existingSubmissions = JSON.parse(localStorage.getItem('demoSubmissions') || '[]')
      existingSubmissions.push(mockSubmission)
      localStorage.setItem('demoSubmissions', JSON.stringify(existingSubmissions))

      return mockSubmission
    }

    try {
      const response = await apiClient.post('/submissions/create', {}, {
        params: { assignmentId, studentId, textContent, attachments }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create submission')
    }
  }

  // Submit assignment
  async submitAssignment(submissionId) {
    // Check demo mode FIRST
    if (this.isDemoMode()) {
      console.log('🎭 Demo mode: Submitting demo assignment')

      // Update the submission status in localStorage
      const existingSubmissions = JSON.parse(localStorage.getItem('demoSubmissions') || '[]')
      const submissionIndex = existingSubmissions.findIndex(s => s.id === submissionId)

      if (submissionIndex !== -1) {
        existingSubmissions[submissionIndex].status = 'SUBMITTED'
        existingSubmissions[submissionIndex].submittedAt = new Date().toISOString()
        localStorage.setItem('demoSubmissions', JSON.stringify(existingSubmissions))
        return existingSubmissions[submissionIndex]
      } else {
        // Create a mock submitted submission
        const mockSubmission = {
          id: submissionId,
          status: 'SUBMITTED',
          submittedAt: new Date().toISOString(),
          score: null,
          feedback: null
        }
        existingSubmissions.push(mockSubmission)
        localStorage.setItem('demoSubmissions', JSON.stringify(existingSubmissions))
        return mockSubmission
      }
    }

    try {
      const response = await apiClient.post(`/submissions/${submissionId}/submit`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit assignment')
    }
  }

  // Update submission content
  async updateSubmissionContent(submissionId, textContent, attachments = []) {
    // Check demo mode FIRST
    if (this.isDemoMode()) {
      console.log('🎭 Demo mode: Updating demo submission content')

      // Update the submission in localStorage
      const existingSubmissions = JSON.parse(localStorage.getItem('demoSubmissions') || '[]')
      const submissionIndex = existingSubmissions.findIndex(s => s.id === submissionId)

      if (submissionIndex !== -1) {
        existingSubmissions[submissionIndex].textContent = textContent
        existingSubmissions[submissionIndex].attachments = attachments
        existingSubmissions[submissionIndex].lastModifiedAt = new Date().toISOString()
        localStorage.setItem('demoSubmissions', JSON.stringify(existingSubmissions))
        return existingSubmissions[submissionIndex]
      } else {
        throw new Error('Submission not found in demo mode')
      }
    }

    try {
      const response = await apiClient.put(`/submissions/${submissionId}/content`, {}, {
        params: { textContent, attachments }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update submission')
    }
  }

  // Perform AI grading
  async performAIGrading(submissionId) {
    try {
      const response = await apiClient.post(`/submissions/${submissionId}/ai-grade`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to perform AI grading')
    }
  }

  // Review AI grading
  async reviewAIGrading(submissionId, approved, humanComments, humanScore = null) {
    try {
      const response = await apiClient.post(`/submissions/${submissionId}/review-ai-grading`, {}, {
        params: { approved, humanComments, humanScore }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to review AI grading')
    }
  }

  // Grade submission manually
  async gradeSubmission(submissionId, score, feedback = '') {
    try {
      const response = await apiClient.post(`/submissions/${submissionId}/grade`, {}, {
        params: { score, feedback }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to grade submission')
    }
  }

  // Perform plagiarism check
  async performPlagiarismCheck(submissionId) {
    try {
      const response = await apiClient.post(`/submissions/${submissionId}/plagiarism-check`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to perform plagiarism check')
    }
  }

  // Get submission statistics
  async getSubmissionStatistics() {
    try {
      const response = await apiClient.get('/submissions/statistics')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch submission statistics')
    }
  }

  // Bulk AI grading
  async bulkAIGrading(submissionIds) {
    try {
      const response = await apiClient.post('/submissions/bulk-ai-grade', submissionIds)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to perform bulk AI grading')
    }
  }

  // Bulk plagiarism check
  async bulkPlagiarismCheck(submissionIds) {
    try {
      const response = await apiClient.post('/submissions/bulk-plagiarism-check', submissionIds)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to perform bulk plagiarism check')
    }
  }

  // ====================
  // HELPER METHODS
  // ====================

  // Get assignment types
  getAssignmentTypes() {
    return ['HOMEWORK', 'QUIZ', 'TEST', 'PROJECT', 'PARTICIPATION']
  }

  // Get submission statuses
  getSubmissionStatuses() {
    return ['DRAFT', 'SUBMITTED', 'LATE', 'GRADED', 'RETURNED']
  }

  // Create assignment template
  createAssignmentTemplate() {
    return {
      title: '',
      description: '',
      course: null,
      type: 'HOMEWORK',
      maxScore: 100,
      weight: 1.0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // 1 week from now
      submissionStartDate: new Date().toISOString().slice(0, 16),
      aiGradingEnabled: true,
      instructions: '',
      attachments: [],
      rubric: []
    }
  }

  // Format assignment for display
  formatAssignment(assignment) {
    const now = new Date()
    const dueDate = new Date(assignment.dueDate)
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24))

    let urgency, statusColor
    if (daysDiff < 0) {
      urgency = 'Overdue'
      statusColor = '#f44336'
    } else if (daysDiff === 0) {
      urgency = 'Due Today'
      statusColor = '#ff5722'
    } else if (daysDiff <= 3) {
      urgency = 'Due Soon'
      statusColor = '#ff9800'
    } else if (daysDiff <= 7) {
      urgency = 'This Week'
      statusColor = '#ffc107'
    } else {
      urgency = 'Upcoming'
      statusColor = '#4caf50'
    }

    const submissionRate = assignment.course?.enrolledStudents?.length > 0
      ? ((assignment.submissions || 0) / assignment.course.enrolledStudents.length * 100).toFixed(0)
      : 0

    const gradingProgress = assignment.submissions > 0
      ? ((assignment.graded || 0) / assignment.submissions * 100).toFixed(0)
      : 0

    return {
      ...assignment,
      formattedDueDate: dueDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      urgency,
      statusColor,
      submissionRate,
      gradingProgress
    }
  }

  // Calculate assignment difficulty
  calculateDifficulty(averageScore) {
    if (averageScore >= 85) return 'Easy'
    if (averageScore >= 70) return 'Moderate'
    if (averageScore >= 60) return 'Hard'
    return 'Very Hard'
  }

  // Get status color for submissions
  getSubmissionStatusColor(status) {
    const statusColors = {
      'DRAFT': '#9e9e9e',
      'SUBMITTED': '#2196f3',
      'LATE': '#ff9800',
      'GRADED': '#4caf50',
      'RETURNED': '#673ab7'
    }
    return statusColors[status] || '#757575'
  }

  // Get AI confidence level
  getAIConfidenceLevel(confidence) {
    if (confidence >= 0.9) return 'Very High'
    if (confidence >= 0.8) return 'High'
    if (confidence >= 0.7) return 'Medium'
    if (confidence >= 0.6) return 'Low'
    return 'Very Low'
  }

  // Get plagiarism risk level
  getPlagiarismRiskLevel(similarityScore) {
    if (similarityScore >= 80) return 'Very High'
    if (similarityScore >= 60) return 'High'
    if (similarityScore >= 40) return 'Medium'
    if (similarityScore >= 20) return 'Low'
    return 'Very Low'
  }

  // Validate assignment data
  validateAssignment(assignment) {
    const errors = []

    if (!assignment.title || assignment.title.trim().length === 0) {
      errors.push('Title is required')
    }

    if (!assignment.course) {
      errors.push('Course is required')
    }

    if (!assignment.dueDate) {
      errors.push('Due date is required')
    } else if (new Date(assignment.dueDate) <= new Date()) {
      errors.push('Due date must be in the future')
    }

    if (!assignment.maxScore || assignment.maxScore <= 0) {
      errors.push('Max score must be a positive number')
    }

    if (assignment.weight < 0) {
      errors.push('Weight cannot be negative')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Validate submission data
  validateSubmission(submission) {
    const errors = []

    if (!submission.textContent || submission.textContent.trim().length === 0) {
      errors.push('Content is required')
    }

    if (!submission.assignment) {
      errors.push('Assignment is required')
    }

    if (!submission.student) {
      errors.push('Student is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get time remaining for assignment
  getTimeRemaining(dueDate) {
    const now = new Date()
    const due = new Date(dueDate)
    const diff = due.getTime() - now.getTime()

    if (diff <= 0) {
      return 'Overdue'
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} remaining`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} remaining`
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`
    }
  }
}

export default new AssignmentService()
