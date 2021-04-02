import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import PageFrame from "../../components/PageFrame";
import registerRequest from "../../../services/loginRequest";
import respType from "../../../configs/responseType";
import paths from "../../../configs/paths";
import { validAuthentication } from "../../../store/actions/authenticateAction";
import preValidateRegisterData from "../../../helpers/preValidateRegisterData";

import {
  Button,
  Card,
  CardHeader,
  FormControlLabel,
  Checkbox,
  MenuItem,
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
  const [gender, setGender] = useState(true);
  const [selectedDate, setDate] = useState(new Date());
  const [company, setCompany] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isVisiblePass, setVisiblePass] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
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
                  marginRight: "10px",
                }}
              >
                Gender
              </label>
              <TextField
                style={{ width: "100%" }}
                select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value={true}>Male</MenuItem>
                <MenuItem value={false}>Female</MenuItem>
              </TextField>
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
            <Button
              variant="contained"
              className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1"
              type="submit"
              onClick={handleSubmit}
            >
              CREATE ACCOUNT
            </Button>
          </div>
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
