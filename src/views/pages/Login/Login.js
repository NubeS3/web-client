import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import loginRequest from "../../../services/loginRequest";
import respType from "../../../configs/responseType";
import paths from "../../../configs/paths";
import { validAuthentication } from "../../../store/actions/authenticateAction";
import preValidateLoginData from "../../../helpers/preValidateLoginData";

import { Button, InputAdornment, IconButton } from "@material-ui/core";
import TextField from "../../components/Textfield";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import "./style.css";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisiblePass, setVisiblePass] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = preValidateLoginData({ username, password });
    if (error) {
      return setError(error);
    }

    setError("");
    const result = await loginRequest(username, password);
    if (result.type === respType.SUCCEED) {
      await props.saveAuthToken(result.data.token);
      props.history.push(paths.BASE);
    } else {
      setError(result.error);
    }
  };

  const handleClickShowPassword = () => {
    setVisiblePass(!isVisiblePass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  if (props.isValidAuthentication) {
    return <Redirect to={paths.BASE} />;
  }

  return (
    <div className="login-wrapper">
      <h1>Sign In</h1>
      <form className="form-wrapper" autoComplete="off">
        <TextField
          className="textfield"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <TextField
          className="textfield"
          label="Password"
          type={isVisiblePass ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {isVisiblePass ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div className="login-error">{error && <p>{error}</p>}</div>
        <Button className="login-button" type="submit" onClick={handleSubmit}>
          SIGN IN
        </Button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authenticateReducer.isValidAuthentication,
});

const mapDispatchToProps = (dispatch) => ({
  saveAuthToken: (token) => dispatch(validAuthentication(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
