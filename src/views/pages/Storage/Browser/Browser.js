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
} from "@material-ui/core";
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
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetAppIcon from "@material-ui/icons/GetApp";
import Dropzone from 'react-dropzone'
import { connect } from "react-redux"
import EditBucketContainer from "./BucketDetail";

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
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  {
    id: "accessMode",
    numeric: false,
    disablePadding: false,
    label: "Access Mode",
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
    id: "lastModified",
    numeric: false,
    disablePadding: false,
    label: "Last modified",
  },
  {
    id: "accessMode",
    numeric: false,
    disablePadding: false,
    label: "Access Mode",
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
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const isMenuOpen = Boolean(anchorEl);

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
            <Button startIcon={<AddIcon />}>Create bucket</Button>
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
                      onClick={() => onItemClick(row.name)}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
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
  title,
  items,
  setItems,
  onBack,
  onItemClick,
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
    console.log(file[0])
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
      in={items !== null ? true : false}
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
            <h3 style={{ marginRight: "20px" }}>{title}</h3>
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
        <EditBucketContainer show={showEditBucket} title={title}/>
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

const Browser = (props) => {
  const [buckets, setBuckets] = useState(bucketRows);
  const [bucketItems, setBucketItems] = useState(null);
  // const [bucketItemSelected, setBucketItemSelected] = useState({});

  const [bucketSelected, setBucketSelected] = useState(null);

  useEffect(() => {
    if (bucketSelected === null) {
      setBucketItems(null);
      return;
    }
    setBucketItems(bucketItemRows);
  }, [bucketSelected]);

  return (
    <BucketContainer
      items={buckets}
      setItems={setBuckets}
      onItemClick={(name) => setBucketSelected(name)}
      visibility={bucketSelected !== null ? "hidden" : "visible"}
    >
      <BucketItemsContainer
        title={bucketSelected}
        items={bucketItems}
        setItems={setBucketItems}
        onBack={() => setBucketSelected(null)}
        onItemClick={(name) => alert(name)}
      />
    </BucketContainer>
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(Browser);