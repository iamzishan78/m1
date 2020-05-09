import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import TextField from "@material-ui/core/TextField";
import EditionPopover from "./EditionPopover";
import { useMutation } from "@apollo/react-hooks";
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";
import CircularProgress from "@material-ui/core/CircularProgress";
import { USERBYEMAIL } from "../../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed
import { useLazyQuery } from "@apollo/react-hooks"; //////////////temporary while signed user fixed
import { AppContext } from "../../../AppContext"; //////////////temporary while signed user fixed

const useStyles = makeStyles((theme) => ({
  fieldContentP: {
    visibility: ({ loading }) => (loading ? "hidden" : "visible"),
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
  loader: {
    position: "relative",
    top: "-37px",
    left: "10px",
  },
}));

function PencilEditIcon({ onClick, anchorEl, setAnchorEl, content }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <EditionPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
        <Grid container spacing={0} style={{ width: "200px" }}>
          {content.map((textF) => (
            <Grid item xs={12}>
              {textF}
            </Grid>
          ))}
        </Grid>
      </EditionPopover>
      <Tooltip title={"Edit"}>
        <IconButton
          size="small"
          onClick={(e) => {
            onClick(e);
          }}
        >
          <CreateTwoToneIcon
            id="contPencilIcon"
            className={classes.pencilIcon}
          />
        </IconButton>
      </Tooltip>
    </React.Fragment>
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

  const [edit, setEdit] = useState(null);
  const [editContent, setEditContent] = useState({ content });
  const [fieldsCount, setFieldsCount] = useState(0);

  const [updateContact, { loading }] = useMutation(UPDATECONTACT);
  console.log("loadinnnnnnnnnnnnnnnnnnnn", loading);
  const classes = useStyles({ noMargin, loading });

  //////begin////////temporary  while signed user fixed

  const [stateApp] = React.useContext(AppContext);
  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
  const [user, setUser] = useState({ _id: "" });

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email,
        },
      });
    }
  }, [stateApp.user.email]);

  useEffect(() => {
    if (dataUser && dataUser.userByEmail) {
      setUser(dataUser.userByEmail);
    }
  }, [dataUser]);

  /////end/////////temporary while signed user fixed

  useEffect(() => {
    if (content) {
      setEditContent({ ...content });

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
    e.persist();
    e.preventDefault();
    setEdit(!edit ? e.currentTarget : null);
  };

  const handleUpdating = (event, fieldName) => {
    // content[fieldName] = event.target.value.trim();
    updateContact({
      variables: {
        contact: {
          _id: id,
          [fieldName]: event.target.value.trim(),
          lastUpdateBy: user._id, ///stateApp.user////temporary while signed user fixed
        },
      },
      refetchQueries: ["getContacts", "getContactsByOwnerId", "getContact"],
      awaitRefetchQueries: true,
    });

    if (fieldsCount <= 1) {
      setEdit(null);
    }
  };

  let inputsArray = [];
  if (edit) {
    for (const fieldName in editContent) {
      if (editContent.hasOwnProperty(fieldName)) {
        inputsArray.push(
          <TextField
            key={"fieldContentInput" + fieldName}
            id={"fieldContentInput" + fieldName}
            className={classes.editTextField}
            variant="outlined"
            size="small"
            fullWidth
            label={
              fieldsCount > 1
                ? fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
                : null
            }
            multiline
            value={
              editContent[fieldName] === null ? "" : editContent[fieldName]
            }
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
                setEdit(null);
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

    if (fieldsCount <= 1) {
      return inputsArray; /////return an input if only one field
    }
  }

  let textArray = [];
  for (const key in content) {
    if (content.hasOwnProperty(key) && content[key] && content[key] !== "") {
      textArray.push(content[key]);
    }
  }

  return (
    <React.Fragment>
      <p
        className={`${textArray.length === 0 ? classes.notAvailableP : ""} ${
          classes.fieldContentP
        }`}
      >
        {childrenLeft && !onlyChildren ? children : ""}
        {textArray.length > 0
          ? onlyChildren
            ? children
            : textArray.join(", ")
          : `${name ? name + " " : ""} Not Available`}
        <PencilEditIcon
          anchorEl={edit}
          setAnchorEl={setEdit}
          content={inputsArray}
          onClick={handleEditClick}
        />
        {!childrenLeft && !onlyChildren ? children : ""}
      </p>
      {loading && (
        <div style={{ height: "0", width: "0" }}>
          <CircularProgress
            id="xoxoxoxoxo"
            className={classes.loader}
            size={22}
            color="secondary"
          ></CircularProgress>
        </div>
      )}
    </React.Fragment>
  );
}
