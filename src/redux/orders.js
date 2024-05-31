import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, { payload }) => {
      return payload;
    }
  }
});

export const { setOrders } = orderSlice.actions;

export default orderSlice.reducer;
