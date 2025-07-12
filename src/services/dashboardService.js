import apiClient from '../config/api.js'
import studentService from './studentService.js'
import teacherService from './teacherService.js'
import courseService from './courseService.js'
import assignmentService from './assignmentService.js'

class DashboardService {
  // ====================
  // ADMIN DASHBOARD
  // ====================

  async getAdminDashboardStats() {
    // Check demo mode FIRST - don't hit backend if in demo mode
    const token = localStorage.getItem('authToken')
    const isDemoMode = token && token.startsWith('demo-jwt-')

    if (isDemoMode) {
      console.log('🎭 Demo mode: Using demo dashboard data')
      const demoDataService = await import('./demoDataService.js')
      return await demoDataService.default.getDashboardStats()
    }

    try {

      const [
        students,
        teachers,
        courses,
        assignmentStats,
        attendanceStats
      ] = await Promise.all([
        this.getStudentStats(),
        this.getTeacherStats(),
        this.getCourseStats(),
        this.getAssignmentStats(),
        this.getAttendanceStats()
      ])

      return {
        students,
        teachers,
        courses,
        assignments: assignmentStats,
        attendance: attendanceStats,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error)
      // Fallback to demo data on backend error
      console.log('🎭 Backend error: Falling back to demo dashboard data')
      const demoDataService = await import('./demoDataService.js')
      return await demoDataService.default.getDashboardStats()
    }
  }

  async getStudentStats() {
    try {
      const students = await studentService.getAllStudents()
      const activeStudents = students.filter(s => s.status === 'ACTIVE').length
      const totalStudents = students.length

      return {
        total: totalStudents,
        active: activeStudents,
        newThisMonth: Math.floor(totalStudents * 0.05), // Demo calculation
        growthRate: '+5.2%', // Demo data
        departments: this.groupByDepartment(students)
      }
    } catch (error) {
      return {
        total: 0,
        active: 0,
        newThisMonth: 0,
        growthRate: '0%',
        departments: {}
      }
    }
  }

  async getTeacherStats() {
    try {
      const teachers = await teacherService.getAllTeachers()
      const activeTeachers = teachers.filter(t => t.status === 'ACTIVE').length

      return {
        total: teachers.length,
        active: activeTeachers,
        newThisMonth: Math.floor(teachers.length * 0.02), // Demo calculation
        departments: this.groupByDepartment(teachers)
      }
    } catch (error) {
      return {
        total: 0,
        active: 0,
        newThisMonth: 0,
        departments: {}
      }
    }
  }

  async getCourseStats() {
    try {
      const courses = await courseService.getAllCourses()
      const activeCourses = courses.filter(c => c.status === 'ACTIVE').length

      return {
        total: courses.length,
        active: activeCourses,
        departments: this.groupByDepartment(courses),
        averageEnrollment: this.calculateAverageEnrollment(courses)
      }
    } catch (error) {
      return {
        total: 0,
        active: 0,
        departments: {},
        averageEnrollment: 0
      }
    }
  }

  async getAssignmentStats() {
    try {
      const stats = await assignmentService.getDashboardStatistics()
      return {
        total: stats.totalAssignments || 0,
        thisWeekDue: stats.thisWeekDue || 0,
        overdue: stats.overdueAssignments || 0,
        pendingGrading: stats.pendingGrading || 0,
        aiGradingRate: stats.aiGradingRate || 0
      }
    } catch (error) {
      return {
        total: 0,
        thisWeekDue: 0,
        overdue: 0,
        pendingGrading: 0,
        aiGradingRate: 0
      }
    }
  }

  async getAttendanceStats() {
    try {
      // This would come from attendance service in real implementation
      return {
        averageRate: 94.5,
        thisWeek: 96.2,
        lastWeek: 93.8,
        trend: 'up',
        totalSessions: 1250,
        totalPresent: 1181
      }
    } catch (error) {
      return {
        averageRate: 0,
        thisWeek: 0,
        lastWeek: 0,
        trend: 'stable',
        totalSessions: 0,
        totalPresent: 0
      }
    }
  }

  // ====================
  // TEACHER DASHBOARD
  // ====================

  async getTeacherDashboardStats(teacherId) {
    try {
      const [
        myCourses,
        myAssignments,
        myStudents,
        gradingQueue
      ] = await Promise.all([
        this.getTeacherCourses(teacherId),
        this.getTeacherAssignments(teacherId),
        this.getTeacherStudents(teacherId),
        this.getGradingQueue(teacherId)
      ])

      return {
        courses: myCourses,
        assignments: myAssignments,
        students: myStudents,
        grading: gradingQueue,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching teacher dashboard stats:', error)
      throw new Error('Failed to load teacher dashboard statistics')
    }
  }

  async getTeacherCourses(teacherId) {
    try {
      const courses = await courseService.getAllCourses()
      const teacherCourses = courses.filter(c => c.teacher?.teacherId === teacherId)

      return {
        total: teacherCourses.length,
        active: teacherCourses.filter(c => c.status === 'ACTIVE').length,
        totalStudents: teacherCourses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0)
      }
    } catch (error) {
      return { total: 0, active: 0, totalStudents: 0 }
    }
  }

