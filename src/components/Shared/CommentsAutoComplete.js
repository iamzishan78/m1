import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Autocomplete, TextField } from '@mui/material';

import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
	autocomplete: {
		flexShrink: '1',
		marginTop: '10px',
		marginRight: '-20px',
		paddingLeft: '10px',
	},
}));

const CommentsAutoComplete = ({ options, onChange, value }) => {
	const classes = useStyles();

	return (
		<div>
			<Autocomplete
				size="small"
				disableClearable
				className={classes.autocomplete}
				options={options}
				onChange={(e, option) => onChange(option.value)}
				value={value}
				getOptionLabel={option => option.label}
				getOptionSelected={(option, value) => option.value === value.value}
				renderInput={params => (
					<TextField
						{...params}
						size="small"
						margin="dense"
						variant="outlined"
						label="Type"
						InputLabelProps={{ shrink: true }}
					/>
				)}
			/>
		</div>
	);
};

CommentsAutoComplete.propTypes = { options: PropTypes.array, onChange: PropTypes.func, value: PropTypes.string };

export default CommentsAutoComplete;
