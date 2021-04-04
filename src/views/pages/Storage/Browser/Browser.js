import React, { useState, useEffect, createRef, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Checkbox,
  TableSortLabel,
  Slide,
  Typography,
  InputLabel,
  TextField,
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreIcon from "@material-ui/icons/MoreVert";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PublishIcon from "@material-ui/icons/Publish";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import ShareIcon from "@material-ui/icons/Share";
import EditIcon from "@material-ui/icons/Edit";
import ArchiveIcon from "@material-ui/icons/Archive";
import "./style.css";
import { useTheme } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetAppIcon from "@material-ui/icons/GetApp";
import Dropzone from 'react-dropzone'
import { connect } from "react-redux"
import EditBucketContainer from "./BucketDetail";
import store from "../../../../store/store";
import {getAllBucket, createBucket, getBucketItems} from "../../../../store/storage/bucket"
import {uploadFile} from "../../../../store/storage/upload"

const createBucketData = (name, accessMode) => {
  return { name, accessMode };
};

const createBucketItemData = (name, size, lastModified, accessMode) => {
  return { name, size, lastModified, accessMode };
};

const bucketRows = [
  createBucketData("Bucket #01", "Public"),
  createBucketData("Bucket #02", "Private"),
  // createBucketData("Bucket #03", "Private"),
  // createBucketData("Bucket #04", "Private"),
  // createBucketData("Bucket #05", "Private"),
  // createBucketData("Bucket #06", "Private"),
  // createBucketData("Bucket #07", "Private"),
  // createBucketData("Bucket #08", "Private"),
  // createBucketData("Bucket #09", "Private"),
  // createBucketData("Bucket #10", "Private"),
  // createBucketData("Bucket #11", "Private"),
];

const bucketItemRows = [
  createBucketItemData("File #01", "1.1 KB", "2/12/2020 03:51:16 PM", "Public"),
  createBucketItemData(
    "Folder #01",
    "127.9 MB",
    "01/07/2020 01:05:51 PM",
    "Private"
  ),
  createBucketItemData(
    "File #02",
    "1.1 KB",
    "09/28/2020 03:09:38 AM",
    "Private"
  ),
  createBucketItemData(
    "File #03",
    "1.1KB",
    "01/14/2020 02:36:00 PM",
    "Private"
  ),
];

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const bucketHeadCells = [
  { id: "id", numeric: false, disablePadding: true, label: "ID" },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "uid",
    numeric: false,
    disablePadding: false,
    label: "User",
  },
  
  {
    id: "region",
    numeric: false,
    disablePadding: false,
    label: "Region",
  },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "Date Created",
  },
  {
    id: "empty",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];

const bucketItemHeadCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  { id: "size", numeric: false, disablePadding: false, label: "Size" },
  {
    id: "content_type",
    numeric: false,
    disablePadding: false,
    label: "File type",
  },
  {
    id: "expired_date",
    numeric: false,
    disablePadding: false,
    label: "Expiring Date",
  },
  {
    id: "empty",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];

