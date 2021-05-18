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
  CircularProgress,
  Link,
  Breadcrumbs,
  FormGroup,
  FormLabel,
  FormControl,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreIcon from "@material-ui/icons/MoreVert";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PublishIcon from "@material-ui/icons/Publish";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import EditIcon from "@material-ui/icons/Edit";
import ArchiveIcon from "@material-ui/icons/Archive";
import DescriptionIcon from "@material-ui/icons/Description";
import FolderIcon from "@material-ui/icons/Folder";
import "./style.css";
import { useTheme } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetAppIcon from "@material-ui/icons/GetApp";
import { connect } from "react-redux";
import EditBucketContainer from "./BucketDetail";
import store from "../../../../store/store";
import {
  getAllBucket,
  createBucket,
  getBucketFiles,
  deleteBucket,
  getBucketFolders,
  createBucketFolder,
  getChildrenByPath,
} from "../../../../store/userStorage/bucket";
import { uploadFile } from "../../../../store/userStorage/upload";
import { downloadSingle } from "../../../../store/userStorage/download";

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
    id: "type",
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
  authToken,
  isBucketLoading,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const isMenuOpen = Boolean(anchorEl);
  const [createButtonClicked, setCreateButtonClick] = useState(false);

  const handleDeleteBucket = () => {
    for (var i in selected) {
      store.dispatch(
        deleteBucket({ authToken: authToken, bucketId: selected[i] })
      );
    }
    store.dispatch(getAllBucket({ authToken: authToken, limit: 5, offset: 0 }));
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

  useEffect((_) => {
    store.dispatch(
      getAllBucket({ authToken: authToken, limit: 5, offset: 0 })
    );
  }, []);

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
            <Button
              startIcon={<AddIcon />}
              onClick={() => setCreateButtonClick(true)}
            >
              Create bucket
            </Button>
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
      <CreateBucket
        authToken={authToken}
        visibility={createButtonClicked}
        onBack={() => setCreateButtonClick(false)}
      />
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
      const newSelecteds = items.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleItemCheckboxClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
                        onChange={(e) => handleItemCheckboxClick(e, row.id)}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
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

const BucketItemsContainer = ({
  bucketName,
  breadcrumbStack = [],
  setStack,
  children,
  files,
  folders,
  onBack,
  onItemClick,
  authToken,
  bucketId,
  isLoading,
}) => {
  // const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  // const isMenuOpen = Boolean(anchorEl);
  const [showEditBucket, setShowEditBucket] = useState(false);

  // const menuId = "mobile-menu";
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [openCreateFolderDialog, setOpenCreateFolderDialog] = useState(false);

  const [folderName, setFolderName] = useState();
  //const [breadcrumbStack, setBreadcrumbStack] = useState([]);

  const handleOpenDownload = () => {
    if (selected.length > 0) {
      setOpenDownloadDialog(true);
    }
  };

  const handleCloseDownload = () => {
    setOpenDownloadDialog(false);
  };

  const fileInputRef = useRef(null);
  const handleUploadFile = () => {
    fileInputRef.current.click();
    //setStack(breadcrumbStack => [...breadcrumbStack, bucketName +  breadcrumbStack.length])
  };

  const handleFileSelected = (e) => {
    e.preventDefault();
    let file = e.target.files;
    var parent_path = "";
    console.log(breadcrumbStack)
    if (breadcrumbStack.length === 1) {
      parent_path = "/";
    } else {
      parent_path = "/" + breadcrumbStack.slice(1).join("/");
    }
    console.log(parent_path);
    store.dispatch(
      uploadFile({
        authToken: authToken,
        file: file[0],
        bucketId: bucketId,
        full_path: parent_path,
      })
    );
  };

  const handleCreateFolder = () => {
    store.dispatch(
      createBucketFolder({
        authToken: authToken,
        name: folderName,
        parent_path: "/" + breadcrumbStack.join("/"),
      })
    );
    setOpenCreateFolderDialog(false);
  };

  const handleBreadcrumbStack = (link, index) => {
    setStack(breadcrumbStack.slice(0, index + 1));
  };

  const dropzoneRef = createRef();
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{ vertical: "top", horizontal: "right" }}
  //     keepMounted
  //     transformOrigin={{ vertical: "top", horizontal: "right" }}
  //     open={isMenuOpen}
  //     onClose={() => setAnchorEl(null)}
  //   >
  //     <MenuItem>
  //       <Button startIcon={<AddIcon />}>Create bucket</Button>
  //     </MenuItem>
  //     <MenuItem>
  //       <Button
  //         startIcon={<DeleteIcon />}
  //         disabled={selected.length !== 0 ? false : true}
  //       >
  //         Delete bucket
  //       </Button>
  //     </MenuItem>
  //   </Menu>
  // );

  useEffect((_) => {
    store.dispatch(
      getBucketFiles({
        authToken: authToken,
        limit: 5,
        offset: 0,
        bucketId: bucketId,
      })
    );
    store.dispatch(
      getBucketFolders({
        authToken: authToken,
        limit: 5,
        offset: 0,
        bucketId: bucketId,
      })
    );
  }, []);

  return (
    <Slide
      in={bucketId !== null ? true : false}
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
              <Button startIcon={<PublishIcon />} onClick={handleUploadFile}>
                Upload file
              </Button>
              <Button
                startIcon={<CreateNewFolderIcon />}
                onClick={() => setOpenCreateFolderDialog(true)}
              >
                Create folder
              </Button>
              <Button startIcon={<GetAppIcon />} onClick={handleOpenDownload}>
                Download
              </Button>
            </div>
            <div style={{ flexGrow: "1" }}></div>
            <div className="browser-appbar-button-group">
              <Button
                startIcon={<EditIcon />}
                onClick={() => setShowEditBucket(true)}
              >
                Edit bucket
              </Button>
            </div>
            {/* <div>
              <IconButton
                aria-label="show more"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div> */}
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
        <div className="mt-5 mx-5">
          <Breadcrumbs>
            {breadcrumbStack.map((link, index) => {
              return (
                <Link
                  color="inherit"
                  key={index}
                  onClick={() => handleBreadcrumbStack(link, index)}
                >
                  {link}
                </Link>
              );
            })}
          </Breadcrumbs>
        </div>
        <BucketItemTable
          headCells={bucketItemHeadCells}
          selected={selected}
          setSelected={setSelected}
          // items={files.concat(folders)}
          items={children}
          onItemClick={onItemClick}
        />
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelected}
        ></input>
        {/* </Dropzone> */}

        <ConfirmDownload
          open={openDownloadDialog}
          handleClose={handleCloseDownload}
          downloadList={selected}
          authToken={authToken}
          bucketId={bucketId}
          breadcrumbStack={breadcrumbStack}
        />
        <EditBucketContainer
          show={showEditBucket}
          title={bucketName}
          bucketId={bucketId}
          onBack={() => setShowEditBucket(false)}
        />
        {openCreateFolderDialog ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                    <h3 className="text-3xl font-semibold">Create folder</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setOpenCreateFolderDialog(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <FormControl>
                      <FormLabel>Folder Name:</FormLabel>
                      <FormGroup>
                        <div className="">
                          <TextField
                            value={folderName}
                            type="text"
                            onChange={(e) => setFolderName(e.target.value)}
                          ></TextField>
                        </div>
                      </FormGroup>
                    </FormControl>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                      onClick={() => setOpenCreateFolderDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-light-blue text-white active:bg-light-blue font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                      onClick={handleCreateFolder}
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
        {/* {renderMenu} */}
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

const ConfirmDownload = ({
  open,
  handleClose,
  downloadList,
  authToken,
  bucketId,
  breadcrumbStack,
}) => {
  const handleConfirmDownload = () => {
    for (var i in downloadList) {
      var full_path = `/${breadcrumbStack.join("/")}/${downloadList[i].name}`;
      console.log(
        store.dispatch(
          downloadSingle({
            authToken: authToken,
            full_path: full_path,
            bucketId: bucketId,
            fileName: downloadList[i].name,
          })
        )
      );
    }
    handleClose();
    notification();
  };

  return (
    <div>
      <ToastContainer />
      {open ? (
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
                    {downloadList.map((file, index) => {
                      return (
                        <li key={index}>
                          <ArchiveIcon /> {file.name}
                        </li>
                      );
                    })}
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
                    onClick={handleConfirmDownload}
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
      const newSelecteds = items.map((n) => ({ id: n.id, name: n.name }));
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
                      scope="row"
                      padding="none"
                      onClick={() => onItemClick(row)}
                    >
                      {row.type === "file" ? (
                        <DescriptionIcon color="action" />
                      ) : (
                        <FolderIcon color="action" />
                      )}{" "}
                      {row.name}
                    </TableCell>
                    <TableCell align="left">
                      {row.metadata ? 
                      <>{row.metadata.size ? (
                        row.metadata.size < 1024 ? (
                          <>{row.metadata.size} byte</>
                        ) : (
                          <>
                            {row.metadata.size < Math.pow(1024, 2) ? (
                              <>{Math.ceil(row.metadata.size / 1024)} KB</>
                            ) : (
                              <>{Math.ceil(row.metadata.size / Math.pow(1024, 2))} MB</>
                            )}
                          </>
                        )
                      ) : (
                        ""
                      )}</>
                      : null}
                    </TableCell>
                    <TableCell align="left">{row.metadata ? row.metadata.content_type : null}</TableCell>
                    <TableCell align="left">{row.metadata ? row.metadata.expired_date: null}</TableCell>
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
        rowsPerPageOptions={[6, 12, 18]}
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

const CreateBucket = ({ onBack, visibility, authToken }) => {
  const regions = [
    // { name: "Afghanistan", code: "AF" },
    // { name: "Åland Islands", code: "AX" },
    // { name: "Albania", code: "AL" },
    // { name: "Algeria", code: "DZ" },
    // { name: "American Samoa", code: "AS" },
    // { name: "AndorrA", code: "AD" },
    // { name: "Angola", code: "AO" },
    // { name: "Anguilla", code: "AI" },
    // { name: "Antarctica", code: "AQ" },
    // { name: "Antigua and Barbuda", code: "AG" },
    // { name: "Argentina", code: "AR" },
    // { name: "Armenia", code: "AM" },
    // { name: "Aruba", code: "AW" },
    // { name: "Australia", code: "AU" },
    // { name: "Austria", code: "AT" },
    // { name: "Azerbaijan", code: "AZ" },
    // { name: "Bahamas", code: "BS" },
    // { name: "Bahrain", code: "BH" },
    // { name: "Bangladesh", code: "BD" },
    // { name: "Barbados", code: "BB" },
    // { name: "Belarus", code: "BY" },
    // { name: "Belgium", code: "BE" },
    // { name: "Belize", code: "BZ" },
    // { name: "Benin", code: "BJ" },
    // { name: "Bermuda", code: "BM" },
    // { name: "Bhutan", code: "BT" },
    // { name: "Bolivia", code: "BO" },
    // { name: "Bosnia and Herzegovina", code: "BA" },
    // { name: "Botswana", code: "BW" },
    // { name: "Bouvet Island", code: "BV" },
    // { name: "Brazil", code: "BR" },
    // { name: "British Indian Ocean Territory", code: "IO" },
    // { name: "Brunei Darussalam", code: "BN" },
    // { name: "Bulgaria", code: "BG" },
    // { name: "Burkina Faso", code: "BF" },
    // { name: "Burundi", code: "BI" },
    // { name: "Cambodia", code: "KH" },
    // { name: "Cameroon", code: "CM" },
    // { name: "Canada", code: "CA" },
    // { name: "Cape Verde", code: "CV" },
    // { name: "Cayman Islands", code: "KY" },
    // { name: "Central African Republic", code: "CF" },
    // { name: "Chad", code: "TD" },
    // { name: "Chile", code: "CL" },
    // { name: "China", code: "CN" },
    // { name: "Christmas Island", code: "CX" },
    // { name: "Cocos (Keeling) Islands", code: "CC" },
    // { name: "Colombia", code: "CO" },
    // { name: "Comoros", code: "KM" },
    // { name: "Congo", code: "CG" },
    // { name: "Congo, The Democratic Republic of the", code: "CD" },
    // { name: "Cook Islands", code: "CK" },
    // { name: "Costa Rica", code: "CR" },
    // { name: 'Cote D"Ivoire', code: "CI" },
    // { name: "Croatia", code: "HR" },
    // { name: "Cuba", code: "CU" },
    // { name: "Cyprus", code: "CY" },
    // { name: "Czech Republic", code: "CZ" },
    // { name: "Denmark", code: "DK" },
    // { name: "Djibouti", code: "DJ" },
    // { name: "Dominica", code: "DM" },
    // { name: "Dominican Republic", code: "DO" },
    // { name: "Ecuador", code: "EC" },
    // { name: "Egypt", code: "EG" },
    // { name: "El Salvador", code: "SV" },
    // { name: "Equatorial Guinea", code: "GQ" },
    // { name: "Eritrea", code: "ER" },
    // { name: "Estonia", code: "EE" },
    // { name: "Ethiopia", code: "ET" },
    // { name: "Falkland Islands (Malvinas)", code: "FK" },
    // { name: "Faroe Islands", code: "FO" },
    // { name: "Fiji", code: "FJ" },
    // { name: "Finland", code: "FI" },
    // { name: "France", code: "FR" },
    // { name: "French Guiana", code: "GF" },
    // { name: "French Polynesia", code: "PF" },
    // { name: "French Southern Territories", code: "TF" },
    // { name: "Gabon", code: "GA" },
    // { name: "Gambia", code: "GM" },
    // { name: "Georgia", code: "GE" },
    // { name: "Germany", code: "DE" },
    // { name: "Ghana", code: "GH" },
    // { name: "Gibraltar", code: "GI" },
    // { name: "Greece", code: "GR" },
    // { name: "Greenland", code: "GL" },
    // { name: "Grenada", code: "GD" },
    // { name: "Guadeloupe", code: "GP" },
    // { name: "Guam", code: "GU" },
    // { name: "Guatemala", code: "GT" },
    // { name: "Guernsey", code: "GG" },
    // { name: "Guinea", code: "GN" },
    // { name: "Guinea-Bissau", code: "GW" },
    // { name: "Guyana", code: "GY" },
    // { name: "Haiti", code: "HT" },
    // { name: "Heard Island and Mcdonald Islands", code: "HM" },
    // { name: "Holy See (Vatican City State)", code: "VA" },
    // { name: "Honduras", code: "HN" },
    // { name: "Hong Kong", code: "HK" },
    // { name: "Hungary", code: "HU" },
    // { name: "Iceland", code: "IS" },
    // { name: "India", code: "IN" },
    // { name: "Indonesia", code: "ID" },
    // { name: "Iran, Islamic Republic Of", code: "IR" },
    // { name: "Iraq", code: "IQ" },
    // { name: "Ireland", code: "IE" },
    // { name: "Isle of Man", code: "IM" },
    // { name: "Israel", code: "IL" },
    // { name: "Italy", code: "IT" },
    // { name: "Jamaica", code: "JM" },
    // { name: "Japan", code: "JP" },
    // { name: "Jersey", code: "JE" },
    // { name: "Jordan", code: "JO" },
    // { name: "Kazakhstan", code: "KZ" },
    // { name: "Kenya", code: "KE" },
    // { name: "Kiribati", code: "KI" },
    // { name: "Korea, Democratic People's Republic of", code: "KP" },
    // { name: "Korea, Republic of", code: "KR" },
    // { name: "Kuwait", code: "KW" },
    // { name: "Kyrgyzstan", code: "KG" },
    // { name: "Lao People's Democratic Republic", code: "LA" },
    // { name: "Latvia", code: "LV" },
    // { name: "Lebanon", code: "LB" },
    // { name: "Lesotho", code: "LS" },
    // { name: "Liberia", code: "LR" },
    // { name: "Libyan Arab Jamahiriya", code: "LY" },
    // { name: "Liechtenstein", code: "LI" },
    // { name: "Lithuania", code: "LT" },
    // { name: "Luxembourg", code: "LU" },
    // { name: "Macao", code: "MO" },
    // { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
    // { name: "Madagascar", code: "MG" },
    // { name: "Malawi", code: "MW" },
    // { name: "Malaysia", code: "MY" },
    // { name: "Maldives", code: "MV" },
    // { name: "Mali", code: "ML" },
    // { name: "Malta", code: "MT" },
    // { name: "Marshall Islands", code: "MH" },
    // { name: "Martinique", code: "MQ" },
    // { name: "Mauritania", code: "MR" },
    // { name: "Mauritius", code: "MU" },
    // { name: "Mayotte", code: "YT" },
    // { name: "Mexico", code: "MX" },
    // { name: "Micronesia, Federated States of", code: "FM" },
    // { name: "Moldova, Republic of", code: "MD" },
    // { name: "Monaco", code: "MC" },
    // { name: "Mongolia", code: "MN" },
    // { name: "Montenegro", code: "ME" },
    // { name: "Montserrat", code: "MS" },
    // { name: "Morocco", code: "MA" },
    // { name: "Mozambique", code: "MZ" },
    // { name: "Myanmar", code: "MM" },
    // { name: "Namibia", code: "NA" },
    // { name: "Nauru", code: "NR" },
    // { name: "Nepal", code: "NP" },
    // { name: "Netherlands", code: "NL" },
    // { name: "Netherlands Antilles", code: "AN" },
    // { name: "New Caledonia", code: "NC" },
    // { name: "New Zealand", code: "NZ" },
    // { name: "Nicaragua", code: "NI" },
    // { name: "Niger", code: "NE" },
    // { name: "Nigeria", code: "NG" },
    // { name: "Niue", code: "NU" },
    // { name: "Norfolk Island", code: "NF" },
    // { name: "Northern Mariana Islands", code: "MP" },
    // { name: "Norway", code: "NO" },
    // { name: "Oman", code: "OM" },
    // { name: "Pakistan", code: "PK" },
    // { name: "Palau", code: "PW" },
    // { name: "Palestinian Territory, Occupied", code: "PS" },
    // { name: "Panama", code: "PA" },
    // { name: "Papua New Guinea", code: "PG" },
    // { name: "Paraguay", code: "PY" },
    // { name: "Peru", code: "PE" },
    // { name: "Philippines", code: "PH" },
    // { name: "Pitcairn", code: "PN" },
    // { name: "Poland", code: "PL" },
    // { name: "Portugal", code: "PT" },
    // { name: "Puerto Rico", code: "PR" },
    // { name: "Qatar", code: "QA" },
    // { name: "Reunion", code: "RE" },
    // { name: "Romania", code: "RO" },
    // { name: "Russian Federation", code: "RU" },
    // { name: "RWANDA", code: "RW" },
    // { name: "Saint Helena", code: "SH" },
    // { name: "Saint Kitts and Nevis", code: "KN" },
    // { name: "Saint Lucia", code: "LC" },
    // { name: "Saint Pierre and Miquelon", code: "PM" },
    // { name: "Saint Vincent and the Grenadines", code: "VC" },
    // { name: "Samoa", code: "WS" },
    // { name: "San Marino", code: "SM" },
    // { name: "Sao Tome and Principe", code: "ST" },
    // { name: "Saudi Arabia", code: "SA" },
    // { name: "Senegal", code: "SN" },
    // { name: "Serbia", code: "RS" },
    // { name: "Seychelles", code: "SC" },
    // { name: "Sierra Leone", code: "SL" },
    { name: "Singapore", code: "SG" },
    // { name: "Slovakia", code: "SK" },
    // { name: "Slovenia", code: "SI" },
    // { name: "Solomon Islands", code: "SB" },
    // { name: "Somalia", code: "SO" },
    // { name: "South Africa", code: "ZA" },
    // { name: "South Georgia and the South Sandwich Islands", code: "GS" },
    // { name: "Spain", code: "ES" },
    // { name: "Sri Lanka", code: "LK" },
    // { name: "Sudan", code: "SD" },
    // { name: "Suriname", code: "SR" },
    // { name: "Svalbard and Jan Mayen", code: "SJ" },
    // { name: "Swaziland", code: "SZ" },
    // { name: "Sweden", code: "SE" },
    // { name: "Switzerland", code: "CH" },
    // { name: "Syrian Arab Republic", code: "SY" },
    // { name: "Taiwan, Province of China", code: "TW" },
    // { name: "Tajikistan", code: "TJ" },
    // { name: "Tanzania, United Republic of", code: "TZ" },
    // { name: "Thailand", code: "TH" },
    // { name: "Timor-Leste", code: "TL" },
    // { name: "Togo", code: "TG" },
    // { name: "Tokelau", code: "TK" },
    // { name: "Tonga", code: "TO" },
    // { name: "Trinidad and Tobago", code: "TT" },
    // { name: "Tunisia", code: "TN" },
    // { name: "Turkey", code: "TR" },
    // { name: "Turkmenistan", code: "TM" },
    // { name: "Turks and Caicos Islands", code: "TC" },
    // { name: "Tuvalu", code: "TV" },
    // { name: "Uganda", code: "UG" },
    // { name: "Ukraine", code: "UA" },
    // { name: "United Arab Emirates", code: "AE" },
    // { name: "United Kingdom", code: "GB" },
    { name: "United States", code: "US" },
    // { name: "United States Minor Outlying Islands", code: "UM" },
    // { name: "Uruguay", code: "UY" },
    // { name: "Uzbekistan", code: "UZ" },
    // { name: "Vanuatu", code: "VU" },
    // { name: "Venezuela", code: "VE" },
    // { name: "Viet Nam", code: "VN" },
    // { name: "Virgin Islands, British", code: "VG" },
    // { name: "Virgin Islands, U.S.", code: "VI" },
    // { name: "Wallis and Futuna", code: "WF" },
    // { name: "Western Sahara", code: "EH" },
    // { name: "Yemen", code: "YE" },
    // { name: "Zambia", code: "ZM" },
    // { name: "Zimbabwe", code: "ZW" },
  ];

  const [selectedRegion, setRegion] = useState();
  const [bucketName, setBucketName] = useState("");
  const handleCreateBucket = () => {
    store.dispatch(
      createBucket({
        authToken: authToken,
        name: bucketName,
        region: selectedRegion,
      })
    );
    onBack(null);
  };

  return (
    <Slide in={visibility} direction="left" mountOnEnter unmountOnExit>
      <Paper style={{ position: "absolute", width: "inherit", top: "0", height: "160%"}}>
        <div>
          <Toolbar variant="dense">
            <IconButton onClick={() => onBack(null)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography style={{ fontWeight: "bold" }}>
              Create a bucket
            </Typography>
          </Toolbar>
          <div style={{ marginLeft: "50px" }}>
            <InputLabel className="my-2">
              <Typography
                style={{
                  fontWeight: "bold",
                  color: "black",
                  display: "inline-block",
                }}
              >
                Name
              </Typography>{" "}
              (must be unique across storage)
            </InputLabel>
            <TextField
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
              variant="outlined"
              style={{ width: 650, backgroundColor: "#FFF" }}
            />
            <InputLabel className="my-2">
              <Typography
                style={{
                  fontWeight: "bold",
                  color: "black",
                  display: "inline-block",
                }}
              >
                Region
              </Typography>
            </InputLabel>
            <Autocomplete
              id="region-select-"
              style={{ width: 650 }}
              options={regions}
              autoHighlight
              onChange={(e, value) => setRegion(value)}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  value={selectedRegion}
                  label="Choose a region"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
            <div
              style={{ marginTop: "50px", marginBottom: "15px" }}
              className="flex"
            >
              <Button
                onClick={handleCreateBucket}
                style={{
                  color: "#FFF",
                  backgroundColor: "#006DB3",
                  marginRight: "80px",
                }}
              >
                Create
              </Button>
              <Button className="flex-end" onClick={() => onBack(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Paper>
    </Slide>
  );
};

const Browser = ({
  isBucketLoading,
  bucketList,
  authToken,
  bucketFileList,
  bucketFolderList,
  folderChildrenList,
  ...props
}) => {
  const [bucketItems, setBucketItems] = useState(bucketFileList);
  // const [bucketItemSelected, setBucketItemSelected] = useState({ });
  const [bucketSelected, setBucketSelected] = useState(null);
  const [bucketName, setBucketName] = useState();
  const [breadcrumbStack, setBreadcrumbStack] = useState([]);

  const handleSelectedBucket = (name, bucketId) => {
    setBucketSelected(bucketId);
    setBucketName(name);
    setBreadcrumbStack((breadcrumbStack) => [...breadcrumbStack, name]);
    store.dispatch(
      getBucketFiles({
        authToken: authToken,
        limit: 10,
        offset: 0,
        bucketId: bucketId,
      })
    );
    store.dispatch(
      getBucketFolders({
        authToken: authToken,
        limit: 10,
        offset: 0,
        bucketId: bucketId,
      })
    );
    store.dispatch(
      getChildrenByPath({ authToken: authToken, full_path: "/" + name })
    );
  };

  const handleOnBucketItemClick = (row) => {
    if (row.type === "folder") {
      setBreadcrumbStack((breadcrumbStack) => [...breadcrumbStack, row.name]);
    }
  };
  useEffect(() => {
    if (bucketSelected === null) {
      return;
    } else {
    }
  }, []);

  useEffect(() => {
    store.dispatch(
      getChildrenByPath({
        authToken: authToken,
        full_path: "/" + breadcrumbStack.join("/"),
      })
    );
  }, [breadcrumbStack]);

  return (
    <>
      {isBucketLoading ? (
        <CircularProgress className="self-center" />
      ) : (
        <BucketContainer
          items={bucketList}
          onItemClick={(name, bucketId) => handleSelectedBucket(name, bucketId)}
          visibility={bucketSelected !== null ? "hidden" : "visible"}
          authToken={authToken}
          isBucketLoading={isBucketLoading}
        >
          <BucketItemsContainer
            bucketName={bucketName}
            files={bucketFileList}
            children={folderChildrenList}
            breadcrumbStack={breadcrumbStack}
            setStack={setBreadcrumbStack}
            folders={bucketFolderList}
            setItems={setBucketItems}
            onBack={() => {
              setBucketSelected(null);
              setBreadcrumbStack([]);
            }}
            onItemClick={(row) => handleOnBucketItemClick(row)}
            bucketId={bucketSelected}
            authToken={authToken}
            isLoading={isBucketLoading}
          />
        </BucketContainer>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const authToken = state.authen.authToken;
  const bucketList = state.bucket.bucketList;
  const isBucketLoading = state.bucket.isBucketLoading;
  const bucketFileList = state.bucket.bucketFileList;
  const bucketFolderList = state.bucket.bucketFolderList;
  const folderChildrenList = state.bucket.folderChildrenList;
  console.log(folderChildrenList)
  return {
    authToken,
    bucketList,
    bucketFileList,
    bucketFolderList,
    isBucketLoading,
    folderChildrenList,
  };
};

export default connect(mapStateToProps)(Browser);
