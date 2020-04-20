import React, {useEffect, useState,} from "react";
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Chip from '@material-ui/core/Chip';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { makeStyles } from "@material-ui/core/styles";
import moment from 'moment'
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


export default function FilterDedaultList(props) {
  const [filtersTypeArr, setFiltersTypeArr] = useState(null);
  const [filterNameType, setFilterNameType] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    if (props) {
        setFiltersTypeArr(props.filters)
        setFilterNameType(props.type)
    }
  },[props])

  const removeNameFromType = (string) => { 
    if (string.includes("well")) {
      return string.replace("well", " ")
    }
    if (string.includes("interest")) {
      return string.replace("interest", " ")
    }
    if (string.includes("ownership")) {
      return string.replace("ownership", " ")
    }
    if (string.includes("operator")) {
        return string.replace("operator", "Operator")
    }
    if (Array.isArray(string)) {
        if (string[1].includes("permitApprove")) {
            let str = string[1].toString();
            return str.replace("permitApprove", "Permit")
        }
    }
  }

  const convertDate = unixStamp => {
    const date = moment.utc(unixStamp).format("MM/DD/YYYY");
    return date;
  }

  return (
    <div> 
      <Paper className={classes.paparMain} square>
        <List  aria-label="mailbox folders">
            <div>
              <div className={classes.listLabel}>{filterNameType}</div>
              <Button className={classes.deleteButton} endIcon={<HighlightOffIcon />}  aria-label="delete"/>
              {filtersTypeArr ? filtersTypeArr.map( elm => 
              <ListItem  key={elm} className={classes.listItemContainer} button>
                <div className={classes.chip}>{removeNameFromType(elm[1][1][1])}</div>
                {elm[1].length === 5 ? 
                  elm[1][2].map(el =>  
                      <Chip
                      key={el}
                      className={classes.chipContainer}
                      label={(
                        <section>
                          <div className={classes.chipRow}>{el}</div>
                        </section>
                        )}
                      onDelete={e => console.log('e')}
                    />
                  )
                 : null}
                {elm[1].length === 2 ? 
                  elm[1][1].map(el =>  
                      <Chip
                      key={el}
                      className={classes.chipContainer}
                      label={(
                        <section>
                          <div className={classes.chipRow}>{el}</div>
                        </section>
                        )}
                      onDelete={e => console.log("e")}
                    />
                  )
                 : null}
                 {elm[1].length === 3 ? 
                  elm[1].filter(item => item !== "all").map(el => 
                      <Chip
                      key={el}
                      className={classes.chipContainer}
                      label={(
                        <section>
                          <div className={classes.chipRow}>{convertDate(el[2])}</div>
                        </section>
                        )}
                      onDelete={e => console.log("e")}
                    />
                  )
                 : null}
              </ListItem>
            ) : null}
              <Divider />
            </div>
        </List>
      </Paper>
    </div>
  );
}
