import axios from "../configs/api";
import endpoints from "../configs/endpoints";
import * as responseFormat from "../helpers/respondFormat";

const logoutRequest = async (token = "") => {
  try {
    const response = await axios.delete(endpoints.LOGOUT, {
      headers: {
        Authorization: token,
      },
    });
    return responseFormat.succeed(response);
  } catch (error) {
    return responseFormat.failed(error);
  }
};

export default logoutRequest;
