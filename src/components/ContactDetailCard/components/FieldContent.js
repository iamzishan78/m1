import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import TextField from "@material-ui/core/TextField";
import EditionPopover from "./EditionPopover";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import CheckSharpIcon from "@material-ui/icons/CheckSharp";
import Button from "@material-ui/core/Button";
import { useMutation } from "@apollo/react-hooks";
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  fieldContentP: {
    visibility: ({ loading }) => (loading ? "hidden" : "visible"),
    margin: ({ noMargin }) => (noMargin ? "0" : "5px 10px"),
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
    paddingRight: ({ fieldsCount }) => (fieldsCount > 1 ? null : "0"),
    "& .MuiInputBase-root": {
      fontSize: "0.875rem",
      padding: "9px 10px",
      lineHeight: "1.43",
    },
  },
  notAvailableP: { color: "#bababaab", fontSize: "13px" },
  loader: {
    position: "relative",
    top: "-37px",
    left: "10px",
  },
  popoverButton: {
    margin: "0 0 4px 8px",
    padding: "2px",
    minWidth: "0",
    "& .MuiButton-startIcon.MuiButton-iconSizeSmall": { margin: "0" },
  },
  buttonsRow: { textAlign: "right", top: "-2px", position: "relative" },
  foodText: {
    zIndex: "50",
    position: "absolute",
    right: "5px",
    bottom: "14px",
    fontSize: "10px",
    color: "#6e6e6e",
    margin: "0 !important",
    textAlign: "right",
    height: "0",
    paddingRight: "0",
    "& span": {
      fontWeight: "bold",
    },
  },
}));

function PencilEditIcon({
  onClick,
  anchorEl,
  setAnchorEl,
  content,
  handleUpdating,
}) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <EditionPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
        <Grid container spacing={0} style={{ width: "200px" }}>
          <Grid className={classes.buttonsRow} item xs={12}>
            <Button
              variant="contained"
              size="small"
              variant="outlined"
              className={classes.popoverButton}
              startIcon={<CheckSharpIcon />}
              onClick={() => {
                handleUpdating();
              }}
            >
              {" "}
            </Button>
            <Button
              variant="contained"
              size="small"
              variant="outlined"
              className={classes.popoverButton}
              startIcon={<ClearSharpIcon />}
              onClick={() => {
                setAnchorEl(null);
              }}
            >
              {" "}
            </Button>
          </Grid>

          {content.map((textF, i) => (
            <Grid key={i} item xs={12} style={{ marginBottom: "8px" }}>
              {textF}
            </Grid>
          ))}
        </Grid>
      </EditionPopover>
      <Tooltip title={"Edit"} placement="top">
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

const textFieldLabels = (field) => {
  const fieldsOpt = [
    "companyName",
    "jobTitle",
    "address2Alt",
    "address1Alt",
    "cityAlt",
    "stateAlt",
    "zipAlt",
    "countryAlt",
    "zip",
  ];
  const labelsOpt = [
    "Company Name",
    "Job Title",
    "Address2",
    "Address1",
    "City",
    "State",
    "ZipCode",
    "Country",
    "ZipCode",
  ];

  if (fieldsOpt.indexOf(field) !== -1) {
    return labelsOpt[fieldsOpt.indexOf(field)];
  }

  return field.charAt(0).toUpperCase() + field.slice(1);
};

