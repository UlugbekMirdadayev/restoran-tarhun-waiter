import React, { useState, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProducts, useRooms, useUser } from '../redux/selectors';
import { CartIcon, CompleteIcon } from 'components/icons';
import { getRequest } from 'services/api';
import { toast } from 'react-toastify';
import { setRoomCompleted } from '../redux/localeOrders';
import { useDispatch } from 'react-redux';
import OrderList from 'components/order-list';
import { formatCurrencyUZS } from 'utils';

const Rooms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rooms = useRooms();
  const modal = useRef();
  const user = useUser();
  const products = useProducts();
  const [isOrderMore, setIsOrderMore] = useState({ open: false });
  const [loading, setLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [oldOrders, setOldOrders] = useState({});
  const [countClient, setCountClient] = useState(5);

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
  const handleComplete = () => {
    setLoading(true);
    getRequest(`room/end/${isOrderMore.open}?count_client=${countClient}`, user?.token)
      .then(({ data }) => {
        setLoading(false);
        toast.success(data?.result);
        dispatch(setRoomCompleted({ room: isOrderMore.open }));
        setIsOrderMore({ open: false });
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.result);
      });
  };

  const handleOpenDetails = (e, room_id) => {
    e.preventDefault();
    e.stopPropagation();
    getOldOrders(room_id);
    setIsOrderMore({ open: room_id });
  };

  const getOldOrders = useCallback(
    (room_id) => {
      getRequest(`room/get/${room_id}`, user?.token)
        .then(({ data }) => {
          setOldOrders(data?.result);
          if (!data?.result?.products?.length) {
            setIsOrderMore({ open: false });
          } else {
            setCountClient(data?.result?.count_client);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.result);
        });
    },
    [user?.token]
  );

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
      {isOrderMore.open && (
        <div
          className="modal modal-prods"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="modal-body" ref={modal}>
            <div className="top">
              <div className="row-header">
                <button onClick={() => setIsOrderMore({ open: false })}>Ortga</button>
                {/* <button onClick={() => handleCancel(isOrderMore?.id)}>
                  {loading ? <div className="lds-dual-ring" /> : 'Bekor qilish'}
                </button> */}
              </div>
              <ol className="alternating-colors">
                <strong>{"Buyurtma ma'lumotlari"}</strong>
                {oldOrders?.products?.map((product) => (
                  <OrderList
                    key={product?.name}
                    product={{
                      ...product,
                      id: products?.find(({ name }) => name === product?.name)?.id
                    }}
                    loading={loading}
                    setLoading={setLoading}
                    room={isOrderMore.open}
                    token={user?.token}
                    onUpdated={() => getOldOrders()}
                  />
                ))}
                <br />
                <h2>Nechi kishi bor edi</h2>
                <select className="styled-select" value={countClient} onChange={(e) => setCountClient(e.target.value)}>
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </ol>
            </div>
            <button className="order-btn full-btn" onClick={handleComplete}>
              Buyurtmani yopish {oldOrders?.total && `${formatCurrencyUZS(oldOrders?.total)?.replace('UZS', '')} UZS`}
            </button>
          </div>
        </div>
      )}
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
                    onClick={(e) => handleOpenDetails(e, room?.id)}
                    disabled={user?.role === 1 ? !room?.user_id : user?.id !== room?.user_id}
                  >
                    {loadingComplete === room?.id ? <div className="lds-dual-ring" style={{ '--color': '#fff' }} /> : <CompleteIcon />}
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
