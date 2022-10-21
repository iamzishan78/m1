import React, { useContext, useState, useEffect } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { MapControlsContext } from "../MapControlsContext";
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
import { uploadFileData } from "components/Shared/functions";
import { BlockBlobClient } from "@azure/storage-blob";
import { Box, Checkbox, FormControlLabel } from "@material-ui/core";
import { ADD_DATASET } from "graphQL/useMutationDataset";
import { ADD_LAYER_GROUP } from "graphQL/useMutationLayerGroup";

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
  const [inputOriginalFile, setInputOriginalFile] = useState(stateMapControls.fileUploadedOriginalContent);
  const [layerNames, setLayerNames] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isCreateLayers, setIsCreateLayers] = useState(true);
  const [error, setErrorr] = useState(false);
  const [notReturn, setNotReturn] = useState(false);
  const [uploadFailed, setUploadFailed] = useState("");
  const [url, setUrl] = useState("");

  const [stateApp, setStateApp] = useContext(AppContext);
  const client = useApolloClient();
  const [addFile] = useMutation(ADDFILE);
  const [addDataset] = useMutation(ADD_DATASET, { refetchQueries: ["getDatasets"], awaitRefetchQueries: true });
  const [addLayerGroup] = useMutation(ADD_LAYER_GROUP, {
    refetchQueries: ["getLayerGroups"],
    awaitRefetchQueries: true,
  });

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
      manageSourceLayer: false,
      manageLayer: false,
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
        .then(async () => {
          // if iscreate layer is selected only then create the layers 

          // Zip is added
          // TODO: Check Data Add

          if (isCreateLayers) {
            if (fileContent.featureTypes.length > 1) {
              const layerGroup = { name: groupName, groupId: groupId, createBy: stateApp.user.mongoId }
              addLayerGroup({ variables: { userId: stateApp.user.mongoId, layerGroup } })
            }
            fileContent.featureTypes.forEach(async (type, index) => {
              const layerName = layerNames[index]
              const layerShapeName = fileContent.fileNames[index]
              const defaultSettings = getDefaultSettings(type, layerName, sourceProps)
              addLayer({
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
            })
          }

          else {
            await SimpleOrShapeFileImport({ stateApp, setStateApp, client, file_id, sourceProps })
            setStateApp((stateApp) => ({
              ...stateApp,
              universalCircularLoaderAct: false,
            }));
            handleClose();
          }
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

      console.log({inAdd:stateMapControls.fileUploadedContent})

      await addDataset({
        variables: {
          dataset: {
            fileName: inputOriginalFile.fileName,
            sourceName: groupName,
            // categories: layerNames.map((layerName, index) => ({ name: layerName, layerGeometry: stateMapControls.fileUploadedContent.featureTypes[index] })),
            categories: layerNames.map((layerName, index) => ({ name: layerName, layerGeometry: stateMapControls.fileUploadedContent.featureTypes[index], layerShapeName: stateMapControls.fileUploadedContent.fileNames?.[index] })),
            types: stateMapControls.fileUploadedContent.featureTypes,
            file: file.data.addFile.file.id,
            originalFile: originalFileId,
            public: true,
            createBy: stateApp.user.mongoId,
          }
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
      <DialogTitle>Create a new Source</DialogTitle>
      <DialogContent dividers>

        <Box fontWeight='bold'>
          Source File Name
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          {inputOriginalFile.fileName}
        </Typography>

        <TextField
          defaultValue={stateMapControls.fileUploadedContent.groupName}
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
          stateMapControls.fileUploadedContent.featureTypes.map((layer, i) =>
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
          Create Source
        </Button>
      </DialogActions>
    </Dialog>
  );
}