export default function FieldContent({
  children,
  id,
  content,
  childrenLeft,
  onlyChildren,
  name,
  noMargin,
  noInputFooter,
}) {
  //////////// id - brings the contact id /////////////////////////////////////////////////////////////////////////
  //////////// content - brings an object with fielNames and values ///////////////////////////////////////////////
  //////////// childrenLeft - will move the chilren components to the left side of the field values//optional//////
  ////////////              - default childrens to rigth///////////////////////////////////////////////////////////
  //////////// onlyChildren - will show only the children components, no field values  //optional//////////////////
  //////////// name - will be part of the Not Available text, better use in compound fiels  //optional/////////////
  //////////// noMargin - no p tag margin  //optional//////////////////////////////////////////////////////////////
  //////////// noInputFooter //optional////////////////////////////////////////////////////////////////////////////

  const [stateApp] = React.useContext(AppContext);
  const [edit, setEdit] = useState(null);
  const [editContent, setEditContent] = useState({ content });
  const [fieldsCount, setFieldsCount] = useState(0);

  const [updateContact, { loading }] = useMutation(UPDATECONTACT);
  const classes = useStyles({ noMargin, loading, fieldsCount });

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
    if (fieldsCount <= 1) {
      let fieldName;
      for (const key in editContent) {
        fieldName = key;
        break;
      }
      if (document.getElementById("fieldContentInput" + fieldName))
        document.getElementById("fieldContentInput" + fieldName).focus();
    }
  }, [edit]);

  const handleEditClick = (e) => {
    e.persist();
    e.preventDefault();
    setEdit(!edit ? e.currentTarget : null);
  };

  const handleUpdating = () => {
    let trimmedEditContent = {
      _id: id,
      lastUpdateBy: stateApp.user.mongoId,
    };
    let differences = false;
    for (const field in editContent) {
      if (editContent[field] !== null) {
        trimmedEditContent[field] = editContent[field].trim();
        if (editContent[field].trim() !== content[field]) differences = true;
      }
    }

    if (differences) {
      updateContact({
        variables: {
          contact: trimmedEditContent,
        },
        refetchQueries: ["getContacts", "getContactsByOwnerId", "getContact"],
        awaitRefetchQueries: true,
      });
    }

    setEdit(null);
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
            label={fieldsCount > 1 ? textFieldLabels(fieldName) : null}
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
              event.stopPropagation();
              if (event.key === "Escape") {
                if (fieldsCount <= 1) {
                  setEdit(null);
                  setEditContent((editContent) => ({
                    ...editContent,
                    [fieldName]: content[fieldName],
                  }));
                }
              }

              if (event.key === "Enter") {
                event.preventDefault();
                handleUpdating();
              }
            }}
            onBlur={() => {
              if (fieldsCount <= 1) {
                setEdit(null);
                setEditContent((editContent) => ({
                  ...editContent,
                  [fieldName]: content[fieldName],
                }));
              }
            }}
          />
        );
      }
    }

    if (fieldsCount <= 1) {
      return [
        inputsArray,
        noInputFooter ? null : (
          <p key="2" className={classes.foodText}>
            <span>Return</span> to save
          </p>
        ),
      ]; /////return an input if only one field
    }
  }

  let textArray = [];
  for (const key in content) {
    if (content.hasOwnProperty(key) && content[key] && content[key] !== "") {
      if (
        key === "zip" ||
        key === "country" ||
        key === "zipAlt" ||
        key === "countryAlt"
      ) {
        textArray = [[textArray.join(", "), content[key]].join(" ")];
      } else if (key === "jobTitle") {
        textArray = [[textArray.join(", "), content[key]].join(" - ")];
      } else textArray.push(content[key]);
    }
  }

  return (
    <React.Fragment>
      <p
        className={`${textArray.length === 0 ? classes.notAvailableP : ""} ${
          classes.fieldContentP
        }`}
      >
        {childrenLeft && !onlyChildren && children ? children : ""}
        {textArray.length > 0
          ? onlyChildren
            ? children
              ? children
              : ""
            : textArray.join(", ")
          : `${name ? name + " " : ""} Not Available`}
        <PencilEditIcon
          handleUpdating={handleUpdating}
          anchorEl={edit}
          setAnchorEl={setEdit}
          content={inputsArray}
          onClick={handleEditClick}
        />
        {!childrenLeft && !onlyChildren && children ? children : ""}
      </p>
      {loading && (
        <div style={{ height: "0", width: "0" }}>
          <CircularProgress
            className={classes.loader}
            size={22}
            color="secondary"
          ></CircularProgress>
        </div>
      )}
    </React.Fragment>
  );
}
