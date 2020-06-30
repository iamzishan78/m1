import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { MapControlsContext } from "../MapControlsContext";
import { MapContext } from "../../Map/MapContext";
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
import { useDropzone } from 'react-dropzone';
import { readProfileRequest } from "../../Login/AADAuthConfig";


export default function AddUserData(props) {

  const [isOpen, setIsOpen] = useState(true);
  const [inputFile, setInputFile] = useState('');
  const [inputURL, setInputURL] = useState('');

  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateMap, setStateMap] = useContext(MapContext);

  const handleClose = () => {
    setIsOpen(false);
  };

  async function handleFileInput(fileObj) {

    console.log("FILE INPUT HANDLER");
    console.log('Added Files:', fileObj)
    console.log(typeof fileObj);

    try {
      let fileContent = await handleFileAsync(fileObj);
      console.log(fileContent);

    } catch (err) {
      console.log(err);
    }
  }

  const handleOnAlert = (message, variant) => {
    console.log(`${variant}: ${message}`)
  }
  const handleApplyChanges = () => {
    console.log('Apply Changes');
  }

  const handleFileAsync = (file) => {
    return new Promise((resolve, reject) => {

      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      }
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    })
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Dialog open={isOpen} onClose={handleClose} >
        <DialogTitle onClose={handleClose}>
          Add Data
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
          </DialogContentText>
          <DropzoneAreaBase
            onAdd={handleFileInput}
            onDelete={(fileObj) => console.log('Removed File:', fileObj)}
            onAlert={handleOnAlert}
            filesLimit="1"
            dropzoneText=" Drag and Drop a GeoJSON or Shapefile."
            acceptedFiles={[".json", ".geojson", ".shp"]}
          ></DropzoneAreaBase>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Esri Feature Service URL"
            type="url"
            fullWidth
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