import React, {useEffect, useState,} from "react";
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Chip from '@material-ui/core/Chip';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';



const useStyles = makeStyles(theme => ({
  paparMain: {
    boxShadow: "none",
    padding: '2px 6px',
  },
  listItem: {
    margin: 4, 
    flex: "1 1 auto",
    justifyContent: "space-between",
    minWidth: 278,
  },
  chip: {
    textAlign: "center",
  },
  chipContainer:{
    height: "100%",
    margin: "6px 6px",
  },
  chipRow: {
    padding: "1px 0px",
    textAlign: "center",
  },
  deleteButton: {
    float: "right",
  },
  listLabel: {
    padding: "6px 30px",
    display: "inline-flex",
  },
  listItemContainer: {
    display: "inherit",
    "&:hover" : {
      color: "transparent",
    }
  }

}));


export default function FilterDefaultListProd(props) {
  const [filtersTypeArr, setFiltersTypeArr] = useState(null);
  const [filterNameType, setFilterNameType] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    if (props) {
        setFilterNameType(props.type)
        setFiltersTypeArr(props.filters)   
    }
  },[props])
  
  const removeNameFromType = (string) => { 
    console.log(string)
  if (string.includes("cumulativeWater")) {
    return string.replace("cumulativeWater", "Cum H2O -")
  }
  if (string.includes("cumulativeOil")) {
      return string.replace("cumulativeOil", "Cum Oil -")
  }
  if (string.includes("cumulativeGas")) {
      return string.replace("cumulativeGas", "Cum Gas -")
  }
  if (string.includes("firstThreeMonthGas")) {
      return string.replace("firstThreeMonthGas", "First 3Mo Gas -")
  }
  if (string.includes("firstThreeMonthOil")) {
      return string.replace("firstThreeMonthOil", "First 3Mo Oil -")
  }
  if (string.includes("firstThreeMonthWater")) {
      return string.replace("firstThreeMonthWater", "First 3Mo H2O -")
  }
  if (string.includes("firstMonthOil")) {
      return string.replace("firstMonthOil", "First Month Oil -")
  }
  if (string.includes("firstMonthGas")) {
      return string.replace("firstMonthGas", "First Month Gas -")
  }
  if (string.includes("firstMonthWater")) {
      return string.replace("firstMonthWater", "First Month H2O -")
  }
  if (string.includes("firstSixMonthOil")) {
      return string.replace("firstSixMonthOil", "First 6Mo Oil -")
  }
  if (string.includes("firstSixMonthGas")) {
      return string.replace("firstSixMonthGas", "First 6Mo Gas -")
  }
  if (string.includes("firstSixMonthWater")) {
      return string.replace("firstSixMonthWater", "First 6Mo H2O -")
  }
  if (string.includes("firstTwelveMonthOil")) {
      return string.replace("firstTwelveMonthOil", "First 12Mo Oil -")
  }
  if (string.includes("firstTwelveMonthGas")) {
      return string.replace("firstTwelveMonthGas", "First 12Mo Gas -")
  }
  if (string.includes("firstTwelveMonthWater")) {
      return string.replace("firstTwelveMonthWater", "First 12Mo H2O -")
  }
  if (string.includes("lastMonthOil")) {
      return string.replace("lastMonthOil", "Last Month Oil -")
  }
  if (string.includes("lastMonthGas")) {
      return string.replace("lastMonthGas", "Last Month Gas -")
  }
  if (string.includes("lastMonthWater")) {
      return string.replace("lastMonthWater", "Last Month H2O -")
  }
  if (string.includes("lastSixMonthOil")) {
      return string.replace("lastSixMonthOil", "Last 6Mo Oil -")
  }
  if (string.includes("lastSixMonthGas")) {
      return string.replace("lastSixMonthGas", "Last 6Mo Gas -")
  }
  if (string.includes("lastSixMonthWater")) {
      return string.replace("lastSixMonthWater", "Last 6Mo H2O -")
  }
  if (string.includes("lastTwelveMonthOil")) {
      return string.replace("lastTwelveMonthOil", "Last 12Mo Oil -")
  }
  if (string.includes("lastTwelveMonthGas")) {
      return string.replace("lastTwelveMonthGas", "Last 12Mo Gas -")
  }
  if (string.includes("lastTwelveMonthWater")) {
      return string.replace("lastTwelveMonthWater", "Last 12Mo H2O -")
  }
}
  const removeChip = (e, filter, el) => () => {
    const { deleteChip } = props;
    deleteChip(e, filter, el);
  };

  const removeAllFilters = () => {
    const { removeAll } = props;
    removeAll();
  };

  return (
    <div> 
      {filtersTypeArr && filtersTypeArr.length > 0 ? (
      <Paper className={classes.paparMain} square>
        <List  aria-label="mailbox folders">
            <div>
                <div className={classes.listLabel}>{filterNameType}</div>
                <Button className={classes.deleteButton} endIcon={<HighlightOffIcon />} onClick={removeAllFilters}  aria-label="delete">
                    Clear All
                </Button> 
                <ListItem  className={classes.listItemContainer} button>
                {filtersTypeArr ? filtersTypeArr.map( elm =>
                    elm[1].filter(item => item !== "all").map(el => 
                    <Chip
                      key={el[2]}
                      className={classes.chipContainer}
                      label={(
                        <section>
                            <div className={classes.chip}>{removeNameFromType(el[1][1])}{" "}{el[0] === ">=" ? "Min" : "Max"} </div>    
                            <div className={classes.chipRow}>{el[2]}</div>
                        </section>
                        )}
                      onDelete={removeChip(el[2], elm[0], elm)}
                    />
                    )
                )  : null}   
              </ListItem>
              <Divider />
            </div>
        </List>
      </Paper>
       ) : null}
    </div>
  );
}
