import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const modifierSlice = createSlice({
  name: 'modifiers',
  initialState,
  reducers: {
    setModifiers: (state, { payload }) => {
      return payload;
    }
  }
});

export const { setModifiers } = modifierSlice.actions;

export default modifierSlice.reducer;
