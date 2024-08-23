import React, { useContext, useState, useEffect } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import shp from "shpjs";
import { v4 as uuid } from "uuid";
import { ADDFILE } from "../../../graphQL/useMutationAddFile";
import { ADDLAYER } from "../../../graphQL/useMutationAddLayer";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useDispatch } from "react-redux";
import { showErrorMessage } from "../../../actions";
import { getDefaultSettings, SimpleOrShapeFileImport } from './addUserHelper'
import Loader from "components/Loaders";
import { getFileExtension, uploadFileData } from "components/Shared/functions";
import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
import { ADD_DATASET } from "graphQL/useMutationDataset";
import { ADD_LAYER_GROUP } from "graphQL/useMutationLayerGroup";
import { chunkArray } from 'array-chunk-by-size';
import { mapControlsController } from "hookstate/mapControlsController";

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
  const { fileUploadedContent, fileUploadedOriginalContent, mapControlsStateValues } = mapControlsController.useState(['fileUploadedContent', 'fileUploadedOriginalContent'], 'mapControlsStateValues');
  const [isOpen, setIsOpen] = useState(true);
  const [inputFiles, setInputFiles] = useState(
    mapControlsStateValues.fileUploadedContent
  );
  const [inputOriginalFile, setInputOriginalFile] = useState(mapControlsStateValues.fileUploadedOriginalContent);
  const [layerNames, setLayerNames] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isCreateLayers, setIsCreateLayers] = useState(true);
  const [error, setErrorr] = useState(false);
  const [notReturn, setNotReturn] = useState(false);
  const [uploadFailed, setUploadFailed] = useState("");
  const [url, setUrl] = useState("");

  const [stateApp, setStateApp] = useContext(AppContext);
  const client = useApolloClient();
  const [addDataset] = useMutation(ADD_DATASET, { refetchQueries: ["getDatasets"], awaitRefetchQueries: true });
  const [addLayerGroup] = useMutation(ADD_LAYER_GROUP, {
    refetchQueries: ["getLayerGroups"],
    awaitRefetchQueries: true,
  });

  const groupId = uuid()

  useEffect(() => {
    if (mapControlsStateValues.fileUploadedContent) {

      mapControlsStateValues.fileUploadedContent.fileNames.forEach((fileName) => {
        layerNames.push(fileName)
      })
      setLayerNames([...layerNames])
      setGroupName(mapControlsStateValues.fileUploadedContent.groupName)
      setInputOriginalFile(mapControlsStateValues.fileUploadedOriginalContent)

      setInputFiles(mapControlsStateValues.fileUploadedContent);
    }
  }, [fileUploadedContent, fileUploadedOriginalContent]);

  const handleCancel = () => {
    setIsOpen(false);
    mapControlsController.updateState({
      layerAddControl: null,
      fileUploadedContent: null,
      fileUploadedOriginalContent: null,
    })
    setNotReturn(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStateApp((stateApp) => ({
      ...stateApp,
      universalCircularLoaderAct: false,
    }));
    mapControlsController.updateState({
      layerAddControl: null,
      fileUploadedContent: null,
      fileUploadedOriginalContent: null,
      // selectedControl: 'layer',
      addLayer: false,
      manageSourceLayer: false,
      manageLayer: false,
    })
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

  const addLayer = async (fileData, fileContent, sourceProps, originalFileId) => {
    try {
      const file_id = fileData.addFile.file.id;

      if (file_id) {
        if (isCreateLayers) {
          if (fileContent.featureTypes.length > 1) {
            const layerGroup = { name: groupName, groupId: groupId, createBy: stateApp.user.mongoId }
            addLayerGroup({ variables: { userId: stateApp.user.mongoId, layerGroup } })
          }
          for (let index = 0; index < fileContent.featureTypes.length; index++) {
            const type = fileContent.featureTypes[index];

            const layerName = layerNames[index]
            const layerShapeName = fileContent.fileNames[index]
            const defaultSettings = getDefaultSettings(type, layerName, sourceProps)
            defaultSettings.bbox = fileContent.bboxes[index];

            await client.mutate({
              mutation: ADDLAYER,
              variables: {
                layer: {
                  layerName,
                  layerShapeName,
                  groupName: fileContent.featureTypes.length === 1 ? null : groupName,
                  groupId: fileContent.featureTypes.length === 1 ? null : groupId,
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
              await SimpleOrShapeFileImport({ stateApp, setStateApp, client, file_id, sourceProps })
              handleClose();
            }
          }
        }
        else {
          await SimpleOrShapeFileImport({ stateApp, setStateApp, client, file_id, sourceProps })
          setStateApp((stateApp) => ({
            ...stateApp,
            universalCircularLoaderAct: false,
          }));
          handleClose();
        }
      }
    } catch (error) {
      console.log(error);
      Loader.successToast('errorToast', error)
      setStateApp((stateApp) => ({
        ...stateApp,
        universalCircularLoaderAct: false,
      }));
      dispatch(showErrorMessage("Geojson is invalid"));
      handleClose();
    }
  }

  const handleApplyChanges = async () => {
    if (!groupName) {
      setErrorr(true);
    } else {
      setStateApp((stateApp) => ({
        ...stateApp,
        universalCircularLoaderAct: {
          localLoader: true,
          text: 'This may take some time depending on the file size',
          textStyles: {
            backgroundColor: 'white',
            color: 'green',
          }
        },
      }));

      const userId = stateApp.user.mongoId;
      const fileName = groupName.trim().toLowerCase().replace(" ", "_") + `.${getFileExtension(inputOriginalFile.fileName)}`;
      let originalFileId = ''
      let originalFile
      const size = 80 * 1024 * 1024;
      let smallerArrays = chunkArray({ input: mapControlsStateValues?.fileUploadedContent?.features, bytesSize: size });
      let start = 0
      const chunkSizes = smallerArrays.map((smallerArray) => {
        const chunk = { start, end: start + smallerArray.length }
        start += smallerArray.length
        return chunk
      })
      smallerArrays = undefined

      if (inputOriginalFile) {
        originalFile = await client.mutate({
          mutation: ADDFILE,
          variables: {
            fileName,
            custom_data: {
              totalFeatures: mapControlsStateValues?.fileUploadedContent?.features?.length,
              chunkSizes,
              originalFileName: inputOriginalFile.fileName,
            },
            userId,
          },
        })
        if (originalFile.data.addFile.file.id) {
          originalFileId = originalFile.data.addFile.file.id
          await uploadFileData(originalFile.data.addFile.file, inputOriginalFile)
        }
      }

      await addDataset({
        variables: {
          dataset: {
            fileName: inputOriginalFile.fileName,
            sourceName: groupName,
            // categories: layerNames.map((layerName, index) => ({ name: layerName, layerGeometry: stateMapControls.fileUploadedContent.featureTypes[index] })),
            categories: layerNames.map((layerName, index) => ({ name: layerName, layerGeometry: mapControlsStateValues.fileUploadedContent.featureTypes[index], layerShapeName: mapControlsStateValues.fileUploadedContent.fileNames?.[index] })),
            types: mapControlsStateValues.fileUploadedContent.featureTypes,
            // file: file.data.addFile.file.id,
            file: originalFileId,
            originalFile: originalFileId,
            public: true,
            createBy: stateApp.user.mongoId,
          }
        },
      });

      if (originalFile?.data?.addFile?.success) {
        addLayer(originalFile.data, mapControlsStateValues.fileUploadedContent, groupName + uuid() + "_source", originalFileId)
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
      universalCircularLoaderAct: {
        localLoader: true,
        text: 'This may take some time depending on the file size',
        textStyles: {
          backgroundColor: 'white',
          color: 'green',
        }
      },
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
      <DialogTitle>Create a new Source</DialogTitle>
      <DialogContent dividers>

        <Box fontWeight='bold'>
          Source File Name
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          {inputOriginalFile.fileName}
        </Typography>

        <TextField
          defaultValue={mapControlsStateValues.fileUploadedContent.groupName}
          focused
          required
          margin="dense"
          id="groupName"
          label="Source Name"
          fullWidth
          error={error}
          onChange={handleGroupNameChanges}
        />

        {
          mapControlsStateValues.fileUploadedContent.featureTypes.map((layer, i) =>
            <TextField
              focused
              required
              margin="dense"
              id="layerName"
              value={layerNames[i]}
              label={`Source Category ${i + 1} ( ${layer} )`}
              fullWidth
              error={error}
              onChange={(e) => handleLayerNameChanges(e.target.value, i)}
            />
          )
        }
        <FormControlLabel
          control={
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              checked={isCreateLayers}
              onChange={(event) => setIsCreateLayers(event.target.checked)}
              color="default"
            />
          }
          label="Auto-Add Source Data to Map Layers"
        />

        {!mapControlsStateValues.fileUploadedContent && (
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
          id="createSourceButton"
          disabled={!groupName || layerNames.includes("") || !inputFiles}
          autoFocus
          onClick={handleApplyChanges}
          color="primary"
        >
          Create Source
        </Button>
      </DialogActions>
    </Dialog>
  );
}
