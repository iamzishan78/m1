import React, { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import DatabaseIcon from 'components/Shared/svgIcons/DatabaseIcon';
import LayersIcon from '@material-ui/icons/Layers';
import GridOnIcon from '@material-ui/icons/GridOn';
import FileDatasetIcon from 'components/Shared/svgIcons/FileDatasetIcon';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { copy } from 'components/Shared/functions';

import { StyledListItemSecondaryAction, StyledMenuSecondaryHeaderItem } from '../style';
import { AppContext } from 'AppContext';
import { snapGridSideBarData } from 'components/MapGridCard/components/data';
import { GET_DATASETS } from 'graphQL/useQueryDataset';
import { USER_MAP_SETTINGS_QUERY } from 'graphQL/useQueryUserMapSettings';
import { scrollbarStyle } from 'styles/common';
import DatasetMenu from './Menu';
import { UPDATEMANYLAYERSETTINGS } from 'graphQL/useMutationUpdateManyLayerSettings';
import { UPDATE_USER_MAP_SETTINGS } from 'graphQL/useMutationUserMapSettings';
import { mapControlsController } from 'hookstate/mapControlsController';
import { layerController } from 'hookstate/layerStateController';
import { globalStateController } from 'hookstate/globalStateController';
import { globalState } from 'hookstate/initialStates';

const useStyles = makeStyles(theme => ({
	root: props => ({
		background: '#0e111a',
		overflow: 'auto',
		maxHeight: '274px',
		paddingTop: '10px',
		borderBottom: '1px solid #263451',
		paddingBottom: '20px',
		...scrollbarStyle,

		'& .item': {
			'&:hover': {
				background: '#506187',
				// "& .actionIcon": {
				//     color: '#FFFF'
				// },
				'& .dIcon': {
					fill: '#ffff ',
				},
			},
			cursor: 'pointer',
			paddingLeft: '10px',
			marginBottom: '15px',
			paddingBottom: '10px',
		},

		'& .dIcon': {
			fill: '#506187',
			position: 'absolute',
			height: '53px',
			width: '43px',
		},

		'& .actionIcons': {
			paddingRight: '20px',
			display: 'flex',
			position: 'relative',
			top: '7px',
			'& .actionIcon': {
				color: '#3b4663',
				'&:hover': {
					color: '#FFFF',
				},
			},
		},
		fontFamily: 'Poppins',

		position: 'relative',
		disabledLayerTitle: {
			'& span': { color: 'rgb(127, 149, 199) !important' },
		},
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			color: theme.palette.common.white,
			minWidth: '40px', // for some reason controls the icon spacing
		},
		'& .MuiTypography-root': {
			color: theme.palette.common.white,
		},
		paddingLeft: '10px',
		justifyContent: 'center',
		alignItems: 'center',
	}),
	subContainer: props => ({
		marginLeft: theme.spacing(props.depth * 2),
	}),
	item: {
		paddingLeft: '10px',
		marginBottom: '15px',
	},
}));

const DatasetsMemo = memo(Datasets);
export default function DatasetsContainer(props) {
	const [stateApp] = useContext(AppContext);
	const stateAppMemo = useMemo(
		() => ({ layers: stateApp.layers, user: stateApp.user }),
		[stateApp.layers, stateApp.user]
	);
	return <DatasetsMemo stateApp={stateAppMemo} headerButton={props.headerButton} search={props.search} />;
}

