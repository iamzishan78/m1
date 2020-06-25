import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import { NavigationContext } from "../NavigationContext";
import { AppContext } from "../../../AppContext";
import { FormLabel } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import OwnershipIcon from "../../Shared/svgIcons/ownership";

const useStyles = makeStyles({
  mainDiv: {
    padding: "2.5px 15px",
    border: "1px solid #C4C4C4",
    borderRadius: "4px",
    "&:hover": {
      border: "1px solid black",
    },
  },
  noOwnersToggle: {
    float: "right",
    marginTop: "5px",
  },
  IconButton: {
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#fff",
      cursor: "context-menu",
    },
  },
});

export default function FilterTrackedOwners() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);

  const [stateApp] = useContext(AppContext);

  useEffect(() => {
    if (stateApp.checkedUserDefinedLayers)
      if (stateApp.checkedUserDefinedLayers.indexOf(4) === -1)
        setStateNav((stateNav) => ({
          ...stateNav,
          filterTrackedOwners: false,
        }));
      else
        setStateNav((stateNav) => ({
          ...stateNav,
          filterTrackedOwners: true,
        }));
  }, [stateApp.checkedUserDefinedLayers]);

  const toggleTracks = () => {
    if (!stateApp.activateUserDefinedLayers(4))
      stateApp.deactivateUserDefinedLayers(4);
    else stateApp.deactivateWellLayer();
  };

  return (
    <div className={classes.mainDiv}>
      <IconButton className={classes.IconButton}>
        <OwnershipIcon color="#808080" opacity="1.0" />
      </IconButton>
      <FormLabel>Tracked Owners</FormLabel>
      <Switch
        disabled={
          !(stateApp.trackedOwnerWells && stateApp.trackedOwnerWells.length > 0)
        }
        className={classes.noOwnersToggle}
        checked={stateNav.filterTrackedOwners}
        onChange={toggleTracks}
        color="secondary"
        name="checked"
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    </div>
  );
}
