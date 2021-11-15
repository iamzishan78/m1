import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItem from "@material-ui/core/ListItem";
import Select from "@material-ui/core/Select";
import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  overrides: {
    MuiSvgIcon: {
      root: {
        width: 90,
        height: 60,
      },
    },
    MuiListItemText: {
      root: {
        textAlign: "center",
      },
    },
  },
});

export const useStyles = makeStyles((theme) => ({
  pulloutBox: {
    height: "80px",
    color: "white",
    width: "20px",
    marginTop: "103px",
    background: "#141d32",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      transform: "scaleX(0.5)",
    },
  },
  subHeaderItem: {
    // this is the top header on the layer manager which contains the word "layesrs" and teh button "manager"
    // backgroundColor: "#141d32 !important",
    // backgroundColor: "red",
    backgroundColor: "#0e111a !important",
    minWidth: "400px",
    height: "50px",
  },

  // this is for basemap panel
  list: {
    padding: 0,
    minWidth: "425px",
    overflowY: "auto",
    height: "calc(100vh - 466px - 50px - 64px)",
    // maxHeight: 'calc(100vh - 40px - 64px)',
    // backgroundColor: "#040e24",
    backgroundColor: "#0e111a",
    "&::-webkit-scrollbar": {
      width: "0.75em",
    },
    // "&:hover::-webkit-scrollbar": {
    //     width: "1.0em",
    // },
    "&::-webkit-scrollbar-track": {
      "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#506187",
      borderRadius: 5,
    },
  },
  heatmapList: {
    padding: 0,
    minWidth: "425px",
    overflowY: "auto",
    height: "calc(100vh - 50px - 64px)",
    maxHeight: "calc(100vh - 40px - 64px)",
    backgroundColor: "#0e111a",
    "&::-webkit-scrollbar": {
      width: "0.75em",
    },
    // "&:hover::-webkit-scrollbar": {
    //     width: "1.0em",
    // },
    "&::-webkit-scrollbar-track": {
      "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#506187",
      borderRadius: 5,
    },
  },
  nested: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
  disabledLayerTitle: {
    "& span": { color: "rgb(127, 149, 199) !important" },
  },
  boxtext: {
    textAlign: "center",
    margin: "auto",
  },
  imageBox: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    backgroundColor: "#263451",
    // backgroundColor: "red",

    "& :nth-child(1)": {
      float: "left",
      display: "grid",
    },
    "& :nth-child(2)": {
      float: "left",
      display: "grid",
    },
    "& :nth-child(3)": {
      display: "grid",
    },
    "& :nth-child(4)": {
      float: "left",
      display: "grid",
    },
    "& :nth-child(5)": {
      display: "grid",
      float: "left",
    },
  },
  fileTree: {
    // for layer panel
    backgroundColor: "#0e111a",
    overflow: "auto",
    height: "calc(100vh - 103px)",
    maxheight: "calc(100vh - 167px)",
    paddingTop: 10,
    paddingBottom: 10,

    "&::-webkit-scrollbar": {
      width: "0.75em",
    },
    "&::-webkit-scrollbar-track": {
      "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#506187",
      borderRadius: 5,
    },
  },
  toolbarActions: {
    display: "flex",
    alignItems: "left",
    marginTop: "-7px",
    transition: theme.transitions.create("width"),
  },
  action: {
    width: "28px",
    color: "rgba(121, 121, 121, 0.85)",
    "&:hover": {
      color: "#fff",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    marginTop: 0,
    width: "100%",
    color: "white",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
    "& .MuiInputBase-root": { width: "93% !important" },
  },
  iconSearch: {
    height: "100%",
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(121, 121, 121, 0.85)",
    zIndex: 1,
    "&:hover": {
      color: "#fff",
      cursor: "pointer",
    },
  },
  iconClear: {
    color: "rgba(121, 121, 121, 0.85)",
    zIndex: 1,
    "&:hover": {
      color: "#fff",
      cursor: "pointer",
    },
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "25ch",
      height: "2ch",
    },
  },
}));

export const StyledMenu = withStyles({})((props) => <Paper elevation={0} variant="elevation" {...props} />);

export const Dropdown = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    display: "flex",
    fontWeight: "light",
    justifyContent: "space-between",
    color: "#404040",
    background: "white",
    flex: "1",
    "&:hover": {
      background: "white",
    },
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
    "& .MuiButton-textPrimary": {
      color: theme.palette.common.white,
      background: "white",
      padding: "3px 15px",
      paddingLeft: "5rem",
    },
  },
}))(Select);

export const StyledMenuHeaderItem = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    display: "flex",
    justifyContent: "space-between",

    "&:hover": {
      background: "#0e111a",
    },
    // backgroundColor: "#263451",
    // backgroundColor: "#0e111a",

    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
    "& .MuiButton-textPrimary": {
      color: theme.palette.common.white,
      background: "#17acdd",
      padding: "10px 8px 8px 0px",
    },
    "& .MuiListItemText-primary": {
      fontSize: "x-large",
    },
  },
}))(MenuItem);

export const StyledMenuHActionHeader = withStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "#0e111a !important",
    minHeight: "53px !important",
    "&>.MuiTouchRipple-root": {
      "&>:nth-child(0)": {
        borderBottom: "5px solid white",
        marginBottom: "6px",
      },
    },
    "& .MuiTouchRipple-root": {
      borderBottom: "5px solid white",
      marginBottom: "6px",
    },
    "& .MuiTabs-root": {
      "& .MuiTabs-scroller": {
        "& .MuiTabs-flexContainer": {
          width: "150px",
          "& .MuiButtonBase-root": {
            minWidth: "0px !important",
          },
          "& .MuiTab-textColorPrimary": {
            color: "white",
          },
        },
      },
      "& .MuiTabs-indicator": {
        marginLeft: "6px",
        height: "5px",
        width: "25px !important",
        backgroundColor: "#1CB6DA",
        zIndex: 1,
      },
    },
  },
}))(MenuItem);

export const StyledMenuItem = withStyles((theme) => ({
  // outdoors, satellite, dark, light, etc. list item background
  root: {
    fontFamily: "Poppins",
    display: "block",
    color: "white",
    "&:hover": {
      background: "#4B618F",
    },

    backgroundColor: "#0e111a",
    // backgroundColor: "red",

    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
  },
}))(MenuItem);

export const StyledListItemSecondaryAction = withStyles((theme) => ({
  // this is the layer "manager" button styling

  root: {
    "& .MuiButton-textPrimary": {
      color: theme.palette.common.white,
      background: "#17acdd",
      padding: "3px 10px",
    },
    "& .MuiButton-root": {
      border: "1px solid",
      width: "115px",
    },
  },
}))(ListItemSecondaryAction);

export const StyledListItem2 = withStyles((theme) => ({
  // this is the "Base Map Layers header"

  root: {
    fontFamily: "Poppins",
    "&:hover": {
      background: "#a3b2cf",
    },
    // backgroundColor: "#4B618F",
    backgroundColor: "#0e111a",

    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
  },
}))(ListItem);
