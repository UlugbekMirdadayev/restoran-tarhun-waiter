import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import rooms from './rooms';
import localeOrders from './localeOrders';
import products from './products';
import orders from './orders';

export const store = configureStore({
  reducer: {
    user,
    rooms,
    products,
    orders,
    localeOrders
  }
});
