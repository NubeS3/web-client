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
  GET_CHILDREN_BY_PATH: `${BASE}/auth/folders/child/all`,

  LOGIN_ADMIN: `${BASE}/admin/signin`,
  GET_ALL_ADMIN: `${BASE}/admin/`,
  ADD_MOD: `${BASE}/admin/auth/mod`,
  BAN_USER: `${BASE}/admin/auth/ban-user`,
  BAN_MOD: `${BASE}/admin/auth/disable-mod`,
  GET_ACCESS_KEY_REQ_COUNT: `${BASE}/auth/accessKey/use-count/all/`,
  GET_SIGNED_KEY_REQ_COUNT: `${BASE}/auth/keyPairs/use-count/all/`,
};

export default endpoints;
