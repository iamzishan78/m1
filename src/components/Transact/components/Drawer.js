import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MessageIcon from "@material-ui/icons/Message";
import DescriptionIcon from "@material-ui/icons/DescriptionSharp";
import CheckmarkIcon from "@material-ui/icons/CheckBoxOutlined";
import ShareIcon from "@material-ui/icons/Share";
import FolderIcon from "@material-ui/icons/Folder";
import IdentityIcon from "@material-ui/icons/PermIdentity";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    padding: "10px",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 9999,
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

    "& svg": {
      fill: "rgb(23, 170, 221) !important",
    },
  },
}));

export default function Drawer() {
  const classes = useStyles();

  const drawerIcons = {
    Messages: (props) => <MessageIcon {...props} />,
    Description: (props) => <DescriptionIcon {...props} />,
    Checkmark: (props) => <CheckmarkIcon {...props} />,
    Share: (props) => <ShareIcon {...props} />,
    Folder: (props) => <FolderIcon {...props} />,
    Identity: (props) => <IdentityIcon {...props} />
  };

  return (
    <div className={classes.root}>
      {Object.keys(drawerIcons).map((key) => (
        <Tooltip title={key} placement="left">
          <div className={classes.icon}>
            {drawerIcons[key]({
              opacity: "1",
              height: "30",
              fill: "rgb(23, 170, 221)",
            })}
          </div>
        </Tooltip>
      ))}
    </div>
  );
}
