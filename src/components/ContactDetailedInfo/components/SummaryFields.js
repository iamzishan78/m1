import React, { useEffect, useState, Fragment } from "react";
import { get, set, isEmpty } from 'lodash';
import { useMutation } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from 'react-redux';

import { Grid, TextField, InputAdornment, CircularProgress } from "@material-ui/core";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import { makeStyles } from "@material-ui/core/styles";

import vf_number from "components/Shared/valueformatters/vf_number";
import ContactStatus from 'components/ContactDetailCard/components/ContactStatus'
import { SUMMARY_FIELDS } from "components/ContactDetailedInfo/helper";
import { UPDATECONTACT } from "graphQL/useMutationUpdateContact";

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    padding: "10px 30px 15px 5px",
  },
  gridStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontWeight: "bold",
    fontSize: "15px",
  },
  field: {
    "& .MuiAutocomplete-clearIndicator": {
      marginRight: "10px",
    },
    "& .MuiFormControl-marginNormal": {
      margin: "0px",
    },
    "& .MuiFormControl-marginDense": {
      margin: "0px",
    },
    "& .MuiInputBase-root": {
      borderRadius: "7px",
    },
  },
  emailAdornment: {
    cursor: "pointer",
  },
}));

export default function SummaryFields({ contactData }) {
  const classes = useStyles();
  const { control, reset } = useForm();
  const [activeLoadingField, setLoading] = useState();
  const [isFormSet, setFormState] = useState(false);

  const { user } = useSelector(state => state.app);

  const [updateContact] = useMutation(UPDATECONTACT);

  const showGenericPhones = React.useMemo(() => {
    return user.features?.find(f => f.name === "showGenericPhones")
  }, [user]);

  useEffect(() => {
    if (!isEmpty(contactData) && !isFormSet) {
      let _contact = { ...contactData };
      if (get(_contact, 'contactInterests.offerPriceSum')) {
        _contact = {
          ..._contact,
          contactInterests: {
            nraSum: vf_number(_contact.contactInterests.nraSum),
            offerPriceSum: vf_number(_contact.contactInterests.offerPriceSum)
          }
        };
      }
      reset(_contact);
      setFormState(true);
    }
  }, [contactData, reset, isFormSet]);

  const featureFlagChanges = (field) => {
    if (showGenericPhones) {
      switch (field.key) {
        case "homePhone":
          return "Phone 1"
        case "mobilePhone":
          return "Phone 2"
        case "mobilephone2":
          return "Phone 3"
        case "AltPhone":
          return "Phone 4"
        default:
      }
    }
    return field.label;
  }

  const updateFieldData = (key, value) => {
    if (contactData[key] === value) return;

    setLoading(key);
    updateContact({
      variables: {
        contact: {
          _id: contactData._id,
          [key]: value,
        },
        ignoreResponse: true,
      },
      refetchQueries: ["getContact"],
      awaitRefetchQueries: false,
    })
      .then((result) => {
        setLoading(null);
      })
      .catch((error) => {
        setLoading(null);
      });
  };

  return (
    <Grid container alignItems="center" justify="space-between" display="flex" direction="column" className={classes.container}>
      {SUMMARY_FIELDS(contactData).map((field, key) => (
        <Grid item key={key} style={{ position: "relative", width: "100%", marginRight: "30px", maxWidth: "44%", flexBasis: "11%" }}>
          <Grid container className={classes.gridStyle}>
            <Grid item style={{ display: "flex" }}>
              <div className={classes.fieldLabel}>{featureFlagChanges(field)}</div>
            </Grid>
            <Grid item xs={8}>
              <Controller
                control={control}
                name={field.key}
                render={(params) => {
                  return (
                    <Fragment>
                      {field.type !== "autocomplete" ? (
                        <TextField
                          {...params}
                          id={`field-${key}`}
                          variant="outlined"
                          margin="dense"
                          type="text"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onBlur={(event) => updateFieldData(field.key, event.target.value)}
                          disabled={field.disabled}
                          className={classes.field}
                          value={field.value ?? params.value}
                          // If field type = "email", show msg icon adornment
                          // If field info is updating, show loading as adornment
                          // else show nothing
                          InputProps={{
                            startAdornment: field.type === "number" && (
                              <InputAdornment position="start"> $</InputAdornment>
                            ),
                            endAdornment:
                              field.type === "email" && contactData[field.key] ? (
                                <a href={"mailto:" + contactData.primaryEmail} className={classes.emailAdornment}>
                                  <InputAdornment position="end">
                                    <EmailOutlinedIcon htmlColor="#757575" />
                                  </InputAdornment>
                                </a>
                              ) : activeLoadingField === field.key ? (
                                <CircularProgress className={classes.loader} size={22} color="secondary" />
                              ) : (
                                <Fragment />
                              ),
                          }}
                        />
                      ) : (
                        <ContactStatus
                          className={classes.maxWidth}
                          setValue={(value) => {
                            updateFieldData(field.key, value.name)
                          }}
                          value={contactData[field.key] ?? ""}
                          variant="outlined"
                        />
                      )}
                    </Fragment>
                  );
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
