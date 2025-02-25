import React, { useEffect, useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Autocomplete, TextField } from '@mui/material';

import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

import { generateFileFilters } from 'components/Map/DeckGL/helpers/common';

import { getLayerKey } from 'controllers/helpers';

import { GET_DB_FILTERS } from 'graphQL/useQueryDbQuery';

import { colorBasedAttributes } from './ColorBasedAttributes';
import { styleImageMap } from '../Common';

const useStyles = makeStyles(() => ({
	dropdownContainer: {
		width: '485px',
		fontFamily: 'Arial, sans-serif',
		position: 'relative',
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
	fillBox: {
		width: '24px',
		height: '30px',
		border: 'none',
		textAlign: 'center',
		lineHeight: '30px',
		backgroundColor: 'transparent',
		overflow: 'hidden',
	},
	textFieldInput: {
		height: '50px',
		cursor: 'pointer',
		marginTop: '10px',
	},
	highlighted: {
		backgroundColor: '#e0e0e0', // Highlight color
	},
}));

const AttrsFillStyleDropdown = ({
	dropDownOptions,
	selectedValue,
	selectedLayer,
	setFillStyle,
	fillStyle,
	attributeBasedStyles,
	setAttributeBasedStyles,
}) => {
	const classes = useStyles();
	const [displayDropdown, setDisplayDropdown] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);
	const [getFiltersList, { data: filtersData }] = useLazyQuery(GET_DB_FILTERS, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		if (!selectedValue) {
			return;
		}

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

	const attroptions = useMemo(() => {
		if (!filtersData?.getDbFilters?.hits || !selectedValue?.label) {
			return [];
		}
		const filterKeys = filtersData.getDbFilters.hits.map(hit => hit?.key).filter(key => key && key.toString().trim());
		filterKeys.unshift('');

		const options = filterKeys.map(key => {
			const isStyleOverridden = (selectedOption?.label || selectedOption?.label === '') && selectedOption.label === key;
			const randomStyle =
				attributeBasedStyles?.[selectedValue.label]?.[key] ||
				dropDownOptions[Math.floor(Math.random() * dropDownOptions.length)];

			return {
				label: key,
				style: isStyleOverridden ? fillStyle : randomStyle,
			};
		});

		setAttributeBasedStyles({
			[selectedValue.label]: options.reduce((acc, { label, style }) => {
				acc[label] = style;
				return acc;
			}, {}),
		});

		return options;
	}, [filtersData, fillStyle]);

	return (
		<>
			{selectedValue ? (
				<div className={classes.dropdownContainer}>
					<div className={classes.dropdown} onClick={() => setDisplayDropdown(prev => !prev)}>
						<span>{selectedValue ? selectedValue['label'] : ''}</span>
						<span
							className={classes.arrowIcon}
							style={{
								transform: displayDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
							}}
						></span>
					</div>
					{displayDropdown && attroptions?.length > 0 && (
						<ul className={classes.dropdownList}>
							{attroptions.map(option => (
								<li
									key={option?.label}
									className={`${classes.listItem} ${selectedOption?.label === option.label ? classes.highlighted : ''}`}
									onClick={() => {
										setSelectedOption(option);
										setFillStyle(option['style']);
										setDisplayDropdown(true);
									}}
								>
									<span>{option['label'] === '' ? '(Blank)' : option['label']}</span>
									<div className={classes.fillBox}>
										<img
											src={styleImageMap[option.style]}
											alt={option.label || 'Style'}
											style={{ width: '100%', height: '100%', objectFit: 'contain' }}
										/>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			) : null}

			{!selectedValue || displayDropdown ? (
				<Autocomplete
					options={dropDownOptions}
					value={fillStyle || ''}
					onChange={(event, newValue) => {
						setFillStyle(newValue);
					}}
					renderInput={params => <TextField {...params} variant="outlined" fullWidth placeholder="Select Fill Style" />}
					renderOption={(props, option) => (
						<li {...props} style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
							<img
								src={styleImageMap[option]} // Map the style to the image URL
								alt={option}
								style={{ width: '24px', height: '30px', objectFit: 'contain', marginRight: '10px' }}
							/>
							<span>{option}</span> {/* Optional: Display label alongside the image */}
						</li>
					)}
					getOptionLabel={option => option}
				/>
			) : null}
		</>
	);
};

AttrsFillStyleDropdown.propTypes = {
	dropDownOptions: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			value: PropTypes.any.isRequired,
		})
	).isRequired,
	selectedValue: PropTypes.shape({
		label: PropTypes.string,
		value: PropTypes.any,
	}),
	selectedLayer: PropTypes.shape({
		layerType: PropTypes.string,
		identifier: PropTypes.string,
	}),
	setFillStyle: PropTypes.func.isRequired,
	fillStyle: PropTypes.string,
	attributeBasedStyles: PropTypes.object,
	setAttributeBasedStyles: PropTypes.func,
};

export default AttrsFillStyleDropdown;
