import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { MapControlsContext } from "../MapControlsContext";
import { MapContext } from "../../Map/MapContext";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from "@material-ui/core/ListItemText";
import DragIndicator from "@material-ui/icons/DragIndicator";
import RootRef from "@material-ui/core/RootRef";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';


export default function AddUserData(props) {

  const [isOpen, setIsOpen] = useState(true);

  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateMap, setStateMap] = useContext(MapContext);

  // const handleClose = () => {
  //   setStateMapControls(stateMapControls => ({
  //     ...stateMapControls,
  //     anchorEl: null
  //   }));
  // };


  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Dialog open={isOpen} onClose={handleClose} >
        <DialogTitle onClose={handleClose}>
          Add Data to the Map
        </DialogTitle>
        <DialogContent dividers>

          <DialogContentText>
            Drag and Drop a GeoJSON or Shapefile.

          </DialogContentText>
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
          <Button autoFocus onClick={handleClose} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </ClickAwayListener>

  );

}