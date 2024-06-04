import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRooms, useUser } from '../redux/selectors';
import { CartIcon } from 'components/icons';
import { getRequest } from 'services/api';

const Rooms = () => {
  const navigate = useNavigate();
  const rooms = useRooms();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({});

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const room_type = searchParams.get('room_type');

  const handleViewCart = (e, room_id) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(room_id);
    getRequest(`room/see/${room_id}`, user?.token)
      .then(({ data }) => {
        setLoading(false);
        setOrderData(data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="container-md">
      {orderData?.result && (
        <div className="modal-overlay" onClick={() => setOrderData({})}>
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
            <button onClick={() => setOrderData({})}>OK</button>
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
                    : undefined
                  : `/order/${room?.id}`
              }
              key={room?.id}
              className={`room ${room?.is_active ? 'busy' : ''} ${
                user?.role === 1 ? '' : room?.is_active ? (room?.is_belongs_to_user ? '' : 'disabled') : ''
              }`}
            >
              <button
                className="cart-view"
                onClick={(e) => handleViewCart(e, room?.id)}
                disabled={user?.role === 1 ? !room?.user_id : user?.id !== room?.user_id}
              >
                {loading === room?.id ? <div className="lds-dual-ring" style={{ '--color': '#fff' }} /> : <CartIcon />}
              </button>
              <p>{room?.name}</p>
              {room?.is_active ? <p>band stol</p> : null}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Rooms;
