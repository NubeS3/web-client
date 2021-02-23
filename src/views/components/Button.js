import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const ColorButton = withStyles((theme) => ({
  root: {
    "&:hover": {
      backgroundColor: "#7fccea",
    },
  },
}))(Button);

export default ColorButton;
