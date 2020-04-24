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

export default function FilterDedaultListInterest(props) {
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
    // console.log(string);
    if (string.includes("interestTypeOverrideRoyalty")) {
      return string.replace("interestTypeOverrideRoyalty", "Override Royalty ");
    }
    if (string.includes("interestTypeProductionPayment")) {
      return string.replace(
        "interestTypeProductionPayment",
        "Production Payment"
      );
    }
    if (string.includes("interestTypeWorkingInterest")) {
      return string.replace("interestTypeWorkingInterest", "Working Interest");
    }
    if (string.includes("interestTypeRoyaltyInterest")) {
      return string.replace("interestTypeRoyaltyInterest", "Royalty Interest");
    }
  };

  const removeChip = (e) => () => {
    const { deleteChip } = props;
    deleteChip(e);
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
              >
                Clear All
              </Button>
              <ListItem className={classes.listItemContainer} button>
                {filtersTypeArr
                  ? filtersTypeArr.map((elm) =>
                      elm[1][1] ? (
                        <Chip
                          key={elm[1]}
                          className={classes.chipContainer}
                          label={
                            <section>
                              <div className={classes.chip}>Type</div>
                              <div className={classes.chipRow}>
                                {removeNameFromType(elm[1][1][1])}
                              </div>
                            </section>
                          }
                          onDelete={removeChip(elm[1][1][1])}
                        />
                      ) : null
                    )
                  : null}
                {filtersTypeArr
                  ? filtersTypeArr.map((elm) =>
                      elm[1][2] ? (
                        <Chip
                          key={elm[2]}
                          className={classes.chipContainer}
                          label={
                            <section>
                              <div className={classes.chip}>Type</div>
                              <div className={classes.chipRow}>
                                {removeNameFromType(elm[1][2][1])}
                              </div>
                            </section>
                          }
                          onDelete={removeChip(elm[1][2][1])}
                        />
                      ) : null
                    )
                  : null}
                {filtersTypeArr
                  ? filtersTypeArr.map((elm) =>
                      elm[1][3] ? (
                        <Chip
                          key={elm[3]}
                          className={classes.chipContainer}
                          label={
                            <section>
                              <div className={classes.chip}>Type</div>
                              <div className={classes.chipRow}>
                                {removeNameFromType(elm[1][3][1])}
                              </div>
                            </section>
                          }
                          onDelete={removeChip(elm[1][3][1])}
                        />
                      ) : null
                    )
                  : null}
                {filtersTypeArr
                  ? filtersTypeArr.map((elm) =>
                      elm[1][4] ? (
                        <Chip
                          key={elm[4]}
                          className={classes.chipContainer}
                          label={
                            <section>
                              <div className={classes.chip}>Type</div>
                              <div className={classes.chipRow}>
                                {removeNameFromType(elm[1][4][1])}
                              </div>
                            </section>
                          }
                          onDelete={removeChip(elm[1][4][1])}
                        />
                      ) : null
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
