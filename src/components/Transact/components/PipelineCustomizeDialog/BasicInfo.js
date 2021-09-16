import React, { useEffect, useContext, Fragment } from "react";
import { useSelector } from "react-redux";
import { Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, FormControl, TextField, Select, Switch, Checkbox, FormControlLabel } from "@material-ui/core";
import { CheckBoxOutlineBlank, CheckBox } from "@material-ui/icons";

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
    margin: "15px 0px 5px",
  },
  formControl: {
    minWidth: "100%",
    maxHeight: "45px",
    marginBottom: 0,
  },
}));

const BasicInfo = ({ control, reset, setValue, watch, flowErrors, setFlowErrors }) => {
  const classes = useStyles();
  const [stateTransact] = useContext(TransactContext);
  const { openPipeDialog, selectedPipe } = useSelector(({ Flow }) => Flow);

  const name = watch("name");

  useEffect(() => {
    if (name && flowErrors.name) {
      setFlowErrors((flowErrors) => ({ ...flowErrors, name: false }));
    }
  }, [name, setFlowErrors]);

  useEffect(() => {
    if (openPipeDialog === true) {
      reset(selectedPipe);
    }
  }, [openPipeDialog, reset, selectedPipe]);

  return (
    <div className={classes.basicInfoRoot}>
      <Grid container display="flex" alignItems="center">
        <Grid item xs={12}>
          <h4 className={classes.label}>Flowline Name</h4>
          <Controller
            control={control}
            name="name"
            render={(field) => (
              <TextField
                {...field}
                margin="dense"
                variant="outlined"
                placeholder="Click to flowline name"
                required
                fullWidth
                error={flowErrors.name}
                helperText={flowErrors.name && "Name is Required"}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <h4 className={classes.label}>Project Tie</h4>
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
          <h4 className={classes.label}>Flow Milestone Date</h4>
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
          <h4 className={classes.label}>Detail Card Section</h4>
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
          <h4 className={classes.label}>Flow Status</h4>
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
        <Grid item xs={12} style={{ marginTop: "20px" }}>
          <FormControl variant="outlined" className={classes.formControl}>
            <Controller
              control={control}
              name="IsDefault"
              render={(field) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      icon={<CheckBoxOutlineBlank fontSize="small" />}
                      checkedIcon={<CheckBox fontSize="small" />}
                      checked={watch("IsDefault")}
                      size="small"
                      onChange={({ target }) => setValue("IsDefault", target.checked)}
                    />
                  }
                  label="Mark as default flowline"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" className={classes.formControl}>
            <Controller
              control={control}
              name="rottenness"
              render={(field) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={watch("rottenness")}
                      size="small"
                      onChange={({ target }) => setValue("rottenness", target.checked)}
                    />
                  }
                  label="Rottenness Toggle"
                />
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default BasicInfo;
