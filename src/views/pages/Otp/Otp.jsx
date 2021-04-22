
import React, { useState } from "react";

import {
    Card,
    CardHeader,
    Button
} from "@material-ui/core";
import PageFrame from "../../components/PageFrame";
import TextField from "../../components/Textfield";
import store from "../../../store/store";
import { confirmOTP, resendOTP } from "../../../store/user/signUp";
import {connect } from "react-redux"
import paths from "../../../configs/paths";

const ConfirmedOTP = ({username, message, ...props}) => {
    const [otp, setOTP] = useState()
    const handleConfirmOTP = () => {
        store.dispatch(confirmOTP({username, otp}))
        props.history.push(paths.BASE);
    }
    const handleResendOTP = () => {
        store.dispatch(resendOTP({username}))
        alert(message)
    }

    return (
        <PageFrame className="login-container">
            <Card className="login-card">
                <CardHeader
                    style={{
                        textAlign: "center",
                        width: "100%",
                    }}
                    className="bg-ocean-blue"
                    title="OTP Confirmation"
                    titleTypographyProps={{
                        style: {
                            fontWeight: "bold",
                        },
                    }}
                />
                <form className="login-form">
                    <div className="login-form-field">
                        <label>OTP</label>
                        <TextField value={otp} onChange={(e) => setOTP(e.target.value)}
                            style={{
                                width: "100%",
                            }}
                            type="text"
                            autoFocus
                        />
                    </div>
                    <div className="login-form-control-button justify-center mt-4">
                        <button onClick={handleResendOTP}
                            className="bg-ocean-blue text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            RESEND
                        </button>
                        <button onClick={handleConfirmOTP}
                            className="bg-ocean-blue text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            CONFIRM
                        </button>
                    </div>
                </form>
            </Card>
        </PageFrame>
    )
}

const mapStateToProps = (state) => ({
    username: state.signUp.username,
    message: state.signUp.message
  });
  
  export default connect(mapStateToProps)(ConfirmedOTP);