
import React, { useEffect, useState } from "react";
import { Grid, TextField, Autocomplete } from '@mui/material';
import { Controller } from "react-hook-form";
import { useApolloClient } from '@apollo/client';

function AutoCompleteComponent({ control, item }) {
  const {
    name,
    label,
    defaultOptions = [],
    variables,
    query,
    getOptions
  } = item;

  const client = useApolloClient();
  const [options, setOptions] = useState(defaultOptions);

  const callQuery = async () => {
    if (query) {
      const res = await client.query({
        variables,
        query,
      });
      let filterData = getOptions(res)
      for (let i = 0; i < defaultOptions.length; i++) {
        filterData = filterData.filter(
          (d) =>
            d !== defaultOptions[i].value &&
            d !== defaultOptions[i].label
        );
      }
      for (let i = 0; i < defaultOptions.length; i++) {
        filterData.push(defaultOptions[i].label);
      }

      filterData = filterData.map(item => {
        if (typeof item === 'string') {
          return { label: item.trim(), value: item.trim() };
        } else {
          return item;
        }
      });

      const alreadyInLabelValueForm = filterData.every(item => typeof item === 'object' && 'label' in item && 'value' in item);
      filterData = alreadyInLabelValueForm ? filterData : filterData.map(item => ({
        label: item,
        value: item
      }));

      setOptions(filterData);
    }
  }

  useEffect(() => {
    callQuery()
  }, [])

  useEffect(() => {
    setOptions(defaultOptions)
  }, [item])

  return (
    <Grid item xs={12}>
      <h3>{label}</h3>

      <Controller
        control={control}
        name={name}
        render={props => {
          return (
            <Autocomplete
              options={options}
              getOptionLabel={option => option.label}
              getOptionSelected={(option, value) => option.value === value}
              value={{ label: props.value || '', value: props.value || '' }}
              onChange={(e, option) => {
                props.onChange(option ? option?.value : null)

              }}
              renderInput={params => (
                <TextField {...params} size="small" multiline variant="standard" />
              )}
            />
          )
        }}
      />
    </Grid>
  );
}

export default AutoCompleteComponent