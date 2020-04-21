import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../AppContext";
import { NavigationContext } from "../NavigationContext";
import Paper from '@material-ui/core/Paper';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import FilterDefaultListWell from "./FilterDefaultListWell";
import FilterDefaultListGeo from "./FilterDefaultListGeo";
import FilterDefaultListInterest from "./FilterDefaultListInterest";
import FilterDefaultListOwner from "./FilterDefaultListOwner";
import FilterDefaultListProd from "./FilterDefaultListProd"
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';



const useStyles = makeStyles(theme => ({
  save: {
    display: "flex",
    maxWidth: "160px",
    padding: "6px 12px",
    marginLeft:"18vw",
    color: "rgba(0, 0, 0, 0.54)",
    boxShadow: "none",
    backgroundColor: "inherit",
    "&:hover" : {
      backgroundColor: "white"
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
    padding: '2px 6px',
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  paparMain: {
    boxShadow: "none",
    padding: '2px 6px',
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
    "&:hover" : {
      backgroundColor: "transparent !important"
    },
  }, 
  chip: {
    padding: "3px 20px",
    fontSize: 12,
  },
  chipContainer:{
    height: "100%",
    margin: "6px 6px",
  },
  chipRow: {
    display: "inline-flex",
    padding: "3px 0px",
  },
  deleteButton: {
    marginLeft: "0%"
  },
  listLabel: {
    padding: "6px 30px",
    display: "inline-flex",
    marginRight: "70%",
  },
  listItemContainer: {
    display: "inherit",
    "&:hover" : {
      color: "transparent",
    }
  }

}));


export default function FilterDedaults() {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [tabsValue, setTabsValue] = useState(1);
  const [filtersProd, setFiltersProd] = useState(null);
  const [filtersGeo, setFiltersGeo] = useState(null);
  const [filtersOwner, setFiltersOwner] = useState(null);
  const [filtersInterest, setFiltersInterest] = useState(null);
  const [filtersWell, setFiltersWell] = useState(null);
  const [savedFilters, setSavedFilters] = useState(null);
  const [checkBoxActive, setCheckBoxActive] = useState(false);
  const [checkBoxDefault, setCheckBoxDefault] = useState(false);
  const [dateCreated, setDateCreated] = useState(new Date());
  const [filterTypeWell, setFilterTypeWell] = useState(null);
  const [filterTypeOwner, setFilterTypeOwner] = useState(null);
  const [filterTypeInterest, setFilterTypeInterest] = useState(null);
  const [filterTypeProdcution, setFilterTypeProduction] = useState(null);
  const [filterTypeGeography, setFilterTypeGeography] = useState(null);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [user, setUser] = useState('');
  const classes = useStyles();


  useEffect(() => {
    let name;
    if (stateApp) {
      name = stateApp.user.name
      setUser(name)
    }
  },[stateApp])

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
      defaultFiltersArgs = stateNav.m1neralDefaultFilters.map(elm => elm);
      setCheckBoxDefault(defaultFiltersArgs[0].default)
      setCheckBoxActive(defaultFiltersArgs[0].on)
      if (defaultFiltersArgs[0].filters) {
        defaultFilters = defaultFiltersArgs[0].filters.map(el => el)
        filtersDefaultArr.push(defaultFilters)
        m1neralSavedFilters.push(defaultFiltersArgs[0].name)
        setSavedFilters(m1neralSavedFilters)
      }
    }

    if (stateNav) {
      const stateNavActiveProperties = Object.entries(stateNav).filter(
        ([k, v], i) => !!v
      );
      let mapStateNav = stateNavActiveProperties.map(val => val)
      mapStateNav.filter(element => {
        if (element && element[1].length > 1) {
          if (element[0].includes("filter")) {
            return saveFilters.push(element);
          }
        }
      })
      filtersStateNav = saveFilters;
      if (filtersStateNav && filtersStateNav.length > 0) {
        const getFilterType = () => {
          let wellArr = [];
          let geoArr = [];
          let geoArr1 = [];
          let ownerArr = [];
          let interestArr = [];
          let prodArr = [];
          filtersStateNav.map(item => { 
            if (item[0].includes("Operator")) {
              setFilterTypeWell("Well")
              wellArr.push(item)
            }
            if (item[0].includes("Well")) {
              setFilterTypeWell("Well")
              wellArr.push(item)
            }
            if (item[0].includes("Date")) {
              setFilterTypeWell("Well")
              wellArr.push(item)
            }
            if (item[0].includes("Owner")) {
              setFilterTypeOwner("Owner")
              ownerArr.push(item)
            }
            if (item[0].includes("Interest")) {
              setFilterTypeInterest("Interest")
              interestArr.push(item)
            }
            if (item[0].includes("Geography")) {
              setFilterTypeGeography("Geography")
              geoArr.push(item)
            }
            if (item[0].includes("Basin")) {
              setFilterTypeGeography("Geography")
              geoArr1.push(item)
            }
            if (item[0].includes("Play")) {
              setFilterTypeGeography("Geography")
              geoArr1.push(item)
            }
            if (item[0].includes("Gas")) {
              setFilterTypeProduction("Production")
              prodArr.push(item)
            }
            if (item[0].includes("Oil")) {
              setFilterTypeProduction("Production")
              prodArr.push(item)
            }
            if (item[0].includes("Water")) {
              setFilterTypeProduction("Production")
              prodArr.push(item)
            }
          })
          setFiltersGeo([geoArr, geoArr1]);
          setFiltersInterest(interestArr);
          setFiltersOwner(ownerArr);
          setFiltersProd(prodArr);
          setFiltersWell(wellArr);
        }
        getFilterType()
      }
    }
  }, [stateNav]);

  const filterOnOff = () => {
    setCheckBoxActive(checkBoxActive => !checkBoxActive)
  }

  const selectDefault = () => {
    setCheckBoxDefault(checkBoxDefault => !checkBoxDefault)
  }

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
      setStateNav(stateNav => ({ ...stateNav, m1neralDefaultFilters: m1neralDefaults }));
    }
  }

  return (
    <div>
      <Paper square>
        <Tabs
          value={tabsValue}
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab value={0} label="Saved Search" />
          <Tab value={1} label="Current Search"/>
          <Button 
            className={classes.save}
            aria-label="save"
            variant="contained"
            disableElevation={true}
            value={2}
            startIcon={<BookmarkBorderIcon/>}
          >
            Save
          </Button>
        </Tabs>
      </Paper>
      {tabsValue === 0 ? 
      <Paper className={classes.paparMain} square>
      <div component="form" className={classes.rootDiv}>
        <TextField
          className={classes.input}
          placeholder="Search"
          inputProps={{ 'aria-label': 'search' }}
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
        <List  aria-label="mailbox folders">
          {savedFilters ? savedFilters.map( el => 
            <div key={el}>
              <ListItem button>
                <ListItemText className={classes.listItem} primary={(
                  <section>
                    <div>{"Saved Search:" + "  " + el}</div>
                    <div className={classes.user}>{user} - {dateCreated.toDateString()}</div>
                  </section>
                )} 
                />
                <Checkbox
                  className={classes.checkBox}
                  checked={checkBoxDefault}
                  onChange={selectDefault}
                  color="primary"
                  disableRipple={true}
                  inputProps={{ 'aria-label': 'Default checkbox' }}
                />
                <Checkbox
                  className={classes.checkBox}
                  checked={checkBoxActive}
                  color="primary"
                  disableRipple={true}
                  onChange={filterOnOff}
                  inputProps={{ 'aria-label': 'Active checkbox' }}
                />
                <IconButton onClick={deleteFilter} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </div>
          ) : null} 
        </List>
      </Paper>
      : null}
      {tabsValue === 1 ?
        <div> 
          <div> 
            {filterTypeWell ?      
              <FilterDefaultListWell type={filterTypeWell} filters={filtersWell} />
            : null}
          </div>
          <div>
            {filterTypeGeography?
              <FilterDefaultListGeo type={filterTypeGeography} filters={filtersGeo} />  
            : null}
          </div>
          <div>
            {filterTypeInterest ?
              <FilterDefaultListInterest type={filterTypeInterest} filters={filtersInterest} />
            : null}
          </div>
          <div>
            {filterTypeOwner ?
              <FilterDefaultListOwner type={filterTypeOwner} filters={filtersOwner} />
            : null}
          </div>
          <div>
            {filterTypeProdcution ?
              <FilterDefaultListProd type={filterTypeProdcution} filters={filtersProd} />
            : null } 
          </div>
        </div>
      : null}
    </div>
  );
}
