import React, { memo, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

const CreateUpdateRecordInRunTimeModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  tableName,
}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      const key = column.accessorKey ?? column.id ?? '';
      if (key) {
        acc[key] = '';
      }
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center"> {`Create New ${tableName}`}</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.id}
                label={column.header}
                name={column.id}
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          {`Create New ${tableName}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(CreateUpdateRecordInRunTimeModal);
