import React, { useEffect, useState, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	TextField,
	InputAdornment,
	IconButton,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Menu,
	MenuItem,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useMutation } from '@apollo/client';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import LeftDialog from 'components/Shared/LeftDialog';
import { UPSERT_MAP_VIEW } from 'graphQL/useMutationUpsertMapView';

import { tableGlobalController } from 'hookstate/tableController';
import { globalStateController } from 'hookstate/globalStateController';

import StarIcon from '@material-ui/icons/Star';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { layerFiltersController } from 'hookstate/layerFiltersController';

const useStyles = makeStyles(() => ({
	container: {
		padding: '0 !important',
		display: 'flex',
		flexFlow: 'column',
		'& .MuiPaper-elevation1': {
			boxShadow: 'none !important',
		},
	},
	details: {
		display: 'block',
		'& div': {
			padding: '5px !important',
		},
	},
	searchField: {
		margin: '0 !important',
		padding: '10px !important',
		width: '100% !important',
	},
	summary: {
		backgroundColor: '#F2F2F2',
		height: '50px !important',
		minHeight: '40px !important',
	},
	textField: {
		height: '100%',
		width: '100%',
		paddingTop: '15px',
		'& .MuiOutlinedInput-input': {
			padding: '5px',
		},
		'& .MuiFormHelperText-contained': {
			justifyContent: 'flex-end',
			display: 'flex',
		},
	},
	actionIcons: {
		padding: '0px !important',
		'& svg': {
			fill: 'rgba(0, 0, 0, 0.87) !important',
			fontSize: '20px',
		},
	},
	selectedType: {
		borderBottom: '4px solid #01B0F0',
		display: 'inline',
		cursor: 'pointer',
	},
	unSelectedType: {
		display: 'inline',
		color: '#827F7F',
		cursor: 'pointer',
	},
}));

const viewOptions = [
	{
		label: 'All Views',
		value: 'views',
	},
	{
		label: 'Favorites',
		value: 'favorites',
	},
];

