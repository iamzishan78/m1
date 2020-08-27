import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import TextField from "@material-ui/core/TextField";
import EditionPopover from "../../../../ContactDetailCard/components/EditionPopover";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import CheckSharpIcon from "@material-ui/icons/CheckSharp";
import Button from "@material-ui/core/Button";
import { useMutation } from "@apollo/react-hooks";
import { UPDATEPARCELOWNER } from "../../../../../graphQL/useMutationUpdateParcelOwner";
import { UPDATECONTACT } from "../../../../../graphQL/useMutationUpdateContact";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "../../../../../AppContext";
import Autocomplete from "@material-ui/lab/Autocomplete";
import $ from "jquery";

const useStyles = makeStyles((theme) => ({
  fieldContentP: {
    visibility: ({ loading, edit, fieldsCount, dropDownOptions }) =>
      loading || (edit && fieldsCount <= 1 && !dropDownOptions)
        ? "hidden"
        : "visible",
    margin: "0",
    width: ({ noMargin }) => {
      if (noMargin) return "fit-content";
    },
    borderRadius: "4px",

    whiteSpace: "pre-wrap",
  },
  pencilIcon: {
    fontSize: "22px",
  },
  editTextField: {
    position: ({ fieldsCount, dropDownOptions }) =>
      fieldsCount > 1 || dropDownOptions ? null : "absolute",
    top: "0",
    left: "0",
    zIndex: "50",
    paddingRight: ({ fieldsCount, dropDownOptions }) =>
      fieldsCount > 1 || dropDownOptions ? null : "20px",
    "& .MuiInputBase-root": {
      backgroundColor: "#fff",
      fontSize: "0.875rem",
      padding: "10px",
      lineHeight: "1.43",
    },
    "& textarea": {
      width: "inherit",
    },
  },
  notAvailableP: { color: "#898989b0", fontSize: "13px" },
  loader: {
    top: "calc( 50% - 11px)",
    left: "10px",
    position: "absolute",
  },
  popoverButton: {
    margin: "0 0 4px 8px",
    padding: "2px",
    minWidth: "0",
    "& .MuiButton-startIcon.MuiButton-iconSizeSmall": { margin: "0" },
  },
  buttonsRow: { textAlign: "right", top: "-2px", position: "relative" },
  foodText: {
    position: "absolute",
    // bottom: "0",
    // right: "0",
    bottom: "14px",
    zIndex: "51",
    right: "3px",
    fontSize: "10px",
    color: "#6e6e6e",
    margin: "0 !important",
    textAlign: "right",
    height: "0",
    paddingRight: "20px",
    "& span": {
      fontWeight: "bold",
    },
  },
  cellDataDiv: {
    minWidth: "100px",
    padding: "10px 30px 10px 10px",
    position: "relative",
    borderRadius: "7px",
    cursor: "text",
    "&:hover": {
      backgroundColor: ({ edit }) => (edit ? null : "#fff"),
      "& .hiddenEditIcons": {
        visibility: ({ edit }) => (edit ? null : "visible"),
      },
    },
  },
  hiddenEditIcons: {
    position: "absolute",
    right: "0",
    top: "Calc(50% - 13px)",
    visibility: "hidden",
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
      <EditionPopover
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Grid container spacing={0} style={{ width: "200px" }}>
          <Grid className={classes.buttonsRow} item xs={12}>
            <Button
              variant="contained"
              size="small"
              variant="outlined"
              className={classes.popoverButton}
              startIcon={<CheckSharpIcon />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUpdating();
              }}
            />
            <Button
              variant="contained"
              size="small"
              variant="outlined"
              className={classes.popoverButton}
              startIcon={<ClearSharpIcon />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAnchorEl(null);
              }}
            />
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
            e.preventDefault();
            e.stopPropagation();
            onClick(e);
          }}
          className={`hiddenEditIcons ${classes.hiddenEditIcons}`}
        >
          <CreateTwoToneIcon fontSize="small" color="secondary" />
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

