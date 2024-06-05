import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRooms, useUser } from '../redux/selectors';
import { CartIcon, CompleteIcon } from 'components/icons';
import { getRequest } from 'services/api';
import { toast } from 'react-toastify';
import { setRoomCompleted } from '../redux/localeOrders';
import { useDispatch } from 'react-redux';

const Rooms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rooms = useRooms();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [orderData, setOrderData] = useState({});

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const room_type = searchParams.get('room_type');

  const handleViewCart = (e, room_id, isClose) => {
    e.preventDefault();
    e.stopPropagation();
    isClose && setLoadingComplete(room_id);
    setLoading(room_id);
    getRequest(`room/see/${room_id}`, user?.token)
      .then(({ data }) => {
        setLoading(false);
        setOrderData(data);
        isClose && setLoadingComplete(room_id);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const handleComplete = (room_id) => {
    getRequest(`room/end/${room_id}?count_client=${orderData?.result?.room?.count_client}`, user?.token)
      .then(({ data }) => {
        setLoadingComplete(false);
        toast.success(data?.result);
        setOrderData({});
        dispatch(setRoomCompleted({ room: room_id }));
      })
      .catch((err) => {
        setLoadingComplete(false);
        toast.error(err?.response?.data?.result);
      });
  };

  return (
    <div className="container-md">
      {orderData?.result && (
        <div
          className="modal-overlay"
          onClick={() => {
            setOrderData({});
            setLoadingComplete(false);
          }}
        >
          <div className="products-view" onClick={(e) => e.stopPropagation()}>
            <h1>Продукты</h1>
            <br />
            <div className="prducts-grid">
              <div className="prducts-item">
                <table>
                  <thead>
                    <tr>
                      <th>Имя</th>
                      <th>Цена</th>
                      <th>Количество</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData?.result?.products?.map((item) => (
                      <tr key={item?.id}>
                        <td>{item?.name}</td>
                        <td>{item?.sell_price}</td>
                        <td>{item?.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <br />
            <p>Количество клиентов: {orderData?.result?.room?.count_client}</p>
            <button onClick={() => (loadingComplete ? handleComplete(orderData?.result?.room?.id) : setOrderData({}))}>
              {loadingComplete ? 'Yopish' : 'OK'}
            </button>
          </div>
        </div>
      )}
      <div className="row-header">
        <h1 className="full" onClick={() => navigate('/prerooms')}>
          joylar royxati
        </h1>
      </div>
      <div className="grid">
        {[...rooms]
          .filter((item) => item.room_type_name === room_type)
          ?.sort((a, b) => +a?.name - +b?.name)
          ?.map((room) => (
            <Link
              to={
                user?.role === 1
                  ? `/order/${room?.id}`
                  : room?.is_active
                  ? room?.is_belongs_to_user
                    ? `/order/${room?.id}`
                    : `/rooms?room_type=${room_type}`
                  : `/order/${room?.id}`
              }
              key={room?.id}
              className={`room ${room?.is_active ? 'busy' : ''} ${
                user?.role === 1 ? '' : room?.is_active ? (room?.is_belongs_to_user ? '' : 'disabled') : ''
              }`}
            >
              {(user?.role === 1 ? room?.user_id : user?.id === room?.user_id) ? (
                <>
                  <button
                    className="cart-view"
                    onClick={(e) => handleViewCart(e, room?.id, true)}
                    disabled={user?.role === 1 ? !room?.user_id : user?.id !== room?.user_id}
                  >
                    {loadingComplete === room?.id ? <div className="lds-dual-ring" style={{ '--color': '#fff' }} /> : <CompleteIcon  />}
                  </button>
                  <button
                    className="cart-closer"
                    onClick={(e) => handleViewCart(e, room?.id)}
                    disabled={user?.role === 1 ? !room?.user_id : user?.id !== room?.user_id}
                  >
                    {(loadingComplete ? false : loading === room?.id) ? (
                      <div className="lds-dual-ring" style={{ '--color': '#fff' }} />
                    ) : (
                      <CartIcon />
                    )}
                  </button>
                </>
              ) : null}
              <p>{room?.name}</p>
              {room?.is_active ? <p>band stol</p> : null}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Rooms;
