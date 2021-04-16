import React, { useMemo, useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useMutation, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import ViewDocuments from "../ViewDocuments/ViewDocuments";
import { useDropzone } from "react-dropzone";
import DeleteDocumentConfirmation from "./DeleteDocumentConfirmation";
import { ADDFILE } from "../../graphQL/useMutationAddFile";
import { AppContext } from "../../AppContext";
import { ADDDESCRIPTORFILE } from "../../graphQL/useMutationAddDescriptorFile";
import { GETRECENTCONTACTFILES } from "../../graphQL/useQueryGetContactFiles";
import { DELETEDESCRIPTORFILE } from "../../graphQL/useMutationDeleteDescriptorFile";
import { VIEWFILEQUERY, VIEWFILESQUERY } from "../../graphQL/useQueryViewFile";
import { useDispatch } from "react-redux";
import UploadZone from "./UploadZone";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "#fff",
  },
  timelineItemRight: {
    "&:before": {
      content: "none",
    },
  },

  viewAll: {
    textDecoration: "underline",
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  timelineText: {
    "& .MuiTypography-body1": { fontSize: "0.85rem" },
    "& .MuiTypography-body2": { fontSize: "0.7rem" },
    "&  p": {
      margin: "0",
    },
  },
  blue: {
    color: theme.palette.secondary.main,
  },
  todayDot: {
    fontSize: "8px",
  },
  dealTitle: {
    cursor: "pointer",
    "&:hover": {
      fontWeight: "bold",
      textDecoration: "underline",
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
  flexIcon: {
    display: "flex",
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
    flexDirection: "column",
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
  fileDropError: {
    color: "red",
  },

  greySquare: {
    cursor: "pointer",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    height: "80px",
    width: "80px",
    backgroundColor: "#cecece",
    marginRight: "10px",

    "& svg": {
      fill: "#999 !important",
    },
  },
  disabledDownload: {
    cursor: "auto !important",
    backgroundColor: "#e9e9e978 !important",
    "& svg": {
      fill: "#d3d3d3ab !important",
    },
  },
}));

export default function Documents(props) {
  const classes = useStyles();
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [fileIdToDelete, setFileIdToDelete] = useState(null);
  const [fileRequestCounter, setFileRequestCounter] = useState(1);
  const [documentSearch, setDocumentSearch] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const [stateApp,setStateApp] = React.useContext(AppContext);
  const userId = stateApp.user.mongoId;

  const [relatedObjectType, limit] = useMemo(() => {
    if (props.isTransactPage) return ["Deal", 99];
    else return ["Contact", 2];
  }, [props.isTransactPage]);

  const [getRecentFiles, { data: files }] = useLazyQuery(
    GETRECENTCONTACTFILES,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: ({ getFileDescriptors }) => {
        let allActive = true;

        console.log("File descriptors: ", getFileDescriptors);
        if (getFileDescriptors)
          for (let i = 0; i < getFileDescriptors.length; i++) {
            if (getFileDescriptors[i].fileState !== "active") {
              allActive = false;
              break;
            }
          }

        if (!allActive) {
          if (fileRequestCounter <= 40) {
            let waitBeforeRequestAgain = setTimeout(() => {
              setFileRequestCounter(fileRequestCounter + 1);
              getRecentFiles({
                variables: {
                  relatedObjectId: props.id,
                  relatedObjectType,
                },
              });
              clearTimeout(waitBeforeRequestAgain);
            }, 1000);
          } else {
            setFileRequestCounter(1);
            // dispatch(
            //   showWarningMessage(
            //     "Please wait a few seconds until the last uploaded file is ready, then reload the app"
            //   )
            // );
          }
        } else setFileRequestCounter(1);
      },
    }
  );
  const [deleteFile] = useMutation(DELETEDESCRIPTORFILE);

  // const [addFile, { data: addFileData, loading: addFileLoading }] = useMutation(
  //   ADDDESCRIPTORFILE,
  //   {
  //     refetchQueries: ["getRecentContactFiles"],
  //     awaitRefetchQueries: true,
  //     //   onCompleted: () => {
  //     //     // setTimeout(() => {
  //     //     //   getRecentFiles({
  //     //     //     variables: {
  //     //     //       contactId: props.id,
  //     //     //     },
  //     //     //   });
  //     //     // }, 3000);
  //     //   },
  //   }
  // );
  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "no-cache",
  });
  
  // const [viewFile, { data: viewFileData }] = useLazyQuery(VIEWFILEQUERY, {
  //   fetchPolicy: "no-cache",
  // });
  useEffect(() => {
    getRecentFiles({
      variables: {
        relatedObjectId: props.id,
        relatedObjectType,
        limit,
      },
    });
  }, [props.id]);

  const [
		viewFiles,
		{ data: viewFileResultt, loading: viewFileLoading },
	] = useLazyQuery(VIEWFILESQUERY, {
		fetchPolicy: "no-cache",
	});
	useEffect(() => {
		let ID = [];
		for (let i = 0; i < files?.getFileDescriptors.length; i++) {
      // console.log(files?.getFileDescriptors[i].fileId, 'Kumail Test')
			ID.push(files?.getFileDescriptors[i].fileId);
		}

		viewFiles({
			variables: { fileIds: ID },
		});
	}, [files]);

  useEffect(() => {
    console.log("VIEW FILE RESULT", viewFileResult?.viewFile);
    if (viewFileResult?.viewFile?.viewFile?.uri) {
      let a = document.createElement("a");
      a.href = viewFileResult?.viewFile.viewFile.uri;
      a.download = viewFileResult?.viewFile.viewFile.name;

      // if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
      // a.target = "_blank";

      // file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
      a.click();
    }
  }, [viewFileResult?.viewFile]);

  const handleDeleteCancel = () => {
    setFileIdToDelete(null);
    setOpenDeleteConfirmDialog(false);
  };

  const handleDeleteAccept = () => {
    // Delete Document Logic goes here
    if (fileIdToDelete) {
      deleteFile({
        variables: {
          id: fileIdToDelete,
        },
        refetchQueries: ["getRecentContactFiles", "getContactFiles"],
        awaitRefetchQueries: true,
      });
      setFileIdToDelete(null);
      setOpenDeleteConfirmDialog(false);
    }
  };

  const handleViewFile = async (id) => {
    viewFile({ variables: { fileId: id } });
  };


  const HandleShowFile = async (id) => {
    console.log(id, "ShowFIle");
    console.log(GETRECENTCONTACTFILES, "Recentdata");
  };

  useEffect(() => {
    let filtered = files?.getFileDescriptors?.filter((doc) =>
      doc.fileName.toLowerCase().includes(documentSearch.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [documentSearch, files?.getFileDescriptors]);

  return (
    <div className={classes.root} variant="outlined">
      <CardActions style={{ padding: "23px 23px 8px 23px" }}>
        {!props.isTransactPage && (
          <Grid item xs={12} style={{ minHeight: "35px" }}>
            <h4 style={{ margin: "0 0 8px 0", float: "left" }}>
              Recent Documents
            </h4>
            <h4 
              className={classes.viewAll}
              
              // onClick={(e) => {
              //   e.preventDefault();
              //   props.viewAll("comments");
              // }}

              onClick={() => {
                props.handleOpenExpandableCard(
                  <ViewDocuments
                    contactId={props.id}
                    user_id={props.user_id}
                    activityLog={props.activityLog}
                    openDeleteConfirmDialog={openDeleteConfirmDialog}
                    handleClose={handleDeleteCancel}
                    handleAccept={handleDeleteAccept}
                    setOpenDeleteConfirmDialog={setOpenDeleteConfirmDialog}
                    setFileIdToDelete={setFileIdToDelete}
                  />,
                  "Documents"
                );
              }}
            >
              View All
            </h4>
          </Grid>
        )}
      </CardActions>
      <CardContent  >
        {props.isTransactPage && (
          <UploadZone
            relatedObjectId={props.id}
            userId={userId}
            relatedObjectType={relatedObjectType} //Contact or Deal
          />
        )}
        {props.isTransactPage && (
          <div style={{ marginBottom: "20px" }} 
          >
            <TextField
              fullWidth
              value={documentSearch}
              onChange={(e) => setDocumentSearch(e.target.value)}
              variant="outlined"
              label={"Search Documents"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              labelWidth={70}
            />
          </div>
        )}
        <div className={classes.fileUploadSection}>
          {/* Show two recent docs */}
          {filteredDocuments?.map((file,key) => {
            console.log(file, "File Data")
            return (
              <div key={file.fileId} 
         
          >
                <div className={classes.fileUploadTopSection}>
                  <div className={classes.flexIcon}>
                    {props.isTransactPage && (
                      <div
                        className={`${classes.greySquare} ${
                          file.fileState !== "active"
                            ? classes.disabledDownload
                            : ""
                        }`}
                        onClick={() => handleViewFile(file.fileId)}
                      >
                        <GetAppIcon fontSize="large" />
                      </div>
                    )}
                    <div style={{cursor:'pointer'}}
                     onClick={() => {
                      // if(fileExtension === 'pdf')
                      // {
                        // console.log(viewFileResult?.viewFile.viewFile.uri, 'StateApp')
                        
                        console.log(viewFileResultt, 'StateApp')
                        console.log(file.fileId, 'StateApp')

                       viewFileResultt?.viewFiles.map((value) => {
                         if(value.id === file.fileId)
                         {
                           console.log("teste")
                        setStateApp({ ...stateApp, viewDoc: {uri:value.uri, name:file.fileName, downloadFn:handleViewFile, downloadData: file.fileId}})

                         }
                       })
                      // }
                      // setStateApp({ ...stateApp, viewDoc: {uri:"fabceo"}})
                      // if (viewFileResult?.viewFile?.viewFile?.uri) {
                        // let a = document.createElement("a");
                        // a.href = viewFileResult?.viewFile.viewFile.uri;
                        // a.download = viewFileResult?.viewFile.viewFile.name;
                  
                        // if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
                        // a.target = "_blank";
                        // setStateApp({ ...stateApp, viewDoc: {uri:viewFileResult?.viewFile.viewFile.uri, name:file.fileName, downloadFn:handleViewFile, downloadData: file.fileId}})
                  
                        // file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
                       
                      // }
          
                    }}>
                      <h4 className={classes.uploadTitle} >
                        {file?.fileName?.length > 22
                          ? file?.fileName?.slice(0, 20) + "..."
                          : file?.fileName}
                      </h4>
                      {/* <h5 className={classes.uploadSubtext}>{file.userName}</h5> */}
                      <h5 className={classes.uploadSubtext}>
                        {moment.utc(file.dateTime).format("MMM DD, YYYY")}
                      </h5>
                    </div>
                  </div>
                  <div className={classes.IconSection}>
                    <IconButton
                      size="small"
                      style={{ marginBottom: "8px" }}
                      onClick={() => {
                        setOpenDeleteConfirmDialog(true);
                        setFileIdToDelete(file.descriptorId);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>

                    {!props.isTransactPage && (
                      <IconButton
                        disabled={file.fileState !== "active"}
                        size="small"
                        onClick={() => handleViewFile(file.fileId)}
                      >
                        <GetAppIcon />
                      </IconButton>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <DeleteDocumentConfirmation
            open={openDeleteConfirmDialog}
            handleClose={handleDeleteCancel}
            handleAccept={() => {
              handleDeleteAccept();
            }}
          />
          {!props.isTransactPage && (
            <UploadZone
              relatedObjectId={props.id}
              userId={userId}
              relatedObjectType={relatedObjectType} //Contact or Deal
            />
          )}
        </div>
      </CardContent>
    </div>
  );
}
