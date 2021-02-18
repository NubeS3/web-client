import axios from "../configs/api";
import endpoints from "../configs/endpoints";
import * as respFormat from "../helpers/respondFormat";

const authenticateRequest = async (token = "") => {
  try {
    const response = await axios.post(endpoints.AUTHENTICATION, undefined, {
      headers: {
        Authorization: token,
      },
    });
    return respFormat.succeed(response);
  } catch (error) {
    return respFormat.failed(error);
  }
};

export default authenticateRequest;
