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
    margin: ({ noMargin }) => {
      if (noMargin) return "0";
    },
    width: ({ noMargin }) => {
      if (noMargin) return "fit-content";
    },
    borderRadius: "4px",
    "&:hover": {
      background: ({ noMargin }) => (noMargin ? "whitesmoke" : "#FFFFFF"),
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
  id,
  content,
  childrenLeft,
  onlyChildren,
  name,
  noMargin,
}) {
  //////////// id - brings the contact id /////////////////////////////////////////////////////////////////////////
  //////////// content - brings an object with fielNames and values ///////////////////////////////////////////////
  //////////// childrenLeft - will move the chilren components to the left side of the field values//optional//////
  ////////////              - default childrens to rigth///////////////////////////////////////////////////////////
  //////////// onlyChildren - will show only the children components, no field values  //optional/////////////////
  //////////// name - will be part of the Not Available text, better use in compound fiels  //optional/////////////
  //////////// noMargin - no p tag margin  //optional//////////////////////////////////////////////////////////////

  const classes = useStyles({ noMargin });
  const [edit, setEdit] = useState(false);
  const [editedField, setEditedField] = useState({});
  const [editContent, setEditContent] = useState({ content });
  const [fieldsCount, setFieldsCount] = useState(0);

  // useEffect(() => {
  //   console.log("ttttttttttttt ", editContent);
  // }, [editContent]);

  useEffect(() => {
    if (content) {
      setEditContent(content);

      let count = 0;
      for (const fieldName in content) {
        if (content.hasOwnProperty(fieldName)) {
          count++;
        }
      }
      setFieldsCount(count);
    }
  }, [content]);

  useEffect(() => {
    let fieldName;
    for (const key in editContent) {
      fieldName = key;
      break;
    }
    if (
      document.getElementById("fieldContentInput" + fieldName) &&
      fieldsCount <= 1
    )
      document.getElementById("fieldContentInput" + fieldName).focus();
  }, [edit]);

  const handleEditClick = (e) => {
    e.preventDefault();
    setEdit(!edit);
  };

  const handleUpdating = (e, fieldName) => {
    /////////////////editContent//////////////////////
  };

  if (edit) {
    let inputsArray = [];
    for (const fieldName in editContent) {
      if (editContent.hasOwnProperty(fieldName)) {
        inputsArray.push(
          <TextField
            id={"fieldContentInput" + fieldName}
            className={classes.editTextField}
            variant="outlined"
            size="small"
            fullWidth={fieldsCount <= 1}
            label={
              fieldsCount > 1
                ? fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
                : null
            }
            multiline
            value={editContent[fieldName]}
            onChange={(e) => {
              e.persist();
              setEditContent((editContent) => ({
                ...editContent,
                [fieldName]: e.target.value,
              }));
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleUpdating(event, fieldName);
              }
            }}
            onBlur={() => {
              if (fieldsCount <= 1) {
                setEdit(false);
              }
              setEditContent((editContent) => ({
                ...editContent,
                [fieldName]: content[fieldName],
              }));
            }}
          />
        );
      }
    }
    return inputsArray;
  }

  let textArray = [];
  for (const key in content) {
    if (content.hasOwnProperty(key) && content[key] && content[key] !== "") {
      textArray.push(content[key]);
    }
  }

  if (textArray.length > 0)
    return (
      <p className={classes.fieldContentP}>
        {childrenLeft ? children : ""}
        {onlyChildren ? children : textArray.join(", ")}
        <PencilEditIcon onClick={handleEditClick} />
        {!childrenLeft && !onlyChildren ? children : ""}
      </p>
    );

  //// empty fields
  return (
    <p className={`${classes.notAvailableP} ${classes.fieldContentP}`}>
      {childrenLeft ? children : ""}
      Not Available{name ? " " + name : ""}
      <PencilEditIcon onClick={handleEditClick} />
      {!childrenLeft ? children : ""}
    </p>
  );
}
