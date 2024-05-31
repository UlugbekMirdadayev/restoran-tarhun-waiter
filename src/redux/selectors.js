import { useSelector } from 'react-redux';

export const useLocaleOrders = () => useSelector(({ localeOrders }) => localeOrders);
export const useUser = () => useSelector(({ user }) => user);
export const useRooms = () => useSelector(({ rooms }) => rooms);
export const useProducts = () => useSelector(({ products }) => products);
export const useOrders = () => useSelector(({ orders }) => orders);
