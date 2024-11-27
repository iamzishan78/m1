import { Typography } from '@mui/material';
import MRTTable from 'components/MRTTable';
import { tableController } from 'hookstate/tableController';
import { debounce } from 'lodash';
import React, { useEffect } from 'react';

const tableKey = 'GenericTable';

const handleChange = debounce(value => {
  if (!value || value === '') {
    tableController(tableKey).setAdvanceSearch([], { globalFilter: '' });
    return;
  }

  // Sending globalFilter in AdvanceSearch
  tableController(tableKey).setAdvanceSearch(
    [
      { globalFilter: value }
    ],
    { globalFilter: value }
  );
}, 1000);

const Result = ({ indices, search, setSearch }) => {
  const { globalFilter, stateValues } = tableController(tableKey).useState([
    'globalFilter',
  ]);

  useEffect(() => {
    handleChange(search);
  }, [search]);

  useEffect(() => {
    setSearch(stateValues.globalFilter);
  }, [globalFilter]);

  if (!indices || indices.length === 0)
    return (
      <Typography align="center" variant="h5">
        Select an index to start searching.
      </Typography>
    );

  return (
    <MRTTable
      name={'GenericTable'}
      overrideMeta={{
        esIndex: indices.join(','),
      }}
    />
  );
};

export default Result;
