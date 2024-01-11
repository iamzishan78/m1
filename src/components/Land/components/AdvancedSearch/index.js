import React, { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';

import IndexAutoCompleteFilter from './IndexAutoCompleteFilter';
import Result from './Result';
import { tableGlobalController } from 'hookstate/tableController';

const AdvancedSearch = () => {
  const [indices, setIndices] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    tableGlobalController.reInitialized();
  }, [indices]);

  return (
    <Box
      sx={{
        marginTop: '5rem',
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <TextField
            sx={{ width: '50%' }}
            id="search"
            label="Search"
            variant="standard"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <IndexAutoCompleteFilter
            sx={{ width: '35%' }}
            multiple
            value={indices}
            setValue={setIndices}
          />
        </Box>
      </Box>

      <Box
        sx={{
          margin: '5rem',
        }}
      >
        <Result indices={indices} search={search} setSearch={setSearch} />
      </Box>
    </Box>
  );
};

export default AdvancedSearch;
