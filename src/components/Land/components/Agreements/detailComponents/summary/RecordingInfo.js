import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import _ from "lodash";
import { Grid, makeStyles, Typography, TextField, IconButton, FormControl, InputLabel } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { StyledTextField } from "../style";

const useStyles = makeStyles((theme) => ({
  fieldContainer: {
    opacity: 0.7,
    "& .MuiTextField-root": {
      marginTop: "18px !important",
    },
    "& .MuiInputBase-root": {
      border: "1px solid black",
    },
  },
  fieldText: {
    fontSize: "15px",
    fontWeight: "bold",
  },
  acreageCard: {
    backgroundColor: "#F6F8F9",
    // paddingTop: "10px",
    marginTop: "8px",
    marginBottom: "8px",
    "& .heading": {
      fontWeight: "bold",
      fontSize: "larger",
    },
    "& .MuiGrid-item": {
      padding: "0px 5px",
      marginTop: "20px",
      "& .MuiInputBase-root": {
        height: "41px !important",
        backgroundColor: "#fff",
      },
    },
  },
  mainCard: {
    paddingLeft: "5px",
  },
  lastChild: {
    marginBottom: "40px",
  },
}));

const Acreage = ({ properties, updateAgreement }) => {
  const { control, reset } = useForm();
  const classes = useStyles();

  useEffect(() => {
    if (!_.isEmpty(properties)) {
      reset(properties);
    }
  }, [properties, reset]);

  const offClickHandler = (key, value) => {
    updateAgreement(key, value);
  };

  return (
    <Grid item md={12} className={classes.acreageCard}>
      <Grid className={classes.mainCard} container display="row" alignItems="center">
        <Grid item xs={11} style={{ marginTop: 0 }}>
          <Grid container display="row" alignItems="center" justifyContent="space-between" spacing={3}>
            <Grid item xs={12}>
              <Typography className="heading">Recording Information</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={11} style={{ marginTop: 0 }}>
          <Grid container display="row" alignItems="center" justifyContent="space-between">
            <Grid item xs={3} className={classes.fieldContainer}>
              <Controller
                control={control}
                name="recordedDate"
                defaultValue=""
                render={(params) => (
                  <FormControl variant="standard" fullWidth>
                    <InputLabel shrink>Recorded Date</InputLabel>
                    <TextField
                      autoOk
                      type="date"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      value={params.value ? moment(params.value).utc(true).format("yyyy-MM-DD") : ""}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onBlur={(event) => {
                        offClickHandler("recordedDate", event?.target?.value || null);
                      }}
                      onChange={params.onChange}
                      disableToolbar
                      KeyboardButtonProps={{ "aria-label": "change date" }}
                      format="MM/DD/YYYY"
                      PopoverProps={{ disablePortal: false }}
                      InputProps={{
                        endAdornment: (
                          <IconButton>
                            <Clear style={{ height: 22, width: 22 }} onClick={() => {
                              params.onChange("");
                              offClickHandler("recordedDate", null);
                            }} />
                          </IconButton>
                        ),
                        classes: {
                          root: classes.dateRoot,
                        },
                      }}
                    />
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Controller
                control={control}
                name="recordedBook"
                defaultValue=""
                render={(params) => (
                  <StyledTextField
                    {...params}
                    label="Book"
                    onBlur={(event) => {
                      offClickHandler("recordedBook", event?.target?.value || null);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Controller
                control={control}
                name="recordedPage"
                defaultValue=""
                render={(params) => (
                  <StyledTextField
                    {...params}
                    label="Page"
                    onBlur={(event) => {
                      offClickHandler("recordedPage", event?.target?.value || null);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={3}>
              <Controller
                control={control}
                name="recordedInstrumentNumber"
                defaultValue=""
                render={(params) => (
                  <StyledTextField
                    {...params}
                    label="Instrument #"
                    onBlur={(event) => {
                      offClickHandler("recordedInstrumentNumber", event?.target?.value || null);
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Acreage;
