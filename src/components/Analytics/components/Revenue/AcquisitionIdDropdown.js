import { useApolloClient } from '@apollo/client';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  makeStyles,
} from '@material-ui/core';
import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(theme => ({
  actionBar: ({ isBackground, noPadding }) => ({
    padding: noPadding ? 0 : '10px 40px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: isBackground ? '#f7f7f7' : 'transparent',
    width: '100%',
    minHeight: '65px',

    '& .MuiSelect-select:focus, & .MuiOutlinedInput-root': {
      backgroundColor: '#ffff',
    },
    '& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)': {
      borderColor: '#ffff',
    },
  }),
  textField: {
    height: '100%',
    width: '100%',
    '& .MuiFormHelperText-contained': {
      justifyContent: 'flex-end',
      display: 'flex',
    },
  },
  viewSwitcher: ({ isShrink }) => ({
    // margin: theme.spacing(1),
    height: isShrink ? '40px' : '100%',
  }),
}));

const AcquisitionIdDropdown = ({
  isBackground = false,
  isShrink = true,
  noPadding = true,
  strechedWidth = true,
  fullWidth = false,
  esFilters,
  setESFilters,
}) => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState('All Acquisitions');

  const client = useApolloClient();

  const classes = useStyles({ isBackground, isShrink, noPadding });

  useEffect(() => {
    (async () => {
      const filters = esFilters.filter(
        filter => !['acquisitionID.keyword'].includes(filter.field)
      );

      const acquisitionResult = await client.query({
        query: GET_ES_SIMPLE_FILTER,
        variables: {
          esIndex: 'properties_flat',
          index: 'properties_flat',
          filters,
          filterKey: 'acquisitionID.keyword',
          search: {
            query: '',
            fields: ['name^4', '_all'],
          },
          extendSearchQuery: '',
          size: 10,
          filterAggs: {
            query: '',
            field: 'acquisitionID.keyword',
            size: 100000,
          },
        },
      });

      setOptions(acquisitionResult?.data?.getESSimpleFilter?.hits);
    })();
  }, [client, esFilters]);

  return (
    <Grid
      container
      direction="row"
      display="flex"
      justify="space-between"
      className={classes.actionBar}
    >
      <Grid
        item
        xs={strechedWidth ? true : fullWidth ? 7 : 3}
        md={strechedWidth ? true : fullWidth ? 7 : 3}
      >
        <FormControl variant="outlined" fullWidth className={classes.formControl}>
          <InputLabel id="select-outlined-label">Acquisitions</InputLabel>
          <Select
            labelId="select-outlined-label"
            id="select-outlined"
            label="Acquisitions"
            value={value}
            fullWidth
            className={classes.viewSwitcher}
            onChange={e => {
              setValue(e.target.value);
              if (e.target.value === 'All Acquisitions') {
                setESFilters(
                  esFilters.filter(
                    filter => !['acquisitionID.keyword'].includes(filter.field)
                  )
                );
              } else {
                setESFilters([
                  ...esFilters.filter(
                    filter => !['acquisitionID.keyword'].includes(filter.field)
                  ),
                  { field: 'acquisitionID.keyword', value: e.target.value },
                ]);
              }
            }}
          >
            <MenuItem value="All Acquisitions">All Acquisitions</MenuItem>
            {options.map(option => (
              <MenuItem value={option.key}>{option.key}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default AcquisitionIdDropdown;
