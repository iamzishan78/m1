import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { get } from "lodash";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import { ContextProvider } from "react-sortly";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  Drawer,
  Typography,
  Grid,
  Tooltip,
  IconButton,
  InputBase,
  Dialog,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { UPDATEPIPELINES } from "graphQL/useMutationUpdatePipelines";
import { DUPLICATE_PIPELINES } from "graphQL/useMutationDuplicatePipelines";
import { setFlowState, showWarningMessage } from "actions";
import PipelinePopup from "components/Transact/components/PipelinePopup";
import PipelinesList from "components/Transact/components/SidePanel/PipelinesList";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { DEALSCOUNTINAPIPE } from "graphQL/useQueryNonDeletedDealsCountInAPipeline";
import { AppContext } from "AppContext";

const dnd = isMobile ? TouchBackend : HTML5Backend;
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
    marginTop: 5,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },
  searchIcon: {
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(121, 121, 121, 0.85)",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",

    [theme.breakpoints.up("sm")]: {
      width: "0ch",
      "&:focus": {
        width: "25ch",
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
  const { selectedPipe, pipelines } = useSelector(({ Flow }) => Flow);
  const [selectedPipelines, setMultiSelection] = useState([]);
  const [isSearchActive, setSearchState] = useState(false);
  const [filteredPipelines, setPipelines] = useState(pipelines);
  const [deleteDialogOpen, setModal] = useState(false);

  const [stateApp, setStateApp] = useContext(AppContext);
  const [updatePipelines] = useMutation(UPDATEPIPELINES);
  const [duplicatePipelines] = useMutation(DUPLICATE_PIPELINES)
  const [getDealsCountByPipeline, { data: dataDealsCountByPipeline }] =
    useLazyQuery(DEALSCOUNTINAPIPE, {
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    setPipelines(pipelines);
  }, [pipelines]);

  useEffect(() => {
    if (dataDealsCountByPipeline?.nonDeletedDealsCountInAPipeline) {
      // setStateApp((state) => ({
      //   ...state,
      //   uniuniversalCircularLoaderAct: false,
      // }));
      if (dataDealsCountByPipeline.nonDeletedDealsCountInAPipeline.dealsCount > 0)
        dispatch(
          showWarningMessage(
            "There are deals associated to the pipelines, please remove them first."
          )
        );
      else setModal(true);
    }
  }, [dataDealsCountByPipeline]);

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

  const filterSearch = (value) => {
    const newPipelines = pipelines.filter((pipeline) =>
      pipeline.name?.toLowerCase()?.includes(value.toLowerCase())
    );
    setPipelines(newPipelines);
  };

  const handleAction = (action) => {
    switch (action) {
      case "Add Flowline":
        dispatch(setFlowState({ openPipeDialog: "newPipe" }));
        break;
      case "Delete Flowline(s)":
        getDealsCountByPipeline({
          variables: {
            pipelinesIds: selectedPipelines,
          },
        });
        break;
      case "Duplicate":
        duplicatePipelines({
          variables: {
            pipelines: selectedPipelines.map((pipe) => ({
              _id: pipe,
              name: pipelines.find(p => p._id === pipe).name
            })),
            userId: stateApp.user.mongoId
          },
          refetchQueries: ["getPipelines"],
          awaitRefetchQueries: true,
        });
        break;
      default:
    }
  };

  const handleDelete = () => {
    updatePipelines({
      variables: {
        pipelines: selectedPipelines.map((pipe) => ({
          _id: pipe,
          IsDeleted: true,
        })),
      },
      refetchQueries: ["getPipelines"],
      awaitRefetchQueries: true,
    });
    setMultiSelection([]);
    setModal(false);
  };

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
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                {!isSearchActive &&
                  flowlineActions.map((action, index) => (
                    <Tooltip
                      title={action.title}
                      className={classes.action}
                      onClick={() => handleAction(action.title)}
                    >
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
                      inputProps={{ "aria-label": "search" }}
                      onFocus={() => setSearchState(true)}
                      onBlur={() =>
                        setTimeout(() => {
                          setSearchState(false);
                        }, 200)
                      }
                      onChange={(evt) => filterSearch(evt.target.value)}
                    />
                  </div>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        </div>
        <DndProvider backend={dnd}>
          <ContextProvider>
            <PipelinesList
              selectedPipe={selectedPipe}
              filteredPipelines={filteredPipelines}
              selectedPipelines={selectedPipelines}
              setMultiSelection={setMultiSelection}
            />
          </ContextProvider>
        </DndProvider>

        <div className={classes.footer}>
          <Tooltip
            title="Add Flowline"
            onClick={() => handleAction("Add Flowline")}
          >
            <IconButton className={classes.footerAction}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Drawer>

      {/**
       * Pipeline Popup for New Pipeline or Edit Pipeline
       */}
      <PipelinePopup />
      <Dialog
        className={classes.dialog}
        open={deleteDialogOpen}
        onClose={() => setModal(false)}
        fullWidth={false}
        maxWidth="sm"
      >
        <DeleteConfirmationDialogContent
          header={
            selectedPipelines.length > 1
              ? `Delete Flowline`
              : `Delete Flowlines`
          }
          onClose={() => setModal(false)}
          deleteFunc={handleDelete}
          m1nSelectedRowsIds={null}
          setM1nSelectedRowsIndexes={() => { }}
        >
          {selectedPipelines.length > 1
            ? "Are you sure you want to delete the Flowline?"
            : "Are you sure you want to delete the Flowlines?"}
        </DeleteConfirmationDialogContent>
      </Dialog>
    </>
  );
};

export default SidePanel;
