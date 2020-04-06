import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { NavigationContext } from "../NavigationContext";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-around",
    flexGrow: 1
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  formControl: {
    margin: "15px",
    // minWidth: 120,
    // maxWidth: 300,
    color: "black"
  }
}));

const interestList = [
  "ROYALTY INTEREST",
  "OVERRIDE ROYALTY",
  "WORKING INTEREST",
  "PRODUCTION PAYMENT"
];

// const interestObjects = [
//   {
//     id: "6988a274-9414-4ccd-ad93-2b7174c9897e",
//     name: "Royalty Interest",
//     text: "interestTypeRoyaltyInterest",
//     description: "RI"
//   },
//   {
//     id: "92c2f076-5541-4c7d-a9a1-2505f5170fb5",
//     name: "Override Royalty",
//     text: "interestTypeOverrideRoyalty",
//     description: "OR"
//   },
//   {
//     id: "10370a7a-6feb-4bfe-9425-172b2ff2c93e",
//     name: "Working Interest",
//     text: "interestTypeWorkingInterest",
//     description: "WI"
//   },
//   {
//     id: "06e65943-44ca-477a-ac3d-3e479e55b5f6",
//     name: "Production Payment",
//     text: "interestTypeProductionPayment",
//     description: "PP"
//   }
// ];

const ownerTypesList = [
  "RELIGIOUS INSTITUTIONS",
  "GOVERNMENTAL BODIES",
  "NON PROFITS",
  "TRUSTS",
  "CORPORATIONS",
  "EDUCATIONAL INSTITUTIONS",
  "INDIVIDUALS",
  "UNKNOWN"
];

// const ownerTypesObjects = [
//   {
//     id: "8784ca4d-b03c-47fc-be16-05e87c7389ec",
//     name: "Religious Institutions",
//     text: "ownershipTypeReligiousInstitutions",
//     description: "R"
//   },
//   {
//     id: "15c3cc06-4852-49f9-a7d6-f80bd8969825",
//     name: "Governmental Bodies",
//     text: "ownershipTypeGovernmentalBodies",
//     description: "G"
//   },
//   {
//     id: "8d322ffb-10b5-41f8-8c65-822f350ea483",
//     name: "Non Profits",
//     text: "ownershipTypeNonProfits",
//     description: "N"
//   },
//   {
//     id: "a5de7ed6-f079-475e-a314-1a8f6c62ffca",
//     name: "Trusts",
//     text: "ownershipTypeTrusts",
//     description: "T"
//   },
//   {
//     id: "e42bb58b-5793-48bc-ae4e-dc83c152d422",
//     name: "Corporations",
//     text: "ownershipTypeCorporations",
//     description: "C"
//   },
//   {
//     id: "2cab70fe-838c-4625-81f2-bfae9afeb5ea",
//     name: "Educational Institutions",
//     text: "ownershipTypeEducationalInstitutions",
//     description: "E"
//   },
//   {
//     id: "20779d6c-0c59-46a7-9ff4-19573efe5a76",
//     name: "Individuals",
//     text: "ownershipTypeIndividuals",
//     description: "I"
//   },
//   {
//     id: "76c48dfe-0e5b-4ad6-9135-54db2dc76232",
//     name: "Unknown",
//     text: "ownershipTypeUnknown",
//     description: ""
//   }
// ];

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

  const setFilterInterest = interestNames => {
    let filter;
    let filters = [];
    let check;
    if (interestNames) {
      check = interestNames.map(val => val);
      check.forEach(option => {
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
        setStateNav(stateNav => ({
          ...stateNav,
          filterAllInterestTypes: filter
        }));
      } else {
        filter = null;
        setStateNav(stateNav => ({
          ...stateNav,
          filterAllInterestTypes: filter
        }));
      }
    }
  };

  const setFilterOwnerType = ownerTypeNames => {
    let filter;
    let filters = [];
    let check;
    if (ownerTypeNames) {
      check = ownerTypeNames.map(val => val);
      check.forEach(option => {
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
        setStateNav(stateNav => ({
          ...stateNav,
          filterAllOwnershipTypes: filter
        }));
      } else {
        filter = null;
        setStateNav(stateNav => ({
          ...stateNav,
          filterAllOwnershipTypes: filter
        }));
      }
    }
  };

  const handleChangeInterest = event => {
    // console.log(event);
    setInterestName(event);
    setFilterInterest(event);
    setStateNav(stateNav => ({
      ...stateNav,
      interestName: event
    }));
  };

  const handleChangeOwnerType = event => {
    // console.log(event);
    setOwnerTypeName(event);
    setFilterOwnerType(event);
    setStateNav(stateNav => ({
      ...stateNav,
      ownerTypeName: event
    }));
  };

  return (
    <div className={classes.row}>
      <div className={classes.root}>
        <Autocomplete
          className={classes.formControl}
          defaultValue={interestName}
          onChange={(event, newValue) => {
            handleChangeInterest(newValue);
          }}
          multiple
          options={interests.map(option => option)}
          renderInput={params => (
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
        <Autocomplete
          className={classes.formControl}
          defaultValue={ownerTypeName}
          onChange={(event, newValue) => {
            handleChangeOwnerType(newValue);
          }}
          multiple
          options={ownerTypes.map(option => option)}
          renderInput={params => (
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
      </div>
    </div>
  );
}
