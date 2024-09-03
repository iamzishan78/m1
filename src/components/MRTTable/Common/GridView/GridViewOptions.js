import React, { useEffect, useState, memo, useMemo } from 'react';
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
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import StarIcon from '@material-ui/icons/Star';
import BookmarkIcon from '@material-ui/icons/Bookmark';

import LeftDialog from 'components/Shared/LeftDialog';
import { UPDATE_GRID_VIEW, UPDATE_FAVOURITE_GRID_VIEW, UPDATE_DEFAULT_GRID_VIEW } from 'graphQL/useMutationUpdateGridView';
import { ADD_GRID_VIEW } from 'graphQL/useMutationAddGridView';

import { tableController, tableGlobalController } from 'hookstate/tableController';
import { globalStateController } from 'hookstate/globalStateController';

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

function GridViewOptions({ handleDefaultView, module, buttonRef, tableKey, allGridViews, defaultView, fetchGridViews }) {
	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['filters', 'columnVisibility', 'gridView', 'gridViewSettings']);
	const tableStateValues = tableState.stateValues;
	const classes = useStyles();
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const [selectedTab, setSelectedTab] = useState('views');
	const [filterGridView, setFilterGridView] = useState(allGridViews);
	const [search, setSearch] = useState('');
	const [editGridView, setEditGridView] = useState(null);
	const [viewName, setViewName] = useState(`${tableStateValues?.gridView?.selectedGridView?.name}-copy`);
	const [addGridView] = useMutation(ADD_GRID_VIEW, {
		onCompleted: data => {
			fetchGridViews()
			Controller.updateState({
				gridView: {
					selectedGridView: data?.addGridView?.newGridView,
					showViewModal: false,
					showSaveAsNew: false,
				},
			});
		},
	});
	const [updateGridView] = useMutation(UPDATE_GRID_VIEW);
	const [updateFavouriteGridView] = useMutation(UPDATE_FAVOURITE_GRID_VIEW);

	useEffect(() => {
		if (selectedTab === 'views') {
			setFilterGridView(JSON.parse(JSON.stringify(allGridViews)));
		} else if (selectedTab === 'favorites') {
			const data = allGridViews.filter(view => view.favouriteBy?.includes(getUser?._id));
			setFilterGridView(data);
		} else {
			setFilterGridView([]);
		}
	}, [selectedTab]);

	useEffect(() => {
		setTimeout(() => {
			if (document.getElementById('fieldContentInput')) document.getElementById('fieldContentInput').focus();
		}, 100);
	}, [tableStateValues?.gridView?.showSaveAsNew]);

	useEffect(() => {
		if (allGridViews) {
			if (search) {
				setFilterGridView(allGridViews.filter(view => view.name.toLowerCase().includes(search.toLowerCase())));
			} else {
				setFilterGridView(allGridViews);
			}
		}
	}, [search]);

	const handleClick = view => {
		let data = JSON.parse(JSON.stringify(view));
		if (data.type === 'Default') {
			data = handleDefaultView(data, getUser?._id);
		}
		Controller.updateState({
			gridView: { ...tableStateValues.gridView, selectedGridView: data, showViewModal: false },
		});
	};

	// Apply stylinng dynamically for mainn grid
	const gridViewCss = useMemo(() => {
		let top, left = '0px';

		if (buttonRef.current) {
		   // Get the bounding rectangle of the button
		   const rect = buttonRef.current.getBoundingClientRect();
		   // Calculate top and left based on button position
		   top = `${rect.bottom + window.scrollY}px`; // Button bottom + scroll position
		   left = `${rect.left + window.scrollX}px`;  // Button left + scroll position
		} 

		return {
			top,
			left,
		  };
	}, [buttonRef.current])

	return (
		<LeftDialog
			open
			width="325px"
			useLeftKey={true}
			maxHeight={tableStateValues?.gridViewSettings?.cssOverride?.maxHeight || '600px'}
			top={gridViewCss.top}
			left={gridViewCss.left}
			handleClickDialogClose={() =>
				Controller.updateState({ gridView: { ...tableStateValues.gridView, showViewModal: false } })
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
							{filterGridView.map(
								view =>
									view.type === 'Default' && (
										<View
											view={view}
											setEditGridView={setEditGridView}
											setViewName={setViewName}
											updateGridView={updateGridView}
											userId={getUser?._id}
											updateFavouriteGridView={updateFavouriteGridView}
											onClick={handleClick}
											tableKey={tableKey}
											defaultView={defaultView}
											module={module}
										/>
									)
							)}
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
							{tableStateValues?.gridView?.showSaveAsNew && (
								<InputField
									setEditGridView={setEditGridView}
									viewName={viewName}
									setViewName={setViewName}
									addGridView={addGridView}
									user={getUser?._id}
									module={module}
									tableKey={tableKey}
								/>
							)}
							{filterGridView.map(
								view =>
									view.type === 'Custom' &&
									(view._id === editGridView?._id ? (
										<InputField
											editGridViewId={editGridView._id}
											setEditGridView={setEditGridView}
											viewName={viewName}
											setViewName={setViewName}
											addGridView={addGridView}
											user={getUser?._id}
											updateGridView={updateGridView}
											module={module}
											tableKey={tableKey}
										/>
									) : (
										<View
											view={view}
											setEditGridView={setEditGridView}
											setViewName={setViewName}
											updateGridView={updateGridView}
											userId={getUser?._id}
											onClick={handleClick}
											updateFavouriteGridView={updateFavouriteGridView}
											tableKey={tableKey}
											defaultView={defaultView}
											module={module}
										/>
									))
							)}
						</AccordionDetails>
					</Accordion>
				</div>
			</div>
		</LeftDialog >
	);
}

