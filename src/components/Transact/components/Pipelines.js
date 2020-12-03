import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import {
  setFlowState,
  showErrorMessage,
  showSuccessMessage,
} from "../../../actions";
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
import { Tooltip, FormControlLabel, Switch } from "@material-ui/core";
import { GETPIPELINES } from "../../../graphQL/useQueryPipelines";
import { ADDPIPELINE } from "../../../graphQL/useMutationAddPipeline";
import { UPDATEPIPELINE } from "../../../graphQL/useMutationUpdatePipeline";
import { ADDSTAGES } from "../../../graphQL/useMutationAddStages";
import { UPDATESTAGES } from "../../../graphQL/useMutationUpdateStages";
import { useMutation, useLazyQuery } from "@apollo/client";
import { AppContext } from "../../../AppContext";
import { deepEqualObjects } from "../../Shared/functions";

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
    backgroundColor: "#D5F4FF",
  },
  list: {
    padding: 0,
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
  let startIndex = reorderedStages.findIndex(
    (layer) => layer.position == startPosition
  );
  let endIndex = reorderedStages.findIndex(
    (layer) => layer.position == endPosition
  );

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

export default function Pipelines(props) {
  const dispatch = useDispatch();
  const { openPipeDialog, selectedPipe, pipelines, pipeToShow } = useSelector(
    ({ Flow }) => Flow
  );
  const [stateApp] = useContext(AppContext);
  const classes = useStyles();
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [stages, setStages] = useState([]);
  const [addPipeline] = useMutation(ADDPIPELINE);
  const [updatePipeline] = useMutation(UPDATEPIPELINE);
  const [addStages] = useMutation(ADDSTAGES);
  const [updateStages] = useMutation(UPDATESTAGES);
  const [getPipelines, { loading, data: pipelinesData }] = useLazyQuery(
    GETPIPELINES
  );

  // const addingNewPipe = selectedPipe ? false : true;

  useEffect(() => {
    getPipelines();
  }, []);

  useEffect(() => {
    if (pipelinesData?.pipelines) {
      //// select first one as default
      if (pipelinesData.pipelines.length > 0)
        dispatch(
          setFlowState({
            selectedPipe: pipelinesData.pipelines[0],
            pipelines: pipelinesData.pipelines,
          })
        );
      else
        dispatch(
          setFlowState({
            selectedPipe: null,
            pipelines: [],
          })
        );
    }
  }, [pipelinesData]);

  // //// get the whole selected pipe
  // useEffect(() => {
  //   //////////////
  // }, [selectedPipe]);

  useEffect(() => {
    if (openPipeDialog && selectedPipe) {
      if (selectedPipe.stages) setStages(selectedPipe.stages);
      if (selectedPipe.name) setName(selectedPipe.name);
    }
  }, [openPipeDialog]);

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
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const { reorderedStages, stagesToUpdate } = reorder(
      stages,
      result.source.index,
      result.destination.index
    );
    //// saving state
    setStages([...reorderedStages]);
    //   //// saving to mongo
    //   updateManyUserLayerSettings({
    //     variables: {
    //       manySettings: stagesToUpdate,
    //     },
    //   });
  };

  const handleToggleRotten = (stage, index) => {
    // if (addingNewPipe) {
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
        dealsStatus: "Open",
        position:
          stages.length > 0 ? stages[stages.length - 1].position + 1 : 0,
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
    stages.map((stage) => {
      if (!stage.name || stage.name === "") valid = false;
    });

    if (!name || name === "" || !valid || stages.length === 0) {
      setError(true);
    } else {
      if (!selectedPipe)
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
      else {
        ////update
        let stagesToUpdate = [];

        let pipeToUpdate =
          selectedPipe.name !== name
            ? { _id: selectedPipe._id, name }
            : { _id: selectedPipe._id }; //// else update the ts

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
                if (dbStage.position !== frontEndStage.position)
                  stageToUpdate.position = frontEndStage.position;

                //// checking if something change in the real stage object
                delete dbStage.position;
                delete frontEndStage.position;
                if (!deepEqualObjects(dbStage, frontEndStage))
                  stageToUpdate = { ...stageToUpdate, ...frontEndStage };

                ////
                stagesToUpdate.push(stageToUpdate);
              }

              break;
            }
          }
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
              updatePipeline({
                variables: {
                  pipeline: pipeToUpdate,
                },
                refetchQueries: ["getPipelines", "getPipeline"], //// separete latter to the end all promises
                awaitRefetchQueries: true,
              }).then((result) => {
                const {
                  data: { updatePipeline },
                } = result;

                if (updatePipeline?.success === false) success = false;

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
            if (success === true)
              dispatch(
                showSuccessMessage("The Pipeline was successfully updated.")
              );
            else
              dispatch(
                showErrorMessage("An error occurred during the update.")
              );
          })
          .catch((reason) => {
            console.log(reason);
          });
      }

      handleClose();
    }
  };

  //// checking if the something to update in the pipe or the stages
  const checkingIfEdited = () => {
    if (selectedPipe) {
      if (
        selectedPipe.name !== name ||
        selectedPipe.stages?.length !== stages.length
      )
        return true;

      ////checking stages
      for (let i = 0; i < stages.length; i++) {
        if (!deepEqualObjects(stages[i], selectedPipe.stages[i])) return true;
      }
    }

    return false;
  };

  //// setting the add new button header /////
  let optionsWithHeader = ["header", ...pipelines];

  return (
    <React.Fragment>
      <ButtonGroup>
        <Autocomplete
          size="small"
          style={{ minWidth: 280 }}
          options={optionsWithHeader}
          getOptionLabel={(option) => (option?.name ? option.name : option)}
          groupBy={(option) => {
            if (option === "header") return "header";
            return "pipelines";
          }}
          renderGroup={(option) => {
            if (option.group === "header")
              return (
                <Button
                  key={option.key}
                  style={{ color: "#12ABE0", margin: "0", width: "100%" }}
                  onClick={() => {
                    dispatch(
                      setFlowState({
                        openPipeDialog: true,
                        selectedPipe: null,
                      })
                    );
                  }}
                >
                  Add New
                </Button>
              );

            return (
              <React.Fragment key={option.key}>
                {option.children}
              </React.Fragment>
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label="Pipelines" variant="outlined" />
          )}
          autoComplete
          includeInputInList
          value={selectedPipe}
          onChange={(event, newValue) => {
            dispatch(
              setFlowState({
                selectedPipe: newValue,
              })
            );
          }}
        />
        <ButtonGroup>
          <Button
            disabled={!selectedPipe}
            size="small"
            onClick={() => {
              dispatch(
                setFlowState({
                  openPipeDialog: true,
                })
              );
            }}
          >
            <EditIcon />
          </Button>
        </ButtonGroup>
      </ButtonGroup>

      {/* //// pipelines dialog //// */}
      {openPipeDialog && (
        <Dialog
          open={openPipeDialog}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={"lg"}
        >
          <DialogTitle className={classes.title}>
            {selectedPipe ? "Edit Pipeline" : "Add A New Pipeline"}
            <CloseIcon className={classes.titleClose} onClick={handleClose} />
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
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">
                                  Deal Probability
                                </TableCell>
                                <TableCell align="left">
                                  Rotting in&nbsp;(days)
                                </TableCell>
                                <TableCell align="left">Deals Status</TableCell>
                                <TableCell padding="checkbox"></TableCell>
                                {/* <TableCell align="left">Auto-Assign</TableCell> */}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {stages.map((stage, index) => {
                                const labelId = `checkbox-list-label-${stage.position}`;
                                return (
                                  <Draggable
                                    key={labelId}
                                    draggableId={labelId}
                                    index={stage.position}
                                  >
                                    {(provided, snapshot) => (
                                      <TableRow
                                        key={stage.position}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                      >
                                        <TableCell
                                          padding="checkbox"
                                          {...provided.dragHandleProps}
                                        >
                                          <DragIndicator />
                                        </TableCell>
                                        <TableCell align="left">
                                          <TextField
                                            error={
                                              error &&
                                              (!stage.name || stage.name === "")
                                            }
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            margin="none"
                                            value={stage.name}
                                            onChange={(event) => {
                                              handleCellTextChange(
                                                event.target.value,
                                                "name",
                                                index
                                              );
                                              if (error) setError(false);
                                            }}
                                          />

                                          {/* {stage.name} */}
                                        </TableCell>
                                        <TableCell align="left">
                                          <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            margin="none"
                                            value={stage.dealProbability}
                                            onChange={(event) => {
                                              handleCellTextChange(
                                                event.target.value,
                                                "dealProbability",
                                                index
                                              );
                                            }}
                                          />
                                          {/* {stage.dealProbability} */}
                                        </TableCell>
                                        <TableCell align="left">
                                          <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            margin="none"
                                            value={stage.rotting}
                                            onChange={(event) => {
                                              handleCellTextChange(
                                                event.target.value,
                                                "rotting",
                                                index
                                              );
                                            }}
                                          />
                                          {/* {stage.rotting} */}
                                        </TableCell>
                                        <TableCell align="left">
                                          <Autocomplete
                                            fullWidth
                                            style={{ minWidth: 200 }}
                                            value={stage.dealsStatus}
                                            onChange={(event, newValue) => {
                                              handleCellTextChange(
                                                newValue,
                                                "dealsStatus",
                                                index
                                              );
                                            }}
                                            options={["Open", "Won", "Lost"]}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                margin="none"
                                              />
                                            )}
                                          />

                                          {/* {stage.dealsStatus} */}
                                        </TableCell>
                                        <TableCell padding="checkbox">
                                          <Tooltip
                                            title="Rotten Stats"
                                            placement="top"
                                          >
                                            <FormControlLabel
                                              control={
                                                <Switch
                                                  checked={stage.rotten}
                                                  onChange={() => {
                                                    handleToggleRotten(
                                                      stage,
                                                      index
                                                    );
                                                  }}
                                                />
                                              }
                                            />
                                          </Tooltip>
                                        </TableCell>
                                        {/* <TableCell align="left">
                                          {stage.autoAssign}
                                        </TableCell> */}
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
              <Grid item xs={12} style={{ display: "flex" }}>
                <IconButton
                  className={classes.addIconButton}
                  onClick={handleAddStage}
                >
                  <AddIcon className={classes.colorAction} color="action" />
                </IconButton>
                <p
                  style={{
                    marginLeft: 15,
                    color: "red",
                    visibility:
                      error && stages.length === 0 ? "visible" : "hidden",
                  }}
                >
                  Please add al least an stage.
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
                visibility:
                  !selectedPipe || checkingIfEdited() ? "visible" : "hidden",
              }}
            >
              {!selectedPipe ? "Save" : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}
