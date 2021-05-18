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
  TextField,
  Collapse,
  InputAdornment,
  Box,
  Typography,
  Slide,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MoreIcon from "@material-ui/icons/MoreVert";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import "./style.css";
import { connect } from "react-redux";
import store from "../../../store/store";
import {
  adminGetUserBucketList,
  disableUser,
  getUserList,
} from "../../../store/admin/user";
import AdminDrawer from "../../components/AdminDrawer";
import BucketKeyContainer from "./AdminBucketDetail";

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

const userManageHeadCells = [
  {
    id: "uid",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
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

const UserContainer = ({
  items,
  setItems,
  onItemClick,
  visibility,
  setVisibility,
  authToken,
  isLoading,
  bucketList,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const isMenuOpen = Boolean(anchorEl);

  const [isVisiblePass, setVisiblePass] = useState(false);
  const [newUsername, setNewUsername] = useState();
  const [newPassword, setNewPassword] = useState();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [openDisableDialog, setOpenDisableDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDisableDialog(false);
  };

  const handleClickShowPassword = () => {
    setVisiblePass(!isVisiblePass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleDisableUser = () => {
    setOpenDisableDialog(true);
    setAnchorEl(null);
    // for (var i in selected) {

    //   store.dispatch(deleteBucket({ authToken: authToken, bucketId: selected[i] }))
    // }
    // store.dispatch(getAllBucket({ authToken: authToken, limit: 5, offset: 0 }))
    // setSelected([]);
  };

  const handleAddUser = () => {
    setOpenAddDialog(false);
  };

  const menuId = "mobile-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={() => {
        setAnchorEl(null);
        setSelected([]);
      }}
    >
      <MenuItem onClick={handleDisableUser}>Disable User</MenuItem>
      <MenuItem>User's bucket</MenuItem>
    </Menu>
  );

  const renderAddDialog = (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
              <h3 className="text-3xl font-semibold">Add new user</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setOpenAddDialog(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <label>Username</label>
              <TextField
                style={{
                  width: "100%",
                }}
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div className="relative p-6 flex-auto">
              <label>Password</label>
              <TextField
                style={{
                  width: "100%",
                }}
                type={isVisiblePass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {isVisiblePass ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                type="button"
                style={{ transition: "all .15s ease" }}
                onClick={() => setOpenAddDialog(false)}
              >
                Cancel
              </button>
              <button
                className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                type="button"
                style={{ transition: "all .15s ease" }}
                onClick={handleAddUser}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );

  useEffect((_) => {}, [isLoading]);

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
          <h3 style={{ marginRight: "20px" }}>MANAGE USER</h3>
          <div className="browser-appbar-button-group">
            {/* <Button startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}>Add new user</Button> */}
            <Button
              startIcon={<AddIcon />}
              style={{ outline: "none" }}
              onClick={() => setOpenDisableDialog(true)}
            >
              Disable a user
            </Button>
            {/* <Button
              startIcon={<DeleteIcon />}
              disabled={selected.length !== 0 ? false : true}
              onClick={handleDisableUser}
            >
              Disable
            </Button> */}
          </div>
        </Toolbar>
      </AppBar>

      <UserTable
        headCells={userManageHeadCells}
        items={items}
        selected={selected}
        setSelected={setSelected}
        onItemClick={onItemClick}
        bucketList={bucketList}
        setAnchorEl={setAnchorEl}
      />
      {renderMenu}
      {openAddDialog ? renderAddDialog : null}
      <ConfirmDialog
        open={openDisableDialog}
        handleClose={handleCloseDialog}
        selected={selected}
      />
      {props.children}
    </Paper>
  );
};

const UserTable = ({
  selected,
  setSelected,
  headCells,
  items,
  onItemClick,
  setAnchorEl,
  bucketList,
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
                  <React.Fragment>
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
                        onClick={() => onItemClick(row.username, row.id)}
                        scope="row"
                        padding="none"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell
                        align="left"
                        onClick={() => onItemClick(row.username, row.id)}
                      >
                        {row.username}
                      </TableCell>
                      <TableCell
                        align="left"
                        onClick={() => onItemClick(row.username, row.id)}
                      >
                        {row.created_at}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setSelected([row]);
                          }}
                          color="inherit"
                          style={{ outline: "none" }}
                        >
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {/* <NestedBucketTable
                      row={row}
                      bucketList={bucketList}
                      isItemSelected={isItemSelected}
                      labelId={labelId}
                      onItemClick={onItemClick}
                      handleItemCheckboxClick={handleItemCheckboxClick}
                      setSelected={setSelected}
                    /> */}
                  </React.Fragment>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 81 * emptyRows }}>
                <TableCell colSpan={5} />
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

const BucketContainer = ({
  userId,
  onBack,
  items,
  setItems,
  visibility,
  setVisibility,
  authToken,
  username,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const menuId = "mobile-menu";
  const [bucketSelected, setBucketSelected] = useState(null);
  const [bucketName, setBucketName] = useState();
  const [showBucketKeyTable, setShowBucketKeyTable] = useState(false);
  useEffect(() => {
    store.dispatch(
      adminGetUserBucketList({ authToken: authToken, uid: userId })
    );
  }, [userId]);

  const onBucketClick = (name, id) => {
    setBucketSelected(id);
    setBucketName(name);
    setShowBucketKeyTable(true);
    console.log(authToken);
  };

  return (
    <Slide
      in={userId !== null ? true : false}
      direction="left"
      mountOnEnter
      unmountOnExit
    >
      <Paper style={{ position: "absolute", width: "inherit", top: "0", height: '155%' }}>
        <AppBar
          position="static"
          style={{ backgroundColor: "white", color: "black" }}
        >
          <Toolbar variant="dense">
            <IconButton onClick={() => onBack(null)}>
              <ArrowBackIcon />
            </IconButton>
            <h3 style={{ marginRight: "20px" }}>{username}'s buckets</h3>
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
          selected={bucketSelected}
          setSelected={setBucketSelected}
          onItemClick={onBucketClick}
        />
        {showBucketKeyTable ? (
          <BucketKeyContainer
            authToken={authToken}
            show={showBucketKeyTable}
            title={bucketName}
            bucketId={bucketSelected}
            onBack={() => {
              setBucketSelected(null);
              setShowBucketKeyTable(false);
            }}
          />
        ) : null}
        {/* {renderMenu} */}
      </Paper>
    </Slide>
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const emptyRows =
  //   rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

  return (
    <Paper>
      <TableContainer>
        <Table>
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
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell
                      component="th"
                      id={labelId}
                      onClick={() => onItemClick(row.name, row.id)}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name, row.id)}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name, row.id)}
                    >
                      {row.uid}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name, row.id)}
                    >
                      {row.region}
                    </TableCell>
                    <TableCell
                      align="left"
                      onClick={() => onItemClick(row.name, row.id)}
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
  );
};

