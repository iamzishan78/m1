import React, { useEffect, useState, Fragment } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import RightActionsPanel from "./RightActionsPanel";
import WellsPanel from "./WellsPanel";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { AppContext } from "AppContext";
import CloseIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import { Typography, Grid } from "@material-ui/core";
import loadashFilter from "lodash/filter";
import CustomFieldSelect from "components/Shared/M1nTable/components/SubComponents/CustomFieldSelect";

import { CircularProgress, Dialog, DialogTitle, IconButton, TextField, withStyles } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { KeyboardDatePicker } from "@material-ui/pickers";
import UploadZone from "../../Shared/UploadZone";
import Tooltip from "@material-ui/core/Tooltip";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import joinAddress from "components/Shared/valueformatters/join-address.js";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import AutocompEntityNamesVirtualizeList from "components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";
import { VIEWFILEQUERY, VIEWFILESQUERY } from "graphQL/useQueryViewFile";
import { useLazyQuery, useMutation } from "@apollo/client";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import { UPDATE_DOCUMENT } from "graphQL/useMutationUpdateDocument";
import { DOCUMENT_TYPE } from "graphQL/useQueryDocumentType";
import { setStateIfDeepEqual } from "components/Shared/functions";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";

import DetailsPanel from "./Details";
import WellPanel from "./WellsPanel";

// functions
import get_file_icon from "components/Shared/functions/get_file_icon.js";

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
  titleSection: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    padding: "10px 16px",
    "& svg": {
      fill: "#757575 !important",
    },
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
    // width: "200px !important",
    // height: "200px !important",
  },
  forImage: {
    width: "100px !important",
    height: "100px !important",
    backgroundColor: "transparent !important",
    // border: "1px solid #999",
    borderRadius: "10px !important",
  },
  forImageContainer: {
    width: "100px !important",
    height: "100px !important",
    borderRadius: "10px !important",
    backgroundColor: "#eeeeee !important",
    // border: "1px solid #999",
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
  menu: {
    "& .MuiListItem-root": {
      "& .MuiListItemIcon-root": {
        minWidth: "30px",
        "& .MuiSvgIcon-root": {
          fill: "red !important",
        },
      },
    },
  },
  contentRoot: {
    maxHeight: "calc(100vh - 310px)",
  },
});

