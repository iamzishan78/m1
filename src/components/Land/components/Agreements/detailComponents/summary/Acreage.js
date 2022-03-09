import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { Grid, Typography } from "@material-ui/core";
import { useStyles as summaryStyles, StyledTextField } from "../style";

const Acreage = ({ properties }) => {
  const { control, reset } = useForm();
  const classes = summaryStyles();

  useEffect(() => {
    if (!_.isEmpty(properties)) {
      reset(properties);
    }
  }, [properties, reset]);
  return (
    <Grid item md={12} className={classes.acreageCard}>
      <Typography className="heading">Acreage</Typography>

      <Grid container direction="row" display="flex" justify="space-between" alignItems="center">
        <Grid item xs={4}>
          <Controller control={control} name="reportGrossAcres" label="Report Gross" as={StyledTextField} disabled />
        </Grid>
        <Grid item xs={4}>
          <Controller control={control} name="grossAcres" label="Gross" as={StyledTextField} disabled />
        </Grid>
        <Grid item xs={4}>
          <Controller control={control} name="companyNetAcres" label="Company Net" as={StyledTextField} disabled />
        </Grid>
        <Grid item xs={4}>
          <Controller control={control} name="reportNet" label="Report Net" as={StyledTextField} disabled />
        </Grid>
        <Grid item xs={4}>
          <Controller control={control} name="netAcres" label="Net" as={StyledTextField} disabled />
        </Grid>
        <Grid item xs={4}>
          <Controller control={control} name="netRoyalty" label="Net Royalty Acres" as={StyledTextField} disabled />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Acreage;
