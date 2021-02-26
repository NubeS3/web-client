import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
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
      <MenuItem onClick={() => alert("Signup clicked!")}>Sign Up</MenuItem>
      <MenuItem onClick={() => alert("Signin clicked!")}>Sign In</MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="sticky" style={{ backgroundColor: "#78c5dc" }}>
        <Toolbar variant="dense">
          <LogoHeader />
          <Typography style={{ flexGrow: "1" }}>NubeS3</Typography>
          <div className="unauth-header-button-group">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#b7ecea",
                marginRight: "10px",
              }}
              onClick={() => history.push(paths.LOGIN)}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#b7ecea",
              }}
              onClick={() => history.push(paths.REGISTER)}
            >
              Sign Up
            </Button>
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
