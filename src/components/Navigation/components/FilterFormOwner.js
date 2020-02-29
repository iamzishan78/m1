
import React, { useState, useContext, useEffect, useRef } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
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
  dates: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row"
  },
  formControl: {
    margin: "15px",
    minWidth: 120,
    maxWidth: 300,
    color: "black"
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: "100px"
  },
  indicator: {
    backgroundColor: "rgba(23, 170, 221, 1) !important"
  },
  inputLabel: {
    color: "black"
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  disablePortal: true,
  PaperProps: {
    style: {
      marginTop: "55px",
      backgroundColor: "#fff",
      color: "#000",
      //maxHeight: ITEM_HEIGHT * 7.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const interestList = [
  "Royalty Interest",
  "Override Royalty",
  "Working Interest",
  "Production Payment"
];
//chips multiselect doesn't support objects, so you need two lists. one of names and one of objects to setfilters with
const interestObjects = [
  {
    id: "6988a274-9414-4ccd-ad93-2b7174c9897e",
    name: "Royalty Interest",
    text: "interestTypeRoyaltyInterest",
    description: "RI"
  },
  {
    id: "92c2f076-5541-4c7d-a9a1-2505f5170fb5",
    name: "Override Royalty",
    text: "interestTypeOverrideRoyalty",
    description: "OR"
  },
  {
    id: "10370a7a-6feb-4bfe-9425-172b2ff2c93e",
    name: "Working Interest",
    text: "interestTypeWorkingInterest",
    description: "WI"
  },
  {
    id: "06e65943-44ca-477a-ac3d-3e479e55b5f6",
    name: "Production Payment",
    text: "interestTypeProductionPayment",
    description: "PP"
  }
];

const ownerTypesList = [
  "Religious Institutions",
  "Governmental Bodies",
  "Non Profits",
  "Trusts",
  "Corporations",
  "Educational Institutions",
  "Individuals",
  "Unknown"
];

const ownerTypesObjects = [
  {
    id: "8784ca4d-b03c-47fc-be16-05e87c7389ec",
    name: "Religious Institutions",
    text: "ownershipTypeReligiousInstitutions",
    description: "R"
  },
  {
    id: "15c3cc06-4852-49f9-a7d6-f80bd8969825",
    name: "Governmental Bodies",
    text: "ownershipTypeGovernmentalBodies",
    description: "G"
  },
  {
    id: "8d322ffb-10b5-41f8-8c65-822f350ea483",
    name: "Non Profits",
    text: "ownershipTypeNonProfits",
    description: "N"
  },
  {
    id: "a5de7ed6-f079-475e-a314-1a8f6c62ffca",
    name: "Trusts",
    text: "ownershipTypeTrusts",
    description: "T"
  },
  {
    id: "e42bb58b-5793-48bc-ae4e-dc83c152d422",
    name: "Corporations",
    text: "ownershipTypeCorporations",
    description: "C"
  },
  {
    id: "2cab70fe-838c-4625-81f2-bfae9afeb5ea",
    name: "Educational Institutions",
    text: "ownershipTypeEducationalInstitutions",
    description: "E"
  },
  {
    id: "20779d6c-0c59-46a7-9ff4-19573efe5a76",
    name: "Individuals",
    text: "ownershipTypeIndividuals",
    description: "I"
  },
  {
    id: "76c48dfe-0e5b-4ad6-9135-54db2dc76232",
    name: "Unknown",
    text: "ownershipTypeUnknown",
    description: ""
  }
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

export default function FilterFormOwner() {
  const classes = useStyles();
  const theme = useTheme();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [interestName, setInterestName] = useState(
    stateNav.interestName ? stateNav.interestName : []
  );
  const [ownerTypeName, setOwnerTypeName] = useState(
    stateNav.ownerTypeName ? stateNav.ownerTypeName : []
  );
  const [interests, setInterests] = useState(interestList);
  const [ownerTypes, setOwnerTypes] = useState(ownerTypesList);
  
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const setFilterInterest = interestNames => {
    //because the multi-select doesn't support objects I had to map them here
    //we need a list of well property names to pass to the filter
    let interestIds = [];
    interestNames.forEach(interestName => {
      interestObjects.forEach(interestObj => {
        if (interestObj.name == interestName) {
          interestIds.push(interestObj.text);
        }
      });
    });

    //clear all old filters before we set the new selected ones
    let filter = null;
    setStateNav(stateNav => ({
      ...stateNav,
      filterInterestTypeRoyaltyInterest: filter
    }));
    setStateNav(stateNav => ({
      ...stateNav,
      filterInterestTypeOverrideRoyalty: filter
    }));
    setStateNav(stateNav => ({
      ...stateNav,
      filterInterestTypeWorkingInterest: filter
    }));
    setStateNav(stateNav => ({
      ...stateNav,
      filterInterestTypeProductionPayment: filter
    }));

    if (interestIds.length > 0) {
      interestIds.forEach(i => {
        let filter = ["==", ["get", i], true];

        //you can pass a variable to the key because setState won't work so have to hardcode each filter. ugh
        switch (i) {
          case "interestTypeRoyaltyInterest":
            setStateNav(stateNav => ({
              ...stateNav,
              filterInterestTypeRoyaltyInterest: filter
            }));
            break;
          case "interestTypeOverrideRoyalty":
            setStateNav(stateNav => ({
              ...stateNav,
              filterInterestTypeOverrideRoyalty: filter
            }));
            break;
          case "interestTypeWorkingInterest":
            setStateNav(stateNav => ({
              ...stateNav,
              filterInterestTypeWorkingInterest: filter
            }));
            break;
          case "interestTypeProductionPayment":
            setStateNav(stateNav => ({
              ...stateNav,
              filterInterestTypeProductionPayment: filter
            }));
            break;
          default:
        }
      });
    }
  };

  const setFilterOwnerType = ownerTypeNames => {
    //because the multi-select doesn't support objects I had to map them here
    //we need a list of well property names to pass to the filter
    let typeIds = [];
    ownerTypeNames.forEach(ownerTypeName => {
      ownerTypesObjects.forEach(ownerTypeObj => {
        if (ownerTypeObj.name == ownerTypeName) {
          typeIds.push(ownerTypeObj.text);
        }
      });
    });

    //clear all old filters before we set the new selected ones
    let filter = null;
    setStateNav(stateNav => ({
      ...stateNav,
      filterOwnershipTypeReligiousInstitutions: filter
    }));
    setStateNav(stateNav => ({
      ...stateNav,
      filterOwnershipTypeGovernmentalBodies: filter
    }));
    setStateNav(stateNav => ({
      ...stateNav,
      filterOwnershipTypeNonProfits: filter
    }));
    setStateNav(stateNav => ({
      ...stateNav,
      filterOwnershipTypeTrusts: filter
    }));
    setStateNav(stateNav => ({
      ...stateNav,
      filterOwnershipTypeCorporations: filter
    }));
    setStateNav(stateNav => ({
      ...stateNav,
      filterOwnershipTypeEducationalInstitutions: filter
    }));
    setStateNav(stateNav => ({
      ...stateNav,
      filterOwnershipTypeIndividuals: filter
    }));
    setStateNav(stateNav => ({
      ...stateNav,
      filterOwnershipTypeUnknown: filter
    }));

    if (typeIds.length > 0) {
      typeIds.forEach(i => {
        let filter = ["==", ["get", i], true];
        //you can pass a variable to the key because setState won't work so have to hardcode each filter. ugh
        switch (i) {
          case "ownershipTypeReligiousInstitutions":
            setStateNav(stateNav => ({
              ...stateNav,
              filterOwnershipTypeReligiousInstitutions: filter
            }));
            break;
          case "ownershipTypeGovernmentalBodies":
            setStateNav(stateNav => ({
              ...stateNav,
              filterOwnershipTypeGovernmentalBodies: filter
            }));
            break;
          case "ownershipTypeNonProfits":
            setStateNav(stateNav => ({
              ...stateNav,
              filterOwnershipTypeNonProfits: filter
            }));
            break;
          case "ownershipTypeTrusts":
            setStateNav(stateNav => ({
              ...stateNav,
              filterOwnershipTypeTrusts: filter
            }));
            break;
          case "ownershipTypeCorporations":
            setStateNav(stateNav => ({
              ...stateNav,
              filterOwnershipTypeCorporations: filter
            }));
            break;
          case "ownershipTypeEducationalInstitutions":
            setStateNav(stateNav => ({
              ...stateNav,
              filterOwnershipTypeEducationalInstitutions: filter
            }));
            break;
          case "ownershipTypeIndividuals":
            setStateNav(stateNav => ({
              ...stateNav,
              filterOwnershipTypeIndividuals: filter
            }));
            break;
          case "ownershipTypeUnknown":
            setStateNav(stateNav => ({
              ...stateNav,
              filterOwnershipTypeUnknown: filter
            }));
            break;
          default:
        }
      });
    }
  };

  const handleChangeInterest = event => {
    console.log(event.target.value);
    setInterestName(event.target.value);
    setFilterInterest(event.target.value);
    setStateNav(stateNav => ({
      ...stateNav,
      interestName: event.target.value
    }));
  };

  const handleChangeOwnerType = event => {
    console.log(event.target.value);
    setOwnerTypeName(event.target.value);
    setFilterOwnerType(event.target.value);
    setStateNav(stateNav => ({
      ...stateNav,
      ownerTypeName: event.target.value
    }));
    // setSelectDisabledInterestName(true);
  };

  const deleteChipInterestName = value => () => {
    const removeChips =  interestName.filter(chip => chip !== value);
    setInterestName(removeChips);
    setFilterInterest(removeChips);
    setStateNav(stateNav => ({ ...stateNav, interestName: removeChips }));
  };


  const deleteChipOwnerType = value => () => {
    const removeChips =  ownerTypeName.filter(chip => chip !== value);
    setOwnerTypeName(removeChips);
    setFilterOwnerType(removeChips);
    setStateNav(stateNav => ({ ...stateNav, ownerTypeName: removeChips }));
  };

  return (
    <div className={classes.row}>
      <div className={classes.root}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel
            ref={inputLabel}
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Interest Types
          </InputLabel>
          <Select
            variant="outlined"
            labelWidth={labelWidth}
            multiple={true}
            value={interestName}
            onChange={handleChangeInterest}
            // input={<Input  id="select-multiple-chip1" />}
            renderValue={selected => (
              <div className={classes.chips} 
                onMouseDown={(event) => {
                    event.stopPropagation()
                }}
              >
                {selected.map(value => (
                  <Chip
                    onDelete={deleteChipInterestName(value)}
                    key={value}
                    label={value}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {interests.map(interest => (
              <MenuItem
                key={interest}
                value={interest}
                style={getStyles(interest, interestName, theme)}
              >
                <Checkbox checked={interestName.indexOf(interest) > -1} />
                <ListItemText primary={interest} />
                {/* {interest} */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel
            ref={inputLabel}
            className={classes.inputLabel}
            htmlFor="select-multiple-chip1"
          >
            Owner Types
          </InputLabel>
          <Select
            variant="outlined"
            multiple={true}
            labelWidth={labelWidth}
            value={ownerTypeName}
            onChange={handleChangeOwnerType}
            // input={<Input  id="select-multiple-chip1" />}
            renderValue={selected => (
              <div className={classes.chips} onMouseDown={(event) => {
                event.stopPropagation()
            }}>
                {selected.map(value => (
                  <Chip
                    onDelete={deleteChipOwnerType(value)}
                    key={value}
                    label={value}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {ownerTypes.map(value => (
              <MenuItem
                key={value}
                value={value}
                style={getStyles(value, ownerTypeName, theme)}
              >
                <Checkbox checked={ownerTypeName.indexOf(value) > -1} />
                <ListItemText primary={value} />
                {/* {value} */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
