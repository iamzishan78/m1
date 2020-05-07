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
    margin: ({ compound }) => {
      if (compound) return "0";
    },
    borderRadius: "3px",
    "&:hover": {
      background: ({ header }) => (header ? "whitesmoke" : "#FFFFFF"),
    },
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
  notAvailableP: { color: "#898989b0", fontSize: "13px" },
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

export default function FieldContent({
  children,
  name,
  id,
  show,
  header,
  compound,
}) {
  //////////// children -brings the field text content  //////optional if compound////////////////////////
  //////////// name - brings the field name //////if compound field label/////////////////////////////////
  //////////// id -brings the updating contact id ////////////////////////////////////////////////////////
  //////////// show -allows to custom show or no the text for composed fields//optional///////////////////
  ////////////      -if show, show === to the field value in a single field or "none" if no value ////////
  //////////// compound -will contain a values object for compound fields like address  //optional////////

  const classes = useStyles({ header, compound });
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState(
    compound
      ? { ...compound, _id: id }
      : {
          _id: id,
          [name]:
            !show && children ? children : show && show !== "none" ? show : "",
        }
  );

  useEffect(() => {
    console.log("ttttttttttttt ", editValue);
  }, [editValue]);

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

  if (edit && compound) {
    let inputsArray = [];
    for (const fieldName in editValue) {
      if (editValue.hasOwnProperty(fieldName) && fieldName != "_id") {
        inputsArray.push(
          <TextField
            id="fieldContentInput"
            className={classes.editTextField}
            variant="outlined"
            size="small"
            // fullWidth
            multiline
            value={editValue[fieldName]}
            onChange={(e) => {
              e.persist();
              setEditValue((editValue) => ({
                ...editValue,
                [fieldName]: e.target.value,
              }));
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleUpdating(event);
              }
            }}
            onBlur={() => {
              // setEdit(false);
              setEditValue((editValue) => ({
                ...editValue,
                [fieldName]: compound[fieldName],
              }));
            }}
          />
        );
      }
    }
    return inputsArray;
  }

  if (edit && !compound)
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
            [name]:
              !show && children
                ? children
                : show && show !== "none"
                ? show
                : "",
          });
        }}
      />
    );

  //// compound fields with values and condition show===true
  if (compound && show !== "none") {
    let textArray = [];
    for (const key in compound) {
      if (
        compound.hasOwnProperty(key) &&
        compound[key] &&
        compound[key] !== ""
      ) {
        textArray.push(compound[key]);
      }
    }
    return (
      <p className={classes.fieldContentP}>
        {children} {textArray.join(", ")}
        <PencilEditIcon onClick={handleEditClick} />
      </p>
    );
  }

  //// simple header field with value
  if (header && show && show !== "none")
    return (
      <p className={classes.fieldContentP}>
        {show} <PencilEditIcon onClick={handleEditClick} />
        {children}
      </p>
    );
  //// empty simple header field
  if (header && show && show === "none")
    return (
      <p className={`${classes.notAvailableP} ${classes.fieldContentP}`}>
        Not Available <PencilEditIcon onClick={handleEditClick} />
        {children}
      </p>
    );

  //// simple field with value
  if ((!show && children && children !== "") || (show && show !== "none"))
    return (
      <p className={classes.fieldContentP}>
        {children} <PencilEditIcon onClick={handleEditClick} />
      </p>
    );

  //// empty field
  return (
    <p className={`${classes.notAvailableP} ${classes.fieldContentP}`}>
      Not Available{compound ? " " + name : ""}
      <PencilEditIcon onClick={handleEditClick} />
    </p>
  );
}
