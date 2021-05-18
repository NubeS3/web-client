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
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreIcon from "@material-ui/icons/MoreVert";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddBoxIcon from "@material-ui/icons/AddBox";
// import DateFnsUtils from "@date-io/date-fns";
// import {
//   MuiPickersUtilsProvider,
//   KeyboardDatePicker,
// } from "@material-ui/pickers";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import store from "../../../store/store";
import {
  adminGetBucketAccessKey,
  adminGetBucketSignedKey,
} from "../../../store/admin/user";

const accessKeyHeadCells = [
  { id: "key", numeric: false, disablePadding: false, label: "Key" },
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
  { id: "key", numeric: false, disablePadding: false, label: "Key" },
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

const BucketKeyContainer = ({
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
  const [selectedAccessKey, setSelectedAccessKey] = useState([]);
  const [selectedSignedKey, setSelectedSignedKey] = useState([]);

  useEffect((_) => {
    store.dispatch(
      adminGetBucketAccessKey({
        authToken: authToken,
        bucketId: bucketId,
      })
    );
    store.dispatch(
      adminGetBucketSignedKey({
        authToken: authToken,
        bucketId: bucketId,
      })
    );
  }, []);

  return (
    <Slide in={show} direction="left" mountOnEnter unmountOnExit>
      <Paper
        style={{ position: "absolute", width: "inherit", top: "0" }}
        className="flex flex-col"
        elevation={0}
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

const NoCheckBoxTableHead = (props) => {
  const { order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
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
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [requestKey, setRequestKey] = useState({ key: "" });
  const isFirstRender = useRef(true);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //   useEffect(() => {
  //     if (!isFirstRender.current) {
  //       console.log(isFirstRender.current);
  //     }
  //   }, [requestKey]);

  useEffect(() => {
    isFirstRender.current = false; // toggle flag after first render/mounting
  }, []);

  const handleKeyClick = (accessKey) => {
    setRequestKey({ key: accessKey });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (state) => {
    setOpen(state);
  };

  const [open, setOpen] = useState(false);

  return (
    <>
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
              <div className="browser-appbar-button-group"></div>
            </Toolbar>
          </AppBar>
          <Table className="border">
            <NoCheckBoxTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(items, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        onClick={() => handleKeyClick(row.key)}
                      >
                        {row.key}
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //   useEffect(() => {
  //     if (!isFirstRender.current) {
  //       setOpenStatsDialog(true);
  //     }
  //   }, [requestKey]);

  useEffect(() => {
    isFirstRender.current = false; // toggle flag after first render/mounting
  }, []);

  const handleKeyClick = (publicKey) => {
    setRequestKey({ key: publicKey });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (state) => {
    setOpen(state);
  };

  const [open, setOpen] = useState(false);

  return (
    <>
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
              <div className="browser-appbar-button-group"></div>
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
            <NoCheckBoxTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(items, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        onClick={() => handleKeyClick(row.public)}
                      >
                        {row.public}
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
  const accessKeyList = state.userManage.accessKeyList;
  const signedKeyList = state.userManage.signedKeyList;
  const isLoading = state.bucket.isBucketLoading;
  return {
    isLoading,
    accessKeyList,
    signedKeyList,
  };
};

export default connect(mapStateToProps)(BucketKeyContainer);
