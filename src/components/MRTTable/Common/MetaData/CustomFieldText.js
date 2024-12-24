import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(theme => ({}));

const CustomFieldText = ({ value, onCustomKeyChange }) => {
	const classes = useStyles();
	const [previousValue, setPreviousValue] = useState(value ? value : '');
	const [inputValue, setInputValue] = useState(value ? value : '');

	useEffect(() => {
		setInputValue(value ? value : '');
		setPreviousValue(value ? value : '');
	}, [value]);

	return (
		<div style={{ maxWidth: '200px', padding: ' 0px 5px' }} onClick={e => e.stopPropagation()}>
			{inputValue && (
				<div
					style={{
						fontSize: '16px',
						visibility: 'hidden',
						marginBottom: '-24px',
					}}
				>
					{inputValue}
				</div>
			)}
			<TextField
				key={'fieldContentInput'}
				id={'fieldContentInput'}
				className={classes.textField}
				variant="standard"
				size="small"
				autoComplete="nope"
				placeholder="N/A"
				fullWidth
				label={null}
				value={inputValue}
				onChange={e => {
					e.persist();
					setInputValue(e.target.value);
				}}
				onKeyDown={event => {
					event.stopPropagation();
					if (event.key === 'Enter') {
						event.preventDefault();
						onCustomKeyChange(inputValue);
						setPreviousValue(inputValue);
					}
					if (event.key === 'Escape') {
						// onCustomKeyChange(previousValue)
						setInputValue(previousValue);
					}
				}}
				onBlur={() => {
					// onCustomKeyChange(previousValue)
					setInputValue(previousValue);
				}}
				InputProps={{
					disableUnderline: true,
				}}
			/>
		</div>
	);
};

export default CustomFieldText;
