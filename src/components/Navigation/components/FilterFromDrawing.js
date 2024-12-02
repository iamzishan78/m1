import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { default as DrawPoly } from '../../Shared/svgIcons/polygon';
import { default as Rect } from '../../Shared/svgIcons/rectangle';
import { FormLabel } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CancelIcon from '@material-ui/icons/Cancel';
import { DRAWING_MODES } from '../NavigationContext';
import { navController } from 'hookstate/navStateController';

const useStyles = makeStyles(theme => ({
	formControl: {
		padding: '15px',
		minWidth: 249,
		// maxWidth: 250,
		color: 'black',
		border: '1px solid #C4C4C4',
		borderRadius: '4px',
		'&:hover': {
			border: '1px solid black',
		},
	},
	buttonEnabled: {
		color: '#17AADD',
	},
	buttonDisabled: {
		color: 'gray',
	},
	closeButton: {
		float: 'right',
	},
}));

export default function FilterFromDrawing(props) {
	const classes = useStyles();
	const { navStateValues } = navController.useState(['filterFeatureId'], 'navStateValues');

	const handleDrawPolygon = (event, e) => {
		let id = DRAWING_MODES.DRAW_POLYGON + Date.now();
		navController.updateState({ drawingMode: DRAWING_MODES.DRAW_POLYGON, filterFeatureId: id });
	};

	const handleDrawRect = (event, e) => {
		let id = DRAWING_MODES.DRAW_RECTANGLE + Date.now();
		navController.updateState({ drawingMode: DRAWING_MODES.DRAW_RECTANGLE, filterFeatureId: id });
	};

	const handleDrawCircle = (event, e) => {
		let id = DRAWING_MODES.DRAW_CIRCLE + Date.now();
		navController.updateState({ drawingMode: DRAWING_MODES.DRAW_CIRCLE, filterFeatureId: id });
	};

	const handleRemoveFilter = (event, e) => {
		window.drawRef?.changeMode('simple_select');
		navController.updateState({ drawingMode: null, filterFeatureId: null, filterDrawing: [] });
	};

	return (
		<div className={classes.formControl}>
			<FormLabel> Filter by Shape: </FormLabel>
			<IconButton
				className={
					navStateValues.filterFeatureId && navStateValues.filterFeatureId.includes('draw_polygon')
						? classes.buttonEnabled
						: classes.buttonDisabled
				}
				onClick={handleDrawPolygon}
				aria-label="draw-polygon"
			>
				<DrawPoly height={'30px'} />
			</IconButton>
			<IconButton
				className={
					navStateValues.filterFeatureId && navStateValues.filterFeatureId.includes('drag_circle')
						? classes.buttonEnabled
						: classes.buttonDisabled
				}
				onClick={handleDrawCircle}
				aria-label="draw-circle"
			>
				<RadioButtonUncheckedIcon />
			</IconButton>
			<IconButton
				className={
					navStateValues.filterFeatureId && navStateValues.filterFeatureId.includes('draw_rectangle')
						? classes.buttonEnabled
						: classes.buttonDisabled
				}
				onClick={handleDrawRect}
				aria-label="draw-rectangle"
			>
				<Rect height={'30px'} />
			</IconButton>
			<IconButton className={classes.closeButton} onClick={handleRemoveFilter} aria-label="draw-rectangle">
				<CancelIcon height={'30px'} />
			</IconButton>
		</div>
	);
}
