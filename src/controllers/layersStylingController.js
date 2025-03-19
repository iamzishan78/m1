import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { ALPHA_INDEX, ifRgbaConvt, TWO } from 'components/MapControls/components/Layer/Common';
import { copy } from 'components/Shared/functions';

import { StateController } from './stateController';

class LayerStylingStateController extends StateController {
	constructor(initialState) {
		super(initialState, LayerStylingStateController.name);
		this.autoBind(this);
	}

	handleLayerChange(layer) {
		const stateValues = this.getAllValues();
		const {
			width,
			fillColor,
			fillStyle,
			lineStyle,
			enablefillColor,
			enableStrokeColor,
			enableStrokeStyle,
			enableColorStyle,
			selectedValue,
			selectedStrokeValue,
			selectedFillStyle,
			selectedLineStyle,
			attributeBasedColors,
			attributeBasedStrokeColors,
			attributeBasedStyles,
			attributeBasedLineStyles,
			layerLabelVisibility,
			layerClickability,
			strokeColor,
			strokeWidth,
			layerName,
		} = stateValues;

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
			layer.layerSettings?.interaction?.interactionDetail?.enableColorStyle !== enableColorStyle ||
			layer.layerSettings?.interaction?.interactionDetail?.enableStrokeStyle !== enableStrokeStyle ||
			!_.isEqual(layer.layerSettings?.attributeBasedColors, attributeBasedColors) ||
			!_.isEqual(layer.layerSettings?.attributeBasedStrokeColors, attributeBasedStrokeColors) ||
			!_.isEqual(layer.layerSettings?.attributeBasedStyles, attributeBasedStyles) ||
			!_.isEqual(layer.layerSettings?.attributeBasedLineStyles, attributeBasedLineStyles) ||
			layer.layerSettings?.selectedAttribute?.label !== selectedValue?.label ||
			layer.layerSettings?.selectedStrokeAttribute?.label !== selectedStrokeValue?.label ||
			layer.layerSettings?.selectedFillStyle?.label !== selectedFillStyle?.label ||
			layer.layerSettings?.selectedLineStyle?.label !== selectedLineStyle?.label ||
			layer.layerSettings?.fillStyle !== fillStyle ||
			layer.layerSettings?.lineStyle !== lineStyle
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

			// Setting enable Stroke Style
			layerSettings.interaction.interactionDetail.enableStrokeStyle = enableStrokeStyle;

			// Setting enable Color Style
			layerSettings.interaction.interactionDetail.enableColorStyle = enableColorStyle;

			//Setting Fill color attributes
			layerSettings.attributeBasedColors = attributeBasedColors;
			layerSettings.selectedAttribute = selectedValue;

			//Setting Stroke color attributes
			layerSettings.attributeBasedStrokeColors = attributeBasedStrokeColors;
			layerSettings.selectedStrokeAttribute = selectedStrokeValue;

			//Setting fill style
			layerSettings.attributeBasedStyles = attributeBasedStyles;
			layerSettings.selectedFillStyle = selectedFillStyle;

			layerSettings.fillStyle = fillStyle;

			//Setting Line Style
			layerSettings.attributeBasedLineStyles = attributeBasedLineStyles;
			layerSettings.selectedLineStyle = selectedLineStyle;

			layerSettings.lineStyle = lineStyle;

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
						_.set(layerPaintProps, `[${i}]labelProps.visibility`, layerLabelVisibility);
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

		let currentLayer = {
			...layer,
		};
		return {
			currentLayer,
			layerPaintProps: currentLayer.layerPaintProps,
			layerSettings: currentLayer.layerSettings,
		};
	}

