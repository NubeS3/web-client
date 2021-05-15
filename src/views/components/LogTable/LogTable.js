import React, { useState, useEffect, createRef, useRef } from "react";
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
  Select,
  FormControl,
  InputLabel,
  TextField,
  Grid,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MoreIcon from "@material-ui/icons/MoreVert";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "./style.css";
import { connect } from "react-redux";
import store from "../../../store/store";
import {
  getAccessKeyLog,
  getAccessKeyReqCountAdmin,
  getAuthLog,
  getSignedKeyLog,
  getSignedKeyReqCountAdmin,
  resetLog,
} from "../../../store/admin/requestLog";

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

const authLogHeadCells = [
  {
    id: "uid",
    numeric: false,
    disablePadding: false,
    label: "UID",
  },
  {
    id: "method",
    numeric: false,
    disablePadding: false,
    label: "Method",
  },
  {
    id: "req",
    numeric: false,
    disablePadding: false,
    label: "Request Content",
  },
  {
    id: "at",
    numeric: false,
    disablePadding: false,
    label: "Requested at",
  },
  {
    id: "source_ip",
    numeric: false,
    disablePadding: false,
    label: "Source IP",
  },
  {
    id: "empty",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];
const accessLogHeadCells = [
  {
    id: "key",
    numeric: false,
    disablePadding: false,
    label: "Access Key",
  },
  {
    id: "method",
    numeric: false,
    disablePadding: false,
    label: "Method",
  },
  {
    id: "req",
    numeric: false,
    disablePadding: false,
    label: "Request Content",
  },
  {
    id: "at",
    numeric: false,
    disablePadding: false,
    label: "Requested at",
  },
  {
    id: "source_ip",
    numeric: false,
    disablePadding: false,
    label: "Source IP",
  },
  {
    id: "empty",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];
const signedLogHeadCells = [
  {
    id: "public",
    numeric: false,
    disablePadding: false,
    label: "Public Key",
  },
  {
    id: "method",
    numeric: false,
    disablePadding: false,
    label: "Method",
  },
  {
    id: "req",
    numeric: false,
    disablePadding: false,
    label: "Request Content",
  },
  {
    id: "at",
    numeric: false,
    disablePadding: false,
    label: "Requested at",
  },
  {
    id: "source_ip",
    numeric: false,
    disablePadding: false,
    label: "Source IP",
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

const LogContainer = ({
  items,
  setItems,
  onItemClick,
  visibility,
  setVisibility,
  authToken,
  isLoading,
  label,
  reqCount,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [headCells, setHeadCells] = useState(authLogHeadCells);
  const menuId = "mobile-menu";

  const [logType, setLogType] = useState("auth");
  const [requestBy, setRequestBy] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [inputLabel, setInputLabel] = useState("UID");

  const onLogTypeSelected = (e) => {
    setLogType(e.target.value);
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

  const handleLogRequest = () => {
    switch (logType) {
      case "auth":
        store.dispatch(
          getAuthLog({
            authToken: authToken,
            limit: 10,
            offset: 0,
            fromDate: Math.round(fromDate.getTime() / 1000),
            toDate: Math.round(toDate.getTime() / 1000),
            uid: requestBy,
          })
        );
        break;
      case "signed":
        console.log(requestBy);
        store.dispatch(
          getSignedKeyLog({
            authToken: authToken,
            limit: 10,
            offset: 0,
            fromDate: Math.round(fromDate.getTime() / 1000),
            toDate: Math.round(toDate.getTime() / 1000),
            public: requestBy,
          })
        );
        store.dispatch(
          getSignedKeyReqCountAdmin({
            authToken: authToken,
            limit: 10,
            offset: 0,
            fromDate: Math.round(fromDate.getTime() / 1000),
            toDate: Math.round(toDate.getTime() / 1000),
            public: requestBy,
          })
        );
        break;
      case "access":
        store.dispatch(
          getAccessKeyLog({
            authToken: authToken,
            limit: 10,
            offset: 0,
            fromDate: Math.round(fromDate.getTime() / 1000),
            toDate: Math.round(toDate.getTime() / 1000),
            key: requestBy,
          })
        );
        store.dispatch(
          getAccessKeyReqCountAdmin({
            authToken: authToken,
            limit: 10,
            offset: 0,
            fromDate: Math.round(fromDate.getTime() / 1000),
            toDate: Math.round(toDate.getTime() / 1000),
            key: requestBy,
          })
        );
    }
  };

  useEffect(
    (_) => {
      switch (logType) {
        case "auth":
          setHeadCells(authLogHeadCells);
          setInputLabel("UID:");
          store.dispatch(resetLog());
          break;
        case "signed":
          setHeadCells(signedLogHeadCells);
          setInputLabel("Public Key:");
          store.dispatch(resetLog());
          break;
        case "access":
          setHeadCells(accessLogHeadCells);
          setInputLabel("Access Key:");
          store.dispatch(resetLog());
      }
    },
    [logType]
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
          <FormControl className="mr-20px">
            <Select
              native
              disableUnderline
              value={logType}
              style={{ borderColor: "transparent" }}
              onChange={onLogTypeSelected}
              inputProps={{
                name: "logType",
                id: "logType",
              }}
            >
              <option value={"auth"}>Authenticated Request Log</option>
              <option value={"access"}>Access Key Request Log</option>
              <option value={"signed"}>Key Pairs Request Log</option>
            </Select>
          </FormControl>
          <div className="w-2/4">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around" alignItems="center">
                <div className="pt-2">
                  <TextField
                    label={inputLabel}
                    id={"requestedBy-input" + logType}
                    defaultValue={requestBy}
                    size="small"
                    onChange={(e) => {
                      setRequestBy(e.target.value);
                      console.log(requestBy);
                    }}
                  />
                </div>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="From Date:"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="To Date:"
                  value={toDate}
                  onChange={handleToDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </div>
          <div className="browser-appbar-button-group">
            <Button startIcon={<AddIcon />} onClick={handleLogRequest}>
              Log request
            </Button>
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

      <AdminTable
        headCells={headCells}
        items={items}
        selected={selected}
        setAnchorEl={setAnchorEl}
        setSelected={setSelected}
        onItemClick={onItemClick}
        logType={logType}
      />
      {props.children}
    </Paper>
  );
};

const AdminTable = ({
  selected,
  setSelected,
  headCells,
  items,
  onItemClick,
  setAnchorEl,
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

  const findWithProperty = (arr, prop, value) => {
    for (var i in arr) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  };

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      const newSelecteds = items.map((n) => ({ id: n.id, name: n.username }));
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleItemCheckboxClick = (event, fileItem) => {
    const selectedIndex = findWithProperty(selected, "id", fileItem.id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, fileItem);
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

  const isSelected = (id) => findWithProperty(selected, "id", id) !== -1;

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
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <LogTableRow
                    isItemSelected={isItemSelected}
                    row={row}
                    handleItemCheckboxClick={handleItemCheckboxClick}
                    setSelected={setSelected}
                    setAnchorEl={setAnchorEl}
                    labelId={labelId}
                    onItemClick={onItemClick}
                  />
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
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const LogTableRow = ({
  isItemSelected,
  row,
  handleItemCheckboxClick,
  setSelected,
  labelId,
  onItemClick,
  setAnchorEl,
}) => {
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
          onChange={(e) => handleItemCheckboxClick(e, row)}
          inputProps={{ "aria-labelledby": labelId }}
        />
      </TableCell>
      <TableCell
        component="th"
        id={labelId}
        onClick={() => onItemClick(row.from, row.from)}
        scope="row"
        padding="none"
      >
        {row.from}
      </TableCell>
      <TableCell align="left" onClick={() => onItemClick(row.from, row.from)}>
        {row.method}
      </TableCell>
      <TableCell align="left" onClick={() => onItemClick(row.from, row.from)}>
        {row.req}
      </TableCell>
      <TableCell align="left" onClick={() => onItemClick(row.from, row.from)}>
        {row.at}
      </TableCell>
      <TableCell align="left" onClick={() => onItemClick(row.from, row.from)}>
        {row.source_ip}
      </TableCell>
      <TableCell align="left">
        <IconButton
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setSelected([row]);
          }}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
const LogTable = ({
  requestLogList,
  isLoading,
  authToken,
  reqCount,
  ...props
}) => {
  // const [bucketItemSelected, setBucketItemSelected] = useState({ });
  const [adminSelected, setAdminSelected] = useState([]);
  const [selectedAdminName, setAdminName] = useState();

  const handleSelectedAdmin = (name, adminId) => {
    setAdminSelected(adminId);
    setAdminName(name);
  };

  useEffect(() => {
    if (adminSelected === null) {
      return;
    } else {
    }
  }, []);

  return (
    <>
      {/* { isLoading ? <CircularProgress className="self-center" /> : */}
      <LogContainer
        items={requestLogList}
        onItemClick={(name, adminId) => handleSelectedAdmin(name, adminId)}
        visibility={adminSelected !== null ? "hidden" : "visible"}
        authToken={authToken}
        isLoading={isLoading}
        reqCount={reqCount}
      ></LogContainer>
    </>
  );
};

const mapStateToProps = (state) => {
  const authToken = state.authen.authToken;
  const isLoading = state.adminManage.isLoading;
  const requestLogList = state.requestLogManage.requestLogList;
  const reqCount = state.requestLogManage.reqCount;
  return { authToken, requestLogList, isLoading, reqCount };
};

export default connect(mapStateToProps)(LogTable);
