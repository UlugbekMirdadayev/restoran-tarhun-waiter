import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, { payload }) => {
      return payload;
    }
  }
});

export const { setProducts } = productSlice.actions;

export default productSlice.reducer;
