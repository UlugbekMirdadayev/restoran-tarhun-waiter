import React, {
  useCallback,
  useEffect,
  useMemo,
  // useRef,
  useState
} from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Accord from 'components/accord';
import { formatCurrencyUZS } from 'utils';
// import { useOutsideClick } from 'utils/hooks';
// import { departments, sendMessageTelegram } from 'utils/constants';
import { getRequest, postRequest } from 'services/api';
import {
  useLocaleOrders,
  // useOrders,
  useProducts,
  useUser
} from '../redux/selectors';
import { setRoomCompleted } from '../redux/localeOrders';
// import OrderList from 'components/order-list';
import { setProducts } from '../redux/products';
// import axios from 'axios';

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useUser();
  const localeOrders = useLocaleOrders();
  const productsData = useProducts();
  // const orders = useOrders();
  const { id } = useParams();
  // const modal = useRef();
  const [loading, setLoading] = useState();
  const [typeProds, setTypeProds] = useState(null);

  const products = useMemo(() => productsData?.filter(({ category }) => category?.type === typeProds), [typeProds, productsData]);

  // const [isOrderMore, setIsOrderMore] = useState({ open: false });
  const [oldOrders, setOldOrders] = useState({});
  // const rooms = useRooms();
  // const thisRoom = useMemo(() => rooms?.find((rooms) => rooms.id === id), [rooms, id]);
  const thisRoomOrders = useMemo(() => localeOrders?.find((rooms) => rooms.room === id)?.recs, [localeOrders, id]);
  const sumWithInitial = thisRoomOrders?.reduce((accumulator, currentValue) => {
    return Number(accumulator) + Number(currentValue.sell_price * currentValue.count);
  }, []);
  const [search, setSearch] = useState('');

  const menus = useMemo(() => {
    const types = [...new Set(products?.map(({ category }) => category?.name))];
    return types
      ?.map((_category_name) => {
        return {
          name: _category_name,
          menus: products?.filter(
            ({ category, name }) =>
              category?.name === _category_name && (search?.length ? name.toLowerCase()?.includes(search?.toLowerCase()) : true)
          )
        };
      })
      .filter(({ menus }) => menus?.find((prod) => prod?.name?.toLowerCase()?.includes(search.toLowerCase())));
  }, [products, search]);

  // const isOrder = useMemo(() => orders?.find((order) => order?.room_id === id), [orders, id]);

  const getOldOrders = useCallback(() => {
    getRequest(`room/get/${id}`, user?.token)
      .then(({ data }) => {
        setOldOrders(data?.result);
        // if (!data?.result?.products?.length) {
        //   setIsOrderMore({ open: false });
        // } else {
        //   setCountClient(data?.result?.count_client);
        // }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.result);
      });
  }, [id, user?.token]);

  useEffect(() => {
    getOldOrders();
  }, [getOldOrders]);

  const getProduct = useCallback(() => {
    setLoading(true);
    getRequest('product/get', user?.token)
      .then((products) => {
        setLoading(false);
        dispatch(setProducts(products?.data?.result));
      })
      .catch((err) => {
        console.log(err?.response?.data?.result);
        setLoading(false);
      });
  }, [dispatch]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [countClient, setCountClient] = useState(5);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    handleAddCart();
  };

  const handleAddCart = () => {
    const formData = {
      count_client: countClient,
      room_id: id,
      products_id: thisRoomOrders?.map(({ id }) => id),
      products_quantity: thisRoomOrders?.map(({ count }) => count),
      action: 'plus'
    };
    oldOrders?.total && delete formData.count_client;

    setLoading(true);
    postRequest('room/merge', formData, user?.token)
      .then(({ data }) => {
        setLoading(false);
        getOldOrders();
        toast.success(data?.result);
        dispatch(setRoomCompleted({ room: id }));
        getProduct();
      })
      .catch((err) => {
        toast.error(err?.response?.data?.result || 'Error');
        setLoading(false);
      });
  };

  // const handleOpenDetails = () => {
  //   setIsOrderMore({ open: true });
  // };

  // const handleComplete = () => {
  //   setLoading(true);
  //   getRequest(`room/end/${id}?count_client=${countClient}`, user?.token)
  //     .then(({ data }) => {
  //       setLoading(false);
  //       toast.success(data?.result);
  //       dispatch(setRoomCompleted({ room: id }));
  //       getOldOrders();
  //       setIsOrderMore({ open: false });
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       toast.error(err?.response?.data?.result);
  //     });
  // };

  // useOutsideClick(modal, () => setIsOrderMore({ open: false }));

  return (
    <div className="container-md order-container">
      {typeProds ? (
        <>
          <input type="search" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
          {modalIsOpen && (
            <div className="modal-overlay" onClick={() => setModalIsOpen(false)}>
              <div className="modal-cc" onClick={(e) => e.stopPropagation()}>
                <h2>Nechi kishi bor</h2>
                <select className="styled-select" value={countClient} onChange={(e) => setCountClient(e.target.value)}>
                  {Array.from({ length: 21 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
                <button onClick={closeModal}>Yuborish</button>
              </div>
            </div>
          )}
          {/* {isOrderMore.open && (
        <div className="modal modal-prods">
          <div className="modal-body" ref={modal}>
            <div className="top">
              <div className="row-header">
                <button onClick={() => setIsOrderMore({ open: false })}>Ortga</button>
                * <button onClick={() => handleCancel(isOrderMore?.id)}>
                  {loading ? <div className="lds-dual-ring" /> : 'Bekor qilish'}
                </button> *
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
                    room={id}
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
      )} */}
          <div className="row-header sticky-row-header">
            <NavLink to={'#'} onClick={() => setTypeProds(null)}>
              <button>Ortga qaytish</button>
            </NavLink>
            <h1 onClick={() => navigate(-1)} className="full">
              Menu
            </h1>
          </div>

          {menus
            ?.sort((a, b) => a?.name?.localeCompare(b?.name))
            ?.map((room, key) => (
              <Accord key={key} room={room} id={id} thisRoomOrders={thisRoomOrders} />
            ))}
          <div className="bottom-btns">
            {/* {oldOrders?.total ? (
          <button className="order-btn" disabled={loading} onClick={() => handleOpenDetails(isOrder?.id)}>
            {loading ? (
              <div className="lds-dual-ring" />
            ) : (
              <span>Buyurtmani yopish {oldOrders?.total && `${formatCurrencyUZS(oldOrders?.total)?.replace('UZS', '')} UZS`}</span>
            )}
          </button>
        ) : (
          ''
        )} */}
            {thisRoomOrders?.length ? (
              <button disabled={loading} className="order-btn" onClick={oldOrders?.total ? handleAddCart : openModal}>
                {loading ? (
                  <div className="lds-dual-ring" />
                ) : (
                  <span>Buyurtma berish {sumWithInitial && `${formatCurrencyUZS(sumWithInitial)?.replace('UZS', '')} UZS`}</span>
                )}
              </button>
            ) : (
              ''
            )}
          </div>
        </>
      ) : (
        <>
          <div className="row-header">
            <NavLink to={-1}>
              <button>Ortga qaytish</button>
            </NavLink>
            <h1 className="full">Menu</h1>
          </div>
          <div className="grid">
            <Link to={'#'} className={`room`} onClick={() => setTypeProds('1')}>
              <p>Бар</p>
            </Link>
            <Link to={'#'} className={`room`} onClick={() => setTypeProds('2')}>
              <p>Блюда</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Order;
