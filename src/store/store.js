import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import studentReducer from './slices/studentSlice.js';
import gradeReducer from './slices/gradeSlice.js';
import assignmentReducer from './slices/assignmentSlice.js';
import submissionReducer from './slices/submissionSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    students: studentReducer,
    grades: gradeReducer,
    assignments: assignmentReducer,
    submissions: submissionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Debug store state
console.log('🏪 Store initial state:', store.getState());

// Subscribe to store changes for debugging
store.subscribe(() => {
  const state = store.getState();
  console.log('🏪 Store state changed:', {
    auth: !!state.auth,
    ui: !!state.ui,
    students: !!state.students,
    grades: !!state.grades,
    assignments: !!state.assignments,
    submissions: !!state.submissions,
    uiSidebarOpen: state.ui?.sidebarOpen,
  });
});
