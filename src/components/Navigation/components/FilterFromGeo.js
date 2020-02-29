import React, { useState, useContext, useEffect, useRef } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { NavigationContext } from "../NavigationContext";
import FilterStateName from "./FilterStateName";
import FilterCountyName from "./FilterCountyName";
import FilterSurvey from "./FilterSurvey";
import FilterAbstract from "./FilterAbstract";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    //flexWrap: "wrap",
    //flexGrow: 1
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




const basinList = [
  "PERMIAN",
  "Permian",
  "FORT WORTH",
  "WESTERN GULF",
];

//chips multiselect doesn't support objects, so you need two lists. one of names and one of objects to setfilters with
const basinListObjects = [
  {
    id: "PERMIAN",
    name: "PERMIAN",
  },
  {
    id: "FORT WORTH",
    name: "FORT WORTH",
  },
  {
    id: "WESTERN GULF",
    name: "WESTERN GULF",
  },
  {
    id: "Permian",
    name: "Permian",
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


export default function FilterFormGeo() {
  const classes = useStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const theme = useTheme();

  const [basinName, setBasinName] = React.useState(
    stateNav.basinName ? stateNav.basinName : []
  );

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

    useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const [basins, setBasins] = React.useState(basinList);


  const setFilterBasin = basinNames => {
    let basinIds = [];
    basinNames.forEach(basinName => {
      basinListObjects.forEach(basinObj => {
        if (basinObj.name == basinName) {
          basinIds.push(basinObj.id);
        }
      });
    });
    let filter;
    if (basinIds.length > 0) {
      filter = ["match", ["get", "basin"], basinIds, true, false];
    } else {
      filter = null;
    }

    console.log("basin change filter", filter);
    setStateNav(stateNav => ({ ...stateNav, filterBasin: filter }));
  };





  useEffect(() => {
    let state;
    let county;
    let survey;
    let abstract;
    let filter;
    if (stateNav.stateName !== null) {
      state = stateNav.stateName;
    }
    if (stateNav.countyName !== null) {
      county = stateNav.countyName;
    }
    if (stateNav.surveyName !== null) {
      survey = stateNav.surveyName;
    }
    if (stateNav.abstractName !== null) {
      abstract = stateNav.abstractName;
    }

    if (state !== undefined) {
      filter = ["all", ["in", "state", state]];
    }
    if (county !== undefined) {
      filter = ["all", ["in", "state", state], ["in", "county", county]];
    }
    if (survey !== undefined) {
      filter = [
        "all",
        ["in", "state", state],
        ["in", "county", county],
        ["in", "survey", survey]
      ];
    }
    if (abstract !== undefined) {
      filter = [
        "all",
        ["in", "state", state],
        ["in", "county", county],
        ["in", "survey", survey],
        ["in", "abstract", abstract]
      ];
    }

    if (filter) {
      console.log("GeoFilter change filter", filter);
      setStateNav(stateNav => ({
        ...stateNav,
        filterGeography: filter
      }));
    } else {
      filter = null;
    }
  }, [
    setStateNav,
    stateNav.abstractName,
    stateNav.countyName,
    stateNav.stateName,
    stateNav.surveyName
  ]);


  const handleChangeBasin = event => {
    console.log(event.target.value);
    setBasinName(event.target.value);
    setStateNav(stateNav => ({ ...stateNav, basinName: event.target.value }));
    setFilterBasin(event.target.value);
  };


  const deleteChipBasinName = value => () => {
    const removeChips = basinName.filter(chip => chip !== value);
    setBasinName(removeChips);
    setFilterBasin(removeChips);
    setStateNav(stateNav => ({ ...stateNav, basinName: removeChips }));
  };







  return (
    <div className={classes.row}>
      <div className={classes.root}>
        <FilterStateName />
        <FilterCountyName />
        <FilterSurvey />
        <FilterAbstract />

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} htmlFor="select-multiple-chip-basin">
            Basin
          </InputLabel>
          <Select
            variant="outlined"
            multiple
            labelWidth={labelWidth}
            value={basinName}
            onChange={handleChangeBasin}
            
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
                    onDelete={deleteChipBasinName(value)}
                    key={value}
                    label={value}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {basins.map(basin => (
              <MenuItem
                key={basin}
                value={basin}
                style={getStyles(basin, basinName, theme)}
              >
                <Checkbox checked={basinName.indexOf(basin) > -1} />
                <ListItemText primary={basin} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>



       
      </div>
    </div>

  );
}






