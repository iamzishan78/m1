import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import * as turf from "@turf/turf";
import DragIndicator from "@material-ui/icons/DragIndicator";
import RootRef from "@material-ui/core/RootRef";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import { DropzoneAreaBase } from 'material-ui-dropzone';

const random_rgb = () => {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
}


export default function AddUserData(props) {

  const [isOpen, setIsOpen] = useState(true);
  const [inputFiles, setInputFiles] = useState(null);
  const [inputURL, setInputURL] = useState(null);
  const [layerName, setLayerName] = useState('');
  const [error, setErrorr] = useState(false);

  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

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


  const handleApplyChanges = async () => {
    console.log('Apply Changes');
    if (!layerName) {
      setErrorr(true);
    } else {
      let fileContent = inputFiles;

      // Upload file to MS Blob Stroage
      // const storageKey = "37i2O1eohYXCKeXF482DT8mEPqvkCPqxn1Q6cDwJdCE%3D";
      // const accountName = "m1neralstorage";
      // const containerName = "m1dev";
      // const fileName = layerName.trim().toLowerCase().replace(' ', '_') + '.geojson';

      // const content = JSON.stringify(fileContent);
      // const fileLength = content.length;

      // const blobType ="BlockBlob"
      // const uploadDate = new Date().toUTCString()
      // const blobServiceVersion = "2018-03-28"

      // const storageBlobEndpoint = "https://" + accountName + ".blob.core.windows.net"
      // const requestURL = storageBlobEndpoint + "/" + containerName + "/" + fileName
      // const requestMethod = "PUT";

      // let response = await fetch(`https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?st=${uploadDate}&se=${uploadDate}
      //         &sp=w&sv=${blobServiceVersion}&sr=b&sig=37i2O1eohYXCKeXF482DT8mEPqvkCPqxn1Q6cDwJdCE%3D`, {
      //   headers: {
      //     "Content-Type": "text/plain; charset=UTF-8",
      //     "X-Ms-Blob-Content-Disposition": `attachment; filename=\"${fileName}\"`,
      //     "X-Ms-Blob-Type": "BlockBlob",
      //     "X-Ms-Date": `${uploadDate}`,
      //     "X-Ms-Meta-Internalkey": "e1c660d1-97d7-4b2b-937b-c09bfa07a618",
      //     "X-Ms-Version": "2015-02-21"
      //   },
      //   method: "PUT",
      //   body: content
      // });

      // console.log(response.json());

      let existingFileLayers = stateApp.userFileLayers;
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
      existingFileLayers.push({layerName, fileContent, idColor, layerType: type, paintProps});
      console.log('USER FILE LAYERS:: ', existingFileLayers)
      setStateApp(stateApp => ({ ...stateApp, userFileLayers: [...existingFileLayers] }));
      setIsOpen(false);
      setStateMapControls(stateMapControls => ({ ...stateMapControls, selectedControl: null }));
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