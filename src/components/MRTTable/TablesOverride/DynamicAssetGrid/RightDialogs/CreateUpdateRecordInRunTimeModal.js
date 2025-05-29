import React, { memo, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';

import PropTypes from 'prop-types';

const CreateUpdateRecordInRunTimeModal = ({ open, columns, onClose, onSubmit, name }) => {
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
			<DialogTitle textAlign="center"> {`Create New ${name}`}</DialogTitle>
			<DialogContent>
				<form onSubmit={e => e.preventDefault()}>
					<Stack
						sx={{
							width: '100%',
							minWidth: { xs: '300px', sm: '360px', md: '400px' },
							gap: '1.5rem',
						}}
					>
						{columns.map(column => (
							<TextField
								key={column.id}
								label={column.header}
								name={column.id}
								onChange={e => {
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
					{`Create New ${name}`}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

CreateUpdateRecordInRunTimeModal.propTypes = {
	open: PropTypes.bool.isRequired,
	columns: PropTypes.arrayOf(PropTypes.object).isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
};

export default memo(CreateUpdateRecordInRunTimeModal);
