import React, { useEffect, useState, Fragment, useContext } from "react";
import moment from "moment";
import { get } from "lodash";
import { useLazyQuery } from "@apollo/client";
import { Controller } from "react-hook-form";
import { Grid, TextField, Button, Select, MenuItem, Tooltip, IconButton, makeStyles, InputAdornment } from "@material-ui/core";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { Clear } from "@material-ui/icons";
import { useStyles as summaryStyles } from "../style";
import AddIcon from "@material-ui/icons/Add";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import fieldsData from "./data";

import keys from "components/Shared/SpreadsheetGrid/kit/keymap";
import AutoCompleteTypeComponent from "components/Shared/Forms/Fields/AutoCompleteType";
import MetaField from "components/Table/helpers/MetaField";
import { copy } from "utils/helper";
import { getCustomMetaFields } from "components/Shared/Agreement/helpers";

import { AppContext } from "AppContext";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";
import NumberField from "components/Shared/components/Fields/NumberField";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showInfoMessage } from "actions";
import ReactSelectField from "components/Shared/M1nTable/components/SubComponents/ReactSelectField";
import StateField from "components/Revenue/components/Properties/DetailComponents/State";
import CountyField from "components/Revenue/components/Properties/DetailComponents/County";

const useStyles = makeStyles((theme) => ({
  valueOveridden: {
    "& .MuiInputBase-input": {
      color: "#01B0F0 !important",
      fontWeight: "bold !important",
    },
  },
  valueNormal: {
    "& .MuiInputBase-input": {
      color: "inherit !important",
      fontWeight: "normal !important",
    },
  },
}));

