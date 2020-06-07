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
      return string.replace("interestTypeOverrideRoyalty", "OVERRIDE");
    }
    if (string.includes("interestTypeProductionPayment")) {
      return string.replace(
        "interestTypeProductionPayment",
        "PRODUCTION PAYMENT"
      );
    }
    if (string.includes("interestTypeWorkingInterest")) {
      return string.replace("interestTypeWorkingInterest", "WORKING INTEREST");
    }
    if (string.includes("interestTypeRoyaltyInterest")) {
      return string.replace("interestTypeRoyaltyInterest", "ROYALTY");
    }
  };

  const removeChipInterest = (e) => () => {
    const { deleteChipInterest } = props;
    deleteChipInterest(e);
  };

  const removeChipOwner = (e) => () => {
    const { deleteChip } = props;
    deleteChip(e);
  };

  const removeNameFromType = (string) => {
    if (string.includes("ownershipTypeEducationalInstitutions")) {
      return string.replace(
        "ownershipTypeEducationalInstitutions",
        "EDUCATIONAL INSTITUTIONS"
      );
    }
    if (string.includes("ownershipTypeReligiousInstitutions")) {
      return string.replace(
        "ownershipTypeReligiousInstitutions",
        "RELIGIOUS INSTITUTIONS"
      );
    }
    if (string.includes("ownershipTypeTrusts")) {
      return string.replace("ownershipTypeTrusts", "TRUSTS");
    }
    if (string.includes("ownershipTypeNonProfits")) {
      return string.replace("ownershipTypeNonProfits", "NON PROFITS");
    }
    if (string.includes("ownershipTypeCorporations")) {
      return string.replace("ownershipTypeCorporations", "COMPANIES");
    }
    if (string.includes("ownershipTypeGovernmentalBodies")) {
      return string.replace(
        "ownershipTypeGovernmentalBodies",
        "GOVERNMENTAL BODIES"
      );
    }
    if (string.includes("ownershipTypeIndividuals")) {
      return string.replace("ownershipTypeIndividuals", "INDIVIDUALS");
    }
    if (string.includes("ownershipTypeUnknown")) {
      return string.replace("ownershipTypeUnknown", "UNKNOWN");
    }
    if (string.includes("<=")) {
      return string.replace("<=", "Max Owner Count");
    }
    if (string.includes(">=")) {
      return string.replace(">=", "Min Owner Count");
    }
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
                ? filtersTypeArr.map((b) =>
                    b[0] === "filterNoOwnerCount" ? (
                      <Chip
                        key={b[1]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Wells w/o Owners</div>
                            <div className={classes.chipRow}>TRUE</div>
                          </section>
                        }
                        onDelete={removeChipOwner("noOwners")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((c) =>
                    c[0] === "filterHasOwnerCount" ? (
                      <Chip
                        key={c[1]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Wells With Owners</div>
                            <div className={classes.chipRow}>TRUE</div>
                          </section>
                        }
                        onDelete={removeChipOwner("hasOwners")}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((v) =>
                    v[0] === "filterOwnerCount" && v[1][1] ? (
                      <Chip
                        key={v[1]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>
                              {removeNameFromType(v[1][1][0])}
                            </div>
                            <div className={classes.chipRow}>
                              {v[1][1][2]}
                            </div>
                          </section>
                        }
                        onDelete={removeChipOwner(v[1][1][0])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((c) =>
                    c[0] === "filterOwnerCount" && c[1][2] ? (
                      <Chip
                        key={c[2]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>
                              {removeNameFromType(c[1][2][0])}
                            </div>
                            <div className={classes.chipRow}>
                              {c[1][2][2]}
                            </div>
                          </section>
                        }
                        onDelete={removeChipOwner(c[1][2][0])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((a) =>
                    a[0] === "filterAllOwnershipTypes" && a[1][1] ? (
                      <Chip
                        key={a[1]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owner Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(a[1][1][1])}
                            </div>
                          </section>
                        }
                        onDelete={removeChipOwner(a[1][1][1])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((o) =>
                    o[0] === "filterAllOwnershipTypes" && o[1][2] ? (
                      <Chip
                        key={o[2]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owner Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(o[1][2][1])}
                            </div>
                          </section>
                        }
                        onDelete={removeChipOwner(o[1][2][1])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((l) =>
                    l[0] === "filterAllOwnershipTypes" && l[1][3] ? (
                      <Chip
                        key={l[3]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owner Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(l[1][3][1])}
                            </div>
                          </section>
                        }
                        onDelete={removeChipOwner(l[1][3][1])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((m) =>
                    m[0] === "filterAllOwnershipTypes" && m[1][4] ? (
                      <Chip
                        key={m[4]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owner Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(m[1][4][1])}
                            </div>
                          </section>
                        }
                        onDelete={removeChipOwner(m[1][4][1])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((el) =>
                    el[0] === "filterAllOwnershipTypes" && el[1][5] ? (
                      <Chip
                        key={el[5]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owner Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(el[1][5][1])}
                            </div>
                          </section>
                        }
                        onDelete={removeChipOwner(el[1][5][1])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((em) =>
                    em[0] === "filterAllOwnershipTypes" && em[1][6] ? (
                      <Chip
                        key={em[6]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owner Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(em[1][6][1])}
                            </div>
                          </section>
                        }
                        onDelete={removeChipOwner(em[1][6][1])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((elment) =>
                elment[0] === "filterAllOwnershipTypes" && elment[1][7] ? (
                      <Chip
                        key={elment[7]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owner Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(elment[1][7][1])}
                            </div>
                          </section>
                        }
                        onDelete={removeChipOwner(elment[1][7][1])}
                      />
                    ) : null
                  )
                : null}
              {filtersTypeArr
                ? filtersTypeArr.map((e) =>
                    e[0] === "filterAllOwnershipTypes" && e[1][8] ? (
                      <Chip
                        key={e[8]}
                        className={classes.chipContainer}
                        label={
                          <section>
                            <div className={classes.chip}>Owner Type</div>
                            <div className={classes.chipRow}>
                              {removeNameFromType(e[1][8][1])}
                            </div>
                          </section>
                        }
                        onDelete={removeChipOwner(e[1][8][1])}
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
