import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";

//icons 
import IconButton from "@material-ui/core/IconButton";

import Dialog from "@material-ui/core/Dialog";
import { setFlowState, showErrorMessage, showSuccessMessage, showWarningMessage } from "../../../actions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import DragIndicator from "@material-ui/icons/DragIndicator";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RootRef from "@material-ui/core/RootRef";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { Tooltip } from "@material-ui/core";
import { GETPIPELINE } from "../../../graphQL/useQueryPipeline";
import { GETPIPELINES } from "graphQL/useQueryPipelines";
import { ADD_PIPELINE } from "../../../graphQL/useMutationAddPipeline";
import { UPDATEPIPELINES } from "../../../graphQL/useMutationUpdatePipelines";
import { ADDSTAGES } from "../../../graphQL/useMutationAddStages";
import { UPDATESTAGES } from "../../../graphQL/useMutationUpdateStages";
import { useMutation, useLazyQuery } from "@apollo/client";
import { AppContext } from "../../../AppContext";
import { deepEqualObjects } from "../../Shared/functions";
import DeleteConfirmationDialogContent from "../../Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { DEALSCOUNTINANSTAGE } from "../../../graphQL/useQueryNonDeletedDealsCountInAnStageByPipeline";
import { DEALSCOUNTINAPIPE } from "../../../graphQL/useQueryNonDeletedDealsCountInAPipeline";
import DeleteIcon from "@material-ui/icons/Delete";
import FlowLineAction from "./FlowLineAction";

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: "#011133",
    color: "#fff",
  },
  titleClose: {
    cursor: "pointer",
    float: "right",
  },
  colorAction: {
    color: "#008ebf",
    fontSize: "1.6rem",
  },
  addIconButton: {
    color: "gray",
    fontSize: "14px",
    "&:hover": {
      color: "#008ebf",
    },
  },
  removeIconButton: {
    color: "gray",
    cursor: "pointer",
    "&:hover": {
      color: "red",
    },
  },
  list: {
    padding: 0,
  },
  dialog: {
    zIndex: "9999999999 !important",
  },
  settingGroup: {
    "& .MuiTypography-body1": { fontSize: "1.2rem !important" },
  },
  settingsButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    float: "right",
  },
}));

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const reorder = (list, startPosition, endPosition) => {
  const reorderedStages = Array.from(list);
  let startIndex = reorderedStages.findIndex((layer) => layer.position == startPosition);
  let endIndex = reorderedStages.findIndex((layer) => layer.position == endPosition);

  //// switch positions between stages

  let endI = endIndex;
  while (endI > startIndex) {
    let temp = reorderedStages[endI].position;
    reorderedStages[endI] = {
      ...reorderedStages[endI],
      position: reorderedStages[endI - 1].position,
    };
    reorderedStages[endI - 1] = {
      ...reorderedStages[endI - 1],
      position: temp,
    };
    endI--;
  }
  while (endI < startIndex) {
    let temp = reorderedStages[endI].position;
    reorderedStages[endI] = {
      ...reorderedStages[endI],
      position: reorderedStages[endI + 1].position,
    };
    reorderedStages[endI + 1] = {
      ...reorderedStages[endI + 1],
      position: temp,
    };
    endI++;
  }

  //// reorder the stages
  const [removed] = reorderedStages.splice(startIndex, 1);
  reorderedStages.splice(endIndex, 0, removed);

  //// separate the stages to update
  let stagesToUpdate = reorderedStages.filter(
    (currentValue, index) =>
      (startIndex < endIndex && startIndex <= index && index <= endIndex) ||
      (startIndex > endIndex && startIndex >= index && index >= endIndex)
  );
  //   .map((stage) => ({ _id: stage._id, position: stage.position }));

  return { reorderedStages, stagesToUpdate };
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default function Pipelines(props) {
  const dispatch = useDispatch();
  let history = useHistory();
  const { openPipeDialog, selectedPipe } = useSelector(({ Flow }) => Flow);
  const [stateApp, setStateApp] = useContext(AppContext);
  const classes = useStyles();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [stages, setStages] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFunc, setDeleteFunc] = useState(null);

  const [addPipeline, { data: pipeline }] = useMutation(ADD_PIPELINE);
  const [updatePipelines] = useMutation(UPDATEPIPELINES);
  const [addStages] = useMutation(ADDSTAGES);
  const [updateStages] = useMutation(UPDATESTAGES);

  const [getPipelines, { data: pipelinesData }] = useLazyQuery(GETPIPELINES);
  const [getPipeline, { loading: loadingPipeline, data: pipelineData }] = useLazyQuery(GETPIPELINE, {
    fetchPolicy: "cache-and-network",
  });

  const [getDealsCountByStage, { data: dataDealsCountByStage }] = useLazyQuery(DEALSCOUNTINANSTAGE, {
    fetchPolicy: "network-only",
  });
  const [getDealsCountByPipeline, { data: dataDealsCountByPipeline }] = useLazyQuery(DEALSCOUNTINAPIPE, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getPipelines();
  }, []);

  useEffect(() => {
    if (pipelinesData) {
      //// select first one as default
      const pipelineId = history.location.pathname.split("/")[2]
      let laneId = ''
      let cardId = ''
      if (history.location.pathname.includes('lane')) {
        laneId = history.location.pathname.split("/")[4]
      }
      if (history.location.pathname.includes('card')) {
        cardId = history.location.pathname.split("/")[6]
      }

      if (pipelinesData.pipelines && pipelinesData.pipelines.length > 0) {
        let activePipeline = {};

        if (pipelineId) {
          activePipeline = pipelinesData.pipelines.find(
            (p) => p._id === pipelineId
          );
        }
        if (!activePipeline) {
          const isExist = !!pipelinesData.pipelines.find(
            (p) => p._id === selectedPipe?._id
          );
          if (selectedPipe && isExist) {
            activePipeline = pipelinesData.pipelines.find(
              (p) => p._id === selectedPipe._id
            );
          } else activePipeline = pipelinesData.pipelines[0];
        }
        if (laneId && cardId) {
          history.push(`/flow/${activePipeline._id}/lane/${laneId}/card/${cardId}`);
        } else {
          history.push(`/flow/${activePipeline._id}`)
        }

        dispatch(
          setFlowState({
            selectedPipe: activePipeline,
            pipelines: pipelinesData.pipelines
          })
        );
      } else
        dispatch(
          setFlowState({
            selectedPipe: null,
            pipelines: [],
            pipeToShow: false
          })
        );
    }
  }, [pipelinesData]);


  useEffect(() => {
    if (dataDealsCountByStage?.nonDeletedDealsCountInAnStageByPipeline) {
      setStateApp((state) => ({
        ...state,
        uniuniversalCircularLoaderAct: false,
      }));
      if (dataDealsCountByStage.nonDeletedDealsCountInAnStageByPipeline.dealsCount > 0)
        dispatch(showWarningMessage("There are deals associated to the stage, please remove them first."));
      else {
        // openDeleteDialog();
        deleteFunc();
      }
    }
  }, [dataDealsCountByStage]);

  useEffect(() => {
    if (pipeline)
      dispatch(
        setFlowState({
          selectedPipe: pipeline.addPipeline.pipeline,
        })
      );
  }, [pipeline]);

  useEffect(() => {
    if (dataDealsCountByPipeline?.nonDeletedDealsCountInAPipeline) {
      setStateApp((state) => ({
        ...state,
        uniuniversalCircularLoaderAct: false,
      }));
      if (dataDealsCountByPipeline.nonDeletedDealsCountInAPipeline.dealsCount > 0)
        dispatch(showWarningMessage("There are deals associated to the pipeline, please remove them first."));
      else openDeleteDialog("pipe");
    }
  }, [dataDealsCountByPipeline]);

  //// get the whole selected pipe
  useEffect(() => {
    if (selectedPipe) {
      getPipeline({ variables: { id: selectedPipe._id } });
    }
  }, [selectedPipe]);

  useEffect(() => {
    if (pipelineData) {
      if (pipelineData.pipeline) {
        let laneId = ''
        let cardId = ''
        if (history.location.pathname.includes('lane')) {
          laneId = history.location.pathname.split("/")[4]
        }
        if (history.location.pathname.includes('card')) {
          cardId = history.location.pathname.split("/")[6]
        }

        let deals = [];
        let pipe = {
          ...pipelineData.pipeline,
          lanes: pipelineData.pipeline.lanes?.map((lane) => ({
            ...lane,
            cards: lane.cards?.map((card) => {
              if (!card.metadata.IsDeleted) {
                if (lane.id === laneId && cardId === card.id) {
                  setStateApp((stateApp) => ({
                    ...stateApp,
                    transactBarView: "Deal",
                    dealDialog: true,
                    activeDeal: {
                      cardId,
                      laneId,
                      ...card.metadata
                    }
                  }));
                }
                deals.push({
                  cardId: card.id,
                  laneId: lane.id,
                  laneName: lane.title,
                  pipeline: pipelineData.pipeline._id,
                  pipelineName: pipelineData.pipeline.name,
                  ownerName:
                    card?.metadata?.owners && card.metadata.owners[0]?.relatedObject?.name
                      ? card.metadata.owners[0].relatedObject.name
                      : null,
                  contactName:
                    card?.metadata?.contacts && card.metadata.contacts[0]?.relatedObject?.entity?.name
                      ? card.metadata.contacts[0].relatedObject.entity.name
                      : null,
                  isContact:
                    card?.metadata?.contacts && card.metadata.contacts[0]?.relatedObject?._id
                      ? card.metadata.contacts[0].relatedObject._id
                      : null,
                  ...card.metadata,
                });
              }

              return { ...card };
            }),
          })),
        };

        dispatch(
          setFlowState({
            pipeToShow: pipe,
            pipeToShowTab: deals,
          })
        );
      } else
        dispatch(
          setFlowState({
            pipeToShow: null,
            pipeToShowTab: null,
          })
        );
    }
  }, [pipelineData]);

  useEffect(() => {
    if (openPipeDialog && selectedPipe && openPipeDialog !== "newPipe") {
      if (selectedPipe.stages) setStages(selectedPipe.stages);
      if (selectedPipe.name) setName(selectedPipe.name);
    }
  }, [openPipeDialog, selectedPipe]);

  const handleDeletePipe = () => {
    if (selectedPipe) {
      setStateApp((state) => ({
        ...state,
        uniuniversalCircularLoaderAct: true,
      }));

      getDealsCountByPipeline({
        variables: {
          pipelinesIds: [selectedPipe?._id],
        },
      });

      setDeleteFunc(() => () => {
        updatePipelines({
          variables: {
            pipelines: [{ _id: selectedPipe._id, IsDeleted: true }],
          },
          refetchQueries: ["getPipelines"],
          awaitRefetchQueries: true,
        });

        //// handleClose()++
        if (error) setError(false);
        setStages([]);
        setName("");
        dispatch(
          setFlowState({
            openPipeDialog: false,
            selectedPipe: null,
            pipeToShow: null,
          })
        );
      });
    }
  };

  const removeStage = (stage, index) => {
    if (stages.length === 1) dispatch(showWarningMessage("The stage can't be deleted, the pipeline needs at least one stage."));
    else {
      if (stage?._id && selectedPipe) {
        setStateApp((state) => ({
          ...state,
          uniuniversalCircularLoaderAct: true,
        }));

        getDealsCountByStage({
          variables: {
            pipelineId: selectedPipe?._id,
            stageId: stage._id,
          },
        });

        setDeleteFunc(() => () => {
          const updStages = [...stages];
          updStages.splice(index, 1);
          setStages(updStages);
        });
      } else {
        const updStages = [...stages];
        updStages.splice(index, 1);
        setStages(updStages);
      }
    }
  };

  const handleClose = () => {
    if (error) setError(false);
    setStages([]);
    setName("");
    dispatch(
      setFlowState({
        openPipeDialog: false,
      })
    );
  };

  const onDragEnd = (result) => {
    // dropped outside the list || same position
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    const { reorderedStages, stagesToUpdate } = reorder(stages, result.source.index, result.destination.index);
    //// saving state
    setStages([...reorderedStages]);
  };

  const handleToggleRotten = (stage, index) => {
    const upStages = [...stages];
    upStages[index] = { ...stage, rotten: !stage.rotten };
    setStages([...upStages]);
    // }
  };

  const handleAddStage = () => {
    if (error) setError(false);
    // if (addingNewPipe) {
    setStages([
      ...stages,
      {
        name: "",
        dealProbability: "",
        rotting: "",
        rotten: false,
        dealsStatus: "open",
        position: stages.length > 0 ? stages[stages.length - 1].position + 1 : 0,
      },
    ]);
    // }
  };

  const handleCellTextChange = (value, fieldName, index) => {
    // if (addingNewPipe) {
    const updStages = [...stages];
    updStages[index] = { ...stages[index], [fieldName]: value };
    setStages(updStages);
    // }
  };

  const handleSaveOrUpdate = () => {
    //// check validations
    let valid = true;
    stages.forEach((stage) => {
      if (!stage.name || stage.name === "") valid = false;
    });

    if (!name || name === "" || !valid || stages.length === 0) {
      setError(true);
    } else {
      if (openPipeDialog === "newPipe")
        //// save it
        addPipeline({
          variables: {
            name,
            stages,
            userId: stateApp.user.mongoId,
          },
          refetchQueries: ["getPipelines", "getPipeline"],
          awaitRefetchQueries: true,
        });
      else if (selectedPipe) {
        ////update
        let stagesToUpdate = [];

        let pipeToUpdate = selectedPipe.name !== name ? { _id: selectedPipe._id, name } : { _id: selectedPipe._id }; //// else update the ts

        let stagesToAdd = stages.filter((stage) => !stage._id);
        let existingStages = stages.filter((stage) => stage._id);

        for (let i = 0; i < existingStages.length; i++) {
          const frontEndStage = { ...existingStages[i] };
          for (let j = 0; j < selectedPipe.stages.length; j++) {
            const dbStage = { ...selectedPipe.stages[j] };
            if (dbStage._id === frontEndStage._id) {
              if (!deepEqualObjects(dbStage, frontEndStage)) {
                let stageToUpdate = {
                  _id: dbStage._id,
                  descriptorId: dbStage.descriptorId,
                };

                //// checking if the descriptor position changed
                if (dbStage.position !== frontEndStage.position) stageToUpdate.position = frontEndStage.position;

                //// checking if something change in the real stage object
                delete dbStage.position;
                delete frontEndStage.position;
                if (!deepEqualObjects(dbStage, frontEndStage)) stageToUpdate = { ...stageToUpdate, ...frontEndStage };

                ////
                stagesToUpdate.push(stageToUpdate);
              }

              break;
            }
          }
        }

        //// checking if some db stage was deleted
        for (let j = 0; j < selectedPipe.stages.length; j++) {
          const dbStage = { ...selectedPipe.stages[j] };
          let found = false;

          for (let i = 0; i < stages.length; i++) {
            const frontEndStage = { ...stages[i] };
            if (dbStage._id === frontEndStage._id) {
              found = true;
              break;
            }
          }

          if (!found) stagesToUpdate.push({ _id: dbStage._id, IsDeleted: true });
        }

        //// pipeToUpdate ////
        //// stagesToAdd ////
        //// stagesToUpdate ////

        let success = true;
        let allPromises = [];

        if (pipeToUpdate)
          //// if not necessary now
          allPromises.push(
            new Promise((resolve, reject) => {
              updatePipelines({
                variables: {
                  pipelines: [pipeToUpdate],
                },
                refetchQueries: ["getPipelines", "getPipeline"], //// separete latter to the end all promises
                awaitRefetchQueries: true,
              }).then((result) => {
                const {
                  data: { updatePipelines },
                } = result;

                if (updatePipelines?.success === false) success = false;

                resolve();
              });
            })
          );

        if (stagesToAdd && stagesToAdd.length > 0)
          allPromises.push(
            new Promise((resolve, reject) => {
              addStages({
                variables: {
                  stages: stagesToAdd,
                  pipelineId: selectedPipe._id,
                  userId: stateApp.user.mongoId,
                },
                refetchQueries: ["getPipelines", "getPipeline"], //// separete latter to the end all promises
                awaitRefetchQueries: true,
              }).then((result) => {
                const {
                  data: { addStages },
                } = result;

                if (addStages?.success === false) success = false;

                resolve();
              });
            })
          );

        if (stagesToUpdate && stagesToUpdate.length > 0)
          allPromises.push(
            new Promise((resolve, reject) => {
              updateStages({
                variables: {
                  stages: stagesToUpdate,
                },
                refetchQueries: ["getPipelines", "getPipeline"], //// separete latter to the end all promises
                awaitRefetchQueries: true,
              }).then((result) => {
                const {
                  data: { updateStages },
                } = result;

                if (updateStages?.success === false) success = false;

                resolve();
              });
            })
          );

        Promise.all(allPromises)
          .then((values) => {
            if (success === true) dispatch(showSuccessMessage("The Pipeline was successfully updated."));
            else dispatch(showErrorMessage("An error occurred during the update."));
          })
          .catch((reason) => { });
      }

      handleClose();
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = (open = true) => {
    setDeleteDialogOpen(open);
  };

  //// checking if the something to update in the pipe or the stages
  const checkingIfEdited = () => {
    if (openPipeDialog !== "newPipe" && selectedPipe) {
      if (selectedPipe.name !== name || selectedPipe.stages?.length !== stages.length) return true;

      ////checking stages
      for (let i = 0; i < stages.length; i++) {
        if (!deepEqualObjects(stages[i], selectedPipe.stages[i])) return true;
      }
    }

    return false;
  };

  const handleEditFlowLine = () =>
    dispatch(
      setFlowState({
        openPipeDialog: true,
      })
    );

  const handleDuplicateFlowLine = () => {
    // Duplicate Flowline
  }

  const handleDeleteFlowLine = () => {
    // Delete Flowline
  }

  return (
    <React.Fragment>
      <div className={classes.settingsButton}>
        {selectedPipe && (
          <Typography style={{ marginLeft: 10 }} variant="h5" color="textPrimary" fontWeight="fontWeightBold">
            {selectedPipe.name}
          </Typography>
        )}
        <FlowLineAction
          onDelete={handleDeleteFlowLine}
          onEdit={handleEditFlowLine}
          onDuplicate={handleDuplicateFlowLine}
        />
      </div>

      {/* //// pipelines dialog //// */}
      {openPipeDialog && (
        <Dialog open={openPipeDialog ? true : false} onClose={handleClose} fullWidth={true} maxWidth={"lg"}>
          <DialogTitle className={classes.title}>
            {openPipeDialog !== "newPipe" ? "Edit Flowline" : "Add a New Flowline"}

            <div className={classes.titleClose}>
              {openPipeDialog !== "newPipe" && (
                <Tooltip title="Remove Pipeline" placement="top">
                  <IconButton size="small" onClick={handleDeletePipe} style={{ marginRight: 10, color: "#fff" }}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Close" placement="top">
                <IconButton size="small" style={{ color: "#fff" }} onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </div>
          </DialogTitle>

          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={error && (!name || name === "")}
                  label="Name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError(false);
                  }}
                  style={{ width: '48%' }}
                />
              </Grid>
              <Grid item xs={12}>
                {stages && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppableM1">
                      {(provided, snapshot) => (
                        <RootRef rootRef={provided.innerRef}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell padding="checkbox"></TableCell>
                                <TableCell align="left">Stage Name</TableCell>
                                {/* ******DO NOT DELETE - TEMPORARILY COMMENTING OUT UNTIL WE BUILD 'PROBABILITY' and 'ROTTENESS' FUCTIONALITY****** */}
                                <TableCell align="left">Deal Probability(%)</TableCell>
                                <TableCell align="left">Rotting in&nbsp;(days)</TableCell>
                                <TableCell align="left">Stage Status</TableCell>
                                <TableCell padding="checkbox"></TableCell>
                                {/* <TableCell padding="checkbox"></TableCell> */}
                                {/* <TableCell align="left">Auto-Assign</TableCell> */}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {stages.map((stage, index) => {
                                const labelId = `checkbox-list-label-${stage.position}`;
                                return (
                                  <Draggable key={labelId} draggableId={labelId} index={stage.position}>
                                    {(provided, snapshot) => (
                                      <TableRow key={stage.position} ref={provided.innerRef} {...provided.draggableProps}>
                                        <TableCell padding="checkbox" {...provided.dragHandleProps}>
                                          <DragIndicator />
                                        </TableCell>
                                        <TableCell align="left">
                                          <TextField
                                            error={error && (!stage.name || stage.name === "")}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            margin="none"
                                            value={stage.name}
                                            onChange={(event) => {
                                              handleCellTextChange(event.target.value, "name", index);
                                              if (error) setError(false);
                                            }}
                                          />

                                          {/* {stage.name} */}
                                        </TableCell>
                                        {/* ******DO NOT DELETE - TEMPORARILY COMMENTING OUT UNTIL WE BUILD 'PROBABILITY' and 'ROTTENESS' FUCTIONALITY****** */}

                                        <TableCell align="left">
                                          <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            margin="none"
                                            value={stage.dealProbability}
                                            InputProps={{
                                              type: "number",
                                            }}
                                            onChange={(event) => {
                                              handleCellTextChange(event.target.value, "dealProbability", index);
                                            }}
                                          />
                                        </TableCell>

                                        <TableCell align="left">
                                          <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            margin="none"
                                            value={stage.rotting}
                                            InputProps={{
                                              type: "number",
                                            }}
                                            onChange={(event) => {
                                              handleCellTextChange(event.target.value, "rotting", index);
                                            }}
                                          />
                                        </TableCell>

                                        <TableCell align="left">
                                          <Autocomplete
                                            fullWidth
                                            style={{ minWidth: 200 }}
                                            value={stage?.dealsStatus?.capitalize()}
                                            onChange={(event, newValue) => {
                                              handleCellTextChange(newValue?.toLowerCase(), "dealsStatus", index);
                                            }}
                                            options={["Open", "Won", "Lost"]}
                                            renderInput={(params) => (
                                              <TextField {...params} variant="outlined" size="small" fullWidth margin="none" />
                                            )}
                                          />

                                          {/* {stage.dealsStatus} */}
                                        </TableCell>

                                        <TableCell padding="checkbox">
                                          <Tooltip title="Remove Stage" placement="top">
                                            <RemoveCircleOutlineIcon
                                              onClick={() => {
                                                removeStage(stage, index);
                                              }}
                                              className={classes.removeIconButton}
                                            />
                                          </Tooltip>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </Draggable>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </RootRef>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </Grid>
              <Grid item xs={10} style={{ display: "flex" }}>
                <IconButton className={classes.addIconButton} onClick={handleAddStage} style={{ backgroundColor: "transparent" }}>
                  <AddIcon />
                  <span>Add new stage</span>
                </IconButton>
                <p
                  style={{
                    marginLeft: 15,
                    color: "red",
                    visibility: error && stages.length === 0 ? "visible" : "hidden",
                  }}
                >
                  Please add at least one stage.
                </p>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleSaveOrUpdate}
              color="primary"
              style={{
                marginRight: 15,
                visibility: openPipeDialog === "newPipe" || checkingIfEdited() ? "visible" : "hidden",
              }}
            >
              {openPipeDialog === "newPipe" ? "Save" : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {deleteDialogOpen && (
        <Dialog
          className={classes.dialog}
          open={deleteDialogOpen ? true : false}
          onClose={handleCloseDeleteDialog}
          fullWidth={false}
          maxWidth="sm"
        >
          <DeleteConfirmationDialogContent
            header={deleteDialogOpen === "pipe" ? `Delete Flowline` : `Delete Stage`}
            onClose={handleCloseDeleteDialog}
            deleteFunc={deleteFunc ? deleteFunc : () => { }}
            m1nSelectedRowsIds={null}
            setM1nSelectedRowsIndexes={() => { }}
          >
            {deleteDialogOpen === "pipe" ? "Are you sure you want to delete the Flowline?" : "Are you sure you want to delete the stage?"}
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}
    </React.Fragment>
  );
}
