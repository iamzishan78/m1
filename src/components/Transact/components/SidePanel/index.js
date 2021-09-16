import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { get } from "lodash";
import moment from "moment";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import { ContextProvider } from "react-sortly";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Drawer, Typography, Grid, Tooltip, IconButton, InputBase, Dialog } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircleOutline";
import { makeStyles } from "@material-ui/core/styles";
import { UPDATE_PIPELINES_POSITIONS } from "graphQL/useMutationUpdatePipelinesPositions";
import { UPDATEPIPELINES } from "graphQL/useMutationUpdatePipelines";
import { DUPLICATE_PIPELINES } from "graphQL/useMutationDuplicatePipelines";
import { CREATE_PIPELINE_DESCRIPTORS } from "graphQL/useMutationPipelineDescriptors";
import { setFlowState, showWarningMessage } from "actions";
import PipelinesList from "components/Transact/components/SidePanel/PipelinesList";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { DEALSCOUNTINAPIPE } from "graphQL/useQueryNonDeletedDealsCountInAPipeline";
import { AppContext } from "AppContext";
import { TransactContext } from "components/Transact/TransactContext";

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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    justifyContent: "flex-end",
    padding: "0px 16px",
    color: "#fff",
    borderBottom: "1px solid rgba(84, 83, 83, 0.85)",
  },
  toolbarHeader: {
    display: "flow-root",
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
    marginTop: 5,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
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

const SidePanel = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { selectedPipe, pipelines } = useSelector(({ Flow }) => Flow);
  const [selectedPipelines, setMultiSelection] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchActive, setSearchState] = useState(false);
  const [filteredPipelines, setPipelines] = useState([]);
  const [deleteDialogOpen, setModal] = useState(false);

  const [stateApp] = useContext(AppContext);
  const [, setStateTransact] = useContext(TransactContext);
  const [updatePipelines] = useMutation(UPDATEPIPELINES);
  const [duplicatePipelines] = useMutation(DUPLICATE_PIPELINES);
  const [updatePipelinesPositions] = useMutation(UPDATE_PIPELINES_POSITIONS);
  const [createPipelineDescriptors] = useMutation(CREATE_PIPELINE_DESCRIPTORS);
  const [getDealsCountByPipeline, { data: dataDealsCountByPipeline }] = useLazyQuery(DEALSCOUNTINAPIPE, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    setPipelines(mapFLowlinesToProject(pipelines));
  }, [pipelines]);

  useEffect(() => {
    if (dataDealsCountByPipeline?.nonDeletedDealsCountInAPipeline) {
      if (dataDealsCountByPipeline.nonDeletedDealsCountInAPipeline.dealsCount > 0)
        dispatch(showWarningMessage("There are deals associated to the pipelines, please remove them first."));
      else setModal(true);
    }
  }, [dataDealsCountByPipeline]);

  const mapFLowlinesToProject = (pipelines) => {
    let projectIncludedPipelines = [],
      projects = {},
      projectsList = [];
    pipelines.forEach((pipe) => {
      if (pipe.projectId && !projects[pipe.projectId]) {
        projects[pipe.projectId] = true;
        projectsList.push({ projectName: pipe.projectName, projectId: pipe.projectId });
        projectIncludedPipelines.push({
          projectName: pipe.projectName,
          projectId: pipe.projectId,
          type: "Project",
          index: pipe.projectId,
          depth: 0,
          id: pipe.projectId,
          collapsed: true,
          position: pipe.position,
        });
        const projectPipelines = pipelines
          .filter((p) => p.projectId === pipe.projectId)
          .map((p) => ({
            ...p,
            id: p._id,
            type: "Pipeline",
            depth: 1,
            index: p._id,
            collapsed: true,
          }));
        projectIncludedPipelines = projectIncludedPipelines.concat(projectPipelines);
      } else if (!pipe.projectId) {
        projectIncludedPipelines.push({
          ...pipe,
          id: pipe._id,
          type: "Pipeline",
          depth: 0,
          index: pipe._id,
          collapsed: true,
        });
      }
    });
    setStateTransact((stateTransact) => ({ ...stateTransact, projects: projectsList }));
    return projectIncludedPipelines;
  };

  const flowlineActions = React.useMemo(() => {
    let isProjectPipelineSelected = false;
    for (let i = 0; i < selectedPipelines.length; i += 1) {
      isProjectPipelineSelected = !!filteredPipelines.find((p) => p.id === selectedPipelines[i] && p.projectId);
      if (isProjectPipelineSelected) break;
    }
    return [
      {
        title: "Add Flowline",
        icon: <AddBoxIcon fontSize="small" />,
      },
      {
        title: !isProjectPipelineSelected ? "Project Group" : "Remove Pipeline From Group",
        icon: !isProjectPipelineSelected ? <CreateNewFolderIcon fontSize="small" /> : <RemoveCircleIcon fontSize="small" />,
      },
      {
        title: "Duplicate",
        icon: <FileCopyIcon fontSize="small" />,
      },
      {
        title: "Delete Flowline(s)",
        icon: <DeleteIcon fontSize="small" />,
      },
    ];
  }, [selectedPipelines]);

  const filterSearch = (value) => {
    const newPipelines = pipelines.filter((pipeline) => pipeline.name?.toLowerCase()?.includes(value.toLowerCase()));
    setPipelines(mapFLowlinesToProject(newPipelines));
    setSearchValue(value);
  };

  const handleAction = (action) => {
    switch (action) {
      case "Add Flowline":
        dispatch(setFlowState({ openPipeDialog: "newPipe" }));
        break;
      case "Project Group":
        createPipelineDescriptors({
          variables: {
            descriptor: {
              projectName: `Project ${moment().format("MM/DD/YYYY HH:m")}`,
              pipelines: selectedPipelines,
              userId: stateApp.user.mongoId,
            },
          },
          refetchQueries: ["getPipelines"],
          awaitRefetchQueries: true,
        });
        break;
      case "Remove Pipeline From Group":
        let pipelines = [];
        pipelines = filteredPipelines
          .filter((pipe) => selectedPipelines.includes(pipe._id) && pipe.projectId)
          .map((pipe, index) => ({ ...pipe, position: index, switchType: "deleteDescriptor" }));
        pipelines = pipelines.concat(
          filteredPipelines
            .filter((pipe) => !selectedPipelines.includes(pipe._id) && pipe.depth === 0)
            .map((pipe, index) => ({ ...pipe, position: index + pipelines.length }))
        );
        updatePipelinesPositions({
          variables: {
            data: pipelines,
            userId: stateApp.user.mongoId,
          },
          refetchQueries: ["getPipelines"],
        });
        break;
      case "Delete Flowline(s)":
        getDealsCountByPipeline({
          variables: {
            pipelinesIds: selectedPipelines,
          },
        });
        break;
      case "Duplicate":
        const pipelinesToDuplicate = selectedPipelines.map((pipe) => ({
          ...pipe,
          _id: pipe,
          name: filteredPipelines.find((p) => p._id === pipe).name,
        }));
        duplicatePipelines({
          variables: {
            pipelines: pipelinesToDuplicate,
            userId: stateApp.user.mongoId,
          },
          refetchQueries: ["getPipelines"],
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
      <Drawer variant="permanent" className={classes.drawer} classes={{ paper: classes.drawer }} open={true}>
        <div className={classes.toolbar}>
          <div className={classes.toolbarHeader}>
            <Typography varient="h4" component="h4" style={{ float: "left", marginTop: "10px" }}>
              Flowlines
            </Typography>
            <Typography
              variant="caption"
              display="block"
              style={{
                float: "right",
                color: "rgba(121, 121, 121, 0.85)",
                marginTop: "15px",
              }}
            >
              {get(pipelines, "length", 0)} Flowlines
            </Typography>
          </div>
          <Grid container direction="row" justify="space-between" alignItems="center" className={classes.toolbarActions}>
            <Grid item>
              {!isSearchActive &&
                flowlineActions.map((action, index) => (
                  <Tooltip title={action.title} className={classes.action} onClick={() => handleAction(action.title)}>
                    <IconButton>{action.icon}</IconButton>
                  </Tooltip>
                ))}
            </Grid>
            <Grid item>
              <div className={classes.search}>
                <Tooltip title="Search" className={classes.iconSearch} onClick={() => document.getElementById("searchInput").focus()}>
                  <SearchIcon />
                </Tooltip>
                <InputBase
                  id="searchInput"
                  placeholder="Search by flowline name"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                  onFocus={() => setSearchState(true)}
                  value={searchValue}
                  onBlur={() =>
                    setTimeout(() => {
                      setSearchState(false);
                      filterSearch("");
                    }, 200)
                  }
                  onChange={(evt) => filterSearch(evt.target.value)}
                />
              </div>
            </Grid>
          </Grid>
        </div>
        <DndProvider backend={dnd}>
          <ContextProvider>
            <PipelinesList
              selectedPipe={selectedPipe}
              filteredPipelines={filteredPipelines}
              selectedPipelines={selectedPipelines}
              setMultiSelection={setMultiSelection}
              userId={stateApp.user.mongoId}
            />
          </ContextProvider>
        </DndProvider>

        <div className={classes.footer}>
          <Tooltip title="Add Flowline" onClick={() => handleAction("Add Flowline")}>
            <IconButton className={classes.footerAction}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Drawer>
      <Dialog className={classes.dialog} open={deleteDialogOpen} onClose={() => setModal(false)} fullWidth={false} maxWidth="sm">
        <DeleteConfirmationDialogContent
          header={selectedPipelines.length > 1 ? `Delete Flowline` : `Delete Flowlines`}
          onClose={() => setModal(false)}
          deleteFunc={handleDelete}
          m1nSelectedRowsIds={null}
          setM1nSelectedRowsIndexes={() => {}}
        >
          {selectedPipelines.length > 1
            ? "Are you sure you want to delete the selected flowlines?"
            : "Are you sure you want to delete the selected flowline?"}
        </DeleteConfirmationDialogContent>
      </Dialog>
    </>
  );
};

export default SidePanel;
