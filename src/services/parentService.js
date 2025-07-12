import apiClient from '../config/api.js';

class ParentService {
  // ====================
  // PARENT MANAGEMENT APIs
  // ====================

  // Get all parents
  async getAllParents() {
    try {
      const response = await apiClient.get('/parents');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch parents'
      );
    }
  }

  // Get all active parents
  async getAllActiveParents() {
    try {
      const response = await apiClient.get('/parents/active');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch active parents'
      );
    }
  }

  // Get parent by ID
  async getParentById(id) {
    try {
      const response = await apiClient.get(`/parents/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch parent'
      );
    }
  }

  // Get parent by parent ID
  async getParentByParentId(parentId) {
    try {
      const response = await apiClient.get(`/parents/parent-id/${parentId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch parent'
      );
    }
  }

  // Get parent by email
  async getParentByEmail(email) {
    try {
      const response = await apiClient.get(
        `/parents/email/${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch parent by email'
      );
    }
  }

  // Get children by parent email
  async getChildrenByParentEmail(parentEmail) {
    try {
      const response = await apiClient.get(
        `/parents/${encodeURIComponent(parentEmail)}/children`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch children'
      );
    }
  }

  // Get parents by student ID
  async getParentsByStudentId(studentId) {
    try {
      const response = await apiClient.get(`/parents/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch parents for student'
      );
    }
  }

  // Get primary parent by student ID
  async getPrimaryParentByStudentId(studentId) {
    try {
      const response = await apiClient.get(
        `/parents/student/${studentId}/primary`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch primary parent'
      );
    }
  }

  // Create parent
  async createParent(parentData) {
    try {
      const response = await apiClient.post('/parents', parentData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to create parent'
      );
    }
  }

  // Update parent
  async updateParent(id, parentData) {
    try {
      const response = await apiClient.put(`/parents/${id}`, parentData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to update parent'
      );
    }
  }

  // Delete parent
  async deleteParent(id) {
    try {
      await apiClient.delete(`/parents/${id}`);
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete parent'
      );
    }
  }

  // Deactivate parent
  async deactivateParent(id) {
    try {
      await apiClient.put(`/parents/${id}/deactivate`);
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to deactivate parent'
      );
    }
  }

  // Add child to parent
  async addChildToParent(parentId, studentId) {
    try {
      await apiClient.post(`/parents/${parentId}/children/${studentId}`);
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to add child to parent'
      );
    }
  }

  // Remove child from parent
  async removeChildFromParent(parentId, studentId) {
    try {
      await apiClient.delete(`/parents/${parentId}/children/${studentId}`);
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to remove child from parent'
      );
    }
  }

  // Get parent statistics
  async getParentStatistics() {
    try {
      const response = await apiClient.get('/parents/statistics');
      return response.data;
    } catch (error) {
      console.error(
        '❌ Failed to fetch parent statistics from backend:',
        error
      );
      return {
        totalParents: 0,
        activeParents: 0,
        inactiveParents: 0,
        error: error.response?.data?.message || 'Backend not available',
      };
    }
  }

  // Bulk create parent-child mappings
  async bulkCreateParentChildMappings(mappings) {
    try {
      const response = await apiClient.post(
        '/parents/bulk-create-mappings',
        mappings
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Failed to create parent-child mappings'
      );
    }
  }

  // ====================
  // PARENT DASHBOARD HELPERS
  // ====================

  // Get comprehensive parent dashboard data
  async getParentDashboardData(parentEmail) {
    try {
      const children = await this.getChildrenByParentEmail(parentEmail);

      const dashboardData = {
        children: [],
        stats: {
          totalChildren: children.length,
          avgGrade: 0,
          totalUpcomingAssignments: 0,
          pendingPayments: 0,
        },
        recentActivity: [],
        upcomingEvents: [],
      };

      if (children.length === 0) {
        return dashboardData;
      }

      // Process each child's data
      for (const child of children) {
        try {
          // Get grades, attendance, and assignments for each child
          const [grades, attendance, assignments] = await Promise.allSettled([
            apiClient.get(`/grades/student/${child.studentId}`),
            apiClient.get(`/attendance/student/${child.studentId}`),
            apiClient.get(`/assignments/student/${child.studentId}`),
          ]);

          const childGrades =
            grades.status === 'fulfilled' ? grades.value.data : [];
          const childAttendance =
            attendance.status === 'fulfilled' ? attendance.value.data : [];
          const childAssignments =
            assignments.status === 'fulfilled' ? assignments.value.data : [];

          // Calculate child statistics
          const avgGrade =
            childGrades.length > 0
              ? (
                  childGrades.reduce((sum, g) => sum + (g.marks || 0), 0) /
                  childGrades.length
                ).toFixed(1)
              : 'N/A';

          const attendancePercentage =
            childAttendance.length > 0
              ? Math.round(
                  (childAttendance.filter((a) => a.status === 'PRESENT')
                    .length /
                    childAttendance.length) *
                    100
                )
              : 0;

          const upcomingAssignments = childAssignments.filter(
            (a) => a.dueDate && new Date(a.dueDate) > new Date()
          ).length;

          dashboardData.stats.totalUpcomingAssignments += upcomingAssignments;

          // Add recent grades to activity
          const recentGrades = childGrades
            .sort(
              (a, b) =>
                new Date(b.submissionDate || b.createdAt) -
                new Date(a.submissionDate || a.createdAt)
            )
            .slice(0, 3);

          recentGrades.forEach((grade) => {
            dashboardData.recentActivity.push({
              type: 'grade',
              text: `${child.user?.firstName} received ${
                grade.letterGrade || grade.marks + '%'
              } in ${grade.course?.courseName || 'a subject'}`,
              time: this.getTimeAgo(grade.submissionDate || grade.createdAt),
              childName: `${child.user?.firstName} ${child.user?.lastName}`,
            });
          });

          dashboardData.children.push({
            ...child,
            name: `${child.user?.firstName || ''} ${
              child.user?.lastName || ''
            }`.trim(),
            grade: `${child.grade} Grade`,
            overallGrade: avgGrade,
            attendance: attendancePercentage,
            upcomingAssignments,
            recentGrades: recentGrades.map((g) => ({
              subject: g.course?.courseName || g.subject || 'Unknown',
              grade: g.letterGrade || `${g.marks}%`,
              date: g.submissionDate || g.createdAt,
            })),
          });
        } catch (error) {
          console.warn(
            `Could not load complete data for child ${child.studentId}:`,
            error
          );
          dashboardData.children.push({
            ...child,
            name: `${child.user?.firstName || ''} ${
              child.user?.lastName || ''
            }`.trim(),
            grade: `${child.grade} Grade`,
            overallGrade: 'N/A',
            attendance: 0,
            upcomingAssignments: 0,
            recentGrades: [],
          });
        }
      }

      // Calculate average grade across all children
      const validGrades = dashboardData.children
        .map((c) => Number.parseFloat(c.overallGrade))
        .filter((g) => !isNaN(g));

      dashboardData.stats.avgGrade =
        validGrades.length > 0
          ? (
              validGrades.reduce((sum, g) => sum + g, 0) / validGrades.length
            ).toFixed(1)
          : 'N/A';

      // Get pending payments for all children
      try {
        const paymentsResponse = await apiClient.get(
          '/payments/search?status=PENDING'
        );
        const allPendingPayments = paymentsResponse.data;
        const childrenIds = children.map((c) => c.studentId);
        dashboardData.stats.pendingPayments = allPendingPayments.filter((p) =>
          childrenIds.includes(p.student?.studentId)
        ).length;
      } catch (error) {
        console.warn('Could not load pending payments:', error);
      }

      // Sort recent activity by time
      dashboardData.recentActivity.sort((a, b) => {
        const timeA = new Date(a.time);
        const timeB = new Date(b.time);
        return timeB - timeA;
      });

      return dashboardData;
    } catch (error) {
      console.error('Error getting parent dashboard data:', error);
      throw new Error('Failed to load parent dashboard data');
    }
  }

  // ====================
  // HELPER METHODS
  // ====================

  // Format time ago
  getTimeAgo(date) {
    if (!date) return 'Unknown';
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Recently';
  }

  // Create parent template
  createParentTemplate() {
    return {
      user: null,
      parentId: '',
      children: [],
      relationship: 'Father',
      occupation: '',
      workPhone: '',
      emergencyContact: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      isPrimary: false,
      isActive: true,
      canViewFinancials: true,
      canMakePayments: true,
      receiveBillingNotifications: true,
      receiveEmailNotifications: true,
      receiveSmsNotifications: true,
      receiveProgressReports: true,
      receiveAttendanceAlerts: true,
    };
  }

  // Get relationship types
  getRelationshipTypes() {
    return [
      'Father',
      'Mother',
      'Guardian',
      'Grandfather',
      'Grandmother',
      'Uncle',
      'Aunt',
      'Other',
    ];
  }
}

export default new ParentService();
