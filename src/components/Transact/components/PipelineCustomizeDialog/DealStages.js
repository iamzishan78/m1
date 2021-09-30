import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

//icons
import IconButton from "@material-ui/core/IconButton";

import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";
import DetailsIcon from "@material-ui/icons/Settings";
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
import { useLazyQuery } from "@apollo/client";
import { AppContext } from "AppContext";
import { DEALSCOUNTINANSTAGE } from "graphQL/useQueryNonDeletedDealsCountInAnStageByPipeline";

const useStyles = makeStyles((theme) => ({
  lanesRoot: {
    padding: "25px",
  },
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
    "&:hover": {
      color: "red",
    },
  },
  settingIcon: {
    color: "gray",
    "&:hover": {
      cursor: "pointer",
      color: "black",
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
}));

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

export default function LanesInfoPanel({ showWarningMessage, stages, setStages, stagesError, setStageError, setStage }) {
  const dispatch = useDispatch();
  const { openPipeDialog, selectedPipe } = useSelector(({ Flow }) => Flow);
  const [, setStateApp] = useContext(AppContext);
  const classes = useStyles();
  const [deleteFunc, setDeleteFunc] = useState(null);

  const [getDealsCountByStage, { data: dataDealsCountByStage }] = useLazyQuery(DEALSCOUNTINANSTAGE, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (dataDealsCountByStage?.nonDeletedDealsCountInAnStageByPipeline) {
      setStateApp((state) => ({
        ...state,
        uniuniversalCircularLoaderAct: false,
      }));
      if (dataDealsCountByStage.nonDeletedDealsCountInAnStageByPipeline.dealsCount > 0)
        dispatch(showWarningMessage("There are deals associated to the stage, please remove them first."));
      else {
        deleteFunc();
      }
    }
  }, [dataDealsCountByStage, deleteFunc, dispatch, setStateApp, showWarningMessage]);

  useEffect(() => {
    if (openPipeDialog && selectedPipe && openPipeDialog !== "newPipe") {
      if (selectedPipe.stages) setStages(selectedPipe.stages);
    }
  }, [openPipeDialog, selectedPipe, setStages]);

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

  const onDragEnd = (result) => {
    // dropped outside the list || same position
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    const { reorderedStages } = reorder(stages, result.source.index, result.destination.index);
    //// saving state
    setStages([...reorderedStages]);
  };

  const handleAddStage = () => {
    if (stagesError) setStageError(false);
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

  return (
    <div className={classes.lanesRoot}>
      <Grid container spacing={2}>
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
                                      error={stagesError && (!stage.name || stage.name === "")}
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      margin="none"
                                      value={stage.name}
                                      onChange={(event) => {
                                        handleCellTextChange(event.target.value, "name", index);
                                        if (stagesError) setStageError(false);
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

                                  <TableCell padding="checkbox">
                                    <Tooltip title="Stage Details" placement="top">
                                      <DetailsIcon onClick={() => setStage(stage)} className={classes.settingIcon} />
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
              visibility: stagesError && stages.length === 0 ? "visible" : "hidden",
            }}
          >
            Please add at least one stage.
          </p>
        </Grid>
      </Grid>
    </div>
  );
}
