import React, { useState, useContext, useRef, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Grow from '@material-ui/core/Grow';
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { NavigationContext } from "../NavigationContext";
import OperatorAutoComplete from "./OperatorAutoComplete";
import FilterDatePickerPermit from "./FilterDatePickerPermit";
import FilterDatePickerCompletetion from "./FilterDatePickerCompletetion";
import FilterDatePickerSpud from "./FilterDatePickerSpud";
import FilterDatePickerFirstProd from "./FilterDatePickerFirstProd";
import OperatorFilterJ from "./OperatorFilterJ";
import FilterWellTypeJ from "./FilterWellTypeJ";
import FilterWellProfileJ from "./FilterWellProfileJ";
import FilterWellStatusJ from "./FilterWellStatusJ";


const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 10;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-around",
    //maxWidth: 220,
    minWidth: 500
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  datesRow: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "column",
    flex: "1",
    flexGrow: 2,
    maxWidth: 400,
    minWidth: 300
  },
  formControl: {
    margin: "15px",
    minWidth: 120,
    maxWidth: 300,
    color: "black",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
    // flexDirection: "column",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: "100px"
  },
  indicator: {
    backgroundColor: "rgba(23, 170, 221, 1) !important"
  },
  inputLabel: {
    color: "black"
  },
  
}));

const MenuProps = {
  disablePortal: true,
  PaperProps: {
    style: {
      marginTop: "55px",
      backgroundColor: "#fff",
      color: "#000",
      maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
      width: 250,
      transformOrigin: 'bottom' ? 'center top' : 'center bottom',
    }
  },
};

const profileList = ["Directional", "Horizontal", "SideTracked", "Vertical"];
//chips multiselect doesn't support objects, so you need two lists. one of names and one of objects to setfilters with
const profileListObjects = [
  {
    id: "78a33b0b-46c8-4d81-ac70-22f3f601b2b1",
    name: "Directional"
  },
  {
    id: "e9a9a604-08e2-412e-9a0a-53cb24eae5ca",
    name: "Horizontal"
  },
  {
    id: "374b9c40-f0ff-4f27-90a9-f9ab93892173",
    name: "SideTracked"
  },
  {
    id: "da27ff9b-f9a0-4c92-8b2b-1bb1465219d8",
    name: "Vertical"
  }
];

const typesList = [
  "Gas",
  "Injection",
  "Oil",
  "Oil and Gas",
  // "Planned",
  "P&A",
  "Unknown",
  "Water",
  // "Storage"
];



const typesListObjects = [
  
  {
    id: "58a67831-5573-49a4-afd7-1010d0b5f194",
    name: "Gas"
  },
  {
    id: "c0d276a7-bd31-4860-b883-5ca13db4e357",
    name: "Injection"
  },
  {
    id: "327e98c4-588d-41f9-8a70-d6105882da00",
    name: "Oil"
  },
  {
    id: "53e0ac18-5111-4618-a5ca-4c2c567f2438",
    name: "Oil and Gas"
  },
  {
    id: "19d94997-a1df-41a8-8a3c-06b6a08f4998",
    name: "P&A"
  },
  {
    id: "66acfa22-0ab7-4369-9d66-586edeae2279",
    name: "Unknown"
  },
  {
    id: "b98dfa5b-c911-40bf-b869-bc56c3edaa2e",
    name: "Water"
  },
  // {
  //   id: "93404e09-84b9-4666-be2c-30a293a817da",
  //   name: "Planned"
  // },
  
  // {
  //   id: "aa1fc32b-c65c-46a0-a5c9-ab88ec5dd64a",
  //   name: "Storage"
  // }
];

const statusList = ["Active", "P&A", "Permit", "Shutin", "Unknown"];
const statusListObjects = [
  {
    id: "3ac3bad5-8c35-40e3-a266-c6af3630ee3e",
    name: "Active"
  },
  {
    id: "2bedd5aa-5275-4077-8009-3d0a2ef61e53",
    name: "Permit"
  },
  {
    id: "cd655540-6e64-4d3d-945a-df9cbf3b090f",
    name: "P&A"
  },
  {
    id: "fa7bed00-4392-4959-ae03-ce611410aba2",
    name: "Shutin"
  },
  {
    id: "73fbd1c6-0114-47ce-93cb-d5da49c0539b",
    name: "Unknown"
  },
];


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

