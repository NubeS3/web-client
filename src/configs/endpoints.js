const BASE = `${process.env.NUBES_BACK_END_URL}`;

const endpoints = {
  BASE,
  AUTHENTICATION: `${BASE}/users/verify-authentication`,
  REGISTER: `${BASE}/users/signup`,
  LOGIN: `${BASE}/users/signin`,
  LOGOUT: `${BASE}/users/signout`,
  CONFIRM_OTP: `${BASE}/users/confirm-otp`,
};

export default endpoints;
