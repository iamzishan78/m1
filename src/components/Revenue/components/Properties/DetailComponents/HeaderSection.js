import React, { useEffect, useState, useContext } from "react";
import { get, debounce } from "lodash";
import moment from "moment";
import { useHistory } from "react-router-dom";

import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import loadashFilter from "lodash/filter";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import StateField from "./State";
import CountyField from "./County";
import AssociatedWellsList from "components/Shared/Wells/AssociatedWells";
import ContactCardIcon from "components/Shared/svgIcons/contact_card";

import ContactPaginatedAutocomplete from "components/Revenue/components/Common/ContactsPaginatedAutocomplete";
import { AppContext } from "AppContext";

import { CONTACT_ENTITY } from "graphQL/useQueryContactEntity";
import { UPDATE_PROPERTY } from "graphQL/useMutationUpdateProperty";
import AutoCompleteWithAddNew from "components/Shared/AutoCompleteWithAddNew";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { GET_AUTOCOMPLETE_PROPERTY_LIST } from "graphQL/useQueryGetProperty";
import AutoCompleteTypeComponent from "components/Shared/Forms/Fields/AutoCompleteType";
import { useDispatch } from "react-redux";
import { showInfoMessage } from "actions";

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
    height: "525px",
    display: 'flex',
    flexDirection: 'column',
    borderRadius: "15px",
    maxWidth: "30%",
    width: "30%",
  },
  adornmentAutocomplete: {
    "& .MuiAutocomplete-endAdornment": {
      right: "60px !important",
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
  const dispatch = useDispatch();
  const [, setStateApp] = useContext(AppContext);
  const { control, setValue, watch, register, reset } = useForm();
  const { propertyDetails, propertyOwnerContact, setEntityToConvert } = props;
  const [entityType, setEntityType] = useState("");
  const [searchOperator, setSearchOperator] = useState("");

  const [getOperatorList, { data: operatorList }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });
  const [getContactEntity, { data: contactEntityData }] = useLazyQuery(CONTACT_ENTITY);
  const { data: acquisitionOptions } = useQuery(GET_AUTOCOMPLETE_PROPERTY_LIST, { variables: { key: "acquisitionID" } });
  const { data: prospectOptions } = useQuery(GET_AUTOCOMPLETE_PROPERTY_LIST, {
    variables: { key: "prospectID" },
  });
  const [updateProperty] = useMutation(UPDATE_PROPERTY);

  useEffect(() => {
    return () => {
      const number = watch("number");
      const internalID = watch("internalID");

      if (!number && !internalID) {
        dispatch(
          showInfoMessage("Internal Prop # or Operator Prop # is required.")
        );
        history.goBack();
      }
    }
  }, [])

  useEffect(() => {
    getOperatorList({
      variables: {
        search: searchOperator ? `${searchOperator}*` : "*",
        filterKey: "operator.name.keyword",
        esIndex: "properties_flat",
        size: 50,
      }
    })
  }, [getOperatorList, searchOperator])

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
      // let operator = {};
      if (propertyOwnerContact) {
        owner = propertyOwnerContact?.find((owner) => owner.entityId === propertyDetails?.owner?._id);
        // operator = propertyOwnerContact?.find((owner) => owner.entityId === propertyDetails?.operator?._id);
      }
      setSearchOperator(propertyDetails?.operator?.name)
      reset({ ...data, owner: { ...owner, number: data.ownerNumber }, operator: propertyDetails?.operator?.name });
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

  const getMappedOptions = (strArray) => strArray?.map(option => ({ name: option, value: option })) || [];

  return (
    <Grid container direction="row" justify="space-between">
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
                <div className={classes.label}>Internal Prop #</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="internalID"
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
                      onBlur={(e) => handleUpdate("internalID", e.target.value)}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.label}>Property Name</div>
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
                <div className={classes.label}>Operator Prop #</div>
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
                <div className={classes.label}>Operator</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="operator"
                  render={(props) => (
                    <AutoCompleteWithAddNew
                      value={searchOperator}
                      variant="outlined"
                      onSearch={(value) => {
                        setSearchOperator(value);
                      }}
                      setValue={(value) => {
                        handleUpdate("operator", { name: value?.name });
                        props.onChange(value);
                      }}
                      options={get(
                        operatorList,
                        "getESFilterList.hits",
                        []
                      )?.map((campaign) => ({
                        _id: campaign.key,
                        name: campaign.key,
                      }))}
                    />
                  )}
                />
                {/* <Controller
                  control={control}
                  name="operator"
                  render={(params) => (
                    <ContactPaginatedAutocomplete
                      className={classes.field}
                      nameAutValue={
                        params.value ? params.value : { _id: "", name: "" }
                      }
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
                                      history.push(
                                        `/contact/details/${params?.value?._id}`
                                      );
                                      setStateApp((stateApp) => ({
                                        ...stateApp,
                                        selectedContact: `${params?.value?._id}`,
                                      }));
                                    }
                                  }}
                                >
                                  <ContactCardIcon
                                    fill={
                                      !checkIfContact(
                                        propertyDetails?.operator?._id
                                      )
                                        ? "darkgrey"
                                        : undefined
                                    }
                                  />
                                </div>
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  )}
                /> */}
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
                      onBlur={(e) =>
                        handleUpdate("ownerNumber", e.target.value)
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.label}>Owner Name</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="owner"
                  render={(params) => (
                    <ContactPaginatedAutocomplete
                      nameAutValue={
                        params.value ? params.value : { _id: "", name: "" }
                      }
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
                                      history.push(
                                        `/contact/details/${params?.value?._id}`
                                      );
                                      setStateApp((stateApp) => ({
                                        ...stateApp,
                                        selectedContact: `${params?.value?._id}`,
                                      }));
                                    }
                                    setEntity(propertyDetails?.owner);
                                  }}
                                >
                                  <ContactCardIcon
                                    fill={
                                      !propertyDetails?.owner?._id
                                        ? "darkgrey"
                                        : undefined
                                    }
                                  />
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
                <div className={classes.label}>DO Date</div>
              </Grid>
              <Grid item xs={8} className={classes.datePicker}>
                <Controller
                  control={control}
                  name="documentDate"
                  render={(params) => (
                    <TextField
                      autoOk
                      type="date"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      value={moment(params?.value || "").format("yyyy-MM-DD")}
                      onChange={(e) => {
                        params.onChange(moment(e.target.value).toISOString());
                      }}
                      onBlur={(e) => {
                        updatePropertyData(
                          "documentDate",
                          moment(e.target.value).toISOString()
                        );
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
                          <IconButton
                            onClick={(event) =>
                              updatePropertyData("documentDate", null)
                            }
                          >
                            <Clear style={{ height: 22, width: 22 }} />
                          </IconButton>
                        ),
                        classes: {
                          root: classes.dateRoot,
                        },
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
                <div className={classes.label}>DO Status</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="divOrderStatus"
                  render={(params) => (
                    <Select
                      {...params}
                      id="divOrderStatus-simple-select-outlined-label"
                      variant="outlined"
                      value={params.value ? params.value : ""}
                      fullWidth
                      onChange={(e) => {
                        params.onChange(e.target.value);
                        updatePropertyData("divOrderStatus", e.target.value);
                      }}
                    >
                      <MenuItem value="Received">Received</MenuItem>
                      <MenuItem value="Not Received">Not Received</MenuItem>
                    </Select>
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



          {/* <Grid item xs={7}>
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
                      <MenuItem value="In Pay">In Pay</MenuItem>
                      <MenuItem value="Not in Pay">Not in Pay</MenuItem>
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
          </Grid> */}
          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.label}>Pay Status</div>
              </Grid>
              <Grid item xs={8}>
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
                      <MenuItem value="InPay">In Pay</MenuItem>
                      <MenuItem value="NotInPay">Not in Pay</MenuItem>
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.label}>Internal Company</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="internalCompany"
                  render={(params) => {
                    return (
                      <AutoCompleteTypeComponent
                        {...params}
                        autoFocus={false}
                        shapeType={"Unit"}
                        typeKey={"internalCompany"}
                        variant="outlined"
                        onChange={(e, value) => {
                          params.onChange(value?.name || "");
                        }}
                        onBlur={(e) => {
                          handleUpdate("internalCompany", e.target.value || "");
                        }}
                      />
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.label}>Prospect</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="prospectID"
                  render={(params) => (
                    <Autocomplete
                      className={classes.field}
                      value={
                        params.value
                          ? { _id: params.value, name: params.value }
                          : null
                      }
                      disableListWrap
                      onBlur={(e) =>
                        updatePropertyData("prospectID", e.target.value)
                      }
                      options={getMappedOptions(
                        prospectOptions?.getAutoCompletePropertyList
                      )}
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
                        return option?._id === value?._id;
                      }}
                      renderOption={(option) => {
                        if (option.isNew)
                          return (
                            <Typography style={{ color: "midnightblue" }}>
                              Add '{option.name}'
                            </Typography>
                          );

                        return (
                          <Grid container spacing={0}>
                            <Grid container item xs={12} alignItems="center">
                              <Grid item xs>
                                <span style={{ fontWeight: 400 }}>
                                  {option.name}
                                </span>
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      }}
                      filterOptions={(options, params) => {
                        const inputValue = params.inputValue;
                        const filtered = createFilterOptions()(options, {
                          ...params,
                          inputValue,
                        });
                        const isExist = loadashFilter(filtered, (filter) => {
                          return filter._id === inputValue;
                        });
                        // Suggest the creation of a new value
                        if (
                          inputValue !== "" &&
                          (!isExist || isExist.length === 0)
                        ) {
                          filtered.unshift({
                            value: inputValue,
                            name: inputValue,
                            isNew: true,
                          });
                        }
                        return filtered;
                      }}
                      onChange={(event, newValue) => {
                        setValue("prospectID", newValue?.value || "");
                      }}
                      renderInput={(props) => (
                        <TextField
                          variant={"outlined"}
                          margin="dense"
                          {...props}
                          InputProps={{
                            ...props.InputProps,
                          }}
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.label}>Acquisition ID</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="acquisitionID"
                  render={(params) => (
                    <Autocomplete
                      className={classes.field}
                      value={
                        params.value
                          ? { _id: params.value, name: params.value }
                          : null
                      }
                      disableListWrap
                      onBlur={(e) =>
                        updatePropertyData("acquisitionID", e.target.value)
                      }
                      options={getMappedOptions(
                        acquisitionOptions?.getAutoCompletePropertyList
                      )}
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
                        return option?._id === value?._id;
                      }}
                      renderOption={(option) => {
                        if (option.isNew)
                          return (
                            <Typography style={{ color: "midnightblue" }}>
                              Add '{option.name}'
                            </Typography>
                          );

                        return (
                          <Grid container spacing={0}>
                            <Grid container item xs={12} alignItems="center">
                              <Grid item xs>
                                <span style={{ fontWeight: 400 }}>
                                  {option.name}
                                </span>
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      }}
                      filterOptions={(options, params) => {
                        const inputValue = params.inputValue;
                        const filtered = createFilterOptions()(options, {
                          ...params,
                          inputValue,
                        });
                        const isExist = loadashFilter(filtered, (filter) => {
                          return filter._id === inputValue;
                        });
                        // Suggest the creation of a new value
                        if (
                          inputValue !== "" &&
                          (!isExist || isExist.length === 0)
                        ) {
                          filtered.unshift({
                            value: inputValue,
                            name: inputValue,
                            isNew: true,
                          });
                        }
                        return filtered;
                      }}
                      onChange={(event, newValue) => {
                        setValue("acquisitionID", newValue?.value || "");
                      }}
                      renderInput={(props) => (
                        <TextField
                          variant={"outlined"}
                          margin="dense"
                          {...props}
                          InputProps={{
                            ...props.InputProps,
                          }}
                          fullWidth
                          size="small"
                        />
                      )}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              className={`${classes.gridStyle} ${classes.textArea}`}
            >
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
                      onBlur={(e) =>
                        updatePropertyData("legalDescription", params.value)
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={classes.associatedWell}>
        <AssociatedWellsList
          title="Associated Wells"
          relatedObject={props.propertyId}
          relatedObjectType="Property"
          details={propertyDetails}
        />
      </Grid>
    </Grid>
  );
}

HeaderSection.defaultProps = {
  propertyDetails: {},
};
