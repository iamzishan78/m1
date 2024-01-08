import { Typography } from '@mui/material';
import MRTTable from 'components/MRTTable';
import React from 'react';

const Result = ({ indices }) => {
  if (!indices || indices.length === 0)
    return (
      <Typography align="center" variant="h5">
        Select an index to start searching.
      </Typography>
    );

  return (
    <MRTTable
      name="GenericTable"
      overrideMeta={{
        esIndex: indices.join(','),
      }}
    />
  );
};

export default Result;
