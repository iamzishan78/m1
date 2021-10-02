import React, { useContext, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import shp from "shpjs";
import { useMutation } from "@apollo/client";
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
import { ADDFILE } from "../../../graphQL/useMutationAddFile";
import { ADDLAYER } from "../../../graphQL/useMutationAddLayer";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useDispatch } from "react-redux";
import { showErrorMessage } from "../../../actions";
import { getDefaultSettings } from './addUserHelper'
import Loader from "components/Loaders";
import { BlockBlobClient } from "@azure/storage-blob";

const Alert = (props) => {
  return <MuiAlert elevation={5} variant="filled" {...props} />;
};

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

export default function AddUserData(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [isOpen, setIsOpen] = useState(true);
  const [inputFiles, setInputFiles] = useState(
    stateMapControls.fileUploadedContent
  );
  const [layerName, setLayerName] = useState("");
  const [error, setErrorr] = useState(false);
  const [notReturn, setNotReturn] = useState(false);
  const [uploadFailed, setUploadFailed] = useState("");
  const [url, setUrl] = useState("");

  const [stateApp, setStateApp] = useContext(AppContext);


  const [addFile, { data: fileData }] = useMutation(ADDFILE);

  const [addLayer, { data: newLayer }] = useMutation(ADDLAYER);

  useEffect(() => {
    if (stateMapControls.fileUploadedContent) {
      setInputFiles(stateMapControls.fileUploadedContent);
      setLayerName(stateMapControls.fileUploadedContent.groupName)

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

  useEffect(() => {
    if (fileData && fileData.addFile) {
      if (fileData.addFile.success) {
        // Upload file to MS Blob Stroage
        let fileContent = inputFiles;

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
            .then((response) => {
              let type = fileContent.featureTypes[0]
              const sourceProps = layerName + uuid() + "_source"
              const defaultSettings = getDefaultSettings(type, layerName, sourceProps)
              addLayer({
                variables: {
                  layer: {
                    layerName,
                    identifier: layerName + uuid(),
                    layerGeometry: type,
                    layerType: "file layer",
                    layerCategory: "UD layer",
                    public: true,
                    createBy: stateApp.user.mongoId,
                    file: file_id,
                    defaultSettings,
                  },
                },
                refetchQueries: ["getAllLayerSettingsByUser"],
                awaitRefetchQueries: true,
              });

              Loader.createToast('layer-creation', 'Layer creation in progress')
              const interval = setInterval(() => {
                if (stateApp.map.isSourceLoaded(sourceProps)) {
                  Loader.successToast('layer-creation', 'Layer created')
                  clearInterval(interval);
                }
              }, 1000);
              handleClose();
            })
            .catch((error) => {
              console.log(error);
              setStateApp((stateApp) => ({
                ...stateApp,
                universalCircularLoaderAct: false,
              }));
              dispatch(showErrorMessage("Geojson is invalid"));
              handleClose();

              //// remove mongo file
            });
        }
      } else if (fileData.addFile.message) {
        setStateApp((stateApp) => ({
          ...stateApp,
          universalCircularLoaderAct: false,
        }));
        setUploadFailed(fileData.addFile.message);
      }
    } else {
      setStateApp((stateApp) => ({
        ...stateApp,
        universalCircularLoaderAct: false,
      }));
      if (fileData) {
        setUploadFailed("Failed Upload File, Please Try Again");
      }
    }
  }, [fileData]);

  useEffect(() => {
    if (newLayer) {
      setNotReturn(true);
      //// dont remove the universal loader or close till stateApp.layers[layerIndex].fileContent
    }
  }, [newLayer]);

  useEffect(() => {
    if (stateApp.layers) {
      const layerIndex = stateApp.layers.findIndex(
        (layer) => layer.layerName == layerName
      );
      if (
        layerIndex !== -1 &&
        layerName &&
        layerName !== "" &&
        stateApp.layers[layerIndex] &&
        stateApp.layers[layerIndex].fileContent
      ) {
        setStateApp((stateApp) => ({
          ...stateApp,
          universalCircularLoaderAct: false,
        }));
        setStateMapControls((stateMapControls) => ({
          ...stateMapControls,
          addLayer: false,
        }));
        handleClose();
      }
    }
  }, [stateApp.layers]);

  const handleApplyChanges = async () => {
    if (!layerName) {
      setErrorr(true);
    } else {
      setStateApp((stateApp) => ({
        ...stateApp,
        universalCircularLoaderAct: true,
      }));
      const fileName =
        layerName.trim().toLowerCase().replace(" ", "_") + ".geojson";

      const userId = stateApp.user.mongoId;

      addFile({
        variables: {
          fileName,
          userId,
        },
      });
    }
  };

  const handleLayerNameChanges = (e) => {
    if (e.target.value) {
      setErrorr(false);
      setLayerName(e.target.value);
    }
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
      <DialogTitle>Create a new Layer</DialogTitle>
      <DialogContent dividers>
        <TextField
          defaultValue={stateMapControls.fileUploadedContent.groupName}
          focused
          required
          margin="dense"
          id="layerName"
          label="Layer Name"
          fullWidth
          error={error}
          onChange={handleLayerNameChanges}
          onKeyPress={(event) => {
            if (event.key === "Enter" && layerName !== "" && inputFiles) {
              event.preventDefault();
              handleApplyChanges();
            }
          }}
        />

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
                    disabled={!url || url === "" ? true : false}
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
          disabled={layerName === "" || !inputFiles}
          autoFocus
          onClick={handleApplyChanges}
          color="primary"
        >
          Create Layer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
