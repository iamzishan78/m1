import React, { useState } from "react";

import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";
import { drawController } from "hookstate/drawStateController";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: "55px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(1, 17, 51, 1.0)",
    color: "#fff",
    minWidth: "220px",
    width: "420px !important",
    opacity: "0.9",
    borderColor: "rgba(1, 17, 51, 1.0)",
  },
  TextField: {
    display: "flex",
    //borderColor: "#fff",
    background: "rgba(1, 17, 51, 1.0)",
    color: "#fff",
  },

  TextFieldInput: {
    color: "#fff",
    //fontWeight: "bold"
  },
  TextFieldLabel: {
    color: "#fff",
    //fontWeight: "bold"
  },
  enterLabel: {
    height: "3px",
    margin: "0px 12px 15px 12px",
    textAlign: "right",
    color: "fff",
    fontSize: "11px",
    display: "flex",
    justifyContent: "space-between"
  },
}));

export default function ShapeAOIPopup(props) {
  const classes = useStyles();

  const drawState = drawController.useState(['currentFeature', 'selectedAoi']);

  const [showError, setShowError] = useState(false);
  const { upsertCustomLayer } = props;

  //mutations
  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

  const { shapeLabel } = drawState.stateValues.currentFeature?.properties || {};

  return (
    <div className={`${classes.root}`}>
      <form autoComplete="off">
        <TextField
          // label="Area of Interest Name"
          placeholder="Area of Interest Name"
          className={classes.TextField}
          variant="filled"
          id="reddit-input"
          defaultValue={shapeLabel}
          autoFocus
          InputProps={{ className: classes.TextFieldInput, disableUnderline: true }}
          InputLabelProps={{ className: classes.TextFieldLabel }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              e.preventDefault();

              if (!drawState.stateValues.selectedAoi) {
                if (!e.target.value) {
                  setShowError(true);
                  return;
                }

                drawController.handleSaveAOIToShape(e.target.value, upsertCustomLayer);

                return;
              }

              drawController.handleEditAOIToShape(e.target.value, updateCustomLayer);
            }
          }}
        />
      </form>
      <div className={classes.enterLabel}>
        <span style={{ color: 'red' }}>{showError ? "Name is required!" : ""}</span>
        <span>Press enter to save</span>
      </div>
    </div>
  );
}
