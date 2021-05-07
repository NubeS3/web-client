import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import store from "../../../store/store";
import { clearAuthentication } from "../../../store/auth/auth";
import paths from "../../../configs/paths";
import localStorageKeys from "../../../configs/localStorageKeys";

import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import LogoHeader from "./LogoHeader";
import "./style.css";

const AuthHeader = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleSignOut = () => {
    store.dispatch(
      clearAuthentication({
        authToken: localStorage.getItem(localStorageKeys.TOKEN),
        rfToken: localStorage.getItem(localStorageKeys.RFTOKEN),
      })
    );
    history.push(paths.BASE);
  };

  return (
    <AppBar position="sticky" style={{ backgroundColor: "#004383" }}>
      <Toolbar variant="dense">
        <LogoHeader />
        <div style={{ flexGrow: "1" }} />
        {/* <button onClick={() => {history.push(paths.DASHBOARD)}}
          variant="contained"
          className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1">
          Console
        </button> */}
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => alert("Profile clicked!")}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AuthHeader;
