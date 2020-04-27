import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import Chip from "@material-ui/core/Chip";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  paparMain: {
    boxShadow: "none",
    padding: "2px 6px",
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
  chipContainer: {
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
    "&:hover": {
      color: "transparent",
    },
  },
}));

export default function FilterDedaultListWell(props) {
  const [filtersTypeArr, setFiltersTypeArr] = useState(null);
  const [filterNameType, setFilterNameType] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    if (props) {
      setFiltersTypeArr(props.filters);
      setFilterNameType(props.type);
    }
  }, [props]);

  const removeNameFromType = (string) => {
    if (string.includes("wellBoreProfile")) {
      return string.replace("wellBoreProfile", "Bore Profile");
    }
    if (string.includes("well")) {
      return string.replace("well", " ");
    }
    if (string.includes("operator")) {
      return string.replace("operator", "Operator");
    }
    if (Array.isArray(string)) {
      if (string[1].includes("permitApprovedDate")) {
        let str = string[1].toString();
        return str.replace("permitApprovedDate", "Permit Date");
      }
    }
    if (Array.isArray(string)) {
      if (string[1].includes("spudDate")) {
        let str = string[1].toString();
        return str.replace("spudDate", "Spud Date");
      }
    }
    if (Array.isArray(string)) {
      if (string[1].includes("firstProductionDate")) {
        let str = string[1].toString();
        return str.replace("firstProductionDate", "Production Date");
      }
    }
    if (Array.isArray(string)) {
      if (string[1].includes("completionDate")) {
        let str = string[1].toString();
        return str.replace("completionDate", "Completion Date");
      }
    }
  };

  const convertDate = (unixStamp) => {
    const date = moment.utc(unixStamp).format("MM/DD/YYYY");
    return date;
  };

  const removeChip = (e, name) => () => {
    const { deleteChip } = props;
    deleteChip(e, name);
  };

  const removeAllFilters = () => {
    const { removeAll } = props;
    removeAll();
  };

  return (
    <div>
      {filtersTypeArr && filtersTypeArr.length > 0 ? (
        <Paper className={classes.paparMain} square>
          <List aria-label="mailbox folders">
            <div>
              <div className={classes.listLabel}>{filterNameType}</div>
              <Button
                className={classes.deleteButton}
                endIcon={<HighlightOffIcon />}
                aria-label="delete"
                onClick={removeAllFilters}
              >
                Clear All
              </Button>
              <ListItem className={classes.listItemContainer} button>
                {filtersTypeArr
                  ? filtersTypeArr.map((elm) =>
                      elm[1].length === 5
                        ? elm[1][2].map((el) => (
                            <Chip
                              key={el}
                              className={classes.chipContainer}
                              label={
                                <section>
                                  <div className={classes.chip}>
                                    {removeNameFromType(elm[1][1][1])}
                                  </div>
                                  <div className={classes.chipRow}>{el}</div>
                                </section>
                              }
                              onDelete={removeChip(el, elm[0])}
                            />
                          ))
                        : elm[1].length === 3
                        ? elm[1]
                            .filter((item) => item !== "all")
                            .map((el) => (
                              <Chip
                                key={el[2]}
                                className={classes.chipContainer}
                                label={
                                  <section>
                                    <div className={classes.chip}>
                                      {removeNameFromType(elm[1][1][1])}{" "}
                                      {el[0] === ">=" ? "From" : "To"}
                                    </div>
                                    <div className={classes.chipRow}>
                                      {convertDate(el[2])}
                                    </div>
                                  </section>
                                }
                                onDelete={removeChip(el, elm[0])}
                              />
                            ))
                        : null
                    )
                  : null}
              </ListItem>
              <Divider />
            </div>
          </List>
        </Paper>
      ) : null}
    </div>
  );
}
