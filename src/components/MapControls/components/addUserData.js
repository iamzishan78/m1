import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
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


export default function AddUserData(props) {

  const [isOpen, setIsOpen] = useState(true);
  const [inputFiles, setInputFiles] = useState(null);
  const [inputURL, setInputURL] = useState(null);

  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

  const handleClose = () => {
    setIsOpen(false);
    //setStateMapControls(stateMapControls => ({ ...stateMapControls }));
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


  const handleApplyChanges = () => {
    console.log('Apply Changes');
    let fileContent = inputFiles;
    let existingFileLayers = stateApp.userFileLayers;
    existingFileLayers.push(fileContent);
    console.log('USER FILE LAYERS:: ', existingFileLayers)

    setStateApp(stateApp => ({ ...stateApp, userFileLayers: [...existingFileLayers] }));
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

  const handleURLinput = (e) => {
    let inputURL = e.target.value;
    console.log(inputURL);
    if (inputURL.endsWith(".geojson")) {
      let existingFileLayers = stateApp.userFileLayers
      existingFileLayers.push(inputURL);
      console.log('INPUT URL ADDED:: ', inputURL)
      setInputFiles(inputFiles => ({ userFileLayers: [...existingFileLayers] }));
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