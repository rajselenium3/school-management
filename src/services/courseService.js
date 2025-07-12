import apiClient from '../config/api.js'
import demoDataService from './demoDataService.js'

class CourseService {
  // Get all courses
  async getAllCourses() {
    // Check demo mode FIRST - don't hit backend if in demo mode
    if (demoDataService.isDemoMode()) {
      console.log('🎭 Demo mode: Using demo course data')
      return await demoDataService.getCourses()
    }

    try {
      const response = await apiClient.get('/courses')
      return response.data
    } catch (error) {
      // Fallback to demo data on backend error
      console.log('🎭 Backend error: Falling back to demo course data')
      return await demoDataService.getCourses()
    }
  }

  // Get course by ID
  async getCourseById(id) {
    try {
      const response = await apiClient.get(`/courses/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course')
    }
  }

  // Get course by course code
  async getCourseByCourseCode(courseCode) {
    try {
      const response = await apiClient.get(`/courses/code/${courseCode}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch course')
    }
  }

  // Get courses by department
  async getCoursesByDepartment(department) {
    try {
      const response = await apiClient.get(`/courses/department/${department}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses')
    }
  }

  // Get courses by teacher ID
  async getCoursesByTeacher(teacherId) {
    try {
      const response = await apiClient.get(`/courses/teacher/${teacherId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses')
    }
  }

  // Get courses by grade
  async getCoursesByGrade(grade) {
    try {
      const response = await apiClient.get(`/courses/grade/${grade}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses')
    }
  }

  // Get courses by status
  async getCoursesByStatus(status) {
    try {
      const response = await apiClient.get(`/courses/status/${status}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses')
    }
  }

  // Search courses by name
  async searchCoursesByName(name, page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/courses/search`, {
        params: { name, page, size }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search courses')
    }
  }

  // Get active courses
  async getActiveCourses() {
    try {
      const response = await apiClient.get('/courses/active')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch active courses')
    }
  }

  // Get upcoming courses
  async getUpcomingCourses() {
    try {
      const response = await apiClient.get('/courses/upcoming')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch upcoming courses')
    }
  }

  // Create new course
  async createCourse(courseData) {
    try {
      const response = await apiClient.post('/courses', courseData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create course')
    }
  }

  // Update course
  async updateCourse(id, courseData) {
    try {
      const response = await apiClient.put(`/courses/${id}`, courseData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update course')
    }
  }

  // Delete course
  async deleteCourse(id) {
    try {
      await apiClient.delete(`/courses/${id}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete course')
    }
  }

  // Enroll student in course
  async enrollStudent(courseId, studentId) {
    try {
      const response = await apiClient.post(`/courses/${courseId}/enroll/${studentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to enroll student')
    }
  }

  // Unenroll student from course
  async unenrollStudent(courseId, studentId) {
    try {
      const response = await apiClient.delete(`/courses/${courseId}/unenroll/${studentId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unenroll student')
    }
  }

  // Update course analytics
  async updateCourseAnalytics(courseId, analytics) {
    try {
      const response = await apiClient.put(`/courses/${courseId}/analytics`, analytics)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update course analytics')
    }
  }

  // Get course count by department
  async getCourseCountByDepartment(department) {
    try {
      const response = await apiClient.get(`/courses/count/department/${department}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get course count')
    }
  }

  // Get course count by status
  async getCourseCountByStatus(status) {
    try {
      const response = await apiClient.get(`/courses/count/status/${status}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get course count')
    }
  }

  // Get enrollment statistics for course
  async getCourseEnrollmentStats(courseId) {
    try {
      const response = await apiClient.get(`/courses/enrollment-stats/${courseId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get enrollment stats')
    }
  }

  // Helper methods for course management

  // Get all departments (extract from courses)
  async getDepartments() {
    try {
      const courses = await this.getAllCourses()
      const departments = [...new Set(courses.map(course => course.department).filter(Boolean))]
      return departments.sort()
    } catch (error) {
      throw new Error('Failed to get departments')
    }
  }

  // Get course statistics
  async getCourseStatistics() {
    try {
      const [allCourses, activeCourses, upcomingCourses] = await Promise.all([
        this.getAllCourses(),
        this.getActiveCourses(),
        this.getUpcomingCourses()
      ])

      return {
        total: allCourses.length,
        active: activeCourses.length,
        upcoming: upcomingCourses.length,
        completed: allCourses.filter(course => course.status === 'COMPLETED').length,
        departments: [...new Set(allCourses.map(course => course.department).filter(Boolean))].length
      }
    } catch (error) {
      throw new Error('Failed to get course statistics')
    }
  }

  // Bulk operations
  async bulkEnrollStudents(courseId, studentIds) {
    try {
      const enrollmentPromises = studentIds.map(studentId =>
        this.enrollStudent(courseId, studentId)
      )
      await Promise.all(enrollmentPromises)
      return true
    } catch (error) {
      throw new Error('Failed to bulk enroll students')
    }
  }

  // Get courses for a specific teacher
  async getMyCoursesAsTeacher(teacherId) {
    try {
      return await this.getCoursesByTeacher(teacherId)
    } catch (error) {
      throw new Error('Failed to get teacher courses')
    }
  }

  // Get enrolled courses for a student
  async getEnrolledCoursesForStudent(studentId) {
    try {
      const allCourses = await this.getAllCourses()
      return allCourses.filter(course =>
        course.enrolledStudents &&
        course.enrolledStudents.some(student => student.studentId === studentId)
      )
    } catch (error) {
      throw new Error('Failed to get enrolled courses')
    }
  }
}

export default new CourseService()
