import { useLazyQuery } from '@apollo/client';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import { generateFileFilters } from 'components/Map/DeckGL/helpers/common';
import { generateRandomColor } from 'components/MapControls/commonHelper';

import { GET_ES_SIMPLE_FILTER } from 'graphQL/useQueryESSimpleFilter';

import { getLayerKey } from 'hookstate/helpers';

import { ColorPickerStyledBox } from '../Common';
import { colorBasedAttributes } from './ColorBasedAttributes';

// Styles for AttrsValuesDropdown
const useStyles = makeStyles(() => ({
	dropdownContainer: {
		width: '485px',
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
}));

const AttrsValuesDropdown = ({
	selectedValue,
	selectedLayer,
	setFillColor,
	fillColor,
	attributeBasedColors,
	setAttributeBasedColors,
}) => {
	const classes = useStyles();
	const [displayColorPicker, setDisplayColorPicker] = useState(false);

	// State for managing the clicked value and its color
	const [selectedOption, setSelectedOption] = useState('');

	// Getting values against the summary field keys
	const [getFiltersList, { data: filtersData }] = useLazyQuery(GET_ES_SIMPLE_FILTER, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		let esIndex = selectedLayer.layerType === 'file layer' ? 'shapefile_flat' : 'shapes_flat';
		const layerType =
			colorBasedAttributes[getLayerKey(selectedLayer?.identifier, colorBasedAttributes)]?.layerKey?.toLowerCase();
		let filters = [];
		let search = { fields: [] };
		if (selectedLayer?.layerType === 'file layer') {
			filters = generateFileFilters({ fileLayer: selectedLayer }).variables.filters;
			search = generateFileFilters({ fileLayer: selectedLayer }).variables.search;
			search.fields = [];
		} else if (selectedLayer?.identifier === 'My Wells') {
			esIndex = 'mywells_flat';
			filters = [];
		} else {
			filters = [
				layerType === 'agreement'
					? { field: 'shapeJson.properties.layerType', value: layerType }
					: { field: 'layer.keyword', value: layerType },
			];
		}

		getFiltersList({
			variables: {
				search,
				filterAggs: {
					field: selectedValue?.value,
					query: '',
					size: 10000,
				},
				esIndex,
				index: esIndex,
				filters,
				pagination: { first: 10000, after: null },
				size: 10,
			},
		});
	}, [selectedValue, getFiltersList, selectedLayer]);

	// Making dropdown options with colors
	const attroptions = useMemo(() => {
		if (!filtersData?.getESSimpleFilter?.hits || !selectedValue?.label) {
			return [];
		}
		const filterKeys = filtersData.getESSimpleFilter.hits
			.map(hit => hit?.key)
			.filter(key => key && key.toString().trim());

		filterKeys.unshift('');

		const options = filterKeys.map(key => {
			const isColorOverridden = (selectedOption?.label || selectedOption?.label === '') && selectedOption.label === key;
			const randomColor = attributeBasedColors?.[selectedValue.label]?.[key] || generateRandomColor();

			return {
				label: key,
				color: isColorOverridden ? fillColor : randomColor,
			};
		});

		setAttributeBasedColors(prevColors => ({
			...prevColors,
			[selectedValue.label]: options.reduce((acc, { label, color }) => {
				acc[label] = color;
				return acc;
			}, {}),
		}));

		return options;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filtersData, fillColor]);

	return (
		<>
			{selectedValue ? (
				<div className={classes.dropdownContainer}>
					<div id="color-dropdown" className={classes.dropdown}>
						<span>{selectedValue ? selectedValue['label'] : ''}</span>
						<span className={classes.arrowIcon} style={{ transform: 'rotate(180deg)' }}></span>
					</div>
					{attroptions?.length > 0 && (
						<ul className={classes.dropdownList}>
							{attroptions.map((option, index) => (
								<li
									key={index}
									className={classes.listItem}
									onClick={() => {
										setSelectedOption(option);
										setFillColor(option['color']);
										setDisplayColorPicker(!displayColorPicker);
									}}
									style={{
										backgroundColor: '#fff',
									}}
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
			) : (
				<TextField
					variant="outlined"
					fullWidth
					onClick={() => setDisplayColorPicker(!displayColorPicker)}
					InputProps={{
						className: classes.textFieldInput,
						startAdornment: (
							<div
								className={classes.startAdornmentBox}
								style={{ backgroundColor: fillColor?.css?.backgroundColor || fillColor }}
							/>
						),
					}}
				/>
			)}
			{displayColorPicker && (
				<Paper id="fill-picker-box">
					<ColorPickerStyledBox value={fillColor} onChange={color => setFillColor(color)} />
				</Paper>
			)}
		</>
	);
};

export default AttrsValuesDropdown;
