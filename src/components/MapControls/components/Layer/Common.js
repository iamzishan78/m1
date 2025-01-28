import React, { useState, useEffect } from 'react';

import { FormControl, Input, InputAdornment } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { set } from 'lodash';
import { ColorBox } from 'material-ui-color';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import { copy } from 'components/Shared/functions';

function trim(str) {
	return str.replace(/^\s+|\s+$/gm, '');
}

const TWO = 2;
const ALPHA_INDEX = 3;
const HEX_LENGTH = 16;
const ROUND = 255;
export function RGBAToHexA(rgba) {
	var inParts = rgba.substring(rgba.indexOf('(')).split(','),
		r = parseInt(trim(inParts[0].substring(1)), 10),
		g = parseInt(trim(inParts[1]), 10),
		b = parseInt(trim(inParts[TWO]), 10),
		a = parseFloat(trim(inParts[ALPHA_INDEX].substring(0, inParts[ALPHA_INDEX].length - 1))).toFixed(TWO);
	var outParts = [
		r.toString(HEX_LENGTH),
		g.toString(HEX_LENGTH),
		b.toString(HEX_LENGTH),
		Math.round(a * ROUND)
			.toString(HEX_LENGTH)
			.substring(0, TWO),
	];

	// Pad single-digit output values
	outParts.forEach((part, i) => {
		if (part.length === 1) {
			outParts[i] = '0' + part;
		}
	});

	return '#' + outParts.join('');
}

const FOUR = 4;
export const ifRgbaConvt = color => {
	if (color?.slice(0, FOUR) === 'rgba') {
		return RGBAToHexA(color);
	} else {
		return color;
	}
};

export const ColorPickerStyledBox = withStyles(() => ({
	root: {
		width: 'auto',
		'& .MuiBox-root': {
			width: 'auto',
			padding: '30px',
			'& .muicc-colorbox-hsvgradient': {
				width: '84%',
			},
			'& .muicc-colorbox-sliders': {
				width: 'auto',
			},
		},
	},
}))(ColorBox);

export const project = {
	layerId: 1,
	layerType: 1,
	layerName: 1,
	groupName: 1,
	groupId: 1,
	position: 1,
	layerSettings: 1,
	identifier: 1,
	layerCategory: 1,
};

export const useStyles = makeStyles(() => ({
	gridOnIcon: {
		color: '#7f7f80',
		borderRadius: '0px',
		'&:hover ': {
			borderRadius: '0px',
		},
	},
	fileName: {
		maxWidth: '464px',
	},
	slider: {
		width: '350px !important',
		color: 'purple', // Color of the slider
		'& .MuiSlider-thumb': {
			backgroundColor: 'purple', // Color of the thumb
		},
		'& .MuiSlider-track': {
			backgroundColor: 'purple', // Color of the track
		},
		'& .MuiSlider-rail': {
			backgroundColor: '#D1C4E9', // Color of the rail
		},
	},
	valueBox: {
		width: 90,
		marginLeft: 10,
	},
}));

export const WidthPicker = ({ width, setWidth, layerType }) => {
	return (
		<FormControl
			style={{
				display: 'flex',
				right: '0',
				marginLeft: layerType === 'line' ? '130px' : '105px',
				flexDirection: 'inherit',
				width: '130px',
				alignItems: 'center',
			}}
		>
			<p style={{ marginRight: '10px' }}>Width</p>
			<Input
				style={{ width: '70px' }}
				value={width}
				onChange={e => {
					if (e.target.value) {
						const MAX_WIDTH = 50;
						if (e.target.value >= 0 && e.target.value <= MAX_WIDTH) {
							setWidth(e.target.value);
						}
					} else {
						setWidth(null);
					}
				}}
				endAdornment={<InputAdornment position="end">Px</InputAdornment>}
				type="number"
			/>
		</FormControl>
	);
};
WidthPicker.propTypes = {
	width: PropTypes.number.isRequired,
	setWidth: PropTypes.func.isRequired,
	layerType: PropTypes.string.isRequired,
};

