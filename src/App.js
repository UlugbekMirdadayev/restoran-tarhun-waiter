import React, { Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import routes from './routes';
import Header from 'components/header';
import { useUser } from './redux/selectors';
import { setRooms } from './redux/rooms';

const SOCKET_SERVER_URL = 'wss://crmtarhun.dadabayev.uz/websocket/';

const privatPages = ['/register', '/login'];

const App = () => {
  const { pathname } = useLocation();
  const user = useUser();
  const dispatch = useDispatch();

  const methods = {
    updateRooms: (data) => {
      dispatch(setRooms(data?.rooms?.map((room) => ({ ...room, is_belongs_to_user: room?.user_id === user?.id }))));
    }
  };

  useEffect(() => {
    const socket = new WebSocket(SOCKET_SERVER_URL); // Replace with your WebSocket server URL

    socket.onopen = () => {
      console.log('Connected to WebSocket server');

      const message = JSON.stringify({
        method: 'createUser',
        ownerId: user?.id // Replace $owner_id with the actual owner ID value
      });

      socket.send(message);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event?.data || '{}');
      methods[message?.method]?.(message);
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
    return () => {
      socket.close();
    };
  }, [user?.id]);

  return (
    <div className="container">
      {privatPages.includes(pathname) ? null : <Header />}
      <Suspense fallback={<div className="lds-dual-ring app-loader" />}>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