export default function CellContentEdition({
  children,
  id,
  content,
  childrenLeft,
  onlyChildren,
  name,
  noInputFooter,
  targetLabel,
  dropDownOptions,
  entityId,
}) {
  //////////// id - brings the object id //////////////////////////////////////////////////////////////////////////
  //////////// content - brings an object with fielNames and values ///////////////////////////////////////////////
  //////////// childrenLeft - will move the chilren components to the left side of the field values//optional//////
  ////////////              - default childrens to rigth///////////////////////////////////////////////////////////
  //////////// onlyChildren - will show only the children components, no field values  //optional//////////////////
  //////////// name - will be part of the Not Available text, better use in compound fiels  //optional/////////////
  //////////// noInputFooter //optional////////////////////////////////////////////////////////////////////////////
  //////////// targetLabel - brings the object type we are updating here //////////////////////////////////////////
  //////////// dropDownOptions - brings an array in case of autocomplete //////////////////////////////////////////
  //////////// entityId //optional////////////////////////////////////////////////////////////////////////////

  const [stateApp] = React.useContext(AppContext);
  const [edit, setEdit] = useState(null);
  const [editContent, setEditContent] = useState({ content });
  const [cellId, setCellId] = useState(0);
  const [fieldsCount, setFieldsCount] = useState(0);

  const [updateContact, { loading: loadingUpdContact }] = useMutation(
    UPDATECONTACT
  );
  const [updateParcelOwner, { loading: loadingUpdPOwner }] = useMutation(
    UPDATEPARCELOWNER
  );
  const classes = useStyles({
    loading: loadingUpdContact || loadingUpdPOwner,
    fieldsCount,
    dropDownOptions,
    edit,
  });

  const toStart = () => {
    if (content) {
      setEditContent({ ...content });

      let count = 0;
      let cId = "";
      for (const fieldName in content) {
        if (content.hasOwnProperty(fieldName)) {
          count++;
          cId += fieldName;
        }
      }
      setFieldsCount(count);
      setCellId(cId);
    }
  };

  useEffect(() => {
    toStart();
  }, [content]);

  useEffect(() => {
    if (fieldsCount <= 1 && !dropDownOptions) {
      //// set focus
      let fieldName;
      for (const key in editContent) {
        fieldName = key;
        break;
      }
      if (document.getElementById("fieldContentInput" + id + fieldName))
        document.getElementById("fieldContentInput" + id + fieldName).focus();

      //// resize height to fit its content, using jQuery
      if (edit === false) {
        $(document).ready(function () {
          if (
            $("#" + id + fieldName) &&
            $("#fieldContentInput" + id + fieldName) &&
            !$("#fieldContentInput" + id + fieldName).height()
          ) {
            $("#" + id + fieldName).css({
              height: "auto",
            });
          }
        });
      }
    }
  }, [edit, fieldsCount]);

  const handleEditClick = (e) => {
    e.persist();
    e.preventDefault();
    setEdit(!edit ? e.currentTarget : false);
  };

  const handleUpdating = () => {
    let trimmedEditContent = { _id: id };
    let differences = false;
    for (const field in editContent) {
      if (editContent[field] !== null) {
        trimmedEditContent[field] = editContent[field].trim();
        if (editContent[field].trim() !== content[field]) differences = true;
      }
    }

    if (differences) {
      if (targetLabel === "contact") {
        trimmedEditContent.lastUpdateBy = stateApp.user.mongoId;
        trimmedEditContent.entity = entityId;
        updateContact({
          variables: {
            contact: trimmedEditContent,
          },
          refetchQueries: ["getContacts", "getContactsByOwnerId", "getContact"],
          awaitRefetchQueries: true,
        });
      }
      if (targetLabel === "Parcel Owner") {
        trimmedEditContent.ownerEntityId = entityId;
        updateParcelOwner({
          variables: {
            parcelOwner: trimmedEditContent,
          },
          refetchQueries: ["getCustomLayer"],
          awaitRefetchQueries: true,
        });
      }
      //// add here your mutation for another targetLabel
    }

    setEdit(false);
  };

  let inputsArray = [];

  if (edit) {
    for (const fieldName in editContent) {
      if (editContent.hasOwnProperty(fieldName)) {
        inputsArray.push(
          !dropDownOptions ? (
            <TextField
              key={"fieldContentInput" + id + fieldName}
              id={"fieldContentInput" + id + fieldName}
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
                    setEdit(false);
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
              onBlur={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (fieldsCount <= 1) {
                  setEdit(false);
                  setEditContent((editContent) => ({
                    ...editContent,
                    [fieldName]: content[fieldName],
                  }));
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          ) : (
            <Autocomplete
              key={"fieldContentInput" + id + fieldName}
              id={"fieldContentInput" + id + fieldName}
              className={classes.editTextField}
              options={dropDownOptions}
              getOptionLabel={(option) => option}
              value={
                editContent[fieldName] === null ? "" : editContent[fieldName]
              }
              onChange={(e, newInputValue) => {
                setEditContent((editContent) => ({
                  ...editContent,
                  [fieldName]: newInputValue,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  fullWidth
                  label={fieldsCount > 1 ? textFieldLabels(fieldName) : null}
                  multiline
                />
              )}
            />
          )
        );
      }
    }
  }

  //// ajusting the main div height to the input heigth, using jQuery
  if (fieldsCount <= 1 && !dropDownOptions) {
    $(document).ready(function () {
      if (
        $("#" + id + cellId) &&
        $("#fieldContentInput" + id + cellId) &&
        $("#fieldContentInput" + id + cellId).height()
      ) {
        $("#" + id + cellId).css({
          height: $("#fieldContentInput" + id + cellId).height() + 20,
        });
      }
    });
  }

  //// joining all fields content
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

  //// add "Return to save" footer
  const inputsArrayWithFooter = () => {
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
  };

  return (
    <div
      id={id + cellId}
      className={classes.cellDataDiv}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {edit && !dropDownOptions && fieldsCount <= 1 && inputsArrayWithFooter()}
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
          anchorEl={
            (edit && fieldsCount > 1) || (edit && dropDownOptions) ? edit : null
          }
          setAnchorEl={(e) => {
            setEdit(e);
            toStart();
          }}
          content={inputsArray}
          onClick={handleEditClick}
        />
        {!childrenLeft && !onlyChildren && children ? children : ""}
      </p>
      {(loadingUpdContact || loadingUpdPOwner) && (
        <div style={{ height: "0", width: "0" }}>
          <CircularProgress
            className={classes.loader}
            size={22}
            color="secondary"
          ></CircularProgress>
        </div>
      )}
    </div>
  );
}
