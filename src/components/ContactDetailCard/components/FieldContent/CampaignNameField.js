import React, { useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ClearIcon from "@material-ui/icons/Clear";
import { useLazyQuery } from "@apollo/client";

import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import "components/Shared/Tagger.css";
import { copy } from 'utils/helper';

import capitalizeFirstLetter from "components/Shared/valueformatters/capitalize-first-letter.js";

const useStyles = makeStyles((theme) => ({
  rootDiv: {
    "& > * + *": {
      marginTop: theme.spacing(5),
    },
    "& .MuiAutocomplete-clearIndicator": {
      display: "none",
    },
  },
  switchButtom: {
    float: "right",
    width: "fit-content",
    alignSelf: "flex-end",
    marginRight: 0,
    "& span.MuiTypography-body1": {
      fontSize: "0.9rem",
    },
  },
  switchTextDeselected: {
    color: "rgb(141, 141, 141)",
  },
  publicLeftBottom: {
    float: "none",
    flexDirection: "row",
    alignSelf: "unset",
    margin: 0,
    "& .MuiTypography-root": {
      display: "none",
    },
    "& .h4Before": { margin: "0 13px", color: "#202020 !important" },
    "& .h4After": { margin: "0 0 0 13px", color: "#B7B7B7 !important" },
  },
  chip: {
    "& .MuiChip-root": {
      backgroundColor: "#ECEDED",
      color: "#606060",
    },
  },
  input: {
    "& input": {
      caretColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "transparent"),
      color: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "#008ebf"),
      backgroundColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "#D5F4FF"),
      maxWidth: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "33px"),
      width: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "33px"),
      height: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "32px"),
      fontSize: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "25px"),
      margin: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "3px"),
      padding: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "0px !important"),
      borderRadius: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "50%"),
      textAlign: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "center"),
      cursor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "pointer"),
      "&:hover": {
        boxShadow: ({ showPlusAddIcon }) =>
          !showPlusAddIcon ? "" : "0px 2px 2px -1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.12), 0px 1px 10px 0px rgba(0,0,0,0.1)",
        backgroundColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? "" : "rgba(0, 0, 0, 0.08)"),
      },
      transition: ({ showPlusAddIcon }) =>
        !showPlusAddIcon
          ? ""
          : "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    },
  },
}));

export default function CampaignNameField(props) {
  const [tFActive, setTFActive] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [loadingTags, setLoadingTags] = useState(true);
  const [addInDropDown, setAddInDropDown] = useState(false);
  const [options, setOptions] = useState([]);

  const [getCampaignFilters, { data: campaignfiltersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

  const showPlusAddIcon = () => {
    if (tFActive || textValue ) return false;
    return true;
  };

  const classes = useStyles({ ...props, showPlusAddIcon: showPlusAddIcon() });

  useEffect(() => {
    if(options.length > 0) {
      setLoadingTags(false);
    }
  }, [options]);

  useEffect(() => {
    if(campaignfiltersData?.getESFilterList?.hits){
      const allFiltersData = campaignfiltersData.getESFilterList.hits.map(hit => hit.key)
      setOptions(allFiltersData.filter(d=> d))
    }
  },[campaignfiltersData]);

  useEffect(() => {
    getCampaignFilters({
      variables: {
          esIndex:'contacts_flat',
          filterKey: 'campaignName.keyword',
          size: 50,
      },
    });
  },[])

  const UpperAndCleanTagText = (tagText) => {
    return tagText
      .trim()
      .split(" ")
      .filter((word) => word !== "")
      .map((word) => capitalizeFirstLetter(word))
      .join(" ");
  };

  const NewTag = (tagText) => {
    tagText = UpperAndCleanTagText(tagText);
    if (addInDropDown && tagText === addInDropDown) {
      tagText = UpperAndCleanTagText(textValue);
    }
    setTextValue("");

    const value = copy(props.value)
    value.push(tagText);
    props.onChange(value)

  };

  const DeleteTag = (valueToRemove) => {
    const value = copy(props.value)
    const index = value.findIndex(v => v === valueToRemove)
    if(index > -1){
      value.splice(index,1);
      props.onChange(value)
    }
  };

  const handleChangeTags = (e, v) => {
    e.persist();

    if (e.key && e.key === "Enter") {
      NewTag(v[v.length - 1]);
    } else if (e.target.tagName === "svg" || e.target.tagName === "path") {
      let valueToRemove = '';
      if (e.target.tagName === "svg") {
        valueToRemove = e.target.parentNode.id;
      }
      if (e.target.tagName === "path") {
        valueToRemove = e.target.parentNode.parentNode.id;
      }
      DeleteTag(valueToRemove);
    } else {
      if (e.type === "click") {
        NewTag(e.target.innerText);
      }
    }
  };

  const cleanDropDownArray = () => {
    let cleanArray = options.filter((tag) => props.value.indexOf(tag) === -1);
    cleanArray = [...new Set(cleanArray)];
    cleanArray.sort();
    return { cleanArray };
  };

  useEffect(() => {
    if(textValue && options && props.value){
      const { cleanArray } = cleanDropDownArray();
      if (
        cleanArray.indexOf(UpperAndCleanTagText(textValue)) === -1 &&
        props.value.indexOf(UpperAndCleanTagText(textValue)) === -1 &&
        textValue.trim() !== ""
      ) {
        setAddInDropDown(`Add "${UpperAndCleanTagText(textValue)}"`);
      } else {
        setAddInDropDown(false);
      }
    }
  }, [textValue]);

  const AddingAddRowToDropDown = () => {
    let { cleanArray } = cleanDropDownArray();
    if (addInDropDown) {
      cleanArray.unshift(addInDropDown);
    }
    return cleanArray;
  };


  return (
    <div id="taggerRoot" className={classes.rootDiv}>
      {!loadingTags ? (
        <Grid container>
          <Grid item xs={12}>
            <Autocomplete
              className={classes.chip}
              multiple
              id="tags-outlined"
              onChange={(e, newValue) => {
                handleChangeTags(e, newValue);
              }}
              options={AddingAddRowToDropDown()}
              value={props.value}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((tag, index) => {
                    return (
                      <Chip
                        key={index}
                        id={tag}
                        label={tag}
                        {...getTagProps({ index })}
                        deleteIcon={<ClearIcon />}
                      />
                    );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant={"standard"}
                  className={classes.input}
                  placeholder={!showPlusAddIcon() ? "" : "+"}
                  fullWidth
                  value={textValue}
                  onChange={(e) => {
                    setTextValue(e.target.value);
                  }}
                  onClick={() => {
                    if (props.type === "textfield") {
                      setTFActive(true);
                    }
                  }}
                  onBlur={() => {
                    setTFActive(false);
                  }}
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      ) : (
        <CircularProgress color="secondary"></CircularProgress>
      )}
    </div>
  );
}

CampaignNameField.defaultProps = {
  type: "textfield",
};
