import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useLazyQuery, useMutation } from "@apollo/client";
import StateField from "./State";
import CountyField from "./County";
import AssociatedWellsList from "components/Shared/Wells/AssociatedWells";
import ContactCardIcon from "components/Shared/svgIcons/contact_card";

import ContactPaginatedAutocomplete from "components/Revenue/components/Common/ContactsPaginatedAutocomplete";

import { CONTACT_ENTITY } from "graphQL/useQueryContactEntity";
import { UPDATE_PROPERTY } from "graphQL/useMutationUpdateProperty";

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
  boldLabel: {
    fontWeight: "bold",
    fontSize: "15px",
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
    right: "6px !important",
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
  },
}));

export default function HeaderSection(props) {
  const classes = useStyles();
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
      reset(propertyDetails);
    }
  }, [propertyDetails]);

  useEffect(() => {
    const entity = get(contactEntityData, "contactEntity.entity");
    if (entity?._id) {
      updateProperty({
        variables: {
          property: {
            _id: propertyDetails._id,
            [entityType]: entity?._id,
          },
        },
        refetchQueries: ['getProperty'],
        awaitRefetchQueries: true
      })
    }
  }, [contactEntityData]);

  const selectedState = watch("state", {});

  const contactEntity = (contactId, entityType) => {
    setEntityType(entityType);
    getContactEntity({
      variables: {
        contactId
      }
    })
  }

  const checkIfContact = (entityId) => {
    return !!propertyOwnerContact?.find((contact) => contact.entityId === entityId);
  }

  const setEntity = (entityDetails) => {
    if (entityDetails && !checkIfContact(entityDetails?._id)) setEntityToConvert({ ...entityDetails, isEntity: true });
  }

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
                <div className={classes.boldLabel}>Property #</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="propertyNumber"
                  render={(params) => <TextField {...params} variant="outlined" margin="dense" type="text" fullWidth />}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.boldLabel}>Property</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="name"
                  render={(params) => <TextField {...params} variant="outlined" margin="dense" type="text" fullWidth />}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={3}>
                <div className={classes.boldLabel}>Owner #</div>
              </Grid>
              <Grid item xs={8}>
                <Controller
                  control={control}
                  name="ownerNumber"
                  render={(params) => <TextField {...params} variant="outlined" margin="dense" placeholder="" fullWidth />}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.boldLabel}>Owner</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="owner"
                  render={(props) => (
                    <ContactPaginatedAutocomplete
                      nameAutValue={props?.value}
                      setNameAutValue={(value) => {
                        contactEntity(value?._id, "owner");
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
                                <div className={classes.contactCardIcon} onClick={() => setEntity(propertyDetails?.owner)}>
                                  <ContactCardIcon fill={!(propertyDetails?.owner?._id) ? "darkgrey" : undefined} />
                                </div>
                              </React.Fragment>
                            ),
                          }}
                          inputProps={{
                            ...params2.inputProps,
                            value: props.value?.name
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
                <div className={classes.boldLabel}>Date</div>
              </Grid>
              <Grid item xs={8} className={classes.datePicker}>
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  disableToolbar
                  format="MM/DD/YYYY"
                  margin="normal"
                  id="date-picker-inline"
                  // value={moment.utc(check?.checkDate).format("MM/DD/YYYY") || ""}
                  // onChange={(date) => {
                  //   handleUpdateCheck({ checkDate: date ? String(date["_d"]) : "" });
                  // }}
                  KeyboardButtonProps={{ "aria-label": "change date" }}
                  InputAdornmentProps={{ position: "start" }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.boldLabel}>Operator</div>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  control={control}
                  name="operator"
                  render={(props) => (
                    <ContactPaginatedAutocomplete
                      nameAutValue={props?.value}
                      setNameAutValue={(value) => {
                        contactEntity(value?._id, "operator");
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
                                <div className={classes.contactCardIcon} onClick={() => setEntity(propertyDetails?.operator)}>
                                  <ContactCardIcon fill={!checkIfContact(propertyDetails?.operator?._id) ? "darkgrey" : undefined} />
                                </div>
                              </React.Fragment>
                            ),
                          }}
                          inputProps={{
                            ...params2.inputProps,
                            value: props.value?.name
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
                <div className={classes.boldLabel}>State</div>
              </Grid>
              <Grid item xs={8}>
                <StateField onStateChange={(state) => setValue("state", state)} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Grid container className={classes.gridStyle}>
              <Grid item xs={2}>
                <div className={classes.boldLabel}>County</div>
              </Grid>
              <Grid item xs={9}>
                <CountyField state={selectedState.acronym} onCountyChange={(county) => setValue("county", county)} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container className={`${classes.gridStyle} ${classes.textArea}`}>
              <Grid item style={{ flexBasis: "10.3%" }}>
                <div className={classes.boldLabel}>Legal Description</div>
              </Grid>
              <Grid item style={{ flexBasis: "84.8%" }}>
                <TextField margin="dense" type="number" variant="outlined" fullWidth multiline rows={5} />
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
  propertyDetails: {}
}