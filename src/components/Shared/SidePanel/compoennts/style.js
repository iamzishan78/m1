import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItem from "@material-ui/core/ListItem";
import Select from "@material-ui/core/Select";
import { createTheme } from "@material-ui/core/styles";
import { scrollbarStyle } from "styles/common";

export const theme = createTheme({
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
    backgroundColor: "#0e111a !important",
    minWidth: "400px",
    height: "50px",
  },

  // this is for basemap panel
  list: {
    padding: 0,
    minWidth: "425px",
    overflowY: "auto",
    backgroundColor: "#0e111a",
  },
  itemOne: {
    "&.MuiDivider-root": {
      "&::before": {
        borderTop: "thin solid green",
      },
      "&::after": {
        borderTop: "thin solid blue",
      },
    },
    "& .MuiDivider-wrapper": {
      fontSize: 16,
    },
  },
  mapPositionSection: {
    minWidth: "425px",
    color: "white",
    backgroundColor: "#0e111a",
    padding: "10px 20px",
    minHeight: "230px",
    "& .MuiFormControl-root": {
      width: "100%",
    },
    "& label": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& label.Mui-disabled": {
      color: "#adadad",
    },
    "& input": {
      color: "white !important",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
  panelContent: {
    // height: "calc(100vh - 446px)",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#0e111a",
  },
  totalHitMap: {
    backgroundColor: "#18AADD",
    color: "#FFFFFF",
    height: '1.3rem',
    width: '1.3rem',

    position: 'absolute',
    left: '57px',
    top: '1px',
    zIndex: '1',
    textAlign: 'center',
    "& span": {
      padding: '0px'
    }
  },

  heatmapList: {
    padding: 0,
    minWidth: "425px",
    overflowY: "auto",
    height: "calc(100vh - 50px - 122px)",
    maxHeight: "calc(100vh - 40px - 64px)",
    backgroundColor: "#0e111a",
    ...scrollbarStyle
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
    height: "calc(100vh - 499px)",
    maxheight: "calc(100vh - 172px)",
    paddingTop: 10,
    paddingBottom: 30,
    ...scrollbarStyle
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
  totalFilter: {
    backgroundColor: "#18AADD",
    color: "#FFFFFF",
    height: '1.3rem',
    width: '1.3rem',
    marginLeft: '-15px',
    position: 'relative',
    zIndex: '1',
    textAlign: 'center',
    "& span": {
      padding: '0px'
    }
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
    padding: "32px 23px",
    "&:hover": {
      background: "#0e111a",
    },
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

export const StyledMenuSecondaryHeaderItem = withStyles((theme) => ({
  root: {
    fontFamily: "Poppins",
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#0e111a !important",
    padding: "10px 22px",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
    "& .MuiButton-textPrimary": {
      color: theme.palette.common.white,
      background: "#17acdd",
      padding: "10px 8px 8px 0px",
    },
    "& .MuiListItemText-primary": {
      fontSize: "large",
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
      borderBottom: "5px solid #263451",
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
    right: "16px !important",
    "& .MuiButton-textPrimary": {
      color: theme.palette.common.white,
      background: "#17acdd",
      padding: "3px 10px",
    },
    "& .MuiButton-root": {
      border: "1px solid",
      // width: "129px",
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
