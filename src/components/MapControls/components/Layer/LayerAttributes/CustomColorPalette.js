import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';

import { Box, TextField } from '@mui/material';

import PropTypes from 'prop-types';

// Helper function to convert hex to RGB array
const hexToRgb = hex => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
};

// Helper function to convert RGB array to hex
const rgbToHex = rgb => {
	return (
		'#' +
		rgb
			.map(x => {
				const hex = x.toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			})
			.join('')
	);
};

// Add this helper function at the top with other helpers
const interpolateColors = (colors, steps) => {
	const result = [];
	const stepFactor = 1 / (steps - 1);

	for (let i = 0; i < steps; i++) {
		const t = i * stepFactor;
		const colorIndex = t * (colors.length - 1);
		const start = Math.floor(colorIndex);
		const end = Math.min(start + 1, colors.length - 1);
		const ratio = colorIndex - start;

		const startColor = hexToRgb(colors[start]);
		const endColor = hexToRgb(colors[end]);

		const interpolated = startColor.map((channel, j) => Math.round(channel * (1 - ratio) + endColor[j] * ratio));

		result.push(rgbToHex(interpolated));
	}
	return result;
};

const CustomColorPalette = ({ selectedPalette, setSelectedPalette, steps, setSteps }) => {
	// Convert initial RGB arrays to hex for ChromePicker
	const initialColors = selectedPalette?.length
		? selectedPalette.slice(0, steps).map(rgb => rgbToHex(rgb))
		: Array(steps)
				.fill()
				.map((_, i) => (i === 0 ? '#ff0000' : i === steps - 1 ? '#00ff00' : '#ffffff'));

	const [colors, setColors] = useState(initialColors);
	const [selectedColorIndex, setSelectedColorIndex] = useState(null);

	useEffect(() => {
		console.log('use effect', colors);

		if (colors.length >= 2) {
			const rgbColors = colors.map(hexToRgb);
			setSelectedPalette(rgbColors);
		}
	}, [colors]);

	const handleColorChange = color => {
		if (selectedColorIndex !== null) {
			const newColors = [...colors];
			newColors[selectedColorIndex] = color.hex;
			setColors(newColors);
		}
	};

	const interpolatedColors = interpolateColors(colors, steps);

	return (
		<Box>
			<Box display="flex" alignItems="center" mb={2}>
				<TextField
					label="Steps"
					type="number"
					value={steps}
					onChange={e => {
						const value = parseInt(e.target.value);
						if (!isNaN(value) && value >= 2 && value <= 10) {
							setSteps(value);
						}
					}}
					inputProps={{
						min: 2,
						max: 10,
						inputMode: 'numeric',
					}}
					size="small"
					style={{ width: 100 }}
				/>
			</Box>

			<Box display="flex" flexWrap="wrap" gap={1}>
				<Box
					display="flex"
					width="100%"
					gap={1}
					sx={{
						border: '1px solid #ccc',
						borderRadius: 1,
						p: 1,
					}}
				>
					{interpolatedColors.map(color => (
						<Box
							key={color} // Using the color value as key since it's unique in this context
							width={40}
							height={40}
							bgcolor={color}
							borderRadius={1}
							onClick={() => setSelectedColorIndex(interpolatedColors.indexOf(color))}
							style={{ cursor: 'pointer' }}
						/>
					))}
				</Box>
			</Box>

			{selectedColorIndex !== null && (
				<Box mt={2}>
					<ChromePicker
						color={colors[selectedColorIndex] || interpolatedColors[selectedColorIndex]}
						onChange={handleColorChange}
						disableAlpha
					/>
				</Box>
			)}
		</Box>
	);
};

CustomColorPalette.propTypes = {
	selectedPalette: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
	setSelectedPalette: PropTypes.func.isRequired,
	steps: PropTypes.number,
	setSteps: PropTypes.func.isRequired,
};

CustomColorPalette.defaultProps = {
	selectedPalette: [],
	steps: 5,
};

export default CustomColorPalette;