const EnhancedTableHead = (props) => {
  const {
    onSelectedAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectedAllClick}
            inputProps={{ "aria-label": "select all buckets" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            style={headCell.style}
            align="left"
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const BucketContainer = ({
  items,
  setItems,
  onItemClick,
  visibility,
  setVisibility,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const isMenuOpen = Boolean(anchorEl);
  const [createButtonClicked, setCreateButtonClick] = useState(false);

  const handleDeleteBucket = () => {
    setItems(items.filter(() => selected));
    setSelected([]);
  };

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
      <MenuItem>
        <Button startIcon={<AddIcon />}>Create bucket</Button>
      </MenuItem>
      <MenuItem>
        <Button
          startIcon={<DeleteIcon />}
          disabled={selected.length !== 0 ? false : true}
          onClick={handleDeleteBucket}
        >
          Delete bucket
        </Button>
      </MenuItem>
    </Menu>
  );

  return (
    <Paper
      style={{
        position: "relative",
        width: "100%",
      }}
      visibility={visibility}
    >
      <AppBar
        position="static"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <Toolbar variant="dense">
          <h3 style={{ marginRight: "20px" }}>Bucket</h3>
          <div className="browser-appbar-button-group">
            <Button startIcon={<AddIcon />} onClick={() => setCreateButtonClick(true)}>Create bucket</Button>
            <Button
              startIcon={<DeleteIcon />}
              disabled={selected.length !== 0 ? false : true}
              onClick={handleDeleteBucket}
            >
              Delete bucket
            </Button>
          </div>
          <div style={{ flexGrow: "1" }}></div>
          <div className="browser-appbar-mobile-menu">
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
      <BucketTable
        headCells={bucketHeadCells}
        items={items}
        selected={selected}
        setSelected={setSelected}
        onItemClick={onItemClick}
      />
      {renderMenu}
      <CreateBucket authToken={props.authToken} visibility={createButtonClicked} onBack={() => setCreateButtonClick(false)} />
      {props.children}
    </Paper>
  );
};

const BucketTable = ({
  selected,
  setSelected,
  headCells,
  items,
  onItemClick,
}) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = bucketRows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleItemCheckboxClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectedAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={items.length}
            headCells={headCells}
          />
          <TableBody>
            {stableSort(items, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(e) => handleItemCheckboxClick(e, row.name)}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      onClick={() => onItemClick(row.name)}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name)}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name)}
                    >
                      {row.uid}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name)}
                    >
                      {row.region}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name)}
                    >
                      {row.created_at}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton>
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 81 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={bucketRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const BucketItemsContainer = ({
  bucketName,
  items,
  setItems,
  onBack,
  onItemClick,
  authToken, 
  bucketId,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const isMenuOpen = Boolean(anchorEl);
  const [showEditBucket, setShowEditBucket] = useState(false);

  const menuId = "mobile-menu";
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);

  const handleOpenDownload = () => {
    setOpenDownloadDialog(true);
    console.log(openDownloadDialog);
  };

  const handleCloseDownload = () => {
    setOpenDownloadDialog(false);
  };

  const fileInputRef = useRef(null)
  const handleUploadFile = () => {
    fileInputRef.current.click();
  }

  const handleFileSelected = (e) => {
    e.preventDefault()
    let file = e.target.files;
    store.dispatc(uploadFile({authToken: authToken, file: file[0], bucketId: bucketId}))
  }

  const dropzoneRef = createRef();
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem>
        <Button startIcon={<AddIcon />}>Create bucket</Button>
      </MenuItem>
      <MenuItem>
        <Button
          startIcon={<DeleteIcon />}
          disabled={selected.length !== 0 ? false : true}
        >
          Delete bucket
        </Button>
      </MenuItem>
    </Menu>
  );

  return (
    <Slide
      in={bucketName != "" > 0 ? true : false}
      direction="left"
      mountOnEnter
      unmountOnExit
    >
      <Paper style={{ position: "absolute", width: "inherit", top: "0" }}>
        <AppBar
          position="static"
          style={{ backgroundColor: "white", color: "black" }}
        >
          <Toolbar variant="dense">
            <IconButton onClick={() => onBack(null)}>
              <ArrowBackIcon />
            </IconButton>
            <h3 style={{ marginRight: "20px" }}>{bucketName}</h3>
            <div className="browser-appbar-button-group">
              <Button startIcon={<PublishIcon />} onClick={handleUploadFile}>Upload file</Button>
              <Button startIcon={<PublishIcon />}>Upload folder</Button>
              <Button startIcon={<CreateNewFolderIcon />}>Create folder</Button>
              <Button startIcon={<GetAppIcon />} onClick={handleOpenDownload}>
                Download
              </Button>
            </div>
            <div style={{ flexGrow: "1" }}></div>
            <div className="browser-appbar-button-group">
              <Button startIcon={<ShareIcon />}>Share</Button>
              <Button startIcon={<EditIcon />} onClick={() => setShowEditBucket(true)}>Edit bucket</Button>
              <Button startIcon={<DeleteIcon />}>Delete</Button>
            </div>
            <div className="browser-appbar-mobile-menu">
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
        {/* <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)} ref={dropzoneRef}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()}/>
                <p>Drag n drop files here to upload</p>
              </div>
            </section>
          )} */}
        <BucketItemTable
          headCells={bucketItemHeadCells}
          selected={selected}
          setSelected={setSelected}
          items={items || []}
          onItemClick={onItemClick}
        />
        <input type='file' id='fileInput' ref={fileInputRef} className="hidden" onChange={handleFileSelected}></input>
        {/* </Dropzone> */}

        <ConfirmDownload
          open={openDownloadDialog}
          handleClose={handleCloseDownload}
        />
        <EditBucketContainer show={showEditBucket} title={bucketName}/>
        {renderMenu}
      </Paper>
    </Slide>
  );
};

