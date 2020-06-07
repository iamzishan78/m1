import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import Chip from "@material-ui/core/Chip";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { makeStyles } from "@material-ui/core/styles";
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
    textAlign: "center",
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

export default function FilterDedaultListGeo(props) {
  const [filtersTypeArrSCSA, setFiltersTypeArrSCSA] = useState(null);
  const [filtersTypeArr, setFiltersTypeArr] = useState(null);
  const [filterNameType, setFilterNameType] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    if (props) {
      if (props.filters[1].length > 0) {
        setFiltersTypeArr(props.filters[1]);
      }
      if (props.filters[0].length > 0) {
        setFiltersTypeArrSCSA(props.filters[0]);
      }
      setFilterNameType(props.type);
    }
  }, [props]);
  
  const removeNameFromType = (string) => {
    if (string.includes("basin")) {
      return string.replace("basin", "Basin");
    }
    if (string.includes("play")) {
      return string.replace("play", "Play");
    }
    if (string.includes("state")) {
      return string.replace("state", "State");
    }
    if (string.includes("county")) {
      return string.replace("county", "County");
    }
    if (string.includes("survey")) {
      return string.replace("survey", "Survey");
    }
    if (string.includes("abstract")) {
      return string.replace("abstract", "Abstract");
    }
  };
  
  const removeChip = (e, name) => () => {
    const { deleteChip } = props;
    deleteChip(e, name);
  };

  const removeChipSCSA = (e, name) => () => {
    const { deleteChipGeoSCSA } = props;
    deleteChipGeoSCSA(e, name);
  };

  const removeAllFilters = () => {
    const { removeAll } = props;
    removeAll();
  };
 
  return (
    <div>
      {props.filters && props.filters.length > 0 ? (
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
                            onDelete={removeChip(el,elm[0])}
                          />
                        ))
                      : null
                  )
                : null}
              {filtersTypeArrSCSA
                ? filtersTypeArrSCSA.map((ele) =>
                    ele[1][1] && ele[1][1].length === 5 ? (
                      <Chip
                        key={ele[1][1][2]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>
                              {removeNameFromType(ele[1][1][1][1])}
                            </div>
                            <div className={classes.chipRow}>
                              {ele[1][1][2]}
                            </div>
                          </section>
                        }
                        onDelete={removeChipSCSA(ele[1][1][2], ele[0])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArrSCSA
                ? filtersTypeArrSCSA.map((elem) =>
                    elem[1][2] && elem[1][2].length === 5 ? (
                      <Chip
                        key={elem[1][2][2]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>
                              {removeNameFromType(elem[1][2][1][1])}
                            </div>
                            <div className={classes.chipRow}>
                              {elem[1][2][2]}
                            </div>
                          </section>
                        }
                        onDelete={removeChipSCSA(elem[1][2][2], elem[0])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArrSCSA
                ? filtersTypeArrSCSA.map((elemt) =>
                    elemt[1][3] && elemt[1][3].length === 5 ? (
                      <Chip
                        key={elemt[1][3][2]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>
                              {removeNameFromType(elemt[1][3][1][1])}
                            </div>
                            <div className={classes.chipRow}>
                              {elemt[1][3][2]}
                            </div>
                          </section>
                        }
                        onDelete={removeChipSCSA(elemt[1][3][2], elemt[0])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArrSCSA
                ? filtersTypeArrSCSA.map((e) =>
                    e[1][4] && e[1][4].length === 5 ? (
                      <Chip
                        key={e[1][4][2]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>{removeNameFromType(e[1][4][1][1])}</div>
                            <div className={classes.chipRow}>{e[1][4][2]}</div>
                          </section>
                        }
                        onDelete={removeChipSCSA(e[1][4][2], e[0])}
                      />
                    ) : null
                  )
                : null}
            </ListItem>
            <Divider />
          </div>
        </List>
      </Paper>
      )
      : null}
    </div>
  );
}
