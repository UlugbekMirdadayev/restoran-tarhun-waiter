import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getRequest, postRequest } from 'services/api';
import { useLocaleOrders, useUser } from '../../redux/selectors';
import { setProducts } from '../../redux/products';
import { setOrders } from '../../redux/orders';
import { setUser } from '../../redux/user';
import * as i from 'assets/icon';
import './style.css';
import { setRooms } from '../../redux/rooms';
import { useOutsideClick } from 'utils/hooks';
import { toast } from 'react-toastify';

const links = [
  { label: 'Joylar royxati', to: '/rooms' },
  { label: 'Chiqish', to: '/', logout: true }
];

const Header = () => {
  const headerModal = useRef();
  const user = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const localeOrders = useLocaleOrders();
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, []);

  const getRoom = () => {
    getRequest('room/get', user?.token)
      .then(({ data }) => {
        dispatch(setRooms(data?.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProduct = () => {
    getRequest('product/get', user?.token)
      .then((products) => {
        dispatch(setProducts(products?.data?.result));
      })
      .catch((err) => {
        console.log(err?.response?.data?.result);
        setLoading(false);
      });
  };

  useEffect(() => {
    getRoom();
    getProduct();
  }, [user?.token]);

  const handleExit = () => {
    setOpen(false);
    dispatch(setUser(null));
    dispatch(setOrders([]));
    dispatch(setProducts([]));
    dispatch(setRooms([]));
    localStorage.clear();
    postRequest('auth/logout', {}, user?.token)
      .then(({ data }) => {
        toast.info(data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
    navigate('/register', { replace: true });
  };

  useOutsideClick(headerModal, () => setOpen(false));

  return (
    <header>
      {open && (
        <div className="modal" ref={headerModal}>
          <ul className="list-bar">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  className={link.logout ? 'logout' : undefined}
                  onClick={() => {
                    setOpen(link.logout || false);
                    if (link.logout) {
                      setConfirmLogout(true);
                    }
                  }}
                  to={link.to}
                >
                  {link.logout ? <i.LogOut /> : null}
                  {link.label}
                </NavLink>
              </li>
            ))}
            {confirmLogout && (
              <div className="absolute">
                <button className="reject" onClick={handleExit}>
                  Ha
                </button>
                <button className="resolve" onClick={() => setConfirmLogout(false)}>
                  {"Yo'q"}
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
      <button
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(!open);
        }}
      >
        <i.Menu />
      </button>
      <NavLink onClick={() => setOpen(false)} className={'profile-link'} to={'/rooms'}>
        {/* <img src={'https://picsum.photos/50/50'} alt="profile" /> */}
        <span className="word-user">{loading ? <div className="lds-dual-ring" /> : user?.full_name?.slice(0, 1) || 'H'}</span>
        {localeOrders?.length ? <span className="count-orders">{localeOrders?.length || ''}</span> : ''}
      </NavLink>
    </header>
  );
};

export default Header;