export default function FieldsSection({ updateAgreement, control, agreementDetails }) {
  const classes = summaryStyles();
  const overrideClasses = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [fieldsList, setFieldsList] = useState([]);
  const [editIconState, setEditIconState] = useState({});
  const [agreementDetailCopied, setAgreementCopied] = useState();
  const [state, setState] = useState();
  const [county, setCounty] = useState();
  const history = useHistory();
  const dispatch = useDispatch();

  const [isAcquisitionCostOverridden, setIsAcquisitionCostOverridden] = useState(
    agreementDetails?.totalAcquisitionCost !== agreementDetails?.calculated?.totalAcquisitionCost
  );

  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

  useEffect(() => {
    document.addEventListener("keydown", onGlobalKeyDown, false);
    document.addEventListener("blur", (e) => { });
  }, []);

  useEffect(() => {
    if (agreementDetails?._id && !agreementDetails?.agreementNumber) dispatch(showInfoMessage("Agreement Number is required"));
  }, [agreementDetails?._id]);

  useEffect(() => {
    setAgreementCopied(agreementDetails);
  }, [agreementDetails]);

  useEffect(() => {
    getMetaData({
      variables: {
        user: stateApp.user?.mongoId,
        category: "Agreement",
      },
    });
  }, []);

  useEffect(() => {
    return history.listen((location) => {
      if (!agreementDetails?.agreementNumber) {
        setStateApp((state) => ({
          ...state,
          selectedShape: null,
        }));
        history.goBack();
      }
    });
  }, [history, agreementDetails]);

  useEffect(() => {
    const customData = getCustomMetaFields(agreementDetails, metaDataRes);
    setFieldsList([...fieldsData(stateApp.user), ...customData]);
    if (agreementDetails?.originalProperties?.State || agreementDetails?.originalProperties?.StateAbbreviation) {
      setState(agreementDetails.originalProperties.State || agreementDetails.originalProperties.StateAbbreviation)
    }
    if (agreementDetails?.originalProperties?.County) {
      setCounty(agreementDetails.originalProperties.County)
    }
  }, [metaDataRes, agreementDetails]);

  const onGlobalKeyDown = (e) => {
    const id = e?.target?.id;

    if (e.keyCode === keys.TAB) {
      if (e.shiftKey) {
        if (!document.getElementById(`field-${Number(id.split("-")[1]) - 1}`)) {
          e.preventDefault();
          return;
        } else document.getElementById(`field-${Number(id.split("-")[1])}`).focus();
      }
    }
  };

  const offClickHandler = (key, value, isCustom) => {
    updateAgreement(key, value, isCustom);
  };

  const addAgreementCustomData = (data) => {
    const customData = copy(agreementDetails.custom_data) ?? {};
    data.forEach((d) => {
      if (!customData[d.name]) customData[d.name] = null;
    });
    updateAgreement("custom_data", customData);
  };

  return (
    <Grid container direction="row" display="flex" justify="space-between" alignItems="center" className={classes.fieldsSection}>
      {fieldsList.map((field, index) => (
        <Grid item xs={12} key={index + field.label + field.key}>
          <Grid container className={classes.gridStyle} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid
              item
              xs={3}
              onMouseEnter={() => {
                setEditIconState({ [`${field.key}key`]: true });
              }}
              onMouseLeave={() => {
                setEditIconState({ [`${field.key}key`]: false });
              }}
              style={{ display: "flex" }}
            >
              <div className={classes.fieldLabel}>{field.key !== "approvalStatus" && field.label}</div>
              {field.isCustom && editIconState[`${field.key}key`] && (
                <Tooltip title={"Edit"} placement="top">
                  <CreateTwoToneIcon
                    className={classes.pencilIcon}
                    onClick={() => {
                      setStateApp((stateApp) => ({
                        ...stateApp,
                        selectedMeta: field,
                        showFieldModal: true,
                      }));
                    }}
                  />
                </Tooltip>
              )}
            </Grid>
            <Grid item xs={8}>
              <Fragment key={index}>
                {(field.type === "text" ||
                  field.type === "number" ||
                  field.type === "dropdown" ||
                  field.type === "multiselect" ||
                  field.type === "select") && (
                    <Controller
                      control={control}
                      name={field.key}
                      render={(params) => {
                        return (
                          <Fragment>
                            {/* {field.type === "text" && field.key === 'bounusPayment' && (
                              <TextField
                                {...params}
                                id={`field-${index}`}
                                variant="outlined"
                                margin="dense"
                                type="text"
                                fullWidth
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                value={bonusValue ? bonusValue : params.value}
                                InputProps={field.InputProps}
                                onFocus={() => {
                                  setBonusValue(params.value?.replace(/,/g, ''));
                                }}
                                onChange={(e) => {
                                  setBonusValue(e.target.value);
                                }}
                                onBlur={(event) => {
                                  const value = event.target.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                  setBonusValue(value);
                                  offClickHandler(field.key, value);
                                }}
                                disabled={field.disabled}
                              />
                            )} */}
                            {field.type === "text" && (
                              <TextField
                                {...params}
                                id={`field-${field.key}`}
                                variant="outlined"
                                margin="dense"
                                type="text"
                                fullWidth
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                InputProps={field.InputProps}
                                onBlur={(event) => offClickHandler(field.key, event.target.value)}
                              />
                            )}
                            {field.type === "number" && (
                              <NumberField
                                id={`field-${field.key}`}
                                index={index}
                                field={field}
                                offClickHandler={(key, value) => {
                                  offClickHandler(key, value);
                                }}
                                {...params}
                              />
                            )}
                            {field.type === "dropdown" && (
                              <ReactSelectField
                                id={`field-${field.key}`}
                                isSingleSelect={true}
                                fullWidth
                                variant="outlined"
                                dropdownOptions={field.options}
                                column={field}
                                onCustomKeyChange={(value) => {
                                  offClickHandler(field.key, value, field.isCustom);
                                }}
                                disabled={field.disabled}
                                value={get(agreementDetails, `${field.key}`, "")}
                              />
                            )}
                            {field.type === "select" && (
                              <Select
                                {...params}
                                id={`field-${field.key}`}
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={(event) => offClickHandler(field.key, event.target.value, field.isCustom)}
                                disabled={field.disabled}
                                value={get(agreementDetails, `${field.key}`, "")}
                              >
                                {field.options.map((option) => (
                                  <MenuItem value={option.value ? option.value : option}>{option.label ? option.label : option}</MenuItem>
                                ))}
                              </Select>
                            )}
                            {field.type === "multiselect" && (
                              <ReactSelectField
                                id={`field-${field.key}`}
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                dropdownOptions={field.options}
                                column={field}
                                value={get(agreementDetails, `${field.key}`) ?? []}
                                onCustomKeyChange={(value) => {
                                  offClickHandler(field.key, value, field.isCustom);
                                }}
                              />
                            )}
                          </Fragment>
                        );
                      }}
                    />
                  )}
                {field.type === "date" && (
                  <TextField
                    id={`field-${field.key}`}
                    autoOk
                    type="date"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={
                      agreementDetailCopied?.[field.key] ? moment(agreementDetailCopied[field.key]).utc(true).format("yyyy-MM-DD") : ""
                    }
                    onChange={(event) => {
                      setAgreementCopied({ ...agreementDetailCopied, [field.key]: event?.target?.value || null })
                    }}
                    onBlur={(event) => {
                      offClickHandler(field.key, event?.target?.value || null);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disableToolbar
                    KeyboardButtonProps={{ "aria-label": "change date" }}
                    format="MM/DD/YYYY"
                    PopoverProps={{ disablePortal: false }}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={(event) => offClickHandler(field.key, null)}>
                          <Clear style={{ height: 22, width: 22 }} />
                        </IconButton>
                      ),
                      classes: {
                        root: classes.dateRoot,
                      },
                    }}
                  />
                )}
                {field.type === "autocomplete" && field.key !== "approvalStatus" && (
                  <AutoCompleteTypeComponent
                    value={agreementDetails?.[field.key]}
                    shapeType="Agreement"
                    typeKey={field.key}
                    variant="outlined"
                    onChange={() => { }}
                    onBlur={(event) => offClickHandler(field.key, event.target.value)}
                    autoFocus={false}
                    id={`field-${field.key}`}
                  />
                )}
                {field.key === "totalAcquisitionCost" && (
                  <Controller
                    control={control}
                    name={field.key}
                    render={(props) => (
                      <TextField
                        {...props}
                        id={`field-${field.key}`}
                        value={parseFloat(props.value).toFixed(2)}
                        className={isAcquisitionCostOverridden ? overrideClasses.valueOveridden : overrideClasses.valueNormal}
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        inputRef={props.ref}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                          const toFixedValue = parseFloat(e.target.value).toFixed(2)
                          const calculatedAcquisitionCost = parseFloat(agreementDetails?.calculated?.totalAcquisitionCost || 0).toFixed(2);
                          props.onChange(toFixedValue);
                          setIsAcquisitionCostOverridden(toFixedValue !== calculatedAcquisitionCost);
                        }}
                        onBlur={(e) => offClickHandler(field.key, Number(props.value))}
                        InputProps={{
                          ...field.InputProps,
                          endAdornment: (
                            <InputAdornment position="end">
                              {isAcquisitionCostOverridden && (
                                <IconButton
                                  aria-label="toggle royality-acres"
                                  onClick={() => {
                                    const totalAcquisitionCost = parseFloat(agreementDetails?.calculated?.totalAcquisitionCost || 0).toFixed(2);
                                    props.onChange(totalAcquisitionCost);
                                    offClickHandler(field.key, Number(totalAcquisitionCost));
                                    setIsAcquisitionCostOverridden(false);
                                  }}
                                >
                                  <AutorenewIcon />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                )}
                {field.key === 'state' && (
                  <StateField
                    // label="State"
                    id={`field-${field.key}`}
                    shrink
                    value={state}
                    onStateChange={(selectedState) => {
                      setState(selectedState.acronym)
                      updateAgreement("state", selectedState.acronym, false)
                    }}
                  />
                )}
                {field.key === 'county' && (
                  <CountyField
                    // label="County"
                    shrink
                    value={county}
                    state={state}
                    onCountyChange={(selectedCounty) => {
                      setCounty(selectedCounty.county)
                      updateAgreement('county', selectedCounty.county, false)
                    }}
                  />
                )}
              </Fragment>
            </Grid>
          </Grid>
        </Grid>
      ))}
      {stateApp.showFieldModal && (
        <MetaField
          customDataPrefix="shapeJson.properties.custom_data"
          customDataPostfix=".keyword"
          columns={[]}
          category="Agreement"
          updateColumnSorting={addAgreementCustomData}
        />
      )}
      {stateApp.user?.rolePrivileges !== "READ_ONLY" && (
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className={classes.addDataButton}
            startIcon={<AddIcon />}
            onClick={() => setStateApp((stateApp) => ({ ...stateApp, showFieldModal: true }))}
          >
            Add Custom Data
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
