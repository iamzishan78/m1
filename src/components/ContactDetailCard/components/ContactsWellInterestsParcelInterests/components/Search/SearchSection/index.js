import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PersonIcon from "@material-ui/icons/Person";
import WellIcon from "components/Shared/svgIcons/well";
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import parse from "autosuggest-highlight/parse";
import { useDispatch } from "react-redux";
import { deepEqualObjects } from "components/Shared/functions";
import useStyles from "../style";

// import value formatters 
import joinAddress from "components/Shared/valueformatters/join-address.js";
import { callOwnerSearch, callWellSearch } from "./searchApi";

const ownerCogIndexName = "globalowner-index";

const maxMinScore = (options) => {
  let max = 0;
  let min = 1000000;
  for (let i = 0; i < options.length; i++) {
    if (options[i].Score > max) max = options[i].Score;
    if (options[i].Score < min) min = options[i].Score;
  }

  return [max, min];
};

const calcScoreOpacity = (maxMin, score) => {
  if (maxMin[0] === maxMin[1]) return 0;
  if (score === maxMin[1]) return 1;
  return 1 - (score - maxMin[1]) / (maxMin[0] - maxMin[1]);
};

function Search({ fetchSelectedWells }) {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [searchOption, setSearchOption] = React.useState("wells");
  const [searchResultData, setSearchResultData] = React.useState([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [maxMinWellsScore, setMaxMinWellsScore] = React.useState([0, 0]);
  const [maxMinOwnersScore, setMaxMinOwnersScore] = React.useState([0, 0]);
  const [searchTop, setSearchTop] = React.useState(5);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const intermediateCheckedIcon = <IndeterminateCheckBoxIcon fontSize="small" />;

  React.useEffect(() => {
    if (inputValue === "") {
      if (searchResultData.length !== 0 && searchLoading !== false) {
        setSearchResultData([]);
        setSearchLoading(false);
      }
      return undefined;
    }
    setSelectedIds([])
    setSearchLoading(true);
    (async () => {
      let newOptions = [];
      if (searchOption === "wells")
        callWellSearch({ input: inputValue, top: searchTop }, (results) => {
          if (results) {
            const indexSource = results["@odata.context"].substring(
              results["@odata.context"].indexOf("('") + 2,
              results["@odata.context"].indexOf("')")
            );

            newOptions = [
              ...results.value.map((result) => {
                result.Score = result["@search.score"];
                delete result["@search.score"];
                return {
                  ...result,
                  Source: indexSource,
                  Primary: result.WellName,
                  Secondary: result.ApiNumber,
                  selected: false
                };
              }),
              ...newOptions,
            ];

            setMaxMinWellsScore(maxMinScore(results.value));
          }
          setSearchResultData([...newOptions]);
          setSearchLoading(false);
        })
      if (searchOption === "owners")
        callOwnerSearch({ input: inputValue, top: searchTop }, (results) => {
          if (results) {
            const indexSource = results["@odata.context"].substring(
              results["@odata.context"].indexOf("('") + 2,
              results["@odata.context"].indexOf("')")
            );
            newOptions = [
              ...results.value.map((result) => {
                result.Score = result["@search.score"];
                delete result["@search.score"];
                return {
                  ...result,
                  Source: indexSource,
                  Primary: result.OwnerName,
                  Secondary: joinAddress(result),
                  selected: false
                };
              }),
            ];

            setMaxMinOwnersScore(maxMinScore(results.value));
          }
          setSearchResultData([...newOptions]);
          setSearchLoading(false);
        })
    })();
  }, [inputValue, searchTop, callWellSearch, callOwnerSearch, searchOption]);

  const selectWellId = (id, selection, all = false) => {
    const _searchResultData = searchResultData.map((data) => {
      if (data.Id === id || all) {
        data.selected = selection
      }
      return data
    })
    setSearchResultData(_searchResultData)
    if (selection) {
      if (all)
        setSelectedIds(searchResultData.map(s => s.Id))
      else {
        selectedIds.push(id);
        setSelectedIds(selectedIds)
      }
    } else {
      if (all)
        setSelectedIds([])
      else
        setSelectedIds([...selectedIds.filter(e => e !== id || all)])
    }
  }

  const handleSearchOption = (value) => {
    if (value !== searchOption) {
      setSearchResultData([])
      setSearchTop(5);
      setSearchOption(value)
    }
  }

  return (
    <Grid container direction="column" spacing={1} >

      <Grid item >
        <Typography className={classes.heading}>1. Search by interest owner or well name to associate interests to contacts</Typography>
      </Grid>
      <Grid item >
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search ..."
          InputProps={{
            startAdornment: (
              <InputAdornment className={classes.inputAdornment} position="start">
                <SearchIcon htmlColor="#757575" />
              </InputAdornment>
            ),
          }}
          onChange={(event) => {
            setSearchLoading(true);
            setInputValue(event.target.value);
          }}
        />
      </Grid>
      <Grid container item spacing={0} >
        <Grid item xs={12} style={{ margin: "0 4px" }}>
          <Button
            className={classes.headerButtons}
            variant={searchOption === "wells" ? "contained" : "outlined"}
            size="small"
            color={searchOption === "wells" ? "secondary" : "primary"}
            onClick={() => handleSearchOption("wells")}
          >
            Wells
         </Button>
          <Button
            className={classes.headerButtons}
            variant={searchOption === "owners" ? "contained" : "outlined"}
            size="small"
            color={searchOption === "owners" ? "secondary" : "primary"}
            onClick={() => handleSearchOption("owners")}
          >
            Tax owners
            </Button>
          <Button
            className={[classes.headerButtons, classes.floatRight]}
            variant="contained"
            size="small"
            color="secondary"
            disabled={selectedIds.length === 0}
            onClick={() => fetchSelectedWells(searchOption, selectedIds)}
          >
            Continue to Interest Section
         </Button>
        </Grid>
      </Grid>

      <Grid container item>
        {
          searchLoading ? <CircularProgress key="loader" style={{ margin: "10px 0 0 48%" }} size={28} color="secondary" />
            :
            <>
              {
                searchResultData.length > 0 && <Grid container item xs={12} className={classes.groupsHeaders}>
                  <Grid item item xs={1}>
                    <Checkbox
                      icon={selectedIds.length > 0 && selectedIds.length < searchResultData.length ? intermediateCheckedIcon : icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      color="primary"
                      onChange={(e) => {
                        selectWellId(null, e.target.checked, true);
                      }}
                    />
                  </Grid>
                  <Grid item item xs={5}>
                    <h3 className={classes.groupsHeadersText}>
                      {searchOption === "wells" ? "Well Interests " : searchOption === "owners" ? "Tax Owners " : searchOption}
                      {selectedIds.length > 0 && `(${selectedIds.length} Selected)`}
                    </h3>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "right" }}>
                    {searchTop === 5 ? (
                      <Button size="small" className={classes.groupsButton}
                        onClick={() => {
                          setSearchLoading(true);
                          setSearchTop(200);
                        }}
                      >
                        See All Results
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        className={classes.groupsButton}
                        onClick={() => {
                          setSearchLoading(true);
                          setSearchTop(5);
                        }}
                      >
                        See Less
                      </Button>
                    )}
                  </Grid>
                </Grid>
              }
            </>
        }

        <Grid item xs={12} style={{ maxHeight: "550px", overflow: "scroll" }}>
          {
            searchResultData.map((option) => {
              return (
                <Grid container spacing={0} key={option.Id}>
                  <Grid container item xs={11} alignItems="center">
                    <Grid item>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={option.selected}
                        color="primary"
                        onChange={(e) => {
                          selectWellId(option.Id, e.target.checked);
                        }}
                      />
                    </Grid>
                    <Grid item>
                      {option.Source === "globalowner-index" && (
                        <PersonIcon className={classes.icon} />
                      )}
                      {option.Source === "wellheader-index-en-ms" && (
                        <WellIcon className={classes.icon} color={"#757575"} opacity="1.0" small />
                      )}
                    </Grid>
                    <Grid item xs>
                      {parse(option.Primary, Array()).map((part, index) => (
                        <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }} > {part.text} </span>
                      ))}

                      {option && option.Secondary && (
                        <Typography variant="body2" color="textSecondary"> {option.Secondary} </Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container item xs={1} alignItems="center">
                    <Grid item style={{ position: "relative" }}>
                      <div
                        className={classes.score}
                        style={{
                          zIndex: "1300",
                          backgroundColor: "#12ABE0",
                        }}
                      />
                      <div
                        className={classes.score}
                        style={{
                          zIndex: "1301",
                          backgroundImage: "repeating-linear-gradient(135deg, #ffffff , #ffffffb7 4.5%, #ffffff 15%)",
                          opacity: calcScoreOpacity(option.Source === ownerCogIndexName ? maxMinOwnersScore : maxMinWellsScore, option.Score).toString(),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              );
            })
          }
        </Grid>
      </Grid>
    </Grid >
  );
}

export default React.memo(Search, deepEqualObjects);