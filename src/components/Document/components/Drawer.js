import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import RightActionsPanel from "./RightActionsPanel";
import { AppContext } from "AppContext";
import CloseIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";

import { CircularProgress, Dialog, DialogTitle, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { VIEWFILESQUERY } from "graphQL/useQueryViewFile";
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_DOCUMENT } from "graphQL/useMutationUpdateDocument";

import DetailsPanel from "./Details";
import Information from "./Information";
import AssociatedWells from "./AssociatedWells";
import AssociatedAgreements from "./AssociatedAgreements";
import AssociatedContacts from "./AssociatedContacts";
import { DocumentContext } from "../DocumentContext";

const useStyles = makeStyles({
  drawer: {
    '& .MuiDrawer-paper': {
      overflowY: 'inherit'
    }
  },
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
  forImage: {
    width: "100px !important",
    height: "100px !important",
    backgroundColor: "transparent !important",
    borderRadius: "10px !important",
  },
  forImageContainer: {
    width: "100px !important",
    height: "100px !important",
    borderRadius: "10px !important",
    backgroundColor: "#eeeeee !important",
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
  detailsFileWrapper: {
    display: 'flex !important',
    flexDirection: 'column !important',
    height: '93vh !important',
    marginRight: '60px !important'
  }
});

export default function DocumentDrawer(props) {
  const classes = useStyles();
  const [activePanel, setPanel] = useState("Home");
  const [fileData, setFileData] = useState(null);
  // const [state, setState] = useState({right: false});
  const [anchorEl, setAnchorEl] = useState();

  const [stateApp, setStateApp] = React.useContext(AppContext);
  const { getWellsFromDocument, wells } = React.useContext(DocumentContext);

  // Fetching wells from descriptor
  useEffect(() => {
    if (!props.isRelatedDocuments)
      getWellsFromDocument({
        variables: {
          descriptorObject: stateApp.selectedDocument._id,
        },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.selectedDocument._id]);

  const documentInitial = {
    documentName: "",
    book: "",
    page: "",
    instrument: "",
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
  const [replaceFile, setReplaceFile] = useState(null);

  let [loader, setLoader] = useState(false);

  const [updateDocument] = useMutation(UPDATE_DOCUMENT);

  const handleDeleteCancel = () => {
    setFileIdToDelete(null);
    setOpenDeleteConfirmDialog(false);
    setReplaceFile('CANCEL')
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
    setPanel("Home");
  };

  const handleDeleteAccept = () => {
    // Delete Document Logic goes here
    if (fileIdToDelete) {
      setLoader(true);
      updateDocument({
        variables: {
          document: { fileId: fileIdToDelete, isDeleted: true }
        },
        // refetchQueries: replaceFile === 'INITIATE' ? [] : ["getESDocuments"],
        awaitRefetchQueries: true,
      }).then(() => {

        if (replaceFile === 'INITIATE') {
          setReplaceFile('IN_PROGRESS')
        } else {
          props.refetchData(fileIdToDelete)
        }

        if (replaceFile !== 'INITIATE') {
          setStateApp({
            ...stateApp,
            DocumentDrawer: false,
            selectedDocument: {},
          });
          setNewDocument(documentInitial);
          setNameAutValueParty1({ name: "", _id: null });
          setNameAutValueParty2({ name: "", _id: null });
        }
        setFileIdToDelete(null);
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
        const { documentName, dateTime, documentNumber, documentType, partyName1, partyName2, fileId, book, page, instrument, recordingInfo, custom_data } =
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
          book,
          page,
          instrument,
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
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) { return; }
    // setState({ ...state, [anchor]: open });
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
            <div>{stateApp.selectedDocument?.fileId ? <h2>File Detail</h2> : <h2>Add New Document</h2>}</div>
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
                  <MoreHorizIcon id="fileDetailHorzIcon" size="medium" />
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
                    handleMenuClose();
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
          {!props.isRelatedDocuments && <RightActionsPanel activePanel={activePanel} setPanel={setPanel} wellsCount={wells?.length} />}
          <div className={!props.isRelatedDocuments ? classes.detailsFileWrapper : ""}>
            {activePanel === "Home" && (
              <DetailsPanel
                newDocument={newDocument}
                setNewDocument={setNewDocument}
                refetchData={props.refetchData}
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
                replaceFile={replaceFile}
                setReplaceFile={setReplaceFile}
                viewFileSResult={viewFileSResult}
              />
            )}
            {activePanel === "Wells" && <AssociatedWells />}
            {activePanel === "Info" && <Information fileData={fileData} />}
            {activePanel === "Agreements" && <AssociatedAgreements />}
            {activePanel === "Contacts" && <AssociatedContacts />}
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div>
      <Drawer className={classes.drawer} anchor={"right"} open={stateApp.DocumentDrawer === true || Object.entries(stateApp.selectedDocument).length > 0}>
        <Dialog open={openDeleteConfirmDialog} onClose={handleDeleteCancel} style={{ zIndex: 99999999999 }}>
          <DeleteConfirmationDialogContent
            header="Delete Document"
            onClose={handleDeleteCancel}
            deleteFunc={handleDeleteAccept}
            m1nSelectedRowsIds={[document._id]}
            setM1nSelectedRowsIndexes={() => { }}
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

Drawer.defaultProps = {
  isRelatedDocuments: false,
};
