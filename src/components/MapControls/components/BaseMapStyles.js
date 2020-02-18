import React, { useContext } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
//import Button from '@material-ui/core/Button';
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
//import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from "@material-ui/core/ListItemText";
//import InboxIcon from '@material-ui/icons/MoveToInbox'
//import DraftsIcon from '@material-ui/icons/Drafts'
//import SendIcon from '@material-ui/icons/Send'
import { MapControlsContext } from "../MapControlsContext";
import { MapContext } from "../../Map/MapContext";
import { style } from "@material-ui/system";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #011133"
  }
})(props => (
  <Menu
    elevation={0}
    variant="menu"
    transitionDuration={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "top",
      horizontal: "left"
    }}
    MenuListProps={{
      disablePadding: true
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    fontFamily: "Poppins",
    "&:hover": {
      background: "#4B618F"
    },
    //'&:focus': {
    backgroundColor: "#263451",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white
      // },
    }
  }
}))(MenuItem);

const useStyles = makeStyles(theme => ({
  subHeaderItem: {
    backgroundColor: "#011133 !important"
  }
}));

const availableMapStyles = [
  { id: "mapbox://styles/m1neral/ck6r9utau10at1ioagkpr40xc", label: "Basic" },
  {
    id: "mapbox://styles/m1neral/ck6pe50n80bfs1imr05f0hr82",
    label: "Satellite"
  }
];

export default function BaseMapStyles(props) {
  const [stateMapControls, setStateMapControls] = useContext(
    MapControlsContext
  );
  const [stateMap, setStateMap] = useContext(MapContext);
  //const theme = useTheme()
  const classes = useStyles();
  const handleClose = () => {
    setStateMapControls(state => ({ ...state, anchorEl: null }));
  };

  return (
    /* <ClickAwayListener onClickAway={handleClose}> */
    <StyledMenu
      id="customized-menu"
      anchorEl={stateMapControls.anchorEl}
      keepMounted
      open={Boolean(stateMapControls.anchorEl)}
      onClose={handleClose}
    >
      <StyledMenuItem
        disableRipple
        key="subheader"
        role={undefined}
        dense
        className={classes.subHeaderItem}
      >
        <ListItemText primary="Base Map" />
      </StyledMenuItem>

      {availableMapStyles.map(style => (
        <StyledMenuItem
          key={style.id}
          onClick={() => {
            setStateMap(state => ({ ...state, selectedLayerId: style.id }));
            handleClose();
          }}
        >
          <ListItemText primary={style.label} />
        </StyledMenuItem>
      ))}
    </StyledMenu>
    /* </ClickAwayListener> */
  );
}
