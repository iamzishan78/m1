import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import debounce from "lodash/debounce";

// Queries
import { GET_ES_SIMPLE_SEARCH } from "graphQL/useQueryESSimpleSearch";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  secondaryText: {
    color: "grey",
    fontSize: "15px",
    margin: 0,
  },
  alignCenter: {
    textAlign: "center",
  },
}));

function ESSearchField({
  filters,
  index,
  pagination,
  fields,
  sort,
  fieldName,
  onSelect,
}) {
  //Intials
  const location = useLocation();
  const classes = useStyles();
  const [foundItems, setFoundItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [focused, setFocused] = useState(false);

  const [getESSimpleSearch, { data: constDataItems, loading }] = useLazyQuery(
    GET_ES_SIMPLE_SEARCH,
    { fetchPolicy: "no-cache" }
  );
  // searching
  const callItemESSearch = React.useMemo(
    () =>
      debounce((request) => {
        getESSimpleSearch({
          variables: {
            filters,
            index,
            pagination,
            search: {
              query: `${request.input}`,
              fields,
            },
            sort,
          },
        });
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // setting the items
  useEffect(() => {
    const allESItem = constDataItems?.getESSimpleSearch?.hits;
    setFoundItems(allESItem);
  }, [constDataItems]);

  useEffect(() => {
    callItemESSearch({ input: "*" }, (results) => null);
  }, []);

  // ON change of selected item
  const onChange = (item) => {
    onSelect(item);
    setSelectedItem(item);
  };

  useEffect(() => {
    if (location.state?.focusOnItemSearch) {
      setFocused(true);
    }
  }, [location.state]);

  return (
    <FormControl variant="outlined" fullWidth size="small">
      <Autocomplete
        options={foundItems || []}
        onChange={(e, Item) => {
          onChange(Item);
        }}
        value={selectedItem}
        getOptionLabel={(option, value) => option?.name || option?.checkNumber}
        filterOptions={(x) => x}
        loading
        id={`${fieldName}Search`}
        loadingText={
          loading ? (
            <div className={classes.alignCenter}>
              <CircularProgress />
            </div>
          ) : (
            "No record found"
          )
        }
        renderOption={(option) => {
          return (
            <div>
              <Typography variant="subtitle1">
                {option?.name || option?.checkNumber}
              </Typography>
              <p className={classes.secondaryText}>{option?.ApiNumber}</p>
            </div>
          );
        }}
        renderInput={(params) => (
          <TextField
            margin="dense"
            focused={focused}
            {...params}
            required
            variant="outlined"
            label={`${fieldName.replace(/ies$/, "y").replace(/s$/, "")} ${
              fieldName.toLowerCase().includes("revenue") ? "Number" : "Name"
            }`}
            InputLabelProps={{ shrink: true }}
            onChange={(event) => {
              callItemESSearch(
                { input: `*${event.target.value}*` },
                (results) => null
              );
            }}
            onBlur={() => setFocused(false)}
          />
        )}
      />
    </FormControl>
  );
}

ESSearchField.defaultProps = {
  filters: [],
  fields: [],
  sort: [],
};

export default ESSearchField;
