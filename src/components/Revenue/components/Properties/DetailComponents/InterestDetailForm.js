import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import loadashFilter from "lodash/filter";
import moment from "moment";
import GlobalStyles from "GlobalStyles.js";

import { makeStyles } from "@material-ui/styles";
import { Typography, Grid, TextField, MenuItem, Select, Button, IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { useMutation } from "@apollo/client";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";

import { ADD_PROPERTY_INTEREST } from "graphQL/useMutationAddpropertyInterest";
import { UPDATE_PROPERTY_INTEREST } from "graphQL/useMutationUpdatepropertyInterest";

import { getDateWithoutTime } from "components/Shared/functions";
import ArrowForwardIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import ContactPaginatedAutocomplete from "components/Revenue/components/Common/ContactsPaginatedAutocomplete";

const interestTypeOptions = ["Royalty Interest", "Overriding Royalty", "Working Interest"];

const statusOptions = ["Active", "Inactive"];

const costFreeOptions = ["No", "Yes - All Products", "Yes - Gas", "Yes - Oil", "Unknown"];

const productTypeOptions = ["OIL", "GAS", "NGL", "ALL"];

const useStyles = makeStyles((theme) => ({
  sideModal: {
    marginTop: 20,
    marginRight: 24,
    padding: "16px 10px",
    background: "#ffffff",
    borderRadius: 8,
    overflow: "auto",
    height: "calc(100vh - 280px)",
    maxHeight: "calc(100vh - 280px)",
    maxWidth: "620px",
  },
  metaPanelCloseIcon: {
    "& svg": {
      fontSize: 18,
      cursor: "pointer",
      fill: "#808080 !important",
    },
  },
  numberField: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  dateRoot: {
    color: "grey",
    "& input": {
      marginLeft: "20px",
    },
  },
  select: {
    width: "100%",
  },
  btnColor: {
    color: "white",
    // backgroundColor: "#60ABD6",
    backgroundColor: GlobalStyles.colors.lightBlue,
  },
  fieldset: {
    marginTop: 40,
  },
}));

const InterestDetailForm = (props) => {
  const classes = useStyles(props);
  const { selectedInterest } = props;
  let history = useHistory();

  const { control, getValues, reset } = useForm();

  const [addPropertyInterest] = useMutation(ADD_PROPERTY_INTEREST, {
    onCompleted: () => {
      props.onClose();
    },
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
    awaitRefetchQueries: true,
  });
  const [updatePropertyInterest] = useMutation(UPDATE_PROPERTY_INTEREST, {
    onCompleted: () => {
      props.onClose();
    },
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
    awaitRefetchQueries: true,
  });

  const handleSave = () => {
    const id = history.location.pathname.split("/")[4];
    const values = getValues();

    values.effectiveDate = getDateWithoutTime(values.effectiveDate);
    if (selectedInterest) {
      updatePropertyInterest({
        variables: {
          propertyInterest: {
            ...values,
            _id: selectedInterest._id,
            interestType: values.interestType?.name ? values.interestType.name : values.interestType,
            owner: values.owner._id ? values.owner._id : null,
          },
        },
      });
    } else {
      addPropertyInterest({
        variables: {
          propertyInterest: {
            ...values,
            interestType: values.interestType.name,
            owner: values.owner._id ? values.owner._id : null,
            propertyId: props.propertyId || id,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (selectedInterest) {
      const { interestAmount, effectiveDate, owner } = selectedInterest;
      reset({
        ...selectedInterest,
        interestAmount: typeof interestAmount === "number" ? interestAmount.toString() : interestAmount,
        effectiveDate: effectiveDate ? moment(effectiveDate).format("YYYY-MM-DD") : null,
        owner: owner
          ? {
            ...owner,
            name: owner.entityDetail.name,
          }
          : { name: "", _id: null },
      });
    } else if (props.propertyOwnerContact) {
      reset({ owner: props.propertyOwnerContact });
    } else if (props.propertyDetails?.owner) {
      props.setShowOwnerDialog(true);
    }
  }, [selectedInterest, props.propertyOwnerContact]);

  return (
    <div className={`flex column justifyStart alignStart w-100 ${classes.sideModal}`}>
      <div className="flex justifyBetween alignCenter w-100">
        <Typography
          varient="h5"
          className={classes.titleText}
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
            marginLeft: "5px",
          }}
        >
          {selectedInterest ? "Update" : "Add"} Interest Details
        </Typography>
        <div className="flex alignCenter">
          <span onClick={props.onClose} className={classes.metaPanelCloseIcon}>
            <ArrowForwardIcon />
          </span>
        </div>
      </div>
      <Grid container style={{ padding: "0px 10px" }}>
        <Grid item xs={12} className={classes.fieldset}>
          <label>Owner Name</label>
          <Controller
            control={control}
            name="owner"
            defaultValue={{ name: "", _id: null }}
            render={(params) => (
              <ContactPaginatedAutocomplete
                nameAutValue={params.value}
                setNameAutValue={(value) => {
                  params.onChange(value);
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} className={classes.fieldset}>
          <label>Interest Type</label>
          <Controller
            control={control}
            name="interestType"
            defaultValue={""}
            render={(params) => (
              <InterestType
                options={interestTypeOptions.map((option) => ({
                  _id: option,
                  name: option,
                }))}
                value={params.value}
                onChange={(value) => {
                  params.onChange(value);
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} className={classes.fieldset}>
          <label>Product Type</label>
          <Controller
            control={control}
            name="productType"
            defaultValue={null}
            render={(params) => (
              <Select
                fullWidth
                value={params.value}
                onChange={(e) => {
                  params.onChange(e.target.value);
                }}
              >
                {productTypeOptions.map((option) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={12} className={classes.fieldset}>
          <label>Interest Amount</label>
          <Controller
            control={control}
            name="interestAmount"
            defaultValue={""}
            render={(params) => (
              <TextField
                style={{ width: "100%" }}
                className={classes.numberField}
                type="number"
                value={params.value}
                onChange={(e) => params.onChange(e.target.value)}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} className={classes.fieldset}>
          <label>Effective Date</label>
          <Controller
            control={control}
            name="effectiveDate"
            defaultValue={null}
            render={(params) => (
              <TextField
                {...params}
                type="date"
                margin="dense"
                fullWidth
                value={params.value ? moment(params.value).utc(true).format("yyyy-MM-DD") : ""}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={(event) => {
                        params.onChange("");
                      }}
                    >
                      <Clear style={{ height: 22, width: 22 }} />
                    </IconButton>
                  ),
                  classes: { root: classes.dateRoot },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} className={classes.fieldset}>
          <label>End Date</label>
          <Controller
            control={control}
            name="endDate"
            defaultValue={null}
            render={(params) => (
              <TextField
                {...params}
                type="date"
                margin="dense"
                fullWidth
                value={params.value ? moment(params.value).utc(true).format("yyyy-MM-DD") : ""}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={(event) => {
                        params.onChange("");
                      }}
                    >
                      <Clear style={{ height: 22, width: 22 }} />
                    </IconButton>
                  ),
                  classes: { root: classes.dateRoot },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} className={classes.fieldset}>
          <label>Status</label>
          <Controller
            control={control}
            name="status"
            defaultValue={null}
            render={(params) => (
              <Select
                fullWidth
                value={params.value}
                onChange={(e) => {
                  params.onChange(e.target.value);
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={12} className={classes.fieldset}>
          <label>Cost Free?</label>
          <Controller
            control={control}
            name="costFree"
            defaultValue={null}
            render={(params) => (
              <Select
                fullWidth
                value={params.value}
                onChange={(e) => {
                  params.onChange(e.target.value);
                }}
              >
                {costFreeOptions.map((option) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={12} className={classes.fieldset}>
          <div>
            <div style={{ float: "right" }}>
              <Button style={{ margin: "25px 5px 25px 0px" }} variant="outlined">
                Cancel
              </Button>
              <Button className={classes.btnColor} variant="outlined" onClick={handleSave}>
                {props.selectedInterest ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default InterestDetailForm;

const InterestType = ({ onChange, value, options, ...other }) => {
  const filter = createFilterOptions();
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

  const onInputChange = (event, value) => {
    onChange(value);
  };

  return (
    <Autocomplete
      defaultValue={value}
      value={value}
      disableListWrap
      classes={classes}
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
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
        let inputValue = JSON.parse(JSON.stringify(value));
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
          if (newValue._id !== "newEntity") onChange(newValue);
          else onChange({ _id: "newEntity", name: newValue.name });
        } else onChange("");
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
