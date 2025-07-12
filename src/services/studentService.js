import apiClient from '../config/api.js'
import demoDataService from './demoDataService.js'

class StudentService {
  // Get all students
  async getAllStudents() {
    // Check demo mode FIRST - don't hit backend if in demo mode
    if (demoDataService.isDemoMode()) {
      console.log('🎭 Demo mode: Using demo student data')
      return await demoDataService.getStudents()
    }

    try {
      const response = await apiClient.get('/students')
      return response.data
    } catch (error) {
      // Fallback to demo data on backend error
      console.log('🎭 Backend error: Falling back to demo student data')
      return await demoDataService.getStudents()
    }
  }

  // Get student by ID
  async getStudentById(id) {
    try {
      const response = await apiClient.get(`/students/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student')
    }
  }

  // Get student by student ID
  async getStudentByStudentId(studentId) {
    try {
      const response = await apiClient.get(`/students/student-id/${studentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student')
    }
  }

  // Get student by email
  async getStudentByEmail(email) {
    try {
      const response = await apiClient.get(`/students/email/${email}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch student')
    }
  }

  // Get students by grade
  async getStudentsByGrade(grade) {
    try {
      const response = await apiClient.get(`/students/grade/${grade}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch students')
    }
  }

  // Get students by grade and section
  async getStudentsByGradeAndSection(grade, section) {
    try {
      const response = await apiClient.get(`/students/grade/${grade}/section/${section}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch students')
    }
  }

  // Search students by name
  async searchStudentsByName(name, page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/students/search`, {
        params: { name, page, size }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search students')
    }
  }

  // Get at-risk students
  async getAtRiskStudents(riskThreshold = 70.0) {
    try {
      const response = await apiClient.get('/students/at-risk', {
        params: { riskThreshold }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch at-risk students')
    }
  }

  // Get students by performance trend
  async getStudentsByPerformanceTrend(trend) {
    try {
      const response = await apiClient.get(`/students/performance-trend/${trend}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch students')
    }
  }

  // Create new student
  async createStudent(studentData) {
    try {
      const response = await apiClient.post('/students', studentData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create student')
    }
  }

  // Update student
  async updateStudent(id, studentData) {
    try {
      const response = await apiClient.put(`/students/${id}`, studentData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update student')
    }
  }

  // Delete student
  async deleteStudent(id) {
    try {
      await apiClient.delete(`/students/${id}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete student')
    }
  }

  // Update student AI insights
  async updateStudentAIInsights(studentId, insights) {
    try {
      const response = await apiClient.put(`/students/${studentId}/ai-insights`, insights)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update AI insights')
    }
  }

  // Get student count by grade
  async getStudentCountByGrade(grade) {
    try {
      const response = await apiClient.get(`/students/count/grade/${grade}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get student count')
    }
  }

  // Get student count by status
  async getStudentCountByStatus(status) {
    try {
      const response = await apiClient.get(`/students/count/status/${status}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get student count')
    }
  }

  // Student Dashboard Methods

  // Get current student's dashboard data
  async getStudentDashboard(studentId) {
    try {
      const [student, courses, grades, attendance] = await Promise.all([
        this.getStudentByStudentId(studentId),
        this.getStudentCourses(studentId),
        this.getStudentGrades(studentId),
        this.getStudentAttendance(studentId)
      ])

      return {
        student,
        courses,
        grades,
        attendance,
        statistics: this.calculateStudentStatistics(student, courses, grades, attendance)
      }
    } catch (error) {
      throw new Error('Failed to load student dashboard data')
    }
  }

  // Get student's enrolled courses
  async getStudentCourses(studentId) {
    try {
      // Import courseService dynamically to avoid circular dependency
      const courseService = (await import('./courseService.js')).default
      const allCourses = await courseService.getAllCourses()

      return allCourses.filter(course =>
        course.enrolledStudents &&
        course.enrolledStudents.some(student => student.studentId === studentId)
      )
    } catch (error) {
      throw new Error('Failed to fetch student courses')
    }
  }

  // Get student's grades
  async getStudentGrades(studentId) {
    try {
      const gradeService = (await import('./gradeService.js')).default
      return await gradeService.getGradesByStudent(studentId)
    } catch (error) {
      throw new Error('Failed to fetch student grades')
    }
  }

  // Get student's attendance records
  async getStudentAttendance(studentId) {
    try {
      const attendanceService = (await import('./attendanceService.js')).default
      return await attendanceService.getAttendanceByStudentId(studentId)
    } catch (error) {
      throw new Error('Failed to fetch student attendance')
    }
  }

  // Get student's assignments
  async getStudentAssignments(studentId) {
    try {
      const courses = await this.getStudentCourses(studentId)
      const assignments = []

      for (const course of courses) {
        try {
          const courseAssignments = await apiClient.get(`/assignments/course/${course.courseCode}`)
          assignments.push(...courseAssignments.data.map(assignment => ({
            ...assignment,
            courseName: course.courseName
          })))
        } catch (error) {
          console.error(`Failed to fetch assignments for course ${course.courseCode}`)
        }
      }

      return assignments
    } catch (error) {
      throw new Error('Failed to fetch student assignments')
    }
  }

  // Get student performance analytics
  async getStudentPerformanceAnalytics(studentId) {
    try {
      const gradeService = (await import('./gradeService.js')).default
      return await gradeService.getStudentGradeAnalytics(studentId)
    } catch (error) {
      throw new Error('Failed to fetch student performance analytics')
    }
  }

  // Get upcoming assignments and deadlines
  async getUpcomingDeadlines(studentId) {
    try {
      const assignments = await this.getStudentAssignments(studentId)
      const now = new Date()

      return assignments
        .filter(assignment => {
          const dueDate = new Date(assignment.dueDate)
          return dueDate > now
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5) // Get next 5 upcoming deadlines
    } catch (error) {
      throw new Error('Failed to fetch upcoming deadlines')
    }
  }

  // Calculate student statistics
  calculateStudentStatistics(student, courses, grades, attendance) {
    const stats = {
      totalCourses: courses.length,
      currentGPA: student.currentGPA || 0,
      attendanceRate: student.attendanceRate || 0,
      totalGrades: grades.length,
      averageGrade: 0,
      completedAssignments: 0,
      pendingAssignments: 0,
      presentDays: 0,
      absentDays: 0,
      performanceTrend: 'stable'
    }

    // Calculate average grade
    if (grades.length > 0) {
      const totalPercentage = grades.reduce((sum, grade) => sum + (grade.percentage || 0), 0)
      stats.averageGrade = totalPercentage / grades.length

      // Count completed vs pending assignments
      stats.completedAssignments = grades.filter(g => g.status === 'GRADED' || g.status === 'PUBLISHED').length
      stats.pendingAssignments = grades.filter(g => g.status === 'PENDING').length
    }

    // Calculate attendance statistics
    if (attendance.length > 0) {
      stats.presentDays = attendance.filter(a => a.status === 'PRESENT').length
      stats.absentDays = attendance.filter(a => a.status === 'ABSENT').length
      stats.attendanceRate = (stats.presentDays / attendance.length) * 100
    }

    // Determine performance trend (simplified)
    if (stats.averageGrade >= 85) {
      stats.performanceTrend = 'excellent'
    } else if (stats.averageGrade >= 75) {
      stats.performanceTrend = 'good'
    } else if (stats.averageGrade >= 60) {
      stats.performanceTrend = 'average'
    } else {
      stats.performanceTrend = 'needs_improvement'
    }

    return stats
  }
}

export default new StudentService()
