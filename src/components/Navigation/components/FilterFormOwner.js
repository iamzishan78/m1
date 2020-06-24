import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { NavigationContext } from "../NavigationContext";
import FilterOwnerCount from "./FilterOwnerCount";
import Grid from "@material-ui/core/Grid";
// import FilterOwnerInterestSum from "./FilterOwnerInterestSum";

const useStyles = makeStyles((theme) => ({
  formControl: {
    color: "black",
  },
}));

const interestList = [
  "ROYALTY INTEREST",
  "OVERRIDE ROYALTY",
  "WORKING INTEREST",
  "PRODUCTION PAYMENT",
];

const ownerTypesList = [
  "RELIGIOUS INSTITUTIONS",
  "GOVERNMENTAL BODIES",
  "NON PROFITS",
  "TRUSTS",
  "CORPORATIONS",
  "EDUCATIONAL INSTITUTIONS",
  "INDIVIDUALS",
  "UNKNOWN",
];

export default function FilterFormOwner() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [interestName, setInterestName] = useState(
    stateNav.interestName ? stateNav.interestName : []
  );
  const [ownerTypeName, setOwnerTypeName] = useState(
    stateNav.ownerTypeName ? stateNav.ownerTypeName : []
  );
  const [interests, setInterests] = useState(interestList);
  const [ownerTypes, setOwnerTypes] = useState(ownerTypesList);

  // there is an opportunity to break these out into seperate components
  // instead of including it on a form.

  const setFilterInterest = (interestNames) => {
    let filter;
    let filters = [];
    let check;
    if (interestNames) {
      check = interestNames.map((val) => val);
      check.forEach((option) => {
        if (option === "ROYALTY INTEREST") {
          filters.push(["get", "interestTypeRoyaltyInterest"]);
        }
        if (option === "OVERRIDE ROYALTY") {
          filters.push(["get", "interestTypeOverrideRoyalty"]);
        }
        if (option === "WORKING INTEREST") {
          filters.push(["get", "interestTypeWorkingInterest"]);
        }
        if (option === "PRODUCTION PAYMENT") {
          filters.push(["get", "interestTypeProductionPayment"]);
        }
      });
      if (filters && filters.length > 0) {
        filters.unshift("any");
        filter = filters;
        setStateNav((stateNav) => ({
          ...stateNav,
          filterAllInterestTypes: filter,
        }));
      } else {
        filter = null;
        setStateNav((stateNav) => ({
          ...stateNav,
          filterAllInterestTypes: filter,
        }));
      }
    }
  };

  const setFilterOwnerType = (ownerTypeNames) => {
    let filter;
    let filters = [];
    let check;
    if (ownerTypeNames) {
      check = ownerTypeNames.map((val) => val);
      check.forEach((option) => {
        if (option === "RELIGIOUS INSTITUTIONS") {
          filters.push(["get", "ownershipTypeReligiousInstitutions"]);
        }
        if (option === "GOVERNMENTAL BODIES") {
          filters.push(["get", "ownershipTypeGovernmentalBodies"]);
        }
        if (option === "NON PROFITS") {
          filters.push(["get", "ownershipTypeNonProfits"]);
        }
        if (option === "TRUSTS") {
          filters.push(["get", "ownershipTypeTrusts"]);
        }
        if (option === "CORPORATIONS") {
          filters.push(["get", "ownershipTypeCorporations"]);
        }
        if (option === "EDUCATIONAL INSTITUTIONS") {
          filters.push(["get", "ownershipTypeEducationalInstitutions"]);
        }
        if (option === "INDIVIDUALS") {
          filters.push(["get", "ownershipTypeIndividuals"]);
        }
        if (option === "UNKNOWN") {
          filters.push(["get", "ownershipTypeUnknown"]);
        }
      });
      if (filters && filters.length > 0) {
        filters.unshift("any");
        filter = filters;
        setStateNav((stateNav) => ({
          ...stateNav,
          filterAllOwnershipTypes: filter,
        }));
      } else {
        filter = null;
        setStateNav((stateNav) => ({
          ...stateNav,
          filterAllOwnershipTypes: filter,
        }));
      }
    }
  };

  const handleChangeInterest = (event) => {
    // console.log(event);
    setInterestName(event);
    setFilterInterest(event);
    setStateNav((stateNav) => ({
      ...stateNav,
      interestName: event,
    }));
  };

  const handleChangeOwnerType = (event) => {
    // console.log(event);
    setOwnerTypeName(event);
    setFilterOwnerType(event);
    setStateNav((stateNav) => ({
      ...stateNav,
      ownerTypeName: event,
    }));
  };

  return (
    <Grid
      container
      item
      spacing={2}
      style={{ padding: "8px", width: "100%", margin: "0" }}
    >
      <Grid item sm={12}>
        <Autocomplete
          ChipProps={{ color: "secondary" }}
          className={classes.formControl}
          defaultValue={interestName}
          onChange={(event, newValue) => {
            handleChangeInterest(newValue);
          }}
          multiple
          options={interests.map((option) => option)}
          renderInput={(params) => (
            <form autoComplete="off">
              <TextField
                {...params}
                variant="outlined"
                label="Interest Types"
                placeholder=""
                fullWidth={true}
              />
            </form>
          )}
          disableListWrap
        />
      </Grid>
      <Grid item sm={12}>
        <Autocomplete
          ChipProps={{ color: "secondary" }}
          className={classes.formControl}
          defaultValue={ownerTypeName}
          onChange={(event, newValue) => {
            handleChangeOwnerType(newValue);
          }}
          multiple
          options={ownerTypes.map((option) => option)}
          renderInput={(params) => (
            <form autoComplete="off">
              <TextField
                {...params}
                variant="outlined"
                label="Owner Types"
                placeholder=""
                fullWidth={true}
              />
            </form>
          )}
          disableListWrap
        />
      </Grid>

      <FilterOwnerCount />

      {/* TEMPORARY COMMENT OUT BELOW
      FEATURE WORKS AND WILL HELP WITH M1 LOCAL DEBUGGING
      <Grid item sm={12}><FilterOwnerInterestSum/> </Grid>*/}
    </Grid>
  );
}
