import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../AppContext";
import { NavigationContext } from "../NavigationContext";
import Paper from '@material-ui/core/Paper';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from '@material-ui/core/List';
import Chip from '@material-ui/core/Chip';
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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
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
    padding: "1px 20px",
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
    padding: 3,
    textAlign: "center",
  },
  chipContainer:{
    height: "100%",
    margin: 10,
  },
  chipRow: {
    display: "inline-flex",
    padding: 2,
  },
  deleteButton: {
    marginLeft: "20%"
  },
  listLabel: {
    padding: "6px 30px",
  }

}));


export default function FilterDedaults() {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [tabsValue, setTabsValue] = useState(0);
  const [filters, setFilters] = useState(null);
  const [savedFilters, setSavedFilters] = useState(null);
  const [checkBoxActive, setCheckBoxActive] = useState(false);
  const [checkBoxDefault, setCheckBoxDefault] = useState(false);
  const [dateCreated, setDateCreated] = useState(new Date());
  const [filterWellType, setFilterWellType] = useState(false);
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
      defaultFilters = defaultFiltersArgs[0].filters.map(el => el)
      filtersDefaultArr.push(defaultFilters)
      m1neralSavedFilters.push(defaultFiltersArgs[0].name)
      setSavedFilters(m1neralSavedFilters)
      setFilterWellType(true)
    }

    if (stateNav) {
      const stateNavActiveProperties = Object.entries(stateNav).filter(
        ([k, v], i) => !!v
      );
      let mapStateNav = stateNavActiveProperties.map(val => val)
      mapStateNav.filter(element => {
        if (element && element[1].length > 1) {
          if (element[0].includes("filter")) {
            saveFilters.push(element);
          }
        }
      })
      filtersStateNav = saveFilters;
      if (filtersStateNav && filtersStateNav.length > 1) {
        setFilters(filtersStateNav)
      }
    }
  }, [stateNav]);

  const filterOnOff = () => {
    setCheckBoxActive(checkBoxActive => !checkBoxActive)
  }

  const selectDefault = () => {
    setCheckBoxDefault(checkBoxDefault => !checkBoxDefault)
  }

  const removeNameFromType = (string) => {  
    if (string.includes("well")) {
      return string.replace("well", " ")
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
                <ListItemText className={classes.listItem} primary={"Saved Search:" + "  " + el} />
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
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <div className={classes.user}>{user} - {dateCreated.toDateString()}</div>
              <Divider />
            </div>
          ) : null} 
        </List>
      </Paper>
      : null}
      {tabsValue === 1 ? 
      <Paper className={classes.paparMain} square>
        <List  aria-label="mailbox folders">
        {filterWellType ? 
            <div>
              <div className={classes.listLabel}>Well</div>
              <ListItem button>
              {filters ? filters.map( el => 
              <Chip
                key={el}
                className={classes.chipContainer}
                label={(
                  <section>
                    <div className={classes.chip}>{removeNameFromType(el[1][1][1])}</div>
                    {el[1].length === 5 && el[1][2].map(val =>
                        <div className={classes.chipRow}>{val}</div> 
                      )
                    }
                    {/* {el[1].length === 2 && el[1][1][1].map(val =>
                        // <div className={classes.chipRow}>{val}</div> 
                      )
                    } */}
                    
                  </section>
                )}
                onClick={console.log(el)}
                onDelete={ e => console.log(e)}
              />
              ) : null} 
              <IconButton className={classes.deleteButton}  aria-label="delete">
                <HighlightOffIcon />
              </IconButton>
              </ListItem>
              <Divider />
            </div>
            : null}
        </List>
      </Paper>
      : null}
    </div>
  );
}
