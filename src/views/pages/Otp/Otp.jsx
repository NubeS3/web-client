
import React, { Component } from "react";

import {
    Card,
    CardHeader,
    Button
} from "@material-ui/core";
import PageFrame from "../../components/PageFrame";
import TextField from "../../components/Textfield";

export default class Otp extends Component {
    render() {
        return (
            <PageFrame className="login-container">
                <Card className="login-card">
                    <CardHeader
                        style={{
                            textAlign: "center",
                            backgroundColor: "#78c5dc",
                            width: "100%",
                            color: "#ffffff",
                        }}
                        title="OTP Confirmation"
                        titleTypographyProps={{
                            style: {
                                fontWeight: "bold",
                            },
                        }}
                    />
                    <form className="login-form">
                        <div className="login-form-field">
                            <label>OTP Code</label>
                            <TextField
                                style={{
                                    width: "100%",
                                }}
                                type="text"
                                autoFocus
                            />
                        </div>
                        <div className="login-form-control-button justify-center mt-4">
                            <button
                                style={{
                                    backgroundColor: "#78c5dc",
                                }}
                                className="text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                CONFIRM
                            </button>
                        </div>
                    </form>
                </Card>
            </PageFrame>
        )
    }
}
