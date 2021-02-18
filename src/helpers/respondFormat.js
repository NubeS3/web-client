import respTypes from '../configs/responseType'

export const succeed = (response) => {
  return {
    type: respTypes.SUCCEED,
    code: response.status,
    data: response.data
  };
};

export const failed = (error) => {
  try {
    return {
      type: respTypes.FAILED,
      code: error.response.status,
      error: error.response.data.error
    };
  }
  catch (error) {
    return {
      type: respTypes.FAILED
    };
  }
};