  async getTeacherAssignments(teacherId) {
    try {
      const analytics = await assignmentService.getTeacherAssignmentAnalytics(teacherId)
      return {
        total: analytics.totalAssignments || 0,
        pendingGrading: analytics.pendingGrading || 0,
        averageScore: analytics.averageScore || 0,
        submissionRate: analytics.submissionRate || 0
      }
    } catch (error) {
      return { total: 0, pendingGrading: 0, averageScore: 0, submissionRate: 0 }
    }
  }

  async getTeacherStudents(teacherId) {
    try {
      // In real implementation, would fetch students for teacher's courses
      return {
        total: 125,
        active: 122,
        atRisk: 8
      }
    } catch (error) {
      return { total: 0, active: 0, atRisk: 0 }
    }
  }

  async getGradingQueue(teacherId) {
    try {
      // In real implementation, would fetch pending submissions for teacher
      return {
        pending: 15,
        urgent: 3,
        aiGraded: 8
      }
    } catch (error) {
      return { pending: 0, urgent: 0, aiGraded: 0 }
    }
  }

  // ====================
  // STUDENT DASHBOARD
  // ====================

  async getStudentDashboardStats(studentId) {
    try {
      const [
        myCourses,
        myAssignments,
        myGrades,
        upcomingDeadlines
      ] = await Promise.all([
        this.getStudentCourses(studentId),
        this.getStudentAssignments(studentId),
        this.getStudentGrades(studentId),
        this.getUpcomingDeadlines(studentId)
      ])

      return {
        courses: myCourses,
        assignments: myAssignments,
        grades: myGrades,
        deadlines: upcomingDeadlines,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error fetching student dashboard stats:', error)
      throw new Error('Failed to load student dashboard statistics')
    }
  }

  async getStudentCourses(studentId) {
    try {
      const courses = await courseService.getAllCourses()
      const enrolledCourses = courses.filter(c =>
        c.enrolledStudents?.some(s => s.studentId === studentId)
      )

      return {
        total: enrolledCourses.length,
        active: enrolledCourses.filter(c => c.status === 'ACTIVE').length,
        completed: enrolledCourses.filter(c => c.status === 'COMPLETED').length
      }
    } catch (error) {
      return { total: 0, active: 0, completed: 0 }
    }
  }

  async getStudentAssignments(studentId) {
    try {
      // In real implementation, would fetch assignments for student's courses
      return {
        total: 45,
        submitted: 38,
        graded: 35,
        overdue: 2,
        upcoming: 7
      }
    } catch (error) {
      return { total: 0, submitted: 0, graded: 0, overdue: 0, upcoming: 0 }
    }
  }

  async getStudentGrades(studentId) {
    try {
      // In real implementation, would fetch student's actual grades
      return {
        gpa: 3.42,
        averageScore: 85.5,
        letterGrade: 'B+',
        improvementTrend: 'up'
      }
    } catch (error) {
      return { gpa: 0, averageScore: 0, letterGrade: 'N/A', improvementTrend: 'stable' }
    }
  }

  async getUpcomingDeadlines(studentId) {
    try {
      const assignments = await assignmentService.getAssignmentsDueSoon(7)
      return assignments.slice(0, 5) // Top 5 upcoming deadlines
    } catch (error) {
      return []
    }
  }

  // ====================
  // SYSTEM HEALTH
  // ====================

  async getSystemHealth() {
    try {
      return {
        database: 'healthy',
        apiResponse: 'good',
        lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        uptime: '99.8%',
        activeUsers: 1240,
        memoryUsage: 65,
        diskUsage: 45
      }
    } catch (error) {
      return {
        database: 'unknown',
        apiResponse: 'unknown',
        lastBackup: null,
        uptime: '0%',
        activeUsers: 0,
        memoryUsage: 0,
        diskUsage: 0
      }
    }
  }

  // ====================
  // UTILITY METHODS
  // ====================

  groupByDepartment(items) {
    return items.reduce((acc, item) => {
      const dept = item.department || 'UNKNOWN'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {})
  }

  calculateAverageEnrollment(courses) {
    if (courses.length === 0) return 0
    const totalEnrollment = courses.reduce((sum, course) =>
      sum + (course.enrolledStudents?.length || 0), 0)
    return Math.round(totalEnrollment / courses.length)
  }

  formatGrowthRate(current, previous) {
    if (previous === 0) return '+0%'
    const growth = ((current - previous) / previous) * 100
    const sign = growth >= 0 ? '+' : ''
    return `${sign}${growth.toFixed(1)}%`
  }

  // Cache management
  clearCache() {
    // Clear any cached dashboard data
    localStorage.removeItem('dashboardCache')
  }

  // Real-time updates simulation
  subscribeToUpdates(callback) {
    // In real implementation, would set up WebSocket or polling
    const interval = setInterval(async () => {
      try {
        const stats = await this.getAdminDashboardStats()
        callback(stats)
      } catch (error) {
        console.error('Error in dashboard update subscription:', error)
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }
}

export default new DashboardService()
