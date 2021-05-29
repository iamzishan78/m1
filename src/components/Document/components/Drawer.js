import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { AppContext } from "AppContext";
import CloseIcon from "@material-ui/icons/Close";
import { Typography, Grid } from "@material-ui/core";
import loadashFilter from "lodash/filter";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
  withStyles,
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { KeyboardDatePicker } from "@material-ui/pickers";
import UploadZone from "../../Shared/UploadZone";
import Tooltip from "@material-ui/core/Tooltip";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFilePowerpoint,
  faFileWord,
  faFileExcel,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import joinAddress from "components/Shared/valueformatters/join-address.js";
import AutocompEntityNamesVirtualizeList from "components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";
import { VIEWFILEQUERY, VIEWFILESQUERY } from "graphQL/useQueryViewFile";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import DeleteDocumentConfirmation from "components/Shared/DeleteDocumentConfirmation";
import { UPDATE_DOCUMENT } from "graphQL/useMutationUpdateDocument";
import { DOCUMENT_TYPE } from "graphQL/useQueryDocumentType";
import { setStateIfDeepEqual } from "components/Shared/functions";

const filter = createFilterOptions();

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  maxWidth: {
    width: "100%",
  },

  fileUploadSection: {
    minHeight: "50px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
  },
  fileUploadTopSection: {
    minHeight: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "23px",
  },
  uploadTitle: {
    margin: "0",
    color: "#757575",
    fontWeight: "normal",
    marginBottom: "8px",
  },
  uploadSubtext: {
    color: "rgb(176, 176, 176)",
    margin: "0",
    fontWeight: "normal",
  },
  IconSection: {
    minHeight: "35px",
    display: "flex",
    justifyContent: "center",
    width: "fit-content",
  },
  fileDrop: {
    minHeight: "125px",
    width: "100%",
    padding: "10px 40px",
    color: "#757575",
    fontWeight: "normal",
    backgroundColor: "#eee",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed rgb(176, 176, 176)",
    marginBottom: "30px",
  },
  imageSubText: {
    letterSpacing: "0.5px",
    textAlign: "center",
  },
  fileDropError: {
    color: "red",
  },
  Uploadcomp: {
    width: "200px !important",
    height: "200px !important",
  },
  forImage: {
    width: "100px !important",
    height: "100px !important",
    backgroundColor: "transparent !important",
    border: "1px solid #999",
    borderRadius: "10px !important",
  },
  forImageContainer: {
    width: "100px !important",
    height: "100px !important",
    borderRadius: "10px !important",
    backgroundColor: "#eeeeee !important",
    border: "1px solid #999",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#555",
    textTransform: "uppercase",
    paddingTop: "30px",
    cursor: "pointer",
    marginBottom: "5px",
  },
  dialogFooter: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "10px",
    paddingRight: "19px",
    paddingBottom: "40px",
  },
  footerButton: {
    letterSpacing: "1px",
    textTransform: "capitalize",
    fontWeight: "bold",
    padding: "8px 20px",
  },
});

