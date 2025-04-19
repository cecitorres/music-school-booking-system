import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setStudents } = studentsSlice.actions;
export default studentsSlice.reducer;
