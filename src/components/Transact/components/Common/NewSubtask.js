import React, { useState, useEffect, memo } from "react";
import { useMutation } from "@apollo/client";

import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, TextField } from "@material-ui/core";
import { ADD_DEAL_SUBTASK } from "graphQL/useMutationDealSubtask";

const useStyles = makeStyles((theme) => ({
  addSubTaskButton: {
    marginBottom: "10px",
  },
}));

const NewSubtask = memo(({ index, activeDeal = {}, setStateTransact, settings = [], taskTemplate }) => {
  const classes = useStyles();
  const [isNewSubtask, setNewSubtask] = useState({ index: -1, value: false });

  const [addSubtask, { data: addedSubtask }] = useMutation(ADD_DEAL_SUBTASK);

  useEffect(() => {
    if (addedSubtask && !activeDeal._id) {
      setStateTransact((stateTransact) => ({
        ...stateTransact,
        dealToCreate: { _id: addedSubtask.task.pipeline },
      }));
    }
  }, [activeDeal._id, addedSubtask, setStateTransact]);

  const handleNewSubtask = (task) => {
    addSubtask({
      variables: {
        task,
        stageId: settings._id,
        dealId: activeDeal._id,
        isTemplate: !!taskTemplate,
        templateRef: taskTemplate._id,
      },
      refetchQueries: ["dealSettings"],
      awaitRefetchQueries: true,
    });
    setNewSubtask({ index: -1, value: !isNewSubtask.value });
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
      {!!taskTemplate ||
        (isNewSubtask.index === index && isNewSubtask.value && (
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
        ))}
      <Grid item xs={12} className={classes.addSubTaskButton}>
        <Button size="small" style={{ color: "grey" }} onClick={showFieldToAdd}>
          + Add New Subtask
        </Button>
      </Grid>
    </>
  );
});

export default NewSubtask;
