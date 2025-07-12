import apiClient from '../config/api.js'

class AttendanceService {
  // Get all attendance records
  async getAllAttendance() {
    try {
      const response = await apiClient.get('/attendance')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance records')
    }
  }

  // Get attendance by ID
  async getAttendanceById(id) {
    try {
      const response = await apiClient.get(`/attendance/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance record')
    }
  }

  // Get attendance by student ID
  async getAttendanceByStudentId(studentId) {
    try {
      const response = await apiClient.get(`/attendance/student/${studentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student attendance')
    }
  }

  // Get attendance by course ID
  async getAttendanceByCourseId(courseId) {
    try {
      const response = await apiClient.get(`/attendance/course/${courseId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course attendance')
    }
  }

  // Get attendance by date
  async getAttendanceByDate(date) {
    try {
      const response = await apiClient.get(`/attendance/date/${date}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance for date')
    }
  }

  // Get attendance by date range
  async getAttendanceByDateRange(startDate, endDate) {
    try {
      const response = await apiClient.get('/attendance/date-range', {
        params: { startDate, endDate }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance for date range')
    }
  }

  // Get student attendance by date range
  async getStudentAttendanceByDateRange(studentId, startDate, endDate) {
    try {
      const response = await apiClient.get(`/attendance/student/${studentId}/date-range`, {
        params: { startDate, endDate }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student attendance for date range')
    }
  }

  // Get attendance by course and date
  async getAttendanceByCourseAndDate(courseId, date) {
    try {
      const response = await apiClient.get(`/attendance/course/${courseId}/date/${date}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course attendance for date')
    }
  }

  // Get attendance by status
  async getAttendanceByStatus(status) {
    try {
      const response = await apiClient.get(`/attendance/status/${status}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance by status')
    }
  }

  // Create new attendance record
  async createAttendance(attendanceData) {
    try {
      const response = await apiClient.post('/attendance', attendanceData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create attendance record')
    }
  }

  // Create multiple attendance records
  async createBulkAttendance(attendanceList) {
    try {
      const response = await apiClient.post('/attendance/bulk', attendanceList)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create bulk attendance records')
    }
  }

  // Update attendance record
  async updateAttendance(id, attendanceData) {
    try {
      const response = await apiClient.put(`/attendance/${id}`, attendanceData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update attendance record')
    }
  }

  // Delete attendance record
  async deleteAttendance(id) {
    try {
      await apiClient.delete(`/attendance/${id}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete attendance record')
    }
  }

  // Get student attendance rate
  async getStudentAttendanceRate(studentId) {
    try {
      const response = await apiClient.get(`/attendance/student/${studentId}/rate`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get student attendance rate')
    }
  }

  // Get course attendance rate
  async getCourseAttendanceRate(courseId) {
    try {
      const response = await apiClient.get(`/attendance/course/${courseId}/rate`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get course attendance rate')
    }
  }

  // Get student attendance summary
  async getStudentAttendanceSummary(studentId) {
    try {
      const response = await apiClient.get(`/attendance/student/${studentId}/summary`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get student attendance summary')
    }
  }

  // Get course attendance summary
  async getCourseAttendanceSummary(courseId) {
    try {
      const response = await apiClient.get(`/attendance/course/${courseId}/summary`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get course attendance summary')
    }
  }

  // Get daily attendance report
  async getDailyAttendanceReport(date) {
    try {
      const response = await apiClient.get(`/attendance/daily-report/${date}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get daily attendance report')
    }
  }

  // Get monthly attendance report
  async getMonthlyAttendanceReport(year, month) {
    try {
      const response = await apiClient.get('/attendance/monthly-report', {
        params: { year, month }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get monthly attendance report')
    }
  }

  // Mark student as present
  async markStudentPresent(studentId, courseId, date = null) {
    try {
      const params = date ? { date } : {}
      const response = await apiClient.post(`/attendance/mark-present/${studentId}/${courseId}`, {}, {
        params
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark student as present')
    }
  }

  // Mark student as absent
  async markStudentAbsent(studentId, courseId, date = null) {
    try {
      const params = date ? { date } : {}
      const response = await apiClient.post(`/attendance/mark-absent/${studentId}/${courseId}`, {}, {
        params
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark student as absent')
    }
  }

  // Get attendance trends and analytics
  async getAttendanceTrends(options = {}) {
    try {
      const { studentId, courseId, startDate, endDate } = options
      const params = {}
      if (studentId) params.studentId = studentId
      if (courseId) params.courseId = courseId
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const response = await apiClient.get('/attendance/analytics/trends', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get attendance trends')
    }
  }

  // Helper methods for common attendance operations

  // Get today's attendance for a course
  async getTodaysAttendance(courseId) {
    const today = new Date().toISOString().split('T')[0]
    return this.getAttendanceByCourseAndDate(courseId, today)
  }

  // Mark multiple students attendance for a course
  async markCourseAttendance(courseId, attendanceData) {
    try {
      const attendanceRecords = attendanceData.map(data => ({
        student: data.student,
        course: data.course,
        date: data.date || new Date().toISOString().split('T')[0],
        status: data.status,
        markedAt: new Date().toISOString(),
        notes: data.notes || ''
      }))

      return await this.createBulkAttendance(attendanceRecords)
    } catch (error) {
      throw new Error('Failed to mark course attendance')
    }
  }

  // Get attendance statistics for dashboard
  async getAttendanceStatistics() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const thisMonth = new Date().getMonth() + 1
      const thisYear = new Date().getFullYear()

      const [todayReport, monthlyReport] = await Promise.all([
        this.getDailyAttendanceReport(today),
        this.getMonthlyAttendanceReport(thisYear, thisMonth)
      ])

      return {
        daily: todayReport,
        monthly: monthlyReport,
        today: today,
        month: thisMonth,
        year: thisYear
      }
    } catch (error) {
      throw new Error('Failed to get attendance statistics')
    }
  }

  // Quick attendance marking (for teacher interface)
  async quickMarkAttendance(studentId, courseId, status, notes = '') {
    try {
      const attendanceData = {
        student: { studentId }, // Will be populated by backend
        course: { courseCode: courseId }, // Will be populated by backend
        date: new Date().toISOString().split('T')[0],
        status: status.toUpperCase(),
        markedAt: new Date().toISOString(),
        notes: notes
      }

      return await this.createAttendance(attendanceData)
    } catch (error) {
      throw new Error('Failed to mark attendance')
    }
  }

  // Get student attendance percentage
  async getStudentAttendancePercentage(studentId, startDate = null, endDate = null) {
    try {
      if (startDate && endDate) {
        const attendance = await this.getStudentAttendanceByDateRange(studentId, startDate, endDate)
        const totalSessions = attendance.length
        const presentSessions = attendance.filter(a => a.status === 'PRESENT').length
        return totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0
      } else {
        return await this.getStudentAttendanceRate(studentId)
      }
    } catch (error) {
      throw new Error('Failed to calculate attendance percentage')
    }
  }

  // Get absent students for today
  async getTodaysAbsentStudents() {
    try {
      const today = new Date().toISOString().split('T')[0]
      return await this.getAttendanceByStatus('ABSENT').then(records =>
        records.filter(record => record.date === today)
      )
    } catch (error) {
      throw new Error('Failed to get today\'s absent students')
    }
  }
}

export default new AttendanceService()
