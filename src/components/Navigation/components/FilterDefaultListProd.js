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
    display: "inline-flex",
    padding: "1px 0px",
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
      return string.replace("cumulativeWater", "Cumulative H2O")
    }
    if (string.includes("cumulativeOil")) {
        return string.replace("cumulativeOil", "Cumulative Oil")
    }
    if (string.includes("cumulativeGas")) {
        return string.replace("cumulativeGas", "Cumulative Gas")
    }
    if (string.includes("firstThreeMonthGas")) {
        return string.replace("firstThreeMonthGas", "1st 3 Months Gas")
    }
    if (string.includes("firstMonthOil")) {
        return string.replace("firstMonthOil", "1st Month Oil")
    }
    if (string.includes("firstSixMonthOil")) {
        return string.replace("firstSixMonthOil", "1st 6 Months Oil")
    }
  }

  return (
    <div> 
      <Paper className={classes.paparMain} square>
        <List  aria-label="mailbox folders">
            <div>
                <div className={classes.listLabel}>{filterNameType}</div>
                <Button className={classes.deleteButton} endIcon={<HighlightOffIcon />}  aria-label="delete">
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
                            <div className={classes.chip}>{removeNameFromType(el[1][1])}{el[0] === ">=" ? "Min" : "Max"} </div>    
                      <div className={classes.chipRow}>{el[2]}</div>
                        </section>
                        )}
                      onDelete={e => console.log("e")}
                    />
                    )
                )  : null}   
              </ListItem>
              <Divider />
            </div>
        </List>
      </Paper>
    </div>
  );
}
