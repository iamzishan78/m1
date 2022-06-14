import React, { useEffect, useState, Fragment } from "react";
import { isEmpty } from "lodash";
import { useMutation } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";

import { Grid, TextField, InputAdornment, CircularProgress } from "@material-ui/core";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import { makeStyles } from "@material-ui/core/styles";

import { SUMMARY_FIELDS } from "components/ContactDetailedInfo/helper";
import { UPDATECONTACT } from "graphQL/useMutationUpdateContact";

const useStyles = makeStyles(() => ({
  container: {
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

  const [updateContact] = useMutation(UPDATECONTACT);

  useEffect(() => {
    if (!isEmpty(contactData)) {
      reset(contactData);
    }
  }, [contactData, reset]);

  const updateFieldData = (key, value) => {
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
    <Grid container alignItems="center" justify="space-between" display="flex" direction="row" className={classes.container}>
      {SUMMARY_FIELDS(contactData).map((field, key) => (
        <Grid item xs={5} key={key} style={{ width: "100%", marginRight: "30px" }}>
          <Grid container className={classes.gridStyle}>
            <Grid item style={{ display: "flex" }}>
              <div className={classes.fieldLabel}>{field.label}</div>
            </Grid>
            <Grid item xs={8}>
              <Controller
                control={control}
                name={field.key}
                render={(params) => {
                  return (
                    <Fragment>
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
