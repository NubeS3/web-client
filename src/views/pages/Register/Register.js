import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import PageFrame from "../../components/PageFrame";
import paths from "../../../configs/paths";

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
import { signUp } from "../../../store/user/signUp";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = (props) => {
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      gender: true,
      username: "",
      email: "",
      company: "",
      dob: new Date(),
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "Minimum 8 characters")
        .max(24, "Maximum 24 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
          "Does not begin or end with '_' or '.' Does not have __. .., ._, .."
        ),
      firstname: Yup.string()
        .min(2, "Mininum 2 characters")
        .max(16, "Maximum 16 characters")
        .required("Required!"),
      lastname: Yup.string()
        .min(2, "Mininum 2 characters")
        .max(16, "Maximum 16 characters")
        .required("Required!"),
      email: Yup.string()
        .email("Invalid email format")
        .matches(/^[^\s@]+@[^\s@]+$/, "Invalid email format")
        .required("Required!"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .max(32, "Maximum 32 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
          "Must contain at least One Uppercase, One Lowercase, One Number and one special case Character (8-32 characters)"
        )
        .required("Required!"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Password does not match")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      // const error = preValidateRegisterData(values);
      // // if (error) {
      // //   return setError(error);
      // // }
      // setError("");
      store.dispatch(
        signUp({
          firstname: values.firstname,
          lastname: values.lastname,
          username: values.username,
          password: values.password,
          email: values.email,
          dob: values.dob,
          company: values.company,
          gender: values.gender,
        })
      );
      console.log(from.pathname);
      props.history.push(paths.OTP);
    },
  });

  const [isVisiblePass, setVisiblePass] = useState(false);
  // const [error, setError] = useState();
  const { from } = props.location.state || { from: { pathname: paths.BASE } };

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
        <form className="register-form" onSubmit={formik.handleSubmit}>
          <div className="register-form-field">
            <label>Username</label>
            <TextField
              id="username"
              name="username"
              style={{
                width: "100%",
              }}
              type="text"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              autoFocus
            />
          </div>
          <div className="register-form-field">
            <label>Firstname</label>
            <TextField
              id="firstname"
              name="firstname"
              style={{
                width: "100%",
              }}
              type="text"
              value={formik.values.firstname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstname && Boolean(formik.errors.firstname)
              }
              helperText={formik.touched.firstname && formik.errors.firstname}
            />
          </div>
          <div className="register-form-field">
            <label>Lastname</label>
            <TextField
              id="lastname"
              name="lastname"
              style={{
                width: "100%",
              }}
              type="text"
              value={formik.values.lastname}
              onChange={formik.handleChange}
              nBlur={formik.handleBlur}
              error={formik.touched.lastname && Boolean(formik.errors.lastname)}
              helperText={formik.touched.lastname && formik.errors.lastname}
            />
          </div>
          <div className="register-form-field">
            <label>Email</label>
            <TextField
              id="email"
              name="email"
              style={{
                width: "100%",
              }}
              type="text"
              value={formik.values.email}
              onChange={formik.handleChange}
              nBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
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
                id="gender"
                name="gender"
                select
                value={formik.values.gender}
                onChange={formik.handleChange}
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
                  value={formik.values.dob}
                  onChange={(date) => {
                    formik.setFieldValue("dob", date);
                  }}
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
              id="company"
              name="company"
              style={{
                width: "100%",
              }}
              type="text"
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
            />
          </div>
          <div className="register-form-field">
            <label>Password</label>
            <TextField
              id="password"
              name="password"
              style={{
                width: "100%",
              }}
              type={isVisiblePass ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </div>
          <div className="register-form-field">
            <label>Confirm</label>
            <TextField
              id="confirm_password"
              name="confirm_password"
              style={{
                width: "100%",
              }}
              type={isVisiblePass ? "text" : "password"}
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirm_password &&
                Boolean(formik.errors.confirm_password)
              }
              helperText={
                formik.touched.confirm_password &&
                formik.errors.confirm_password
              }
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
              onClick={formik.handleSubmit}
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
