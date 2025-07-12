import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assignmentService from '../../services/assignmentService.js';

// Async thunks for assignment operations
export const fetchAllAssignments = createAsyncThunk(
  'assignments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const assignments = await assignmentService.getAllAssignments();
      return assignments.map((a) => assignmentService.formatAssignment(a));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAssignmentsByTeacher = createAsyncThunk(
  'assignments/fetchByTeacher',
  async (teacherId, { rejectWithValue }) => {
    try {
      const assignments = await assignmentService.getAssignmentsByTeacher(
        teacherId
      );
      return assignments.map((a) => assignmentService.formatAssignment(a));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAssignmentsByStudent = createAsyncThunk(
  'assignments/fetchByStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const assignments = await assignmentService.getAssignmentsByStudent(
        studentId
      );
      return assignments.map((a) => assignmentService.formatAssignment(a));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAssignmentsDueSoon = createAsyncThunk(
  'assignments/fetchDueSoon',
  async (days = 7, { rejectWithValue }) => {
    try {
      const assignments = await assignmentService.getAssignmentsDueSoon(days);
      return assignments.map((a) => assignmentService.formatAssignment(a));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOverdueAssignments = createAsyncThunk(
  'assignments/fetchOverdue',
  async (_, { rejectWithValue }) => {
    try {
      const assignments = await assignmentService.getOverdueAssignments();
      return assignments.map((a) => assignmentService.formatAssignment(a));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAssignmentStatistics = createAsyncThunk(
  'assignments/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      return await assignmentService.getAssignmentStatistics();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/create',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const newAssignment = await assignmentService.createAssignment(
        assignmentData
      );
      return assignmentService.formatAssignment(newAssignment);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAssignment = createAsyncThunk(
  'assignments/update',
  async ({ id, assignmentData }, { rejectWithValue }) => {
    try {
      const updatedAssignment = await assignmentService.updateAssignment(
        id,
        assignmentData
      );
      return assignmentService.formatAssignment(updatedAssignment);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignments/delete',
  async (assignmentId, { rejectWithValue }) => {
    try {
      await assignmentService.deleteAssignment(assignmentId);
      return assignmentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const duplicateAssignment = createAsyncThunk(
  'assignments/duplicate',
  async ({ assignmentId, newTitle }, { rejectWithValue }) => {
    try {
      const duplicatedAssignment = await assignmentService.duplicateAssignment(
        assignmentId,
        newTitle
      );
      return assignmentService.formatAssignment(duplicatedAssignment);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchAssignments = createAsyncThunk(
  'assignments/search',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const assignments = await assignmentService.searchAssignments(searchTerm);
      return assignments.map((a) => assignmentService.formatAssignment(a));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkCreateAssignments = createAsyncThunk(
  'assignments/bulkCreate',
  async (assignments, { rejectWithValue }) => {
    try {
      const createdAssignments = await assignmentService.bulkCreateAssignments(
        assignments
      );
      return createdAssignments.map((a) =>
        assignmentService.formatAssignment(a)
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Data
  assignments: [],
  dueSoonAssignments: [],
  overdueAssignments: [],
  selectedAssignment: null,
  statistics: {},

  // UI State
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  success: null,

  // Filters and Search
  filters: {
    searchTerm: '',
    type: '',
    course: '',
    status: '',
    teacher: '',
    dateRange: null,
  },

  // Pagination
  pagination: {
    page: 0,
    pageSize: 10,
    total: 0,
  },

  // View State
  view: 'list', // 'list', 'grid', 'calendar'
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    // UI Actions
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setSelectedAssignment: (state, action) => {
      state.selectedAssignment = action.payload;
    },
    clearSelectedAssignment: (state) => {
      state.selectedAssignment = null;
    },

    // Filter Actions
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setTypeFilter: (state, action) => {
      state.filters.type = action.payload;
    },
    setCourseFilter: (state, action) => {
      state.filters.course = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    setTeacherFilter: (state, action) => {
      state.filters.teacher = action.payload;
    },
    setDateRangeFilter: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // View Actions
    setView: (state, action) => {
      state.view = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },

    // Pagination Actions
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
    },

    // Local State Updates
    updateAssignmentLocally: (state, action) => {
      const index = state.assignments.findIndex(
        (a) => a.id === action.payload.id
      );
      if (index !== -1) {
        state.assignments[index] = {
          ...state.assignments[index],
          ...action.payload,
        };
      }
    },
    incrementSubmissionCount: (state, action) => {
      const assignment = state.assignments.find((a) => a.id === action.payload);
      if (assignment) {
        assignment.submissions = (assignment.submissions || 0) + 1;
      }
    },
    incrementGradedCount: (state, action) => {
      const assignment = state.assignments.find((a) => a.id === action.payload);
      if (assignment) {
        assignment.graded = (assignment.graded || 0) + 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Assignments
      .addCase(fetchAllAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
        state.pagination.total = action.payload.length;
      })
      .addCase(fetchAllAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Assignments by Teacher
      .addCase(fetchAssignmentsByTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsByTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
        state.pagination.total = action.payload.length;
      })
      .addCase(fetchAssignmentsByTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Due Soon Assignments
      .addCase(fetchAssignmentsDueSoon.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignmentsDueSoon.fulfilled, (state, action) => {
        state.loading = false;
        state.dueSoonAssignments = action.payload;
      })
      .addCase(fetchAssignmentsDueSoon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Overdue Assignments
      .addCase(fetchOverdueAssignments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOverdueAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueAssignments = action.payload;
      })
      .addCase(fetchOverdueAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Statistics
      .addCase(fetchAssignmentStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignmentStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchAssignmentStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Assignment
      .addCase(createAssignment.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.creating = false;
        state.assignments.unshift(action.payload);
        state.success = 'Assignment created successfully!';
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // Update Assignment
      .addCase(updateAssignment.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.assignments.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        state.success = 'Assignment updated successfully!';
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Delete Assignment
      .addCase(deleteAssignment.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.deleting = false;
        state.assignments = state.assignments.filter(
          (a) => a.id !== action.payload
        );
        state.success = 'Assignment deleted successfully!';
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      // Duplicate Assignment
      .addCase(duplicateAssignment.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(duplicateAssignment.fulfilled, (state, action) => {
        state.creating = false;
        state.assignments.unshift(action.payload);
        state.success = 'Assignment duplicated successfully!';
      })
      .addCase(duplicateAssignment.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // Search Assignments
      .addCase(searchAssignments.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
        state.pagination.total = action.payload.length;
      })
      .addCase(searchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Bulk Create Assignments
      .addCase(bulkCreateAssignments.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(bulkCreateAssignments.fulfilled, (state, action) => {
        state.creating = false;
        state.assignments = [...action.payload, ...state.assignments];
        state.success = `${action.payload.length} assignments created successfully!`;
      })
      .addCase(bulkCreateAssignments.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });
  },
});

export const {
  // UI Actions
  clearError,
  clearSuccess,
  setSelectedAssignment,
  clearSelectedAssignment,

  // Filter Actions
  setSearchTerm,
  setTypeFilter,
  setCourseFilter,
  setStatusFilter,
  setTeacherFilter,
  setDateRangeFilter,
  clearFilters,

  // View Actions
  setView,
  setSortBy,
  setSortOrder,

  // Pagination Actions
  setPage,
  setPageSize,

  // Local State Updates
  updateAssignmentLocally,
  incrementSubmissionCount,
  incrementGradedCount,
} = assignmentSlice.actions;

// Selectors
export const selectAllAssignments = (state) => state.assignments.assignments;
export const selectAssignmentById = (id) => (state) =>
  state.assignments.assignments.find((assignment) => assignment.id === id);
export const selectDueSoonAssignments = (state) =>
  state.assignments.dueSoonAssignments;
export const selectOverdueAssignments = (state) =>
  state.assignments.overdueAssignments;
export const selectSelectedAssignment = (state) =>
  state.assignments.selectedAssignment;
export const selectAssignmentStatistics = (state) =>
  state.assignments.statistics;
export const selectAssignmentFilters = (state) => state.assignments.filters;
export const selectAssignmentLoading = (state) => state.assignments.loading;
export const selectAssignmentError = (state) => state.assignments.error;
export const selectAssignmentSuccess = (state) => state.assignments.success;

// Filtered assignments selector
export const selectFilteredAssignments = (state) => {
  const { assignments, filters } = state.assignments;

  return assignments.filter((assignment) => {
    const searchLower = filters.searchTerm.toLowerCase();
    const matchesSearch =
      !filters.searchTerm ||
      assignment.title?.toLowerCase().includes(searchLower) ||
      assignment.description?.toLowerCase().includes(searchLower) ||
      assignment.course?.courseName?.toLowerCase().includes(searchLower);

    const matchesType = !filters.type || assignment.type === filters.type;
    const matchesCourse =
      !filters.course || assignment.course?.id === filters.course;
    const matchesStatus =
      !filters.status || assignment.status === filters.status;
    const matchesTeacher =
      !filters.teacher ||
      assignment.course?.teacher?.teacherId === filters.teacher;

    return (
      matchesSearch &&
      matchesType &&
      matchesCourse &&
      matchesStatus &&
      matchesTeacher
    );
  });
};

export default assignmentSlice.reducer;
