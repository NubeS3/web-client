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

<button type="button" onClick={() => handleOpen(true)}>
    Open
        </button>
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
                                <FormGroup className="grid grid-cols-2 grid-rows-4 gap-3">
                                    {permissions.map((permission) => {
                                        return (<FormControlLabel control={<Checkbox checked={permission.value} onChange={handlePermissionChange} name={permission.name} />} label={permission.label}>
                                        </FormControlLabel>)
                                    })}
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