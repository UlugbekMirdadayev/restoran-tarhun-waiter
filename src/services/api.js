import axios from 'axios';
import { BASE_URL } from 'utils/constants';

const configuration = (token) => {
  return {
    validateStatus: function (status) {
      if ([403, 401].includes(status)) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return status >= 200 && status < 300;
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const defaultRequest = new Promise((resolve, reject) => {
  resolve('Success');
  reject('Error');
});
export const getRequest = (url, token) => {
  const config = configuration(token);
  return token ? axios.get(BASE_URL + url, config) : defaultRequest;
};

export const postRequest = (url, data = {}, token) => {
  const config = configuration(token);
  return token ? axios.post(BASE_URL + url, data, config) : defaultRequest;
};
export const patchRequest = (url, data = {}, token) => {
  const config = configuration(token);
  return token ? axios.patch(BASE_URL + url, data, config) : defaultRequest;
};
export const deleteRequest = (url, token) => {
  const config = configuration(token);
  return token ? axios.delete(BASE_URL + url, config) : defaultRequest;
};
export const post = (url, data = {}, config) => axios.post(BASE_URL + url, data, config);
