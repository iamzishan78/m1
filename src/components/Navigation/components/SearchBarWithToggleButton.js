import React from "react";
import { AppContext } from "../../../AppContext";
import { makeStyles, fade } from "@material-ui/core/styles";
import Search from "./Search";
import Tooltip from "@material-ui/core/Tooltip";
import GridOnIcon from "@material-ui/icons/GridOn";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { toggleMapGridCardAtived } from "actions";
import PostAddOutlinedIcon from "@material-ui/icons/PostAddOutlined";
import { useLocation } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

// import SearchByTypeSelectField from "components/MapGridCard/components/SearchByTypeSelectField";


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

      "&:hover": {
        backgroundColor: "#626687",
        borderRadius: "25px",
        // borderTopRightRadius: "0",
        // borderBottomRightRadius: "0",
      },
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
    "&:hover ": {
      backgroundColor: "#626687",
      borderRadius: "25px",
    },
  },
  selected: {
    color: "rgba(23, 170, 221, 1) !important",
    backgroundColor: "#1c2233",
    borderRadius: "25px",
    marginLeft: "5px",
    "&:hover ": {
      backgroundColor: "#626687",
      borderRadius: "25px",
    },
  },
}));

function GridIcon({ setStateApp }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { mapGridCardActivated } = useSelector(({ MapGridCard }) => MapGridCard);
  return (
    <Tooltip title="Search Grid">
      <Button
        id="snapGridButton"
        className={mapGridCardActivated ? classes.selected : classes.gridOnIcon}
        onClick={() => {
          setStateApp((stateApp) => ({ ...stateApp, selectedDataset: { name: 'M1 Platform' } }))
          dispatch(toggleMapGridCardAtived());
        }}
      >
        <GridOnIcon fontSize="25" />
      </Button>
    </Tooltip>
  );
}

export default function SearchBarWithToggleButton() {
  const classes = useStyles();
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const { mapGridCardActivated } = useSelector(({ MapGridCard }) => MapGridCard);
  let location = useLocation();
  return (
    <div className={classes.root}>
      {!mapGridCardActivated && (
        <ButtonGroup variant="text" color="primary" aria-label="text primary button group">

          {/* <SearchByTypeSelectField/> */}
          <Search />

          {location.pathname === "/documents" ? (
            <Tooltip title="Add Document">
              <Button
                className={classes.gridOnIcon}
                onClick={() => {
                  setStateApp({ ...stateApp, DocumentDrawer: true });
                }}
              >
                <PostAddOutlinedIcon />
              </Button>
            </Tooltip>
          ) : (
            <GridIcon setStateApp={setStateApp} />
          )}
        </ButtonGroup>
      )}
      {stateApp.searchLoader && (
        <CircularProgress key="loader" style={{ position: "absolute", right: "-38px", top: "8px" }} size={28} color="secondary" />
      )}
    </div>
  );
}
