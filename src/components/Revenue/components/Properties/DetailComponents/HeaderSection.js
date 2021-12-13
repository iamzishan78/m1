import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Grid, Typography, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

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
  return (
    <Grid container direction="row" display="flex" justify="space-around" alignItems="center" spacing={3} className={classes.fieldsSection}>
      <Grid item xs={3}>
        <TextField margin="dense" type="text" label="Property Number" fullWidth />
      </Grid>
      <Grid item xs={4}>
        <TextField margin="dense" type="text" label="Property Name" fullWidth />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          className={classes.wellsSelectField}
          multiple
          id="tags-outlined"
          options={[]}
          renderInput={(params) => (
            <>
              <label>Associated Well</label>
              <TextField
                {...params}
                margin="dense"
                variant="outlined"
                placeholder="Associated Well"
                className={classes.input}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment className={classes.inputAdornment} position="start">
                      <SearchIcon htmlColor="#757575" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment className={classes.inputAdornment} position="start">
                      <IconButton size="small">
                        <ArrowDropDownIcon htmlColor="#757575" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        />
      </Grid>
      <Grid item xs={2}>
        <FormControl className={classes.formControl}>
          <InputLabel id="state-select-label">State</InputLabel>
          <Select labelId="state-select-label" id="state-select">
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControl className={classes.formControl}>
          <InputLabel id="county-select-label">County</InputLabel>
          <Select labelId="county-select-label" id="county-select">
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <TextField
          margin="dense"
          label="Operator Name"
          placeholder=""
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          margin="dense"
          label="Owner Number"
          placeholder=""
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          margin="dense"
          label="Owner Name"
          placeholder=""
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          margin="dense"
          type="date"
          vaient=""
          label="Document Date"
          placeholder=""
          fullWidth
          format="MM/DD/YY"
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
