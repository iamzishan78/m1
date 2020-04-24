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
  const [filtersTypeArrInterest, setFiltersTypeArrInterest] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    if (props) {
      setFilterNameType(props.type);
      setFiltersTypeArr(props.filters[0]);
      setFiltersTypeArrInterest(props.filters[1]);
    }
  }, [props]);

  const removeNameFromTypeInterest = (string) => {
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

  const removeChipInterest = (e) => () => {
    const { deleteChipInterest } = props;
    deleteChipInterest(e);
  };

  const removeNameFromType = (string) => {
    if (string.includes("ownershipTypeEducationalInstitutions")) {
      return string.replace(
        "ownershipTypeEducationalInstitutions",
        "Educational Institutions"
      );
    }
    if (string.includes("ownershipTypeReligiousInstitutions")) {
      return string.replace(
        "ownershipTypeReligiousInstitutions",
        "Religious Institutions"
      );
    }
    if (string.includes("ownershipTypeTrusts")) {
      return string.replace("ownershipTypeTrusts", "Trusts");
    }
    if (string.includes("ownershipTypeNonProfits")) {
      return string.replace("ownershipTypeNonProfits", "Non Profits");
    }
    if (string.includes("ownershipTypeCorporations")) {
      return string.replace("ownershipTypeCorporations", "Corporations");
    }
    if (string.includes("ownershipTypeGovernmentalBodies")) {
      return string.replace(
        "ownershipTypeGovernmentalBodies",
        "Governmental Bodies"
      );
    }
    if (string.includes("ownershipTypeIndividuals")) {
      return string.replace("ownershipTypeIndividuals", "Individuals");
    }
    if (string.includes("ownershipTypeUnknown")) {
      return string.replace("ownershipTypeUnknown", "Unknown");
    }
    if (string.includes("<=")) {
      return string.replace("<=", "Max");
    }
    if (string.includes(">=")) {
      return string.replace(">=", "Min");
    }
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
            >
              Clear All
            </Button>
            <ListItem className={classes.listItemContainer} button>
            {filtersTypeArrInterest
                  ? filtersTypeArrInterest.map((elm) =>
                      elm[1][1] ? (
                        <Chip
                          key={elm[1]}
                          className={classes.chipContainer}
                          label={
                            <section>
                              <div className={classes.chip}>Interest Type</div>
                              <div className={classes.chipRow}>
                                {removeNameFromTypeInterest(elm[1][1][1])}
                              </div>
                            </section>
                          }
                          onDelete={removeChipInterest(elm[1][1][1])}
                        />
                      ) : null
                    )
                  : null}
                {filtersTypeArrInterest
                  ? filtersTypeArrInterest.map((elm) =>
                      elm[1][2] ? (
                        <Chip
                          key={elm[2]}
                          className={classes.chipContainer}
                          label={
                            <section>
                              <div className={classes.chip}>Interest Type</div>
                              <div className={classes.chipRow}>
                                {removeNameFromTypeInterest(elm[1][2][1])}
                              </div>
                            </section>
                          }
                          onDelete={removeChipInterest(elm[1][2][1])}
                        />
                      ) : null
                    )
                  : null}
                {filtersTypeArrInterest
                  ? filtersTypeArrInterest.map((elm) =>
                      elm[1][3] ? (
                        <Chip
                          key={elm[3]}
                          className={classes.chipContainer}
                          label={
                            <section>
                              <div className={classes.chip}>Interest Type</div>
                              <div className={classes.chipRow}>
                                {removeNameFromTypeInterest(elm[1][3][1])}
                              </div>
                            </section>
                          }
                          onDelete={removeChipInterest(elm[1][3][1])}
                        />
                      ) : null
                    )
                  : null}
                {filtersTypeArrInterest
                  ? filtersTypeArrInterest.map((elm) =>
                      elm[1][4] ? (
                        <Chip
                          key={elm[4]}
                          className={classes.chipContainer}
                          label={
                            <section>
                              <div className={classes.chip}>Interest Type</div>
                              <div className={classes.chipRow}>
                                {removeNameFromTypeInterest(elm[1][4][1])}
                              </div>
                            </section>
                          }
                          onDelete={removeChipInterest(elm[1][4][1])}
                        />
                      ) : null
                    )
                  : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterNoOwnerCount" ? (
                      <Chip
                        key={elm[1]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owenr Type</div>
                            <div className={classes.chipRow}>No Owenrs</div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterOwnerCount" && elm[1][1] ? (
                      <Chip
                        key={elm[1]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>
                              {removeNameFromType(elm[1][1][0])}
                            </div>
                            <div className={classes.chipRow}>
                              {elm[1][1][2]}
                            </div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterOwnerCount" && elm[1][2] ? (
                      <Chip
                        key={elm[2]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>
                              {removeNameFromType(elm[1][2][0])}
                            </div>
                            <div className={classes.chipRow}>
                              {elm[1][2][2]}
                            </div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterAllOwnershipTypes" && elm[1][1] ? (
                      <Chip
                        key={elm[1]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owenr Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(elm[1][1][1])}
                            </div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterAllOwnershipTypes" && elm[1][2] ? (
                      <Chip
                        key={elm[2]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owenr Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(elm[1][2][1])}
                            </div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterAllOwnershipTypes" && elm[1][3] ? (
                      <Chip
                        key={elm[3]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owenr Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(elm[1][3][1])}
                            </div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterAllOwnershipTypes" && elm[1][4] ? (
                      <Chip
                        key={elm[4]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owenr Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(elm[1][4][1])}
                            </div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterAllOwnershipTypes" && elm[1][5] ? (
                      <Chip
                        key={elm[5]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owenr Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(elm[1][5][1])}
                            </div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterAllOwnershipTypes" && elm[1][6] ? (
                      <Chip
                        key={elm[6]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owenr Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(elm[1][6][1])}
                            </div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterAllOwnershipTypes" && elm[1][7] ? (
                      <Chip
                        key={elm[7]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owenr Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(elm[1][7][1])}
                            </div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elm) =>
                    elm[0] === "filterAllOwnershipTypes" && elm[1][8] ? (
                      <Chip
                        key={elm[8]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owenr Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(elm[1][8][1])}
                            </div>
                          </section>
                        }
                        onDelete={(e) => console.log("e")}
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
