import React from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';


const options = [
  { label: 'String', value: 'String' },
  { label: 'Drop down', value: 'JSON' },
  { label: 'Number', value: 'Number' },
  { label: 'Date', value: 'Date' },
  { label: 'User', value: 'User' },
  // { label: 'Tags', value: 'Tags' },
  // { label: 'Comments', value: 'Comments' }, // In future we need to add these association support
  // Add more options as needed
];


const DynamicForm = ({ control, watch }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });
  return (
    <>
      {fields.map((field, index) => {
        return (
          <div key={field.id} style={{ marginBottom: '10px' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name={`fields[${index}].keyName`}
                  render={(props) => (
                    <TextField
                      size="small"
                      type="text"
                      variant="outlined"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                      }}
                      label="Key"
                      placeholder="Key"
                      fullWidth
                      defaultValue=""
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Controller
                  control={control}
                  name={`fields[${index}].keyType`}
                  render={(props) => (
                    <TextField
                      select
                      size="small"
                      type="text"
                      variant="outlined"
                      value={props.value}
                      inputRef={props.ref}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        props.onChange(e.target.value);
                      }}
                      label="Key type"
                      placeholder="Key type"
                      fullWidth
                      defaultValue=""
                    >
                      {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              {fields.length > 1 && (
                <Grid item xs={2}>
                  <IconButton size="small" onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </div>
        );
      })}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => append({ keyName: '', keyType: '' })}
      >
        Add Field
      </Button>
    </>
  );
};
export default DynamicForm;
