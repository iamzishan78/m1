import React, { useState, useEffect, useContext, useRef } from 'react';

import { Box, FormControlLabel, Switch, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { drawShapeLayerToggle, findBoundsMap } from 'components/MapControls/commonHelper';
import {
	changeModeToScaleRotate,
	drawBoundary,
	getRotateAbleShapeFromSelectedQuarters,
} from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import SmallTXQtr from 'components/MRTTable/Common/Components/SmallTXQtr';

import { drawController } from 'controllers/drawStateController';
import { jobController } from 'controllers/jobStateController';
import { layerController } from 'controllers/layerStateController';
import { mapControlsController } from 'controllers/mapControlsController';

import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';

import { copy } from 'utils/helper';

import { AppContext } from 'AppContext';

import {
	getQtrFilterData,
	getQtrQtrFromQtr,
	handleLayerChangeOnQtr,
} from '../../ParcelsDetailCard/ParcelSummary/helper';

const useStyles = makeStyles(theme => ({
	mainDiv: {
		paddingTop: '10px',
		position: 'relative',
		cursor: ({ layerData }) => (layerData.state !== 'TXtemporaryRemoved' ? 'pointer' : 'context-menu'),
		'& p': {
			WebkitTouchCallout: 'none' /* iOS Safari */,
			WebkitUserSelect: 'none' /* Safari */,
			KhtmlUserSelect: 'none' /* Konqueror HTML */,
			MozUserSelect: 'none' /* Old versions of Firefox */,
			MsUserSelect: 'none' /* Internet Explorer/Edge */,
			userSelect: 'none' /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */,
		},
	},
	root: {
		backgroundColor: ({ layerData }) => (layerData.state !== 'TX' ? '#F3F3F3' : '#fff'),
		height: '387px',
		// width: "387px",
		marginRight: '15px',
		border: '2px solid #C9C9C9',
		'& p': {
			textAlign: 'center',
			margin: 'auto 0',
			top: 'calc( 50% - 8px)',
			position: 'relative',
			fontSize: '0.72rem',
			color: ({ layerData }) => (layerData.state !== 'TXtemporaryRemoved' ? '#757575' : '#75757552'),
		},
	},
	qrt: {
		height: '50%',
	},
	qrt2: {
		height: '50%',
		'&:hover': {
			backgroundColor: ({ layerData }) => (layerData.state !== 'TX' ? '#BFEBFB !important' : ''),
		},
	},
	qrt1: {
		position: 'absolute',
		border: ({ layerData }) =>
			`2px solid ${layerData.state !== 'TXtemporaryRemoved' ? theme.palette.secondary.main : '#C9C9C9'}`,
		borderRadius: '4px',
		height: ({ layerData }) => (layerData.state === 'TX' ? '20px' : '40px'),
		width: ({ layerData }) => (layerData.state === 'TX' ? '20px' : '40px'),
		color: ({ layerData }) => (layerData.state !== 'TXtemporaryRemoved' ? theme.palette.secondary.main : '#75757552'),
		backgroundColor: ({ layerData }) => (layerData.state !== 'TXtemporaryRemoved' ? '#fff' : '#F3F3F3'),
		'& p': {
			textAlign: 'center',
			margin: 'auto 0',
			top: 'calc( 50% - 10px)',
			position: 'relative',
		},
		'&:hover': {
			backgroundColor: ({ layerData }) => (layerData.state !== 'TXtemporaryRemoved' ? '#BFEBFB !important' : ''),
		},
	},
	bb2: { borderBottom: '2px solid #C9C9C9' },
	br2: { borderRight: '2px solid #C9C9C9' },
	bb1: { borderBottom: '1px solid #C9C9C9' },
	br1: { borderRight: '1px solid #C9C9C9' },
	backgrounSecondaryQrt1: {
		backgroundColor: `${theme.palette.secondary.main} !important`,
		color: '#fff !important',
	},
	backgrounSecondaryQrt2: {
		backgroundColor: '#BFEBFB !important',
		'& p': { color: `${theme.palette.primary.main} !important` },
	},
}));

const qtrOptions = ['', 'E2', 'NE', 'NW', 'N2', 'SE', 'SW', 'S2', 'W2'];

export default function QtrQtrSelectorNew({ layerData }) {
	// removing state so that taxas also have same style as non taxas
	layerData.state = '';

	const classes = useStyles({ layerData });
	const [qtr, setQtr] = useState(
		layerData?.qtrQtrSelection?.selectedQtr ? copy(layerData.qtrQtrSelection.selectedQtr) : ['', '', '', '']
	);

	const [qtrQtr, setQtrQtr] = useState(
		layerData?.qtrQtrSelection?.qtrQtr ? copy(layerData.qtrQtrSelection.qtrQtr) : {}
	);
	const [showAdjustGrid, setShowAdjustGrid] = useState(false);
	const [disableUpdate, setDisableUpdate] = useState(false);
	const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

	const [stateApp] = useContext(AppContext);

	const drawState = drawController.useState(['currentFeature']);

	const eventsConfiguredRef = useRef(false);

	const checkForDisabled = () => {
		let isDisabled = true;

		if (qtrQtr && !layerData?.qtrQtrSelection?.qtrQtr && !Object.keys(qtrQtr).find(key => qtrQtr[key] !== true)) {
			setDisableUpdate(true);
			return;
		}

		if (qtrQtr && !layerData?.qtrQtrSelection?.qtrQtr && Object.keys(qtrQtr).find(key => qtrQtr[key] !== true)) {
			setDisableUpdate(false);
			return;
		}
		qtrQtr &&
			Object.keys(qtrQtr).forEach(key => {
				if (layerData?.qtrQtrSelection?.qtrQtr[key] !== qtrQtr[key]) {
					isDisabled = false;
				}
			});
		setDisableUpdate(isDisabled);
	};

	useEffect(() => {
		if (layerData?.qtrQtrSelection) {
			setQtr(copy(layerData.qtrQtrSelection.selectedQtr));
			if (layerData.qtrQtrSelection.qtrQtr) {
				setQtrQtr(copy(layerData.qtrQtrSelection.qtrQtr));
			}
		}
	}, [layerData?.qtrQtrSelection]);

	useEffect(() => {
		if (!layerData?.qtrQtrSelection?.qtrQtr) {
			setQtrQtr(getQtrQtrFromQtr(qtr, qtrQtr));
		}
	}, []);

	useEffect(() => {
		checkForDisabled();
	}, [qtr, qtrQtr]);

	useEffect(() => {
		if (!eventsConfiguredRef.current && stateApp.map) {
			const { map } = stateApp;

			map.on('draw.modechange', () => {
				changeModeToScaleRotate(window.drawRef);
			});
			eventsConfiguredRef.current = true;
		}

		return () => {
			window.drawRef?.deleteAll();
			drawController.updateState({
				isDrawing: false,
			});
		};
	}, [stateApp.map, drawState.currentFeature]);

	useEffect(() => {
		if (showAdjustGrid) {
			drawController.updateState({
				isDrawing: true,
			});
			const feature = copy(layerData.shape);
			let layerDataCopy = copy(layerData);
			if (layerDataCopy?.qtrQtrSelection?.originalGeometry) {
				feature.geometry = layerDataCopy.qtrQtrSelection.originalGeometry;
			}
			mapControlsController.updateState({ selectedMapControl: '' });
			drawShapeLayerToggle('visible');
			window.drawRef?.deleteAll();
			getRotateAbleShapeFromSelectedQuarters(feature, window.drawRef);
		} else {
			window.drawRef?.deleteAll();
			drawController.updateState({
				isDrawing: false,
			});
		}
	}, [showAdjustGrid]);

	const updateLayerQtr = () => {
		const layerDataCopy = handleLayerChangeOnQtr(stateApp, layerData, qtrQtr, qtr);
		const customLayer = {
			shapeJson: layerDataCopy.shape,
			qtrQtrSelection: layerDataCopy.qtrQtrSelection,
			shape: JSON.stringify(layerDataCopy.shape),
		};
		updateCustomLayer({
			variables: {
				customLayerId: layerDataCopy._id,
				customLayer,
			},
		}).then(res => {
			jobController.toggleBulkUpload();
			findBoundsMap([customLayer.shapeJson], stateApp.map);
			drawBoundary(customLayer.shapeJson);
			layerController.resetBounds(res?.data?.updateCustomLayer?.customLayer?.layer);
		});
	};

	return (
		<div>
			<Grid container spacing={1} direction="row">
				<Grid item md={11}>
					<Typography style={{ fontWeight: 700 }}>Show/edit the shape orientation and size on map</Typography>
				</Grid>
				<Grid item md={1}>
					<FormControlLabel
						style={{ marginRight: 0 }}
						control={
							<Switch checked={showAdjustGrid} onChange={() => setShowAdjustGrid(!showAdjustGrid)} size="small" />
						}
					/>
				</Grid>
			</Grid>
			<p className="formLabel" style={{ marginTop: '0' }}>
				Adjust the shape boundary by entering quarter calls or selecting values in the grid below
			</p>
			<Grid container spacing={1} direction="row">
				<Grid item md={9}>
					<Grid container spacing={1} direction="row">
						{[1, 2, 3, 4].map(val => (
							<Grid item xs={3} key={val}>
								<Box>QTR {val}</Box>
								<Autocomplete
									options={qtrOptions}
									getOptionLabel={option => (option === '' ? '-' : option)}
									value={qtr[val - 1]}
									disableClearable
									onChange={(e, newInputValue) => {
										qtr[val - 1] = newInputValue ? newInputValue : '';

										const values = getQtrFilterData(qtr);
										if (values) {
											Object.keys(qtrQtr).forEach(key => {
												qtrQtr[key] = false;
											});
											values.forEach(value => {
												qtrQtr[value.toLowerCase()] = true;
											});
											setQtrQtr(qtrQtr);
										}
										setQtr([...qtr]);
									}}
									renderInput={params => (
										<TextField {...params} variant="outlined" size="small" className={classes.maxWidth} />
									)}
								/>
							</Grid>
						))}
					</Grid>
				</Grid>
				<Grid item md={3} style={{ paddingTop: '1.8em' }}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						style={{ width: '100%' }}
						disabled={disableUpdate}
						data-testid="update-qtr"
						onClick={() => {
							updateLayerQtr();
							setShowAdjustGrid(false);
						}}
					>
						Update
					</Button>
				</Grid>
			</Grid>
			<div className={classes.mainDiv}>
				{/* //// all //// */}
				<div
					className={`${classes.qrt1} ${
						layerData.state !== 'TXtemporaryRemoved' &&
						qtrQtr &&
						Object.entries(qtrQtr).every(([, value]) => {
							return value;
						})
							? classes.backgrounSecondaryQrt1
							: ''
					}`}
					style={{
						top: layerData.state !== 'TX' ? 'calc(50% - 20px)' : 'calc(50% - 10px)',
						left: layerData.state !== 'TX' ? 'calc(50% - 20px)' : 'calc(50% - 19px)',
					}}
					onClick={() => {
						if (layerData.state !== 'TXtemporaryRemovedtemporaryRemoved' && qtrQtr) {
							if (
								Object.entries(qtrQtr).every(([, value]) => {
									return value;
								})
							) {
								setQtrQtr({
									nwnw: false,
									nenw: false,
									swnw: false,
									senw: false,
									nwne: false,
									nene: false,
									swne: false,
									sene: false,
									nwsw: false,
									nesw: false,
									swsw: false,
									sesw: false,
									nwse: false,
									nese: false,
									swse: false,
									sese: false,
								});
							} else {
								setQtrQtr({
									nwnw: true,
									nenw: true,
									swnw: true,
									senw: true,
									nwne: true,
									nene: true,
									swne: true,
									sene: true,
									nwsw: true,
									nesw: true,
									swsw: true,
									sesw: true,
									nwse: true,
									nese: true,
									swse: true,
									sese: true,
								});
							}
						}
					}}
					data-testid="qtr-all"
				>
					{layerData.state !== 'TX' && <p> ALL</p>}
				</div>

				{/* //// NW //// */}
				<div
					className={`${classes.qrt1} ${
						layerData.state !== 'TXtemporaryRemoved' &&
						qtrQtr &&
						Object.entries(qtrQtr).every(([key, value]) => {
							return ['nwnw', 'nenw', 'swnw', 'senw'].indexOf(key) === -1 ? true : value;
						})
							? classes.backgrounSecondaryQrt1
							: ''
					}`}
					style={{
						top: layerData.state !== 'TX' ? 'calc(25% - 20px)' : 'calc(25% - 10px)',
						left: layerData.state !== 'TX' ? 'calc(25% - 24px)' : 'calc(25% - 14px)',
					}}
					onClick={() => {
						if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
							if (
								Object.entries(qtrQtr).every(([key, value]) => {
									return ['nwnw', 'nenw', 'swnw', 'senw'].indexOf(key) === -1 ? true : value;
								})
							) {
								setQtrQtr({
									...qtrQtr,
									nwnw: false,
									nenw: false,
									swnw: false,
									senw: false,
								});
							} else {
								setQtrQtr({
									...qtrQtr,
									nwnw: true,
									nenw: true,
									swnw: true,
									senw: true,
								});
							}
						}
					}}
					data-testid="qtr-nw"
				>
					{layerData.state !== 'TX' && <p> NW</p>}
				</div>

				{/* //// NE //// */}
				<div
					className={`${classes.qrt1} ${
						layerData.state !== 'TXtemporaryRemoved' &&
						qtrQtr &&
						Object.entries(qtrQtr).every(([key, value]) => {
							return ['nwne', 'nene', 'swne', 'sene'].indexOf(key) === -1 ? true : value;
						})
							? classes.backgrounSecondaryQrt1
							: ''
					}`}
					style={{
						top: layerData.state !== 'TX' ? 'calc(25% - 20px)' : 'calc(25% - 10px)',
						right: layerData.state !== 'TX' ? 'calc(24% - 10px)' : 'calc(25% + 2px)',
					}}
					onClick={() => {
						if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
							if (
								Object.entries(qtrQtr).every(([key, value]) => {
									return ['nwne', 'nene', 'swne', 'sene'].indexOf(key) === -1 ? true : value;
								})
							) {
								setQtrQtr({
									...qtrQtr,
									nwne: false,
									nene: false,
									swne: false,
									sene: false,
								});
							} else {
								setQtrQtr({
									...qtrQtr,
									nwne: true,
									nene: true,
									swne: true,
									sene: true,
								});
							}
						}
					}}
					data-testid="qtr-ne"
				>
					{layerData.state !== 'TX' && <p> NE</p>}
				</div>

				{/* //// SW //// */}
				<div
					className={`${classes.qrt1} ${
						layerData.state !== 'TXtemporaryRemoved' &&
						qtrQtr &&
						Object.entries(qtrQtr).every(([key, value]) => {
							return ['nwsw', 'nesw', 'swsw', 'sesw'].indexOf(key) === -1 ? true : value;
						})
							? classes.backgrounSecondaryQrt1
							: ''
					}`}
					style={{
						bottom: layerData.state !== 'TX' ? 'calc(25% - 20px)' : 'calc(25% - 10px)',
						left: layerData.state !== 'TX' ? 'calc(25% - 24px)' : 'calc(25% - 14px)',
					}}
					onClick={() => {
						if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
							if (
								Object.entries(qtrQtr).every(([key, value]) => {
									return ['nwsw', 'nesw', 'swsw', 'sesw'].indexOf(key) === -1 ? true : value;
								})
							) {
								setQtrQtr({
									...qtrQtr,
									nwsw: false,
									nesw: false,
									swsw: false,
									sesw: false,
								});
							} else {
								setQtrQtr({
									...qtrQtr,
									nwsw: true,
									nesw: true,
									swsw: true,
									sesw: true,
								});
							}
						}
					}}
					data-testid="qtr-sw"
				>
					{layerData.state !== 'TX' && <p> SW</p>}
				</div>

				{/* //// SE //// */}
				<div
					className={`${classes.qrt1} ${
						layerData.state !== 'TXtemporaryRemoved' &&
						qtrQtr &&
						Object.entries(qtrQtr).every(([key, value]) => {
							return ['nwse', 'nese', 'swse', 'sese'].indexOf(key) === -1 ? true : value;
						})
							? classes.backgrounSecondaryQrt1
							: ''
					}`}
					style={{
						bottom: layerData.state !== 'TX' ? 'calc(25% - 20px)' : 'calc(25% - 10px)',
						right: layerData.state !== 'TX' ? 'calc(24% - 10px)' : 'calc(25% + 2px)',
					}}
					onClick={() => {
						if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
							if (
								Object.entries(qtrQtr).every(([key, value]) => {
									return ['nwse', 'nese', 'swse', 'sese'].indexOf(key) === -1 ? true : value;
								})
							) {
								setQtrQtr({
									...qtrQtr,
									nwse: false,
									nese: false,
									swse: false,
									sese: false,
								});
							} else {
								setQtrQtr({
									...qtrQtr,
									nwse: true,
									nese: true,
									swse: true,
									sese: true,
								});
							}
						}
					}}
					data-testid="qtr-se"
				>
					{layerData.state !== 'TX' && <p> SE</p>}
				</div>

				<Grid container className={classes.root} spacing={0}>
					{/* //// NW Snd qtrs ////*/}
					<Grid item container sm={6} className={`${classes.qrt} ${classes.bb2} ${classes.br2}`}>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.nwnw ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										nwnw: qtrQtr.nwnw ? false : true,
									});
								}
							}}
							data-testid="qtr-nwnw"
						>
							{layerData.state !== 'TX' ? <p> NWNW</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.bb1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.nenw ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										nenw: qtrQtr.nenw ? false : true,
									});
								}
							}}
							data-testid="qtr-nenw"
						>
							{layerData.state !== 'TX' ? <p> NENW</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.br1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.swnw ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										swnw: qtrQtr.swnw ? false : true,
									});
								}
							}}
							data-testid="qtr-swnw"
						>
							{layerData.state !== 'TX' ? <p> SWNW</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.senw ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										senw: qtrQtr.senw ? false : true,
									});
								}
							}}
							data-testid="qtr-senw"
						>
							{layerData.state !== 'TX' ? <p> SENW</p> : <SmallTXQtr />}
						</Grid>
					</Grid>

					{/* //// NE Snd qtrs ////*/}
					<Grid item container sm={6} className={`${classes.qrt} ${classes.bb2}`}>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.nwne ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										nwne: qtrQtr.nwne ? false : true,
									});
								}
							}}
							data-testid="qtr-nwne"
						>
							{layerData.state !== 'TX' ? <p> NWNE</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.bb1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.nene ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										nene: qtrQtr.nene ? false : true,
									});
								}
							}}
							data-testid="qtr-nene"
						>
							{layerData.state !== 'TX' ? <p> NENE</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.br1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.swne ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										swne: qtrQtr.swne ? false : true,
									});
								}
							}}
							data-testid="qtr-swne"
						>
							{layerData.state !== 'TX' ? <p> SWNE</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.sene ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										sene: qtrQtr.sene ? false : true,
									});
								}
							}}
							data-testid="qtr-sene"
						>
							{layerData.state !== 'TX' ? <p> SENE</p> : <SmallTXQtr />}
						</Grid>
					</Grid>

					{/* //// SW Snd qtrs ////*/}
					<Grid item container sm={6} className={`${classes.qrt} ${classes.br2}`}>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.nwsw ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										nwsw: qtrQtr.nwsw ? false : true,
									});
								}
							}}
							data-testid="qtr-nwsw"
						>
							{layerData.state !== 'TX' ? <p> NWSW</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.bb1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.nesw ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										nesw: qtrQtr.nesw ? false : true,
									});
								}
							}}
							data-testid="qtr-nesw"
						>
							{layerData.state !== 'TX' ? <p> NESW</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.br1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.swsw ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										swsw: qtrQtr.swsw ? false : true,
									});
								}
							}}
							data-testid="qtr-swsw"
						>
							{layerData.state !== 'TX' ? <p> SWSW</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.sesw ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										sesw: qtrQtr.sesw ? false : true,
									});
								}
							}}
							data-testid="qtr-sesw"
						>
							{layerData.state !== 'TX' ? <p> SESW</p> : <SmallTXQtr />}
						</Grid>
					</Grid>

					{/* //// SE Snd qtrs ////*/}
					<Grid item container sm={6} className={classes.qrt}>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.bb1} ${classes.br1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.nwse ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										nwse: qtrQtr.nwse ? false : true,
									});
								}
							}}
							data-testid="qtr-nwse"
						>
							{layerData.state !== 'TX' ? <p> NWSE</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.bb1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.nese ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										nese: qtrQtr.nese ? false : true,
									});
								}
							}}
							data-testid="qtr-nese"
						>
							{layerData.state !== 'TX' ? <p> NESE</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${classes.br1} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.swse ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										swse: qtrQtr.swse ? false : true,
									});
								}
							}}
							data-testid="qtr-swse"
						>
							{layerData.state !== 'TX' ? <p> SWSE</p> : <SmallTXQtr />}
						</Grid>
						<Grid
							item
							sm={6}
							className={`${classes.qrt2} ${
								layerData.state !== 'TXtemporaryRemoved' && qtrQtr && qtrQtr.sese ? classes.backgrounSecondaryQrt2 : ''
							}`}
							onClick={() => {
								if (layerData.state !== 'TXtemporaryRemoved' && qtrQtr) {
									setQtrQtr({
										...qtrQtr,
										sese: qtrQtr.sese ? false : true,
									});
								}
							}}
							data-testid="qtr-sese"
						>
							{layerData.state !== 'TX' ? <p> SESE</p> : <SmallTXQtr />}
						</Grid>
					</Grid>
				</Grid>
			</div>
		</div>
	);
}

QtrQtrSelectorNew.propTypes = {
	layerData: PropTypes.shape({
		state: PropTypes.string,
		qtrQtrSelection: PropTypes.shape({
			selectedQtr: PropTypes.arrayOf(PropTypes.string),
			qtrQtr: PropTypes.object,
			originalGeometry: PropTypes.object,
		}),
		shape: PropTypes.object,
		_id: PropTypes.string,
	}).isRequired,
};