export default function DocumentDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [recentFiles, setRecentFiles] = useState([]);
  const [newDocument, setNewDocument] = useState({
    fileName: "",
    dateTime: new Date(),
    documentNumber: "No Number",
    documentType: "",
    partyName1: "",
    partyName2: "",
    fileId: "",
  });

  const [nameAutValueParty1, setNameAutValueParty1] = useState({
    name: "",
    _id: null,
  });
  const [nameAutValueParty2, setNameAutValueParty2] = useState({
    name: "",
    _id: null,
  });

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);

  const [fileIdToDelete, setFileIdToDelete] = useState(null);

  let [loader, setLoader] = useState(false);
  const [viewFile, { data: viewFileResult, loading: viewFileLoading }] =
    useLazyQuery(VIEWFILEQUERY, {
      fetchPolicy: "no-cache",
    });

  const [getDocumentTypes, { data: documentTypes }] = useLazyQuery(
    DOCUMENT_TYPE,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    getDocumentTypes();
  }, [getDocumentTypes]);

  const [updateDocument, { loading: updateFileloading }] =
    useMutation(UPDATE_DOCUMENT);

  const UpDatefileFN = () => {
    let documentType = ''
    if(typeof newDocument.documentType === 'string'){
      documentType = newDocument.documentType
    }else if(newDocument.documentType?.name){
      documentType = newDocument.documentType.name
    }
    if (stateApp.selectedDocument.fileId) {
      setLoader(true);
      updateDocument({
        variables: {
          document: {
            fileName: newDocument.fileName,
            dateTime: newDocument.dateTime,
            documentNumber: newDocument.documentNumber,
            documentType: documentType,
            partyName1: nameAutValueParty1._id,
            partyName2: nameAutValueParty2._id,
            fileId: newDocument.fileId,
          },
        },
      }).then(() => {
        setLoader(false);
      });
    }
  };
  const handleViewFile = async (id) => {
    viewFile({ variables: { fileId: id } });
    if (viewFileLoading) {
      console.log(viewFileResult, "ViewFIle Result");
    }
  };
  const handleDeleteCancel = () => {
    setFileIdToDelete(null);
    setOpenDeleteConfirmDialog(false);
  };

  const handleDeleteAccept = () => {
    // Delete Document Logic goes here
    if (fileIdToDelete) {
      setLoader(true);
      updateDocument({
        variables: {
          document: {
            fileId: fileIdToDelete,
            isDeleted: true,
          },
        },
        refetchQueries: ["getDocuments"],
        awaitRefetchQueries: true,
      }).then(() => {
        setStateApp({
          ...stateApp,
          DocumentDrawer: false,
          selectedDocument: {},
        });
        setFileIdToDelete(null);
        setOpenDeleteConfirmDialog(false);
        setLoader(false);
      });
    }
  };
  console.log(stateApp.DocumentLoader, "Document Loader");

  useEffect(() => {
    if (viewFileResult?.viewFile?.uri) {
      let a = document.createElement("a");
      a.href = viewFileResult.viewFile.uri;
      a.download = viewFileResult.viewFile.name;

      // if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
      // a.target = "_blank";

      // file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
      a.click();
    }
  }, [viewFileResult]);

  const [viewFiles, { data: viewFileSResult, loading: viewFileSLoading }] =
    useLazyQuery(VIEWFILESQUERY, {
      fetchPolicy: "no-cache",
    });

  useEffect(() => {
    let ID = [];
    if (stateApp.selectedDocument?.fileId) {
      ID.push(stateApp.selectedDocument?.fileId);

      viewFiles({
        variables: { fileIds: ID },
      });
      if (stateApp.selectedDocument) {
        const {
          fileName,
          dateTime,
          documentNumber,
          documentType,
          partyName1,
          partyName2,
          fileId,
        } = stateApp.selectedDocument;
        setNameAutValueParty1({
          name: partyName1?.entityDetail?.name,
          _id: partyName1?._id,
        });
        setNameAutValueParty2({
          name: partyName2?.entityDetail?.name,
          _id: partyName2?._id,
        });

        setNewDocument({
          fileName,
          dateTime,
          documentNumber,
          documentType,
          partyName1,
          partyName2,
          fileId,
        });
      }
    }
  }, [stateApp.selectedDocument]);

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);
  console.log(stateApp.user.mongoId, "user Id");
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const getFileIcon = (fileExtension) => {
    switch (fileExtension) {
      case "pdf":
        return (
          <FontAwesomeIcon
            icon={faFilePdf}
            style={{ fontSize: "2rem", color: "#F15642" }}
          />
        );
      case "csv":
        return (
          <FontAwesomeIcon
            icon={faFileExcel}
            style={{ fontSize: "2rem", color: "#207244" }}
          />
        );
      case "xlsx":
        return (
          <FontAwesomeIcon
            icon={faFileExcel}
            style={{ fontSize: "2rem", color: "#207244" }}
          />
        );
      case "xlsb":
        return (
          <FontAwesomeIcon
            icon={faFileExcel}
            style={{ fontSize: "2rem", color: "#207244" }}
          />
        );
      case "xlsm":
        return (
          <FontAwesomeIcon
            icon={faFileExcel}
            style={{ fontSize: "2rem", color: "#207244" }}
          />
        );
      case "xltx":
        return (
          <FontAwesomeIcon
            icon={faFileExcel}
            style={{ fontSize: "2rem", color: "#207244" }}
          />
        );
      case "doc":
        return (
          <FontAwesomeIcon
            icon={faFileWord}
            style={{ fontSize: "2rem", color: "#2A5599" }}
          />
        );
      case "docx":
        return (
          <FontAwesomeIcon
            icon={faFileWord}
            style={{ fontSize: "2rem", color: "#2A5599" }}
          />
        );
      case "ppt":
        return (
          <FontAwesomeIcon
            icon={faFilePowerpoint}
            style={{ fontSize: "2rem", color: "#D04424" }}
          />
        );
      case "pptx":
        return (
          <FontAwesomeIcon
            icon={faFilePowerpoint}
            style={{ fontSize: "2rem", color: "#D04424" }}
          />
        );
      default:
        // return <span>{fileExtension}</span>;
        return (
          <FontAwesomeIcon
            icon={faFile}
            style={{ fontSize: "2rem", color: "grey" }}
          />
        );
    }
  };

  const DocumentDetail = (anchor) => (
    <div
      style={{ width: "500px", marginLeft: "15px" }}
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem
          style={{
            display: "flex",
            justifyContent: "between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <ListItemText>
            {stateApp.selectedDocument?.fileId ? (
              <h3>Document Detail</h3>
            ) : (
              <h3>Add New Document</h3>
            )}
          </ListItemText>
          <ListItemIcon style={{ cursor: "pointer" }}>
            {stateApp.selectedDocument?.fileId && (
              <IconButton
                size="small"
                onClick={() => {
                  setOpenDeleteConfirmDialog(true);
                  setFileIdToDelete(stateApp.selectedDocument.fileId);
                  console.log(stateApp.selectedDocument, " StateApp");
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={() => {
                setStateApp({
                  ...stateApp,
                  DocumentDrawer: false,
                  selectedDocument: {},
                });
              }}
            >
              <CloseIcon></CloseIcon>
            </IconButton>
          </ListItemIcon>
        </ListItem>
        <ListItem
          style={{
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <h4>Document Number</h4>
          <TextField
            className={classes.maxWidth}
            multiline
            value={newDocument?.documentNumber}
            onChange={(e) => {
              setNewDocument({
                ...newDocument,
                documentNumber: e.target.value,
              });
            }}
          />
        </ListItem>
        <ListItem
          style={{
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <h4>Document Name</h4>
          <TextField
            className={classes.maxWidth}
            multiline
            value={newDocument?.fileName}
            onChange={(e) => {
              setNewDocument({
                ...newDocument,
                fileName: e.target.value,
              });
            }}
          />
        </ListItem>
        <ListItem
          style={{
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <h4>Document Type</h4>
          <DocumentType
            className={classes.maxWidth}
            documentTypes={documentTypes}
            setDocumentType={(value) => { 
              setNewDocument({
                ...newDocument,
                documentType: value,
              })
            }}
            value={newDocument.documentType? newDocument.documentType : ""}
          />
        </ListItem>
        <ListItem
          style={{
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <h4>Document Date</h4>
          <KeyboardDatePicker
            className={classes.maxWidth}
            disableToolbar
            variant="inline"
            format="MM/DD/YYYY"
            margin="normal"
            id="date-picker-inline"
            value={newDocument?.dateTime}
            onChange={(date) => {
              setNewDocument({
                ...newDocument,
                dateTime: String(date["_d"]),
              });
            }}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </ListItem>
        <ListItem
          style={{
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <h4>Party 1 Name</h4>
          <ContactPaginatedDropdown
            nameAutValue={nameAutValueParty1}
            setNameAutValue={setNameAutValueParty1}
          />
        </ListItem>
        <ListItem
          style={{
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <h4>Party 2 Name</h4>
          <ContactPaginatedDropdown
            nameAutValue={nameAutValueParty2}
            setNameAutValue={setNameAutValueParty2}
          />
        </ListItem>
        {stateApp.selectedDocument?.fileId ? (
          <ListItem>
            <div style={{ display: "flex", justifyContent: "start" }}>
              {console.log(recentFiles, "Files data in Adddialog")}
              {viewFileSResult?.viewFiles?.map((value, key) => {
                let fileExtension = value?.name
                  ?.slice(value.name.lastIndexOf(".") + 1)
                  ?.toLowerCase();
                if (key <= 1) {
                  return (
                    <div key={key}>
                      <LightTooltip
                        title={
                          <div className={classes.IconSection}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setOpenDeleteConfirmDialog(true);
                                setFileIdToDelete(
                                  stateApp.selectedDocument.fileId
                                );
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>

                            <IconButton
                              disabled={false}
                              size="small"
                              onClick={(e) => {
                                e.preventDefault();
                                handleViewFile(value.id);
                              }}
                            >
                              <GetAppIcon />
                            </IconButton>
                          </div>
                        }
                        interactive
                      >
                        <div>
                          {new RegExp(
                            ["jpg", "jpeg", "png", "bmp"].join("|")
                          ).test(fileExtension) ? (
                            <img
                              src={value.uri}
                              alt={value.name}
                              className={classes.forImage}
                            ></img>
                          ) : (
                            <div className={classes.forImageContainer}>
                              {/* {fileExtension} */}
                              {getFileIcon(fileExtension)}
                            </div>
                          )}
                          <div className={classes.imageSubText}>
                            {value?.name?.length > 12
                              ? value.name.slice(0, 8) + "..."
                              : value.name}
                          </div>
                        </div>
                      </LightTooltip>
                    </div>
                  );
                }
              })}
              {/* <div style={{width:'150px',marginLeft:'20px'}}>
         <UploadZone
                style={{width:'150px',height:'150px'}}
             
              />
         </div> */}
            </div>
          </ListItem>
        ) : (
          <ListItem>
            <h4>Click or drag and drop file to upload</h4>

            <div style={{ display: "flex", justifyContent: "start" }}>
              {console.log(recentFiles, "Files data in Adddialog")}
              {recentFiles?.map((value, key) => {
                let fileExtension = value?.name
                  ?.slice(value.name.lastIndexOf(".") + 1)
                  ?.toLowerCase();
                if (key <= 1) {
                  return (
                    <div key={key}>
                      <LightTooltip
                        title={
                          <div className={classes.IconSection}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setOpenDeleteConfirmDialog(true);
                                setFileIdToDelete(value.id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>

                            <IconButton
                              disabled={false}
                              size="small"
                              // onClick={() =>
                              //   handleViewFile(
                              //     files?.getFileDescriptors[key].fileId
                              //   )
                              // }
                            >
                              <GetAppIcon />
                            </IconButton>
                          </div>
                        }
                        interactive
                      >
                        <div>
                          {new RegExp(
                            ["jpg", "jpeg", "png", "bmp"].join("|")
                          ).test(fileExtension) ? (
                            <img
                              src={value.uri}
                              alt={value.name}
                              className={classes.forImage}
                            ></img>
                          ) : (
                            <div className={classes.forImageContainer}>
                              {/* {fileExtension} */}
                              {getFileIcon(fileExtension)}
                            </div>
                          )}
                          <div className={classes.imageSubText}>
                            {value?.name?.length > 12
                              ? value.name.slice(0, 8) + "..."
                              : value.name}
                          </div>
                        </div>
                      </LightTooltip>
                    </div>
                  );
                }
              })}
              <div style={{ width: "150px", marginLeft: "20px" }}>
                <UploadZone style={{ width: "150px", height: "150px" }} />
              </div>
            </div>
          </ListItem>
        )}
      </List>

      <div className={classes.dialogFooter}>
        <Button
          variant="contained"
          color="default"
          size="medium"
          disableElevation
          // disabled={updateDealLoading || addContactLoading}
          className={classes.footerButton}
          style={{
            margin: "0px 15px 0px 0px",
          }}
          onClick={() => {
            setStateApp({
              ...stateApp,
              DocumentDrawer: false,
              selectedDocument: {},
            });
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="medium"
          disableElevation
          onClick={() => {
            setLoader(true);
            if (stateApp.selectedDocument.fileId) {
              UpDatefileFN();
            }
          }}
          className={classes.footerButton}
        >
          Save
        </Button>
      </div>

      <Divider />
    </div>
  );
  // const list = (anchor) => (
  //   <div
  //     style={{ width: "500px", marginLeft: "15px" }}
  //     className={clsx(classes.list, {
  //       [classes.fullList]: anchor === "top" || anchor === "bottom",
  //     })}
  //     role="presentation"
  //     onClick={toggleDrawer(anchor, false)}
  //     onKeyDown={toggleDrawer(anchor, false)}
  //   >
  //     <List>
  //       <ListItem
  //         style={{
  //           display: "flex",
  //           justifyContent: "between",
  //           width: "100%",
  //           alignItems: "center",
  //         }}
  //       >
  //         <ListItemText>
  //           <h3>Add New Document</h3>
  //         </ListItemText>
  //         <ListItemIcon
  //           style={{ cursor: "pointer" }}
  //           onClick={() => {
  //             console.log(stateApp.refetchDocument, "Refetch documents");
  //             setStateApp({
  //               ...stateApp,
  //               DocumentDrawer: false,
  //               selectedDocument: {},
  //             });
  //           }}
  //         >
  //           <CloseIcon></CloseIcon>
  //         </ListItemIcon>
  //       </ListItem>
  //       <ListItem
  //         style={{
  //           flexDirection: "column",
  //           justifyContent: "start",
  //           alignItems: "start",
  //         }}
  //       >
  //         <h4>Document Number</h4>
  //         <TextField className={classes.maxWidth} multiline />
  //       </ListItem>
  //       <ListItem
  //         style={{
  //           flexDirection: "column",
  //           justifyContent: "start",
  //           alignItems: "start",
  //         }}
  //       >
  //         <h4>Document Name</h4>
  //         <TextField className={classes.maxWidth} multiline />
  //       </ListItem>
  //       <ListItem
  //         style={{
  //           flexDirection: "column",
  //           justifyContent: "start",
  //           alignItems: "start",
  //         }}
  //       >
  //         <h4>Document Type</h4>
  //         <Autocomplete
  //           className={classes.maxWidth}
  //           options={["pdf", "doc", "txt"]}
  //           // onChange={(e, user) => { setNewContact({ ...newContact, contactOwner: user.value }); }}
  //           // value={users.find((user) => user?.value === newContact.contactOwner) || null}
  //           // getOptionLabel={(option) => option.text}
  //           // getOptionSelected={(option) => option.value === newContact.contactOwner}
  //           renderInput={(params) => (
  //             <TextField
  //               size="small"
  //               {...params}
  //               className={classes.maxWidth}
  //               multiline
  //             />
  //           )}
  //         />
  //       </ListItem>

  //       <ListItem
  //         style={{
  //           flexDirection: "column",
  //           justifyContent: "start",
  //           alignItems: "start",
  //         }}
  //       >
  //         <h4>Document Type</h4>
  //         <KeyboardDatePicker
  //           className={classes.maxWidth}
  //           disableToolbar
  //           variant="inline"
  //           format="MM/dd/yyyy"
  //           margin="normal"
  //           id="date-picker-inline"
  //           // label={<h4 style={{paddingBottom:'30px'}}>Document Date</h4>}
  //           value={selectedDate}
  //           onChange={handleDateChange}
  //           KeyboardButtonProps={{
  //             "aria-label": "change date",
  //           }}
  //         />
  //       </ListItem>
  //       <ListItem
  //         style={{
  //           flexDirection: "column",
  //           justifyContent: "start",
  //           alignItems: "start",
  //         }}
  //       >
  //         <h4>Party 1 Name</h4>
  //         <Autocomplete
  //           className={classes.maxWidth}
  //           options={["John Doe", "Mickel Jackson", "Phil Heath"]}
  //           // onChange={(e, user) => { setNewContact({ ...newContact, contactOwner: user.value }); }}
  //           // value={users.find((user) => user?.value === newContact.contactOwner) || null}
  //           // getOptionLabel={(option) => option.text}
  //           // getOptionSelected={(option) => option.value === newContact.contactOwner}
  //           renderInput={(params) => (
  //             <TextField
  //               size="small"
  //               {...params}
  //               className={classes.maxWidth}
  //               multiline
  //             />
  //           )}
  //         />
  //       </ListItem>
  //       <ListItem
  //         style={{
  //           flexDirection: "column",
  //           justifyContent: "start",
  //           alignItems: "start",
  //         }}
  //       >
  //         <h4>Party 2 Name</h4>
  //         <Autocomplete
  //           className={classes.maxWidth}
  //           options={["John Doe", "Mickel Jackson", "Phil Heath"]}
  //           // onChange={(e, user) => { setNewContact({ ...newContact, contactOwner: user.value }); }}
  //           // value={users.find((user) => user?.value === newContact.contactOwner) || null}
  //           // getOptionLabel={(option) => option.text}
  //           // getOptionSelected={(option) => option.value === newContact.contactOwner}
  //           renderInput={(params) => (
  //             <TextField
  //               size="small"
  //               {...params}
  //               className={classes.maxWidth}
  //               multiline
  //             />
  //           )}
  //         />
  //       </ListItem>
  //       <ListItem>
  //         <h4>Click or drag and drop file to upload</h4>
  //       </ListItem>

  //       <div style={{ display: "flex", justifyContent: "start" }}>
  //         {console.log(recentFiles, "Files data in Adddialog")}
  //         {recentFiles?.map((value, key) => {
  //           let fileExtension = value?.name
  //             ?.slice(value.name.lastIndexOf(".") + 1)
  //             ?.toLowerCase();
  //           if (key <= 1) {
  //             return (
  //               <div key={key}>
  //                 <LightTooltip
  //                   title={
  //                     <div className={classes.IconSection}>
  //                       <IconButton
  //                         size="small"
  //                         onClick={() => {
  //                           setOpenDeleteConfirmDialog(true);
  //                           setFileIdToDelete(value.id);
  //                         }}
  //                       >
  //                         <DeleteIcon />
  //                       </IconButton>

  //                       <IconButton
  //                         disabled={false}
  //                         size="small"
  //                         // onClick={() =>
  //                         //   handleViewFile(
  //                         //     files?.getFileDescriptors[key].fileId
  //                         //   )
  //                         // }
  //                       >
  //                         <GetAppIcon />
  //                       </IconButton>
  //                     </div>
  //                   }
  //                   interactive
  //                 >
  //                   <div>
  //                     {new RegExp(["jpg", "jpeg", "png", "bmp"].join("|")).test(
  //                       fileExtension
  //                     ) ? (
  //                       <img
  //                         src={value.uri}
  //                         alt={value.name}
  //                         className={classes.forImage}
  //                       ></img>
  //                     ) : (
  //                       <div className={classes.forImageContainer}>
  //                         {/* {fileExtension} */}
  //                         {getFileIcon(fileExtension)}
  //                       </div>
  //                     )}
  //                     <div className={classes.imageSubText}>
  //                       {value?.name?.length > 12
  //                         ? value.name.slice(0, 8) + "..."
  //                         : value.name}
  //                     </div>
  //                   </div>
  //                 </LightTooltip>
  //               </div>
  //             );
  //           }
  //         })}
  //         <div style={{ width: "150px", marginLeft: "20px" }}>
  //           <UploadZone style={{ width: "150px", height: "150px" }} />
  //         </div>
  //       </div>
  //     </List>

  //     <div className={classes.dialogFooter}>
  //       <Button
  //         variant="contained"
  //         color="default"
  //         size="medium"
  //         disableElevation
  //         // disabled={updateDealLoading || addContactLoading}
  //         className={classes.footerButton}
  //         style={{
  //           margin: "0px 15px 0px 0px",
  //         }}
  //         onClick={() => {
  //           setStateApp({
  //             ...stateApp,
  //             DocumentDrawer: false,
  //             selectedDocument: {},
  //           });
  //         }}
  //       >
  //         Cancel
  //       </Button>

  //       <Button
  //         variant="contained"
  //         color="secondary"
  //         size="medium"
  //         disableElevation
  //         // onClick={handleUpdate}
  //         className={classes.footerButton}
  //       >
  //         Save
  //       </Button>
  //     </div>

  //     <Divider />
  //   </div>
  // );
  // let obj = new Object();
  return (
    <div>
      <Drawer
        anchor={"right"}
        open={
          stateApp.DocumentDrawer ||
          Object.entries(stateApp.selectedDocument).length > 0
        }
        // onClose={()=>{
        //   setStateApp({...stateApp, DocumentDrawer:false})
        // }}
      >
        {console.log(stateApp.selectedDocument, "selecdow")}
        <DeleteDocumentConfirmation
          document={stateApp.selectedDocument}
          open={openDeleteConfirmDialog}
          handleClose={handleDeleteCancel}
          handleAccept={() => {
            handleDeleteAccept();
          }}
        />
        <Dialog open={loader} style={{ zIndex: 99999999999 }}>
          <DialogTitle id="alert-dialog-title">
            <CircularProgress />
          </DialogTitle>
        </Dialog>
        {/* {list("right")} */}
        {/* {stateApp.selectedDocument?.fileId ? ( */}
        <>{DocumentDetail("right")}</>
        {/* ) : ( */}
        {/* <>{list("right")}</> */}
        {/* )} */}
      </Drawer>
    </div>
  );
}

const DocumentType = ({ setDocumentType, value, documentTypes, ...other }) => {
  console.log("value", value);
  const useStyles = makeStyles({
    inputRoot: {
          backgroundColor: "#ffffff",
        },
    listbox: {
      boxSizing: "border-box",
      "& ul": {
        padding: 0,
        margin: 0,
      },
    },
  });

  const classes = useStyles();

  const onInputChange = (event , value) => {
    setDocumentType(value)
  };
  return (
    <Autocomplete
      defaultValue={value}
      value={value}
      disableListWrap
      classes={classes}
      options={documentTypes?.getFilesType?.map((type) => {
        return { _id: type, name: type };
      })}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.name;
        }

        if (option?.name) return option.name;
        else return "";
      }}
      getOptionSelected={(option, value) => {
        return option?._id === value?._id;
      }}
      renderOption={(option) => {
        if (option._id === "newEntity")
          return (
            <Typography style={{ color: "midnightblue" }}>
              Add '{option.name}'
            </Typography>
          );

        return (
          <Grid container spacing={0}>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs>
                <span style={{ fontWeight: 400 }}>{option.name}</span>

                <Typography variant="body2" color="textSecondary">
                  {joinAddress(option)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
      onInputChange={onInputChange}
      filterOptions={(options, params) => {
        const filtered = filter(options, { ...params, inputValue: value });

        const isExist = loadashFilter(filtered, (filter) => {
          return filter._id.includes(value)
        })
        // Suggest the creation of a new value
        if (value !== "" && (!isExist || isExist.length === 0)) {
          filtered.unshift({
            name: value,
            _id: "newEntity",
          });
        }
        return filtered;
      }}
      onChange={(event, newValue) => {
        if (newValue && newValue._id) {
          if (newValue._id !== "newEntity")
          setDocumentType(newValue);
          else
          setDocumentType({ _id: "newEntity", name: newValue.name });
        } else
        setDocumentType("");
      }}
      renderInput={(params) => (
        <TextField
          margin="dense"
          {...params}
          InputProps={{
            ...params.InputProps
          }}
          size="small"
        />
      )}
      {...other}
    />
  );
};

const ContactPaginatedDropdown = ({ nameAutValue, setNameAutValue }) => {
  const classes = useStyles();
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [nameAutInputValue, NameAutInputValue] = useState("");
  const setNameAutInputValue = (newState) => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };

  const [
    getPaginatedContacts,
    {
      data: allContacts,
      loading: contactsLoading,
      fetchMore: fetchMorePaginatedContacts,
    },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray([
        ...allContacts?.paginatedContacts?.edges?.map((el) => el.node),
      ]);
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
    }
    setIsNextPageLoading(false);
  }, [allContacts]);

  useEffect(() => {
    //will also run during initial mount
    setIsNextPageLoading(true);
    getPaginatedContacts({
      variables: {
        search: nameAutInputValue,
      },
    });
  }, [nameAutInputValue]);

  const loadNextPage = async (pageVariables) => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(pageVariables);
    return null;
  };

  return (
    <AutocompEntityNamesVirtualizeList
      className={classes.maxWidth}
      mongoEntitiesArray={mongoEntitiesArray}
      setMongoEntitiesArray={setMongoEntitiesArray}
      nameAutValue={nameAutValue}
      setNameAutValue={setNameAutValue}
      nameAutInputValue={nameAutInputValue}
      setNameAutInputValue={setNameAutInputValue}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={loadNextPage}
      addNew={true}
    />
  );
};
