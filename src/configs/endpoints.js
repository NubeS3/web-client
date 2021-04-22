const BASE = `${process.env.REACT_APP_BACK_END_URL}`;

const endpoints = {
  BASE,
  AUTHENTICATION: `${BASE}/users/verify-authentication`,
  REGISTER: `${BASE}/users/signup`,
  LOGIN: `${BASE}/users/signin`,
  LOGOUT: `${BASE}/users/signout`,
  CONFIRM_OTP: `${BASE}/users/confirm-otp`,
  RESEND_OTP: `${BASE}/users/resend-otp`,
  UPLOAD: `${BASE}/auth/files/upload`,
  DOWNLOAD: `${BASE}/auth/files/download`,
  GET_BUCKET: `${BASE}/auth/buckets/all`,
  CREATE_BUCKET: `${BASE}/auth/buckets/`,
  CREATE_BUCKET_FOLDER: `${BASE}/auth/folders/`,
  DELETE_BUCKET: `${BASE}/auth/buckets/`,
  GET_BUCKET_FILE: `${BASE}/auth/files/all`,
  GET_BUCKET_FOLDER: `${BASE}/auth/folders/all`,
  GET_ACCESS_KEY: `${BASE}/auth/accessKey/all/`,
  GET_SIGNED_KEY: `${BASE}/auth/keyPairs/all/`,
  CREATE_ACCESS_KEY: `${BASE}/auth/accessKey/`,
  DELETE_ACCESS_KEY: `${BASE}/auth/accessKey`,
  CREATE_SIGNED_KEY: `${BASE}/auth/keyPairs/`,
  DELETE_SIGNED_KEY: `${BASE}/auth/keyPairs`,
};

export default endpoints;
