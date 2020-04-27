import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../AppContext";
import { NavigationContext } from "../NavigationContext";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import DeleteIcon from "@material-ui/icons/Delete";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import FilterDefaultListWell from "./FilterDefaultListWell";
import FilterDefaultListGeo from "./FilterDefaultListGeo";
import FilterDefaultListOwner from "./FilterDefaultListOwner";
import FilterDefaultListProd from "./FilterDefaultListProd";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
 
const prodListOptions = [
  { name : "Cumulative  -  Oil"},
  { name : "Cumulative  -  Gas"},
  { name : "Cumulative  -  Water"},
  { name : "First Month  -  Oil"},
  { name : "First Month  -  Gas" },
  { name : "First Month  -  Water"},
  { name : "First Three Months  -  Oil"},
  { name : "First Three Months  -  Gas"},
  { name : "First Three Months  -  Water"},
  { name : "First Six Months  -  Oil"},
  { name : "First Six Months  -  Gas"},
  { name : "First Six Months  -  Water"},
  { name : "First Twelve Months  -  Oil"},
  { name : "First Twelve Months  -  Gas"},
  { name : "First Twelve Months  -  Water"},
  { name : "Last Month  -  Oil"},
  { name : "Last Month  -  Gas"},
  { name : "Last Month  -  Water"},
  { name : "Last Six Months  -  Oil"},
  { name : "Last Six Months  -  Gas"},
  { name : "Last Six Months  -  Water"},
  { name : "Last Twelve Months  -  Oil"},
  { name : "Last Twelve Months  -  Gas"},
  { name : "Last Twelve Months  -  Water"}
];

const useStyles = makeStyles((theme) => ({
  save: {
    display: "flex",
    maxWidth: "160px",
    padding: "6px 12px",
    marginLeft: "18vw",
    color: "rgba(0, 0, 0, 0.54)",
    boxShadow: "none",
    backgroundColor: "inherit",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  input: {
    flex: "1 1 auto",
    paddingRight: 30,
  },
  iconButton: {
    padding: 10,
  },
  user: {
    fontSize: 12,
    color: "rgba(23, 170, 221, 1)",
  },
  rootDiv: {
    padding: "2px 6px",
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },
  paparMain: {
    boxShadow: "none",
    padding: "2px 6px",
  },
  listItemLabel: {
    justifyContent: "flex-end",
    flex: 1,
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.54)",
  },
  listItem: {
    margin: 4,
    flex: "1 1 auto",
    justifyContent: "space-between",
    minWidth: 278,
  },
  checkBox: {
    flex: "1 1 auto",
    justifyContent: "end",
    paddingRight: 18,
    "&:hover": {
      backgroundColor: "transparent !important",
    },
  },
  chip: {
    padding: "3px 20px",
    fontSize: 12,
  },
  chipContainer: {
    height: "100%",
    margin: "6px 6px",
  },
  chipRow: {
    display: "inline-flex",
    padding: "3px 0px",
  },
  deleteButton: {
    marginLeft: "0%",
  },
  listLabel: {
    padding: "6px 30px",
    display: "inline-flex",
    marginRight: "70%",
  },
  listItemContainer: {
    display: "inherit",
    "&:hover": {
      color: "transparent",
    },
  },
}));

const ButtonInTabs = ({ className, onClick, children }) => {
  return <Button className={className} onClick={onClick} children={children} aria-label="save"
  variant="contained"
  disableElevation={true}
  startIcon={<BookmarkBorderIcon />} />;
};

