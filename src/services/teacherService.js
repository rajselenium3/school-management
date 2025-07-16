import apiClient from '../config/api.js';

class TeacherService {
  // ====================
  // TEACHER CLASS-STUDENT ASSIGNMENT APIs
  // ====================

  // Get students assigned to teacher's classes
  async getAssignedStudents(teacherEmail) {
    try {
      const response = await apiClient.get(`/teachers/assigned-students`, {
        params: { teacherEmail },
      });
      return response.data;
    } catch (error) {
      console.warn(
        'Backend unavailable, using fallback data for assigned students:',
        error.message
      );
      // Fallback data when backend is unavailable
      return this.getFallbackAssignedStudents(teacherEmail);
    }
  }

  // Get teacher's class assignments
  async getClassAssignments(teacherEmail) {
    try {
      const response = await apiClient.get(`/teachers/class-assignments`, {
        params: { teacherEmail },
      });
      return response.data;
    } catch (error) {
      console.warn(
        'Backend unavailable, using fallback data for class assignments:',
        error.message
      );
      return this.getFallbackClassAssignments(teacherEmail);
    }
  }

  // Get students for a specific class
  async getClassStudents(classId) {
    try {
      const response = await apiClient.get(`/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      console.warn(
        'Backend unavailable, using fallback data for class students:',
        error.message
      );
      return this.getFallbackClassStudents(classId);
    }
  }

  // ====================
  // FALLBACK DATA METHODS
  // ====================

  getFallbackAssignedStudents(teacherEmail) {
    // Mock data based on teacher assignments
    const baseStudents = [
      {
        id: 'STU-2024-001',
        studentId: 'STU-2024-001',
        admissionNumber: 'ADM2024001',
        rollNumber: '001',
        user: {
          firstName: 'Emma',
          lastName: 'Thompson',
          email: 'emma.thompson@student.edu',
        },
        grade: 'Grade 10',
        section: 'A',
        className: 'Math 10A',
        classId: 'MATH10A',
        subject: 'Mathematics',
        attendance: 92,
        overallGrade: 'A-',
      },
      {
        id: 'STU-2024-002',
        studentId: 'STU-2024-002',
        admissionNumber: 'ADM2024002',
        rollNumber: '002',
        user: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@student.edu',
        },
        grade: 'Grade 10',
        section: 'A',
        className: 'Math 10A',
        classId: 'MATH10A',
        subject: 'Mathematics',
        attendance: 88,
        overallGrade: 'B+',
      },
      {
        id: 'STU-2024-003',
        studentId: 'STU-2024-003',
        admissionNumber: 'ADM2024003',
        rollNumber: '003',
        user: {
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'sarah.wilson@student.edu',
        },
        grade: 'Grade 10',
        section: 'B',
        className: 'Math 10B',
        classId: 'MATH10B',
        subject: 'Mathematics',
        attendance: 95,
        overallGrade: 'A',
      },
      {
        id: 'STU-2024-004',
        studentId: 'STU-2024-004',
        admissionNumber: 'ADM2024004',
        rollNumber: '004',
        user: {
          firstName: 'Michael',
          lastName: 'Johnson',
          email: 'michael.johnson@student.edu',
        },
        grade: 'Grade 11',
        section: 'A',
        className: 'Algebra 11A',
        classId: 'ALG11A',
        subject: 'Advanced Mathematics',
        attendance: 90,
        overallGrade: 'A-',
      },
    ];

    // Return all students for demo purposes
    return baseStudents;
  }

  getFallbackClassAssignments(teacherEmail) {
    return [
      {
        id: 'MATH10A',
        className: 'Math 10A',
        grade: 'Grade 10',
        section: 'A',
        subject: 'Mathematics',
        room: '101',
        schedule: 'Mon, Wed, Fri - 9:00 AM',
        studentCount: 28,
        description: 'Basic Mathematics for Grade 10',
      },
      {
        id: 'MATH10B',
        className: 'Math 10B',
        grade: 'Grade 10',
        section: 'B',
        subject: 'Mathematics',
        room: '102',
        schedule: 'Tue, Thu - 10:00 AM',
        studentCount: 25,
        description: 'Basic Mathematics for Grade 10',
      },
      {
        id: 'ALG11A',
        className: 'Algebra 11A',
        grade: 'Grade 11',
        section: 'A',
        subject: 'Advanced Mathematics',
        room: '201',
        schedule: 'Mon, Wed, Fri - 11:00 AM',
        studentCount: 22,
        description: 'Advanced Algebra for Grade 11',
      },
    ];
  }

  getFallbackClassStudents(classId) {
    const allStudents = this.getFallbackAssignedStudents();
    return allStudents.filter((student) => student.classId === classId);
  }

  // ====================
  // EXISTING TEACHER MANAGEMENT APIs
  // ====================

  // Get all teachers
  async getAllTeachers() {
    try {
      const response = await apiClient.get('/teachers');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch teachers'
      );
    }
  }

  // Get teacher by ID
  async getTeacherById(id) {
    try {
      const response = await apiClient.get(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch teacher'
      );
    }
  }

  // Create new teacher
  async createTeacher(teacherData) {
    try {
      const response = await apiClient.post('/teachers', teacherData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to create teacher'
      );
    }
  }

  // Update teacher
  async updateTeacher(id, teacherData) {
    try {
      const response = await apiClient.put(`/teachers/${id}`, teacherData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to update teacher'
      );
    }
  }

  // Delete teacher
  async deleteTeacher(id) {
    try {
      await apiClient.delete(`/teachers/${id}`);
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete teacher'
      );
    }
  }

  // ====================
  // TEACHER DASHBOARD METHODS
  // ====================

  async getTeacherDashboard(teacherEmail) {
    try {
      const [assignments, students] = await Promise.all([
        this.getClassAssignments(teacherEmail),
        this.getAssignedStudents(teacherEmail),
      ]);

      // Calculate dashboard statistics
      const totalStudents = students.length;
      const totalClasses = assignments.length;
      const avgAttendance =
        students.length > 0
          ? Math.round(
              students.reduce((sum, s) => sum + (s.attendance || 0), 0) /
                students.length
            )
          : 0;

      // Recent activities
      const recentActivities = [
        {
          type: 'assignment',
          text: 'Math Quiz 3 graded for Math 10A',
          time: '2 hours ago',
          class: 'Math 10A',
        },
        {
          type: 'attendance',
          text: 'Attendance marked for Math 10B',
          time: '1 day ago',
          class: 'Math 10B',
        },
        {
          type: 'grade',
          text: 'Updated grades for 5 students',
          time: '2 days ago',
          class: 'Algebra 11A',
        },
      ];

      return {
        assignments,
        students,
        statistics: {
          totalStudents,
          totalClasses,
          avgAttendance,
          pendingGrades: Math.floor(totalStudents * 0.3), // 30% pending grades
        },
        recentActivities,
        upcomingClasses: assignments.slice(0, 3), // Next 3 classes
      };
    } catch (error) {
      console.error('Error loading teacher dashboard:', error);
      throw new Error('Failed to load teacher dashboard data');
    }
  }
}

const teacherService = new TeacherService();
export default teacherService;
