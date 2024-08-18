import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Button } from '@mui/material';
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { REINDEX } from 'graphQL/useMutationadminESOperations';
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_ES_OPERATIONS_MODELS } from "graphQL/useQueryadminESOperations";

const useStyles = makeStyles((theme) => ({
  actionBar: () => ({
    padding: "10px 25px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "transparent",
    width: "100%",
    minHeight: "65px",
    marginTop: "100px",
    "& .MuiSelect-select:focus, & .MuiOutlinedInput-root": {
      backgroundColor: "#ffff",
    },
    "& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)": {
      borderColor: "#ffff",
    },
  }),

  addDataButton: {
    backgroundColor: "white",
    color: "black",
    textTransform: "capitalize",
  },

}));

export default function Reindex() {

  const classes = useStyles();

  const [getESOperationsModels, { data }] = useLazyQuery(GET_ES_OPERATIONS_MODELS);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [warning, setWarning] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const [Reindex] = useMutation(REINDEX);

  const handleAutocompleteChange = (event, value) => {
    setSelectedOptions(value);
    setWarning(value.length > 2);
  };

  const handleClick = () => {
    Reindex({
      variables: {
        models: selectedOptions,
      }
    })
    setShowMessage(true)
  }

  useEffect(() => {
    getESOperationsModels({
      variables: { type: "reindex" },
    });
  }, [getESOperationsModels]);

  return (
    <div style={{ marginTop: "65px" }}>
      <Grid
        container
        direction="row"
        display="flex"
        justify="space-between"
        className={classes.actionBar}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          multiple
          options={data?.getESOperationsModels || []}
          value={selectedOptions}
          onChange={handleAutocompleteChange}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Reindex" />}
        />

        <Button
          variant="contained"
          onClick={handleClick}
          color="primary"
          className={classes.addDataButton}
          disabled={warning}
        >
          Run Reindex
        </Button>
      </Grid>
      {warning && (
        <div style={{ color: 'red', marginTop: '10px', marginLeft: '20px' }}>
          You should run reindexing only on 2 index at a time.
        </div>
      )}
      {
        showMessage &&
        (
          <div style={{ color: 'green', marginTop: '10px', marginLeft: '20px' }}>
            Reindexing Process is Started
          </div>
        )
      }
    </div>
  );
}