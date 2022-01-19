import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Grid, Typography, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import WellSearchApiField from "components/Shared/Forms/Fields/WellSearchApiField";
import StateField from "./State";
import CountyField from "./County";

const useStyles = makeStyles((theme) => ({
  titleText: {
    textTransform: "uppercase",
    margin: "5px 16px 10px",
    color: "#5a5a5a",
  },
  fieldsSection: {
    color: "grey !important",
    margin: "10px 0px",
    padding: "0px 100px 0px 0px",
    "& .MuiInputBase-root": {
      borderRadius: "3px",
    },
    "& svg": {
      fill: "grey !important",
    },
  },
  wellsSelectField: {
    "& .MuiInputBase-root": {
      borderRadius: "8px",
    },
  },
  formControl: {
    width: "100%",
  },
  dateRoot: {
    color: "grey",
    "& input": {
      marginLeft: "20px",
    },
  },
}));

export default function HeaderFunction(props) {
  const classes = useStyles();
  const [selectedWell, setSelectedWell] = useState(null);

  const { control, reset, setValue, watch, register } = useForm();

  useEffect(() => {
    register("state");
    register("county");
  }, [register]);

  const selectedState = watch("state", {});

  const setTenantWell = (well) => {
    if (well) reset(well);
  };

  return (
    <Grid
      container
      direction="row"
      display="flex"
      justify="space-between"
      alignItems="center"
      spacing={2}
      className={classes.fieldsSection}
    >
      <Grid item xs={3}>
        <Controller
          control={control}
          name="propertyNumber"
          render={(params) => <TextField {...params} margin="dense" type="text" label="Property Number" fullWidth />}
        />
      </Grid>
      <Grid item xs={4}>
        <Controller
          control={control}
          name="propertyName"
          render={(params) => <TextField margin="dense" type="text" label="Property Name" fullWidth />}
        />
      </Grid>
      <Grid item xs={4}>
        <WellSearchApiField setTenantWell={setTenantWell} setSelectedWell={setSelectedWell} label="Associated Wells" />
      </Grid>
      <Grid item xs={4}>
        <StateField onStateChange={(state) => setValue("state", state)} />
      </Grid>
      <Grid item xs={4}>
        <CountyField state={selectedState.acronym} onCountyChange={(county) => setValue("county", county)} />
      </Grid>
      <Grid item xs={4}>
        <Controller
          control={control}
          name="operatorName"
          render={(params) => <TextField margin="dense" label="Operator Name" placeholder="" fullWidth />}
        />
      </Grid>
      <Grid item xs={3}>
        <Controller
          control={control}
          name="ownerNumber"
          render={(params) => <TextField margin="dense" label="Owner Number" placeholder="" fullWidth />}
        />
      </Grid>
      <Grid item xs={4} sm={5}>
        <TextField margin="dense" label="Owner Name" placeholder="" fullWidth />
      </Grid>
      <Grid item xs={4} sm={3}>
        <TextField
          margin="dense"
          type="date"
          vaient=""
          label="Document Date"
          placeholder=""
          fullWidth
          format="MM/DD/YYYY"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            classes: {
              root: classes.dateRoot,
              focused: classes.focused,
              notchedOutline: classes.notchedOutline,
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <label>Legal Description</label>
        <TextField margin="dense" type="number" variant="outlined" fullWidth multiline rows={5} />
      </Grid>
    </Grid>
  );
}
