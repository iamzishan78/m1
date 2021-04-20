import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useMutation } from "@apollo/client";
import { UPDATECONTACT } from "graphQL/useMutationUpdateContact";
import {
  UPDATEMELISSA,
  UPDATEMELISSAADDRESS,
} from "graphQL/useMutationUpdateMelissaRecords";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AppContext } from "AppContext";
import ContactAutoComplete from "components/Shared/ContactAutoComplete";
import PencilEditIcon from 'components/ContactDetailCard/components/FieldContent/PencilEditIcon'
import MergeHistory from 'components/ContactDetailCard/components/FieldContent/MergeHistory'
import { textFieldLabels, getHrefValue, LinkTypes, FieldTypes } from 'components/ContactDetailCard/components/FieldContent/helper'
import useStyles from 'components/ContactDetailCard/components/FieldContent/style'
import Autocomplete from '@material-ui/lab/Autocomplete';
import {timeZoneOptions} from  './timeZoneList';

export default function FieldContent({
  children,
  id,
  entity,
  melissaRecordId = null,
  melissaAddressRecordId = null,
  content,
  childrenLeft,
  onlyChildren,
  name,
  noMargin,
  noInputFooter,
  linkType,
  fieldType = FieldTypes.Contact,
  isEdited = false,
  isMerged = false,
  ...props
}) {
  //////////// id - brings the contact id /////////////////////////////////////////////////////////////////////////
  //////////// entity - brings the entity id tide to the contact //////////////////////////////////////////////////
  //////////// melissaRecordId - brings the melissa record id tide to the contact /////////////////////////////////
  //////////// melissaAddressRecordId - brings the melissa address record id tide to the contact //////////////////
  //////////// content - brings an object with fielNames and values ///////////////////////////////////////////////
  //////////// childrenLeft - will move the chilren components to the left side of the field values//optional//////
  ////////////              - default childrens to rigth///////////////////////////////////////////////////////////
  //////////// onlyChildren - will show only the children components, no field values  //optional//////////////////
  //////////// name - will be part of the Not Available text, better use in compound fiels  //optional/////////////
  //////////// noMargin - no p tag margin  //optional//////////////////////////////////////////////////////////////
  //////////// noInputFooter //optional////////////////////////////////////////////////////////////////////////////
  //////////// linkType - LinkTypes value //optional///////////////////////////////////////////////////////////////
  //////////// fieldType - FieldTypes value //default value = Contact /////////////////////////////////////////////
  //////////// isEdited - if value previously edited, show corresponding icon //default value = false /////////////
  //////////// isMerged - if contact is created by merge or not ///////////////////////////////////////////////////

  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [edit, setEdit] = useState(null);
  const [editContent, setEditContent] = useState({ content });
  const [showContent, setShowContent] = useState(content);
  const [isCurEdited, setIsCurEdited] = useState(isEdited);
  const [fieldsCount, setFieldsCount] = useState(0);

  const [updateContact, { loading }] = useMutation(UPDATECONTACT);
  const [updateMelissa, { melissaLoading }] = useMutation(UPDATEMELISSA);
  const [updateMelissaAddress, { melissaAddressLoading }] = useMutation(
    UPDATEMELISSAADDRESS
  );
  const classes = useStyles({ noMargin, loading, fieldsCount });

  // contactOwnerId field used in autocomplete of contact owner
  const ignorableFieldsInCount = ['contactOwnerId'];

  useEffect(() => {
    if (content) {
      setEditContent({ ...content });
      setShowContent({ ...content });


      let count = 0;
      for (const fieldName in content) {
        if (content.hasOwnProperty(fieldName) && !ignorableFieldsInCount.includes(fieldName)) {
          count++;
        }
      }
      setFieldsCount(count);
    }
  }, [content]);

  useEffect(() => { 
    editContent.status && handleUpdating()
  }, [editContent.status]);

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
    if (fieldType == FieldTypes.Contact) {
      let trimmedEditContent = {
        _id: id,
        lastUpdateBy: stateApp.user.mongoId,
      };

      if (entity) trimmedEditContent.entity = entity;
      let differences = false;
      for (const field in editContent) {
        if (editContent[field] !== null && editContent[field] !== undefined) {
          trimmedEditContent[field] = editContent[field].trim();
          if (editContent[field].trim() !== content[field]) differences = true;
        }
      }

      if (differences) {
        updateContact({
          variables: {
            contact: trimmedEditContent,
            ignoreResponse: true,
          },
          refetchQueries: [
            "getPaginatedContacts",
            "getContact",
            "getparcelOwners",
          ],
          awaitRefetchQueries: false,
        }).then((res) => {
          let entries = Object.entries(editContent);
          entries.forEach((entry) => {
            content = { ...content, [entry[0]]: entry[1] }
          });
          setShowContent({ ...content });
          setEditContent({ ...content });
          setStateApp({ ...stateApp, contactUpdated: id });
        });
      }
    } else if (fieldType == FieldTypes.MelissaRecord) {
      let entries = Object.entries(editContent)[0];
      let key = entries[0];
      let updatedValue = entries[1];
      updateMelissa({
        variables: {
          melissaRecord: {
            _id: melissaRecordId,
            [key]: updatedValue,
          },
        },
        refetchQueries: ["getLastMelissaRecord"],
        awaitRefetchQueries: true,
      }).then((res) => {
        setIsCurEdited(true);
        let entries = Object.entries(editContent);
        entries.forEach((entry) => {
          content = { ...content, [entry[0]]: entry[1] }
        });
        setShowContent({ ...content });
        setEditContent({ ...content });
      });
    } else if (fieldType == FieldTypes.MelissaAddressRecord) {
      let entries = Object.entries(editContent)[0];
      let key = entries[0];
      let updatedValue = entries[1];
      updateMelissaAddress({
        variables: {
          melissaAddressRecord: {
            _id: melissaAddressRecordId,
            [key]: updatedValue,
          },
        },
        refetchQueries: ["getLastMelissaRecord"],
        awaitRefetchQueries: true,
      }).then((res) => {
        setIsCurEdited(true);
        let entries = Object.entries(editContent);
        entries.forEach((entry) => {
          content = { ...content, [entry[0]]: entry[1] }
        });
        setShowContent({ ...content });
        setEditContent({ ...content });
      });
    }
    setEdit(null);
  };

  let inputsArray = [];
  if (edit) {
    for (const fieldName in editContent) {

      if (fieldName === 'contactOwner' || fieldName === 'contactOwnerId') {
        if (fieldName === 'contactOwner')
          inputsArray.push(
            <ContactAutoComplete
              value={editContent.contactOwnerId ? editContent.contactOwnerId : ''}
              onChange={(e, user) => {
                setEditContent({ 'contactOwner': user.text, 'contactOwnerId': user.value });
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === "Escape") {
                  setEdit(null);
                  setEditContent({ 'contactOwner': content.contactOwner, 'contactOwnerId': content.contactOwnerId });
                }
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleUpdating();
                }
              }}
              onBlur={() => {
                setEdit(null);
                setEditContent({ 'contactOwner': content.contactOwner, 'contactOwnerId': content.contactOwnerId });
              }}
            />
          )
      }

      else if (editContent.hasOwnProperty(fieldName)) {
        inputsArray.push(
          fieldName === 'status' ? 
            <Select
            labelId="status-label"
            id="status-select"
            className={classes.editSelectField}
            value={editContent[fieldName] === null ? "" : editContent[fieldName]}
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
            >
              <MenuItem value='Active'> Active </MenuItem>
              <MenuItem value='Inactive'> Inactive </MenuItem>
            </Select>:
            fieldName === 'timeZone' ?
            <Autocomplete
            id={"fieldContentInput" + fieldName}
            key={"fieldContentInput" + fieldName}
            options={timeZoneOptions}
            getOptionLabel={(option) => option.title || editContent[fieldName]}
            style={{ width: 300 }}
            onChange={(e,data) => {
              e.persist();
              setEditContent((editContent) => ({
                ...editContent,
                [fieldName]: data?.title || ""
              }));
            }}
            value={
              editContent[fieldName] === null ? "" : editContent[fieldName]
            }
            autoComplete
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
            style={{width:'100%'}}
            renderInput={(params) => 
              <TextField 
              {...params}  
              label={fieldsCount > 1 ? textFieldLabels(fieldName) : null} 
              className={classes.editTextField}
              />
            }
            /> :
            <TextField
            key={"fieldContentInput" + fieldName}
            id={"fieldContentInput" + fieldName}
            className={classes.editTextField}
            variant="outlined"
            size="small"
            autoComplete="nope"
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
  for (const key in showContent) {
    if (
      showContent.hasOwnProperty(key) &&
      showContent[key] &&
      showContent[key] !== ""
    ) {
      if (
        key === "zip" ||
        key === "country" ||
        key === "zipAlt" ||
        key === "countryAlt" ||
        key === "title" ||
        key === "firstName" ||
        key === "middleName" ||
        key === "lastName" ||
        key === "suffix"
      ) {
        textArray = [[textArray.join(", "), showContent[key]].join(" ")];
      } else if (key === "jobTitle") {
        textArray = [[textArray.join(", "), showContent[key]].join(" - ")];
      } else if (key === "contactOwner" || key === "contactOwnerId") {
        if (key === "contactOwner")
          textArray.push(showContent[key] || '');

      } else textArray.push(showContent[key]);
    }
  }

  const renderOutput = (
    <span>
      {childrenLeft && !onlyChildren && children ? children : ""}
      {textArray.length > 0
        ? onlyChildren
          ? children
            ? children
            : ""
          : textArray.join(", ")
        : `${name ? name + " " : ""} Not Available`}
      {!onlyChildren && (
        <PencilEditIcon
          handleUpdating={handleUpdating}
          anchorEl={edit}
          setAnchorEl={setEdit}
          content={inputsArray}
          onClick={handleEditClick}
        />
      )}
      {
        fieldType == FieldTypes.Contact && isMerged && <MergeHistory handleUpdating={handleUpdating} content={content} contactId={id} />
      }

      {!childrenLeft && !onlyChildren && children ? children : ""}
      {isCurEdited ? " (edited)" : ""}
    </span>
  );

  return (
    <React.Fragment>
      <p
        className={`${textArray.length === 0 ? classes.notAvailableP : ""} ${classes.fieldContentP
          }`}
      >
        {(linkType == LinkTypes.Mail || linkType == LinkTypes.Simple) &&
          textArray.length > 0 ? (
            <a
              href={getHrefValue(textArray.join(", "), linkType)}
              target="_blank"
              className={classes.noTextDecoration}
            >
              {renderOutput}
            </a>
          ) : (
            renderOutput
          )}
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
