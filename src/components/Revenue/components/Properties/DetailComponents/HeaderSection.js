import React, { useEffect, useState, useContext } from "react";
import { get, debounce } from "lodash";
import moment from "moment";
import { useHistory } from "react-router-dom";

import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, Button, Select, MenuItem } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useLazyQuery, useMutation } from "@apollo/client";
import StateField from "./State";
import CountyField from "./County";
import AssociatedWellsList from "components/Shared/Wells/AssociatedWells";
import ContactCardIcon from "components/Shared/svgIcons/contact_card";

import ContactPaginatedAutocomplete from "components/Revenue/components/Common/ContactsPaginatedAutocomplete";
import { AppContext } from "AppContext";

import { CONTACT_ENTITY } from "graphQL/useQueryContactEntity";
import { UPDATE_PROPERTY } from "graphQL/useMutationUpdateProperty";
import AutocompEntityNamesList from "components/Shared/Forms/Fields/AutocompEntityNamesList";

const useStyles = makeStyles((theme) => ({
  titleText: {
    textTransform: "uppercase",
    margin: "5px 16px 10px",
    color: "#5a5a5a",
  },
  fieldsSection: {
    margin: "0px 0px",
    "& .MuiOutlinedInput-root": {
      height: `46px !important`,
      borderRadius: "6px !important",
    },
  },
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: "13px",
  },
  wellsSelectField: {
    "& .MuiInputBase-root": {
      borderRadius: "8px",
    },
  },
  formControl: {
    width: "100%",
  },
  dateRoot: {
    color: "grey",
    "& input": {
      marginLeft: "20px",
    },
  },
  infoSection: {
    maxWidth: "70%",
  },
  associatedWell: {
    border: "2px solid #d5d5d5",
    height: "382px",
    borderRadius: "15px",
    maxWidth: "30%",
    width: "30%",
  },
  adornmentAutocomplete: {
    "& .MuiAutocomplete-endAdornment": {
      right: "50px !important",
      "& .MuiAutocomplete-clearIndicator": {
        display: "none",
      },
    },
  },
  contactCardIcon: {
    position: "absolute",
    right: "12px !important",
    marginTop: "4px !important",
    cursor: "pointer",
  },
  textArea: {
    margin: "0px 0px",
    "& .MuiOutlinedInput-root": {
      height: `auto !important`,
      borderRadius: "6px !important",
    },
  },
  datePicker: {
    "& .MuiIconButton-root": {
      padding: "12px 0px",
    },
    "& .MuiFormControl-marginNormal": {
      margin: "0px",
    },
  },
  textField: {
    margin: "0px",
    "& .MuiOutlinedInput-input": {
      padding: "13px",
    },
  },
  field: {
    "& .MuiAutocomplete-clearIndicator": {
      marginRight: "15px",
    },
    "& .MuiFormControl-marginNormal": {
      margin: "0px",
    },
    "& .MuiFormControl-marginDense": {
      margin: "0px",
    },
  },
}));

