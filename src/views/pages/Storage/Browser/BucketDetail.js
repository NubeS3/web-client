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
    FormControl, FormLabel, FormGroup, FormControlLabel,
    TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreIcon from "@material-ui/icons/MoreVert";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddBoxIcon from '@material-ui/icons/AddBox';
import ShareIcon from "@material-ui/icons/Share";
import EditIcon from "@material-ui/icons/Edit";
import "./style.css";
import { useTheme } from "@material-ui/core/styles";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux"

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

const keyItemRows = [
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

const EditBucketContainer = ({
    title,
    bucketId,
    items,
    onBack,
    onItemClick,
    show,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selected, setSelected] = useState([]);
    const isMenuOpen = Boolean(anchorEl);

    const menuId = "mobile-menu";

    return (
        <Slide
            // in={bucketId !== '' ? true : false}
            in={show}
            direction="left"
            mountOnEnter
            unmountOnExit
        >
            <Paper style={{ position: "absolute", width: "inherit", top: "0" }}
                className="flex flex-col">
                {/* <AppBar
                    style={{ backgroundColor: "white", color: "black" }}
                > */}
                <Toolbar variant="dense">
                    <IconButton onClick={() => onBack(null)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <h3 style={{ marginRight: "20px" }}>{title}</h3>
                    <div style={{ flexGrow: "1" }}></div>
                    <div className="browser-appbar-button-group">
                        <Button startIcon={<EditIcon />}>Edit bucket</Button>
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
                {/* </AppBar> */}
                <AccessKeyTable
                    headCells={accessKeyHeadCells}
                    selected={selected}
                    setSelected={setSelected}
                    items={items || []}
                    onItemClick={onItemClick}
                    title={title}
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

const AccessKeyTable = ({
    selected,
    setSelected,
    headCells,
    items,
    onItemClick,
    title,
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
            const newSelecteds = keyItemRows.map((n) => n.name);
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

    const handleOpen = (state) => {
        console.log(permissions)
        setOpen(state)
    }

    const handleGenerateKey = _ => {
        setBucketKey("A883DA");
    }
    const [open, setOpen] = useState(false);
    const [bucketKey, setBucketKey] = useState('000000')
    const currentExpireDate = new Date();
    const [permissionState, setPermissionState] = useState({
        GetFileList: false,
        GetFileListHidden: false,
        Download: false,
        DownloadHidden: false,
        Upload: false,
        UploadHidden: false,
        DeleteFile: false,
        RecoverFile: false,
    });
    const { GetFileList, GetFileListHidden, Download, DownloadHidden,
        Upload, UploadHidden, DeleteFile, RecoverFile } = permissionState;

    const handlePermissionChange = (e) => {
        setPermissionState({ ...permissionState, [e.target.name]: e.target.checked })
    }

    const permissions = [
        {
            value: GetFileList,
            name: 'GetFileList',
            label: 'Get file list',
        },
        {
            value: GetFileListHidden,
            name: 'GetFileListHidden',
            label: 'Get hidden file list',
        },
        {
            value: Download,
            name: 'Download',
            label: 'Download',
        },
        {
            value: DownloadHidden,
            name: 'DownloadHidden',
            label: 'Download hidden',
        },
        {
            value: Upload,
            name: 'Upload',
            label: 'Upload',
        },
        {
            value: UploadHidden,
            name: 'UploadHidden',
            label: 'Upload hidden',
        },
        {
            value: DeleteFile,
            name: 'DeleteFile',
            label: 'Delete file',
        },
        {
            value: RecoverFile,
            name: 'RecoverFile',
            label: 'Recover file',
        },
    ];

    return (
        <>
            {
                open ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            Create new key
                    </h3>
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
                                        <FormControl >
                                            <FormLabel></FormLabel>
                                            <FormGroup>
                                                <div className="grid grid-cols-2 grid-rows-4 gap-3">
                                                    {permissions.map((permission) => {
                                                        return (<FormControlLabel control={<Checkbox checked={permission.value} onChange={handlePermissionChange} name={permission.name} />} label={permission.label}>
                                                        </FormControlLabel>)
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
                                            />
                                        </form>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
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
                                            onClick={() => handleOpen(false)}
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
                                <Button startIcon={<AddBoxIcon />} onClick={() => handleOpen(true)}>Create access key</Button>
                                <Button startIcon={<DeleteIcon />}>Delete</Button>
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
                            rowCount={keyItemRows.length}
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
                                                {row.permission}
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
                    count={keyItemRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
};

export default EditBucketContainer