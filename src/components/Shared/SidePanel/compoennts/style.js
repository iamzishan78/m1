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
        marginTop: "38px",
        background: "#011133",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& svg": {
            transform: "scaleX(0.5)",
        },
    },
    subHeaderItem: {
        backgroundColor: "#011133 !important",
        opacity: "0.94", 
        minWidth: "400px",
    },

    // this is for basemap panel
    list: {
        padding: 0,
        minWidth: "425px",
        overflowY: "auto",
        height: 'calc(100vh - 506px - 64px)',
        // maxHeight: 'calc(100vh - 40px - 64px)',
        backgroundColor: "#263451",
        "&::-webkit-scrollbar": {
            width: "0.75em",
        },
        "&:hover::-webkit-scrollbar": {
            width: "1.0em",
        },
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
        height: 'calc(100vh - 40px - 64px)',
        maxHeight: 'calc(100vh - 40px - 64px)',
        backgroundColor: "#263451",
        "&::-webkit-scrollbar": {
            width: "1em",
        },
        "&:hover::-webkit-scrollbar": {
            width: "1.0em",
        },
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
        "& :nth-child(1)": {
            "float": "left",
            display: "grid",
        },
        "& :nth-child(2)": {
            "float": "left",
            display: "grid",
        },
        "& :nth-child(3)": {
            display: "grid",
        },
        "& :nth-child(4)": {
            "float": "left",
            display: "grid",
        },
        "& :nth-child(5)": {
            display: "grid",
            "float": "left",
        },
    },
    fileTree: {
        backgroundColor: "#263451",
        overflow: "auto",
        height: 'calc(100vh - 40px - 64px)',
        maxheight: 'calc(100vh - 40px - 64px)',
        paddingTop: 10,
        paddingBottom: 10,

        "&::-webkit-scrollbar": {
            width: "0.75em",
        },
        "&:hover::-webkit-scrollbar": {
            width: "0.75em",
        },
        "&::-webkit-scrollbar-track": {
            "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#506187",
            borderRadius: 5,
        },
    }
}));


export const StyledMenu = withStyles({
})((props) => (
    <Paper
        elevation={0}
        variant="elevation"
        {...props}
    />
));



export const MarketplaceDropdown = withStyles((theme) => ({
    icon: {
        color: "white",
        fill: "white",
    },
    root: {
        fontFamily: "Poppins",
        display: "flex",
        fontWeight: "light",
        justifyContent: "space-between",
        color: "white",
        minWidth: "8rem",
        // "&:hover": {
        // 	background: "#4B618F",
        // },
        // backgroundColor: "#263451",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: theme.palette.common.white,
        },
        "& .MuiButton-textPrimary": {
            color: theme.palette.common.white,
            background: "#17acdd",
            padding: "3px 10px",
        },
    },
}))(Select);

export const Dropdown = withStyles((theme) => ({
    root: {
        fontFamily: "Poppins",
        display: "flex",
        fontWeight: "light",
        justifyContent: "space-between",
        color: "#404040",
        //minWidth: "13.5rem",
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

export const MarketPlaceMenu = withStyles((theme) => ({
    root: {
        fontFamily: "Poppins",
        display: "flex",
        justifyContent: "space-between",
        "&:hover": {
            background: "#263451",
        },
        backgroundColor: "#263451",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: theme.palette.common.white,
        },
        "& .MuiButton-textPrimary": {
            color: theme.palette.common.white,
            background: "#17acdd",
            padding: "10px 10px",
            paddingTop: "10px",
            paddingBottom: "10px",
        },
    },
}))(MenuItem);

export const StyledMenuHeaderItem = withStyles((theme) => ({
    root: {
        fontFamily: "Poppins",
        display: "flex",
        justifyContent: "space-between",
        "&:hover": {
            background: "#4B618F",
        },
        backgroundColor: "#263451",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: theme.palette.common.white,
        },
        "& .MuiButton-textPrimary": {
            color: theme.palette.common.white,
            background: "#17acdd",
            padding: "3px 10px",
        },
    },
}))(MenuItem);

export const StyledMenuItem = withStyles((theme) => ({
    root: {
        fontFamily: "Poppins",
        display: "block",
        color: "white",
        "&:hover": {
            background: "#4B618F",
        },

        backgroundColor: "#263451",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: theme.palette.common.white,
            // },
        },
    },
}))(MenuItem);

export const StyledListItemSecondaryAction = withStyles((theme) => ({
    root: {
        "& .MuiButton-textPrimary": {
            color: theme.palette.common.white,
            background: "#17acdd",
            padding: "3px 10px",
        },
    },
}))(ListItemSecondaryAction);

export const MarketPlaceListItem = withStyles((theme) => ({
    root: {
        fontFamily: "Poppins",
        // "&:hover": {
        // 	background: "#cccccc",
        // },
        display: "flex",

        alignItems: "center",
        marginBottom: "0.4rem",
        color: "black",
        border: "1px solid grey",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: theme.palette.common.white,
        },
        "& .MuiListItemText-primary svg": {
            marginLeft: "5px",
            verticalAlign: "middle",
        },
    },
}))(ListItem);

export const MarketPlaceUpper = withStyles((theme) => ({
    root: {
        fontFamily: "Poppins",
        // "&:hover": {
        // 	background: "#cccccc",
        // },
        color: "black",

        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: theme.palette.common.white,
        },
        "& .MuiListItemText-primary svg": {
            marginLeft: "5px",
            verticalAlign: "middle",
        },
    },
}))(ListItem);

export const MarketPlaceLower = withStyles((theme) => ({
    root: {
        fontFamily: "Poppins",
        // "&:hover": {
        // 	background: "#cccccc",
        // },
        color: "black",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: theme.palette.common.white,
        },
        "& .MuiListItemText-primary svg": {
            marginLeft: "5px",
            verticalAlign: "middle",
        },
    },
}))(ListItem);

export const MarketPlaceLowerItems = withStyles((theme) => ({
    root: {
        fontFamily: "Poppins",
        // "&:hover": {
        // 	background: "#cccccc",
        // },
        color: "black",
        whiteSpace: "nowrap",
        marginRight: "2rem",
        backgroundColor: "white",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        // textAlign: "center",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: theme.palette.common.white,
        },
        "& .MuiListItemText-primary svg": {
            //marginLeft: "5px",
            verticalAlign: "middle",
        },
    },
}))(ListItem);

export const StyledListItem2 = withStyles((theme) => ({
    root: {
        fontFamily: "Poppins",
        "&:hover": {
            background: "#a3b2cf",
        },
        backgroundColor: "#4B618F",
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
            color: theme.palette.common.white,
        },
    },
}))(ListItem);