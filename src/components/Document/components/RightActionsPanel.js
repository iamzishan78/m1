import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/HomeOutlined";
import InfoOutlined from "@material-ui/icons/InfoOutlined";
import WellIcon from "components/Shared/svgIcons/well";
import AgreementIcon from "components/Shared/svgIcons/agreements";
import ContactIcon from "@material-ui/icons/Person";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import PersonIcon from "@material-ui/icons/Person";

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
      "& path": {
        fill: "rgb(23, 170, 221) !important",
      },
    },
  },
  inactiveIcon: {
    "& svg": {
      "& path": {
        fill: "#919aa3",
      },
    },
  },
}));

export default function Drawer(props) {
  const classes = useStyles(props);
  const { activePanel, setPanel, wellsCount, contactsCount } = props;


  const drawerIcons = {
    Home: (props) => (
      <Badge anchorOrigin={{ vertical: "top", horizontal: "right", }} color="primary">
        <HomeIcon id="wellHomeIcon" {...props} />
      </Badge>
    ),
    Contacts: (props) => (
      <Badge anchorOrigin={{ vertical: "top", horizontal: "right", }} color="primary" badgeContent={contactsCount}>
        <PersonIcon />
      </Badge>
    ),
    Wells: (props) => (
      <Badge anchorOrigin={{ vertical: "top", horizontal: "right", }} color="primary" badgeContent={wellsCount} >
        <WellIcon {...props} />
      </Badge>
    ),
    Info: (props) => (
      <Badge anchorOrigin={{ vertical: "top", horizontal: "right", }} color="primary" >
        <InfoOutlined id="fileInfoIcon" {...props} />
      </Badge>
    ),

  };

  return (
    <div className={classes.root}>
      {Object.keys(drawerIcons).map((key) => (
        <Tooltip title={key} placement="left">
          <div
            className={`${classes.icon} ${activePanel === key ? classes.activeIcon : classes.inactiveIcon}`}
            onClick={() => setPanel(key)}>
            {drawerIcons[key]({
              opacity: "1",
              height: "30",
            })}
          </div>
        </Tooltip>
      ))}
    </div>
  );
}
