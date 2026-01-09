import { createSlice } from "@reduxjs/toolkit";

const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    teachers: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchTeachersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeachersSuccess: (state, action) => {
      state.teachers = action.payload;
      state.loading = false;
    },
    fetchTeachersFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    approveTeacherStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    approveTeacherSuccess: (state, action) => {
      state.teachers = state.teachers.map((teacher) =>
        teacher._id === action.payload._id
          ? { ...teacher, isApprove: true }
          : teacher
      );
      state.loading = false;
    },
    approveTeacherFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    unapproveTeacherStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    unapproveTeacherSuccess: (state, action) => {
      state.teachers = state.teachers.map((teacher) =>
        teacher._id === action.payload._id
          ? { ...teacher, isApprove: false }
          : teacher
      );
      state.loading = false;
    },
    unapproveTeacherFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteTeacherStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteTeacherSuccess: (state, action) => {
      state.teachers = state.teachers.filter(
        (teacher) => teacher._id !== action.payload._id
      );
      state.loading = false;
    },
    deleteTeacherFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  
});

export const {
  fetchTeachersStart,
  fetchTeachersSuccess,
  fetchTeachersFailure,
  approveTeacherStart,
  approveTeacherSuccess,
  approveTeacherFailure,
  unapproveTeacherStart,
  unapproveTeacherSuccess,
  unapproveTeacherFailure,
  deleteTeacherStart,
  deleteTeacherSuccess,
  deleteTeacherFailure,
} = teacherSlice.actions;

export default teacherSlice.reducer;
