import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";

const Textfield = withStyles({
  root: {
    "& .MuiInput-underline:after": {
      borderBottomColor: "black",
    },
  },
})(TextField);

export default Textfield;
