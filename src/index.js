import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global/style.css';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ToastContainer limit={5} autoClose={1000} position="top-center" />
  </Provider>
);