const notification = () => {
  toast("Downloading", {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
  });
};

const ConfirmDownload = ({ open, handleClose }) => {
  const openDownloadDialog = open;

  const handleConfirmDownload = (state) => {
    notification();
  };

  return (
    <div>
      <ToastContainer />
      {openDownloadDialog ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Download these files?
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={handleClose}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <ul>
                    <li>
                      <ArchiveIcon /> File 1
                    </li>
                  </ul>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={() => handleConfirmDownload(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

const BucketItemTable = ({
  selected,
  setSelected,
  headCells,
  items,
  onItemClick,
}) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = bucketItemRows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleItemCheckboxClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, bucketRows.length - page * rowsPerPage);
  const theme = useTheme();
  return (
    <Paper>
      <TableContainer>
        <Table>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectedAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={bucketItemRows.length}
            headCells={headCells}
          />
          <TableBody>
            {stableSort(items, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(e) => handleItemCheckboxClick(e, row.name)}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      onClick={() => onItemClick(row.name)}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name)}
                    >
                      {row.size}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name)}
                    >
                      {row.lastModified}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name)}
                    >
                      {row.accessMode}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton>
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 81 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={bucketItemRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const CreateBucket = ({ onBack, visibility, authToken}) => {

  const regions = [
    { name: "Albania", code: "AL" },
    { name: "Åland Islands", code: "AX" },
    { name: "Algeria", code: "DZ" },
    { name: "American Samoa", code: "AS" },
    { name: "Andorra", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Anguilla", code: "AI" },
    { name: "Antarctica", code: "AQ" },
    { name: "Antigua and Barbuda", code: "AG" },
    { name: "Argentina", code: "AR" },
    { name: "Armenia", code: "AM" },
    { name: "Aruba", code: "AW" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahamas (the)", code: "BS" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Barbados", code: "BB" },
    { name: "Belarus", code: "BY" },
    { name: "Belgium", code: "BE" },
    { name: "Belize", code: "BZ" },
    { name: "Benin", code: "BJ" },
    { name: "Bermuda", code: "BM" },
    { name: "Bhutan", code: "BT" },
    { name: "Bolivia (Plurinational State of)", code: "BO" },
    { name: "Bonaire, Sint Eustatius and Saba", code: "BQ" },
    { name: "Bosnia and Herzegovina", code: "BA" },
    { name: "Botswana", code: "BW" },
    { name: "Bouvet Island", code: "BV" },
    { name: "Brazil", code: "BR" },
    { name: "British Indian Ocean Territory (the)", code: "IO" },
    { name: "Brunei Darussalam", code: "BN" },
    { name: "Bulgaria", code: "BG" },
    { name: "Burkina Faso", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cabo Verde", code: "CV" },
    { name: "Cambodia", code: "KH" },
    { name: "Cameroon", code: "CM" },
    { name: "Canada", code: "CA" },
    { name: "Cayman Islands (the)", code: "KY" },
    { name: "Central African Republic (the)", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Christmas Island", code: "CX" },
    { name: "Cocos (Keeling) Islands (the)", code: "CC" },
    { name: "Colombia", code: "CO" },
    { name: "Comoros (the)", code: "KM" },
    { name: "Congo (the Democratic Republic of the)", code: "CD" },
    { name: "Congo (the)", code: "CG" },
    { name: "Cook Islands (the)", code: "CK" },
    { name: "Costa Rica", code: "CR" },
    { name: "Croatia", code: "HR" },
    { name: "Cuba", code: "CU" },
    { name: "Curaçao", code: "CW" },
    { name: "Cyprus", code: "CY" },
    { name: "Czechia", code: "CZ" },
    { name: "Côte d'Ivoire", code: "CI" },
    { name: "Denmark", code: "DK" },
    { name: "Djibouti", code: "DJ" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic (the)", code: "DO" },
    { name: "Ecuador", code: "EC" },
    { name: "Egypt", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Estonia", code: "EE" },
    { name: "Eswatini", code: "SZ" },
    { name: "Ethiopia", code: "ET" },
    { name: "Falkland Islands (the) [Malvinas]", code: "FK" },
    { name: "Faroe Islands (the)", code: "FO" },
    { name: "Fiji", code: "FJ" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "French Guiana", code: "GF" },
    { name: "French Polynesia", code: "PF" },
    { name: "French Southern Territories (the)", code: "TF" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia (the)", code: "GM" },
    { name: "Georgia", code: "GE" },
    { name: "Germany", code: "DE" },
    { name: "Ghana", code: "GH" },
    { name: "Gibraltar", code: "GI" },
    { name: "Greece", code: "GR" },
    { name: "Greenland", code: "GL" },
    { name: "Grenada", code: "GD" },
    { name: "Guadeloupe", code: "GP" },
    { name: "Guam", code: "GU" },
    { name: "Guatemala", code: "GT" },
    { name: "Guernsey", code: "GG" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Guyana", code: "GY" },
    { name: "Haiti", code: "HT" },
    { name: "Heard Island and McDonald Islands", code: "HM" },
    { name: "Holy See (the)", code: "VA" },
    { name: "Honduras", code: "HN" },
    { name: "Hong Kong", code: "HK" },
    { name: "Hungary", code: "HU" },
    { name: "Iceland", code: "IS" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran (Islamic Republic of)", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Ireland", code: "IE" },
    { name: "Isle of Man", code: "IM" },
    { name: "Israel", code: "IL" },
    { name: "Italy", code: "IT" },
    { name: "Jamaica", code: "JM" },
    { name: "Japan", code: "JP" },
    { name: "Jersey", code: "JE" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kenya", code: "KE" },
    { name: "Kiribati", code: "KI" },
    { name: "Korea (the Democratic People's Republic of)", code: "KP" },
    { name: "Korea (the Republic of)", code: "KR" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: "Lao People's Democratic Republic (the)", code: "LA" },
    { name: "Latvia", code: "LV" },
    { name: "Lebanon", code: "LB" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libya", code: "LY" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Macao", code: "MO" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mali", code: "ML" },
    { name: "Malta", code: "MT" },
    { name: "Marshall Islands (the)", code: "MH" },
    { name: "Martinique", code: "MQ" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Mayotte", code: "YT" },
    { name: "Mexico", code: "MX" },
    { name: "Micronesia (Federated States of)", code: "FM" },
    { name: "Moldova (the Republic of)", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Mongolia", code: "MN" },
    { name: "Montenegro", code: "ME" },
    { name: "Montserrat", code: "MS" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Myanmar", code: "MM" },
    { name: "Namibia", code: "NA" },
    { name: "Nauru", code: "NR" },
    { name: "Nepal", code: "NP" },
    { name: "Netherlands (the)", code: "NL" },
    { name: "New Caledonia", code: "NC" },
    { name: "New Zealand", code: "NZ" },
    { name: "Nicaragua", code: "NI" },
    { name: "Niger (the)", code: "NE" },
    { name: "Nigeria", code: "NG" },
    { name: "Niue", code: "NU" },
    { name: "Norfolk Island", code: "NF" },
    { name: "Northern Mariana Islands (the)", code: "MP" },
    { name: "Norway", code: "NO" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palau", code: "PW" },
    { name: "Palestine, State of", code: "PS" },
    { name: "Panama", code: "PA" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Philippines (the)", code: "PH" },
    { name: "Pitcairn", code: "PN" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Puerto Rico", code: "PR" },
    { name: "Qatar", code: "QA" },
    { name: "Republic of North Macedonia", code: "MK" },
    { name: "Romania", code: "RO" },
    { name: "Russian Federation (the)", code: "RU" },
    { name: "Rwanda", code: "RW" },
    { name: "Réunion", code: "RE" },
    { name: "Saint Barthélemy", code: "BL" },
    { name: "Saint Helena, Ascension and Tristan da Cunha", code: "SH" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Martin (French part)", code: "MF" },
    { name: "Saint Pierre and Miquelon", code: "PM" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Samoa", code: "WS" },
    { name: "San Marino", code: "SM" },
    { name: "Sao Tome and Principe", code: "ST" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Senegal", code: "SN" },
    { name: "Serbia", code: "RS" },
    { name: "Seychelles", code: "SC" },
    { name: "Sierra Leone", code: "SL" },
    { name: "Singapore", code: "SG" },
    { name: "Sint Maarten (Dutch part)", code: "SX" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Somalia", code: "SO" },
    { name: "South Africa", code: "ZA" },
    { name: "South Georgia and the South Sandwich Islands", code: "GS" },
    { name: "South Sudan", code: "SS" },
    { name: "Spain", code: "ES" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Sudan (the)", code: "SD" },
    { name: "Suriname", code: "SR" },
    { name: "Svalbard and Jan Mayen", code: "SJ" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Syrian Arab Republic", code: "SY" },
    { name: "Taiwan", code: "TW" },
    { name: "Tajikistan", code: "TJ" },
    { name: "Tanzania, United Republic of", code: "TZ" },
    { name: "Thailand", code: "TH" },
    { name: "Timor-Leste", code: "TL" },
    { name: "Togo", code: "TG" },
    { name: "Tokelau", code: "TK" },
    { name: "Tonga", code: "TO" },
    { name: "Trinidad and Tobago", code: "TT" },
    { name: "Tunisia", code: "TN" },
    { name: "Turkey", code: "TR" },
    { name: "Turkmenistan", code: "TM" },
    { name: "Turks and Caicos Islands (the)", code: "TC" },
    { name: "Tuvalu", code: "TV" },
    { name: "Uganda", code: "UG" },
    { name: "Ukraine", code: "UA" },
    { name: "United Arab Emirates (the)", code: "AE" },
    { name: "United Kingdom of Great Britain and Northern Ireland (the)", code: "GB" },
    { name: "United States Minor Outlying Islands (the)", code: "UM" },
    { name: "United States of America (the)", code: "US" },
    { name: "Uruguay", code: "UY" },
    { name: "Uzbekistan", code: "UZ" },
    { name: "Vanuatu", code: "VU" },
    { name: "Venezuela (Bolivarian Republic of)", code: "VE" },
    { name: "Viet Nam", code: "VN" },
    { name: "Virgin Islands (British)", code: "VG" },
    { name: "Virgin Islands (U.S.)", code: "VI" },
    { name: "Wallis and Futuna", code: "WF" },
    { name: "Western Sahara", code: "EH" },
    { name: "Yemen", code: "YE" },
    { name: "Zambia", code: "ZM" },
    { name: "Zimbabwe", code: "ZW" }
  ]

  const [selectedRegion, setRegion] = useState(regions[0].name)
  const [bucketName, setBucketName] = useState("")
  const handleCreateBucket = () => {
    store.dispatch(createBucket({authToken: authToken, name: bucketName, region: selectedRegion}));
    store.dispatch(getAllBucket({authToken: authToken, limit: 10, offset: 0}));
    onBack(null)
  }

  return (
    <Slide
      in={visibility}
      direction="left"
      mountOnEnter
      unmountOnExit
    >
      <Paper style={{ position: "absolute", width: "inherit", top: "0" }}>
        <div>
          <Toolbar variant="dense">
            <IconButton onClick={() => onBack(null)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography style={{ fontWeight: "bold" }}>Create a bucket</Typography>
          </Toolbar>
          <div style={{ marginLeft: "50px" }}>
            <InputLabel className="my-2"><Typography style={{ fontWeight: "bold", color: 'black', display: 'inline-block' }}>Name</Typography> (must be unique across storage)</InputLabel>
            <TextField value={bucketName} onChange={(e) => setBucketName(e.target.value)} variant="outlined" style={{ width: 650, backgroundColor: "#FFF" }} />
            <InputLabel className="my-2"><Typography style={{ fontWeight: "bold", color: 'black', display: 'inline-block' }} >Region</Typography></InputLabel>
            <Autocomplete
              id="region-select-"
              style={{ width: 650 }}
              options={regions}
              autoHighlight
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  value={selectedRegion}
                  onChange={(e) => setRegion(e.target.value)}
                  label="Choose a region"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <div style={{ marginTop: "50px", marginBottom: "15px" }} className="flex">
              <Button onClick={handleCreateBucket}
              style={{ color: "#FFF", backgroundColor: "#006DB3", marginRight: "80px" }}>Create</Button>
              <Button className="flex-end">Cancel</Button>
            </div>
        </div>
        </div>
      </Paper>
    </Slide >
  )
}

const Browser = ({isBucketLoading, bucketList = [], authToken, bucketItemsList = [], ...props}) => {
  const [buckets, setBuckets] = useState(bucketList);
  const [bucketItems, setBucketItems] = useState(props.bucketItemsList);
  // const [bucketItemSelected, setBucketItemSelected] = useState({ });

  const [bucketSelected, setBucketSelected] = useState(null);
  const [bucketName, setBucketName] = useState("")

  const handleSelectedBucket = (name, bucketId) => {
    setBucketSelected(bucketId);
    setBucketName(name)
    store.dispatch(getBucketItems({authToken: authToken, limit: 10, offset: 0, bucketId: bucketId}))
  }
  useEffect(() => {
    //if (!props.isBucketLoading)
      console.log(store.dispatch(getAllBucket({authToken: authToken, limit: 5, offset: 0})));
      setBuckets(bucketList)
    if (bucketSelected === null) {
      console.log(bucketList)
      setBucketItems(null);
      return;
    } else {
      console.log(props.bucketList)
    }
  }, []);

  return (
    <BucketContainer
      items={buckets}
      setItems={setBuckets}
      onItemClick={(name, bucketId) => handleSelectedBucket(name, bucketId)}
      visibility={bucketSelected !== null ? "hidden" : "visible"}
      authToken={authToken}
    >
      <BucketItemsContainer
        bucketName={bucketName}
        items={bucketItems}
        setItems={setBucketItems}
        onBack={() => setBucketSelected(null)}
        onItemClick={(name) => alert(name)}
        bucketId={bucketSelected}
      />
    </BucketContainer>
  );
};

const mapStateToProps = (state) => {
  const authToken = state.authen.authToken;
  const bucketList = state.bucket.bucketList;
  const isBucketLoading = state.bucket.isBucketLoading;
  const bucketItemsList = state.bucket.bucketItemsList;
  console.log(bucketList)
  return { authToken, bucketList, bucketItemsList, isBucketLoading }
};

export default connect(mapStateToProps)(Browser);