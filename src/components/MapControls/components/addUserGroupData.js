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
import InputAdornment from "@material-ui/core/InputAdornment";
import { useDispatch } from "react-redux";
import { showErrorMessage } from "../../../actions";

const random_rgb = () => {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return "rgb(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ")";
};

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
  const [layerNames, setLayerNames] = useState([]);
  const [layerName, setLayerName] = useState('');
  const [groupName, setGroupName] = useState("");
  const [error, setErrorr] = useState(false);
  const [notReturn, setNotReturn] = useState(false);
  const [uploadFailed, setUploadFailed] = useState("");
  const [url, setUrl] = useState("");

  const [stateApp, setStateApp] = useContext(AppContext);

  const [addFile, { data: fileData }] = useMutation(ADDFILE);

  const [addLayer, { data: newLayer }] = useMutation(ADDLAYER);

  useEffect(() => {
    if (stateMapControls.fileUploadedContent) {

      stateMapControls.fileUploadedContent.forEach((layer) => {
        layerNames.push(layer.fileName)
      })
      setLayerNames(layerNames)

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

  // useEffect(() => {
  //   if (fileData && fileData.addFile) {
  //     if (fileData.addFile.success) {
  //       debugger;
  //       // Upload file to MS Blob Stroage

  //       let fileContent = inputFiles;

  //       const url = fileData.addFile.file.uri;
  //       const interal_key = fileData.addFile.file.internalKey;
  //       const file_id = fileData.addFile.file.id;

  //       if (file_id) {
  //         const content = JSON.stringify(fileContent);

  //         fetch(url, {
  //           headers: {
  //             "Content-Type": "text/plain; charset=UTF-8",
  //             "X-Ms-Blob-Type": "BlockBlob",
  //             "X-Ms-Meta-Internalkey": interal_key,
  //             "X-Ms-Version": "2015-02-21",
  //           },
  //           method: "PUT",
  //           body: content,
  //         })
  //           .then((response) => response.text())
  //           .then((response) => {
  //             const idColor = random_rgb();
  //             let type = turf.getType(fileContent);
  //             let paintProps = {};

  //             if (type == "Point" || type == "MultiPoint") type = "circle";
  //             else if (
  //               fileContent.features &&
  //               fileContent.features.length > 0
  //             ) {
  //               let count = 0;

  //               if (
  //                 fileContent.features[0] &&
  //                 (turf.getType(fileContent.features[0]) == "Point" ||
  //                   turf.getType(fileContent.features[0]) == "MultiPoint")
  //               ) {
  //                 fileContent.features.map((feature) => {
  //                   if (
  //                     turf.getType(feature) == "Point" ||
  //                     turf.getType(feature) == "MultiPoint"
  //                   )
  //                     count++;
  //                 });

  //                 if (count == fileContent.features.length) type = "circle";
  //               } else if (
  //                 fileContent.features[0] &&
  //                 (turf.getType(fileContent.features[0]) == "LineString" ||
  //                   turf.getType(fileContent.features[0]) == "Feature" ||
  //                   turf.getType(fileContent.features[0]) == "MultiLineString")
  //               ) {
  //                 fileContent.features.map((feature) => {
  //                   if (
  //                     turf.getType(feature) == "LineString" ||
  //                     turf.getType(feature) == "MultiLineString" ||
  //                     turf.getType(feature) == "Feature"
  //                   )
  //                     count++;
  //                 });

  //                 ////  only lines feature
  //                 if (count == fileContent.features.length) type = "line";
  //               } else type = "fill";
  //             } else type = "fill";

  //             if (type == "circle") {
  //               paintProps = {
  //                 "circle-radius": 5,
  //                 "circle-color": idColor,
  //                 "circle-stroke-width": 2,
  //                 "circle-stroke-color": "#fff",
  //               };
  //             } else if (type == "line") {
  //               paintProps = {
  //                 "line-color": idColor,
  //                 "line-opacity": 1,
  //                 "line-width": 1,
  //               };
  //             } else {
  //               paintProps = {
  //                 "fill-color": idColor,
  //                 "fill-opacity": 0.4,
  //                 "fill-outline-color": "#1C1C1C",
  //               };
  //             }

  //             let layerPaintProps = [
  //               {
  //                 id: layerName,
  //                 sourceProps:
  //                   layerName.trim().toLowerCase().replace(" ", "_") +
  //                   "_source",
  //                 paintType: type,
  //                 paintProps: paintProps,
  //               },
  //             ];

  //             const layerSettings = {
  //               interaction: {
  //                 interactionAble: false,
  //                 interactionDetail: {
  //                   hover: false,
  //                   click: false,
  //                 },
  //               },
  //               colorable: true,
  //               showable: true,
  //               visiable: true,
  //             };

  //             addLayer({
  //               variables: {
  //                 layer: {
  //                   layerName,
  //                   identifier: layerName,
  //                   layerType: "file layer",
  //                   layerCategory: "UD layer",
  //                   public: true,
  //                   createBy: stateApp.user.mongoId,
  //                   file: file_id,
  //                   defaultSettings: { layerSettings, layerPaintProps },
  //                 },
  //               },
  //               refetchQueries: ["getAllLayerSettingsByUser"],
  //               awaitRefetchQueries: true,
  //             });
  //           })
  //           .catch((error) => {
  //             console.log(error);
  //             setStateApp((stateApp) => ({
  //               ...stateApp,
  //               universalCircularLoaderAct: false,
  //             }));
  //             dispatch(showErrorMessage("Geojson is invalid"));
  //             handleClose();

  //             //// remove mongo file
  //           });
  //       }
  //     } else if (fileData.addFile.message) {
  //       setStateApp((stateApp) => ({
  //         ...stateApp,
  //         universalCircularLoaderAct: false,
  //       }));
  //       setUploadFailed(fileData.addFile.message);
  //     }
  //   } else {
  //     setStateApp((stateApp) => ({
  //       ...stateApp,
  //       universalCircularLoaderAct: false,
  //     }));
  //     if (fileData) {
  //       setUploadFailed("Failed Upload File, Please Try Again");
  //     }
  //   }
  // }, [fileData]);

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

  const uploadFile = (layerName, fileData, fileContent, isLast) => {

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
          const idColor = random_rgb();
          let type = turf.getType(fileContent);
          let paintProps = {};

          if (type == "Point" || type == "MultiPoint") type = "circle";
          else if (
            fileContent.features &&
            fileContent.features.length > 0
          ) {
            let count = 0;

            if (
              fileContent.features[0] &&
              (turf.getType(fileContent.features[0]) == "Point" ||
                turf.getType(fileContent.features[0]) == "MultiPoint")
            ) {
              fileContent.features.map((feature) => {
                if (
                  turf.getType(feature) == "Point" ||
                  turf.getType(feature) == "MultiPoint"
                )
                  count++;
              });

              if (count == fileContent.features.length) type = "circle";
            } else if (
              fileContent.features[0] &&
              (turf.getType(fileContent.features[0]) == "LineString" ||
                turf.getType(fileContent.features[0]) == "Feature" ||
                turf.getType(fileContent.features[0]) == "MultiLineString")
            ) {
              fileContent.features.map((feature) => {
                if (
                  turf.getType(feature) == "LineString" ||
                  turf.getType(feature) == "MultiLineString" ||
                  turf.getType(feature) == "Feature"
                )
                  count++;
              });

              ////  only lines feature
              if (count == fileContent.features.length) type = "line";
            } else type = "fill";
          } else type = "fill";

          if (type == "circle") {
            paintProps = {
              "circle-radius": 5,
              "circle-color": idColor,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#fff",
            };
          } else if (type == "line") {
            paintProps = {
              "line-color": idColor,
              "line-opacity": 1,
              "line-width": 1,
            };
          } else {
            paintProps = {
              "fill-color": idColor,
              "fill-opacity": 0.4,
              "fill-outline-color": "#1C1C1C",
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
                identifier: layerName,
                layerType: "file layer",
                layerCategory: "UD layer",
                public: true,
                createBy: stateApp.user.mongoId,
                file: file_id,
                defaultSettings: { layerSettings, layerPaintProps },
              },
            },
            refetchQueries: isLast ? ["getAllLayerSettingsByUser"] : [],
            awaitRefetchQueries: true,
          });
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
      stateMapControls.fileUploadedContent.forEach(async (layer, index) => {
        const isLast = stateMapControls.fileUploadedContent.length - 1 === index
        if (index === 0) {
          const fileName = layerNames[index].trim().toLowerCase().replace(" ", "_") + ".geojson";
          debugger;
          const file = await addFile({
            variables: {
              fileName,
              userId,
            },
          });
          if (file?.data?.addFile?.success) {
            uploadFile(layerNames[index], file.data, layer, isLast)
          }
          debugger;
        }



      })

    }
  };

  const handleLayerNameChanges = (value, index) => {
    layerNames[index] = value
    setLayerNames([...layerNames])
  };

  const handleGroupNameChanges = (e) => {
    if (e.target.value) {
      setErrorr(false);
      setGroupName(e.target.value);
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

  console.log(stateMapControls.fileUploadedContent)

  if (notReturn) return null;
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Create a new Group</DialogTitle>
      <DialogContent dividers>

        <TextField
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
          stateMapControls.fileUploadedContent.map((layer, i) =>
            <TextField
              focused
              required
              margin="dense"
              id="layerName"
              value={layerNames[i]}
              label={`Layer ${i + 1} ( ${layer.features[0].geometry.type} )`}
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
        <Button autoFocus onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!groupName || !inputFiles}
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
