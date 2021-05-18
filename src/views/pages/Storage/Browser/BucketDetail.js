import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
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
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  TextField,
  Grid,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreIcon from "@material-ui/icons/MoreVert";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import store from "../../../../store/store";
import {
  createBucketKey,
  createSignedKey,
  getBucketAccessKey,
  getSignedKey,
  deleteBucketKey,
  deleteSignedKey,
} from "../../../../store/userStorage/bucket";
import {
  countAllAccessKeyReq,
  countAllSignedKeyReq,
  countDateAccessKeyReq,
  countDateSignedKeyReq,
} from "../../../../store/userStorage/bucketKey";
import { DateTime } from "luxon";

const accessKeyHeadCells = [
  { id: "key", numeric: false, disablePadding: true, label: "Key" },
  {
    id: "expiringDate",
    numeric: false,
    disablePadding: false,
    label: "Expiring date",
  },
  {
    id: "permission",
    numeric: false,
    disablePadding: false,
    label: "Permission",
  },

  {
    id: "empty",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];

const signedKeyHeadCells = [
  { id: "key", numeric: false, disablePadding: true, label: "Key" },
  {
    id: "expiringDate",
    numeric: false,
    disablePadding: false,
    label: "Expiring date",
  },
  {
    id: "permission",
    numeric: false,
    disablePadding: false,
    label: "Permission",
  },

  {
    id: "empty",
    numeric: false,
    disablePadding: false,
    label: "",
  },
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

const KeyStatistic = ({ open, handleOpen, count, reqKey, id, authToken }) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [toggleDate, setToggleDate] = useState(false);
  const handleCheckReqCount = () => {
    switch (id) {
      case "access":
        if (!toggleDate) {
          store.dispatch(
            countAllAccessKeyReq({
              authToken: authToken,
              key: reqKey.key,
            })
          );
        } else {
          console.log(
            store.dispatch(
              countDateAccessKeyReq({
                authToken: authToken,
                fromDate: Math.round(fromDate.getTime() / 1000),
                toDate: Math.round(toDate.getTime() / 1000),
                key: reqKey.key,
              })
            )
          );
        }
        break;
      case "signed":
        if (!toggleDate) {
          store.dispatch(
            countAllSignedKeyReq({
              authToken: authToken,
              public: reqKey.key,
            })
          );
        } else {
          store.dispatch(
            countDateSignedKeyReq({
              authToken: authToken,
              fromDate: Math.round(fromDate.getTime() / 1000),
              toDate: Math.round(toDate.getTime() / 1000),
              public: reqKey.key,
            })
          );
        }
        break;
      default:
        break;
    }
  };

  const handleFromDateChange = (date) => {
    if (date > toDate) {
      alert("From Date must be before To Date");
      return;
    }
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    if (date < fromDate) {
      alert("To Date must be after From Date");
      return;
    }
    setToDate(date);
  };

  return (
    <>
      {open ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Key Request Statistic
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={handleOpen}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <Grid container justify="space-between" alignItems="flex-end">
                    <TextField
                      disabled
                      disableUnderline
                      label="Key"
                      id={"requestedby-" + id}
                      defaultValue={reqKey.key}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="default"
                          inputProps={{
                            "aria-label": "checkbox with default color",
                          }}
                          checked={toggleDate}
                          onChange={() => setToggleDate(!toggleDate)}
                        />
                      }
                      label="Check with date range"
                    />
                  </Grid>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid
                      container
                      justify="space-between"
                      alignItems="flex-end"
                    >
                      <KeyboardDatePicker
                        disabled={!toggleDate}
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id={id + "-from"}
                        label="From Date:"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        className="w-5/12"
                      />
                      <KeyboardDatePicker
                        disabled={!toggleDate}
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id={id + "-to"}
                        label="To Date:"
                        value={toDate}
                        onChange={handleToDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        className="w-5/12"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {`This key has been used ${count.count} time(s)`}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-between p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={handleOpen}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={handleCheckReqCount}
                  >
                    Check
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}{" "}
    </>
  );
};

const EditBucketContainer = ({
  title,
  bucketId,
  onBack,
  onItemClick,
  show,
  authToken,
  accessKeyList,
  signedKeyList,
  accessKeyReqCount,
  signedKeyReqCount,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAccessKey, setSelectedAccessKey] = useState([]);
  const [selectedSignedKey, setSelectedSignedKey] = useState([]);

  const menuId = "mobile-menu";
  useEffect((_) => {
    store.dispatch(
      getBucketAccessKey({
        authToken: authToken,
        bucketId: bucketId,
        limit: 5,
        offset: 0,
      })
    );
    store.dispatch(
      getSignedKey({
        authToken: authToken,
        bucketId: bucketId,
        limit: 5,
        offset: 0,
      })
    );
  }, []);

  return (
    <Slide
      // in={bucketId !== '' ? true : false}
      in={show}
      direction="left"
      mountOnEnter
      unmountOnExit
    >
      <Paper
        style={{
          position: "absolute",
          width: "inherit",
          top: "0",
          height: "150%",
        }}
        className="flex flex-col"
      >
        {/* <AppBar
                    style={{ backgroundColor: "white", color: "black" }}
                > */}
        <Toolbar variant="dense">
          <IconButton onClick={() => onBack(null)}>
            <ArrowBackIcon />
          </IconButton>
          <h3 style={{ marginRight: "20px" }}>{title}</h3>
        </Toolbar>
        {/* </AppBar> */}
        <AccessKeyTable
          headCells={accessKeyHeadCells}
          selected={selectedAccessKey}
          setSelected={setSelectedAccessKey}
          items={accessKeyList}
          onItemClick={onItemClick}
          authToken={authToken}
          bucketId={bucketId}
          reqCount={accessKeyReqCount}
        />
        <SignedKeyTable
          headCells={signedKeyHeadCells}
          selected={selectedSignedKey}
          setSelected={setSelectedSignedKey}
          items={signedKeyList}
          onItemClick={onItemClick}
          authToken={authToken}
          bucketId={bucketId}
          reqCount={signedKeyReqCount}
        />
      </Paper>
    </Slide>
  );
};

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
            inputProps={{ "aria-label": "select all keys" }}
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

const AccessKeyTable = ({
  selected,
  setSelected,
  headCells,
  items,
  onItemClick,
  bucketId,
  authToken,
  reqCount,
}) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [requestKey, setRequestKey] = useState({ key: "" });
  const isFirstRender = useRef(true);
  const handleOpenStatsDialog = () => {
    setOpenStatsDialog(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDeleteAccessKey = () => {
    selected.forEach((element) => {
      store.dispatch(
        deleteBucketKey({
          authToken: authToken,
          bucketId: bucketId,
          accessKey: element,
        })
      );
    });
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = items.map((n) => n.key);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      console.log(isFirstRender.current);
      setOpenStatsDialog(true);
    }
  }, [requestKey]);

  useEffect(() => {
    isFirstRender.current = false; // toggle flag after first render/mounting
  }, []);

  const handleKeyClick = (accessKey) => {
    setRequestKey({ key: accessKey });
  };

  const handleItemCheckboxClick = (event, index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

  const handleOpen = (state) => {
    setOpen(state);
  };

  const handleGenerateKey = () => {
    const requestPermissions = [];
    Object.keys(permissionState).map((permission, index) => {
      if (permissionState[permission] === true) {
        requestPermissions.push(permission);
      }
    });

    if (requestPermissions.length === 0) {
      alert("Please provide at least 1 key permission!");
      return;
    } else if (!currentExpireDate) {
      alert("Please choose an expiration date!");
      return;
    }
    const formatedDate = DateTime.fromISO(currentExpireDate).toISO({
      suppressMilliseconds: true,
    });
    store.dispatch(
      createBucketKey({
        authToken: authToken,
        bucketId: bucketId,
        expiringDate: formatedDate,
        permissions: requestPermissions,
      })
    );
    setOpen(false);
  };

  const [open, setOpen] = useState(false);
  const [currentExpireDate, setExpiringDate] = useState(new Date());
  const [permissionState, setPermissionState] = useState({
    GetFileList: false,
    GetFileListHidden: false,
    Download: false,
    DownloadHidden: false,
    Upload: false,
    DeleteFile: false,
    RecoverFile: false,
  });
  const {
    GetFileList,
    GetFileListHidden,
    Download,
    DownloadHidden,
    Upload,
    DeleteFile,
    RecoverFile,
  } = permissionState;

  const handlePermissionChange = (e) => {
    setPermissionState({
      ...permissionState,
      [e.target.name]: e.target.checked,
    });
  };

  const permissions = [
    {
      value: GetFileList,
      name: "GetFileList",
      label: "Get file list",
    },
    {
      value: GetFileListHidden,
      name: "GetFileListHidden",
      label: "Get hidden file list",
    },
    {
      value: Download,
      name: "Download",
      label: "Download",
    },
    {
      value: DownloadHidden,
      name: "DownloadHidden",
      label: "Download hidden",
    },
    {
      value: Upload,
      name: "Upload",
      label: "Upload",
    },
    {
      value: DeleteFile,
      name: "DeleteFile",
      label: "Delete file",
    },
    {
      value: RecoverFile,
      name: "RecoverFile",
      label: "Recover file",
    },
  ];

  return (
    <>
      {open ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold">Create new key</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => handleOpen(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <FormControl>
                    <FormLabel></FormLabel>
                    <FormGroup>
                      <div className="grid grid-cols-2 grid-rows-4 gap-3">
                        {permissions.map((permission, i) => {
                          return (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={permission.value}
                                  key={i}
                                  onChange={handlePermissionChange}
                                  name={permission.name}
                                />
                              }
                              key={i}
                              label={permission.label}
                            ></FormControlLabel>
                          );
                        })}
                      </div>
                    </FormGroup>
                  </FormControl>
                  <p className="my-4 text-gray-600 text-lg leading-relaxed">
                    Choose key expiration date:
                  </p>
                  <form noValidate>
                    <TextField
                      id="expire-local"
                      type="datetime-local"
                      defaultValue={currentExpireDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => setExpiringDate(e.target.value)}
                    />
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={() => handleOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={handleGenerateKey}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <KeyStatistic
        open={openStatsDialog}
        handleOpen={handleOpenStatsDialog}
        count={reqCount}
        reqKey={requestKey}
        id={"access"}
        authToken={authToken}
      />
      <Paper elevation={0} className="mx-auto my-10 w-4/5 max-h-5xl ">
        <TableContainer>
          <AppBar
            elevation={0}
            position="static"
            style={{ backgroundColor: "white", color: "black" }}
          >
            <Toolbar variant="regular">
              <h3 style={{ marginRight: "20px" }}>Access Key</h3>
              <div style={{ flexGrow: "1" }}></div>
              <div className="browser-appbar-button-group">
                <Button
                  startIcon={<AddBoxIcon />}
                  onClick={() => handleOpen(true)}
                >
                  Create access key
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteAccessKey}
                >
                  Delete
                </Button>
              </div>
              {/* <div className="flex">
                            <IconButton
                                aria-label="show more"
                                // aria-controls={menuId}
                                aria-haspopup="true"
                                // onClick={(e) => setAnchorEl(e.currentTarget)}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </div> */}
            </Toolbar>
          </AppBar>
          <Table className="border">
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
                  const isItemSelected = isSelected(row.key);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={(e) => handleItemCheckboxClick(e, row.key)}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        onClick={() => handleKeyClick(row.key)}
                      >
                        {index}
                      </TableCell>
                      <TableCell align="left">{row.expired_date}</TableCell>
                      <TableCell align="left">
                        {row.permissions.join(", ").toString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {/* {emptyRows > 0 && (
                                <TableRow style={{ height: 81 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

const SignedKeyTable = ({
  selected,
  setSelected,
  headCells,
  items,
  onItemClick,
  bucketId,
  authToken,
  reqCount,
}) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [requestKey, setRequestKey] = useState("");
  const isFirstRender = useRef(true);
  const handleOpenStatsDialog = () => {
    setOpenStatsDialog(false);
  };
  const handleDeleteSignedKey = () => {
    selected.forEach((element) => {
      store.dispatch(
        deleteSignedKey({
          authToken: authToken,
          bucketId: bucketId,
          publicKey: element,
        })
      );
    });
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = items.map((n) => n.public);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      setOpenStatsDialog(true);
    }
  }, [requestKey]);

  useEffect(() => {
    isFirstRender.current = false; // toggle flag after first render/mounting
  }, []);

  const handleKeyClick = (publicKey) => {
    setRequestKey({ key: publicKey });
  };

  const handleItemCheckboxClick = (event, index) => {
    const selectedIndex = selected.indexOf(index);
    console.log(selected);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

  const handleOpen = (state) => {
    setOpen(state);
  };

  const handleGenerateKey = () => {
    const requestPermissions = [];
    Object.keys(permissionState).map((permission, index) => {
      if (permissionState[permission] === true) {
        requestPermissions.push(permission);
      }
    });

    if (requestPermissions.length === 0) {
      alert("Please provide at least 1 key permission!");
      return;
    } else if (!currentExpireDate) {
      alert("Please choose an expiration date!");
      return;
    }
    const formatedDate = DateTime.fromISO(currentExpireDate).toISO({
      suppressMilliseconds: true,
    });
    store.dispatch(
      createSignedKey({
        authToken: authToken,
        bucketId: bucketId,
        expiringDate: formatedDate,
        permissions: requestPermissions,
      })
    );
    setOpen(false);
  };

  const [open, setOpen] = useState(false);
  const [currentExpireDate, setExpiringDate] = useState(new Date());
  const [permissionState, setPermissionState] = useState({
    GetFileList: false,
    GetFileListHidden: false,
    Download: false,
    DownloadHidden: false,
    Upload: false,
    DeleteFile: false,
    RecoverFile: false,
  });
  const {
    GetFileList,
    GetFileListHidden,
    Download,
    DownloadHidden,
    Upload,
    DeleteFile,
    RecoverFile,
  } = permissionState;

  const handlePermissionChange = (e) => {
    setPermissionState({
      ...permissionState,
      [e.target.name]: e.target.checked,
    });
  };

  const permissions = [
    {
      value: GetFileList,
      name: "GetFileList",
      label: "Get file list",
    },
    {
      value: GetFileListHidden,
      name: "GetFileListHidden",
      label: "Get hidden file list",
    },
    {
      value: Download,
      name: "Download",
      label: "Download",
    },
    {
      value: DownloadHidden,
      name: "DownloadHidden",
      label: "Download hidden",
    },
    {
      value: Upload,
      name: "Upload",
      label: "Upload",
    },
    {
      value: DeleteFile,
      name: "DeleteFile",
      label: "Delete file",
    },
    {
      value: RecoverFile,
      name: "RecoverFile",
      label: "Recover file",
    },
  ];

  return (
    <>
      {open ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold">Create new key</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => handleOpen(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <FormControl>
                    <FormLabel></FormLabel>
                    <FormGroup>
                      <div className="grid grid-cols-2 grid-rows-4 gap-3">
                        {permissions.map((permission, i) => {
                          return (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={permission.value}
                                  key={i}
                                  onChange={handlePermissionChange}
                                  name={permission.name}
                                />
                              }
                              key={i}
                              label={permission.label}
                            ></FormControlLabel>
                          );
                        })}
                      </div>
                    </FormGroup>
                  </FormControl>
                  <p className="my-4 text-gray-600 text-lg leading-relaxed">
                    Choose key expiration date:
                  </p>
                  <form noValidate>
                    <TextField
                      id="expire-local"
                      type="datetime-local"
                      defaultValue={currentExpireDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => setExpiringDate(e.target.value)}
                    />
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                  <button
                    className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={() => handleOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                    onClick={handleGenerateKey}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <KeyStatistic
        open={openStatsDialog}
        handleOpen={handleOpenStatsDialog}
        count={reqCount}
        reqKey={requestKey}
        id={"signed"}
        authToken={authToken}
      />
      <Paper elevation={0} className="mx-auto my-10 w-4/5 max-h-5xl ">
        <TableContainer>
          <AppBar
            elevation={0}
            position="static"
            style={{ backgroundColor: "white", color: "black" }}
          >
            <Toolbar variant="regular">
              <h3 style={{ marginRight: "20px" }}>Signed Key Pairs</h3>
              <div style={{ flexGrow: "1" }}></div>
              <div className="browser-appbar-button-group">
                <Button
                  startIcon={<AddBoxIcon />}
                  onClick={() => handleOpen(true)}
                >
                  Create key pairs
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteSignedKey(selected)}
                >
                  Delete
                </Button>
              </div>
              {/* <div className="flex">
                            <IconButton
                                aria-label="show more"
                                // aria-controls={menuId}
                                aria-haspopup="true"
                                // onClick={(e) => setAnchorEl(e.currentTarget)}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </div> */}
            </Toolbar>
          </AppBar>
          <Table className="border">
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
                  const isItemSelected = isSelected(row.public);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={(e) =>
                            handleItemCheckboxClick(e, row.public)
                          }
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        onClick={() => handleKeyClick(row.public)}
                      >
                        {index}
                      </TableCell>
                      <TableCell align="left">{row.expired_date}</TableCell>
                      <TableCell align="left">
                        {row.permissions.join(", ").toString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {/* {emptyRows > 0 && (
                                <TableRow style={{ height: 81 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

const mapStateToProps = (state) => {
  const authToken = state.authen.authToken;
  const accessKeyList = state.bucket.accessKeyList;
  const signedKeyList = state.bucket.signedKeyList;
  const accessKeyReqCount = state.bucketKey.accessKeyReqCount;
  const signedKeyReqCount = state.bucketKey.signedKeyReqCount;
  const isLoading = state.bucket.isBucketLoading;
  const reqCount = state.bucket.reqCount;
  console.log(accessKeyReqCount);
  console.log(signedKeyList);
  return {
    authToken,
    isLoading,
    accessKeyList,
    signedKeyList,
    signedKeyReqCount,
    accessKeyReqCount,
  };
};

export default connect(mapStateToProps)(EditBucketContainer);
