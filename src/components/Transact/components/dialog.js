import React, { useState, useContext, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TransactContext } from "../TransactContext";

export default function TransactDialog(props) {
  const { cardId, laneId, transactData, handleDataChange } = props;
  const [stateTransact, setStateTransact] = useContext(TransactContext);
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (transactData && cardId && laneId) {
      transactData.lanes.map((lane) => {
        if (lane.id === laneId) {
          lane.cards.map((card) => {
            if (card.id === cardId) {
              setTitle(card.title ? card.title : "");
              setLabel(card.label ? card.label : "");
              setDescription(card.description ? card.description : "");
            }
          });
        }
      });
    }
  }, [transactData, cardId, laneId]);

  const handleClose = () => {
    setStateTransact((stateTransact) => ({
      ...stateTransact,
      openDialog: false,
    }));
    setTitle(title.trim());
    setLabel(label.trim());
    setDescription(description.trim());
  };

  const handleUpdate = () => {
    // if (title.trim() !== "" && description.trim() !== "") {
    if (transactData && cardId && laneId) {
      transactData.lanes.forEach((lane) => {
        if (lane.id === laneId) {
          lane.cards.forEach((card) => {
            if (card.id === cardId) {
              card.title = title.trim();
              card.label = label.trim();
              card.description = description.trim();
            }
          });
        }
      });

      handleDataChange(transactData);
      handleClose();
    }
    // }
  };

  return (
    <Dialog
      open={stateTransact.openDialog}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="form-dialog-title">Update Card</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          value={title}
          label="Title"
          fullWidth
          //   required
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          value={label}
          label="Label"
          fullWidth
          onChange={(e) => {
            setLabel(e.target.value);
          }}
        />
        <TextField
          //   autoFocus
          margin="dense"
          value={description}
          label="Description"
          fullWidth
          multiline
          //   required
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
