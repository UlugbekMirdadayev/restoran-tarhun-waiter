import React, { lazy } from 'react';

const routes = [
  { path: '/', element: lazy(() => import('../pages/rooms')) },
  { path: '/rooms', element: lazy(() => import('../pages/rooms')) },
  { path: '/order/:id', element: lazy(() => import('../pages/order')) },
  { path: '/login', element: lazy(() => import('../pages/auth/login')) },
  { path: '/register', element: lazy(() => import('../pages/auth/register')) },
  { path: '*', element: lazy(() => import('../pages/404')) }
];

export default routes.map((r) => {
  return {
    path: r.path,
    element: <r.element />
  };
});
