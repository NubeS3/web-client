import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import paths from "../../../configs/paths";
import preValidateLoginData from "../../../helpers/preValidateLoginData";

import store from "../../../store/store";
import { adminLogin } from "../../../store/auth/admin_auth";

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
import TextField from "../../components/Textfield";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import "./style.css";
import PageFrameAdmin from "../../components/PageFrameAdmin";
import { clearAuthentication } from "../../../store/auth/auth";

const AdminLogin = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isStaySignedIn, setStaySignIn] = useState(false);
  const [isVisiblePass, setVisiblePass] = useState(false);
  const [error, setError] = useState();

  const { from } = props.location.state || { from: { pathname: paths.BASE_ADMIN } };

  if (props.isValidAuthentication) {
    return <Redirect to={from.pathname} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = preValidateLoginData({ username, password });
    if (error) {
      return setError(error);
    }

    setError("");
    console.log(adminLogin)
    store.dispatch(adminLogin({ username: username, password: password }));
    store.dispatch(clearAuthentication())
    props.history.push(paths.BASE_ADMIN);
  };

  const handleClickShowPassword = () => {
    setVisiblePass(!isVisiblePass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <PageFrameAdmin className="login-container">
      <Card className="login-card">
        <CardHeader
        className="bg-light-blue"
          style={{
            textAlign: "center",
            width: "100%",
            color: "#ffffff",
          }}
          title="Admin Login"
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
          </div>
          <div className="login-error">{error && <p>{error}</p>}</div>
          <div className="login-form-control login-form-control-button">
            <Button
              variant="outlined"
              className="login-buttons"
              onClick={() => props.history.push(paths.BASE_ADMIN)}
            >
              BACK
            </Button>
            <Button
              variant="contained"
              className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="submit"
              onClick={handleSubmit}
            >
              SIGN IN
            </Button>
          </div>
        </form>
      </Card>
    </PageFrameAdmin>
  );
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.adminAuthen.isAdminValidAuthentication,
});

export default connect(mapStateToProps)(AdminLogin);