function MapViewOptions({ tableKey, allMapViews, defaultView }) {
	const mapViewState = globalStateController.useState(['filters', 'mapView']);
	const mapViewStateValues = mapViewState.stateValues;
	const classes = useStyles();
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const [selectedTab, setSelectedTab] = useState('views');
	const [filterMapView, setFilterMapView] = useState(allMapViews);
	const [search, setSearch] = useState('');
	const [editMapView, setEditMapView] = useState(null);
	const [viewName, setViewName] = useState(`${mapViewStateValues?.mapView?.selectedMapView?.name || 'view'}-copy`);
	const [upsertMapView] = useMutation(UPSERT_MAP_VIEW, {
		onCompleted: data => {
			// fetchMapViews();
			const mapView = globalStateController.getValue('mapView');
			globalStateController.updateState({
				mapView: {
					...mapView,
					showViewModal: false,
					showSaveAsNew: false,
				},
			});
		},
	});

	useEffect(() => {
		if (selectedTab === 'views') {
			setFilterMapView(JSON.parse(JSON.stringify(allMapViews)));
		} else if (selectedTab === 'favorites') {
			const data = allMapViews.filter(view => view.isFavourite);
			setFilterMapView(data);
		} else {
			setFilterMapView([]);
		}
	}, [selectedTab, allMapViews, getUser?._id]);

	useEffect(() => {
		setTimeout(() => {
			if (document.getElementById('fieldContentInput')) document.getElementById('fieldContentInput').focus();
		}, 100);
	}, [mapViewStateValues?.mapView?.showSaveAsNew]);

	useEffect(() => {
		if (allMapViews) {
			if (search) {
				setFilterMapView(allMapViews.filter(view => view.name.toLowerCase().includes(search.toLowerCase())));
			} else {
				setFilterMapView(allMapViews);
			}
		}
	}, [search, allMapViews]);

	const handleClick = view => {
		let data = JSON.parse(JSON.stringify(view));
		const prevMapView = globalStateController.getValue('mapView');
		prevMapView?.selectedMapView?.filters?.forEach(filter => {
			layerFiltersController.resetVariables(filter?.dataSourceName);
		});
		globalStateController.updateState({
			mapView: { ...mapViewStateValues.mapView, selectedMapView: data, showViewModal: false },
			viewChanged: true,
		});
	};

	return (
		<LeftDialog
			open
			width="325px"
			maxHeight={'600px'}
			top={`165px !important`}
			left={'5px'}
			zIndex={1300}
			handleClickDialogClose={() =>
				globalStateController.updateState({ mapView: { ...mapViewStateValues.mapView, showViewModal: false } })
			}
		>
			<div className={classes.container}>
				<div style={{ flex: '0 1 auto' }}>
					<TextField
						value={search}
						onChange={e => {
							setSearch(e.target.value);
						}}
						className={classes.searchField}
						margin="dense"
						variant="outlined"
						placeholder="Search views"
						InputProps={{
							startAdornment: (
								<InputAdornment>
									<IconButton size="small">
										<SearchIcon htmlColor="#fff" />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<div style={{ marginTop: 10 }}>
						{viewOptions.map(option => (
							<div
								style={{ marginLeft: 13 }}
								onClick={() => setSelectedTab(option.value)}
								className={selectedTab === option.value ? classes.selectedType : classes.unSelectedType}
							>
								{option.label}
							</div>
						))}
					</div>

					<Accordion defaultExpanded style={{ marginTop: 20 }}>
						<AccordionSummary
							expandIcon={<KeyboardArrowDownIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
							className={classes.summary}
						>
							Standard
						</AccordionSummary>
						<AccordionDetails className={classes.details}>
							<View
								view={defaultView}
								// setEditGridView={setEditGridView}
								setViewName={setViewName}
								// updateGridView={updateGridView}
								userId={getUser?._id}
								// updateFavouriteGridView={updateFavouriteGridView}
								onClick={handleClick}
								tableKey={tableKey}
								defaultView={defaultView}
								module={module}
							/>
						</AccordionDetails>
					</Accordion>
				</div>

				<div style={{ flex: '1 1 auto', overflow: 'auto' }}>
					<Accordion defaultExpanded style={{ margin: 0 }}>
						<AccordionSummary
							expandIcon={<KeyboardArrowDownIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
							className={classes.summary}
						>
							Custom
						</AccordionSummary>
						<AccordionDetails className={classes.details}>
							{mapViewStateValues?.mapView?.showSaveAsNew && (
								<InputField
									setEditMapView={setEditMapView}
									viewName={viewName}
									setViewName={setViewName}
									upsertMapView={upsertMapView}
									user={getUser?._id}
									tableKey={tableKey}
									defaultView={defaultView}
								/>
							)}
							{filterMapView.map(
								view =>
									view.type === 'Custom' &&
									(view._id === editMapView?._id ? (
										<InputField
											editMapViewId={editMapView._id}
											setEditMapView={setEditMapView}
											viewName={viewName}
											setViewName={setViewName}
											upsertMapView={upsertMapView}
											user={getUser?._id}
											tableKey={tableKey}
											defaultView={defaultView}
										/>
									) : (
										<View
											view={view}
											setEditMapView={setEditMapView}
											setViewName={setViewName}
											userId={getUser?._id}
											onClick={handleClick}
											upsertMapView={upsertMapView}
											tableKey={tableKey}
											defaultView={defaultView}
										/>
									))
							)}
						</AccordionDetails>
					</Accordion>
				</div>
			</div>
		</LeftDialog>
	);
}

export default memo(MapViewOptions);

function InputField({ editMapViewId, viewName, setViewName, upsertMapView, setEditMapView, defaultView }) {
	const classes = useStyles();
	const mapViewState = globalStateController.useState(['filters', 'mapView']);
	const mapViewStateValues = mapViewState.stateValues;

	return (
		<TextField
			key="fieldContentInput"
			id="fieldContentInput"
			className={classes.textField}
			variant="outlined"
			size="small"
			autoComplete="nope"
			fullWidth
			label={null}
			value={viewName}
			helperText="Return to save"
			onChange={e => {
				e.persist();
				setViewName(e.target.value);
			}}
			onKeyDown={event => {
				event.stopPropagation();
				if (event.key === 'Enter') {
					const selectedMapView = globalStateController.getValue('mapView')?.selectedMapView || {};
					event.preventDefault();
					if (editMapViewId) {
						upsertMapView({
							variables: {
								mapView: {
									_id: editMapViewId,
									name: viewName,
								},
							},
							refetchQueries: ['getMapViews'],
						}).then(res => {
							tableGlobalController.reInitialized();
						});
					} else {
						selectedMapView.name = viewName;
						upsertMapView({
							variables: {
								mapView: {
									name: viewName,
									type: 'Custom',
									userId: globalStateController.getValue('user').mongoId,
									filters: selectedMapView.filters,
								},
							},
							refetchQueries: ['getMapViews'],
						});
					}
					globalStateController.updateState({
						mapView: { ...mapViewStateValues.mapView, showViewModal: false, selectedMapView: selectedMapView },
						viewChanged: true,
					});
				}
				if (event.key === 'Escape') {
					globalStateController.updateState({
						mapView: { ...mapViewStateValues.mapView, showSaveAsNew: false, showViewModal: false },
					});
					setEditMapView(null);
					setViewName('');
				}
			}}
			onBlur={() => {
				globalStateController.updateState({
					mapView: { ...mapViewStateValues.mapView, showSaveAsNew: false, showViewModal: false },
				});
				setViewName('');
				setEditMapView(null);
			}}
		/>
	);
}

function View({ onClick, view, setEditMapView, setViewName, userId, defaultView, upsertMapView }) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const [showActions, setShowActions] = useState(false);
	const mapViewState = globalStateController.useState(['mapView']);
	const mapViewStateValues = mapViewState.stateValues;

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div
			style={{ display: 'flex', justifyContent: 'space-between' }}
			onFocus={() => setShowActions(true)}
			onMouseOver={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
		>
			<span style={{ display: 'flex' }} className={classes.actionIcons}>
				<div style={{ cursor: 'pointer' }} onClick={() => onClick(view)}>
					{view.name}
				</div>
				{view.isFavourite && (
					<StarIcon
						style={{ marginTop: '5px' }}
						onClick={() => {
							upsertMapView({
								variables: {
									mapView: {
										_id: view._id,
										userId,
										isFavourite: !view.isFavourite,
									},
								},
								refetchQueries: ['getMapViews'],
							}).then(res => {
								tableGlobalController.reInitialized();
							});
						}}
					/>
				)}
				{!!view?.defaultDisplayBy?.includes(userId) && (
					<BookmarkIcon
						style={{ marginTop: '5px' }}
						onClick={() => {
							upsertMapView({
								variables: {
									_id: view._id,
									userId,
									operation: 'REMOVE',
								},
							}).then(res => {
								tableGlobalController.reInitialized();
							});
						}}
					/>
				)}
			</span>
			{showActions && (
				<span className={classes.actionIcons}>
					{/* {view.type === 'Custom' && view.isPrivate ? <LockIcon /> : <LockOpenIcon />} */}
					<MoreVertIcon onClick={handleClick} />
				</span>
			)}
			<Menu
				sx={{
					'& .MuiPaper-root': {
						zIndex: 13005,
					},
				}}
				id="menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				getContentAnchorEl={null}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				{view.type !== 'Default' && (
					<MenuItem
						style={{ width: '250px', zIndex: '999999 !important' }}
						onClick={() => {
							handleClose();
							setEditMapView(view);
							setViewName(view.name);
						}}
					>
						Rename view
					</MenuItem>
				)}

				{view.type !== 'Default' && (
					<MenuItem
						style={{ width: '250px' }}
						onClick={() => {
							handleClose();
							upsertMapView({
								variables: {
									mapView: {
										_id: view._id,
										userId,
										operation: view?.defaultDisplayBy?.includes(userId) ? 'REMOVE' : 'ADD',
										isCurrent: !view?.isCurrent,
									},
								},
							}).then(res => {
								tableGlobalController.reInitialized();
							});
							globalStateController.updateState({
								mapView: { selectedMapView: { ...view, isCurrent: !view?.isCurrent } },
								viewChanged: true,
							});
						}}
					>
						{view?.isCurrent ? 'Remove as default view' : 'Set as default view'}
					</MenuItem>
				)}

				<MenuItem
					style={{ width: '250px' }}
					onClick={() => {
						handleClose();
						upsertMapView({
							variables: {
								mapView: {
									_id: view._id,
									userId,
									isFavourite: !view.isFavourite,
								},
							},
						}).then(res => {
							tableGlobalController.reInitialized();
						});
						globalStateController.updateState({ mapView: { ...mapViewStateValues.mapView, showViewModal: false } });
					}}
				>
					{view.isFavourite ? 'Remove as favorite' : 'Set as favorite'}
				</MenuItem>
				{view.type !== 'Default' && (
					<MenuItem
						style={{ width: '250px' }}
						onClick={() => {
							handleClose();
							upsertMapView({
								variables: {
									mapView: {
										_id: view._id,
										isDeleted: true,
									},
								},
								refetchQueries: ['getMapViews'],
							}).then(res => {
								tableGlobalController.reInitialized();
							});
							if (view?._id === mapViewStateValues?.mapView?.selectedMapView?._id) {
								globalStateController.updateState({
									mapView: { ...mapViewStateValues.mapView, showViewModal: false, selectedMapView: defaultView },
									viewChanged: true,
								});
							} else {
								globalStateController.updateState({
									mapView: { ...mapViewStateValues.mapView, showViewModal: false, selectedMapView: defaultView },
									viewChanged: true,
								});
							}
						}}
					>
						Delete view
					</MenuItem>
				)}
			</Menu>
		</div>
	);
}
