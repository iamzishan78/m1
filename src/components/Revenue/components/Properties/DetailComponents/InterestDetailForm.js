import React, { useState, useEffect, useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import loadashFilter from "lodash/filter";
import get from "lodash/get";
import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
  Button,
} from "@material-ui/core";
import { useLazyQuery, useMutation } from "@apollo/client";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";

import { AppContext } from "AppContext";
import { setStateIfDeepEqual } from "components/Shared/functions";
import { PAGINATEDCONTACTSQUERY } from "graphQL/useQueryPaginatedContacts";
import { ADDCONTACT } from "graphQL/useMutationAddContact";
import { ADD_PROPERTY_INTEREST } from "graphQL/useMutationAddpropertyInterest";

import ArrowForwardIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import AutocompEntityNamesVirtualizeList from "components/Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList";

const interestTypeOptions = [
  "Royalty Interest",
  "Overriding Royalty",
  "Working Interest",
];

const statusOptions = ["Active", "InActive"];

const costFreeOptions = ["Yes", "No"];

const useStyles = makeStyles((theme) => ({
  sideModal: {
    marginTop: 24,
    padding: "16px 10px",
    background: "#ffffff",
    borderRadius: 8,
    overflow: "auto",
    height: "calc(100vh - 370px)",
    maxHeight: "calc(100vh - 370px)",
    // maxWidth: 360,
    width: "30%",
    "&[type=number]": {
      "-moz-appearance": "textfield",
    },
    "&::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "&::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
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
    backgroundColor: "#60ABD6",
  },
}));

const InterestDetailForm = (props) => {
  const classes = useStyles(props);
  let history = useHistory();
  const { control, getValues, watch } = useForm();

  const [addPropertyInterest] = useMutation(ADD_PROPERTY_INTEREST);

  const handleSave = () => {
    const id = history.location.pathname.split('/')[history.location.pathname.split('/').length -1 ];
    const values = getValues();
    addPropertyInterest({
      variables: {
        propertyInterest: {
          ...values,
          interestType: values.interestType.name,
          owner: values.owner._id,
          propertyId: id,
        }
      }
    })
  }

  return (
    <div
      className={`flex column justifyStart alignStart w-100 ${classes.sideModal}`}
    >
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
          Add Interest Details
        </Typography>
        <div className="flex alignCenter">
          <span onClick={props.onClose} className={classes.metaPanelCloseIcon}>
            <ArrowForwardIcon />
          </span>
        </div>
      </div>
      <Grid container style={{ padding: "0px 10px" }}>
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <label>Owner Name</label>
          <Controller
            control={control}
            name="owner"
            defaultValue={{ name: "", _id: null }}
            render={(props) => (
              <ContactPaginatedDropdown
                nameAutValue={props.value}
                setNameAutValue={(value) => {
                  props.onChange(value);
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <label>Interest Type</label>
          <Controller
            control={control}
            name="interestType"
            defaultValue={""}
            render={(props) => (
              <InterestType
                options={interestTypeOptions.map((option) => ({
                  _id: option,
                  name: option,
                }))}
                value={props.value}
                onChange={(value) => {
                  props.onChange(value);
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <label>Interest Amount</label>
          <Controller
            control={control}
            name="interestAmount"
            defaultValue={""}
            render={(props) => (
              <TextField
                style={{ width: "100%" }}
                className={classes.numberField}
                type="number"
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <label>Effective Date</label>
          <Controller
            control={control}
            name="effectiveDate"
            defaultValue={null}
            render={(props) => (
              <TextField
                value={props.value}
                margin="dense"
                type="date"
                vaient=""
                placeholder=""
                fullWidth
                format="MM/DD/YY"
                onChange={(e) => {
                  props.onChange(e.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  classes: {
                    root: classes.dateRoot,
                    focused: classes.focused,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <label>Status</label>
          <Controller
            control={control}
            name="status"
            defaultValue={null}
            render={(props) => (
              <Select
                fullWidth
                value={props.value}
                onChange={(e) => {
                  props.onChange(e.target.value);
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <label>Cost Free?</label>
          <Controller
            control={control}
            name="costFree"
            defaultValue={null}
            render={(props) => (
              <Select
                fullWidth
                value={props.value}
                onChange={(e) => {
                  props.onChange(e.target.value);
                }}
              >
                {costFreeOptions.map((option) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <div
            style={{
              borderTop: "1px solid #EEF1F4",
            }}
          >
            <div style={{ float: "right" }}>
              <Button
                style={{ margin: "25px 5px 25px 0px" }}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                className={classes.btnColor}
                style={{ margin: "25px 25px 25px 5px" }}
                variant="outlined"
                onClick={handleSave}
              >
                Add
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default InterestDetailForm;

const ContactPaginatedDropdown = ({ nameAutValue, setNameAutValue }) => {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [nameAutInputValue, NameAutInputValue] = useState("");
  const setNameAutInputValue = (newState) => {
    setStateIfDeepEqual(NameAutInputValue, newState);
  };

  const [
    getPaginatedContacts,
    { data: allContacts, fetchMore: fetchMorePaginatedContacts },
  ] = useLazyQuery(PAGINATEDCONTACTSQUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  
  const [addContact, { data: addContactData }] = useMutation(ADDCONTACT);

  useEffect(() => {
    if (get(addContactData, "addContact.contact")) {
      setNameAutValue({ name: addContactData.addContact.contact.name, _id: addContactData.addContact.contact._id });
    }
  }, [addContactData]);

  useEffect(() => {
    if (allContacts?.paginatedContacts) {
      setMongoEntitiesArray([
        ...allContacts?.paginatedContacts?.edges?.map((el) => el.node),
      ]);
      setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
    }
    setIsNextPageLoading(false);
  }, [allContacts]);

  useEffect(() => {
    //will also run during initial mount
    setIsNextPageLoading(true);
    getPaginatedContacts({
      variables: {
        search: nameAutInputValue,
      },
    });
  }, [nameAutInputValue]);

  const loadNextPage = async (pageVariables) => {
    setIsNextPageLoading(true);
    fetchMorePaginatedContacts(pageVariables);
    return null;
  };

  return (
    <AutocompEntityNamesVirtualizeList
      className={classes.maxWidth}
      mongoEntitiesArray={mongoEntitiesArray}
      setMongoEntitiesArray={setMongoEntitiesArray}
      nameAutValue={nameAutValue}
      setNameAutValue={setNameAutValue}
      nameAutInputValue={nameAutInputValue}
      setNameAutInputValue={setNameAutInputValue}
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      loadNextPage={loadNextPage}
      addNew={true}
      addNewOnClick={(value) => {
        const contact = { name: value };
        addContact({
          variables: {
            contact: {
              ...contact,
              createBy: stateApp.user.mongoId,
              lastUpdateBy: stateApp.user.mongoId,
            },
          },
          refetchQueries: ["getPaginatedContacts", "getContact"],
          awaitRefetchQueries: true,
        });
      }}
    />
  );
};

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
        if (option._id === "newEntity")
          return (
            <Typography style={{ color: "midnightblue" }}>
              Add '{option.name}'
            </Typography>
          );

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
