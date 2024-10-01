import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Button } from '@mui/material';
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FLATTEN } from 'graphQL/useMutationadminESOperations';
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

export default function Flatten() {

  const classes = useStyles();

  const [getESOperationsModels, { data }] = useLazyQuery(GET_ES_OPERATIONS_MODELS);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [warning, setWarning] = useState(false);
  const [chunkSize, setChunkSize] = useState(500);
  const [showMessage, setShowMessage] = useState(false);

  const [RunFlattening] = useMutation(FLATTEN);

  const handleAutocompleteChange = (event, value) => {
    setSelectedOptions(value);
    setWarning(value.length > 2);
  };

  console.log(typeof chunkSize)
  const handleClick = () => {
    RunFlattening({
      variables: {
        models: selectedOptions,
        chunkSize: chunkSize ? Number(chunkSize) : 500
      }
    })
    setShowMessage(true)
  }

  useEffect(() => {
    getESOperationsModels({
      variables: { type: "flatten" },
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
        <Grid>
          <Grid container spacing={2} display="flex" direction="row">
            <Grid item>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                multiple
                options={data?.getESOperationsModels || []}
                value={selectedOptions}
                onChange={handleAutocompleteChange}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Flattening" />}
              />
            </Grid>

            <Grid item>
              <TextField
                inputProps={{
                  min: 500,
                  step: 1,
                  onWheel: (e) => e.target.blur(),
                  onKeyDown: (e) => {
                    if (e.key === '-' || e.key === 'e') {
                      e.preventDefault();
                    }
                  },
                }}
                value={chunkSize}
                type="number"
                onChange={(e) => setChunkSize(e.target.value)}
                label="Chunk Size"
              />
            </Grid>

          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={handleClick}
          color="primary"
          className={classes.addDataButton}
          disabled={warning}
        >
          Run Flattening
        </Button>
      </Grid>
      {warning && (
        <div style={{ color: 'red', marginTop: '10px', marginLeft: '20px' }}>
          You should run flattening only on 2 index at a time.
        </div>
      )}
      {
        showMessage &&
        (
          <div style={{ color: 'green', marginTop: '10px', marginLeft: '20px' }}>
            Flatenning Process is Started
          </div>
        )
      }
    </div>
  );
}