function Datasets({ headerButton, search, stateApp }) {
	const classes = useStyles();

	const [getDatasets, { data: _datasets }] = useLazyQuery(GET_DATASETS);
	const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);
	const [updateUserMapSettings] = useMutation(UPDATE_USER_MAP_SETTINGS, {
		refetchQueries: ['getUserMapSettings'],
		awaitRefetchQueries: true,
	});
	const [userMapSettings, { data: mapSettings }] = useLazyQuery(USER_MAP_SETTINGS_QUERY);

	useEffect(() => {
		userMapSettings({ variables: { user: stateApp.user._id, type: 'DatasetVisibility' } });
		getDatasets({ variables: { userId: stateApp.user._id } });
	}, [getDatasets, stateApp.user._id, userMapSettings]);

	const datasets = useMemo(() => {
		if (_datasets?.getDatasets?.length && mapSettings?.userMapSettings?.message) {
			let datasets = copy(_datasets.getDatasets);
			const settings = mapSettings?.userMapSettings?.settings?.settings || {};

			datasets.forEach(dataset => {
				dataset.name = dataset.sourceName;
				if (dataset.sourceName === 'M1 Platform') {
					dataset.Icon = DatabaseIcon;
					dataset.visibility = true;
					dataset.categoryCount = snapGridSideBarData.length;
					dataset.categories = snapGridSideBarData;
				} else {
					dataset.Icon = FileDatasetIcon;
					dataset.categoryCount = dataset.categories.length;
					dataset.visibility = typeof settings[dataset._id] === 'undefined' ? true : settings[dataset._id];
					dataset.categories.forEach(category => {
						category.file = dataset.file;
						category.originalFile = dataset.originalFile;
						category.fileName = dataset?.fileInfo?.name;
					});
				}
			});
			globalStateController.updateState({ datasets });
			datasets = datasets.filter(dataset => {
				return dataset.visibility;
			});
			if (search) datasets = datasets.filter(dataset => dataset.name.toLowerCase().includes(search.toLowerCase()));
			return datasets;
		} else return [];
	}, [_datasets, mapSettings, search]);


	const { mapControlsStateValues } = mapControlsController.useState(['selectedDataset'], 'mapControlsStateValues');

	const getBorderColor = useCallback(
		name => (mapControlsStateValues.selectedDataset?.sourceName === name ? '#05aff0' : '#263451'),
		[mapControlsStateValues.selectedDataset?.sourceName]
	);

	const onItemClick = dataset => {
		const stateToUpdate = { mapGridCardActivated: false, selectedDataset: dataset };
		if (
			dataset.sourceName === 'M1 Platform' &&
			mapControlsStateValues.selectedDataset?.sourceName !== dataset.sourceName
		) {
			stateToUpdate.layerGridCard = false;
			stateToUpdate.mapGridCardActivated = true;
		} else {
			stateToUpdate.selectedLayer = { ...dataset.categories[0] };
			stateToUpdate.layerGridCard = true;
			stateToUpdate.mapGridCardActivated = true;
		}
		mapControlsController.updateState(stateToUpdate);
	};

	const handleRemove = (dataset, value) => {
		datasets.find(d => d._id === dataset._id).visibility = value;
		globalStateController.updateState({ datasets });
		const layersSettingsToUpdate = [];

		globalStateController.getValue('layers').forEach((clayer, layerIndex) => {
			if (clayer.file === dataset.file) {
				layersSettingsToUpdate.push({
					_id: clayer._id,
					layerSettings: { ...clayer.layerSettings, showable: value },
				});
				layerController.handleDeckLayer({ ...clayer, layerSettings: { ...clayer.layerSettings, showable: value } });
				globalState.layers[layerIndex].merge({
					layerSettings: {
						...clayer.layerSettings,
						showable: value,
					},
				});
			}
		});
		updateUserMapSettings({
			variables: {
				settings: {
					user: stateApp.user.mongoId,
					type: 'DatasetVisibility',
					settings: { [dataset._id]: value },
				},
			},
		});
		if (layersSettingsToUpdate.length > 0)
			updateManyUserLayerSettings({
				variables: {
					manySettings: layersSettingsToUpdate,
				},
			});
	};

	const handleTransfer = dataset => {
		mapControlsController.updateState({
			manageSourceLayer: false,
			manageLayer: false,
			manageTransferData: true,
			selectedLayerControl: null,
			selectedDataset: dataset,
		});
	};

	return (
		<>
			<StyledMenuSecondaryHeaderItem>
				<ListItemText primary={'Data Sources'} />
				{headerButton && (
					<StyledListItemSecondaryAction>
						<Button
							id="managerButton"
							onClick={() => headerButton.fn('manageSourceLayer')}
							color="secondary"
							variant="outlined"
							startIcon={<LayersIcon fontSize="medium" />}
						>
							Manager
						</Button>
					</StyledListItemSecondaryAction>
				)}
			</StyledMenuSecondaryHeaderItem>
			<div className={classes.root}>
				{datasets?.map(({ sourceName, Icon, categories, ...rest }) => (
					<Grid
						className="item"
						key={sourceName}
						data-testid={`dataset-${sourceName === 'M1 Platform' ? 'platform' : 'custom'}`}
						onClick={() => onItemClick({ sourceName, Icon, categories, ...rest })}
					>
						<Box borderColor={getBorderColor(sourceName)} borderLeft={4} margin={1} marginLeft={0} textAlign={'start'}>
							<Icon className="dIcon" />
							<Grid container direction="column" justifyContent="center" style={{ paddingLeft: '45px' }}>
								<Grid item md={12}>
									<Grid
										container
										direction="row"
										justifyContent="space-between"
										alignItems="center"
										style={{ width: '100%' }}
									>
										<Grid item style={{ display: 'flex', flexDirection: 'inline' }}>
											<Typography
												style={{
													color: '#ffff',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													width: '254px',
												}}
											>
												{sourceName}
											</Typography>
										</Grid>
										<Grid item className="actionIcons">
											<GridOnIcon id={'grid-icon-' + sourceName} className="actionIcon" />
											{sourceName === 'M1 Platform' && <Box paddingRight="24px" />}
											{sourceName !== 'M1 Platform' && (
												<DatasetMenu
													handleRemove={handleRemove}
													handleTransfer={handleTransfer}
													dataset={{ sourceName, Icon, categories, ...rest }}
												/>
											)}
										</Grid>
									</Grid>
								</Grid>
								<Grid item md={12}>
									<Typography variant="body2" gutterBottom style={{ color: 'lightgray' }}>
										{rest.categoryCount} categories
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Grid>
				))}
			</div>
		</>
	);
}
