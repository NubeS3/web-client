const BASE = `${process.env.NUBES_BACK_END_URL}`

const endpoints = {
  BASE,
  LOGIN: `${BASE}/users/signin`,
  REGISTER: `${BASE}/users/signup`,
  LOGOUT: `${BASE}/users/signout`,
  CONFIRM_OTP: `${BASE}/users/confirm-otp`
}

export default endpoints