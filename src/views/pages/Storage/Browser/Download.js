import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
  
const notification = (item) =>{
  toast('🦄' + item, {
    position: "bottom-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });
}

const ConfirmDownload = ({item}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
    <ToastContainer onClick={() => handleClickOpen()}/>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open responsive dialog
      </Button>
      <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{"Downdload these files?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <ul>
                <li>1</li>
                <li>2</li>
              </ul>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              Disagree
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}

export default ConfirmDownload;
