import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { withStyles, makeStyles, responsiveFontSizes } from "@material-ui/core/styles";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { MapControlsContext } from "../MapControlsContext";
import { AppContext } from "../../../AppContext";
import * as turf from "@turf/turf";
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import { Collapse } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const random_rgb = () => {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
}

const Alert = (props) => {
  return <MuiAlert elevation={5} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important",
    minWidth: "350px",
  },
  list: {
    padding: 0,
  },
  nested: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
  disabledLayerTitle: {
    "& span": { color: "rgb(127, 149, 199) !important" },
  },
}));

const StyledListItem = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    "&:hover": {
      background: "#4B618F",
    },
    backgroundColor: "#263451",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
  },
}))(ListItem);

const StyledListItem2 = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    "&:hover": {
      background: "#a3b2cf",
    },
    backgroundColor: "#4B618F",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
  },
}))(ListItem);


export default function AddLayer(props) {

  const [isOpen, setIsOpen] = useState(true);
  const classes = useStyles();

  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateApp, setStateApp] = useContext(AppContext);
  const [open, setOpen] = React.useState(false);
  const [openM1, setOpenM1] = React.useState(true);
  const [openUD, setOpenUD] = React.useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setStateMapControls(stateMapControls => ({ ...stateMapControls, addLayer: false }));
  };

  const windowClose = () => {
    setIsOpen(!isOpen);
    setStateMapControls(stateMapControls => ({ ...stateMapControls, addLayer: false }));
  }

  const handleClickM1List = () => {
    setOpenM1(!openM1);
  }

  const handleClickUDList = () => {
    setOpenUD(!openUD);
  }

  const M1Layers = stateApp.layers.filter((layer) => layer.layerCategory == 'M1 Layer');
  const UdLayers = stateApp.layers.filter((layer) => layer.layerCategory == 'UD layer');
  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Dialog open={isOpen} onClose={windowClose}>
        <DialogTitle>
          Add a Layer
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Select one or more of the available layers below to add them to your current map view.
          </DialogContentText>
          <Button color="primary">
            Add Layer
          </Button>
          <StyledListItem2 button onClick={handleClickM1List}>
            <ListItemText primary="M1neral Layers" />
            {openM1 ? <ExpandLess /> : <ExpandMore />}
          </StyledListItem2>
          <Collapse in={openM1} timeout="auto" unmountOnExit>
            <List className={classes.list}>
              {M1Layers.map((layer, index) => {
                const labelId = `m1layer-list-label-${index}`;
                return (
                    <StyledListItem
                      ContainerComponent="li"
                    >
                      <ListItemText id={labelId} primary={layer.layerName} />
                    </StyledListItem>
                );
              })}
            </List>
          </Collapse>
          <StyledListItem2 button onClick={handleClickUDList}>
            <ListItemText primary="M1neral Layers" />
            {openUD ? <ExpandLess /> : <ExpandMore />}
          </StyledListItem2>
          <Collapse in={openUD} timeout="auto" unmountOnExit>
            <List className={classes.list}>
              {UdLayers.map((layer, index) => {
                const labelId = `udlayer-list-label-${index}`;
                return (
                    <StyledListItem
                      ContainerComponent="li"
                    >
                      <ListItemText id={labelId} primary={layer.layerName} />
                    </StyledListItem>
                );
              })}
            </List>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="primary">
            Apply
          </Button>
          <Button onClick={windowClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ClickAwayListener>
  );
}