import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  students: [],
  selectedStudent: null,
  loading: false,
  error: null,
  filters: {
    grade: 'all',
    status: 'all',
    search: '',
  },
  aiInsights: [],
}

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload
      state.loading = false
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload
    },
    addStudent: (state, action) => {
      state.students.push(action.payload)
    },
    updateStudent: (state, action) => {
      const index = state.students.findIndex(
        (student) => student.id === action.payload.id
      )
      if (index !== -1) {
        state.students[index] = action.payload
      }
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter(
        (student) => student.id !== action.payload
      )
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setAiInsights: (state, action) => {
      state.aiInsights = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setStudents,
  setSelectedStudent,
  addStudent,
  updateStudent,
  deleteStudent,
  setLoading,
  setError,
  setFilters,
  setAiInsights,
  clearError,
} = studentSlice.actions

export default studentSlice.reducer
