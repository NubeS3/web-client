import axios from '../../configs/api'
import endpoints from '../../configs/endpoints'

const loginRequest = async (data = { username: '', password: '' }) => {
  try {
    const resp = axios.post(endpoints.LOGIN, data)
    return resp.data
  } catch (err) {
    return err.response.data.error
  }
}

export default loginRequest