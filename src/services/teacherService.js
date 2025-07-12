import apiClient from '../config/api.js'
import demoDataService from './demoDataService.js'

class TeacherService {
  // Get all teachers
  async getAllTeachers() {
    // Check demo mode FIRST - don't hit backend if in demo mode
    if (demoDataService.isDemoMode()) {
      console.log('🎭 Demo mode: Using demo teacher data')
      return await demoDataService.getTeachers()
    }

    try {
      const response = await apiClient.get('/teachers')
      return response.data
    } catch (error) {
      // Fallback to demo data on backend error
      console.log('🎭 Backend error: Falling back to demo teacher data')
      return await demoDataService.getTeachers()
    }
  }

  // Get teacher by ID
  async getTeacherById(id) {
    try {
      const response = await apiClient.get(`/teachers/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teacher')
    }
  }

  // Get teacher by employee ID
  async getTeacherByEmployeeId(employeeId) {
    try {
      const response = await apiClient.get(`/teachers/employee-id/${employeeId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teacher')
    }
  }

  // Get teacher by email
  async getTeacherByEmail(email) {
    try {
      const response = await apiClient.get(`/teachers/email/${email}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teacher')
    }
  }

  // Get teachers by department
  async getTeachersByDepartment(department) {
    try {
      const response = await apiClient.get(`/teachers/department/${department}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teachers')
    }
  }

  // Get teachers by employment type
  async getTeachersByEmploymentType(employmentType) {
    try {
      const response = await apiClient.get(`/teachers/employment-type/${employmentType}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teachers')
    }
  }

  // Get teachers by subject
  async getTeachersBySubject(subject) {
    try {
      const response = await apiClient.get(`/teachers/subject/${subject}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teachers')
    }
  }

  // Search teachers by name
  async searchTeachersByName(name, page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/teachers/search`, {
        params: { name, page, size }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search teachers')
    }
  }

  // Get high performing teachers
  async getHighPerformingTeachers(performanceThreshold = 85.0) {
    try {
      const response = await apiClient.get('/teachers/high-performing', {
        params: { performanceThreshold }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch high performing teachers')
    }
  }

  // Create new teacher
  async createTeacher(teacherData) {
    try {
      const response = await apiClient.post('/teachers', teacherData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create teacher')
    }
  }

  // Update teacher
  async updateTeacher(id, teacherData) {
    try {
      const response = await apiClient.put(`/teachers/${id}`, teacherData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update teacher')
    }
  }

  // Delete teacher
  async deleteTeacher(id) {
    try {
      await apiClient.delete(`/teachers/${id}`)
      return true
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete teacher')
    }
  }

  // Get teacher count by department
  async getTeacherCountByDepartment(department) {
    try {
      const response = await apiClient.get(`/teachers/count/department/${department}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get teacher count')
    }
  }

  // Get teacher count by employment type
  async getTeacherCountByEmploymentType(employmentType) {
    try {
      const response = await apiClient.get(`/teachers/count/employment-type/${employmentType}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get teacher count')
    }
  }
}

export default new TeacherService()
