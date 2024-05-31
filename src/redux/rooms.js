import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, { payload }) => {
      return payload;
    }
  }
});

export const { setRooms } = roomSlice.actions;

export default roomSlice.reducer;
