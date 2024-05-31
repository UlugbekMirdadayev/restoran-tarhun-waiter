import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { post } from 'services/api';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSubmit = (form) => {
    form.preventDefault();
    const { full_name = '', phone_number = '', password = '' } = Object.fromEntries(new FormData(form.target));
    if (!full_name || !phone_number || !password) {
      return setError(true);
    }
    setError(false);
    setLoading(true);
    post('auth/register', {
      full_name,
      phone_number: phone_number?.replace('+', ''),
      password
    })
      .then(() => {
        toast.success('Muvaffaqiyatli ro`yxatdan o`tdingiz');
        navigate('/login');
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(JSON.stringify(err?.response?.data?.errors || 'Xatolik yuz berdi'));
      });
  };
  return (
    <>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form onSubmit={onSubmit} className={error ? 'error' : ''}>
        <h3>{"Ro'yxatdan o'tish"}</h3>

        <label htmlFor="full_name">{"To'liq ism"}</label>
        <input type="text" placeholder="ism familiya" id="full_name" name="full_name" />

        <label htmlFor="phone_number">Telefon raqami</label>
        <input type="tel" placeholder="998xxxyyzz" id="phone_number" name="phone_number" defaultValue={'+998'} />

        <label htmlFor="password">Parol</label>
        <input type="password" placeholder="Parol" id="password" name="password" />
        <label className="error"> {error ? "Ma'lumotlarni to'liq kiriting !" : null}</label>
        <button type="submit" disabled={loading}>
          {loading ? <div className="lds-dual-ring" /> : "Ro'yxatdan o'tish"}
        </button>
        <NavLink to={'/login'}>
          <button type="button">{'Kirish'}</button>
        </NavLink>
      </form>
    </>
  );
};

export default Register;
