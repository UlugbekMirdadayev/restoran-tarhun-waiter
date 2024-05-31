import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage['user'] || 'null');

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (_, { payload }) => {
      localStorage.setItem('user', JSON.stringify(payload));
      return payload;
    }
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
