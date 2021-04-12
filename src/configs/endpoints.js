const BASE = `${process.env.REACT_APP_BACK_END_URL}`;

const endpoints = {
  BASE,
  AUTHENTICATION: `${BASE}/users/verify-authentication`,
  REGISTER: `${BASE}/users/signup`,
  LOGIN: `${BASE}/users/signin`,
  LOGOUT: `${BASE}/users/signout`,
  CONFIRM_OTP: `${BASE}/users/confirm-otp`,
  UPLOAD: `${BASE}/auth/files/upload`,
  DOWNLOAD: `${BASE}/files/download`,
  GET_BUCKET: `${BASE}/auth/buckets/all`,
  CREATE_BUCKET: `${BASE}/auth/buckets/`,
  DELETE_BUCKET: `${BASE}/auth/buckets/`,
  GET_BUCKET_ITEMS: `${BASE}/auth/files/all`,
  GET_ACCESS_KEY: `${BASE}/auth/accessKey/all/`,
  CREATE_ACCESS_KEY: `${BASE}/auth/accessKey/`,
  DELETE_ACCESS_KEY: `${BASE}/auth/accessKey/`
};

export default endpoints;
