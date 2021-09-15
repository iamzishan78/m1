import React, { useEffect, useContext, Fragment } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, FormControl, TextField, Select } from "@material-ui/core";

import { TransactContext } from "components/Transact/TransactContext";

const useStyles = makeStyles(() => ({
  basicInfoRoot: {
    padding: "25px",
    "& .MuiInputBase-root": {
      height: "40px !important",
      "& .MuiSelect-root": {
        backgroundColor: "transparent",
      },
    },
  },
  label: {
    margin: "15px 0px 0px",
  },
  formControl: {
    minWidth: "100%",
    maxHeight: "45px",
    marginBottom: 0,
  },
}));

const BasicInfo = (props) => {
  const classes = useStyles();
  const [stateTransact] = useContext(TransactContext);
  const { openPipeDialog, selectedPipe } = useSelector(({ Flow }) => Flow);
  const { control, getValues, reset, watch } = useForm("FLOWLINE_FORM");

  useEffect(() => {
    if (openPipeDialog === true) {
      reset(selectedPipe);
    }
  }, [openPipeDialog, reset, selectedPipe]);

  return (
    <div className={classes.basicInfoRoot}>
      <Grid container display="flex" alignItems="center">
        <Grid item xs={12}>
          <h3 className={classes.label}>Flowline Name</h3>
          <Controller
            control={control}
            name="name"
            render={(field) => (
              <TextField {...field} margin="dense" variant="outlined" placeholder="Click to enter deal name" required fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <h3 className={classes.label}>Project Tie</h3>
          <FormControl variant="outlined" className={classes.formControl}>
            <Controller
              control={control}
              name="projectId"
              render={(field) => (
                <Select {...field} native>
                  <>
                    <option value=""></option>
                    {stateTransact.projects?.map((project, index) => (
                      <Fragment key={index}>
                        <option value={project.projectId}>{project.projectName}</option>
                      </Fragment>
                    ))}
                  </>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h3 className={classes.label}>Flow Milestone Date</h3>
          <FormControl variant="outlined" className={classes.formControl}>
            <Controller
              control={control}
              name="milestoneDate"
              render={(field) => (
                <Select {...field} native>
                  <option value=""></option>
                  <option value="expectedClose">Expected Close</option>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h3 className={classes.label}>Detail Card Section</h3>
          <FormControl variant="outlined" className={classes.formControl}>
            <Controller
              control={control}
              name="detailCardSection"
              render={(field) => (
                <Select {...field} native>
                  <option value=""></option>
                  <option value="description">Description</option>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <h3 className={classes.label}>Flow Status</h3>
          <FormControl variant="outlined" className={classes.formControl}>
            <Controller
              control={control}
              name="status"
              render={(field) => (
                <Select {...field} native defaultValue="">
                  <option value=""></option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="passed">Passed</option>
                </Select>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default BasicInfo;
