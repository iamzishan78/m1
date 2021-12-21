import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import WellIcon from "components/Shared/svgIcons/well";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "93vh",
    padding: "10px",
    position: "absolute",
    right: 0,
    top: (props) => props.top,
    zIndex: 1223,
    backgroundColor: "rgb(240,245,248)",
  },
  icon: {
    cursor: "pointer",
    width: "40px",
    height: "40px",
    backgroundColor: "rgb(210,221,228)",
    transition: "0.25s background-color",
    borderRadius: "100%",
    margin: "0 auto",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    "&:hover": {
      backgroundColor: "rgb(206, 212, 217)",
      transition: "0.25s background-color",
    },
  },
  activeIcon: {
    "& svg": {
      fill: "rgb(23, 170, 221) !important",
    },
  },
  inactiveIcon: {
    "& svg": {
      fill: "rgba(146, 158, 170, 1) !important",
    },
  },
}));

export default function Drawer(props) {
  const classes = useStyles(props);

  const drawerIcons = {
    Home: (props) => (
      <Badge
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        color="primary"
      >
        <HomeIcon {...props} />
      </Badge>
    ),
    Wells: (props) => (
      <Badge
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        color="primary"
      >
        <WellIcon {...props} />
      </Badge>
    ),
  };

  return (
    <div className={classes.root}>
      {Object.keys(drawerIcons).map((key) => (
        <Tooltip title={key} placement="left">
          <div className={`${classes.icon} ${classes.activeIcon}`} onClick={() => props.setPanel(key)}>
            {drawerIcons[key]({
              opacity: "1",
              height: "30",
              color: "#919aa3",
            })}
          </div>
        </Tooltip>
      ))}
    </div>
  );
}