export default function FilterDedaults() {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [tabsValue, setTabsValue] = useState(1);
  const [stateNavCopy, setStateNavCopy] = useState(null);
  const [filtersProd, setFiltersProd] = useState(null);
  const [filtersGeo, setFiltersGeo] = useState(null);
  const [filtersOwner, setFiltersOwner] = useState(null);
  const [filtersWell, setFiltersWell] = useState(null);
  const [savedFilters, setSavedFilters] = useState(null);
  const [checkBoxActive, setCheckBoxActive] = useState(false);
  const [checkBoxDefault, setCheckBoxDefault] = useState(false);
  const [dateCreated, setDateCreated] = useState(new Date());
  const [filterTypeWell, setFilterTypeWell] = useState(null);
  const [filterTypeOwner, setFilterTypeOwner] = useState(null);
  const [filterTypeProdcution, setFilterTypeProduction] = useState(null);
  const [filterTypeGeography, setFilterTypeGeography] = useState(null);
  const [saveSearchName, setSaveSearchName] = useState("");
  const [user, setUser] = useState("");
  const classes = useStyles();

  useEffect(() => {
    let name;
    if (stateApp) {
      name = stateApp.user.name;
      setUser(name);
    }
  }, [stateApp]);

  const handleChange = (event, newValue) => {
    setTabsValue(newValue);
  };

  useEffect(() => {
    let saveFilters = [];
    let filtersStateNav;
    let defaultFiltersArgs;
    let defaultFilters;
    let filtersDefaultArr = [];
    let m1neralSavedFilters = [];

    if (stateNav.m1neralDefaultFilters) {
      defaultFiltersArgs = stateNav.m1neralDefaultFilters.map((elm) => elm);
      setCheckBoxDefault(defaultFiltersArgs[0].default);
      setCheckBoxActive(defaultFiltersArgs[0].on);
      if (defaultFiltersArgs[0].filters) {
        defaultFilters = defaultFiltersArgs[0].filters.map((el) => el);
        filtersDefaultArr.push(defaultFilters);
        m1neralSavedFilters.push(defaultFiltersArgs[0].name);
        setSavedFilters(m1neralSavedFilters);
      }
    }

    if (stateNav) {
      let stateNavActiveProperties = Object.entries(stateNav).filter(
        ([k, v], i) => !!v && v.length > 0
      );
      setStateNavCopy([...stateNavActiveProperties]);
      let mapStateNav = stateNavActiveProperties.map((val) => val);
      mapStateNav.filter((element) =>
        element && element[1].length > 1
          ? element[0].includes("filter")
            ? saveFilters.push(element)
            : null
          : null
      );

      filtersStateNav = [...saveFilters];
      let wellArr = [];
      let geoArr = [];
      let geoArr1 = [];
      let ownerArr = [];
      let interestArr = [];
      let prodArr = [];
      if (filtersStateNav && filtersStateNav.length > 0) {
        filtersStateNav.map((item) => {
          if (item[0].includes("Operator")) {
            setFilterTypeWell("Well");
            wellArr.push(item);
          }
          if (item[0].includes("Well")) {
            setFilterTypeWell("Well");
            wellArr.push(item);
          }
          if (item[0].includes("Date")) {
            setFilterTypeWell("Well");
            wellArr.push(item);
          }
          if (item[0].includes("Owner")) {
            setFilterTypeOwner("Owner");
            ownerArr.push(item);
          }
          if (item[0].includes("Interest")) {
            setFilterTypeOwner("Owner");
            interestArr.push(item);
          }
          if (item[0].includes("Geography")) {
            setFilterTypeGeography("Geography");
            geoArr.push(item);
          }
          if (item[0].includes("Basin")) {
            setFilterTypeGeography("Geography");
            geoArr1.push(item);
          }
          if (item[0].includes("Play")) {
            setFilterTypeGeography("Geography");
            geoArr1.push(item);
          }
          if (item[0].includes("Gas")) {
            setFilterTypeProduction("Production");
            prodArr.push(item);
          }
          if (item[0].includes("Oil")) {
            setFilterTypeProduction("Production");
            prodArr.push(item);
          }
          if (item[0].includes("Water")) {
            setFilterTypeProduction("Production");
            prodArr.push(item);
          }
        });
      }
      if (geoArr1.length > 0) {
        setFiltersGeo([geoArr, geoArr1]);
      } else if (geoArr.length > 0) {
        setFiltersGeo([geoArr, geoArr1]);
      }
      else {
        setFiltersGeo(null);
      }

      if (ownerArr.length > 0) {
        setFiltersOwner([ownerArr, interestArr]);
      } else if (interestArr.length > 0) {
        setFiltersOwner([ownerArr, interestArr]);
      }
      else {
        setFiltersOwner(null);
      }
      setFiltersProd(prodArr);
      setFiltersWell(wellArr);
    }
  }, [stateNav]);
 
  const deleteChipWell = (item, name) => {
    if (stateNav[name] && stateNav[name].length === 5) {
      let copy;
      let type;
      copy = [...stateNav[name]];
      let removeItem = copy[2].filter((e) => e !== item);
      if (copy[2].length > 0) {
        copy[2] = [...removeItem];
        if (name === "filterWellType") {
          type = "typeName";
        }
        if (name === "filterWellStatus") {
          type = "statusName";
        }
        if (name === "filterOperator") {
          type = "operatorName";
        }
        if (name === "filterWellProfile") {
          type = "profileName";
        }
      }
      if (removeItem.length === 0) {
        setStateNav((stateNav) => ({
          ...stateNav,
          [name]: null,
          [type]: [],
        }));
      } else {
        setStateNav((stateNav) => ({
          ...stateNav,
          [name]: copy,
          [type]: removeItem,
        }));
      }
    }

    if (stateNav[name] && stateNav[name].length === 3) {
      let typeFrom;
      let typeTo;

      if (name === "filterPermitDateRange") {
        typeFrom = "permitDateFrom";
        typeTo = "permitDateTo";
      }

      if (name === "filterSpudDateRange") {
        typeFrom = "spudDateFrom";
        typeTo = "spudDateTo";
      }
      if (name === "filterCompletetionDateRange") {
        typeFrom = "completetionDateFrom";
        typeTo = "completetionDateTo";
      }
      if (name === "filterFirstProdDateRange") {
        typeFrom = "firstProdDateFrom";
        typeTo = "firstProdDateTo";
      }

      setStateNav((stateNav) => ({
        ...stateNav,
        [name]: null,
        [typeFrom]: null,
        [typeTo]: null,
      }));
    }
  };
  // State County Survey Abstract 
  const deleteChipGeoSCSA = (item, name) => {
    let copy;
   
    copy = [...stateNav[name]];
    if (copy && copy[1] && copy[1].length === 5 ) {        
      
      for (let index = 0; index < copy.length; index++) {
        const element = copy[index];
        if (element[1][1] === "state") {
          if (element[2] === item) {
            copy.splice(0, copy.length);
            setStateNav((stateNav) => ({
              ...stateNav,
              [name]: null,
              stateName: null,
              displayStateName: null,
            }));
          }
        }
      }
      
    }
    if (copy && copy[2] && copy[2].length === 5) {      
      
      for (let index = 0; index < copy.length; index++) {
        const element = copy[index];
        if (element[1][1] === "county") {
          if (element[2] === item) {
            copy.splice(index, copy.length);
            setStateNav((stateNav) => ({
              ...stateNav,
              [name]: copy,
              countyName: null,
              surveyName: null,
              abstractName: null,
            }));
          }
        }
      }
    }

    if (copy && copy[3] && copy[3].length === 5) {      
      
      for (let index = 0; index < copy.length; index++) {
        const element = copy[index];
        if (element[1][1] === "survey") {
          if (element[2] === item) {
            copy.splice(index, copy.length);
            setStateNav((stateNav) => ({
              ...stateNav,
              [name]: copy,
              surveyName: null,
              abstractName: null,
            }));
          }
        }
      }
    }

    if (copy && copy[4] && copy[4].length === 5) {      
      
      for (let index = 0; index < copy.length; index++) {
        const element = copy[index];
        if (element[1][1] === "abstract") {
          if (element[2] === item) {
            copy.splice(index, copy.length);
            setStateNav((stateNav) => ({
              ...stateNav,
              [name]: copy,
              abstractName: null,
            }));
          }
        }
      }
    }
  }

  // Basin And PLay 
  const deleteChipGeo = (item, name) => {
    if (stateNav[name] && stateNav[name].length === 5) {
      let copy;
      let type;
      copy = [...stateNav[name]];
      let removeItem = copy[2].filter((e) => e !== item);
      if (copy[2].length > 0) {
        copy[2] = [...removeItem];
        if (name === "filterBasin") {
          type = "basinName";
        }
        if (name === "filterPlay") {
          type = "playName";
        }
      }
      if (removeItem.length === 0) {
        setStateNav((stateNav) => ({
          ...stateNav,
          [name]: null,
          [type]: [],
        }));
      } else {
        setStateNav((stateNav) => ({
          ...stateNav,
          [name]: copy,
          [type]: removeItem,
        }));
      }
    }
  };

  const deleteChipOwner = (item) => {

    if (stateNav.filterNoOwnerCount && stateNav.filterNoOwnerCount.length > 0) {
        if (item === "noOwners") {
          setStateNav((stateNav) => ({
            ...stateNav,
            filterNoOwnerCount: null,
          }));
        }
    }
    if(stateNav.filterOwnerCount && stateNav.filterOwnerCount.length > 0){
      let copy;
      copy = [...stateNav.filterOwnerCount];

      for (let index = 0; index < copy.length; index++) {
        const element = copy[index];
        if (element[0] === item) {
          copy.splice(index, 1);
        }
      }
      setStateNav((stateNav) => ({
        ...stateNav,
        filterOwnerCount: copy,
      }));

      if (copy.length === 1) {
        setStateNav((stateNav) => ({
          ...stateNav,
          filterOwnerCount: null,
        }));
      }
    }
    if (stateNav.filterAllOwnershipTypes && stateNav.filterAllOwnershipTypes.length > 0 ) {
      let copy;
      let itemRemove = stateNav.interestName;
      let i = itemRemove.indexOf(item);
      if (item === "ownershipTypeReligiousInstitutions") {
        itemRemove.splice(i, 1);
      }
      if (item === "ownershipTypeGovernmentalBodies") {
        itemRemove.splice(i, 1);
      }
      if (item === "ownershipTypeNonProfits") {
        itemRemove.splice(i, 1);
      }
      if (item === "ownershipTypeTrusts") {
        itemRemove.splice(i, 1);
      }
      if (item === "ownershipTypeCorporations") {
        itemRemove.splice(i, 1);
      }
      if (item === "ownershipTypeEducationalInstitutions") {
        itemRemove.splice(i, 1);
      }
      if (item === "ownershipTypeIndividuals") {
        itemRemove.splice(i, 1);
      }
      if (item === "ownershipTypeUnknown") {
        itemRemove.splice(i, 1);
      }
    
      copy = [...stateNav.filterAllOwnershipTypes];

      for (let index = 0; index < copy.length; index++) {
        const element = copy[index];
        if (element.includes(item)) {
          copy.splice(index, 1);
        }
      }

      if (copy.length > 1) {
        setStateNav((stateNav) => ({
          ...stateNav,
          filterAllOwnershipTypes: copy,
          ownerTypeName: itemRemove,
        }));
      } else {
        setStateNav((stateNav) => ({
          ...stateNav,
          filterAllOwnershipTypes: null,
          ownerTypeName: [],
        }));
      }
    }
  };
 
  const matchProdOption = (string) => {
    let list = prodListOptions;
    let match = list.map(el => el.name)
    if (match.includes(string) ) {
      return string;
    }
  }
 
  const removeFitlerFromProdName = (string) => {
    if (string.includes("filterCumulative")) {
      return string.replace("filterCumulative", "Cumulative  -  ");
    }
    if (string.includes("filterFirstMonth")) {
      return string.replace("filterFirstMonth", "First Month  -  ");
    }
    if (string.includes("filterFirstThreeMonth")) {
      return string.replace("filterFirstThreeMonth", "First Three Months  -  ");
    }
    if (string.includes("filterFirstSixMonth")) {
      return string.replace("filterFirstSixMonth", "First Six Months  -  ");
    }
    if (string.includes("filterFirstTwelveMonth")) {
      return string.replace("filterFirstTwelveMonth", "First Twelve Months  -  ");
    }
    
    if (string.includes("filterLastTwelveMonth")) {
      return string.replace("filterLastTwelveMonth", "Last Twelve Months  -  ");
    }
    if (string.includes("filterLastSixMonth")) {
      return string.replace("filterLastSixMonth", "Last Six Months  -  ");
    }
    if (string.includes("filterLastMonth")) {
      return string.replace("filterLastMonth", "Last Month  -  ");
    }
  }
  

  const deleteChipProd = (item,name, filter) => {
    if(stateNav[name] && stateNav[name].length > 0){
      let copy;
      copy = [...stateNav[name]];

      for (let index = 0; index < copy.length; index++) {
        const element = copy[index];
        if (element[2] === item) {
          copy.splice(index, 1);
        }
      }

      if (filter && filter[1], filter[1].length === 2) {
        let compare = removeFitlerFromProdName(name);
        let match = matchProdOption(compare);
        let findItem = stateNav.prodOptions;
        for (let index = 0; index < findItem.length; index++) {
          const element = findItem[index];
          if (element === match) {
            findItem.splice(index, 1);
          }
        }
      }
      setStateNav((stateNav) => ({
        ...stateNav,
        [name]: copy,
      }));

      if (copy.length === 1) {
        setStateNav((stateNav) => ({
          ...stateNav,
          [name]: null,
        }));
      }
    }
  };

  const deleteChipInterest = (item) => {
    if (stateNav.filterAllInterestTypes) {
      let copy;
      let itemRemove = stateNav.interestName;
      let i = itemRemove.indexOf(item);
      if (item === "interestTypeRoyaltyInterest") {
        itemRemove.splice(i, 1);
      }
      if (item === "interestTypeOverrideRoyalty") {
        itemRemove.splice(i, 1);
      }
      if (item === "interestTypeWorkingInterest") {
        itemRemove.splice(i, 1);
      }
      if (item === "interestTypeProductionPayment") {
        itemRemove.splice(i, 1);
      }

      copy = [...stateNav.filterAllInterestTypes];
      for (let index = 0; index < copy.length; index++) {
        const element = copy[index];
        if (element.includes(item)) {
          copy.splice(index, 1);
        }
      }

      if (copy.length > 1) {
        setStateNav((stateNav) => ({
          ...stateNav,
          filterAllInterestTypes: copy,
          interestName: itemRemove,
        }));
      } else {
        setStateNav((stateNav) => ({
          ...stateNav,
          filterAllInterestTypes: null,
          interestName: [],
        }));
      }
    }
  };
  
  const removeAllWell = () => {
    if (filtersWell && filterTypeWell) {
      setStateNav((stateNav) => ({
        ...stateNav,
        filterCompletetionDateRange: null,
        filterFirstProdDateRange: null,
        filterPermitDateRange: null,
        firstProdDateFrom: null,
        firstProdDateTo: null,
        filterSpudDateRange: null,
        filterWellProfile: null,
        filterWellStatus: null,
        filterWellType: null,
        filterOperator: null,
        completetionDateFrom: null,
        completetionDateTo: null,
        dateTypeName : [],
        operatorName: null,
        profileName: null,
        spudDateFrom: null,
        spudDateTo: null,
        statusName: [],
        typeName: [],
      }))
    }
  }

  const removeAllGeo = () => {
    if (filtersGeo && filterTypeGeography) {
      setStateNav((stateNav) => ({
        ...stateNav,
        basinName:[],
        playName: [],
        countyName: null,
        stateName: null,
        displayStateName: null,
        surveyName: null, 
        abstractName: null,
        filterGeography: null,
        filterBasin: null,
        filterPlay: null,
      }))
    }
  }

  const removeAllProd = () => {
    if (filtersProd && filterTypeProdcution) {
        setStateNav((stateNav) => ({
          ...stateNav,
          prodOptions: [],
          filterCumulativeOil:null,
          filterCumulativeGas:null,
          filterCumulativeWater:null,
          filterFirstMonthWater:null,
          filterFirstThreeMonthWater:null,
          filterFirstSixMonthWater:null,
          filterFirstTwelveMonthWater:null,
          filterLastMonthWater:null,
          filterLastSixMonthWater:null,
          filterLastTwelveMonthWater:null,
          filterFirstMonthGas:null,
          filterFirstThreeMonthGas:null,
          filterFirstSixMonthGas:null,
          filterFirstTwelveMonthGas:null,
          filterLastMonthGas:null,
          filterLastSixMonthGas:null,
          filterLastTwelveMonthGas:null,
          filterFirstMonthOil:null,
          filterFirstSixMonthOil:null,
          filterFirstTwelveMonthOil:null,
          filterLastMonthOil:null,
          filterLastSixMonthOil:null,
          filterLastTwelveMonthOil:null,
        }))
    }
  }

  const removeAllOwner = () => {
    if (filtersOwner && filterTypeOwner) {
      setStateNav((stateNav) => ({
        ...stateNav,
        interestName: [],
        ownerTypeName: [],
        ownerCountWell: [],
        filterOwnerType:null,
        filterOwnerCount: null,
        filterNoOwnerCount: null,
        filterAllInterestTypes: null,
        filterAllOwnershipTypes:null,
        filterHasOwners: null,
      }))
      
    }
  }

  const filterOnOff = () => {
    setCheckBoxActive((checkBoxActive) => !checkBoxActive);
  };

  const selectDefault = () => {
    setCheckBoxDefault((checkBoxDefault) => !checkBoxDefault);
  };

  const deleteFilter = () => {
    if (savedFilters[0] === "M1neral Default Filters") {
      const m1neralDefaults = [
        {
          name: "M1neral Default Filters",
          filters: null,
          on: false,
          default: false,
        },
      ];
      setStateNav((stateNav) => ({
        ...stateNav,
        m1neralDefaultFilters: m1neralDefaults,
      }));
    }
  };

  return (
    <div>
      <Paper square>
        <Tabs
          value={tabsValue}
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab value={0} label="Saved Search" />
          <Tab value={1} label="Current Search" />
          <ButtonInTabs

            className={classes.save}
            
            // {...buttonProps}
          >
            Save
          </ButtonInTabs>
        </Tabs>
      </Paper>
      {tabsValue === 0 ? (
        <Paper className={classes.paparMain} square>
          <div component="form" className={classes.rootDiv}>
            <TextField
              className={classes.input}
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <ListItem className={classes.listItemLabel}>Default</ListItem>
            <ListItem className={classes.listItemLabel}>Active</ListItem>
            <ListItem className={classes.listItemLabel}>Delete</ListItem>
          </div>
          <List aria-label="mailbox folders">
            {savedFilters
              ? savedFilters.map((el) => (
                  <div key={el}>
                    <ListItem button>
                      <ListItemText
                        className={classes.listItem}
                        primary={
                          <section>
                            <div>{"Saved Search:" + "  " + el}</div>
                            <div className={classes.user}>
                              {user} - {dateCreated.toDateString()}
                            </div>
                          </section>
                        }
                      />
                      <Checkbox
                        className={classes.checkBox}
                        checked={checkBoxDefault}
                        onChange={selectDefault}
                        color="primary"
                        disableRipple={true}
                        inputProps={{ "aria-label": "Default checkbox" }}
                      />
                      <Checkbox
                        className={classes.checkBox}
                        checked={checkBoxActive}
                        color="primary"
                        disableRipple={true}
                        onChange={filterOnOff}
                        inputProps={{ "aria-label": "Active checkbox" }}
                      />
                      <IconButton onClick={deleteFilter} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                    <Divider />
                  </div>
                ))
              : null}
          </List>
        </Paper>
      ) : null}
      {tabsValue === 1 ? (
        <div>
          <div>
            {filtersWell && filterTypeWell ? (
              <FilterDefaultListWell
                deleteChip={deleteChipWell}
                type={filterTypeWell}
                filters={filtersWell}
                removeAll={removeAllWell}
              />
            ) : null}
          </div>
          <div>
            {filtersGeo && filterTypeGeography ? (
              <FilterDefaultListGeo
                deleteChip={deleteChipGeo}
                deleteChipGeoSCSA={deleteChipGeoSCSA}
                type={filterTypeGeography}
                filters={filtersGeo}
                removeAll={removeAllGeo}
              />
            ) : null}
          </div>
          <div>
            {filtersOwner && filterTypeOwner ? (
              <FilterDefaultListOwner
                deleteChip={deleteChipOwner}
                type={filterTypeOwner}
                filters={filtersOwner}
                deleteChipInterest={deleteChipInterest}
                removeAll={removeAllOwner}
              />
            ) : null}
          </div>
          <div>
            {filterTypeProdcution && filterTypeProdcution ? (
              <FilterDefaultListProd
                deleteChip={deleteChipProd}
                type={filterTypeProdcution}
                filters={filtersProd}
                removeAll={removeAllProd}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
