import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import { NavigationContext } from "../NavigationContext";
import { AppContext } from "../../../AppContext";
import { FormLabel } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import OwnershipIcon from "../../Shared/svgIcons/ownership";
// import { UPDATELAYERSETTINGS } from "../../../graphQL/useMutationUpdateLayerSettings";
// import { useMutation } from "@apollo/client";

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

  // const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

  const toggleTracks = () => {
    setStateNav((stateNav) => {
      if (stateNav.filterTrackedOwners) {
        stateApp.toggleLayersActivity("Tracked Owners", false);
        if (
          !stateNav.filterTrackedWells &&
          stateNav.selectedTags &&
          stateNav.selectedTags.length == 0
        )
          stateApp.toggleLayersActivity("Wells", true);
      } else {
        stateApp.toggleLayersActivity("Tracked Owners", true);
        stateApp.toggleLayersActivity("Wells", false);
      }

      return {
        ...stateNav,
        filterTrackedOwners: !stateNav.filterTrackedOwners,
      };
    });
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
        onChange={() => {
          toggleTracks();
        }}
        color="secondary"
        name="checked"
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    </div>
  );
}
