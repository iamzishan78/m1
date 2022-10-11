import React, { useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { AppContext } from "AppContext";
import { Typography, Grid } from "@material-ui/core";
import loadashFilter from "lodash/filter";
import get from "lodash/get";

import { IconButton, TextField, withStyles } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { Clear } from "@material-ui/icons";
import UploadZone from "../../Shared/UploadZone";
import Tooltip from "@material-ui/core/Tooltip";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import joinAddress from "components/Shared/valueformatters/join-address.js";
import { VIEWFILEQUERY } from "graphQL/useQueryViewFile";
import { useLazyQuery } from "@apollo/client";
import { DOCUMENT_TYPE } from "graphQL/useQueryDocumentType";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";



// functions
import get_file_icon from "components/Shared/functions/get_file_icon.js";
import moment from "moment";
import ReactSelectField from "components/Shared/M1nTable/components/SubComponents/ReactSelectField";

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
  dateRoot: {
    color: "grey",
    "& input": {
      marginLeft: "20px",
    },
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
    "& .MuiDropzoneArea-root": {
      minHeight: '90px'
    }
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
  listItem: {
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",

    "& h4": {
      marginBottom: 0
    }
  }
});

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

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

export default function DocumentDetails(props) {
  const classes = useStyles();
  const {
    newDocument,
    setNewDocument,
    fileData,
    setFileData,
    setLoader,
    nameAutValueParty1,
    setNameAutValueParty1,
    nameAutValueParty2,
    setNameAutValueParty2,
    updateDocument,
    setOpenDeleteConfirmDialog,
    setFileIdToDelete,
    handleClose,
    setReplaceFile,
    replaceFile,
    viewFiles,
    viewFileSResult,
  } = props;
  const [metaData, setMetaData] = useState([]);
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [recentFiles, setRecentFiles] = useState([]);
  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

  const [viewFile, { data: viewFileResult, loading: viewFileLoading }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "no-cache",
  });

  const [getDocumentTypes, { data: documentTypes }] = useLazyQuery(DOCUMENT_TYPE, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getDocumentTypes();
  }, [getDocumentTypes]);

  useEffect(() => {
    getMetaData({
      variables: {
        user: stateApp.user?.mongoId,
        category: "Docs",
      },
    });
  }, [getMetaData]);

  useEffect(() => {
    if (metaDataRes?.getMetaData?.metaData) {
      sortFields(metaDataRes.getMetaData.metaData);
    }
  }, [metaDataRes]);

  useEffect(() => {
    if (fileData) {
      let ID = [];
      ID.push(fileData?.addFileDescriptor?.file?.id);
      viewFiles({
        variables: { fileIds: ID },
      });
    }
  }, [fileData]);


  const sortFields = (gridViews) => {
    const metaData = [];
    if (stateApp.selectedView?.columns?.length > 0) {
      for (let i = 0; i < stateApp.selectedView.columns?.length; i++) {
        const data = gridViews.find((view) => view.name === stateApp.selectedView.columns[i].name);
        if (data) {
          metaData.push(data);
        }
      }
      setMetaData(metaData);
    } else {
      setMetaData(gridViews);
    }
  };

  const UpDatefileFN = () => {
    let documentType = "";
    if (typeof newDocument.documentType === "string") {
      documentType = newDocument.documentType;
    } else if (newDocument.documentType?.name) {
      documentType = newDocument.documentType.name;
    }
    const fileId = fileData?.addFileDescriptor?.file?.id;
    if (stateApp.selectedDocument.fileId || fileId) {
      setLoader(true);
      const document = {
        book: newDocument.book,
        page: newDocument.page,
        instrument: newDocument.instrument,
        recordingInfo: newDocument.recordingInfo,
        documentName: newDocument.documentName,
        dateTime: newDocument.dateTime,
        documentNumber: newDocument.documentNumber,
        documentType: documentType,
        partyName1: nameAutValueParty1._id,
        partyName2: nameAutValueParty2._id,
        fileId: fileId || newDocument.fileId,
        custom_data: newDocument.custom_data,
      }
      updateDocument({
        variables: {
          document,
        },
        refetchQueries: ["getParcelFiles", "getParcelFilesCount"],
        awaitRefetchQueries: true,
      }).then(() => {
        if (props?.refetchData)
          props.refetchData({ ...document })
        setFileData(null);
        setStateApp({
          ...stateApp,
          DocumentDrawer: false,
          selectedDocument: {},
        });
        setNameAutValueParty1({ name: "", _id: null });
        setNameAutValueParty2({ name: "", _id: null });
        setNewDocument(documentInitial);
        setLoader(false);
      });
    }
  };

  const handleViewFile = async (id, isPdf = false) => {
    let selectedDocument = stateApp.selectedDocument

    viewFile({ variables: { fileId: selectedDocument._id } }).then((response) => {
      const viewFileData = get(response, "data.viewFile", {})

      if (isPdf) {
        setStateApp((state) => ({
          ...state,
          viewDoc: {
            uri: viewFileData.uri,
            name: viewFileData.name,
          },
        }));
      }
      else {
        let a = document.createElement("a");
        a.href = viewFileData.uri;
        a.download = viewFileData.name;

        // if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
        // a.target = "_blank";

        // file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
        a.click();
      }

    })
  };

  const onFileUpload = (file) => {
    if (replaceFile === 'IN_PROGRESS') {
      setReplaceFile('DONE')
    }
    else {
      setStateApp((stateApp) => ({
        ...stateApp,
        selectedDocument: { _id: file.id, ...file },
      }));
    }
  };

  return (
    <div>
      <div
        id="documentdetails"
        style={{
          flexGrow: 1,
          overflow: "auto",
          minHeight: "2em",
          maxHeight: "calc(100vh - 310px)",
        }}
      >
        <List>
          <ListItem
            className={classes.listItem}
          >
            <h4>File Number</h4>
            <TextField
              id="filenumber"
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
            className={classes.listItem}
          >
            <h4>File Name</h4>
            <TextField
              id="filename"
              className={classes.maxWidth}
              multiline
              value={newDocument?.documentName}
              onChange={(e) => {
                setNewDocument({
                  ...newDocument,
                  documentName: e.target.value,
                });
              }}
            />
          </ListItem>
          <ListItem
            className={classes.listItem}
          >
            <h4>File Type</h4>
            <DocumentType
              className={classes.maxWidth}
              documentTypes={documentTypes}
              setDocumentType={(value) => {
                setNewDocument({
                  ...newDocument,
                  documentType: value,
                });
              }}
              value={newDocument.documentType ? newDocument.documentType : ""}
            />
          </ListItem>
          <ListItem
            className={classes.listItem}
          >
            <h4>File Date</h4>
            <TextField
              // autoOk
              type="date"
              id="filedate"
              //variant="outlined"
              defaultValue={newDocument?.dateTime ? moment(newDocument?.dateTime).format("yyyy-MM-DD") : ""}
              margin="none"
              fullWidth
              onChange={(event) => {
                const splittedDate = event?.target?.value.split("-")
                if (splittedDate.length === 3) {
                  const newDate = new Date()
                  newDate.setYear(Number(splittedDate[0]))
                  newDate.setMonth(Number(splittedDate[1]) - 1)
                  newDate.setDate(Number(splittedDate[2]))
                  setNewDocument({ ...newDocument, dateTime: newDate })
                } else {
                  setNewDocument({ ...newDocument, dateTime: null })
                }
              }}

              InputLabelProps={{
                shrink: true,
              }}
              disableToolbar
              KeyboardButtonProps={{ "aria-label": "change date" }}
              format="MM/DD/YYYY"
              PopoverProps={{ disablePortal: false }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={(event) => setNewDocument({ ...newDocument, dateTime: null })}>
                    <Clear style={{ height: 22, width: 22 }} />
                  </IconButton>
                ),
                classes: {
                  root: classes.dateRoot,
                },
              }}
            />

          </ListItem>

          {/* TEMPORARY COMMENT OUT UNTIL FEATURE IS FIXED */}
          {/* <ListItem
                  style={{
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                >
                  <h4>Party 1 Name</h4>
                  <ContactPaginatedDropdown nameAutValue={nameAutValueParty1} setNameAutValue={setNameAutValueParty1} />
                </ListItem>
                <ListItem
                  style={{
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                >
                  <h4>Party 2 Name</h4>
                  <ContactPaginatedDropdown nameAutValue={nameAutValueParty2} setNameAutValue={setNameAutValueParty2} />
                </ListItem> */}

          {/* Hiding Recording info */}

          {/* <ListItem
            style={{
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <h4>Recording Info</h4>
            <TextField
              className={classes.maxWidth}
              multiline
              value={newDocument?.recordingInfo}
              onChange={(e) => {
                setNewDocument({
                  ...newDocument,
                  recordingInfo: e.target.value,
                });
              }}
            />
          </ListItem> */}

          <ListItem
            className={classes.listItem}
            style={{ flexDirection: 'row' }}
          >
            <div style={{
              marginRight: "15px",
            }}>
              <h4>Book</h4>
              <TextField
                id="book"
                className={classes.maxWidth}
                multiline
                value={newDocument?.book}
                onChange={(e) => {
                  setNewDocument({
                    ...newDocument,
                    book: e.target.value,
                  });
                }}
              />
            </div>

            <div style={{
              marginRight: "15px",
            }}>
              <h4>Page</h4>
              <TextField
                id="page"
                className={classes.maxWidth}
                multiline
                value={newDocument?.page}
                onChange={(e) => {
                  setNewDocument({
                    ...newDocument,
                    page: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <h4>Instrument #</h4>
              <TextField
                id="instrument"
                className={classes.maxWidth}
                multiline
                value={newDocument?.instrument}
                onChange={(e) => {
                  setNewDocument({
                    ...newDocument,
                    instrument: e.target.value,
                  });
                }}
              />
            </div>
          </ListItem>

          {metaData.map((meta, index) => {
            const value = newDocument.custom_data[meta.name];
            let isInView = false;
            if (stateApp.selectedView && stateApp.selectedView?.columns?.length > 0) {
              if (stateApp.selectedView.columns.find((col) => col.name === meta.name)?.display) {
                isInView = true;
              }
            }
            if (isInView || value) {
              return (
                <Fragment key={meta.name}>
                  {meta.type === "text" && (
                    <ListItem
                      className={classes.listItem}
                    >
                      <h4>{meta.label}</h4>
                      <TextField
                        className={classes.maxWidth}
                        value={value}
                        onChange={(e) => {
                          const custom_data = JSON.parse(JSON.stringify(newDocument.custom_data));
                          custom_data[meta.name] = e.target.value;
                          setNewDocument({
                            ...newDocument,
                            custom_data,
                          });
                        }}
                      />
                    </ListItem>
                  )}
                  {meta.type === "dropdown" && (
                    <ListItem
                      id={`dropdown-${index}`}
                      className={classes.listItem}
                    >
                      <h4>{meta.label}</h4>
                      <ReactSelectField
                        isSingleSelect={true}
                        fullWidth
                        showUnderline
                        showChevron={true}
                        index={"documentTable"}
                        dropdownOptions={meta.dropdownOptions}
                        column={meta}
                        value={value}
                        onCustomKeyChange={(value) => {
                          const custom_data = JSON.parse(JSON.stringify(newDocument.custom_data));
                          custom_data[meta.name] = value ? value : null; // empty string is falsey so null
                          setNewDocument({
                            ...newDocument,
                            custom_data,
                          });
                        }}
                      />
                    </ListItem>
                  )}
                  {meta.type === "multiselect" && (
                    <ListItem
                      id={`multiselect-${index}`}
                      className={classes.listItem}
                    >
                      <h4>{meta.label}</h4>
                      {/* <CustomFieldMultiSelect
                        fullWidth
                        index={"documentTable"}
                        dropdownOptions={meta.dropdownOptions}
                        column={meta}
                        value={value}
                        onCustomKeyChange={(value) => {
                          const custom_data = JSON.parse(JSON.stringify(newDocument.custom_data));
                          custom_data[meta.name] = value ? value : null; // empty string is falsey so null
                          setNewDocument({
                            ...newDocument,
                            custom_data,
                          });
                        }}
                      /> */}

                      <ReactSelectField
                        fullWidth
                        showUnderline
                        showChevron={true}
                        index={"documentTable"}
                        dropdownOptions={meta.dropdownOptions}
                        column={meta}
                        value={value}
                        onCustomKeyChange={(value) => {
                          const custom_data = JSON.parse(JSON.stringify(newDocument.custom_data));
                          custom_data[meta.name] = value ? value : null; // empty string is falsey so null
                          setNewDocument({
                            ...newDocument,
                            custom_data,
                          });
                        }}
                      />
                    </ListItem>
                  )}
                </Fragment>
              );
            }
          })}
        </List>
      </div>
      <div style={{ flexShrink: 0 }}>
        {(stateApp.selectedDocument?.fileId || fileData) && replaceFile !== 'IN_PROGRESS' ? (
          <ListItem>
            <div style={{ display: "flex", justifyContent: "start" }} id="attachedDocument">
              {viewFileSResult?.viewFiles?.map((value, key) => {
                let fileExtension = value?.name?.slice(value.name.lastIndexOf(".") + 1)?.toLowerCase();
                if (key <= 1) {
                  return (
                    <div key={key}>
                      <LightTooltip
                        title={
                          <div className={classes.IconSection}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setReplaceFile('INITIATE')
                                setOpenDeleteConfirmDialog(true);
                                setFileIdToDelete(stateApp.selectedDocument.fileId);
                                // setStateApp((state) => ({ ...state, selectedDocument: { ...state.selectedDocument, fileId: null } }))
                                // setFileData(null)
                              }}
                            >
                              <DeleteIcon id="documentDeleteIcon" />
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
                          {new RegExp(["jpg", "jpeg", "png", "bmp"].join("|")).test(fileExtension) ? (
                            <img src={value.uri} alt={value.name} className={classes.forImage}></img>
                          ) : (
                            <div
                              className={classes.forImageContainer}
                              onClick={() => {
                                const isPdf = fileExtension === "pdf"

                                if (isPdf && stateApp?.selectedDocument.viewToken) {
                                  setStateApp((state) => ({
                                    ...state,
                                    viewDoc: {
                                      uri: stateApp.selectedDocument.viewToken,
                                      name: stateApp.selectedDocument.name,
                                    },
                                  }));
                                  // setStateApp((state) => ({
                                  //   ...state,
                                  //   pdfView: stateApp.selectedDocument,
                                  // }));
                                } else {
                                  handleViewFile(stateApp.selectedDocument.fileId, isPdf);
                                }
                              }}
                            >
                              {get_file_icon(fileExtension)}
                            </div>
                          )}
                          <div className={classes.imageSubText}>
                            {value?.name?.length > 12 ? value.name.slice(0, 8) + "..." : value.name}
                          </div>
                        </div>
                      </LightTooltip>
                    </div>
                  );
                }
              })}
            </div>
          </ListItem>
        ) : (
          <ListItem>
            <div style={{ display: "flex", justifyContent: "start" }}>
              {recentFiles?.map((value, key) => {
                let fileExtension = value?.name?.slice(value.name.lastIndexOf(".") + 1)?.toLowerCase();
                if (key <= 1) {
                  return (
                    <div key={key}>
                      <LightTooltip
                        title={
                          <div className={classes.IconSection}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setReplaceFile('INITIATE')
                                setOpenDeleteConfirmDialog(true);
                                setFileIdToDelete(value.id);
                                // setStateApp((state) => ({ ...state, selectedDocument: { ...state.selectedDocument, fileId: null } }))
                                // setFileData(null)
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
                          {new RegExp(["jpg", "jpeg", "png", "bmp"].join("|")).test(fileExtension) ? (
                            <img src={value.uri} alt={value.name} className={classes.forImage}></img>
                          ) : (
                            <div
                              className={classes.forImageContainer}
                              onClick={() => {
                                if (fileExtension === "pdf") {
                                  setStateApp({
                                    ...stateApp,
                                    viewDoc: {
                                      uri: value.uri,
                                      name: value.name,
                                    },
                                  });
                                } else {
                                  handleViewFile();
                                }
                              }}
                            >
                              {get_file_icon(fileExtension)}
                            </div>
                          )}
                          <div className={classes.imageSubText}>
                            {value?.name?.length > 12 ? value.name.slice(0, 8) + "..." : value.name}
                          </div>
                        </div>
                      </LightTooltip>
                    </div>
                  );
                }
              })}
            </div>
          </ListItem>
        )}

        {(!stateApp.selectedDocument?.fileId && !fileData) || replaceFile === 'IN_PROGRESS' ? (
          <div className={classes.Uploadcomp}>
            <UploadZone
              style={{
                paddingLeft: "50px",
                height: '90px'
              }}
              userId={stateApp.user.mongoId}
              setFileData={setFileData}
              fileId={stateApp.selectedDocument?._id}
              onFileUpload={onFileUpload}
            />
          </div>
        ) : null}
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
              handleClose();
            }}
          >
            Cancel
          </Button>

          <Button
            id="documentSaveButton"
            variant="contained"
            color="secondary"
            size="medium"
            disableElevation
            onClick={() => {
              if (stateApp.selectedDocument.fileId || fileData) {
                setLoader(true);
                UpDatefileFN();
              }
            }}
            className={classes.footerButton}
          >
            Save
          </Button>
        </div>
      </div>
    </div >
  );
}


