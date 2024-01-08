import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
// import JSONInput from 'react-json-editor-ajrm';
// import locale from 'react-json-editor-ajrm/locale/en';

import IndexAutoCompleteFilter from './IndexAutoCompleteFilter';
import Result from './Result';

// const placeholderJSON = {
//   query: {
//     query_string: {
//       query: '*',
//     },
//   },
//   size: 10,
//   from: 0,
//   sort: [],
// };

const AdvancedSearch = () => {
  const [indices, setIndices] = useState([]);

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
            defaultValue="*"
          />

          <IndexAutoCompleteFilter
            sx={{ width: '35%' }}
            multiple
            value={indices}
            setValue={setIndices}
          />
        </Box>

        <Box>
          {/* <JSONInput
            id="a_unique_id"
            placeholder={placeholderJSON}
            // colors={darktheme}
            locale={locale}
            height="550px"
          /> */}
        </Box>
      </Box>

      <Box sx={{
        margin: '5rem'
      }}>
        <Result indices={indices} />
      </Box>
    </Box>
  );
};

export default AdvancedSearch;
