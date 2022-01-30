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
import CopyPurchaseInfo from 'components/ContactDetailCard/components/FieldContent/CopyPurchaseInfo'
import { textFieldLabels, getHrefValue, LinkTypes, FieldTypes } from 'components/ContactDetailCard/components/FieldContent/helper'
import useStyles from 'components/ContactDetailCard/components/FieldContent/style'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import {timeZoneOptions} from  './timeZoneList';
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";
import loadashFilter from "lodash/filter";
import { contactStatusOptions } from "components/ContactDetailedInfo/helper";

const filter = createFilterOptions();
export default function FieldContent({
  children,
  id,
  isPurchased,
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
  disabled,
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

  const [getFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

  const [statusOptions, setStatusOptions] = useState([])
  useEffect(() => {
    getFilters({
      variables: {
          esIndex:'contacts_flat',
          filterKey: 'status.keyword',
          size: 50,
      },
    });
  },[])

  useEffect(() => {
    if(filtersData?.getESFilterList?.hits){
      let filterData = filtersData.getESFilterList.hits.map(hit => hit.key)
      for(let i = 0; i < contactStatusOptions.length; i++){
        filterData = filterData.filter(d => d !== contactStatusOptions[i].value && d !== contactStatusOptions[i].label)
      }
      for(let i = 0; i < contactStatusOptions.length; i++){
        filterData.push(contactStatusOptions[i].label)
      }
      setStatusOptions(filterData)
    }
  },[filtersData])
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
          <Status
            className={classes.maxWidth}
            options={statusOptions}
            setDocumentType={(value) => {
              let val = value.name
              const data = contactStatusOptions.find(s => s.label === val)
              if(data){
                val = data.value
              }
              setEditContent((editContent) => ({
                ...editContent,
                [fieldName]: val,
              }));          
            }}
            value={editContent[fieldName] === null ? "" : editContent[fieldName]}
          />:
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
      {!onlyChildren && !disabled && (
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
      {
        isPurchased && <CopyPurchaseInfo updateContact={updateContact} userId={stateApp.user.mongoId}  content={content} contactId={id} />
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
              className={classes.noTextDecoration} rel="noreferrer"
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



const Status = ({ setDocumentType, value, options, ...other }) => {
  const useStyles = makeStyles({
    inputRoot: {
      backgroundColor: "#ffffff",
    },
    listbox: {
      boxSizing: "border-box",
      "& ul": {
        padding: 0,
        margin: 0,
      },
    },
  });

  const classes = useStyles();

  const [search, setSearch] = useState(value)

  const onInputChange = (event, value) => {
    setSearch(value);
  };

  return (
    <Autocomplete
      defaultValue={search}
      value={search}
      disableListWrap
      classes={classes}
      options={
        options?.map((type) => {
          return { _id: type, name: type };
        }) ?? []
      }
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.name;
        }

        if (option?.name) return option.name;
        else return "";
      }}
      getOptionSelected={(option, value) => {
        return option?._id === search;
      }}
      renderOption={(option) => {
        if (option._id === "newEntity") return <Typography style={{ color: "midnightblue" }}>Add '{option.name}'</Typography>;

        return (
          <Grid container spacing={0}>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs>
                <span style={{ fontWeight: 400 }}>{option.name}</span>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
      onInputChange={onInputChange}
      filterOptions={(options, params) => {
        let inputValue = JSON.parse(JSON.stringify(search));
        if (inputValue.name) {
          inputValue = inputValue.name;
        }
        const filtered = filter(options, { ...params, inputValue });
        const isExist = loadashFilter(filtered, (filter) => {
          return filter._id === inputValue;
        });
        // Suggest the creation of a new value
        if (inputValue !== "" && (!isExist || isExist.length === 0)) {
          filtered.unshift({
            name: inputValue,
            _id: "newEntity",
          });
        }
        return filtered;
      }}
      onChange={(event, newValue) => {
        if (newValue && newValue._id) {
          if (newValue._id !== "newEntity") setDocumentType(newValue);
          else setDocumentType({ _id: "newEntity", name: newValue.name });
        } else setSearch("");
      }}
      renderInput={(params) => (
        <TextField
          margin="dense"
          {...params}
          InputProps={{
            ...params.InputProps,
          }}
          size="small"
        />
      )}
      {...other}
    />
  );
};


{/* <Select
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
              <MenuItem value='UnqualLead'> Unqualified Lead </MenuItem>
              <MenuItem value='QualLead'> Qualified Lead </MenuItem>
              <MenuItem value='Contact'> Contact </MenuItem>
            </Select> */}