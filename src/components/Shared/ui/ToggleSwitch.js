import { FormControlLabel, FormGroup, Switch, withStyles } from '@material-ui/core';
import React, { useState } from 'react';

const AntSwitch = withStyles(theme => ({
	root: {
		width: 28,
		height: 16,
		padding: 0,
		marginLeft: 4,
		display: 'flex',
	},
	switchBase: {
		padding: 2,
		color: theme.palette.grey[500],
		'&$checked': {
			transform: 'translateX(12px)',
			color: theme.palette.common.white,
			'& + $track': {
				opacity: 1,
				backgroundColor: '#12ABE0',
				borderColor: '#12ABE0',
			},
		},
	},
	thumb: {
		width: 12,
		height: 12,
		boxShadow: 'none',
	},
	track: {
		borderRadius: 16 / 2,
		opacity: 1,
		backgroundColor: theme.palette.common.white,
	},
	checked: {},
}))(Switch);

const ToggleSwitch = ({
	label,
	initialValue = false,
	onChange,
	labelPlacement = 'start',
	customSwitchStyle = {},
	customLabelStyle = {},
	customContainerStyle = {},
}) => {
	const [isChecked, setIsChecked] = useState(initialValue);

	const handleToggle = () => {
		const newValue = !isChecked;
		setIsChecked(newValue);
		if (onChange) {
			onChange(newValue);
		}
	};

	return (
		<FormGroup style={customContainerStyle}>
			<FormControlLabel
				control={
					<AntSwitch checked={isChecked} onChange={handleToggle} name="toggleSwitch" style={customSwitchStyle} />
				}
				label={label}
				labelPlacement={labelPlacement}
				style={customLabelStyle}
			/>
		</FormGroup>
	);
};

export default ToggleSwitch;
