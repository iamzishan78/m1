import React, { useEffect, useState, useMemo, useContext } from 'react';

import {
	IconButton,
	makeStyles,
	Tabs,
	Tab,
	Menu,
	TextField,
	InputAdornment,
	CircularProgress,
	withStyles,
	Typography,
	Grid,
	ClickAwayListener,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';

import { useLazyQuery, useMutation } from '@apollo/client';
import { v4 as uuid } from 'uuid';
// components

// graphql enpoints
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';

import { ADD_LAYER_GROUP, REMOVE_LAYER_GROUP, UPDATE_LAYER_GROUP } from 'graphQL/useMutationLayerGroup';
import { GET_LAYER_GROUPS } from 'graphQL/useQueryLayerGroup';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	popover: props => ({
		'& .MuiPopover-paper': {
			color: '#fff',
			backgroundColor: '#1c2233',
			minWidth: theme.spacing(50),
			top: `${props.top + 30}px !important`,
			left: `${props.left}px !important`,
			// left: '10% !important',
		},
		'& .MuiTabs-indicator': {
			height: '4px',
			backgroundColor: 'rgba(23, 170, 221, 1)',
		},

		'& .MuiFilledInput-root': {
			backgroundColor: '#252d40',
		},
		'& .Mui-disabled': {
			paddingBottom: '10px',
			borderBottom: '1px solid lightgrey',
		},
		'& .MuiMenuItem-root': {
			'&:hover': {
				color: 'rgba(23, 170, 221, 1)',
			},
		},

		'& .MuiCircularProgress-colorPrimary': {
			color: 'rgba(23, 170, 221, 1)',
		},
	}),
	inputField: {
		position: 'relative',
		padding: '20px',
		'& .MuiInputLabel-filled': {
			color: 'lightgrey',
		},
		'& .MuiFilledInput-input': {
			color: '#fff',
		},
	},
	helperText: {
		position: 'absolute',
		right: 30,
		bottom: 20,
		color: 'gray',
		fontSize: 12,
	},
	searchInput: {
		padding: '20px',
	},
	layerGroupListItem: {
		minHeight: 55,
		marginTop: 10,
		'& .MuiIconButton-root': {
			display: 'none',
			color: 'lightgray',
		},
		'&:hover .MuiIconButton-root': {
			display: 'inline',
		},
	},
	layerName: {
		maxWidth: theme.spacing(40),
		textOverflow: 'ellipsis',
		whiteSpace: 'pre-wrap',
		overflow: 'hidden',
		flex: '0 1 auto',
		fontSize: theme.spacing(2),
		padding: '5px 0',
		display: 'inline-flex',
	},
	listContainer: {
		maxHeight: theme.spacing(50),
		overflowY: 'scroll',
	},
}));

const WhiteOutlinedSearch = withStyles({
	root: {
		'& label': {
			color: 'white',
		},
		'& label.Mui-focused': {
			color: 'white',
		},
		'& input': {
			color: 'white',
		},
		'& .MuiOutlinedInput-adornedStart': {
			color: 'grey',
		},
		'& .MuiOutlinedInput-root': {
			'& fieldset, &:hover fieldset': {
				borderColor: 'grey',
			},
		},
	},
})(TextField);

