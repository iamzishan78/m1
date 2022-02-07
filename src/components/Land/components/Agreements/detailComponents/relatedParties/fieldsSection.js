import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useStyles as customStyles } from "../style";
import { Grid, Button, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import AutoComplete from "components/Shared/components/Fields/AutoComplete";

export default function FieldsSection({ setPartiesNumber }) {
  const customClasses = customStyles();
  const [parties, setParties] = useState([{}]);
  const { control } = useForm();

  const addNewParty = () => {
    setPartiesNumber(parties.length + 1);
    setParties([...parties, {}]);
  };

  return (
    <Grid container display="flex" direction="row">
      {parties.map((party, index) => (
        <Grid item xs={12}>
          <Grid container className={customClasses.gridStyle} justify="flex-start">
            <Grid item xs={1} style={{ display: "flex" }}>
              <div className={customClasses.fieldLabel}>Party {index + 1}</div>
            </Grid>
            <Grid item xs={4}>
              <Controller
                control={control}
                name={`parties[${index}].type`}
                render={(params) => {
                  return (
                    <AutoComplete
                      {...params}
                      options={["Attorney", "Broker", "Lessor Contact", "Surface Landowner"]}
                      fullWidth
                      renderInput={(params1) => (
                        <TextField
                          margin="dense"
                          {...params1}
                          variant="outlined"
                          InputLabelProps={{
                            ...params.InputLabelProps,
                            shrink: true,
                          }}
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      ))}
      <Grid item>
        <Button variant="contained" color="primary" className={customClasses.addDataButton} startIcon={<AddIcon />} onClick={addNewParty}>
          Add Custom Data
        </Button>
      </Grid>
    </Grid>
  );
}
