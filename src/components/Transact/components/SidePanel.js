import React from "react";
import { useSelector } from "react-redux";
import { get } from "lodash";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, fade } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  drawer: {
    width: 315,
    top: "auto",
    backgroundColor: "#040e24",
  },
  toolbar: {
    display: "block",
    alignItems: "center",
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    justifyContent: "flex-end",
    padding: "0 8px",
    color: "#fff",
    borderBottom: "1px solid rgba(84, 83, 83, 0.85)"
  },
  toolbarHeader: {
    display: "flow-root",
  },
  toolbarActions: {
    display: "flex",
    alignItems: "left",
    marginTop: 5,
  },
  action: {
    paddingRight: 5,
    paddingLeft: 0,
    color: "rgba(121, 121, 121, 0.85)",
    "&:hover": {
      color: "#fff"
    }
  },
  flowlinesList: {
    margin: "5px 5px 10px 5px"
  },
  listItem: {
    color: "#fff",
    backgroundColor: "#0c2150",
    margin: "5px 10px 0px 6px",
    borderRadius: "5px",
    width: "95% !important",
    "&:hover": {
      backgroundColor: "#506187"
    },
    "&:active": {
      backgroundColor: "#0f1f43"
    }
  },
  listItemIcon: {
    color: "#fff",
    float: "right"
  },
  search: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "transparent",
    width: '100%',
    float: "right",
    height: "40px"
  },
  searchIcon: {
    float: "right",
    margin: 10,
    color: "rgba(121, 121, 121, 0.85)",
    '&:hover': {
      color: "#fff",
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '0ch',
      '&:focus': {
        width: '20ch',
      },
    },
  }
}));

const SidePanel = ({ }) => {
  const classes = useStyles();
  const { openPipeDialog, selectedPipe, pipelines, pipeToShow } = useSelector(
    ({ Flow }) => Flow
  );

  const flowlineActions = React.useMemo(
    () => [
      {
        title: "Add Flowline",
        icon: <AddBoxIcon fontSize="small" />,
      },
      {
        title: "Add New Project",
        icon: <CreateNewFolderIcon fontSize="small" />,
      },
      {
        title: "",
        icon: <CloudDownloadIcon fontSize="small" />,
      },
      {
        title: "Delete Flowline(s)",
        icon: <DeleteIcon fontSize="small" />,
      },
    ],
    []
  );

  return (
    <>
      <Drawer
        variant="permanent"
        className={classes.drawer}
        classes={{ paper: classes.drawer }}
        open={true}
      >
        <div className={classes.toolbar}>
          <div className={classes.toolbarHeader}>
            <Typography varient="h4" component="h4" style={{ float: "left" }}>
              Flowlines
            </Typography>
            <Typography
              variant="caption"
              display="block"
              style={{ float: "right", color: "rgba(121, 121, 121, 0.85)" }}
            >
              {get(pipelines, "length", 0)} Flowlines
            </Typography>
          </div>
          <div className={classes.toolbarActions}>
            {flowlineActions.map((action, index) => (
              <Tooltip title={action.title} className={classes.action}>
                <IconButton>{action.icon}</IconButton>
              </Tooltip>
            ))}
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              {/* <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            /> */}
            </div>
          </div>
        </div>
        <List className={classes.flowlinesList}>
          {pipelines.map((pipeline, index) => (
            <ListItem button key={index} className={classes.listItem}>
              <ListItemText primary={get(pipeline, 'name', pipeline)} />
              <MenuIcon />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default SidePanel;
