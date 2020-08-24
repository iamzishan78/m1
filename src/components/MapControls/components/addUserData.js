import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import * as turf from "@turf/turf";
import DragIndicator from "@material-ui/icons/DragIndicator";
import RootRef from "@material-ui/core/RootRef";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import { ADDFILE } from "../../../graphQL/useMutationAddFile";
import { UPSERTFILELAYER } from "../../../graphQL/useMutationUpsertFileLayer";

const random_rgb = () => {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
}

const Alert = (props) => {
  return <MuiAlert elevation={5} variant="filled" {...props} />;
}


export default function AddUserData(props) {

  const [isOpen, setIsOpen] = useState(true);
  const [inputFiles, setInputFiles] = useState(null);
  const [inputURL, setInputURL] = useState(null);
  const [layerName, setLayerName] = useState('');
  const [error, setErrorr] = useState(false);
  const [uploadFailed, setUploadFailed] = useState("");

  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

  const [addFile, { data: fileData }] = useMutation(
    ADDFILE
  );

  const [upsertFileLayer, { data: fileLayer }] = useMutation(
    UPSERTFILELAYER
  );

  const handleClose = () => {
    setIsOpen(false);
    setStateMapControls(stateMapControls => ({ ...stateMapControls, selectedControl: null }));
  };

  async function handleFileInput(fileObj) {
    console.log('Added Files:', fileObj)
    console.log(typeof fileObj);

    try {
      let fileContent = await handleFileAsync(fileObj);
      console.log('FILE CONTENT: ', fileContent);
      setInputFiles(fileContent);
    } catch (err) {
      console.log(err);
    }
  }

  const handleOnAlert = (message, variant) => {
    console.log(`${variant}: ${message}`)
  }

  useEffect(() => {
    if (fileData && fileData.addFile) {
      console.log(fileData.addFile);

      // Upload file to MS Blob Stroage

      let fileContent = inputFiles;

      const url = fileData.addFile.uri;
      const interal_key = fileData.addFile.internalKey
      const file_id = fileData.addFile.id;

      if (file_id) {

        const content = JSON.stringify(fileContent);

        fetch(url, {
          headers: {
            "Content-Type": "text/plain; charset=UTF-8",
            "X-Ms-Blob-Type": "BlockBlob",
            "X-Ms-Meta-Internalkey": interal_key,
            "X-Ms-Version": "2015-02-21"
          },
          method: "PUT",
          body: content
        }).then((response) => response.text())
        .then((response) => {
          console.log(response);
          const idColor = random_rgb();
          let type = turf.getType(fileContent);
          let paintProps = {};
          if (type == 'Point' || type == 'MultiPoint') {
            type = 'circle'
          } else {
            type = 'fill';
          }
          if (type == 'circle') {
            paintProps = {
              "circle-radius": 5,
              "circle-color": idColor,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#fff",
            }
          } else {
            paintProps = {
              "fill-color": idColor,
              "fill-opacity": 0.4,
              "fill-outline-color": idColor,
            }
          }
          upsertFileLayer({
            variables: {
              fileLayer: {
                layerName: layerName,
                user: stateApp.user.mongoId,
                file: file_id,
                idColor: idColor,
                layerType: type,
                paintProps: paintProps
              }
            }
          })
          
        })
        .catch((error) => console.log(error));
      }
    } else {
      setUploadFailed("Failed Upload File, Please Try Again");
    }
  }, [fileData])

  useEffect(() => {
    if (fileLayer && fileLayer.upsertFileLayer && fileLayer.upsertFileLayer.success) {
      let existingFileLayers = stateApp.userFileLayers;
      const fileLayerData = fileLayer.upsertFileLayer.fileLayer;
      const layerName = fileLayerData.layerName;
      const fileContent = inputFiles;
      const idColor = fileLayerData.idColor;
      const layerType = fileLayerData.layerType;
      const paintProps = fileLayerData.paintProps;
      const fileId = fileLayerData.file._id;
      const fileLayerId = fileLayerData._id
      existingFileLayers.push({fileLayerId, layerName, fileContent, idColor, layerType, paintProps, fileId});
      console.log('USER FILE LAYERS:: ', existingFileLayers)
      setStateApp(stateApp => ({ ...stateApp, userFileLayers: [...existingFileLayers] }));
      setIsOpen(false);
      setStateMapControls(stateMapControls => ({ ...stateMapControls, selectedControl: null }));
    }
  }, [fileLayer]);


  const handleApplyChanges = async () => {
    console.log('Apply Changes');
    if (!layerName) {
      setErrorr(true);
    } else {
      
      const fileName = layerName.trim().toLowerCase().replace(' ', '_') + '.geojson';

      const userId = stateApp.user.mongoId;

      addFile({
        variables: {
          fileName,
          userId
        }
      });
    }
  }

  const handleFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      fetch(file[0].data)
        .then((response) => response.json())
        .then((response) => {
          resolve(response);
        })
        .catch((error) => reject(error));
    })
  }

  const handleLayerNameChanges = (e) => {
    if (e.target.value) {
      setErrorr(false);
      setLayerName(e.target.value);
    }
  }

  const handleURLinput = async (e) => {
    let inputURL = e.target.value;
    console.log(inputURL);
    if (inputURL.endsWith(".geojson")) {
      let fileContent = await handleFileAsync(inputURL);
      console.log('FILE CONTENT: ', fileContent);
      setInputFiles(fileContent);
    }
  }

  const handleCloseNotification = () => {
    setUploadFailed('');
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>
          Add Data
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
          </DialogContentText>
          <TextField
            required
            margin="dense"
            id="layerName"
            label="Layer Name"
            fullWidth
            error={error}
            onChange={handleLayerNameChanges}
          />
          <DropzoneAreaBase
            onAdd={handleFileInput}
            onDelete={(fileObj) => console.log('Removed File:', fileObj)}
            onAlert={handleOnAlert}
            filesLimit={1}
            dropzoneText=" Drag and Drop a GeoJSON or Shapefile."
            acceptedFiles={[".geojson", ".zip"]}
            maxFileSize={600000000}
          ></DropzoneAreaBase>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Esri Feature Service URL"
            type="url"
            fullWidth
            onChange={handleURLinput}
          />
          <Typography gutterBottom>
          </Typography>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={uploadFailed}
            autoHideDuration={5000}
            onClose={handleCloseNotification}
          >
            <Alert severity="error" onClose={handleCloseNotification}>{uploadFailed}</Alert>
          </Snackbar>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleApplyChanges} color="primary">
            Apply Changes
          </Button>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ClickAwayListener>
  );
}