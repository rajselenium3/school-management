import apiClient from '../config/api.js'

class GradeService {
  // Get all grades
  async getAllGrades() {
    try {
      const response = await apiClient.get('/grades')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch grades')
    }
  }

  // Get grade by ID
  async getGradeById(id) {
    try {
      const response = await apiClient.get(`/grades/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch grade')
    }
  }

  // Get grades by student ID
  async getGradesByStudent(studentId) {
    try {
      const response = await apiClient.get(`/grades/student/${studentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student grades')
    }
  }

  // Get grades by course code
  async getGradesByCourse(courseCode) {
    try {
      const response = await apiClient.get(`/grades/course/${courseCode}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course grades')
    }
  }

  // Get grades by assignment ID
  async getGradesByAssignment(assignmentId) {
    try {
      const response = await apiClient.get(`/grades/assignment/${assignmentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignment grades')
    }
  }

  // Get grades by student and course
  async getGradesByStudentAndCourse(studentId, courseCode) {
    try {
      const response = await apiClient.get(`/grades/student/${studentId}/course/${courseCode}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student course grades')
    }
  }

  // Get specific grade by student and assignment
  async getGradeByStudentAndAssignment(studentId, assignmentId) {
    try {
      const response = await apiClient.get(`/grades/student/${studentId}/assignment/${assignmentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch grade')
    }
  }

  // Get pending grades
  async getPendingGrades() {
    try {
      const response = await apiClient.get('/grades/pending')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending grades')
    }
  }

  // Get AI generated grades
  async getAIGeneratedGrades() {
    try {
      const response = await apiClient.get('/grades/ai-generated')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch AI grades')
    }
  }

  // Get high confidence AI grades
  async getHighConfidenceAIGrades(threshold = 0.8) {
    try {
      const response = await apiClient.get(`/grades/ai-confidence/${threshold}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch high confidence AI grades')
    }
  }

  // Create new grade
  async createGrade(gradeData) {
    try {
      const response = await apiClient.post('/grades', gradeData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create grade')
    }
  }

  // Update grade
  async updateGrade(id, gradeData) {
    try {
      const response = await apiClient.put(`/grades/${id}`, gradeData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update grade')
    }
  }

  // Delete grade
  async deleteGrade(id) {
    try {
      await apiClient.delete(`/grades/${id}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete grade')
    }
  }

  // Generate AI grade
  async generateAIGrade(id, aiScore, confidence, feedback) {
    try {
      const response = await apiClient.post(`/grades/${id}/ai-grade`, {}, {
        params: { aiScore, confidence, feedback }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate AI grade')
    }
  }

  // Review AI grade
  async reviewAIGrade(id, approved, reviewComments = '') {
    try {
      const response = await apiClient.put(`/grades/${id}/review-ai-grade`, {}, {
        params: { approved, reviewComments }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to review AI grade')
    }
  }

  // Batch AI grading
  async batchAIGrade(gradeIds) {
    try {
      const response = await apiClient.post('/grades/batch-ai-grade', gradeIds)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to perform batch AI grading')
    }
  }

  // Bulk create grades for assignment
  async bulkCreateGrades(assignmentId, courseCode, studentIds) {
    try {
      const response = await apiClient.post('/grades/bulk-create', studentIds, {
        params: { assignmentId, courseCode }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to bulk create grades')
    }
  }

  // Get course grade analytics
  async getCourseGradeAnalytics(courseCode) {
    try {
      const response = await apiClient.get(`/grades/analytics/course/${courseCode}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get course analytics')
    }
  }

  // Get student grade analytics
  async getStudentGradeAnalytics(studentId) {
    try {
      const response = await apiClient.get(`/grades/analytics/student/${studentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get student analytics')
    }
  }

  // Publish grade
  async publishGrade(id) {
    try {
      const response = await apiClient.put(`/grades/${id}/publish`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to publish grade')
    }
  }

  // Helper methods

  // Calculate letter grade from percentage
  calculateLetterGrade(percentage) {
    if (percentage >= 97) return 'A+'
    if (percentage >= 93) return 'A'
    if (percentage >= 90) return 'A-'
    if (percentage >= 87) return 'B+'
    if (percentage >= 83) return 'B'
    if (percentage >= 80) return 'B-'
    if (percentage >= 77) return 'C+'
    if (percentage >= 73) return 'C'
    if (percentage >= 70) return 'C-'
    if (percentage >= 67) return 'D+'
    if (percentage >= 63) return 'D'
    if (percentage >= 60) return 'D-'
    return 'F'
  }

  // Get letter grade color
  getLetterGradeColor(letterGrade) {
    switch (letterGrade) {
      case 'A+':
      case 'A':
      case 'A-':
        return '#4caf50'
      case 'B+':
      case 'B':
      case 'B-':
        return '#8bc34a'
      case 'C+':
      case 'C':
      case 'C-':
        return '#ff9800'
      case 'D+':
      case 'D':
      case 'D-':
        return '#ff5722'
      case 'F':
        return '#f44336'
      default:
        return '#757575'
    }
  }

  // Get grade status color
  getStatusColor(status) {
    switch (status) {
      case 'PUBLISHED':
        return '#4caf50'
      case 'GRADED':
        return '#2196f3'
      case 'PENDING':
        return '#ff9800'
      case 'DRAFT':
        return '#9e9e9e'
      default:
        return '#757575'
    }
  }

  // Format grade for display
  formatGrade(grade) {
    if (!grade) return 'N/A'
    return {
      score: grade.score ? grade.score.toFixed(1) : '0.0',
      percentage: grade.percentage ? grade.percentage.toFixed(1) + '%' : '0.0%',
      letterGrade: grade.letterGrade || 'N/A',
      status: grade.status || 'PENDING'
    }
  }

  // Get grade statistics
  async getGradeStatistics() {
    try {
      const [allGrades, pendingGrades, aiGrades] = await Promise.all([
        this.getAllGrades(),
        this.getPendingGrades(),
        this.getAIGeneratedGrades()
      ])

      return {
        total: allGrades.length,
        pending: pendingGrades.length,
        aiGenerated: aiGrades.length,
        graded: allGrades.filter(g => g.status === 'GRADED' || g.status === 'PUBLISHED').length
      }
    } catch (error) {
      throw new Error('Failed to get grade statistics')
    }
  }

  // Quick grade entry for teachers
  async quickGradeEntry(studentId, assignmentId, score, maxScore, feedback = '') {
    try {
      const percentage = (score / maxScore) * 100
      const letterGrade = this.calculateLetterGrade(percentage)

      const gradeData = {
        student: { studentId }, // Will be populated by backend
        assignment: { id: assignmentId }, // Will be populated by backend
        score,
        maxScore,
        percentage,
        letterGrade,
        feedback,
        status: 'GRADED'
      }

      return await this.createGrade(gradeData)
    } catch (error) {
      throw new Error('Failed to enter grade')
    }
  }
}

export default new GradeService()