export default memo(GridViewOptions);

function InputField({
	editGridViewId,
	viewName,
	setViewName,
	addGridView,
	updateGridView,
	setEditGridView,
	user,
	module,
	tableKey,
}) {
	const classes = useStyles();
	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['filters', 'columnVisibility', 'sorting', 'groupedField', 'columnPinning', 'columnOrdering', 'gridView']);
	const tableStateValues = tableState.stateValues;

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
					event.preventDefault();
					if (editGridViewId) {
						updateGridView({
							variables: {
								gridView: {
									_id: editGridViewId,
									name: viewName,
								},
							},
							refetchQueries: ['getGridViews'],
						}).then(
							res => {
								tableGlobalController.reInitialized();
							}
						);
					} else {
						addGridView({
							variables: {
								gridView: {
									name: viewName,
									module,
									type: 'Custom',
									user,
									filters: tableStateValues?.filters,
									columns: Object.entries(tableStateValues?.columnVisibility).map(([name, display]) => ({
										name,
										display,
									})),
									sorting: tableStateValues?.sorting,
									columnPinning: tableStateValues?.columnPinning,
									groupedField: tableStateValues?.groupedField || [],
									columnOrdering: tableStateValues?.columnOrdering || [],
								},
							},
							refetchQueries: ['getGridViews'],
						})
					}
					Controller.updateState({
						gridView: { ...tableStateValues.gridView, showSaveAsNew: false, showViewModal: false },
					});
				}
				if (event.key === 'Escape') {
					Controller.updateState({
						gridView: { ...tableStateValues.gridView, showSaveAsNew: false, showViewModal: false },
					});
					setEditGridView(null);
					setViewName('');
				}
			}}
			onBlur={() => {
				Controller.updateState({
					gridView: { ...tableStateValues.gridView, showSaveAsNew: false, showViewModal: false },
				});
				setViewName('');
				setEditGridView(null);
			}}
		/>
	);
}

function View({
	tableKey,
	onClick,
	view,
	setEditGridView,
	setViewName,
	updateFavouriteGridView,
	updateGridView,
	userId,
	defaultView,
	module,
}) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const [showActions, setShowActions] = useState(false);
	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['gridView', 'gridViewSettings']);
	const tableStateValues = tableState.stateValues;
	const [updateDefaultGridView] = useMutation(UPDATE_DEFAULT_GRID_VIEW);

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
				{view.favouriteBy?.includes(userId) && (
					<StarIcon style={{ marginTop: '5px' }}
						onClick={() => {
							updateFavouriteGridView({
								variables: {
									id: view._id,
									userId,
								},
								refetchQueries: ['getGridViews'],
							}).then(
								res => {
									tableGlobalController.reInitialized();
								}
							);
						}}
					/>
				)}
				{!!(view?.defaultDisplayBy?.includes(userId)) && (
					<BookmarkIcon style={{ marginTop: '5px' }}
						onClick={() => {
							updateDefaultGridView({
								variables: {
									id: view._id,
									userId,
									operation: 'REMOVE',
									module
								},
							}).then(
								res => {
									tableGlobalController.reInitialized();
								}
							);
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
				style={{ zIndex: '1305' }}
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
						style={{ width: '250px' }}
						onClick={() => {
							handleClose();
							setEditGridView(view);
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
							updateDefaultGridView({
								variables: {
									id: view._id,
									userId,
									operation: view?.defaultDisplayBy?.includes(userId) ? 'REMOVE' : 'ADD',
									module
								},
							}).then(
								res => {
									tableGlobalController.reInitialized();
								}
							);
							Controller.updateState({ gridView: { ...tableStateValues.gridView, showViewModal: false } });
						}}
					>
						{view?.defaultDisplayBy?.includes(userId) ? 'Remove as default view' : 'Set as default view'}
					</MenuItem>
				)}

				<MenuItem
					style={{ width: '250px' }}
					onClick={() => {
						handleClose();
						updateFavouriteGridView({
							variables: {
								id: view._id,
								userId,
							},
						}).then(
							res => {
								tableGlobalController.reInitialized();
							}
						);
						Controller.updateState({ gridView: { ...tableStateValues.gridView, showViewModal: false } });
					}}
				>
					{view.favouriteBy?.includes(userId) ? 'Remove as favorite' : 'Set as favorite'}
				</MenuItem>
				{view.type !== 'Default' && (
					<MenuItem
						style={{ width: '250px' }}
						onClick={() => {
							handleClose();
							updateGridView({
								variables: {
									gridView: {
										_id: view._id,
										isDeleted: true,
									},
								},
								refetchQueries: ['getGridViews'],
							}).then(
								res => {
									tableGlobalController.reInitialized();
								}
							);
							if (view?._id === tableStateValues?.gridView?.selectedGridView?._id) {
								Controller.updateState({
									gridView: { ...tableStateValues.gridView, showViewModal: false, selectedGridView: defaultView },
								});
							} else {
								Controller.updateState({ gridView: { ...tableStateValues.gridView, showViewModal: false } });
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
