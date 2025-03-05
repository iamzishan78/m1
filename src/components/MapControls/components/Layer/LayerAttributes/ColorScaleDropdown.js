import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { layerStylingController } from 'controllers/layersStylingController';
import { layerController } from 'controllers/layerStateController';

// Styles for AttrsValuesDropdown
const useStyles = makeStyles(() => ({
	dropdownContainer: {
		width: '475px',
		margin: '15px 0px 0px 0px',
		position: 'relative',
		fontFamily: 'Arial, sans-serif',
	},
	dropdown: {
		border: '1px solid #ccc',
		padding: '12px',
		borderRadius: '4px',
		cursor: 'pointer',
		backgroundColor: '#fff',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	arrowIcon: {
		display: 'inline-block',
		width: '0',
		height: '0',
		marginLeft: '5px',
		verticalAlign: 'middle',
		borderLeft: '5.5px solid transparent',
		borderRight: '5.5px solid transparent',
		borderTop: '5.5px solid black',
		transition: 'transform 0.2s ease',
	},
	dropdownList: {
		listStyleType: 'none',
		margin: '8px 0 0 0',
		padding: '0',
		border: '1px solid #ccc',
		borderRadius: '4px',
		maxHeight: '200px',
		overflowY: 'auto',
		backgroundColor: '#fff',
	},
	listItem: {
		padding: '12px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		cursor: 'pointer',
		backgroundColor: '#fff',
	},
	colorBox: {
		width: '60px',
		height: '30px',
		border: '1px solid #ccc',
	},
	textFieldInput: {
		height: '50px',
		cursor: 'pointer',
		marginTop: '10px',
	},
	startAdornmentBox: {
		width: '100px',
		height: '30px',
		border: '1px solid #ccc',
		marginRight: '8px',
	},
	highlighted: {
		backgroundColor: '#e0e0e0', // Highlight color
	},
}));

const ColorScaleDropdown = () => {
	const classes = useStyles();
	const [displayDropdown, setDisplayDropdown] = useState(false);
	// const [displayColorPicker, setDisplayColorPicker] = useState(false);

	// State for managing the clicked value and its color
	const [selectedOption] = useState('');

	const attroptions = (layerController.getValue('bins') || []).map((key, index) => {
		const hexColors = layerStylingController
			.getValue('selectedPalette')
			.map(rgb => `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`);

		const randomColor = hexColors[index];

		return {
			label: key,
			color: randomColor,
		};
	});

	return (
		<>
			<div className={classes.dropdownContainer}>
				<div id="color-dropdown" className={classes.dropdown} onClick={() => setDisplayDropdown(prev => !prev)}>
					<span>{'quantize'}</span>
					<span
						className={classes.arrowIcon}
						style={{ transform: displayDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
					></span>
				</div>
				{displayDropdown && attroptions?.length > 0 && (
					<ul className={classes.dropdownList}>
						{attroptions.map(option => (
							<li
								key={option?.label}
								className={`${classes.listItem} ${selectedOption?.label === option.label ? classes.highlighted : ''}`}
								// onClick={() => {
								//     setSelectedOption(option);
								//     setFillColor(option['color']);
								//     setDisplayColorPicker(!displayColorPicker);
								// }}
							>
								<span>{option['label'] === '' ? '(Blank)' : option['label']}</span>
								<span
									className={classes.colorBox}
									style={{ backgroundColor: option?.color?.hex ? `#${option.color.hex}` : option.color }}
								></span>
							</li>
						))}
					</ul>
				)}
			</div>
			{/* {displayColorPicker && (
                <Paper id="fill-picker-box">
                    <ColorPickerStyledBox value={fillColor} onChange={color => setFillColor(color)} />
                </Paper>
            )} */}
		</>
	);
};

export default ColorScaleDropdown;
