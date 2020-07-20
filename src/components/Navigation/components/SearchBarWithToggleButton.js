import React, { useEffect } from "react";
import { AppContext } from "../../../AppContext";
import { NavigationContext } from "../NavigationContext";
import { makeStyles, fade } from "@material-ui/core/styles";
import Search from "./Search";
import GridOnIcon from "@material-ui/icons/GridOn";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiButtonGroup-root": { width: "100%" },
    "& .MuiAutocomplete-root": {
      // width: "Calc(100% - 40px)",
      flexGrow: "1",
      borderRight: "1px solid rgba(0, 0, 0, 0.23)",
      borderColor: "rgba(1, 17, 51, 0.5)",
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
        borderRadius: "4px",
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
      },
    },
    "& fieldset": {
      border: "none",
      borderTopRightRadius: "0",
      borderBottomRightRadius: "0",
    },
  },
  gridOnIcon: {
    color: "#fff",
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
}));

export default function SearchBarWithToggleButton() {
  const classes = useStyles();
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [stateNav, setStateNav] = React.useContext(NavigationContext);

  return (
    <div className={classes.root}>
      <ButtonGroup
        variant="text"
        color="primary"
        aria-label="text primary button group"
      >
        <Search />
        <Button
          className={classes.gridOnIcon}
          onClick={() => {
            setStateApp((state) => ({
              ...state,
              mapGridCardActivated: !state.mapGridCardActivated,
            }));
          }}
        >
          <GridOnIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}
