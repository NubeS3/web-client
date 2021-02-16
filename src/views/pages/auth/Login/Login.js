import React, { useState } from 'react'
import connect from 'react-redux'
import { Redirect } from 'react-router-dom'

import loginRequest from '../../../../services/auth/loginRequest'
import respType from '../../../../configs/responseType'
import paths from '../../../../configs/paths'
import { validAuthentication } from '../../../../store/actions/authenticateAction'

import './style.css'

const Login = props => {
  const { username, setUsername } = useState()
  const { password, setPassword } = useState()
  const { error, setError } = useState()

  const handleSubmit = async e => {
    e.preventDefault()

    setError('')
    const result = await loginRequest(username, password)
    if (result.type === respType.SUCCEED) {
      await props.saveAuthToken(result.data.token)
      props.history.push(paths.BASE)
    } else {
      setError(result.error)
    }
  }

  if (props.isValidAuthentication) {
    return <Redirect to={paths.BASE} />
  }

  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        {error && <p>{error}</p>}
        <div>
          <button type="submit" onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authenticateReducer.isValidAuthentication
});

const mapDispatchToProps = (dispatch) => ({
  saveAuthToken: (authToken) => dispatch(validAuthentication(authToken)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)