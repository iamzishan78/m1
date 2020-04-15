import React, { useContext, useEffect, useState } from "react";
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
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';



const useStyles = makeStyles(theme => ({
  save: {
    display: "flex",
    maxWidth: "160px",
    padding: "6px 12px",
    marginLeft:" 22vw",
    color: "rgba(0, 0, 0, 0.54)",
    boxShadow: "none",
    backgroundColor: "inherit",
    "&:hover" : {
      backgroundColor: "white"
    },
  },
  input: {
    flex: "1 1 auto",
  },
  iconButton: {
    padding: 10,
  },
  rootDiv: {
    padding: '2px 6px',
    display: 'flex',
    alignItems: 'center',
    marginTop: 18,
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
      backgroundColor: "transparent"
    },
    ".mat-ripple-element" : {
      display: "none",
    },
  }, 

}));


export default function FilterDedaults() {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [tabsValue, setTabsValue] = useState(0);
  const [filters, setFilters] = useState(null);
  const [checkBoxActive, setCheckBoxActive] = useState(false);
  const [checkBoxDefault, setCheckBoxDefault] = useState(false);
  const classes = useStyles();


  const handleChange = (event, newValue) => {
    setTabsValue(newValue);
  };

  useEffect(() => {
    let saveFilters = [];
    let filtersStateNav;
    
    if (stateNav.m1neralDefaultFilters && stateNav.m1neralDefaultFilters.length > 1) {
        console.log(stateNav.m1neralDefaultFilters)
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

  return (
    <div>
      <Paper square>
        <Tabs
          value={tabsValue}
          indicatorColor="primary"
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
          {filters ? filters.map( el => 
            <div>
              <ListItem button>
                <ListItemText className={classes.listItem} primary={el[1][1][1]} />
                <Checkbox
                  className={classes.checkBox}
                  value={checkBoxDefault}
                  color="primary"
                  disableRipple={true}
                  inputProps={{ 'aria-label': 'default checkbox' }}
                />
                <Checkbox
                  className={classes.checkBox}
                  value={checkBoxActive}
                  color="primary"
                  inputProps={{ 'aria-label': 'active checkbox' }}
                />
                <IconButton aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </div>
          ) : null} 
        </List>
      </Paper>
      : null}
    </div>
  );
}
