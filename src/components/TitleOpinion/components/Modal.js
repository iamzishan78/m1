import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  btn: {
    paddingBottom: "10px !important",
    width: "125px"
  },
  warning: {
    border: "red"
  }
}));

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [stateName, setStateName] = React.useState("");
  const [stateValidated, setStateValidated] = React.useState(false);

  useEffect(() => {
    if (stateName === "") {
      setStateValidated(false);
    } else {
      setStateValidated(true);
    }
  }, [stateName]);

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setStateName("");
  };

  const handleAdd = event => {
    event.preventDefault();
    if (stateName !== "") {
      if (props.Column) props.Column(stateName);
      if (props.Section) props.Section(stateName);

      handleClose();
    }
  };

  return (
    <div>
      {props.Column && (
        <Button
          className={classes.btn}
          aria-describedby={true}
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
        >
          New Column
        </Button>
      )}
      {props.Section && (
        <Button
          className={classes.btn}
          aria-describedby={true}
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
        >
          New Section
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form>
          {props.Column && (
            <DialogTitle id="form-dialog-title">New Column</DialogTitle>
          )}
          {props.Section && (
            <DialogTitle id="form-dialog-title">New Section</DialogTitle>
          )}
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="addName"
              label="Name"
              fullWidth
              required
              value={stateName}
              onChange={e => {
                e.preventDefault();

                setStateName(e.target.value);
              }}
              onClick={e => {
                e.preventDefault();
                document.getElementById("addName").focus();
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stateValidated}
              onClick={handleAdd}
              color="primary"
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