export default function FilterFormWell() {
  const classes = useStyles();
  const theme = useTheme();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [typeName, setTypeName] = React.useState(
    stateNav.typeName ? stateNav.typeName : []
  );
  const [profileName, setProfileName] = React.useState(
    stateNav.profileName ? stateNav.profileName : []
  );
  const [statusName, setStatusName] = React.useState(
    stateNav.statusName ? stateNav.statusName : []
  );

  const [operatorName, setOperatorName] = React.useState(
    stateNav.operatorName ? stateNav.operatorName : []
  );

  const [types, setTypes] = React.useState(typesList);
  const [profiles, setProfiles] = React.useState(profileList);
  const [statuses, setStatuses] = React.useState(statusList);
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
 
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const setFilterProfile = profileNames => {
    let profileIds = [];
    profileNames.forEach(profileName => {
      profileListObjects.forEach(profileObj => {
        if (profileObj.name == profileName) {
          profileIds.push(profileObj.id);
        }
      });
    });
    let filter;
    if (profileIds.length > 0) {
      filter = ["all", ["match", ["get", "wellBoreProfileId"], profileIds, true, false]];
    } else {
      filter = null;
    }

    console.log("profile change filter", filter);
    setStateNav(stateNav => ({ ...stateNav, filterWellProfile: filter }));
  };

  const setFilterType = typeNames => {
    let typeIds = [];
    if (typeNames.length > 0) {
      typeNames.forEach(typeName => {
        typesListObjects.forEach(typeObj => {
          if (typeObj.name == typeName) {
            typeIds.push(typeObj.id);
          }
        });
      });
    }

    let filter;
    if (typeIds.length > 0) {
      filter = ["all",["match", ["get", "wellTypeId"], typeIds, true, false]];
    } else {
      filter = null;
    }

    console.log("type change filter", filter);
    setStateNav(stateNav => ({ ...stateNav, filterWellType: filter }));
  };

  const setFilterStatus = statusNames => {
    let statusIds = [];
    statusNames.forEach(statusName => {
      statusListObjects.forEach(statusObj => {
        if (statusObj.name == statusName) {
          statusIds.push(statusObj.id);
        }
      });
    });
    let filter;
    if (statusIds.length > 0) {
      filter = ["all",["match", ["get", "wellStatusId"], statusIds, true, false]];
    } else {
      filter = null;
    }

    console.log("status change filter", filter);
    setStateNav(stateNav => ({ ...stateNav, filterWellStatus: filter }));
  };

  const handleChangeStatus = event => {
    setStatusName(event.target.value);
    setFilterStatus(event.target.value);
    setStateNav(stateNav => ({ ...stateNav, statusName: event.target.value }));
  };

  const handleChangeType = event => {
    setTypeName(event.target.value);
    setFilterType(event.target.value);
    setStateNav(stateNav => ({ ...stateNav, typeName: event.target.value }));

 
  };

  const handleChangeProfile = event => {
    //console.log(event.target.value);
    setProfileName(event.target.value);
    setStateNav(stateNav => ({ ...stateNav, profileName: event.target.value }));
    setFilterProfile(event.target.value);
  };

  const deleteChipTypeName = value => () => {
    const removeChips = typeName.filter(chip => chip !== value);
    setStateNav(stateNav => ({ ...stateNav, typeName: removeChips }));
    setFilterType(removeChips);
    setTypeName(removeChips);

    if(value==undefined){
      console.log('zero')
    }


  };

  const deleteChipProfileName = value => () => {
    const removeChips = profileName.filter(chip => chip !== value);
    setProfileName(removeChips);
    setFilterProfile(removeChips);
    setStateNav(stateNav => ({ ...stateNav, profileName: removeChips }));
  };

  const deleteChipStatus = value => () => {
    const removeChips = statusName.filter(chip => chip !== value);
    setStatusName(removeChips);
    setFilterStatus(removeChips);
    setStateNav(stateNav => ({ ...stateNav, statusName: removeChips }));
  };


  const handleOperatorChange = value => {
    let filter;
    if(value && value.length) {
     filter = ['match', ['get', 'operator'], value, true, false]
     setStateNav(stateNav => ({ ...stateNav, operatorName:value}))
     setOperatorName(value)
    }
    else {
     filter = null
     setStateNav(stateNav => ({ ...stateNav, operatorName: null}))
    }
    setStateNav(stateNav => ({ ...stateNav, filterOperator: filter}))
   };






  return (
    <div className={classes.row}>
      <div className={classes.root}>

        <FormControl className={classes.formControl}>
          <OperatorFilterJ />
        </FormControl>

        <FormControl className={classes.formControl}>
          <OperatorAutoComplete />
        </FormControl>


        <FormControl variant="outlined" className={classes.formControl}>
        <FilterWellTypeJ/>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} htmlFor="select-multiple-chip1">
            Well Type
          </InputLabel>
          <Select
            variant="outlined"
            multiple={true}
            labelWidth={labelWidth}
            value={typeName}
            onChange={handleChangeType}
 
            renderValue={selected => (
              <div
                className={classes.chips}
                onMouseDown={event => {
                  event.preventDefault()
                  event.stopPropagation();
                  }}
                                >
                {selected.map(value => (
                  <Chip
                    onDelete={deleteChipTypeName(value)}
                    key={value}
                    label={value}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          > 
            {types.map(type => (
              <MenuItem
                key={type}
                value={type}
                style={{ transformOrigin:'bottom' ? 'center top' : 'center bottom' }}
              >
                <Checkbox checked={typeName.indexOf(type) > -1} />
                <ListItemText primary={type} />
              </MenuItem>
              
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
        <FilterWellProfileJ/>
        </FormControl>


        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} htmlFor="select-multiple-chip-profile">
            Well Profile
          </InputLabel>
          <Select
            variant="outlined"
            multiple
            labelWidth={labelWidth}
            value={profileName}
            onChange={handleChangeProfile}
            
            renderValue={selected => (
              <div
                className={classes.chips}
                onMouseDown={event => {
                  event.preventDefault()
                  event.stopPropagation();
                  }}
              >
                {selected.map(value => (
                  <Chip
                    onDelete={deleteChipProfileName(value)}
                    key={value}
                    label={value}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {profiles.map(profile => (
              <MenuItem
                key={profile}
                value={profile}
                style={getStyles(profile, profileName, theme)}
              >
                <Checkbox checked={profileName.indexOf(profile) > -1} />
                <ListItemText primary={profile} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
        <FilterWellStatusJ/>
        </FormControl>


        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} htmlFor="select-multiple-chip-status">
            Well Status
          </InputLabel>
          <Select
            multiple
            variant="outlined"
            labelWidth={labelWidth}
            value={statusName}
            onChange={handleChangeStatus}
            renderValue={selected => (
              <div
                className={classes.chips}
                onMouseDown={event => {
                  event.preventDefault()
                  event.stopPropagation();
                  }}
              >
                {selected.map(value => (
                  <Chip
                    onDelete={deleteChipStatus(value)}
                    key={value}
                    label={value}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {statuses.map(status => (
              <MenuItem
                key={status}
                value={status}
                style={getStyles(status, statusName, theme)}
              >
                <Checkbox checked={statusName.indexOf(status) > -1} />
                <ListItemText primary={status} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      
     <div className={classes.datesRow}>
        <FilterDatePickerPermit labelDates={"Permit"} />
        <FilterDatePickerSpud labelDates={"Spud"} />
        <FilterDatePickerCompletetion labelDates={"Completetion"} />
        <FilterDatePickerFirstProd labelDates={"First Production"} />
      </div> 
      

    </div>
  );
}
