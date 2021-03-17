import actionTypes from "../../configs/actionTypes";
import respTypes from "../../configs/responseType";
import localStorageKeys from "../../configs/localStorageKeys";
import authRequest from "../../services/authRequest";
import logoutRequest from "../../services/logoutRequest";

const isValidatingAuthentication = () => ({
  type: actionTypes.VALIDATING_AUTHENTICATION,
});

export const validAuthentication = (token) => ({
  type: actionTypes.VALID_AUTHENTICATION,
  token,
});

export const invalidAuthentication = () => ({
  type: actionTypes.INVALID_AUTHENTICATION,
});

export const verifyAuthentication = () => async (dispatch, getState) => {
  dispatch(isValidatingAuthentication());

  const token = localStorage.getItem(localStorageKeys.TOKEN);
  if (!token) {
    return dispatch(invalidAuthentication());
  }
  const result = await authRequest(token);

  if (result.type === respTypes.SUCCEED) {
    dispatch(validAuthentication(token));
  } else {
    dispatch(invalidAuthentication());
  }
};

export const clearAuthentication = () => async (dispatch) => {
  const token = localStorage.getItem(localStorageKeys.TOKEN);
  if (!token) {
    return dispatch(invalidAuthentication());
  }
  await logoutRequest(token);
  dispatch(invalidAuthentication());
};