	initializeLayerStyling(layer) {
		const layerType = layer.layerPaintProps[0]?.paintType;
		const initialLayerLabelVisibility =
			layer.layerPaintProps[0]?.labelProps?.visibility === 'none' ? 'none' : 'visible';
		const initialLayerClickable = layer.layerSettings?.interaction?.interactionDetail?.click;

		// Getting initiallayer fill and if it is not set setting it to true
		const initialLayerEnableFill = !(layer.layerSettings?.interaction?.interactionDetail?.enablefillColor === false);
		const initialLayerEnableStroke = !(
			layer.layerSettings?.interaction?.interactionDetail?.enableStrokeColor === false
		);
		const initialLayerEnableStrokeStyle = !(
			layer.layerSettings?.interaction?.interactionDetail?.enableStrokeStyle === false
		);
		const initialLayerEnableFillStyle = !(
			layer.layerSettings?.interaction?.interactionDetail?.enableColorStyle === false
		);
		const initialLayerAttributeBasedColors = layer.layerSettings?.attributeBasedColors || {};
		const initialLayerAttributeBasedStrokeColors = layer.layerSettings?.attributeBasedStrokeColors || {};
		const initialLayerAttributeFillStyles = layer.layerSettings?.attributeBasedStyles || {};
		const initialLayerAttributeLineStyles = layer.layerSettings?.attributeBasedLineStyles || {};
		const initialLayerSelectedAttribute = layer.layerSettings?.selectedAttribute || null;
		const initialLayerSelectedStrokeAttribute = layer.layerSettings?.selectedStrokeAttribute || null;
		const initialLayerFillStyle = layer.layerSettings?.selectedFillStyle || null;
		const initialLayerLineStyle = layer.layerSettings?.selectedLineStyle || null;
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

		this.updateState({
			width: initialWidth,
			layerName: null,
			fillColor: initialFillColor,
			fillStyle: layer.layerSettings?.fillStyle || null,
			lineStyle: layer.layerSettings?.lineStyle || null,

			// Added state for enable layer fill
			enablefillColor: initialLayerEnableFill,
			enableStrokeColor: initialLayerEnableStroke,
			enableStrokeStyle: initialLayerEnableStrokeStyle,
			enableColorStyle: initialLayerEnableFillStyle,
			selectedValue: initialLayerSelectedAttribute,
			selectedStrokeValue: initialLayerSelectedStrokeAttribute,
			selectedFillStyle: initialLayerFillStyle,
			selectedLineStyle: initialLayerLineStyle,
			attributeBasedColors: initialLayerAttributeBasedColors,
			attributeBasedStrokeColors: initialLayerAttributeBasedStrokeColors,
			attributeBasedStyles: initialLayerAttributeFillStyles,
			attributeBasedLineStyles: initialLayerAttributeLineStyles,

			layerLabelVisibility: initialLayerLabelVisibility,
			layerClickability: initialLayerClickable,
			strokeColor: initialStrokeColor,
			strokeWidth: initialWidth || initialStrokeWidth,
			layerInitialized: true,
		});
	}

	setWidth(newWidth) {
		this.updateState({ width: newWidth });
	}

	setLayerName(newLayerName) {
		this.updateState({ layerName: newLayerName });
	}

	setFillColor(newFillColor) {
		this.updateState({ fillColor: newFillColor });
	}

	setFillStyle(newFillStyle) {
		this.updateState({ fillStyle: newFillStyle });
	}

	setLineStyle(newLineStyle) {
		this.updateState({ lineStyle: newLineStyle });
	}

	setEnableFillColor(isEnabled) {
		this.updateState({ enablefillColor: isEnabled });
	}

	setEnableStrokeColor(isEnabled) {
		this.updateState({ enableStrokeColor: isEnabled });
	}

	setEnableStrokeStyle(isEnabled) {
		this.updateState({ enableStrokeStyle: isEnabled });
	}

	setEnableColorStyle(isEnabled) {
		this.updateState({ enableColorStyle: isEnabled });
	}

	setSelectedValue(newSelectedValue) {
		this.updateState({ selectedValue: newSelectedValue });
	}

	setSelectedStrokeValue(newSelectedStrokeValue) {
		this.updateState({ selectedStrokeValue: newSelectedStrokeValue });
	}

	setSelectedFillStyle(newSelectedFillStyle) {
		this.updateState({ selectedFillStyle: newSelectedFillStyle });
	}

	setSelectedLineStyle(newSelectedLineStyle) {
		this.updateState({ selectedLineStyle: newSelectedLineStyle });
	}

	setAttributeBasedColors(newAttributeBasedColors) {
		this.updateState({ attributeBasedColors: newAttributeBasedColors });
	}

	setAttributeBasedStrokeColors(newAttributeBasedStrokeColors) {
		this.updateState({ attributeBasedStrokeColors: newAttributeBasedStrokeColors });
	}

	setAttributeBasedStyles(newAttributeBasedStyles) {
		this.updateState({ attributeBasedStyles: newAttributeBasedStyles });
	}

	setAttributeBasedLineStyles(newAttributeBasedLineStyles) {
		this.updateState({ attributeBasedLineStyles: newAttributeBasedLineStyles });
	}

	setLayerLabelVisibility(newVisibility) {
		this.updateState({ layerLabelVisibility: newVisibility });
	}

	setLayerClickability(newClickability) {
		this.updateState({ layerClickability: newClickability });
	}

	setStrokeColor(newStrokeColor) {
		this.updateState({ strokeColor: newStrokeColor });
	}

	setStrokeWidth(newStrokeWidth) {
		this.updateState({ strokeWidth: newStrokeWidth });
	}
}

// Export instance of LayerStylingStateController
export const layerStylingController = new LayerStylingStateController({});