export default function DocumentDrawer() {
  const classes = useStyles();
  const [activePanel, setPanel] = useState("Home");
  const [fileData, setFileData] = useState(null);
  const [state, setState] = React.useState({
    right: false,
  });
  const [anchorEl, setAnchorEl] = useState();
  const [stateApp, setStateApp] = React.useContext(AppContext);

  const documentInitial = {
    documentName: "",
    recordingInfo: "",
    dateTime: null,
    documentNumber: "",
    documentType: "",
    partyName1: "",
    partyName2: "",
    fileId: "",
    custom_data: {},
  };

  const [newDocument, setNewDocument] = useState(documentInitial);

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

  const [updateDocument] = useMutation(UPDATE_DOCUMENT);

  const handleDeleteCancel = () => {
    setFileIdToDelete(null);
    setOpenDeleteConfirmDialog(false);
    setNewDocument(documentInitial);
  };
  const handleClose = () => {
    setStateApp({
      ...stateApp,
      DocumentDrawer: false,
      selectedDocument: {},
    });
    setFileData(null);
    setNameAutValueParty1({ name: "", _id: null });
    setNameAutValueParty2({ name: "", _id: null });
    setNewDocument(documentInitial);
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
        refetchQueries: ["getESDocuments"],
        awaitRefetchQueries: true,
      }).then(() => {
        setStateApp({
          ...stateApp,
          DocumentDrawer: false,
          selectedDocument: {},
        });
        setFileIdToDelete(null);
        setNewDocument(documentInitial);
        setNameAutValueParty1({ name: "", _id: null });
        setNameAutValueParty2({ name: "", _id: null });
        setOpenDeleteConfirmDialog(false);
        setLoader(false);
      });
    }
  };

  const [viewFiles, { data: viewFileSResult }] = useLazyQuery(VIEWFILESQUERY, {
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
        const { documentName, dateTime, documentNumber, documentType, partyName1, partyName2, fileId, recordingInfo, custom_data } =
          stateApp.selectedDocument;
        setNameAutValueParty1({
          name: partyName1?.entityDetail?.name,
          _id: partyName1?._id,
        });
        setNameAutValueParty2({
          name: partyName2?.entityDetail?.name,
          _id: partyName2?._id,
        });

        setNewDocument({
          recordingInfo,
          documentName,
          dateTime,
          documentNumber,
          documentType,
          partyName1,
          partyName2,
          fileId,
          custom_data: custom_data ? custom_data : {},
        });
      } else {
        setNewDocument(documentInitial);
      }
    }
  }, [stateApp.selectedDocument]);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div className={classes.titleSection}>
            <div>{stateApp.selectedDocument?.fileId ? <h3>Document Detail</h3> : <h3>Add New Document</h3>}</div>
            <div style={{ cursor: "pointer" }}>
              {stateApp.selectedDocument?.fileId && (
                <IconButton
                  size="small"
                  component="span"
                  style={{
                    background: "transparent",
                    paddingLeft: "10px",
                    align: "center",
                  }}
                  onClick={handleMenuClick}
                >
                  <MoreHorizIcon size="medium" />
                </IconButton>
              )}
              <IconButton size="small" onClick={() => handleClose()}>
                <CloseIcon />
              </IconButton>
              <Menu
                id="dealMenu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                className={classes.menu}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <MenuItem
                  onClick={() => {
                    setOpenDeleteConfirmDialog(true);
                    setFileIdToDelete(stateApp.selectedDocument.fileId);
                  }}
                >
                  <ListItemIcon>
                    <DeleteIcon size="medium" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
        <div className={classes.contentRoot}>
          <RightActionsPanel setPanel={setPanel} />
          <div style={{ marginRight: "62px" }}>
            {activePanel === "Home" && (
              <DetailsPanel
                newDocument={newDocument}
                setNewDocument={setNewDocument}
                fileData={fileData}
                setFileData={setFileData}
                setLoader={setLoader}
                nameAutValueParty1={nameAutValueParty1}
                setNameAutValueParty1={setNameAutValueParty1}
                nameAutValueParty2={nameAutValueParty2}
                setNameAutValueParty2={setNameAutValueParty2}
                updateDocument={updateDocument}
                setOpenDeleteConfirmDialog={setOpenDeleteConfirmDialog}
                setFileIdToDelete={setFileIdToDelete}
                handleClose={handleClose}
                viewFiles={viewFiles}
                viewFileSResult={viewFileSResult}
              />
            )}
            {activePanel === "Wells" && <WellPanel />}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Drawer anchor={"right"} open={stateApp.DocumentDrawer === true || Object.entries(stateApp.selectedDocument).length > 0}>
        <Dialog open={openDeleteConfirmDialog} onClose={handleDeleteCancel} style={{ zIndex: 99999999999 }}>
          <DeleteConfirmationDialogContent
            header="Delete Document"
            onClose={handleDeleteCancel}
            deleteFunc={handleDeleteAccept}
            m1nSelectedRowsIds={[document._id]}
            setM1nSelectedRowsIndexes={() => {}}
          >
            Do you want to delete the selected documents?
          </DeleteConfirmationDialogContent>
        </Dialog>
        <Dialog open={loader} style={{ zIndex: 99999999999 }}>
          <DialogTitle id="alert-dialog-title">
            <CircularProgress />
          </DialogTitle>
        </Dialog>

        <>{DocumentDetail("right")}</>
      </Drawer>
    </div>
  );
}
