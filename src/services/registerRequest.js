import axios from '../configs/api'
import endpoints from '../configs/endpoints'
import * as respFormat from '../helpers/respondFormat'

const registerRequest = async (data = { email: '', username: '', firstname: '', lastname: '', dob: '', company: '', gender: null, password: '' }) => {
  try {
    const resp = await axios.post(endpoints.REGISTER, data)
    return respFormat.succeed(resp)
  }
  catch (error) {
    return respFormat.failed(error)
  }
}

export default registerRequest