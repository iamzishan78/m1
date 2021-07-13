import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
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
import UploadZone from "components/Shared/UploadZone";
import Tooltip from "@material-ui/core/Tooltip";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import joinAddress from "components/Shared/valueformatters/join-address.js";
import { VIEWFILEQUERY, VIEWFILESQUERY } from "graphQL/useQueryViewFile";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATEDESCRIPTORFILE } from "graphQL/useMutationCreateDescriptorFile";
import { ADD_PARCEL_AGREEMENT } from "graphQL/useMutationAddParcelAgreement";
import { INSTRUMENT_TYPE } from "graphQL/useQueryInstrumentType";
import { RECORD_TYPE } from "graphQL/useQueryRecordType";

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
  selectedType: {
    borderBottom: "4px solid #01B0F0",
    display: "inline",
    cursor: "pointer",
  },
  unSelectedType: {
    display: "inline",
    color: "#827F7F",
    cursor: "pointer",
  },
  optionNumber: {
    fontSize: "12px",
  },
});

export default function ParcelInstrument(props) {
  const instrumentInitial = {
    grantor: "",
    grantee: "",
    effective_date: null,
    instrument_date: null,
    file_date: null,
    rec_num: "",
    volume: "",
    page: "",
    legal_description: "",
  };
  const classes = useStyles();
  const anchor = "right";
  const [stateApp, setStateApp] = React.useContext(AppContext);

  let [loader, setLoader] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [newInstrument, setNewInstrument] = useState(instrumentInitial);
  const [fileIdToDelete, setFileIdToDelete] = useState(null);
  const [instrumentType, setInstrumentType] = useState({
    name: "",
    _id: null,
  });
  const [recordType, setRecordType] = useState({
    name: "",
    _id: null,
  });
  const [state, setState] = useState({
    right: false,
  });
  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "no-cache",
  });
  const [getInstrumentTypes, { data: instrumentTypes }] = useLazyQuery(
    INSTRUMENT_TYPE,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [getRecordTypes, { data: recordTypes }] = useLazyQuery(RECORD_TYPE, {
    fetchPolicy: "no-cache",
  });
  const [addParcelAgreement] = useMutation(ADD_PARCEL_AGREEMENT);

  const [addFile, { data: addFileData, loading: addFileLoading }] = useMutation(
    CREATEDESCRIPTORFILE,
    {
      refetchQueries: ["getRecentContactFiles"],
      awaitRefetchQueries: true,
    }
  );

  useEffect(() => {
    getInstrumentTypes();
    getRecordTypes();
  }, [getInstrumentTypes, getRecordTypes]);

  useEffect(() => {
    if (viewFileResult?.viewFile?.uri) {
      let a = document.createElement("a");
      a.href = viewFileResult.viewFile.uri;
      a.download = viewFileResult.viewFile.name;
      a.click();
    }
  }, [viewFileResult]);

  useEffect(() => {
    if (fileData) {
      let ID = [];
      ID.push(fileData?.addFileDescriptor?.file?.id);
      viewFiles({
        variables: { fileIds: ID },
      });
    }
  }, [fileData]);

  const handleViewFile = async (id) => {
    viewFile({ variables: { fileId: id } });
  };

  const handleClose = () => {
    props.setShowSlider(false);
    setInstrumentType({ name: "", _id: null });
    setRecordType({ name: "", _id: null });
    setNewInstrument(instrumentInitial);
  };

  const [viewFiles, { data: viewFileSResult }] = useLazyQuery(VIEWFILESQUERY, {
    fetchPolicy: "no-cache",
  });

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleSave = () => {
    let instrument_type = "";
    if (typeof newInstrument.instrument_type === "string") {
      instrument_type = newInstrument.instrument_type;
    } else if (newInstrument.instrument_type?.name) {
      instrument_type = newInstrument.instrument_type.name;
    }

    let record_type = "";
    if (typeof newInstrument.record_type === "string") {
      record_type = newInstrument.record_type;
    } else if (newInstrument.record_type?.name) {
      record_type = newInstrument.record_type.name;
    }
    const fileId = fileData?.addFileDescriptor?.file?.id;
    setLoader(true);
    addParcelAgreement({
      variables: {
        agreement: {
          instrument_type: instrument_type,
          effective_date: newInstrument.effective_date,
          file_date: newInstrument.file_date,
          grantee: newInstrument.grantee,
          grantor: newInstrument.grantor,
          instrument_date: newInstrument.instrument_date,
          legal_description: newInstrument.legal_description,
          page: newInstrument.page,
          rec_num: newInstrument.rec_num,
          record_type: record_type,
          volume: newInstrument.volume,
          fileId: fileId || newInstrument.fileId,
        },
      },
    }).then(() => {
      props.setShowSlider(false);
      setNewInstrument(instrumentInitial);
      setLoader(false);
    })
  }
  return (
    <div>
      <Drawer anchor={"right"} open={true}>
        <Dialog open={loader} style={{ zIndex: 99999999999 }}>
          <DialogTitle id="alert-dialog-title">
            <CircularProgress />
          </DialogTitle>
        </Dialog>

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
                <h3>Add New Instrument</h3>
              </ListItemText>
              <ListItemIcon style={{ cursor: "pointer" }}>
                <IconButton size="small" onClick={() => handleClose()}>
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
              <h4>Instrument Type</h4>
              <AutoCompleteField
                className={classes.maxWidth}
                options={instrumentTypes || []}
                setValue={(value) => {
                  setNewInstrument({
                    ...newInstrument,
                    instrumentType: value,
                  });
                }}
                value={
                  newInstrument.instrumentType ? newInstrument.instrumentType : ""
                }
              />
            </ListItem>
            <ListItem
              style={{
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
              }}
            >
              <h4>Party of the First (Grantor)</h4>
              <TextField
                className={classes.maxWidth}
                multiline
                value={newInstrument?.grantor}
                onChange={(e) => {
                  setNewInstrument({
                    ...newInstrument,
                    grantor: e.target.value,
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
              <h4>Party of the Second (Grantee)</h4>
              <TextField
                className={classes.maxWidth}
                multiline
                value={newInstrument?.grantee}
                onChange={(e) => {
                  setNewInstrument({
                    ...newInstrument,
                    grantee: e.target.value,
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
              <h4>Effective Date</h4>
              <KeyboardDatePicker
                className={classes.maxWidth}
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={
                  newInstrument?.effective_date
                    ? new Date(newInstrument.effective_date)
                    : null
                }
                onChange={(date) => {
                  setNewInstrument({
                    ...newInstrument,
                    effective_date: date ? String(date["_d"]) : "",
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
              <h4>Instrument Date</h4>
              <KeyboardDatePicker
                className={classes.maxWidth}
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={
                  newInstrument?.instrument_date
                    ? new Date(newInstrument.instrument_date)
                    : null
                }
                onChange={(date) => {
                  setNewInstrument({
                    ...newInstrument,
                    instrument_date: date ? String(date["_d"]) : "",
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
              <h4>File Date</h4>
              <KeyboardDatePicker
                className={classes.maxWidth}
                disableToolbar
                variant="inline"
                format="MM/DD/YYYY"
                margin="normal"
                id="date-picker-inline"
                value={
                  newInstrument?.file_date
                    ? new Date(newInstrument.file_date)
                    : null
                }
                onChange={(date) => {
                  setNewInstrument({
                    ...newInstrument,
                    file_date: date ? String(date["_d"]) : "",
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
              <h4>Record Type</h4>
              <AutoCompleteField
                className={classes.maxWidth}
                options={recordTypes || []}
                setValue={(value) => {
                  setNewInstrument({
                    ...newInstrument,
                    record_type: value,
                  });
                }}
                value={
                  newInstrument.record_type ? newInstrument.record_type : ""
                }
              />
            </ListItem>
            <ListItem
              style={{
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <>
                    <h4>Rec #</h4>
                    <TextField
                      className={classes.maxWidth}
                      multiline
                      value={newInstrument?.rec_num}
                      onChange={(e) => {
                        setNewInstrument({
                          ...newInstrument,
                          rec_num: e.target.value,
                        });
                      }}
                    />
                  </>
                </Grid>
                <Grid item xs={4}>
                  <>
                    <h4>Volume</h4>
                    <TextField
                      className={classes.maxWidth}
                      multiline
                      value={newInstrument?.volume}
                      onChange={(e) => {
                        setNewInstrument({
                          ...newInstrument,
                          volume: e.target.value,
                        });
                      }}
                    />
                  </>
                </Grid>
                <Grid item xs={4}>
                  <>
                    <h4>Page</h4>
                    <TextField
                      className={classes.maxWidth}
                      multiline
                      value={newInstrument?.page}
                      onChange={(e) => {
                        setNewInstrument({
                          ...newInstrument,
                          page: e.target.value,
                        });
                      }}
                    />
                  </>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem
              style={{
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
              }}
            >
              <h4>Legal Description</h4>
              <TextField
                className={classes.maxWidth}
                multiline
                value={newInstrument?.legal_description}
                onChange={(e) => {
                  setNewInstrument({
                    ...newInstrument,
                    legal_description: e.target.value,
                  });
                }}
              />
            </ListItem>
          </List>

          {newInstrument?.fileId ||
            (fileData && (
              <ListItem>
                <div style={{ display: "flex", justifyContent: "start" }}>
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
                                    //   setOpenDeleteConfirmDialog(true);
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
                                <div
                                  className={classes.forImageContainer}
                                  onClick={() => {
                                    console.log("STATE", stateApp);
                                    if (fileExtension === "pdf") {
                                      console.log("STATE PDR CLICKED");
                                      // setStateApp({ ...stateApp, viewDoc: { uri: stateApp.selectedDocument.fileUrl, name: stateApp.selectedDocument.fileName } })
                                      setStateApp((state) => ({
                                        ...state,
                                        pdfView: stateApp.selectedDocument,
                                      }));
                                    } else {
                                      handleViewFile(
                                        stateApp.selectedDocument.fileId
                                      );
                                    }
                                  }}
                                >
                                  {get_file_icon(fileExtension)}
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
                </div>
              </ListItem>
            ))}

          {!newInstrument?.fileId && !fileData && (
            <div className={classes.Uploadcomp}>
              <UploadZone
                style={{
                  paddingLeft: "50px",
                }}
                relatedObjectId={props.parcelId}
                relatedObjectType="Parcel"
                userId={stateApp.user.mongoId}
                setFileData={setFileData}
              />
            </div>
          )}

          <div className={classes.dialogFooter}>
            <Button
              variant="contained"
              color="default"
              size="medium"
              disableElevation
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
              variant="contained"
              color="secondary"
              size="medium"
              disableElevation
              // disabled={
              //   (!fileData && !newInstrument.fileId) || !newInstrument.fileId
              // }
              onClick={() => {
                // if (fileData || newInstrument.fileId) {
                  setLoader(true);
                  handleSave();
                // }
              }}
              className={classes.footerButton}
            >
              Save
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

const AutoCompleteField = ({ setValue, value, options, ...other }) => {
    console.log('options',options)
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
    setValue(value);
  };
  return (
    <Autocomplete
      defaultValue={value}
      value={value}
      disableListWrap
      classes={classes}
      options={
        options?.getFilesType
          ? options?.getFilesType?.map((type) => {
              return { _id: type, name: type };
            })
          : []
      }
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
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
        let inputValue = JSON.parse(JSON.stringify(value));
        if (inputValue.name) {
          inputValue = inputValue.name;
        }
        const filtered = filter(options, { ...params, inputValue });
        const isExist = loadashFilter(filtered, (filter) => {
          return filter._id === inputValue;
        });
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
          if (newValue._id !== "newEntity") setValue(newValue);
          else setValue({ _id: "newEntity", name: newValue.name });
        } else setValue("");
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
