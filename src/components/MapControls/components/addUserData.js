import React, { useContext, useState, useEffect } from "react";
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
import shp from "shpjs";
import { ADDFILE } from "../../../graphQL/useMutationAddFile";
import { ADDLAYER } from "../../../graphQL/useMutationAddLayer";

const random_rgb = () => {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return "rgb(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ")";
};

const Alert = (props) => {
  return <MuiAlert elevation={5} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({}));

export default function AddUserData(props) {
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
  const [uploadFailed, setUploadFailed] = useState("");

  const [stateApp, setStateApp] = useContext(AppContext);

  const [addFile, { data: fileData }] = useMutation(ADDFILE);

  const [addLayer, { data: newLayer }] = useMutation(ADDLAYER);

  useEffect(() => {
    if (stateMapControls.fileUploadedContent) {
      setInputFiles(stateMapControls.fileUploadedContent);
    }
  }, [stateMapControls.fileUploadedContent]);

  const handleClose = () => {
    setIsOpen(false);
    setStateMapControls((stateMapControls) => ({
      ...stateMapControls,
      selectedControl: null,
      fileUploadedContent: null,
    }));
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
      console.log("GEOJSON Feature Service Path");
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
              console.log(geojson);
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
        console.log(fileData.addFile);

        // Upload file to MS Blob Stroage

        let fileContent = inputFiles;

        const url = fileData.addFile.file.uri;
        const interal_key = fileData.addFile.file.internalKey;
        const file_id = fileData.addFile.file.id;

        if (file_id) {
          const content = JSON.stringify(fileContent);

          fetch(url, {
            headers: {
              "Content-Type": "text/plain; charset=UTF-8",
              "X-Ms-Blob-Type": "BlockBlob",
              "X-Ms-Meta-Internalkey": interal_key,
              "X-Ms-Version": "2015-02-21",
            },
            method: "PUT",
            body: content,
          })
            .then((response) => response.text())
            .then((response) => {
              console.log(response);
              const idColor = random_rgb();
              let type = turf.getType(fileContent);
              let paintProps = {};

              if (type == "Point" || type == "MultiPoint") {
                type = "circle";
              } else {
                type = "fill";
              }

              if (type == "circle") {
                paintProps = {
                  "circle-radius": 5,
                  "circle-color": idColor,
                  "circle-stroke-width": 2,
                  "circle-stroke-color": "#fff",
                };
              } else {
                paintProps = {
                  "fill-color": idColor,
                  "fill-opacity": 0.4,
                  "fill-outline-color": idColor,
                };
              }

              let layerPaintProps = [
                {
                  id: layerName,
                  sourceProps:
                    layerName.trim().toLowerCase().replace(" ", "_") +
                    "_source",
                  paintType: type,
                  paintProps: paintProps,
                },
              ];

              const layerSettings = {
                interaction: {
                  interactionAble: false,
                  interactionDetail: {
                    hover: false,
                    click: false,
                  },
                },
                colorable: true,
                showable: true,
                visiable: true,
              };

              addLayer({
                variables: {
                  layer: {
                    layerName,
                    layerType: "file layer",
                    layerCategory: "UD layer",
                    public: true,
                    createBy: stateApp.user.mongoId,
                    file: file_id,
                    defaultSettings: { layerSettings, layerPaintProps },
                  },
                },
                refetchQueries: ["getAllLayerSettingsByUser"],
                awaitRefetchQueries: true,
              });
            })
            .catch((error) => console.log(error));
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
      handleClose();
      setStateMapControls((stateMapControls) => ({
        ...stateMapControls,
        addLayer: false,
      }));
      setStateApp((stateApp) => ({
        ...stateApp,
        universalCircularLoaderAct: false,
      }));
    }
  }, [newLayer]);

  const handleApplyChanges = async () => {
    console.log("Apply Changes");
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

  const handleURLinput = async (e) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: true,
    }));
    let inputURL = e.target.value;
    console.log(inputURL);
    let fileContent = await handleFileAsync(inputURL);
    console.log("FILE CONTENT: ", fileContent);
    setInputFiles(fileContent);
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: false,
    }));
  };

  const handleCloseNotification = () => {
    setUploadFailed("");
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Add Data</DialogTitle>
      <DialogContent dividers>
        <TextField
          required
          margin="dense"
          id="layerName"
          label="Layer Name"
          fullWidth
          error={error}
          onChange={handleLayerNameChanges}
        />

        {!stateMapControls.fileUploadedContent && (
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Esri Feature Service URL"
            type="url"
            fullWidth
            onKeyPress={handleURLinput}
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
        <Button
          disabled={layerName === "" || !inputFiles}
          autoFocus
          onClick={handleApplyChanges}
          color="primary"
        >
          Create Layer
        </Button>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