const DocumentType = ({ setDocumentType, value, documentTypes, ...other }) => {
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

  const onInputChange = (event, value) => {
    setDocumentType(value);
  };
  return (
    <Autocomplete
      id="filetype"
      defaultValue={value}
      value={value}
      disableListWrap
      classes={classes}
      options={
        documentTypes?.getFilesType?.map((type) => {
          return { _id: type, name: type };
        }) ?? []
      }
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
        if (option._id === "newEntity") return <Typography style={{ color: "midnightblue" }}>Add '{option.name}'</Typography>;

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
        let inputValue = JSON.parse(JSON.stringify(value));
        if (inputValue.name) {
          inputValue = inputValue.name;
        }
        const filtered = filter(options, { ...params, inputValue });
        const isExist = loadashFilter(filtered, (filter) => {
          return filter._id === inputValue;
        });
        // Suggest the creation of a new value
        if (inputValue !== "" && (!isExist || isExist.length === 0)) {
          filtered.unshift({
            name: inputValue,
            _id: "newEntity",
          });
        }
        return filtered;
      }}
      onChange={(event, newValue) => {
        if (newValue && newValue._id) {
          if (newValue._id !== "newEntity") setDocumentType(newValue);
          else setDocumentType({ _id: "newEntity", name: newValue.name });
        } else setDocumentType("");
      }}
      renderInput={(params) => (
        <TextField
          margin="dense"
          {...params}
          InputProps={{
            ...params.InputProps,
          }}
          size="small"
        />
      )}
      {...other}
    />
  );
};
