import React, {
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useEffect
} from "react";
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
//import mapStyles from "../../Map/components/Utils/MapStyles";


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

// const availableMapStyles = [
//   // { 
//   //   id: "mapbox://styles/m1neral/ck6r9utau10at1ioagkpr40xc", 
//   //   label: "Basic" 
//   // },
//   { 
//     id: "ck6r9utau10at1ioagkpr40xc", 
//     name: "Basic" 
//   },
//   {
//     id: "ck6pe50n80bfs1imr05f0hr82",
//     name: "Satellite"
//   },
//   {
//     id: "ck722ye6x0ysw1ink106f1deb",
//     name: "Light"
//   },
//   {
//     id: "ck722xcuj0tts1imj9gw4lymn",
//     name: "Monochrome"
//   },
//   // {
//   //   id: "mapbox://styles/m1neral/ck76duew72wk71ip92kmxqilm",
//   //   name: "Testinator"
//   // },
// ];



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

  const [mapStyles, setMapStyles] = useState([]);




  useEffect(() => {
    const req = new Request(
      "https://api.mapbox.com/styles/v1/m1neral?access_token=sk.eyJ1IjoibTFuZXJhbCIsImEiOiJjazdkbGg1YXAwMjVqM2VwanZzbm95Z2dvIn0.cdoQNZU42xxbybyGxlBNkw",
      {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(req, { signal: signal })
      .then(results => results.json())
      .then(data => {
        setMapStyles(data.slice(0, 4));
      });

    //clean up
    return function cleanup() {
      abortController.abort();
    };
  }, []);













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

      {mapStyles.map(style => (
        <StyledMenuItem
          key={style.id}
          onClick={() => {
            setStateMap(state => ({ ...state, selectedLayerId: "mapbox://styles/m1neral/"+style.id }));
            handleClose();
          }}
        >
          <ListItemText primary={style.name} />
        </StyledMenuItem>
      ))}
    </StyledMenu>
    /* </ClickAwayListener> */
  );
}