const ConfirmDialog = ({ open, handleClose, authToken }) => {
  const [disableUsername, setDisableUsername] = useState("");
  const handleConfirmDisable = () => {
    store.dispatch(
      disableUser({ authToken: authToken, username: disableUsername })
    );
    handleClose();
  };

  return (
    <div>
      {open ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold">Disable User</h3>
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
                  <label>Username</label>
                  <TextField
                    style={{
                      width: "100%",
                    }}
                    type="text"
                    value={disableUsername}
                    onChange={(e) => setDisableUsername(e.target.value)}
                    autoFocus
                  />
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
                    onClick={handleConfirmDisable}
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

// const NestedBucketTable = ({
//   row,
//   isItemSelected,
//   labelId,
//   onItemClick,
//   handleItemCheckboxClick,
//   setSelected,
//   authToken,
//   bucketList,
// }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const isMenuOpen = Boolean(anchorEl);
//   const [expand, setExpand] = useState(false);
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       keepMounted
//       transformOrigin={{ vertical: "top", horizontal: "right" }}
//       open={isMenuOpen}
//       onClose={() => {
//         setAnchorEl(null);
//         setSelected([]);
//       }}
//     >
//       <MenuItem>Disable User</MenuItem>
//       <MenuItem
//         onClick={() => {
//           setExpand(true);
//         }}
//       >
//         User's bucket
//       </MenuItem>
//     </Menu>
//   );

//   const fetchUserBucket = () => {};

//   return (
//     <>
//       {renderMenu}
//       <TableRow
//         hover
//         aria-checked={isItemSelected}
//         tabIndex={-1}
//         key={row.id}
//         selected={isItemSelected}
//       >
//         <TableCell padding="checkbox">
//           <Checkbox
//             checked={isItemSelected}
//             onChange={(e) => handleItemCheckboxClick(e, row)}
//             inputProps={{ "aria-labelledby": labelId }}
//           />
//         </TableCell>
//         <TableCell
//           component="th"
//           id={labelId}
//           onClick={() => onItemClick(row.username, row.id)}
//           scope="row"
//           padding="none"
//         >
//           {row.id}
//         </TableCell>
//         <TableCell
//           align="left"
//           onClick={() => onItemClick(row.username, row.id)}
//         >
//           {row.username}
//         </TableCell>
//         <TableCell
//           align="left"
//           onClick={() => onItemClick(row.username, row.id)}
//         >
//           {row.created_at}
//         </TableCell>
//         <TableCell align="right">
//           <IconButton
//             onClick={(e) => {
//               setAnchorEl(e.currentTarget);
//               setSelected([row]);
//             }}
//             color="inherit"
//             style={{ outline: "none" }}
//           >
//             <MoreIcon />
//           </IconButton>
//         </TableCell>
//       </TableRow>
//       <TableRow key={"nested" + row.id}>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
//           <Collapse in={expand} timeout="auto" unmountOnExit>
//             <Box margin={1}>
//               <Typography variant="h6" gutterBottom component="div">
//                 Bucket
//                 <IconButton
//                   aria-label="expand row"
//                   size="small"
//                   onClick={() => setExpand(!expand)}
//                 >
//                   {expand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//                 </IconButton>
//               </Typography>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Bucket ID</TableCell>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Region</TableCell>
//                     <TableCell>Created at</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {bucketList
//                     ? bucketList.map((bucketRow, index) => (
//                         <TableRow hover tabIndex={-1} key={bucketRow.id}>
//                           <TableCell
//                             component="th"
//                             // onClick={() => onItemClick(row.username, row.id)}
//                             scope="row"
//                             padding="none"
//                             align="left"
//                           >
//                             {bucketRow.id}
//                           </TableCell>
//                           <TableCell
//                             align="left"
//                             // onClick={() => onItemClick(row.username, row.id)}
//                           >
//                             {bucketRow.name}
//                           </TableCell>
//                           <TableCell
//                             align="left"
//                             // onClick={() => onItemClick(row.username, row.id)}
//                           >
//                             {bucketRow.region}
//                           </TableCell>
//                           <TableCell
//                             align="left"
//                             // onClick={() => onItemClick(row.username, row.id)}
//                           >
//                             {bucketRow.created_at}
//                           </TableCell>
//                           {/* <TableCell align="right">
//                             <IconButton
//                               onClick={(e) => {
//                                 setAnchorEl(e.currentTarget);
//                                 // setSelected([row]);
//                               }}
//                               color="inherit"
//                             >
//                               <MoreIcon />
//                             </IconButton>
//                           </TableCell> */}
//                         </TableRow>
//                       ))
//                     : null}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// };

const UserManageBoard = ({
  isLoading,
  userList,
  authToken,
  userBucketList,
  ...props
}) => {
  // const [bucketItemSelected, setBucketItemSelected] = useState({ });
  const [userSelected, setUserSelected] = useState(null);
  const [selectedUserName, setUserName] = useState();
  const [showBucketContainer, setShowBucketContainer] = useState(false);
  const handleSelectedUser = (name, userId) => {
    setUserSelected(userId);
    setUserName(name);
  };

  useEffect(() => {
    store.dispatch(getUserList({ authToken: authToken, limit: 5, offset: 0 }));
    if (userSelected === null) {
      return;
    } else {
    }
  }, []);

  useEffect(() => {
    store.dispatch(
      adminGetUserBucketList({ authToken: authToken, uid: userSelected })
    );
    setShowBucketContainer(true);
    console.log(userBucketList);
    return () => {};
  }, [userSelected]);

  return (
    <AdminDrawer>
      {/* { isLoading ? <CircularProgress className="self-center" /> : */}
      <UserContainer
        items={userList}
        onItemClick={(name, userId) => handleSelectedUser(name, userId)}
        visibility={userSelected !== null ? "hidden" : "visible"}
        authToken={authToken}
        isLoading={isLoading}
        bucketList={userBucketList}
      >
        {showBucketContainer ? (
          <BucketContainer
            items={userBucketList}
            userId={userSelected}
            username={selectedUserName}
            onBack={() => {
              setUserSelected(null);
            }}
            authToken={authToken}
            // onItemClick={(name, bucketId) => handleSelectedBucket(name, bucketId)}
            // visibility={bucketSelected
          ></BucketContainer>
        ) : null}
      </UserContainer>

      {/* } */}
    </AdminDrawer>
  );
};

const mapStateToProps = (state) => {
  const authToken = state.adminAuthen.adminToken;
  const isLoading = state.userManage.isLoading;
  const userList = state.userManage.userList;
  const userBucketList = state.userManage.userBucketList;
  return { authToken, userList, isLoading, userBucketList };
};

export default connect(mapStateToProps)(UserManageBoard);
