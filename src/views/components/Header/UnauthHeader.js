import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@material-ui/core";
import MoreIcon from "@material-ui/icons/MoreVert";
import LogoHeader from "./LogoHeader";
import paths from "../../../configs/paths";
import "./style.css";

const UnauthHeader = (props) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const menuId = "mobile-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem onClick={() => history.push(paths.REGISTER)}>Sign Up</MenuItem>
      <MenuItem onClick={() => history.push(paths.LOGIN)}>Sign In</MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="sticky" style={{ backgroundColor: "#004383" }}>
        <Toolbar variant="dense">
          <LogoHeader />
          <div style={{ flexGrow: "1" }} />
          <div>
            <button
              variant="contained"
              className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1"
              onClick={() => history.push(paths.LOGIN)}
            >
              Sign In
            </button>
            <button
              variant="contained" className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              onClick={() => history.push(paths.REGISTER)}
            >
              Sign Up
            </button>
          </div>
          <div className="unauth-header-mobile-menu">
            <IconButton
              aria-label="show more"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </>
  );
};

export default UnauthHeader;
