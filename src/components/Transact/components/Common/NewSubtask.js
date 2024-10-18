import React, { useState, useEffect, memo, useContext } from "react";
import { useMutation } from "@apollo/client";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, TextField } from "@material-ui/core";
import { ADD_DEAL_SUBTASK } from "graphQL/useMutationDealSubtask";
import { TransactContext } from "components/Transact/TransactContext";

const useStyles = makeStyles((theme) => ({
  addSubTaskButton: {
    marginBottom: "10px",
  },
}));

const NewSubtask = memo(({ index, activeDeal = {}, relatedObject, pipeline, taskTemplate, isTemplate }) => {
  const classes = useStyles();
  const [isNewSubtask, setNewSubtask] = useState({ index: -1, value: false });

  const [, setStateTransact] = useContext(TransactContext);
  const [addSubtask, { data: addedSubtask }] = useMutation(ADD_DEAL_SUBTASK);

  useEffect(() => {
    if (addedSubtask && !activeDeal._id && !isTemplate) {
      setStateTransact((stateTransact) => ({
        ...stateTransact,
         // Fetching task id
         dealToCreate: { _id: addedSubtask?.task?._id },
      }));
    }
  }, [activeDeal._id, addedSubtask, setStateTransact, isTemplate]);

  const handleNewSubtask = (task) => {
    //? In case of task template, pipeline is pipelineId,
    //? and for deal, pipeline is dealId
    addSubtask({
      variables: {
        task: { ...task, templateRef: taskTemplate?._id },
        relatedObject,
        pipeline: isTemplate ? pipeline : activeDeal._id,
      },
      refetchQueries: ["dealSettings", "getTaskTemplate"],
      awaitRefetchQueries: true,
    });
    if (isTemplate) setNewSubtask(false);
    else setNewSubtask({ index: -1, value: !isNewSubtask.value });
  };

  const showFieldToAdd = () => {
    if (!!taskTemplate) setNewSubtask(true);
    else setNewSubtask({ index, value: !isNewSubtask.value });
  };

  const hideFieldToAdd = () => {
    if (!!taskTemplate) setNewSubtask(false);
    else setNewSubtask({ index: -1, value: !isNewSubtask.value });
  };

  return (
    <>
      {((isTemplate && isNewSubtask === true) || (isNewSubtask.index === index && isNewSubtask.value)) && (
        <Grid item xs={12} className={classes.addSubTaskButton}>
          <TextField
            margin="dense"
            variant="outlined"
            label="Enter Subtask Name"
            fullWidth
            autoFocus
            onBlur={hideFieldToAdd}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleNewSubtask({ name: e.target.value });
              }
            }}
          />
        </Grid>
      )}
      <Grid item xs={12} className={classes.addSubTaskButton}>
        <Button size="small" style={{ color: "grey" }} onClick={showFieldToAdd}>
          + Add New Subtask
        </Button>
      </Grid>
    </>
  );
});

export default NewSubtask;
