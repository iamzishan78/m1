import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { validateUrl } from 'utils/helper';
import LinkPopup from '../Popups/Link';

const useStyles = makeStyles(() => ({
	tooltipContainer: {
		position: 'relative',
	},
	linkTooltip: {
		position: 'absolute',
		top: '-30px', // Adjust to position above the TextField
		left: '0',
		backgroundColor: '#fff',
		border: '1px solid #ccc',
		padding: '8px',
		borderRadius: '4px',
		zIndex: 1,
		boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
		overflowWrap: 'anywhere',
	},
}));

const CustomTextField = ({
	value,
	defaultValue,
	id,
	field,
	fieldKey,
	index,
	onChange,
	InputProps,
	props,
	offClickHandler,
	showLinkPopup,
}) => {
	const classes = useStyles();
	const [fieldValue, setFieldValue] = useState(value || defaultValue || '');
	const [showTooltip, setShowTooltip] = useState(false);

	useEffect(() => {
		setFieldValue(value || defaultValue || '');
	}, [value, defaultValue]);

	const handleChange = e => {
		const val = e.target.value;
		setFieldValue(val);
		onChange?.(e, val);
	};

	const handleMouseEnter = () => {
		if (validateUrl(fieldValue)) {
			setShowTooltip(true);
		}
	};

	const handleClickAway = () => {
		setShowTooltip(false);
	};

	const handleLinkClick = e => {
		e.stopPropagation();
		setShowTooltip(false);
	};

	const isUrlValid = validateUrl(fieldValue);

	return (
		<div className={classes.tooltipContainer} key={id}>
			<TextField
				id={id}
				variant="outlined"
				margin="dense"
				type="text"
				fullWidth
				value={fieldValue}
				InputProps={InputProps}
				InputLabelProps={{ shrink: true }}
				onBlur={() => offClickHandler(fieldKey, fieldValue)}
				onChange={handleChange}
				disabled={field?.disabled}
				onMouseEnter={handleMouseEnter}
				{...props}
			/>

			{showLinkPopup && showTooltip && isUrlValid && (
				<LinkPopup
					id={id}
					url={fieldValue}
					onClickAway={handleClickAway}
					onLinkClick={handleLinkClick}
					maxLength={40}
					className={classes.linkTooltip}
				/>
			)}
		</div>
	);
};

export default CustomTextField;
