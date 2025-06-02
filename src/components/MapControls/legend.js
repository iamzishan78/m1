import React from 'react';

import { Box, Typography, List, Paper, Divider } from '@material-ui/core';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { aggregationLayers } from 'components/Shared/functions/shapeLayer';

import { layerController } from 'stateManagement/layerStateController';

import LegendCollapse from './legendCollapse';

// Create a dark theme
const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		background: {
			default: '#1e2124',
			paper: '#1e2124',
		},
		text: {
			primary: '#ffffff',
			secondary: '#b0b0b0',
		},
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: '#1e2124',
					color: '#ffffff',
				},
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					paddingTop: 4,
					paddingBottom: 4,
				},
			},
		},
	},
});

export default function Legend() {
	const layers = layerController.getValue('layers');
	const visibleLayers = layers.filter(layer => layer.layerSettings?.visiable);

	const wellsBasedOnDict = {
		'Well Type/Status': {
			'': '#3A3A3A',
			OIL: '#02CF35',
			'OIL AND GAS': '#02CF35',
			GAS: '#E60F0F',
			WATER: '#4AD3F2',
			PERMIT: '#FB9828',
			'PERMIT - NEW DRILL': '#FB9828',
			'PERMIT - EXISTING WELL': '#FB9828',
			PERMITTED: '#FB9828',
		},
	};

	const hasLegendItems = visibleLayers.some(
		layer =>
			layer?.layerSettings?.selectedAttribute ||
			layer?.layerSettings?.selectedStrokeAttribute ||
			layer?.layerSettings?.selectedFillStyle ||
			layer?.layerSettings?.selectedLineStyle ||
			layer?.layerIdentifier === 'Wells' ||
			(Array.isArray(layer?.layerPaintProps) && layer?.layerPaintProps?.some(prop => prop.paintType === 'fill'))
	);

	return (
		<ThemeProvider theme={darkTheme}>
			<Paper
				elevation={3}
				sx={{
					width: 300,
					maxWidth: '100%',
					borderRadius: 1,
					overflow: 'hidden',
				}}
			>
				<Box
					sx={{
						p: 2,
						borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
					style={{ backgroundColor: 'white' }}
				>
					<Typography variant="h6" component="h2">
						Legend
					</Typography>
					<Box
						sx={{
							width: 24,
							height: 24,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							opacity: 0.7,
						}}
					>
						<svg width="16" height="16" viewBox="0 0 16 16">
							<path
								fill="#8FBCD4"
								d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"
								transform="rotate(-45 8 8)"
							/>
						</svg>
					</Box>
				</Box>

				<List style={{ backgroundColor: 'white' }} disablePadding>
					{!hasLegendItems ? (
						<Box sx={{ p: 2, textAlign: 'center', color: '#666' }}>
							<Typography variant="body2">No attributes of any layer selected</Typography>
						</Box>
					) : (
						visibleLayers.map((layer, index) => (
							<>
								{Array.isArray(layer?.layerPaintProps) &&
									layer?.layerPaintProps?.map((paintProp, propIndex) => {
										if (paintProp.paintType === 'fill' && paintProp.paintProps['fill-color']) {
											const fillColor = paintProp.paintProps['fill-color'];
											const fillOpacity = paintProp.paintProps['fill-opacity'];

											const rgbaColor = fillColor?.startsWith('rgb(')
												? fillColor.replace('rgb(', 'rgba(').replace(')', `, ${fillOpacity ?? 1})`)
												: fillColor;
											const colorDict = {
												'Default Layer Colors': {
													'Fill Color': rgbaColor,
													...(paintProp.paintProps['fill-outline-color'] && {
														'Stroke Color': paintProp.paintProps['fill-outline-color'],
													}),
												},
											};
											const styleDict =
												layer.layerSettings.lineStyle || layer.layerSettings.fillStyle
													? {
															'Default Layer Styles': {
																...(layer.layerSettings.fillStyle && {
																	'Fill Style': layer.layerSettings.fillStyle,
																}),
																...(layer.layerSettings.lineStyle && {
																	'Line Style': layer.layerSettings.lineStyle,
																}),
															},
														}
													: null;

											return (
												<React.Fragment key={`fill-${propIndex}`}>
													<LegendCollapse
														layer={layer}
														basedOnKey={{ label: 'Default Layer Colors' }}
														basedOnDict={colorDict}
														typography={null}
														index={index}
														isColor={true}
														isAggLayer={aggregationLayers.includes(layer.layerType)}
														listHeight={100}
													/>
													{styleDict && (
														<LegendCollapse
															layer={layer}
															basedOnKey={{ label: 'Default Layer Styles' }}
															basedOnDict={styleDict}
															typography={null}
															index={index}
															isImage={true}
															isAggLayer={aggregationLayers.includes(layer.layerType)}
															listHeight={100}
															isSubset={true}
														/>
													)}
													<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '20px' }} />
												</React.Fragment>
											);
										}
										return null;
									})}

								{/* Color based on */}
								{layer?.layerSettings?.selectedAttribute && (
									<>
										<LegendCollapse
											layer={layer}
											basedOnKey={layer.layerSettings.selectedAttribute}
											basedOnDict={layer.layerSettings.attributeBasedColors}
											typography={'Color Based On'}
											index={index}
											isColor={true}
											isAggLayer={aggregationLayers.includes(layer.layerType)}
										/>

										<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '20px' }} />
									</>
								)}

								{/* Stroke based on */}

								{layer?.layerSettings?.selectedStrokeAttribute && (
									<>
										<LegendCollapse
											layer={layer}
											basedOnKey={layer.layerSettings.selectedStrokeAttribute}
											basedOnDict={layer.layerSettings.attributeBasedStrokeColors}
											typography={'Stroke Based On'}
											index={index}
											isColor={true}
											isAggLayer={aggregationLayers.includes(layer.layerType)}
										/>

										<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '20px' }} />
									</>
								)}

								{/* Fill Style based on */}

								{layer?.layerSettings?.selectedFillStyle && (
									<>
										<LegendCollapse
											layer={layer}
											basedOnKey={layer.layerSettings.selectedFillStyle}
											basedOnDict={layer.layerSettings.attributeBasedStyles}
											typography={'Fill Style Based On'}
											index={index}
											isImage={true}
											isAggLayer={aggregationLayers.includes(layer.layerType)}
										/>

										<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '20px' }} />
									</>
								)}

								{/* circle Style based on */}

								{layer?.layerSettings?.selectedLineStyle && (
									<>
										<LegendCollapse
											layer={layer}
											basedOnKey={layer.layerSettings.selectedLineStyle}
											basedOnDict={layer.layerSettings.attributeBasedLineStyles}
											typography={'circle Style Based On'}
											index={index}
											isImage={true}
											isAggLayer={aggregationLayers.includes(layer.layerType)}
										/>

										<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '20px' }} />
									</>
								)}

								{/* circle Style based on */}

								{layer?.layerIdentifier === 'Wells' && (
									<>
										<LegendCollapse
											layer={layer}
											basedOnKey={{ label: 'Well Type/Status' }}
											basedOnDict={wellsBasedOnDict}
											typography={'Color Based On'}
											index={index}
											isColor={true}
											isAggLayer={aggregationLayers.includes(layer.layerType)}
										/>

										<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '20px' }} />
									</>
								)}
							</>
						))
					)}
				</List>
			</Paper>
		</ThemeProvider>
	);
}