export const useLayerStyle = layer => {
	const layerType = layer.layerPaintProps[0]?.paintType;
	const initialLayerLabelVisibility = layer.layerPaintProps[0]?.labelProps?.visibility === 'none' ? 'none' : 'visible';
	const initialLayerClickable = layer.layerSettings?.interaction?.interactionDetail?.click;

	// Getting initiallayer fill and if it is not set setting it to true
	const initialLayerEnableFill = !(layer.layerSettings?.interaction?.interactionDetail?.enablefillColor === false);
	const initialLayerEnableStroke = !(layer.layerSettings?.interaction?.interactionDetail?.enableStrokeColor === false);
	const initialLayerAttributeBasedColors = layer.layerSettings?.attributeBasedColors || {};
	const initialLayerAttributeBasedStrokeColors = layer.layerSettings?.attributeBasedStrokeColors || {};
	const initialLayerSelectedAttribute = layer.layerSettings?.selectedAttribute || null;
	const initialLayerSelectedStrokeAttribute = layer.layerSettings?.selectedStrokeAttribute || null;
	const DEFAULT_STROKE_WIDTH = 20;
	const initialStrokeWidth = layer.layerPaintProps[0]?.paintProps?.strokeWidth || DEFAULT_STROKE_WIDTH;
	const initialFillColor =
		layerType === 'fill'
			? ifRgbaConvt(layer.layerPaintProps[0]?.paintProps['fill-color'])
			: layerType === 'line'
				? ifRgbaConvt(layer.layerPaintProps[0]?.paintProps['line-color'])
				: ifRgbaConvt(layer.layerPaintProps[0]?.paintProps['circle-color']);
	const initialStrokeColor =
		layerType === 'fill'
			? ifRgbaConvt(layer.layerPaintProps[0]?.paintProps['fill-outline-color'])
			: layerType === 'line'
				? undefined
				: ifRgbaConvt(layer.layerPaintProps[0]?.paintProps['circle-stroke-color']);

	let initialWidth;
	if (layerType === 'circle') {
		initialWidth = layer.layerPaintProps[0]?.paintProps['circle-stroke-width']
			? layer.layerPaintProps[0]?.paintProps['circle-stroke-width']
			: 0;
	}
	if (layerType === 'line') {
		initialWidth = layer.layerPaintProps[0]?.paintProps['line-width']
			? layer.layerPaintProps[0]?.paintProps['line-width']
			: 1;
	}

	const [width, setWidth] = useState(initialWidth);
	const [layerName, setLayerName] = useState();
	const [fillColor, setFillColor] = useState(initialFillColor);

	// Added state for enable layer fill
	const [enablefillColor, setEnableFillColor] = useState(initialLayerEnableFill);
	const [enableStrokeColor, setEnableStrokeColor] = useState(initialLayerEnableStroke);
	const [selectedValue, setSelectedValue] = useState(initialLayerSelectedAttribute);
	const [selectedStrokeValue, setSelectedStrokeValue] = useState(initialLayerSelectedStrokeAttribute);
	const [attributeBasedColors, setAttributeBasedColors] = useState(initialLayerAttributeBasedColors);
	const [attributeBasedStrokeColors, setAttributeBasedStrokeColors] = useState(initialLayerAttributeBasedStrokeColors);

	const [layerLabelVisibility, setLayerLabelVisibility] = useState(initialLayerLabelVisibility);
	const [layerClickability, setLayerClickability] = useState(initialLayerClickable);
	const [strokeColor, setStrokeColor] = useState(initialStrokeColor);
	const [strokeWidth, setStrokeWidth] = useState(initialWidth || initialStrokeWidth);

	// Resetting the fill and stroke color when selected value changes
	useEffect(() => {
		setFillColor(initialFillColor);
		setStrokeColor(initialStrokeColor);
	}, [selectedValue, selectedStrokeValue]);

	useEffect(() => {
		setWidth(initialWidth);
		setFillColor(initialFillColor);
		setStrokeColor(initialStrokeColor);
	}, [initialFillColor, initialStrokeColor, initialWidth, layer]);

	const handleLayerChange = () => {
		if (
			(layer &&
				((fillColor && fillColor.rgb && (fillColor.alpha || fillColor.alpha === 0)) ||
					(strokeColor && strokeColor.rgb && (strokeColor.alpha || strokeColor.alpha === 0)))) ||
			width ||
			layer.layerPaintProps[0]?.labelProps?.visibility !== layerLabelVisibility ||
			parseInt(layer.layerPaintProps[0]?.paintProps?.strokeWidth) !== parseInt(strokeWidth) ||
			layer.layerSettings?.interaction?.interactionDetail?.click !== layerClickability ||
			layer.layerSettings?.interaction?.interactionDetail?.enablefillColor !== enablefillColor ||
			layer.layerSettings?.interaction?.interactionDetail?.enableStrokeColor !== enableStrokeColor ||
			layer.layerSettings?.selectedAttribute?.label !== selectedValue?.label ||
			layer.layerSettings?.selectedStrokeAttribute?.label !== selectedStrokeValue?.label
		) {
			let currentLayer = { ...layer };
			let fColor;
			let fColorOp;
			let sColor;
			let sColorOp;

			if (fillColor && fillColor.rgb) {
				fColor =
					fillColor.rgb.length === ALPHA_INDEX
						? 'rgb(' + fillColor.rgb.join() + ')'
						: 'rgba(' + fillColor.rgb.join() + ')';
			}

			if (fillColor && (fillColor.alpha || fillColor.alpha === 0)) {
				fColorOp = fillColor.alpha;
			}
			if (strokeColor && (strokeColor.alpha || strokeColor.alpha === 0)) {
				sColorOp = strokeColor.alpha;
			}

			if (strokeColor && strokeColor.rgb) {
				sColor =
					strokeColor.rgb.length === ALPHA_INDEX
						? 'rgb(' + strokeColor.rgb.join() + ')'
						: 'rgba(' + strokeColor.rgb.join() + ')';
			}
			const layerSettings = copy(currentLayer.layerSettings);
			layerSettings.interaction.interactionDetail.click = layerClickability;

			// Setting enable enablefillcolor
			layerSettings.interaction.interactionDetail.enablefillColor = enablefillColor;

			// Setting enable Stroke Color
			layerSettings.interaction.interactionDetail.enableStrokeColor = enableStrokeColor;

			//Setting Fill color attributes
			layerSettings.attributeBasedColors = attributeBasedColors;
			layerSettings.selectedAttribute = selectedValue;

			//Setting Stroke color attributes
			layerSettings.attributeBasedStrokeColors = attributeBasedStrokeColors;
			layerSettings.selectedStrokeAttribute = selectedStrokeValue;

			if (
				currentLayer &&
				currentLayer.layerPaintProps &&
				currentLayer.layerPaintProps[0] &&
				currentLayer.layerPaintProps[0].paintType
			) {
				const layerPaintProps = copy(currentLayer.layerPaintProps);

				for (let i = 0; i < layerPaintProps.length; i++) {
					// if layers have identifier use that
					if (currentLayer.identifier) {
						layerPaintProps[i].sourceProps = currentLayer.identifier.toLowerCase() + '_source';
					} else {
						layerPaintProps[i].sourceProps = layerName || '' + uuid() + '_source';
					}
					if (layerPaintProps[i]?.labelProps?.symbolProps?.visibility) {
						delete layerPaintProps[i].labelProps.symbolProps.visibility;
					}

					if (currentLayer.layerSettings?.colorable) {
						set(layerPaintProps, `[${i}]labelProps.visibility`, layerLabelVisibility);
					}
					const layerType = layerPaintProps[i].paintType;

					if (layerType === 'circle' && layerPaintProps[i].paintProps) {
						if (fColor) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'circle-color': fColor,
								},
							};
						}

						if (sColor) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'circle-stroke-color': sColor,
								},
							};
						}
						if ((fColorOp || fColorOp === 0) && !selectedValue) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'circle-opacity': fColorOp,
								},
							};
						}
						if (sColorOp) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'circle-stroke-opacity': sColorOp,
								},
							};
						}

						if (width) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'circle-stroke-width': parseFloat(width),
								},
							};
						}

						//// cluster updates
						if (layerPaintProps[i].clusterProps && layerPaintProps[i].clusterProps.clusterPaintProps) {
							if (
								fColor &&
								layerPaintProps[i].clusterProps.clusterPaintProps['circle-color'] &&
								layerPaintProps[i].clusterProps.clusterPaintProps['circle-color'].stops &&
								layerPaintProps[i].clusterProps.clusterPaintProps['circle-color'].stops[0] &&
								layerPaintProps[i].clusterProps.clusterPaintProps['circle-color'].stops[1] &&
								layerPaintProps[i].clusterProps.clusterPaintProps['circle-color'].stops[TWO]
							) {
								layerPaintProps[i] = {
									...layerPaintProps[i],
									paintProps: {
										...layerPaintProps[i].paintProps,
										'circle-color': fColor,
									},
									clusterProps: {
										...layerPaintProps[i].clusterProps,
										clusterPaintProps: {
											...layerPaintProps[i].clusterProps.clusterPaintProps,

											'circle-color': {
												...layerPaintProps[i].clusterProps.clusterPaintProps['circle-color'],
												stops: [
													[layerPaintProps[i].clusterProps.clusterPaintProps['circle-color'].stops[0][0], fColor],
													[layerPaintProps[i].clusterProps.clusterPaintProps['circle-color'].stops[1][0], fColor],
													[layerPaintProps[i].clusterProps.clusterPaintProps['circle-color'].stops[TWO][0], fColor],
												],
											},
										},
									},
								};
							}
							if (sColor) {
								layerPaintProps[i] = {
									...layerPaintProps[i],
									clusterProps: {
										...layerPaintProps[i].clusterProps,
										clusterPaintProps: {
											...layerPaintProps[i].clusterProps.clusterPaintProps,
											'circle-stroke-color': sColor,
										},
									},
								};
							}
							if (fColorOp || fColorOp === 0) {
								layerPaintProps[i] = {
									...layerPaintProps[i],
									clusterProps: {
										...layerPaintProps[i].clusterProps,
										clusterPaintProps: {
											...layerPaintProps[i].clusterProps.clusterPaintProps,
											'circle-opacity': fColorOp,
										},
									},
								};
							}
							if (sColorOp) {
								layerPaintProps[i] = {
									...layerPaintProps[i],

									clusterProps: {
										...layerPaintProps[i].clusterProps,
										clusterPaintProps: {
											...layerPaintProps[i].clusterProps.clusterPaintProps,
											'circle-stroke-opacity': sColorOp,
										},
									},
								};
							}

							if (width) {
								layerPaintProps[i] = {
									...layerPaintProps[i],
									clusterProps: {
										...layerPaintProps[i].clusterProps,
										clusterPaintProps: {
											...layerPaintProps[i].clusterProps.clusterPaintProps,
											'circle-stroke-width': parseFloat(width),
										},
									},
								};
							}
						}
					} else if (layerType === 'fill' && layerPaintProps[i].paintProps) {
						if (fColor && !selectedValue) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'fill-color': fColor,
								},
							};
						}
						if (sColor) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'fill-outline-color': sColor,
								},
							};
						}
						if ((fColorOp || fColorOp === 0) && !selectedValue) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'fill-opacity': fColorOp,
								},
							};
						}
						if (strokeWidth) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									strokeWidth: strokeWidth,
								},
							};
						}
					} else if (layerType === 'line' && layerPaintProps[i].paintProps) {
						if (fColor) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'line-color': fColor,
								},
							};
						}

						if (fColorOp || fColorOp === 0) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'line-opacity': fColorOp,
								},
							};
						}

						if (width) {
							layerPaintProps[i] = {
								...layerPaintProps[i],
								paintProps: {
									...layerPaintProps[i].paintProps,
									'line-width': parseFloat(width),
								},
							};
						}
					}
				}

				currentLayer = {
					...currentLayer,
					layerSettings,
					layerPaintProps,
				};
			}

			currentLayer = {
				...currentLayer,
				layerSettings,
			};

			return {
				currentLayer,
				layerPaintProps: currentLayer.layerPaintProps,
				layerSettings: currentLayer.layerSettings,
			};
		}
		return null;
	};

	return {
		layerName,
		setLayerName,
		width,
		setWidth,
		fillColor,
		setFillColor,
		enablefillColor,
		enableStrokeColor,
		setEnableStrokeColor,
		setEnableFillColor,
		selectedValue,
		setSelectedValue,
		selectedStrokeValue,
		setSelectedStrokeValue,
		attributeBasedColors,
		setAttributeBasedColors,
		attributeBasedStrokeColors,
		setAttributeBasedStrokeColors,
		layerLabelVisibility,
		setLayerLabelVisibility,
		layerClickability,
		setLayerClickability,
		strokeColor,
		setStrokeColor,
		handleLayerChange,
		strokeWidth,
		setStrokeWidth,
	};
};
