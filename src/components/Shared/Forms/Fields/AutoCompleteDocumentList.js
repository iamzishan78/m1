import React, { useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery } from "@apollo/client";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
const useStyles = makeStyles({
  inputRoot: {
    // backgroundColor: "#ffffff",
  },
  listbox: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});
const AutoCompleteDocumentList = ({ onSelect, search, setSearch }) => {
  const [documents, setDocuments] = useState([]);
  const [value, setValue] = useState({ name: "", _id: null });
  const [getESPaginatedList, { data: documentData }] = useLazyQuery(
    GET_ES_PAGINATED_LIST
  );
  useEffect(() => {
    getESPaginatedList({
      variables: {
        esIndex: "documents_flat",
        pagination: {
          first: 50,
          keep_alive: "1micros",
        },
        search: search ? `${search}*` : '',
      },
    });
  }, [search]);
  useEffect(() => {
    if (documentData?.getESPaginatedList?.hits) {
      setDocuments(documentData?.getESPaginatedList?.hits)
    }
  }, [documentData]);
  const onInputChange = (e) => {
    setSearch(e.target.value);
  };
  const onChange = (value) => {
    setValue(value)
    onSelect(value)
  };
  const classes = useStyles();
  return (
    <Autocomplete
      id="seletExistingDoc"
      value={value}
      disableListWrap
      classes={classes}
      options={documents || []}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option.inputValue) {
          return option.name;
        }
        if (option?.name) return option.name;
        else return "";
      }}
      filterOptions={(options, value) => {
        return options
      }}
      getOptionSelected={(option, value) => {
        return option?._id === value?._id;
      }}
      renderOption={(option) => {
        return (
          <Grid container spacing={0}>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs>
                <span style={{ fontWeight: 400 }}>{option.name}</span>
                <Typography variant="body2" color="textSecondary">
                  {option.documentNumber} {option.documentNumber && option.documentName ? ' - ' : ''} {option.documentName}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
      onInputChange={onInputChange}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      renderInput={(params) => (
        <TextField
          margin="dense"
          variant="outlined"
          {...params}
          placeholder="Search documents"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
          autoFocus
          size="small"
        />
      )}
    />
  );
};
export default AutoCompleteDocumentList;