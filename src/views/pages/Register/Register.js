import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import registerRequest from "../../../services/loginRequest";
import respType from "../../../configs/responseType";
import paths from "../../../configs/paths";
import { validAuthentication } from "../../../store/actions/authenticateAction";
import preValidateRegisterData from "../../../helpers/preValidateRegisterData";

import {
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import TextField from "../../components/Textfield";
import "./style.css";

const Login = (props) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState();
  const [selectedDate, setDate] = useState(new Date());
  const [company, setCompany] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isVisiblePass, setVisiblePass] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
  };

  const handleClickShowPassword = () => {
    setVisiblePass(!isVisiblePass);
  };

  const handleChangeDate = (date) => {
    setDate(date);
  };

  if (props.isValidAuthentication) {
    return <Redirect to={paths.BASE} />;
  }

  return (
    <div className="register-wrapper">
      <h1> Sign Up </h1>
      <form className="form-wrapper" autoComplete="off">
        <div className="form-control">
          <TextField
            className="textfield"
            label="Firstname"
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            autoFocus
          />
          <TextField
            className="textfield"
            label="Lastname"
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <TextField
          className="textfield"
          label="Email"
          type="text"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="form-control">
          <TextField
            className="textfield"
            style={{ width: "30%" }}
            label="Gender"
            select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value={true}>Male</MenuItem>
            <MenuItem value={false}>Female</MenuItem>
          </TextField>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              style={{ margin: "5px 0" }}
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              label="Day of birth"
              value={selectedDate}
              onChange={handleChangeDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <TextField
          className="textfield"
          label="Company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <TextField
          className="textfield"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="form-control">
          <TextField
            className="textfield"
            label="Password"
            type={isVisiblePass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            className="textfield"
            label="Confirm"
            type={isVisiblePass ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              color="default"
              inputProps={{
                "aria-label": "checkbox with default color",
              }}
              checked={isVisiblePass}
              onChange={handleClickShowPassword}
            />
          }
          label="Show password"
        />
        <div className="register-error"> {error && <p> {error} </p>}</div>
        <Button
          className="register-button"
          type="submit"
          onClick={handleSubmit}
        >
          CREATE ACCOUNT
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
