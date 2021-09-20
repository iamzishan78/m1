import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ContextProvider } from "react-sortly";
import Sortly, { useDrag, useDrop, useIsClosestDragging } from "react-sortly";
import { Flipper, Flipped } from "react-flip-toolkit";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, IconButton, Popover, List, ListItem, ListItemText, Tooltip, ListItemIcon } from "@material-ui/core";
import DragIndicator from "@material-ui/icons/DragIndicator";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { KeyboardDatePicker } from "@material-ui/pickers";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CustomAvatar from "components/Shared/ui/CustomAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import { UPDATE_DEAL_SUBTASK } from "graphQL/useMutationDealSubtask";

const useStyles = makeStyles((theme) => ({
  subTaskRoot: (props) => ({
    width: "100%",
    height: "40px",
    zIndex: props.muted ? 1 : 0,
  }),
  subTaskLeftGrid: {
    "& .MuiFormControlLabel-root": {
      marginRight: 0,
    },
  },
  subTaskRightGrid: (props) => ({
    alignItems: "right",
    textAlign: "right",
    "& .MuiIconButton-root": {
      height: "25px",
      width: "25px",
      margin: "5px",
    },
    "& .MuiTextField-root": {
      marginTop: "2px",
      marginBottom: 0,
      width: "132px",
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none !important",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important",
    },
    "& .MuiFormHelperText-root": {
      display: "none !important",
    },
    "& .MuiInputBase-input": {
      textAlign: "right",
      cursor: "pointer",
    },
    "& .MuiInputAdornment-root": {
      display: props.task.dueDate ? "none" : "",
    },
  }),
  addSubTaskButton: {
    marginBottom: "10px",
  },
  avatarButton: {
    "& .MuiIconButton-label": {
      width: "auto",
      "& span": {
        paddingTop: "6px",
      },
    },
  },
}));

const SubtaskItem = ({ task, handleUpdateSubtask, users, handleDragEnd }) => {
  const approver = users.find((user) => user?.value === task.assignee);
  const [showTaskActions, setShow] = useState(false);
  const [isDatePopup, setDatePopup] = useState(false);

  const truncate = (str, n) => (str.length > n ? str.substr(0, n - 1) + "..." : str);
  const onHoverTask = (state) => setShow(state);

  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    end(f) {
      handleDragEnd();
    },
  });

  const [, drop] = useDrop();
  const classes = useStyles({ muted: useIsClosestDragging() || isDragging, task });

  return (
    <Flipped flipId={task.id}>
      <div
        className={classes.subTaskRoot}
        onMouseLeave={() => onHoverTask(false)}
        onMouseEnter={() => onHoverTask(true)}
        ref={(ref) => drop(preview(ref))}
      >
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <ListItemIcon ref={drag} style={{ minWidth: "30px" }}>
            <DragIndicator style={{ cursor: "move" }} />
          </ListItemIcon>
          <Grid item xs={6} className={classes.subTaskLeftGrid}>
            <FormControlLabel
              control={
                <Checkbox
                  name="subtaskCheckbox"
                  value={task.name}
                  onChange={(e) =>
                    handleUpdateSubtask({
                      ...task,
                      isCompleted: e.target.checked,
                      completionDate: e.target.checked ? new Date().toString() : null,
                    })
                  }
                  checked={task.isCompleted}
                />
              }
            />
            <Tooltip title={task.name} placement="top">
              <span style={{ fontSize: "medium" }}>{truncate(task.name, 18)}</span>
            </Tooltip>
          </Grid>
          <Grid item xs={5} className={classes.subTaskRightGrid}>
            {(task.dueDate || showTaskActions) && (
              <span onClick={() => setDatePopup(!isDatePopup)} style={{ cursor: "pointer" }}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/DD/YY"
                  margin="normal"
                  allowKeyboardControl={false}
                  value={task.dueDate || ""}
                  emptyLabel
                  disabled
                  keyboardIcon={task.dueDate && <></>}
                  open={isDatePopup}
                  onChange={(date) => handleUpdateSubtask({ ...task, dueDate: date ? String(date["_d"]) : "" })}
                />
              </span>
            )}
            {(task.assignee || showTaskActions) && (
              <span>
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <>
                      <IconButton className={classes.avatarButton} {...bindTrigger(popupState)}>
                        {task.assignee ? (
                          <CustomAvatar email={approver.email} text={approver.text.toString()} />
                        ) : (
                          <AccountCircle fontSize="default" />
                        )}
                      </IconButton>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <List style={{ maxHeight: 450 }}>
                          {users.map((user) => (
                            <ListItem
                              button
                              onClick={() => {
                                handleUpdateSubtask({ ...task, assignee: user.value, assignedDate: new Date().toString() });
                                popupState.close();
                              }}
                            >
                              <ListItemText primary={user.text} />
                            </ListItem>
                          ))}
                        </List>
                      </Popover>
                    </>
                  )}
                </PopupState>
              </span>
            )}
          </Grid>
        </Grid>
      </div>
    </Flipped>
  );
};

const DealSubtasks = (props) => {
  const { tasks, users } = props;
  const [items, setItems] = useState([]);

  const [updateSubtask] = useMutation(UPDATE_DEAL_SUBTASK);

  useEffect(() => {
    setItems(tasks.map((t, index) => ({ ...t, id: `${index + 1}`, depth: 0 })));
  }, [tasks]);

  const handleUpdateSubtask = (task) => {
    updateSubtask({
      variables: {
        task,
      },
      refetchQueries: ["dealSettings"],
      awaitRefetchQueries: true,
    });
  };

  const handleChange = (newItems) => setItems(newItems);
  const handleDragEnd = () => {
    updateSubtask({
      variables: {
        tasks: items.map((i, position) => ({ ...i, position })),
      },
      refetchQueries: ["dealSettings"],
      awaitRefetchQueries: true,
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ContextProvider>
        <Flipper flipKey={items.map(({ id }) => id).join(".")}>
          <Sortly items={items} onChange={handleChange}>
            {(props) => (
              <SubtaskItem task={props.data} handleUpdateSubtask={handleUpdateSubtask} users={users} handleDragEnd={handleDragEnd} />
            )}
          </Sortly>
        </Flipper>
      </ContextProvider>
    </DndProvider>
  );
};

export default DealSubtasks;
