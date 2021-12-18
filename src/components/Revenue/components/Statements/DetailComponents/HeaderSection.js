import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiFilledInput-root, & .MuiSelect-select.MuiSelect-select": {
      background: `none!important`,
    },
  },
  titleText: {
    textTransform: "uppercase",
    margin: "5px 16px 10px",
    fontWeight: "bold",
  },
  fieldsSection: {
    margin: "10px 0px",
    "& .MuiOutlinedInput-root": {
      height: `46px!important`
    }
  },

}));

export default function HeaderFunction(props) {
  const classes = useStyles();



  // const handleChange = debounce((item, index) => {
  //   const formValues = getValues();
  //   console.log("formValues", formValues)
  //   // if (formValues?.provisions) {
  //   //     const provision = formValues.provisions[index]
  //   //     if (provision.type)
  //   //         createAgreementProvision({
  //   //             variables:
  //   //             {
  //   //                 provision: { agreement: id, ...formValues.provisions[index] }
  //   //             }
  //   //         });
  //   // }
  // }, 500)


  return (
    <div className={classes.root}>
      <Typography varient="h5" className={classes.titleText}>
        Check Header
      </Typography>
      <Grid
        container
        direction="row"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        spacing={3}
        className={classes.fieldsSection}
      >
        <Grid item xs={4}>
          {/* Check number */}
          <TextField
            margin="dense"
            type="text"
            variant="outlined"
            label="Check Number"
            fullWidth
            value={props?.details?.checkNumber || ""}
          />
        </Grid>
        {/* Purchaser name */}
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            id="purchaser-name"
            options={[]}
            autoHighlight
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Purchaser Name"
                fullWidth
                value={props?.details?.payor?.name || ""}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
              />
            )}
          />
        </Grid>


        {/* <Grid item xs={3} >
          <Controller
            control={control}
            name={`Purchaser Name`}
            defaultValue={props?.details?.payor?.name || ""}
            render={(
              { onChange, value, ref },
            ) => (
              <AutocompEntityNamesList variant='outlined' margin='' size='' label='Purchaser Name' nameAutValue={value}
                setNameAutValue={(value) => {
                  if (value?._id)
                    onChange([{ _id: value._id }]);
                  else
                    onChange([]);
                }} />
            )}
          />

        </Grid>
        <Grid item md={1} style={{ height: '0px' }}>
          <IconButton
            size={"medium"}
            color={'primary'}
            onClick={(e) => {
              e.stopPropagation();
              // history.push(`/contact/details/${getParty(item)._id}`);
            }}
            aria-label="show contact"
          >
            <ContactCardDisabledIcon />

          </IconButton>
        </Grid> */}

        {/* Check date */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="text"
            variant="outlined"
            label="Check Date"
            fullWidth
            value={moment.utc(props?.details?.checkDate).format("MM/DD/YYYY") || ""}
          />
        </Grid>
        {/* Owner number */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="text"
            variant="outlined"
            label="Owner Number"
            fullWidth
            value={props?.details?.payee?.number || ""}
          />
        </Grid>
        {/* Owner name */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="text"
            variant="outlined"
            label="Owner Name"
            fullWidth
            value={props?.details?.payee?.name || ""}
          />
        </Grid>
        {/* Deposit date */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="text"
            variant="outlined"
            label="Deposit Date"
            fullWidth
            value={moment.utc(props?.details?.depositDate).format("MM/DD/YYYY") || ""}
          />
        </Grid>
        {/* Check amount */}
        <Grid item xs={4}>
          <TextField
            margin="dense"
            type="number"
            variant="outlined"
            label="Check Amount"
            fullWidth
            value={props?.details?.checkAmount || 0}
          />
        </Grid>
      </Grid>
    </div>
  );
}
