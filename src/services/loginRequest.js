import axios from '../configs/api'
import endpoints from '../configs/endpoints'
import * as respFormat from '../helpers/respondFormat'

const loginRequest = async (data = { username: '', password: '' }) => {
  try {
    const resp = axios.post(endpoints.LOGIN, data)
    return respFormat.succeed(resp.data)
  } catch (err) {
    return respFormat.failed(err)
  }
}

export default loginRequest