export default function HeaderSection(props) {
  const classes = useStyles();
  let history = useHistory();
  const [, setStateApp] = useContext(AppContext);
  const { control, setValue, watch, register, reset } = useForm();
  const { propertyDetails, propertyOwnerContact, setEntityToConvert } = props;
  const [entityType, setEntityType] = useState("");

  const [getContactEntity, { data: contactEntityData }] = useLazyQuery(CONTACT_ENTITY);
  const [updateProperty] = useMutation(UPDATE_PROPERTY);

  useEffect(() => {
    register("state");
    register("county");
  }, [register]);

  useEffect(() => {
    if (propertyDetails) {
      const data = JSON.parse(JSON.stringify(propertyDetails));
      delete data.owner;
      delete data.operator;
      let owner = {};
      let operator = {};
      if (propertyOwnerContact) {
        owner = propertyOwnerContact?.find((owner) => owner.entityId === propertyDetails?.owner?._id);
        operator = propertyOwnerContact?.find((owner) => owner.entityId === propertyDetails?.operator?._id);
      }
      reset({ ...data, owner: { ...owner, number: data.ownerNumber }, operator });
    }
  }, [propertyDetails, propertyOwnerContact]);

  useEffect(() => {
    const entity = get(contactEntityData, "contactEntity.entity");
    if (entity?._id) {
      updatePropertyData(entityType, entity?._id);
    }
  }, [contactEntityData]);

  const selectedState = watch("state", "");

  const contactEntity = (contactId, entityType) => {
    setEntityType(entityType);
    getContactEntity({
      variables: {
        contactId,
      },
    });
  };

  const checkIfContact = (entityId) => {
    return !!propertyOwnerContact?.find((contact) => contact.entityId === entityId);
  };

  const setEntity = (entityDetails) => {
    if (entityDetails && !checkIfContact(entityDetails?._id)) setEntityToConvert({ ...entityDetails, isEntity: true });
  };

  const updatePropertyData = (key, value) => {
    updateProperty({
      variables: {
        property: {
          _id: propertyDetails._id,
          [key]: value,
        },
      },
      refetchQueries: ["getProperty"],
      awaitRefetchQueries: true,
    });
  };

  const handleUpdate = debounce((key, value) => {
    updatePropertyData(key, value);
  }, 500);

  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item className={classes.infoSection}>
        <Grid
          container
          direction="row"
          display="flex"
          justify="flex-start"
          alignItems="center"
          spacing={1}
          className={classes.fieldsSection}
        >
          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.label}>Property #</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="number"
                  render={(params) => (
                    <TextField
                      {...params}
                      className={classes.textField}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      onChange={(e) => {
                        params.onChange(e.target.value);
                      }}
                      onBlur={(e) => handleUpdate("number", e.target.value)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.label}>Property</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="name"
                  render={(params) => (
                    <TextField
                      {...params}
                      className={classes.textField}
                      variant="outlined"
                      margin="dense"
                      type="text"
                      fullWidth
                      onChange={(e) => {
                        params.onChange(e.target.value);
                      }}
                      onBlur={(e) => handleUpdate("name", e.target.value)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.label}>Owner #</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="owner.number"
                  render={(params) => (
                    <TextField
                      {...params}
                      className={classes.textField}
                      variant="outlined"
                      margin="dense"
                      placeholder=""
                      fullWidth
                      onChange={(e) => {
                        params.onChange(e.target.value);
                      }}
                      onBlur={(e) => handleUpdate("ownerNumber", e.target.value)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.label}>Owner</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="owner"
                  render={(params) => (
                    <ContactPaginatedAutocomplete
                      nameAutValue={params.value ? params.value : { _id: "", name: "" }}
                      className={classes.field}
                      setNameAutValue={(value) => {
                        if (value) contactEntity(value?._id, "owner");
                        else handleUpdate("owner", null);
                      }}
                      renderInput={(params2) => (
                        <TextField
                          {...params2}
                          margin="dense"
                          variant="outlined"
                          InputLabelProps={{
                            ...params2.InputLabelProps,
                            shrink: true,
                          }}
                          InputProps={{
                            ...params2.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {params2.InputProps.endAdornment}
                                <div
                                  className={classes.contactCardIcon}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (params?.value?._id) {
                                      history.push(`/contact/details/${params?.value?._id}`);
                                      setStateApp((stateApp) => ({
                                        ...stateApp,
                                        selectedContact: `${params?.value?._id}`,
                                      }));
                                    }
                                    setEntity(propertyDetails?.owner);
                                  }}
                                >
                                  <ContactCardIcon fill={!propertyDetails?.owner?._id ? "darkgrey" : undefined} />
                                </div>
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.label}>Doc Date</div>
              </Grid>
              <Grid item xs={8} className={classes.datePicker}>
                <Controller
                  control={control}
                  name="documentDate"
                  render={(params) => (
                    <KeyboardDatePicker
                      autoOk
                      disableToolbar
                      variant="inline"
                      inputVariant="outlined"
                      format="MM/DD/YYYY"
                      margin="normal"
                      id="date-picker-inline"
                      value={params.value ? params.value : null}
                      onChange={(date, e) => {
                        params.onChange(moment(date).toISOString());
                        if (date?._isValid) {
                          updatePropertyData("documentDate", moment(e).toISOString());
                        }
                      }}
                      KeyboardButtonProps={{ "aria-label": "change date" }}
                      InputAdornmentProps={{ position: "start" }}
                      fullWidth
                      onBlur={(e) => {
                        updatePropertyData("documentDate", moment(e.target.value).toISOString());
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.label}>Operator</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="operator"
                  render={(params) => (
                    <ContactPaginatedAutocomplete
                      className={classes.field}
                      nameAutValue={params.value ? params.value : { _id: "", name: "" }}
                      setNameAutValue={(value) => {
                        if (value) contactEntity(value?._id, "operator");
                        else handleUpdate("operator", null);
                      }}
                      renderInput={(params2) => (
                        <TextField
                          {...params2}
                          margin="dense"
                          variant="outlined"
                          InputLabelProps={{
                            ...params2.InputLabelProps,
                            shrink: true,
                          }}
                          InputProps={{
                            ...params2.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {params2.InputProps.endAdornment}
                                <div
                                  className={classes.contactCardIcon}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (params?.value?._id) {
                                      history.push(`/contact/details/${params?.value?._id}`);
                                      setStateApp((stateApp) => ({
                                        ...stateApp,
                                        selectedContact: `${params?.value?._id}`,
                                      }));
                                    }
                                  }}
                                >
                                  <ContactCardIcon fill={!checkIfContact(propertyDetails?.operator?._id) ? "darkgrey" : undefined} />
                                </div>
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.label}>State</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="state"
                  render={(params) => (
                    <StateField
                      value={params.value}
                      onStateChange={(state) => {
                        updatePropertyData("state", state.acronym);
                        setValue("state", state.acronym);
                        updatePropertyData("county", "");
                        setValue("county", "");
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.label}>County</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="county"
                  render={(params) => (
                    <CountyField
                      value={params.value}
                      state={selectedState}
                      onCountyChange={(selectedCounty) => {
                        const county = selectedCounty?.county ?? "";
                        updatePropertyData("county", county);
                        setValue("county", county);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.label}>Source</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="source"
                  render={(params) => (
                    <Select
                      {...params}
                      id="source-simple-select-outlined-label"
                      variant="outlined"
                      value={params.value ? params.value : ""}
                      fullWidth
                      onChange={(e) => {
                        updatePropertyData("source", e.target.value);
                      }}
                    >
                      <MenuItem value="Manual Entry">Manual Entry</MenuItem>
                      <MenuItem value="Imported">Imported</MenuItem>
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.label}>Status</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="status"
                  render={(params) => (
                    <Select
                      {...params}
                      id="status-simple-select-outlined-label"
                      variant="outlined"
                      value={params.value ? params.value : ""}
                      fullWidth
                      onChange={(e) => {
                        updatePropertyData("status", e.target.value);
                      }}
                    >
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Unapproved">Unapproved</MenuItem>
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={`${classes.gridStyle} ${classes.textArea}`}>
              <Grid item style={{ flexBasis: "10.3%" }}>
                <div className={classes.label}>Legal Description</div>
              </Grid>
              <Grid item style={{ flexBasis: "84.8%" }}>
                <Controller
                  control={control}
                  name="legalDescription"
                  render={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      type="text"
                      value={params.value}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={5}
                      onBlur={(e) => updatePropertyData("legalDescription", params.value)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.associatedWell}>
        <AssociatedWellsList title="Associated Wells" relatedObject={props.propertyId} relatedObjectType="Property" />
      </Grid>
    </Grid>
  );
}

HeaderSection.defaultProps = {
  propertyDetails: {},
};