export default function AddGroup({ userId, above }) {
	const [menuPosition, setMenuPos] = useState({ top: 0, left: 0 });
	const classes = useStyles({ ...menuPosition });

	const [tabValue, setTabValue] = useState(0);
	const [createGroupInput, setValue] = useState('');
	const [searchValue, setSearchValue] = useState('');

	const [open, setMenuOpen] = useState(false);

	const [getLayerGroups, { data: layerGroupData }] = useLazyQuery(GET_LAYER_GROUPS);
	const layerGroups = layerGroupData?.getLayerGroups || [];

	const [addLayerGroup, { loading }] = useMutation(ADD_LAYER_GROUP, {
		refetchQueries: ['getLayerGroups'],
		awaitRefetchQueries: true,
	});

	useEffect(() => {
		getLayerGroups({ variables: { userId } });
	}, [getLayerGroups, userId]);

	useEffect(() => {
		// reset states when anchor is changed
		setTabValue(0);
		setValue('');
		setSearchValue('');
	}, [open]);

	useEffect(() => {
		setValue('');
		setSearchValue('');
	}, [tabValue]);

	const handleClick = event => {
		const ele = document.getElementById('layerGroupMenuBtn')?.getBoundingClientRect();

		setMenuOpen(true);
		setMenuPos({ top: ele.top, left: ele.left });
	};

	const handleTabChange = (_, newValue) => {
		const ele = document.getElementById('layerGroupMenuBtn')?.getBoundingClientRect();

		setTabValue(newValue);
		setMenuPos({ top: ele.top, left: ele.left });
	};

	const handleClose = () => {
		setMenuOpen(false);
	};

	const handleSubmit = event => {
		if (event.key === 'Enter' && !loading) {
			const layerGroup = { name: event.target.value, groupId: uuid(), above, createBy: userId };
			addLayerGroup({ variables: { userId, layerGroup } }).then(() => {
				handleClose();
				setValue('');
			});
		}
	};

	const filterSearchedGroups = useMemo(() => {
		const groups = layerGroups.filter(layerGroup => layerGroup.name !== 'Agreements');
		if (!searchValue) {
			return groups;
		}
		const regexp = new RegExp(searchValue.trim(), 'ig');

		return groups.filter(group => group.name.search(regexp) > -1);
	}, [searchValue, open, layerGroups]);

	return (
		<div>
			<IconButton
				size="small"
				aria-controls="group-button"
				aria-haspopup="true"
				onClick={handleClick}
				id="layerGroupMenuBtn"
			>
				<CreateNewFolderIcon style={{ fontSize: 20, color: 'lightgray', marginRight: '10px' }} />
			</IconButton>
			<Menu
				id="group-button"
				keepMounted
				anchorPosition={menuPosition}
				open={open}
				onClose={handleClose}
				className={classes.popover}
			>
				<div className={'menu'}>
					<Tabs value={tabValue} indicatorColor="primary" onChange={handleTabChange} aria-label="disabled tabs example">
						<Tab label="&#8288;Create New" />
						<Tab label="Edit Existing" />
					</Tabs>
					<div role="tabPanel" hidden={tabValue !== 0}>
						<div className={classes.inputField}>
							<TextField
								id="create-group-input"
								label="Group Name"
								variant="filled"
								fullWidth
								onKeyDown={handleSubmit}
								value={createGroupInput}
								onChange={({ target }) => setValue(target.value)}
								InputProps={{
									endAdornment: loading ? (
										<InputAdornment position="end">
											<CircularProgress size={30} />
										</InputAdornment>
									) : (
										<></>
									),
								}}
							/>
							<Typography className={classes.helperText}>Enter to save</Typography>
						</div>
					</div>
					<div role="tabPanel" hidden={tabValue !== 1}>
						<div className={classes.searchInput}>
							<WhiteOutlinedSearch
								id="group-search-input"
								label="Search by group name"
								variant="outlined"
								color="white"
								fullWidth
								onKeyDown={handleSubmit}
								value={searchValue}
								onChange={({ target }) => setSearchValue(target.value)}
								InputProps={{
									startAdornment: <SearchIcon />,
								}}
							/>
							<div className={classes.listContainer}>
								{filterSearchedGroups.map((group, index) => (
									<LayerGroupItem key={`${group.id}_${index}`} layerGroup={group} />
								))}
							</div>
						</div>
					</div>
				</div>
			</Menu>
		</div>
	);
}

const LayerGroupItem = ({ layerGroup }) => {
	const classes = useStyles();
	const [editing, setEditing] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [stateApp] = useContext(AppContext);

	const [updateLayerGroup, { loading: updating }] = useMutation(UPDATE_LAYER_GROUP, {
		refetchQueries: ['getLayerGroups', 'getAllLayerSettingsByUser'],
		awaitRefetchQueries: true,
	});
	const [removeLayerGroup, { loading: removing }] = useMutation(REMOVE_LAYER_GROUP, {
		refetchQueries: ['getLayerGroups', 'getAllLayerSettingsByUser'],
		awaitRefetchQueries: true,
	});

	const handleSubmit = e => {
		if (e.key === 'Enter' && !updating) {
			updateLayerGroup({
				variables: {
					layerGroupId: layerGroup.groupId,
					layerGroupName: e.target.value,
				},
			}).then(res => {
				setEditing(false);
			});
		}
	};

	const deleteGroup = () => {
		removeLayerGroup({
			variables: {
				userId: stateApp.user.mongoId,
				layerGroupId: layerGroup.groupId,
			},
		});
	};
	return (
		<Grid container justifyContent="space-between" alignItems="center" className={classes.layerGroupListItem}>
			<Grid item xs style={{ display: 'flex', alignItems: 'center' }}>
				{editing ? (
					<ClickAwayListener onClickAway={() => setEditing(false)}>
						<WhiteOutlinedSearch
							id={'inline-edit-input' + layerGroup.groupId}
							variant="outlined"
							color="white"
							fullWidth
							size="small"
							defaultValue={layerGroup.name}
							onKeyDown={handleSubmit}
							InputProps={{
								endAdornment: updating ? <CircularProgress size={20} /> : null,
							}}
						/>
					</ClickAwayListener>
				) : (
					<Typography className={classes.layerName} variant="subtitle2">
						{layerGroup.name}
					</Typography>
				)}
				{!editing && (
					<IconButton size="small" onClick={() => setEditing(true)}>
						<CreateIcon />
					</IconButton>
				)}
			</Grid>
			<Grid item style={{ flexGrow: '0', flexShrink: '1' }}>
				{removing ? (
					<CircularProgress size={20} />
				) : (
					<IconButton size="small" onClick={() => setOpenDialog(true)}>
						<DeleteIcon />
					</IconButton>
				)}
			</Grid>
			{openDialog && (
				<DeleteConfirmationDialogContent
					header={'Delete Layer Group'}
					onClose={() => setOpenDialog(false)}
					deleteFunc={deleteGroup}
					m1nSelectedRowsIds={null}
					setM1nSelectedRowsIndexes={() => {}}
				>
					Do you want to delete "{layerGroup.name}" layer group?
				</DeleteConfirmationDialogContent>
			)}
		</Grid>
	);
};
