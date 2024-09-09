import React from "react";
import { AppContext } from "../../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import Search from "./Search";
import Tooltip from "@material-ui/core/Tooltip";
import GridOnIcon from "@material-ui/icons/GridOn";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import PostAddOutlinedIcon from "@material-ui/icons/PostAddOutlined";
import { useLocation } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { globalStateController } from "hookstate/globalStateController";
import { mapControlsController } from "hookstate/mapControlsController";
import { popupController } from 'hookstate/popupStateController';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiButtonGroup-root": { width: "100%", borderRadius: "13px", padding: '0 5px', backgroundColor: 'rgb(28, 34, 51) !important' },
    "& .MuiAutocomplete-root": {
      flexGrow: "1",
      borderRight: "1px solid rgba(0, 0, 0, 0.23)",
      borderColor: "rgba(1, 17, 51, 0.5)",
      backgroundColor: "#1c2233",
      borderRadius: "25px",
      // position: 'relative',

      // "&:hover": {
      //   backgroundColor: "#626687",
      //   borderRadius: "25px",
      //   // borderTopRightRadius: "0",
      //   // borderBottomRightRadius: "0",
      // },
    },
    "& fieldset": {
      border: "none",
      borderTopRightRadius: "0",
      borderBottomRightRadius: "0",
    },
  },
  gridOnIcon: {
    color: "#d3d3d3",
    backgroundColor: "#1c2233",
    borderRadius: "25px",
    minWidth: "unset",
    padding: '0 10px 0 0',
    // "&:hover ": {
    //   backgroundColor: "#626687",
    //   borderRadius: "25px",
    // },
  },
  selected: {
    color: "rgba(23, 170, 221, 1) !important",
    backgroundColor: "#1c2233",
    borderRadius: "25px",
    marginLeft: "5px",
    // "&:hover ": {
    //   backgroundColor: "#626687",
    //   borderRadius: "25px",
    // },
  },
}));

function GridIcon() {
  const classes = useStyles();
  const history = useHistory();


  const { mapControlsStateValues } = mapControlsController.useState(['mapGridCardActivated'], 'mapControlsStateValues');

  return (
    <Tooltip title="Search Grid">
      <Button
        id="snapGridButton"
        className={mapControlsStateValues.mapGridCardActivated ? classes.selected : classes.gridOnIcon}
        onClick={() => {
          history.replace({ pathname: "/" }); // reset path to default 
          popupController.reset(); // close expanded card 
          mapControlsController.toggleMapGridCardAtived();
          mapControlsController.updateState({ selectedDataset: { name: 'M1 Platform' }, expandedPanel: false, layerGridCard: false })
        }}
      >
        <GridOnIcon fontSize="25" />
      </Button>
    </Tooltip>
  );
}

const Loader = () => {
  const [stateApp] = React.useContext(AppContext);
  const { stateValues } = globalStateController.useState(['layerLoading'])
  let { layerLoading } = stateValues
  layerLoading = !!Object.values(layerLoading).find((layer) => layer);

  return <>
    {(stateApp.searchLoader || layerLoading) && (
      <CircularProgress key="loader" style={{ position: "absolute", right: "-38px", top: "8px" }} size={28} color="secondary" />
    )}
  </>
}

const GridIconComponent = () => {
  const classes = useStyles();

  let location = useLocation();

  return <>
    {location.pathname === "/documents" ? (
      <Tooltip title="Add Document">
        <Button
          className={classes.gridOnIcon}
          onClick={() => {
            window.setStateApp(stateApp => ({ ...stateApp, DocumentDrawer: true }));
          }}
        >
          <PostAddOutlinedIcon />
        </Button>
      </Tooltip>
    ) : (
      <GridIcon />
    )}
  </>
}

export function SearchBarWithToggleButton() {
  const classes = useStyles();

  const { mapControlsStateValues } = mapControlsController.useState(['mapGridCardActivated'], 'mapControlsStateValues');

  return (
    <div className={classes.root}>
      {!mapControlsStateValues.mapGridCardActivated && (
        <ButtonGroup variant="text" color="primary" aria-label="text primary button group">

          {/* <SearchByTypeSelectField/> */}
          <Search />

          <GridIconComponent />
        </ButtonGroup>
      )}
      <Loader />
    </div>
  );
}

export default React.memo(SearchBarWithToggleButton)
