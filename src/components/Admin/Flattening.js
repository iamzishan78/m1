import React, { useEffect, useState, useMemo } from "react";
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

  {
    modelName: 'CheckDetail', // CheckDetail_Flat, CheckDetailInterestsComparison_Flat
    isMSHandler: true
  },

  {
    modelName: 'CustomLayer', // Shape_Flat
    isMSHandler: true
  },

  {
    modelName: 'ShapeOwnerDescriptor', // ShapeOwner_Flat
    isMSHandler: true
  },

  {
    modelName: 'Contact', // Contact_Flat
    isMSHandler: true
  },

  {
    modelName: 'Check', // Check_Flat
    isMSHandler: true
  },

  {
    modelName: 'File', // Document_Flat
    isMSHandler: false
  },

  {
    modelName: 'Activity', // Activity_Flat
    isMSHandler: true
  },

  {
    modelName: 'ShapeTractDescriptor', // ShapeTract_Flat
    isMSHandler: false
  },

  {
    modelName: 'WellDescriptor', // WellInterest_Flat
    isMSHandler: false
  },

  {
    modelName: 'ShapeWellDescriptor', // ShapeWellInterest_Flat
    isMSHandler: false
  },

  {
    modelName: 'Campaign', // Campaign_Flat
    isMSHandler: true
  },

  {
    modelName: 'Property', // Property_Flat
    isMSHandler: true
  },

  {
    modelName: 'PropertyDescriptor', // PropertyInterest_Flat
    isMSHandler: true
  },

  {
    modelName: 'MyWell', // MyWell_Flat
    isMSHandler: true
  },

  {
    modelName: 'MyWellProduction', // MyWellProduction_Flat
    isMSHandler: true
  },

  {
    modelName: 'ShapeFile', // ShapeFile_Flat
    isMSHandler: true
  },

  {
    modelName: 'ParcelDescriptor', // RunsheetInstrument_Flat
    isMSHandler: true
  },

  {
    modelName: 'Notification', // Notification_Flat
    isMSHandler: true
  }
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
        chunkSize: 300
      }
    })
  }

  const memoizedFlatteningModels = useMemo(() => flatteningModels, []);

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
          options={memoizedFlatteningModels}
          value={selectedOptions}
          onChange={handleAutocompleteChange}
          getOptionLabel={(option) => option.modelName}
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