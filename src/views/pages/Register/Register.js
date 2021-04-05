import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import PageFrame from "../../components/PageFrame";
import paths from "../../../configs/paths";
import preValidateRegisterData from "../../../helpers/preValidateRegisterData";

import {
  Button,
  Card,
  CardHeader,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import TextField from "../../components/Textfield";
import "./style.css";
import store from "../../../store/store";
import { signUp } from "../../../store/user/signUp"

const Register = (props) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState(true);
  const [selectedDate, setDate] = useState(new Date());
  const [company, setCompany] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isVisiblePass, setVisiblePass] = useState(false);
  const [error, setError] = useState();
  const { from } = props.location.state || { from: { pathname: paths.BASE } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = preValidateRegisterData({ username, password });
    if (error) {
      return setError(error);
    }

    setError("");
    store.dispatch(signUp({ firstname: firstname, lastname: lastname, username: username, password: password, email: email, dob: selectedDate, company: company, gender: gender }));
    console.log(from.pathname);
    props.history.push(paths.OTP);
  };

  const handleChangeDate = (date) => {
    setDate(date);
  };

  if (props.isValidAuthentication) {
    return <Redirect to={paths.BASE} />;
  }

  return (
    <PageFrame className="register-container">
      <Card className="register-card">
        <CardHeader
          className="bg-light-blue"
          style={{
            textAlign: "center",
            width: "100%",
            color: "#ffffff",
          }}
          title="Sign Up"
          titleTypographyProps={{
            style: {
              fontWeight: "bold",
            },
          }}
        />
        <form className="register-form">
          <div className="register-form-field">
            <label>Username</label>
            <TextField
              style={{
                width: "100%",
              }}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="register-form-field">
            <label>Firstname</label>
            <TextField
              style={{
                width: "100%",
              }}
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              autoFocus
            />
          </div>
          <div className="register-form-field">
            <label>Lastname</label>
            <TextField
              style={{
                width: "100%",
              }}
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <div className="register-form-field">
            <label>Email</label>
            <TextField
              style={{
                width: "100%",
              }}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="register-fields-inline">
            <div
              className="register-form-field"
              style={{ width: "40%", justifyContent: "flex-start" }}
            >
              <label
                style={{
                  width: "fit-content",
                  minWidth: "fit-content",
                  marginRight: "22%",
                }}
              >
                Gender
              </label>
              <Select
                select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value={true}>Male</MenuItem>
                <MenuItem value={false}>Female</MenuItem>
              </Select>
            </div>
            <div
              className="register-form-field"
              style={{ width: "50%", justifyContent: "flex-end" }}
            >
              <label
                style={{
                  width: "fit-content",
                  minWidth: "fit-content",
                  textAlign: "right",
                  marginRight: "10px",
                }}
              >
                DOB
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  style={{ margin: "5px 0", width: "calc(" }}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  value={selectedDate}
                  onChange={handleChangeDate}
                  inputProps={{
                    width: "fit-content",
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
          <div className="register-form-field">
            <label>Company</label>
            <TextField
              style={{
                width: "100%",
              }}
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="register-form-field">
            <label>Password</label>
            <TextField
              style={{
                width: "100%",
              }}
              type={isVisiblePass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="register-form-field">
            <label>Confirm</label>
            <TextField
              style={{
                width: "100%",
              }}
              type={isVisiblePass ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <div style={{ width: "100%" }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="default"
                  inputProps={{
                    "aria-label": "checkbox with default color",
                  }}
                  checked={isVisiblePass}
                  onChange={() => setVisiblePass(!isVisiblePass)}
                />
              }
              label="Show password"
            />
          </div>
          <div className="register-error"> {error && <p> {error} </p>}</div>
          <div className="register-form-control register-form-control-button">
            <Button
              variant="outlined"
              className="register-buttons"
              onClick={() => props.history.push(paths.BASE)}
            >
              BACK
            </Button>
            <button
              variant="contained"
              className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="submit"
              onClick={handleSubmit}
            >
              CREATE ACCOUNT
            </button>
          </div>
        </form>
      </Card>
    </PageFrame>
  );
};

const mapStateToProps = (state) => ({
  isValidAuthentication: state.authen.isValidAuthentication,
});

export default connect(mapStateToProps)(Register);
