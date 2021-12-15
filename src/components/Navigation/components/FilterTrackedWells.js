import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import { NavigationContext } from "../NavigationContext";
import { AppContext } from "../../../AppContext";
import { FormLabel } from "@material-ui/core";
import WellIcon from "components/Shared/svgIcons/well";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
  mainDiv: {
    padding: "0px 25%",
    display: "flex",
    alignItems: "center",

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

  React.useEffect(() => {
    if (!stateNav.filterTrackedWells) {
      stateApp.toggleLayersActivity("Tracked Wells", false);
      if (!stateNav.filterTrackedOwners && stateNav.selectedTags && stateNav.selectedTags.length == 0)
        stateApp.toggleLayersActivity("Wells", true);
    } else {
      stateApp.toggleLayersActivity("Tracked Wells", true);
      stateApp.toggleLayersActivity("Wells", false);
    }
  }, [stateNav.filterTrackedWells]);

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
        onChange={() => {
          setStateNav((stateNav) => ({
            ...stateNav,
            filterTrackedWells: !stateNav.filterTrackedWells,
          }));
        }}
        color="secondary"
        name="checked"
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    </div>
  );
}
