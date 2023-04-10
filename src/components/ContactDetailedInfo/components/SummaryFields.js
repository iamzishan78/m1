import React, { useEffect, useState, Fragment } from "react";
import { get, set, isEmpty } from 'lodash';
import { useMutation } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from 'react-redux';

import { Grid, TextField, InputAdornment, CircularProgress } from "@material-ui/core";
import { Autorenew as AutorenewIcon } from "@material-ui/icons";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import { makeStyles } from "@material-ui/core/styles";

import vf_number from "components/Shared/valueformatters/vf_number";
import ContactStatus from 'components/ContactDetailCard/components/ContactStatus'
import { SUMMARY_FIELDS, featureFlagChanges } from "components/ContactDetailedInfo/helper";
import { UPDATECONTACT } from "graphQL/useMutationUpdateContact";
import { CurrencyFormatCustom } from "components/Shared/Forms/Formatting/CurrencyFormatCustom";

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
  baseValueChanged: {
    width: "100%",
    "& .MuiInputBase-input": {
      color: "dodgerblue",
      fontWeight: "bold",
    },
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

  const [contactInterest, setContactInterest] = useState()

  useEffect(() => {
    if (!isEmpty(contactData) && !isFormSet) {
      let _contact = { ...contactData };
      if (get(_contact, 'contactInterests.offerPriceSum')) {
        _contact = {
          ..._contact,
          contactInterests: {
            nraSum: getCommaValue(_contact.contactInterests.nraSum),
            offerPriceSum: getCommaValue(_contact.contactInterests.offerPriceSum)
          }
        };
      }
      reset(_contact);
      setFormState(true);
    }
  }, [contactData, reset, isFormSet]);

  const getCommaValue = (value) => {
    if (value && !value.includes(".")) {
      return vf_number(Number(value.replace(/,/g, "")));
    } else return value;
  }

  const updateFieldData = (key, value) => {
    if (contactData[key] === value) return;

    let contact = { _id: contactData._id, lastUpdateBy: user._id };
    const _key = key.replace("evaluatedContactInterests", "contactInterests");
    set(contact, _key, value);
    if (contact.contactInterests) {
      contact = {
        ...contact,
        contactInterests: {
          ...contactData.contactInterests,
          ...contactInterest,
          ...contact.contactInterests
        }
      }

      setContactInterest(contact.contactInterests)
    }
    setLoading(_key);
    updateContact({
      variables: {
        contact,
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

  const isChanged = (key, value) => {
    const _value = value ? typeof value === "string" ? Number(value.replace(/,/g, "")) : value : 0;
    if (key.includes("nraSum")) {
      return get(contactData, "evaluatedContactInterests.nraSum") !== _value;
    } else if (key.includes("offerPriceSum")) {
      return get(contactData, "evaluatedContactInterests.offerPriceSum")?.toFixed(2) !== _value?.toFixed(2);
    }
    return false;
  }

  return (
    <Grid container alignItems="center" justify="space-between" display="flex" direction="column" className={classes.container}>
      {SUMMARY_FIELDS(contactData).map((field, key) => (
        <Grid item key={key} style={{ position: "relative", width: "100%", marginRight: "30px", maxWidth: "44%", flexBasis: "11%" }}>
          <Grid container className={classes.gridStyle}>
            <Grid item style={{ display: "flex" }}>
              <div id={field.label} className={classes.fieldLabel}>{featureFlagChanges(showGenericPhones, field.label)}</div>
            </Grid>
            <Grid item xs={8}>
              <Controller
                control={control}
                name={field.key}
                render={(params) => {
                  const isValueOveridden = isChanged(field.key, params.value);
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
                          onBlur={(event) => {
                            let currValue = event.target.value

                            if (field.key.includes('offerPriceSum')) currValue = parseFloat(currValue.replace(/[^\d.-]/g, ''))

                            const prevValue = get(contactData, field.key) || ''

                            if (currValue != prevValue)
                              updateFieldData(field.key, currValue)
                          }}
                          onChange={({ target }) => {
                            if (field.key.includes('nraSum')) {
                              params.onChange(getCommaValue(target.value));
                            } else if (field.key.includes('offerPriceSum')) {
                              params.onChange(parseFloat(target.value).toFixed(2));
                            }
                            else {
                              params.onChange(target.value);
                            }
                          }}
                          onKeyUp={e => {
                            if (e.key === 'Enter') e.target.blur()
                          }}
                          disabled={field.disabled}
                          className={`${classes.field} ${isValueOveridden ? classes.baseValueChanged : null}`}
                          value={field.value ?? params.value}
                          // If field type = "email", show msg icon adornment
                          // If field info is updating, show loading as adornment
                          // else show nothing
                          InputProps={{
                            inputComponent: field.type === "currency" ? CurrencyFormatCustom : undefined,
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
                                <>
                                  {isValueOveridden && (
                                    <AutorenewIcon
                                      htmlColor="#757575"
                                      onClick={() => {
                                        const key = `evaluatedContactInterests.${field.key.split(".")[1]}`;
                                        updateFieldData(field.key, get(contactData, key));
                                        params.onChange(get(contactData, key));
                                      }}
                                    />
                                  )}
                                </>
                              ),
                          }}
                        />
                      ) : (
                        <ContactStatus
                          className={classes.maxWidth}
                          setValue={(value) => {
                            updateFieldData(field.key, value.name);
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
