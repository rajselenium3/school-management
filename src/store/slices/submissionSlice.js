import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assignmentService from '../../services/assignmentService.js';

// Async thunks for submission operations
export const fetchAllSubmissions = createAsyncThunk(
  'submissions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await assignmentService.getAllSubmissions();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubmissionsByAssignment = createAsyncThunk(
  'submissions/fetchByAssignment',
  async (assignmentId, { rejectWithValue }) => {
    try {
      return await assignmentService.getSubmissionsByAssignment(assignmentId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubmissionsByStudent = createAsyncThunk(
  'submissions/fetchByStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      return await assignmentService.getSubmissionsByStudent(studentId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubmissionByAssignmentAndStudent = createAsyncThunk(
  'submissions/fetchByAssignmentAndStudent',
  async ({ assignmentId, studentId }, { rejectWithValue }) => {
    try {
      return await assignmentService.getSubmissionByAssignmentAndStudent(
        assignmentId,
        studentId
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubmissionStatistics = createAsyncThunk(
  'submissions/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      return await assignmentService.getSubmissionStatistics();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSubmission = createAsyncThunk(
  'submissions/create',
  async (
    { assignmentId, studentId, textContent, attachments },
    { rejectWithValue }
  ) => {
    try {
      return await assignmentService.createSubmission(
        assignmentId,
        studentId,
        textContent,
        attachments
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubmissionContent = createAsyncThunk(
  'submissions/updateContent',
  async ({ submissionId, textContent, attachments }, { rejectWithValue }) => {
    try {
      return await assignmentService.updateSubmissionContent(
        submissionId,
        textContent,
        attachments
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitAssignment = createAsyncThunk(
  'submissions/submit',
  async (submissionId, { rejectWithValue }) => {
    try {
      return await assignmentService.submitAssignment(submissionId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const performAIGrading = createAsyncThunk(
  'submissions/performAIGrading',
  async (submissionId, { rejectWithValue }) => {
    try {
      return await assignmentService.performAIGrading(submissionId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reviewAIGrading = createAsyncThunk(
  'submissions/reviewAIGrading',
  async (
    { submissionId, approved, humanComments, humanScore },
    { rejectWithValue }
  ) => {
    try {
      return await assignmentService.reviewAIGrading(
        submissionId,
        approved,
        humanComments,
        humanScore
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const gradeSubmissionManually = createAsyncThunk(
  'submissions/gradeManually',
  async ({ submissionId, score, feedback }, { rejectWithValue }) => {
    try {
      return await assignmentService.gradeSubmission(
        submissionId,
        score,
        feedback
      );
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const performPlagiarismCheck = createAsyncThunk(
  'submissions/performPlagiarismCheck',
  async (submissionId, { rejectWithValue }) => {
    try {
      return await assignmentService.performPlagiarismCheck(submissionId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkAIGrading = createAsyncThunk(
  'submissions/bulkAIGrading',
  async (submissionIds, { rejectWithValue }) => {
    try {
      return await assignmentService.bulkAIGrading(submissionIds);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkPlagiarismCheck = createAsyncThunk(
  'submissions/bulkPlagiarismCheck',
  async (submissionIds, { rejectWithValue }) => {
    try {
      return await assignmentService.bulkPlagiarismCheck(submissionIds);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Data
  submissions: [],
  selectedSubmission: null,
  currentUserSubmissions: [],
  pendingGrading: [],
  aiGradedSubmissions: [],
  flaggedSubmissions: [],
  statistics: {},

  // UI State
  loading: false,
  creating: false,
  updating: false,
  grading: false,
  aiGrading: false,
  plagiarismChecking: false,
  bulkProcessing: false,
  error: null,
  success: null,

  // Filters
  filters: {
    status: '',
    assignment: '',
    student: '',
    graded: null,
    aiGraded: null,
    plagiarismFlagged: null,
    dateRange: null,
  },

  // Submission Form State
  submissionForm: {
    assignmentId: '',
    textContent: '',
    attachments: [],
    isDraft: true,
  },

  // Grading State
  gradingData: {
    submissionId: '',
    score: 0,
    feedback: '',
    aiApproved: false,
  },

  // View State
  view: 'list', // 'list', 'grid'
  sortBy: 'submittedAt',
  sortOrder: 'desc',
};

const submissionSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    // UI Actions
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setSelectedSubmission: (state, action) => {
      state.selectedSubmission = action.payload;
    },
    clearSelectedSubmission: (state) => {
      state.selectedSubmission = null;
    },

    // Filter Actions
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    setAssignmentFilter: (state, action) => {
      state.filters.assignment = action.payload;
    },
    setStudentFilter: (state, action) => {
      state.filters.student = action.payload;
    },
    setGradedFilter: (state, action) => {
      state.filters.graded = action.payload;
    },
    setAIGradedFilter: (state, action) => {
      state.filters.aiGraded = action.payload;
    },
    setPlagiarismFlaggedFilter: (state, action) => {
      state.filters.plagiarismFlagged = action.payload;
    },
    setDateRangeFilter: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Submission Form Actions
    setSubmissionFormData: (state, action) => {
      state.submissionForm = { ...state.submissionForm, ...action.payload };
    },
    clearSubmissionForm: (state) => {
      state.submissionForm = initialState.submissionForm;
    },
    addAttachment: (state, action) => {
      state.submissionForm.attachments.push(action.payload);
    },
    removeAttachment: (state, action) => {
      state.submissionForm.attachments =
        state.submissionForm.attachments.filter(
          (_, index) => index !== action.payload
        );
    },

    // Grading Actions
    setGradingData: (state, action) => {
      state.gradingData = { ...state.gradingData, ...action.payload };
    },
    clearGradingData: (state) => {
      state.gradingData = initialState.gradingData;
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

    // Local State Updates
    updateSubmissionLocally: (state, action) => {
      const index = state.submissions.findIndex(
        (s) => s.id === action.payload.id
      );
      if (index !== -1) {
        state.submissions[index] = {
          ...state.submissions[index],
          ...action.payload,
        };
      }
    },
    markSubmissionAsGraded: (state, action) => {
      const submission = state.submissions.find((s) => s.id === action.payload);
      if (submission) {
        submission.isGraded = true;
        submission.status = 'GRADED';
      }
    },
    markSubmissionAsPlagiarismChecked: (state, action) => {
      const submission = state.submissions.find(
        (s) => s.id === action.payload.submissionId
      );
      if (submission) {
        submission.plagiarismCheck = action.payload.result;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Submissions
      .addCase(fetchAllSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchAllSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Submissions by Assignment
      .addCase(fetchSubmissionsByAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissionsByAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Submissions by Student
      .addCase(fetchSubmissionsByStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionsByStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserSubmissions = action.payload;
      })
      .addCase(fetchSubmissionsByStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Submission by Assignment and Student
      .addCase(fetchSubmissionByAssignmentAndStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSubmissionByAssignmentAndStudent.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedSubmission = action.payload;
        }
      )
      .addCase(
        fetchSubmissionByAssignmentAndStudent.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // Fetch Statistics
      .addCase(fetchSubmissionStatistics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubmissionStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchSubmissionStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Submission
      .addCase(createSubmission.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.creating = false;
        state.submissions.unshift(action.payload);
        state.selectedSubmission = action.payload;
        state.success = 'Submission created successfully!';
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // Update Submission Content
      .addCase(updateSubmissionContent.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateSubmissionContent.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.submissions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
        state.selectedSubmission = action.payload;
        state.success = 'Submission updated successfully!';
      })
      .addCase(updateSubmissionContent.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Submit Assignment
      .addCase(submitAssignment.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.submissions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
        state.selectedSubmission = action.payload;
        state.success = 'Assignment submitted successfully!';
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Perform AI Grading
      .addCase(performAIGrading.pending, (state) => {
        state.aiGrading = true;
        state.error = null;
      })
      .addCase(performAIGrading.fulfilled, (state, action) => {
        state.aiGrading = false;
        const index = state.submissions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
        state.selectedSubmission = action.payload;
        state.success = 'AI grading completed successfully!';
      })
      .addCase(performAIGrading.rejected, (state, action) => {
        state.aiGrading = false;
        state.error = action.payload;
      })

      // Review AI Grading
      .addCase(reviewAIGrading.pending, (state) => {
        state.grading = true;
        state.error = null;
      })
      .addCase(reviewAIGrading.fulfilled, (state, action) => {
        state.grading = false;
        const index = state.submissions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
        state.selectedSubmission = action.payload;
        state.success = 'AI grading review completed!';
      })
      .addCase(reviewAIGrading.rejected, (state, action) => {
        state.grading = false;
        state.error = action.payload;
      })

      // Grade Submission Manually
      .addCase(gradeSubmissionManually.pending, (state) => {
        state.grading = true;
        state.error = null;
      })
      .addCase(gradeSubmissionManually.fulfilled, (state, action) => {
        state.grading = false;
        const index = state.submissions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
        state.selectedSubmission = action.payload;
        state.success = 'Submission graded successfully!';
      })
      .addCase(gradeSubmissionManually.rejected, (state, action) => {
        state.grading = false;
        state.error = action.payload;
      })

      // Perform Plagiarism Check
      .addCase(performPlagiarismCheck.pending, (state) => {
        state.plagiarismChecking = true;
        state.error = null;
      })
      .addCase(performPlagiarismCheck.fulfilled, (state, action) => {
        state.plagiarismChecking = false;
        const index = state.submissions.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
        state.selectedSubmission = action.payload;
        state.success = 'Plagiarism check completed!';
      })
      .addCase(performPlagiarismCheck.rejected, (state, action) => {
        state.plagiarismChecking = false;
        state.error = action.payload;
      })

      // Bulk AI Grading
      .addCase(bulkAIGrading.pending, (state) => {
        state.bulkProcessing = true;
        state.error = null;
      })
      .addCase(bulkAIGrading.fulfilled, (state, action) => {
        state.bulkProcessing = false;
        state.success = `Bulk AI grading completed: ${
          action.payload.successful || 0
        } successful, ${action.payload.failed || 0} failed`;
      })
      .addCase(bulkAIGrading.rejected, (state, action) => {
        state.bulkProcessing = false;
        state.error = action.payload;
      })

      // Bulk Plagiarism Check
      .addCase(bulkPlagiarismCheck.pending, (state) => {
        state.bulkProcessing = true;
        state.error = null;
      })
      .addCase(bulkPlagiarismCheck.fulfilled, (state, action) => {
        state.bulkProcessing = false;
        state.success = `Bulk plagiarism check completed: ${
          action.payload.successful || 0
        } checked, ${action.payload.flagged || 0} flagged`;
      })
      .addCase(bulkPlagiarismCheck.rejected, (state, action) => {
        state.bulkProcessing = false;
        state.error = action.payload;
      });
  },
});

export const {
  // UI Actions
  clearError,
  clearSuccess,
  setSelectedSubmission,
  clearSelectedSubmission,

  // Filter Actions
  setStatusFilter,
  setAssignmentFilter,
  setStudentFilter,
  setGradedFilter,
  setAIGradedFilter,
  setPlagiarismFlaggedFilter,
  setDateRangeFilter,
  clearFilters,

  // Submission Form Actions
  setSubmissionFormData,
  clearSubmissionForm,
  addAttachment,
  removeAttachment,

  // Grading Actions
  setGradingData,
  clearGradingData,

  // View Actions
  setView,
  setSortBy,
  setSortOrder,

  // Local State Updates
  updateSubmissionLocally,
  markSubmissionAsGraded,
  markSubmissionAsPlagiarismChecked,
} = submissionSlice.actions;

// Selectors
export const selectAllSubmissions = (state) => state.submissions.submissions;
export const selectSubmissionById = (id) => (state) =>
  state.submissions.submissions.find((submission) => submission.id === id);
export const selectSelectedSubmission = (state) =>
  state.submissions.selectedSubmission;
export const selectCurrentUserSubmissions = (state) =>
  state.submissions.currentUserSubmissions;
export const selectSubmissionStatistics = (state) =>
  state.submissions.statistics;
export const selectSubmissionFilters = (state) => state.submissions.filters;
export const selectSubmissionForm = (state) => state.submissions.submissionForm;
export const selectGradingData = (state) => state.submissions.gradingData;
export const selectSubmissionLoading = (state) => state.submissions.loading;
export const selectSubmissionError = (state) => state.submissions.error;
export const selectSubmissionSuccess = (state) => state.submissions.success;

// Filtered submissions selector
export const selectFilteredSubmissions = (state) => {
  const { submissions, filters } = state.submissions;

  return submissions.filter((submission) => {
    const matchesStatus =
      !filters.status || submission.status === filters.status;
    const matchesAssignment =
      !filters.assignment || submission.assignment?.id === filters.assignment;
    const matchesStudent =
      !filters.student || submission.student?.studentId === filters.student;
    const matchesGraded =
      filters.graded === null || submission.isGraded === filters.graded;
    const matchesAIGraded =
      filters.aiGraded === null ||
      (submission.aiGrading?.score !== null) === filters.aiGraded;
    const matchesPlagiarismFlagged =
      filters.plagiarismFlagged === null ||
      (submission.plagiarismCheck?.status === 'FLAGGED') ===
        filters.plagiarismFlagged;

    return (
      matchesStatus &&
      matchesAssignment &&
      matchesStudent &&
      matchesGraded &&
      matchesAIGraded &&
      matchesPlagiarismFlagged
    );
  });
};

export default submissionSlice.reducer;
