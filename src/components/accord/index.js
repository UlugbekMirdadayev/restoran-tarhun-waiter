/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addLocaleOrder, removeLocaleOrder } from '../../redux/localeOrders';
import { Minus, Plus } from 'assets/icon';
import { IMG_URL } from 'utils/constants';
import { formatCurrencyUZS } from 'utils';

const Accord = ({ room, id, defaultOpened = false, thisRoomOrders = [] }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(defaultOpened);

  const handleAddBasket = useCallback(
    (recep) => {
      if (recep?.is_infinite) return dispatch(addLocaleOrder({ ...recep, room: id }));
      if (recep?.quantity >= thisSelectedProd(recep)?.count + 1) {
        dispatch(addLocaleOrder({ ...recep, room: id }));
      }
    },
    [id, thisRoomOrders]
  );

  const handleRemoveBasket = useCallback(
    (recep) => {
      dispatch(removeLocaleOrder({ ...recep, room: id }));
    },
    [id]
  );

  const thisSelectedProd = (prods) => {
    return thisRoomOrders?.find((rec) => rec?.id === prods?.id) || { count: 0 };
  };

  return (
    <>
      <div className={`row-header accord ${open ? 'opened' : ''}`} onClick={() => setOpen(!open)}>
        <h1 className="full">
          {room?.menus?.[0] && <img className="opener-image" src={IMG_URL + room?.menus?.[0]?.image_path} alt={room?.menus?.[0]?.name} />}
          {room?.name}
          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 330 330">
            <path
              id="XMLID_224_"
              d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394  l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393  C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
            />
          </svg>
        </h1>
      </div>
      {open && (
        <div className="grid">
          {room.menus.map((recep, index) => (
            <div key={index} className={`room rec`}>
              <img className="product-image" src={IMG_URL + recep?.image_path} alt={recep.name} />
              <span className="title-prod">{recep?.name}</span>
              <div>
                <div className="price-prod">Narxi: {formatCurrencyUZS(recep?.sell_price)}</div>
                <span className="price-prod">Soni: {recep?.is_infinite ? 'Cheksiz' : recep?.quantity}</span>
              </div>
              {thisSelectedProd(recep)?.count ? (
                <button className="row-bottom">
                  <Minus onClick={() => handleRemoveBasket(recep)} />
                  {thisSelectedProd(recep)?.count}
                  <Plus onClick={() => handleAddBasket(recep)} />
                </button>
              ) : (
                <button onClick={() => handleAddBasket(recep)}>{`Qo'shish`}</button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Accord;
