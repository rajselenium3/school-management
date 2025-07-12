import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  grades: [],
  assignments: [],
  courses: [],
  selectedCourse: null,
  selectedAssignment: null,
  loading: false,
  error: null,
  aiGrading: {
    queue: [],
    processing: false,
    results: [],
  },
  analytics: {
    gradeDistribution: [],
    trends: [],
    predictions: [],
  },
}

const gradeSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    setGrades: (state, action) => {
      state.grades = action.payload
      state.loading = false
    },
    setAssignments: (state, action) => {
      state.assignments = action.payload
    },
    setCourses: (state, action) => {
      state.courses = action.payload
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload
    },
    setSelectedAssignment: (state, action) => {
      state.selectedAssignment = action.payload
    },
    addGrade: (state, action) => {
      state.grades.push(action.payload)
    },
    updateGrade: (state, action) => {
      const index = state.grades.findIndex(
        (grade) => grade.id === action.payload.id
      )
      if (index !== -1) {
        state.grades[index] = action.payload
      }
    },
    deleteGrade: (state, action) => {
      state.grades = state.grades.filter(
        (grade) => grade.id !== action.payload
      )
    },
    addAssignment: (state, action) => {
      state.assignments.push(action.payload)
    },
    updateAssignment: (state, action) => {
      const index = state.assignments.findIndex(
        (assignment) => assignment.id === action.payload.id
      )
      if (index !== -1) {
        state.assignments[index] = action.payload
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    setAiGradingQueue: (state, action) => {
      state.aiGrading.queue = action.payload
    },
    setAiGradingProcessing: (state, action) => {
      state.aiGrading.processing = action.payload
    },
    addAiGradingResult: (state, action) => {
      state.aiGrading.results.push(action.payload)
    },
    setAnalytics: (state, action) => {
      state.analytics = { ...state.analytics, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setGrades,
  setAssignments,
  setCourses,
  setSelectedCourse,
  setSelectedAssignment,
  addGrade,
  updateGrade,
  deleteGrade,
  addAssignment,
  updateAssignment,
  setLoading,
  setError,
  setAiGradingQueue,
  setAiGradingProcessing,
  addAiGradingResult,
  setAnalytics,
  clearError,
} = gradeSlice.actions

export default gradeSlice.reducer
