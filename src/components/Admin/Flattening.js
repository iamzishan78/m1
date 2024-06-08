import React, { useState } from "react";
import { Autocomplete, TextField, Button } from '@mui/material';
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FLATTENNING } from 'graphQL/useMutationRunFlattening';
import { useMutation } from "@apollo/client";

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

const flatteningModels = [
  'CheckDetail', // CheckDetail_Flat, CheckDetailInterestsComparison_Flat
  'CustomLayer', // Shape_Flat
  'ShapeOwnerDescriptor', // ShapeOwner_Flat
  'Contact', // Contact_Flat
  'Check', // Check_Flat
  'File', // Document_Flat
  'Activity', // Activity_Flat
  'ShapeTractDescriptor', // ShapeTract_Flat
  'WellDescriptor', // WellInterest_Flat
  'ShapeWellDescriptor', // ShapeWellInterest_Flat
  'Campaign', // Campaign_Flat
  'Property', // Property_Flat
  'PropertyDescriptor', // PropertyInterest_Flat
  'MyWell', // MyWell_Flat 
  'MyWellProduction', // MyWellProduction_Flat
  'ShapeFile', // ShapeFile_Flat
  'ParcelDescriptor', // RunsheetInstrument_Flat
  'Notification', // Notification_Flat
];


export default function Flattening() {

  const classes = useStyles();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [warning, setWarning] = useState(false);

  const [RunFlattening, { data, loading, error }] = useMutation(FLATTENNING);


  const handleAutocompleteChange = (event, value) => {
    setSelectedOptions(value);
    setWarning(value.length > 2);
  };

  const handleClick = () => {
    RunFlattening({
      variables: {
        models: selectedOptions,
        chunkSize: 500
      }
    })
  }

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
          options={flatteningModels}
          value={selectedOptions}
          onChange={handleAutocompleteChange}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Flattening" />}
        />

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
          You can run flattening only on 2 index at a time.
        </div>
      )}
    </div>
  );
}