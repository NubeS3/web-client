import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import loginRequest from "../../../services/loginRequest";
import respType from "../../../configs/responseType";
import paths from "../../../configs/paths";
import { validAuthentication } from "../../../store/actions/authenticateAction";
import preValidateLoginData from "../../../helpers/preValidateLoginData";

import {
  Button,
  InputAdornment,
  IconButton,
  Link,
  Card,
  CardHeader,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import PageFrame from "../../components/PageFrame";
import TextField from "../../components/Textfield";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import "./style.css";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isStaySignedIn, setStaySignIn] = useState(false);
  const [isVisiblePass, setVisiblePass] = useState(false);
  const [error, setError] = useState();

  const { from } = props.location.state || { from: { pathName: paths.BASE } };

  if (props.isValidAuthentication) {
    return <Redirect to={paths.BASE} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = preValidateLoginData({ username, password });
    if (error) {
      return setError(error);
    }

    setError("");
    // const result = await loginRequest(username, password);
    // if (result.type === respType.SUCCEED) {
    //   await props.saveAuthToken(result.data.token);
    //   props.history.push(paths.BASE);
    // } else {
    //   setError(result.error);
    // }
    await props.saveAuthToken("token12345");
    props.history.push(from.pathname);
  };

  const handleClickShowPassword = () => {
    setVisiblePass(!isVisiblePass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const redirectToForgotPassword = (event) => {
    event.preventDefault();
  };

  const redirectToRegister = (event) => {
    event.preventDefault();
    props.history.push(paths.REGISTER);
  };

  return (
    <PageFrame className="login-container">
      <Card className="login-card">
        <CardHeader
        className="bg-light-blue"
          style={{
            textAlign: "center",
            width: "100%",
            color: "#ffffff",
          }}
          title="Sign In"
          titleTypographyProps={{
            style: {
              fontWeight: "bold",
            },
          }}
        />
        <form className="login-form">
          <div className="login-form-field">
            <label>Username</label>
            <TextField
              style={{
                width: "100%",
              }}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="login-form-field">
            <label>Password</label>
            <TextField
              style={{
                width: "100%",
              }}
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
          </div>
          <div className="login-form-control">
            <FormControlLabel
              control={
                <Checkbox
                  color="default"
                  inputProps={{
                    "aria-label": "checkbox with default color",
                  }}
                  checked={isStaySignedIn}
                  onChange={() => setStaySignIn(!isStaySignedIn)}
                />
              }
              label="Stay signed in"
            />
            <Link style={{ color: "black" }} onClick={redirectToForgotPassword}>
              Forgot password?
            </Link>
          </div>
          <div className="login-error">{error && <p>{error}</p>}</div>
          <div className="login-form-control login-form-control-button">
            <Button
              variant="outlined"
              className="login-buttons"
              onClick={() => props.history.push(paths.BASE)}
            >
              BACK
            </Button>
            <Button
              variant="contained"
              className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="submit"
              onClick={handleSubmit}
            >
              SIGN IN
            </Button>
          </div>
          <Link
            style={{ marginTop: "10px", color: "black" }}
            onClick={redirectToRegister}
          >
            Create new account
          </Link>
        </form>
      </Card>
    </PageFrame>
  );
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authenticateReducer.isValidAuthentication,
});

const mapDispatchToProps = (dispatch) => ({
  saveAuthToken: (token) => dispatch(validAuthentication(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
