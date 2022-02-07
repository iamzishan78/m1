import React, { useEffect, useState, Fragment, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import { Controller } from "react-hook-form";
import { Grid, TextField, Typography, Button, Select, MenuItem, Tooltip } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useStyles as summaryStyles } from "../style";
import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import AddIcon from "@material-ui/icons/Add";
import CreateTwoToneIcon from "@material-ui/icons/CreateTwoTone";
import fieldsData from "./data";

import keys from "components/Shared/SpreadsheetGrid/kit/keymap";
import ProgressBar from "components/Shared/ui/ProgressBar";
import AutoCompleteTypeComponent from "components/Shared/Forms/Fields/AutoCompleteType";
import MetaField from "components/Table/helpers/MetaField";
import { copy } from "utils/helper";

import { AppContext } from "AppContext";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";
import { SHAPE_SUMMARY_DETAILS } from "graphQL/useQueryShapeSummaryDetail";

export default function FieldsSection({ updateAgreement, control, agreementDetails }) {
  const classes = summaryStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [fieldsList, setFieldsList] = useState([]);
  const [editIconState, setEditIconState] = useState({});

  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);
  const [getShapeSummaryDetails, { data: dataShapeSummaryDetails }] = useLazyQuery(SHAPE_SUMMARY_DETAILS);

  useEffect(() => {
    if (agreementDetails?._id) {
      getShapeSummaryDetails({ variables: { shapeId: agreementDetails._id, shapeType: "Unit" } });
    }
  }, [agreementDetails?._id]);

  useEffect(() => {
    document.addEventListener("keydown", onGlobalKeyDown, false);
    document.addEventListener("blur", (e) => {
      console.log("blur triggered");
    });
  }, []);

  useEffect(() => {
    getMetaData({
      variables: {
        user: stateApp.user?.mongoId,
        category: "Agreement",
      },
    });
  }, []);

  useEffect(() => {
    const metaData = metaDataRes?.getMetaData?.metaData;
    const customData = [];
    if (metaData && agreementDetails?.custom_data) {
      Object.keys(agreementDetails?.custom_data).forEach((key) => {
        const meta = metaData.find((m) => m.name === key);
        if (meta) {
          customData.push({
            ...meta,
            title: meta.label,
            key: meta.name,
            options: meta.dropdownOptions.map((o) => ({
              label: o.value,
              value: o.value,
            })),
          });
        } else if (agreementDetails?.custom_data_arr) {
          const meta = agreementDetails.custom_data_arr.find((m) => m.key === key);
          if (meta) {
            customData.push({ ...meta, title: meta.key, label: meta.key, key: meta.key });
          }
        }
      });

      // updateAgreement('custom_data', { "Current Operator": "PIONEER NATURAL RESOURCES" });
    }
    setFieldsList([...fieldsData, ...customData]);
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

  const offClickHandler = (key, value, isCustom) => updateAgreement(key, value, isCustom);

  const addAgreementCustomData = (data) => {
    const customData = copy(agreementDetails.custom_data) ?? {};
    data.forEach((d) => {
      if (!customData[d.name]) customData[d.name] = null;
    });
    updateAgreement("custom_data", customData);
  };

  return (
    <Grid container direction="row" display="flex" justify="flex-start" alignItems="center" spacing={1} className={classes.fieldsSection}>
      <Grid item xs={12} className={classes.summaryHeader}>
        <div style={{ display: "flex", width: "50%" }}>
          <Typography variant="h5" className={classes.titleText}>
            Summary
          </Typography>
          <ProgressBar value={35} height="3px" isNumeric />
        </div>
        <div style={{ width: "43%" }}>
          <Grid container spacing={2} justify="flex-end" className={classes.summaryHeaderIcons}>
            <Grid item>
              <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.shapeWells || 0} </div>
              <WellIcon opacity="1.0" small color="#757575" />
            </Grid>
            <Grid item>
              <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.shapeOwners || 0} </div>
              <TractIcon opacity="1.0" small />
            </Grid>
            <Grid item>
              <div className={classes.summaryValue}> {dataShapeSummaryDetails?.shapeSummaryDetails?.documents || 0} </div>
              <InsertDriveFileOutlinedIcon opacity="1.0" small />
            </Grid>
          </Grid>
        </div>
      </Grid>

      {fieldsList.map((field, index) => (
        <Grid item xs={12}>
          <Grid container className={classes.gridStyle}>
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
              <div className={classes.fieldLabel}>{field.label}</div>
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
                {(field.type === "text" || field.type === "dropdown" || field.type === "multiselect") && (
                  <Controller
                    control={control}
                    name={field.key}
                    render={(params) => {
                      return (
                        <Fragment>
                          {field.type === "text" && (
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
                              onBlur={(event) => offClickHandler(field.key, event.target.value)}
                            />
                          )}
                          {field.type === "dropdown" && (
                            <Select
                              {...params}
                              id={`field-${index}`}
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                              multiple={field.type === "multiselect"}
                              onChange={(event) => offClickHandler(field.key, event.target.value, field.isCustom)}
                              value={
                                !field.isCustom ? agreementDetails?.[field.key] ?? "" : agreementDetails?.custom_data?.[field.key] ?? []
                              }
                            >
                              {field.options.map((option) => (
                                <MenuItem value={option.value ? option.value : option}>{option.label ? option.label : option}</MenuItem>
                              ))}
                            </Select>
                          )}
                          {field.type === "multiselect" && (
                            <Select
                              {...params}
                              id={`field-${index}`}
                              variant="outlined"
                              margin="dense"
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                              multiple={field.type === "multiselect"}
                              onChange={(event) => offClickHandler(field.key, event.target.value, field.isCustom)}
                              value={agreementDetails?.custom_data?.[field.key] ?? []}
                            >
                              {field.options.map((option) => (
                                <MenuItem value={option.value ? option.value : option}>{option.label ? option.label : option}</MenuItem>
                              ))}
                            </Select>
                          )}
                        </Fragment>
                      );
                    }}
                  />
                )}
                {field.type === "date" && (
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    disableToolbar
                    format="MM/DD/YYYY"
                    margin="normal"
                    id={`field-${index}`}
                    KeyboardButtonProps={{ "aria-label": "change date" }}
                    InputAdornmentProps={{ position: "start" }}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={agreementDetails?.[field.key] ? new Date(agreementDetails[field.key]) : null}
                    onChange={(date) => {
                      offClickHandler(field.key, date ? String(date["_d"]) : "");
                    }}
                  />
                )}
                {field.type === "autocomplete" && (
                  <AutoCompleteTypeComponent
                    value={agreementDetails?.[field.key]}
                    shapeType="Agreement"
                    typeKey={field.key}
                    variant="outlined"
                    onChange={() => {}}
                    onBlur={(event) => offClickHandler(field.key, event.target.value)}
                    autoFocus={false}
                    id={`field-${index}`}
                  />
                )}
              </Fragment>
            </Grid>
          </Grid>
        </Grid>
      ))}
      {stateApp.showFieldModal && <MetaField columns={[]} category="Agreement" updateColumnSorting={addAgreementCustomData} />}
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
    </Grid>
  );
}
