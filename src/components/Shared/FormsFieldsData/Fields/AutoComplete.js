
import React, { useEffect, useState } from "react";
import { Grid, TextField, Autocomplete } from '@mui/material';
import { Controller } from "react-hook-form";
import { sideDialogController } from "hookstate/sideDialogController";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { useLazyQuery } from "@apollo/client";
import { ConnectingAirportsOutlined } from "@mui/icons-material";

function AutoCompleteComponent({ control, item }) {
  const {
    name,
    label,
    defaultOptions = [],
    esIndex,
    filterKey
  } = item;

  const [options, setOptions] = useState(defaultOptions);

  const [getOptions, { data: filterOptions }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

  useEffect(() => {
    if (esIndex && filterKey)
      getOptions({
        variables: {
          esIndex,
          filterKey,
          size: 50,
        },
      });
  }, []);

  useEffect(() => {
    if (filterOptions?.getESFilterList?.hits) {
      let filterData = filterOptions.getESFilterList.hits.map(
        (hit) => hit.key
      );
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

      filterData = filterData.filter(item => item.trim())
      const alreadyInLabelValueForm = filterData.every(item => typeof item === 'object' && 'label' in item && 'value' in item);
      filterData = alreadyInLabelValueForm ? filterData : filterData.map(item => ({
        label: item,
        value: item
      }));

      setOptions(filterData);
    }
  }, [filterOptions]);

  return (
    <Grid item xs={12}>
      <h3>{label}</h3>

      <Controller
        control={control}
        name={name}
        render={props => (
          <Autocomplete
            options={options}
            getOptionLabel={option => option.label}
            getOptionSelected={(option, value) => option.value === value}
            value={props.value}
            onChange={e => {
              sideDialogController.updateState({ [item.name]: e.target.value })
              props.onChange(e)

            }}
            renderInput={params => (
              <TextField {...params} size="small" multiline variant="standard" />
            )}
          />
        )}
      />
    </Grid>
  );
}

export default AutoCompleteComponent