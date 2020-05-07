import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  fieldContentP: {
    "& #contPencilIcon": {
      visibility: "hidden",
    },
    "&:hover #contPencilIcon": {
      visibility: "visible",
    },
  },
  pencilIcon: {
    fontSize: "22px",
  },
  editTextField: {
    "& .MuiInputBase-root": {
      fontSize: "0.875rem",
      padding: "10px",
      lineHeight: "1.43",
      marginBottom: "8px",
    },
  },
}));

function PencilEditIcon({ onClick }) {
  const classes = useStyles();
  return (
    <Tooltip title={"Edit"}>
      <IconButton
        size="small"
        onClick={(e) => {
          onClick(e);
        }}
      >
        <CreateTwoToneIcon id="contPencilIcon" className={classes.pencilIcon} />
      </IconButton>
    </Tooltip>
  );
}

export default function FieldContent({ children, name, id, show }) {
  //////////// children -brings the field text content  //////////////////////////////////
  //////////// name - brings the field name //////////////////////////////////////////////
  //////////// id -brings the updating contact id ////////////////////////////////////////
  //////////// show -allows to custom show or no the text for composed fields//optional///

  const classes = useStyles();
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState({
    _id: id,
    [name]: (!show && children) || show ? children : "",
  });

  useEffect(() => {
    if (document.getElementById("fieldContentInput"))
      document.getElementById("fieldContentInput").focus();
  }, [edit]);

  const handleEditClick = (e) => {
    e.preventDefault();
    setEdit(!edit);
  };

  const handleUpdating = (e) => {
    /////////////////editValue//////////////////////
  };

  if (edit && !show)
    return (
      <TextField
        id="fieldContentInput"
        className={classes.editTextField}
        variant="outlined"
        size="small"
        fullWidth
        multiline
        value={editValue[name]}
        onChange={(e) => {
          e.persist();
          setEditValue((editValue) => ({
            ...editValue,
            [name]: e.target.value,
          }));
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleUpdating(event);
          }
        }}
        onBlur={() => {
          setEdit(false);
          setEditValue({
            _id: id,
            [name]: (!show && children) || show ? children : "",
          });
        }}
      />
    );

  if ((!show && children) || show)
    return (
      <p className={classes.fieldContentP}>
        {children} <PencilEditIcon onClick={handleEditClick} />
      </p>
    );
  return (
    <p className={`${classes.notAvailableP} ${classes.fieldContentP}`}>
      Not Available <PencilEditIcon onClick={handleEditClick} />
    </p>
  );
}
