import React, { useEffect, useState } from 'react';


import { Grid, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';
import { SHAPE_LAYER_SEARCH } from 'graphQL/useQueryShapeTypeSearch';

const AutoCompleteShapeLayer = ({ value, shapeType, setSelectedShapeLayer }) => {
	const [layerList, setLayerList] = useState([]);
	const [search, setSearch] = useState('');

	const [shapeLayerQuery, { data: layersDate }] = useLazyQuery(SHAPE_LAYER_SEARCH);

	const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER, {
		onCompleted: () => {
			if (dataCustomLayer?.customLayer) {
				const layer = JSON.parse(JSON.stringify(dataCustomLayer?.customLayer));
				layer.shapeJson = layer.shapeJson ? layer.shapeJson : JSON.parse(layer.shape);
				setSelectedShapeLayer(layer);
			}
		},
	});

	useEffect(() => {
		shapeLayerQuery({ variables: { shapeType, search } });
	}, [search]);

	useEffect(() => {
		if (layersDate && layersDate[Object.keys(layersDate)[0]]) {
			setLayerList(layersDate[Object.keys(layersDate)[0]]);
		}
	}, [layersDate]);

	const handleChange = ({ value }) => {
		if (value?._id) {
			getCustomLayer({
				variables: { id: value._id },
			});
		} else {
			setSelectedShapeLayer(value ? value : { clear: true });
		}
	};

	const renderOptionComp = ({ option }) => (
		<Grid container spacing={0}>
			<Grid container item xs={12} alignItems="center">
				<Grid item xs>
					<span style={{ fontWeight: 400 }}>{option.name}</span>
					<Typography variant="body2" color="textSecondary">
						{option.county ? `${option.county},` : ''} {option.state}
					</Typography>
				</Grid>
			</Grid>
		</Grid>
	);

	return (
		<CustomAutoComplete
			fieldAttributes={{
				name: 'shapeLayer',
				value,
				defaultOptions: layerList || [],
			}}
			fieldConfig={{
				variant: 'outlined',
				margin: 'dense',
				size: 'small',
				renderOptionComp,
				textFieldInputProps: {
					startAdornment: <SearchIcon />,
				},
				textfieldRestProps: {
					fullWidth: true,
					autoFocus: true,
				},
			}}
			fieldEvents={{
				onChange: handleChange,
				onTextFieldChange: value => setSearch(value),
			}}
		/>
	);
};

AutoCompleteShapeLayer.propTypes = {
	value: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		county: PropTypes.string,
		state: PropTypes.string,
	}),
	shapeType: PropTypes.string.isRequired,
	setSelectedShapeLayer: PropTypes.func.isRequired,
};

export default AutoCompleteShapeLayer;
