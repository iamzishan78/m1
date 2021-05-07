import React, { useEffect, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from "react-redux";
import { get } from "lodash";
import {
  Drawer,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton,
  InputBase,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles, fade } from "@material-ui/core/styles";
import { setFlowState } from "actions";

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
    borderBottom: "1px solid rgba(84, 83, 83, 0.85)",
    maxHeight: "8%",
  },
  toolbarHeader: {
    display: "flow-root",
  },
  toolbarActions: {
    display: "flex",
    alignItems: "left",
    marginTop: 5,
    transition: theme.transitions.create('width'),
  },
  action: {
    width: "28px",
    color: "rgba(121, 121, 121, 0.85)",
    "&:hover": {
      color: "#fff",
    },
  },
  flowlinesList: {
    margin: "5px 5px 10px 5px",
    overflowY: "auto",
    maxHeight: "75%",
    '&::-webkit-scrollbar': {
      width: '0.4em'
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: "#506187",
      borderRadius: 5
    }
  },
  listItem: {
    color: "#fff",
    backgroundColor: "#0c2150",
    margin: "5px 10px 0px 6px",
    borderRadius: "5px",
    width: "95% !important",
    "&:hover": {
      backgroundColor: "#506187",
    }
  },
  listItemIcon: {
    color: "#fff",
    float: "right",
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    marginTop: 5,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  searchIcon: {
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: "rgba(121, 121, 121, 0.85)"
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      width: '0ch',
      '&:focus': {
        width: '25ch',
        height: "2ch",
      },
    },
  },
  footer: {
    position: "absolute",
    display: "flex",
    bottom: "80px",
    width: "100%",
  },
  footerAction: {
    width: "90%",
    border: "2px solid rgba(121, 121, 121, 0.85)",
    borderRadius: "5px",
    color: "rgba(121, 121, 121, 0.85)",
    margin: "auto",
    "&:hover": {
      backgroundColor: "#fff",
      color: "#040e24",
      transition: "all 0.3s linear",
    },
  },
}));

const SidePanel = ({ }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { openPipeDialog, selectedPipe, pipelines, pipeToShow } = useSelector(
    ({ Flow }) => Flow
  );
  const [isSearchActive, setSearchState] = useState(false);
  const [filteredPipelines, setPipelines] = useState(pipelines);

  useEffect(() => {
    setPipelines(pipelines);
  }, [pipelines]);

  const flowlineActions = React.useMemo(
    () => [
      {
        title: "Add Flowline",
        icon: <AddBoxIcon fontSize="small" />,
      },
      {
        title: "Project Group",
        icon: <CreateNewFolderIcon fontSize="small" />,
      },
      {
        title: "Duplicate",
        icon: <FileCopyIcon fontSize="small" />,
      },
      {
        title: "Delete Flowline(s)",
        icon: <DeleteIcon fontSize="small" />,
      },
    ],
    []
  );

  const onFlowlineSelect = (newPipeline) => {
    if (selectedPipe._id !== newPipeline._id) {
      dispatch(
        setFlowState({
          selectedPipe: newPipeline,
          pipeToShow: null,
        })
      );
    }
  };

  const filterSearch = (value) => {
    const newPipelines = pipelines.filter(pipeline => pipeline.name?.toLowerCase()?.includes(value.toLowerCase()));
    setPipelines(newPipelines);
  }

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
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item>
                {!isSearchActive && flowlineActions.map((action, index) => (
                  <Tooltip title={action.title} className={classes.action}>
                    <IconButton>{action.icon}</IconButton>
                  </Tooltip>
                ))}
              </Grid>
              <Grid item>
                <Tooltip title="Search">
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search by flowline name"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      inputProps={{ 'aria-label': 'search' }}
                      onFocus={() => setSearchState(true)}
                      onBlur={() => setTimeout(() => { setSearchState(false) }, 200)}
                      onChange={evt => filterSearch(evt.target.value)}
                    />
                  </div>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        </div>
        <List className={classes.flowlinesList}>
          {filteredPipelines.map((pipeline, index) => (
            <ListItem
              button
              key={index}
              className={classes.listItem}
              style={{
                backgroundColor: `${selectedPipe?._id === pipeline._id ? "#506187" : ""
                  }`,
              }}
            >
              <ListItemText primary={get(pipeline, "name", pipeline)} />
              <MenuIcon onClick={() => onFlowlineSelect(pipeline)} />
            </ListItem>
          ))}
        </List>
        <div className={classes.footer}>
          <IconButton className={classes.footerAction}>
            <AddIcon />
          </IconButton>
        </div>
      </Drawer>
    </>
  );
};

export default SidePanel;
