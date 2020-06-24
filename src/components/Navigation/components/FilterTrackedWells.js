import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import { NavigationContext } from "../NavigationContext";
import { AppContext } from "../../../AppContext";
import { FormLabel } from "@material-ui/core";
import WellIcon from "../../Shared/svgIcons/well";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
  mainDiv: {
    padding: "0px 15px",
    border: "1px solid #C4C4C4",
    borderRadius: "4px",
    "&:hover": {
      border: "1px solid black",
    },
  },
  noOwnersToggle: {
    float: "right",
    marginTop: "7.5px",
  },
  IconButton: {
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#fff",
      cursor: "context-menu",
    },
  },
});

export default function FilterTrackedWells() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [stateApp] = useContext(AppContext);

  useEffect(() => {
    if (stateApp.checkedUserDefinedLayers)
      if (stateApp.checkedUserDefinedLayers.indexOf(3) === -1)
        setStateNav((stateNav) => ({
          ...stateNav,
          filterTrackedWells: false,
        }));
      else
        setStateNav((stateNav) => ({
          ...stateNav,
          filterTrackedWells: true,
        }));
  }, [stateApp.checkedUserDefinedLayers]);

  const toggleTracks = () => {
    if (!stateApp.activateUserDefinedLayers(3))
      stateApp.deactivateUserDefinedLayers(3);
    else stateApp.deactivateWellLayer();
  };

  return (
    <div className={classes.mainDiv}>
      <IconButton className={classes.IconButton}>
        <WellIcon className={classes.icon} color="#808080" opacity="1.0" />
      </IconButton>
      <FormLabel>Tracked Wells</FormLabel>
      <Switch
        disabled={!(stateApp.trackedwells && stateApp.trackedwells.length > 0)}
        className={classes.noOwnersToggle}
        checked={stateNav.filterTrackedWells}
        onChange={toggleTracks}
        color="secondary"
        name="checked"
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    </div>
  );
}
