// Demo Data Service for Mock Backend
class DemoDataService {
  constructor() {
    this.initializeDemoData()
  }

  initializeDemoData() {
    // Students Demo Data
    this.students = [
      {
        id: '1',
        studentId: 'STU001',
        firstName: 'Emma',
        lastName: 'Thompson',
        email: 'emma.thompson@school.edu',
        grade: '10',
        dateOfBirth: '2007-05-15',
        status: 'ACTIVE',
        department: 'SCIENCE',
        parentInfo: {
          fatherName: 'John Thompson',
          motherName: 'Mary Thompson',
          contactNumber: '+1-234-567-8901',
          email: 'parents.thompson@email.com'
        }
      },
      {
        id: '2',
        studentId: 'STU002',
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex.johnson@school.edu',
        grade: '11',
        dateOfBirth: '2006-08-22',
        status: 'ACTIVE',
        department: 'COMPUTER_SCIENCE'
      },
      {
        id: '3',
        studentId: 'STU003',
        firstName: 'Sofia',
        lastName: 'Rodriguez',
        email: 'sofia.rodriguez@school.edu',
        grade: '9',
        dateOfBirth: '2008-02-10',
        status: 'ACTIVE',
        department: 'MATHEMATICS'
      }
    ]

    // Teachers Demo Data
    this.teachers = [
      {
        id: '1',
        teacherId: 'TCH001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@school.edu',
        department: 'COMPUTER_SCIENCE',
        specialization: 'Programming & Algorithms',
        experience: 8,
        status: 'ACTIVE',
        joiningDate: '2020-08-15'
      },
      {
        id: '2',
        teacherId: 'TCH002',
        firstName: 'Michael',
        lastName: 'Davis',
        email: 'michael.davis@school.edu',
        department: 'MATHEMATICS',
        specialization: 'Calculus & Statistics',
        experience: 12,
        status: 'ACTIVE',
        joiningDate: '2018-01-10'
      },
      {
        id: '3',
        teacherId: 'TCH003',
        firstName: 'Dr. Lisa',
        lastName: 'Wilson',
        email: 'lisa.wilson@school.edu',
        department: 'SCIENCE',
        specialization: 'Physics & Chemistry',
        experience: 15,
        status: 'ACTIVE',
        joiningDate: '2015-09-01'
      }
    ]

    // Courses Demo Data
    this.courses = [
      {
        id: '1',
        courseCode: 'CS101',
        courseName: 'Introduction to Computer Science',
        description: 'Fundamentals of programming and computer science concepts',
        department: 'COMPUTER_SCIENCE',
        credits: 4,
        teacher: this.teachers[0],
        status: 'ACTIVE',
        enrolledStudents: this.students.slice(0, 2)
      },
      {
        id: '2',
        courseCode: 'MATH201',
        courseName: 'Advanced Calculus',
        description: 'Differential and integral calculus with applications',
        department: 'MATHEMATICS',
        credits: 3,
        teacher: this.teachers[1],
        status: 'ACTIVE',
        enrolledStudents: this.students.slice(1, 3)
      },
      {
        id: '3',
        courseCode: 'PHY101',
        courseName: 'General Physics',
        description: 'Mechanics, thermodynamics, and wave motion',
        department: 'SCIENCE',
        credits: 4,
        teacher: this.teachers[2],
        status: 'ACTIVE',
        enrolledStudents: this.students
      }
    ]

    // Assignments Demo Data
    this.assignments = [
      {
        id: '1',
        title: 'Programming Project 1',
        description: 'Create a simple calculator application',
        course: this.courses[0],
        type: 'PROJECT',
        maxScore: 100,
        weight: 0.2,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        submissionStartDate: new Date().toISOString(),
        aiGradingEnabled: true,
        instructions: 'Build a calculator that can perform basic arithmetic operations',
        submissions: 15,
        graded: 10,
        averageScore: 85.5,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Calculus Problem Set 3',
        description: 'Integration techniques and applications',
        course: this.courses[1],
        type: 'HOMEWORK',
        maxScore: 50,
        weight: 0.1,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        submissionStartDate: new Date().toISOString(),
        aiGradingEnabled: false,
        instructions: 'Solve problems 1-20 from Chapter 7',
        submissions: 22,
        graded: 22,
        averageScore: 78.2,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Physics Lab Report',
        description: 'Experiment on simple harmonic motion',
        course: this.courses[2],
        type: 'TEST',
        maxScore: 75,
        weight: 0.15,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Past due
        submissionStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        aiGradingEnabled: true,
        instructions: 'Complete the lab report with data analysis and conclusions',
        submissions: 28,
        graded: 25,
        averageScore: 82.8,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Submissions Demo Data
    this.submissions = [
      {
        id: '1',
        assignment: this.assignments[0],
        student: this.students[0],
        textContent: 'Implemented calculator with all basic operations...',
        status: 'GRADED',
        score: 92,
        maxScore: 100,
        percentage: 92,
        letterGrade: 'A-',
        feedback: 'Excellent work! Clean code and good documentation.',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        aiGrading: {
          aiGraded: true,
          aiScore: 90,
          confidence: 0.85,
          aiFeedback: 'Well-structured code with proper error handling.',
          humanReviewed: true
        }
      }
    ]

    // Grades Demo Data
    this.grades = [
      {
        id: '1',
        student: this.students[0],
        course: this.courses[0],
        assignment: this.assignments[0],
        score: 92,
        maxScore: 100,
        percentage: 92,
        letterGrade: 'A-',
        gradedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Financial Demo Data
    this.fees = [
      {
        id: '1',
        feeType: 'TUITION',
        amount: 5000,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'PENDING',
        student: this.students[0]
      }
    ]

    this.payments = [
      {
        id: '1',
        amount: 2500,
        paymentMethod: 'CREDIT_CARD',
        status: 'COMPLETED',
        fee: this.fees[0],
        paymentDate: new Date().toISOString()
      }
    ]

    // Attendance Demo Data
    this.attendance = [
      {
        id: '1',
        student: this.students[0],
        course: this.courses[0],
        date: new Date().toISOString().split('T')[0],
        status: 'PRESENT',
        notes: ''
      }
    ]
  }

  // Helper method to simulate API delay
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Students API
  async getStudents() {
    await this.delay()
    return this.students
  }

  async getStudentById(id) {
    await this.delay()
    return this.students.find(s => s.id === id)
  }

  async createStudent(studentData) {
    await this.delay()
    const newStudent = {
      ...studentData,
      id: (this.students.length + 1).toString(),
      studentId: `STU${String(this.students.length + 1).padStart(3, '0')}`
    }
    this.students.push(newStudent)
    return newStudent
  }

  // Teachers API
  async getTeachers() {
    await this.delay()
    return this.teachers
  }

  async getTeacherById(id) {
    await this.delay()
    return this.teachers.find(t => t.id === id)
  }

  async createTeacher(teacherData) {
    await this.delay()
    const newTeacher = {
      ...teacherData,
      id: (this.teachers.length + 1).toString(),
      teacherId: `TCH${String(this.teachers.length + 1).padStart(3, '0')}`
    }
    this.teachers.push(newTeacher)
    return newTeacher
  }

  // Courses API
  async getCourses() {
    await this.delay()
    return this.courses
  }

  async getCourseById(id) {
    await this.delay()
    return this.courses.find(c => c.id === id)
  }

  async createCourse(courseData) {
    await this.delay()
    const newCourse = {
      ...courseData,
      id: (this.courses.length + 1).toString(),
      enrolledStudents: []
    }
    this.courses.push(newCourse)
    return newCourse
  }

  // Assignments API
  async getAssignments() {
    await this.delay()
    return this.assignments
  }

  async getAssignmentById(id) {
    await this.delay()
    return this.assignments.find(a => a.id === id)
  }

  async createAssignment(assignmentData) {
    await this.delay()
    const newAssignment = {
      ...assignmentData,
      id: (this.assignments.length + 1).toString(),
      submissions: 0,
      graded: 0,
      averageScore: 0,
      createdAt: new Date().toISOString()
    }
    this.assignments.push(newAssignment)
    return newAssignment
  }

  async getAssignmentStatistics() {
    await this.delay()
    return {
      totalAssignments: this.assignments.length,
      upcomingAssignments: 2,
      overdueAssignments: 1,
      pendingGrading: 5,
      aiGradingRate: 75.5,
      assignmentsByType: {
        HOMEWORK: 8,
        QUIZ: 5,
        TEST: 3,
        PROJECT: 2,
        PARTICIPATION: 1
      },
      averageSubmissionRate: 85.2
    }
  }

  // Submissions API
  async getSubmissions() {
    await this.delay()
    return this.submissions
  }

  async getSubmissionsByAssignment(assignmentId) {
    await this.delay()
    return this.submissions.filter(s => s.assignment.id === assignmentId)
  }

  async getSubmissionsByStudent(studentId) {
    await this.delay()
    return this.submissions.filter(s => s.student.id === studentId)
  }

  // Dashboard Statistics
  async getDashboardStats() {
    await this.delay()
    return {
      students: {
        total: this.students.length,
        active: this.students.filter(s => s.status === 'ACTIVE').length,
        growthRate: '+5.2%',
        newThisMonth: 2
      },
      teachers: {
        total: this.teachers.length,
        active: this.teachers.filter(t => t.status === 'ACTIVE').length,
        newThisMonth: 1
      },
      courses: {
        total: this.courses.length,
        active: this.courses.filter(c => c.status === 'ACTIVE').length,
        departments: { COMPUTER_SCIENCE: 1, MATHEMATICS: 1, SCIENCE: 1 }
      },
      assignments: {
        total: this.assignments.length,
        thisWeekDue: 2,
        overdue: 1,
        pendingGrading: 5,
        aiGradingRate: 75.5
      },
      attendance: {
        averageRate: 94.5,
        thisWeek: 96.2,
        lastWeek: 93.8,
        trend: 'up'
      }
    }
  }

  // Financial API
  async getFees() {
    await this.delay()
    return this.fees
  }

  async getPayments() {
    await this.delay()
    return this.payments
  }

  // Grades API
  async getGrades() {
    await this.delay()
    return this.grades
  }

  // Attendance API
  async getAttendance() {
    await this.delay()
    return this.attendance
  }

  // Generic update/delete operations
  async updateEntity(entityType, id, data) {
    await this.delay()
    const entities = this[entityType]
    const index = entities.findIndex(e => e.id === id)
    if (index !== -1) {
      entities[index] = { ...entities[index], ...data }
      return entities[index]
    }
    throw new Error(`${entityType} not found`)
  }

  async deleteEntity(entityType, id) {
    await this.delay()
    const entities = this[entityType]
    const index = entities.findIndex(e => e.id === id)
    if (index !== -1) {
      entities.splice(index, 1)
      return true
    }
    throw new Error(`${entityType} not found`)
  }

  // Check if we're in demo mode
  isDemoMode() {
    const token = localStorage.getItem('authToken')
    const demoFlag = localStorage.getItem('demoMode')
    const isDemo = (token && token.startsWith('demo-jwt-')) || demoFlag === 'true'

    console.log('🔍 Demo Mode Check:', {
      token: token ? token.substring(0, 30) + '...' : 'null',
      demoFlag,
      isDemo,
      allStorage: {
        authToken: localStorage.getItem('authToken'),
        userRole: localStorage.getItem('userRole'),
        demoMode: localStorage.getItem('demoMode')
      }
    })

    return isDemo
  }
}

export default new DemoDataService()
