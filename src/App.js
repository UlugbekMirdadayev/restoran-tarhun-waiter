import React, { Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import routes from './routes';
import Header from 'components/header';
import { useUser } from './redux/selectors';
import { setRooms } from './redux/rooms';
import { postRequest } from 'services/api';
import { toast } from 'react-toastify';
import { setUser } from './redux/user';
import { setOrders } from './redux/orders';
import { setProducts } from './redux/products';
import { setModifiers } from './redux/modifiers';

const SOCKET_SERVER_URL = 'wss://crmtarhun.dadabayev.uz/websocket/';

const privatPages = ['/register', '/login'];

const App = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useUser();
  const dispatch = useDispatch();

  const methods = {
    updateRooms: (data) => {
      dispatch(setRooms(data?.rooms?.map((room) => ({ ...room, is_belongs_to_user: room?.user_id === user?.id }))));
    },
    kickUser: (data) => {
      if (data?.user_id) return;
      console.log({ data }, 'kickUser');
      if (data?.user_id === user?.id) {
        dispatch(setUser(null));
        dispatch(setOrders([]));
        dispatch(setProducts([]));
        dispatch(setRooms([]));
        dispatch(setModifiers([]));
        localStorage.clear();
        postRequest('auth/logout', {}, user?.token)
          .then(({ data }) => {
            toast.info(data?.result);
          })
          .catch((err) => {
            console.log(err);
          });
        navigate('/register', { replace: true });
      }
    }
  };

  useEffect(() => {
    const socket = new WebSocket(SOCKET_SERVER_URL); // Replace with your WebSocket server URL

    socket.onopen = () => {
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

  useEffect(() => {
    const socket = new WebSocket(SOCKET_SERVER_URL); // Replace with your WebSocket server URL
    socket.onopen = () => {
      const message = JSON.stringify({
        method: 'kickUser',
        user_id: user?.id // Replace $owner_id with the actual owner ID value
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
