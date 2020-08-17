import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import { withStyles, makeStyles, responsiveFontSizes } from "@material-ui/core/styles";
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
import { readProfileRequest } from "../../Login/AADAuthConfig";
import shp from 'shpjs';



export default function AddUserData(props) {

  const [isOpen, setIsOpen] = useState(true);
  const [inputFiles, setInputFiles] = useState(null);
  const [inputURL, setInputURL] = useState(null);
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {

    setStateMapControls((state) => ({ ...state, anchorEl: null }));
  };

  const windowClose = () => { setIsOpen(!isOpen); }

  // const handleClose = () => {
  //   setIsOpen(false);
  //   //setStateMapControls(stateMapControls => ({ ...stateMapControls }));
  // };

  async function handleFileInput(fileObj) {
    console.log('ADDED FILES:', fileObj)
    let fileContent = await handleFileAsync(fileObj);
    console.log("FILE CONTENT::", fileContent)
    let existingFileLayers = stateApp.userFileLayers;
    existingFileLayers.push(fileContent);
    setStateApp(stateApp => ({ ...stateApp, userFileLayers: [...existingFileLayers] }));
  }

  const handleURLinput = (e) => {
    let input = e.target.value;
    if (input.endsWith(".geojson")) {
      console.log("GEOJSON SERVICE LAYER")
      let existingFileLayers = stateApp.userFileLayers;
      existingFileLayers.push(input);
      setStateApp(stateApp => ({ ...stateApp, userFileLayers: [...existingFileLayers] }));

    } else {
      console.log("TILE SERVICE LAYER")
      let existingServiceLayers = stateApp.userServiceLayers
      existingServiceLayers.push(input);
      console.log('INPUT URL ADDED:: ', input)
      setStateApp(stateApp => ({ ...stateApp, userServiceLayers: [...existingServiceLayers] }));
      console.log("USER SERVICE LAYERS STATE CHANGE", stateApp.userServiceLayers)
      // setInputURL(input);
    }
  }

  async function handleFileAsync(file) {
    let inputFile = file[0].data;
    let fileName = file[0].file.name;

    if (fileName.endsWith(".geojson")) {
      return await new Promise((resolve, reject) => {
        fetch(inputFile)
          .then((response) =>
            response.json())
          .then((response) => {
            resolve(response);
          })
          .catch((error) => reject(error));
      })
    } else if (fileName.endsWith(".zip")) {
      return await new Promise((resolve, reject) => {

        fetch(inputFile)
          .then((response) => {
            response.arrayBuffer()
              .then(buffer => {
                shp(buffer).then(geojson => {
                  console.log(geojson);
                  resolve(geojson);
                })
              })
          })
      });
    }
  }

  // const handleApplyChanges = () => {
  //   console.log('Apply Changes');
  // }

  const handleOnAlert = (message, variant) => {
    console.log(`${variant}: ${message}`)
  }
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Dialog open={isOpen} onClose={windowClose}>
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
            dropzoneText="Drag and Drop a GeoJSON or Shapefile."
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
          {/* <Button autoFocus onClick={handleApplyChanges} color="primary">
            Apply Changes
          </Button> */}
          <Button autoFocus onClick={windowClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ClickAwayListener>
  );
}