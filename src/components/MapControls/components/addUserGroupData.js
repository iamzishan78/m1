import React, { useContext, useState, useEffect } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import * as turf from "@turf/turf";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import shp from "shpjs";
import { v4 as uuid } from "uuid";
import { ADDFILE } from "../../../graphQL/useMutationAddFile";
import { ADDLAYER } from "../../../graphQL/useMutationAddLayer";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useDispatch } from "react-redux";
import { showErrorMessage } from "../../../actions";
import { getDefaultSettings } from './addUserHelper'
import Loader from "components/Loaders";
import { uploadFileData } from "components/Shared/functions";
import { BlockBlobClient } from "@azure/storage-blob";

const Alert = (props) => {
  return <MuiAlert elevation={5} variant="filled" {...props} />;
};

function makeid(length) {
  var result = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() *
      charactersLength)));
  }
  return result.join('');
}

const useStyles = makeStyles((theme) => ({
  loadButton: {
    marginBottom: "5px",
    padding: 0,
    backgroundColor: "#d9d7d7",
    color: "rgba(1, 17, 51, 1)",
    minWidth: "50px",
    "&:hover": { backgroundColor: "#b3d3dc" },
  },
}));

export default function AddUserGroupData(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [isOpen, setIsOpen] = useState(true);
  const [inputFiles, setInputFiles] = useState(
    stateMapControls.fileUploadedContent
  );
  const [inputOriginalFile, setInputOriginalFile] = useState(stateMapControls.fileUploadedOriginalContent);
  const [layerNames, setLayerNames] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [error, setErrorr] = useState(false);
  const [notReturn, setNotReturn] = useState(false);
  const [uploadFailed, setUploadFailed] = useState("");
  const [url, setUrl] = useState("");

  const [stateApp, setStateApp] = useContext(AppContext);
  const client = useApolloClient();
  const [addFile] = useMutation(ADDFILE);

  const [addLayer] = useMutation(ADDLAYER);

  const groupId = uuid()

  useEffect(() => {
    if (stateMapControls.fileUploadedContent) {

      stateMapControls.fileUploadedContent.fileNames.forEach((fileName) => {
        layerNames.push(fileName)
      })
      setLayerNames([...layerNames])
      setGroupName(stateMapControls.fileUploadedContent.groupName)
      setInputOriginalFile(stateMapControls.fileUploadedOriginalContent)

      setInputFiles(stateMapControls.fileUploadedContent);
    }
  }, [stateMapControls.fileUploadedContent, stateMapControls.fileUploadedOriginalContent]);

  const handleCancel = () => {
    setIsOpen(false);
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      layerAddControl: null,
      fileUploadedContent: null,
      fileUploadedOriginalContent: null,
      // selectedControl: 'layer'
    }));
    setNotReturn(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: false,
    }));
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      layerAddControl: null,
      fileUploadedContent: null,
      fileUploadedOriginalContent: null,
      // selectedControl: 'layer',
      addLayer: false,
    }));
    setNotReturn(false);
  };

  async function handleFileAsync(file) {
    let inputFile = null;
    let fileName = null;
    if (Array.isArray(file)) {
      inputFile = file[0].data;
      fileName = file[0].file.name;
    } else {
      inputFile = file;
      fileName = file.split("?")[0].split("/");
      fileName = fileName[fileName.length - 1];
    }

    if (fileName.endsWith(".geojson")) {
      return await new Promise((resolve, reject) => {
        fetch(inputFile)
          .then((response) => response.json())
          .then((response) => {
            resolve(response);
          })
          .catch((error) => reject(error));
      });
    } else if (fileName.endsWith(".zip")) {
      return await new Promise((resolve, reject) => {
        fetch(inputFile).then((response) => {
          response.arrayBuffer().then((buffer) => {
            shp(buffer).then((geojson) => {
              resolve(geojson);
            });
          });
        });
      });
    }
  }

  const uploadFile = (fileData, fileContent, sourceProps, originalFileId) => {
    const url = fileData.addFile.file.uri;
    const interal_key = fileData.addFile.file.internalKey;
    const file_id = fileData.addFile.file.id;
    const file_name = fileData.addFile.file.name;

    if (file_id) {
      const content = JSON.stringify(fileContent);

      const blockBlobClient = new BlockBlobClient(url);
      blockBlobClient.uploadBrowserData(content, {
        maxSingleShotSize: 4 * 1024 * 1024,
        blobHTTPHeaders: {
          blobContentDisposition: `attachment; filename="${file_name}"`,
          blobContentType: "text/plain; charset=UTF-8"
        },
        metadata: {
          Internalkey: interal_key
        }
      })
        .then((response) => {
          return response._response.bodyAsText
        })
        .then(() => {
          fileContent.featureTypes.forEach((type, index) => {
            const layerName = layerNames[index]
            const defaultSettings = getDefaultSettings(type, layerName, sourceProps)
            addLayer({
              variables: {
                layer: {
                  layerName,
                  groupName,
                  groupId,
                  layerGeometry: type,
                  identifier: layerName + uuid(),
                  layerType: "file layer",
                  layerCategory: "UD layer",
                  public: true,
                  createBy: stateApp.user.mongoId,
                  file: file_id,
                  originalFile: originalFileId,
                  defaultSettings,
                },
              },
              refetchQueries: index === fileContent.featureTypes.length - 1 ? ["getAllLayerSettingsByUser"] : [],
              awaitRefetchQueries: true,
            });

            if (index === fileContent.featureTypes.length - 1) {
              Loader.createToast('group-creation', 'Group layer creation in progress')
              const interval = setInterval(() => {
                if (stateApp.map.isSourceLoaded(sourceProps)) {
                  Loader.successToast('group-creation', 'Group layer created')
                  clearInterval(interval);
                }
              }, 1000);
              handleClose();
            }
          })
        })
        .catch((error) => {
          console.log(error);
          Loader.successToast('errorToast', error)
          setStateApp((stateApp) => ({
            ...stateApp,
            universalCircularLoaderAct: false,
          }));
          dispatch(showErrorMessage("Geojson is invalid"));
          handleClose();

          //// remove mongo file
        });
    }
  }

  const handleApplyChanges = async () => {
    if (!groupName) {
      setErrorr(true);
    } else {
      setStateApp((stateApp) => ({
        ...stateApp,
        universalCircularLoaderAct: true,
      }));

      const userId = stateApp.user.mongoId;
      const fileName = groupName.trim().toLowerCase().replace(" ", "_") + ".geojson";
      let originalFileId = ''
      if (inputOriginalFile) {
        const originalFile = await client.mutate({
          mutation: ADDFILE,
          variables: {
            fileName: inputOriginalFile.fileName,
            userId,
          },
        })
        if (originalFile.data.addFile.file.id) {
          originalFileId = originalFile.data.addFile.file.id
          uploadFileData(originalFile.data.addFile.file, inputOriginalFile)
        }
      }
      const file = await addFile({
        variables: {
          fileName,
          userId,
        },
      });
      if (file?.data?.addFile?.success) {
        uploadFile(file.data, stateMapControls.fileUploadedContent, groupName + uuid() + "_source", originalFileId)
      }
    }
  };

  const handleLayerNameChanges = (value, index) => {

    if (value && layerNames.includes(value)) {
      dispatch(showErrorMessage("Layer with this name already exist"));
    } else {
      layerNames[index] = value
      setLayerNames([...layerNames])
    }

  };

  const handleGroupNameChanges = (e) => {
    setErrorr(false);
    setGroupName(e.target.value);
  };

  const handleURLinput = async () => {
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: true,
    }));

    let fileContent = await handleFileAsync(url);
    setInputFiles(fileContent);
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: false,
    }));
  };

  const handleCloseNotification = () => {
    setUploadFailed("");
  };

  if (notReturn) return null;

  return (
    <Dialog maxWidth='xs' fullWidth open={isOpen} onClose={handleCancel}>
      <DialogTitle>Create a new Group</DialogTitle>
      <DialogContent dividers>

        <TextField
          defaultValue={stateMapControls.fileUploadedContent.groupName}
          focused
          required
          margin="dense"
          id="groupName"
          label="Group Name"
          fullWidth
          error={error}
          onChange={handleGroupNameChanges}
        />

        {
          stateMapControls.fileUploadedContent.featureTypes.map((layer, i) =>
            <TextField
              focused
              required
              margin="dense"
              id="layerName"
              value={layerNames[i]}
              label={`Layer ${i + 1} ( ${layer} )`}
              fullWidth
              error={error}
              onChange={(e) => handleLayerNameChanges(e.target.value, i)}
            />
          )
        }

        {!stateMapControls.fileUploadedContent && (
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            label="Esri Feature Service URL"
            type="url"
            fullWidth
            value={url}
            onChange={(e) => {
              if (e.target.value) setUrl(e.target.value);
              else setUrl("");
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter" && url !== "") {
                event.preventDefault();
                handleURLinput();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    disabled={!url || url == "" ? true : false}
                    variant="contained"
                    size="small"
                    color="secondary"
                    className={classes.loadButton}
                    onClick={handleURLinput}
                  >
                    Load
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        )}
        <Typography gutterBottom></Typography>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={uploadFailed === "" ? false : true}
          autoHideDuration={5000}
          onClose={handleCloseNotification}
        >
          <Alert severity="error" onClose={handleCloseNotification}>
            {uploadFailed}
          </Alert>
        </Snackbar>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!groupName || layerNames.includes("") || !inputFiles}
          autoFocus
          onClick={handleApplyChanges}
          color="primary"
        >
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );
}
