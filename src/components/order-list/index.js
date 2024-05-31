/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Minus } from 'assets/icon';
import { formatCurrencyUZS } from 'utils';
import { postRequest } from 'services/api';
import { toast } from 'react-toastify';

const OrderList = ({ product, loading, setLoading, room, token, onUpdated }) => {
  const [returnedProduct, setReturnedProduct] = useState(0);
  const handleRemoveProduct = () => {
    if (!product?.id) {
      return toast.error('Maxsulot topilmadi');
    }
    if (product?.quantity > 1 && !returnedProduct) {
      return toast.info(`Qaytarilgan maxsulotlar sonini tanlang!`);
    }

    const formData = {
      room_id: room,
      products_id: [product?.id],
      products_quantity: [product?.quantity === 1 ? 1 : returnedProduct],
      action: 'minus'
    };
    setLoading(true);
    postRequest('room/merge', formData, token)
      .then(({ data }) => {
        toast.success(data?.result);
        setLoading(false);
        setReturnedProduct(0);
        onUpdated();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <li key={product?.name}>
      <button disabled={loading} className="remove" onClick={handleRemoveProduct}>
        {loading ? <div className="lds-dual-ring" /> : <Minus />}
      </button>
      <strong className="row">
        <span> {product?.name}</span> <span>{product?.quantity}X</span>
      </strong>
      <p>Narxi {`${formatCurrencyUZS(product?.total)?.replace('UZS', '')} UZS`}</p>
      {product?.quantity > 1 && (
        <strong className="row">
          <span>Qaytarilgan maxsulotlar</span>
          <select className="returned-product" onChange={(e) => setReturnedProduct(e.target.value)}>
            {Array.from({ length: product?.quantity }).map((_, index) => (
              <option key={index} value={index}>
                {index}
              </option>
            ))}
          </select>
        </strong>
      )}
    </li>
  );
};

export default OrderList;
