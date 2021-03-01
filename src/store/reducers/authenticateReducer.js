import actionTypes from "../../configs/actionTypes";
import localStorageKeys from "../../configs/localStorageKeys";

const initialState = {
  token: "",
  isValidAuthentication: false,
  isValidating: true,
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.VALID_AUTHENTICATION:
      localStorage.setItem(localStorageKeys.TOKEN, action.token);
      return {
        token: action.token,
        isValidAuthentication: true,
        isValidating: false,
      };
    case actionTypes.INVALID_AUTHENTICATION:
      localStorage.removeItem(localStorageKeys.TOKEN);
      return {
        ...initialState,
        isValidating: false,
      };
    default:
      return state;
  }
};

export default reducer;
