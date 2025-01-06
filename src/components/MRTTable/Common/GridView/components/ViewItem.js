import React, { useState } from 'react';


import { Menu, MenuItem, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MoreVert as MoreVertIcon, Star as StarIcon, Bookmark as BookmarkIcon } from '@material-ui/icons';

import PropTypes from 'prop-types';

import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';

import { globalStateController } from 'hookstate/globalStateController';

const useStyles = makeStyles(() => ({
	actionIcons: {
		display: 'flex',
		padding: '0px !important',
		'& svg': {
			fill: 'rgba(0, 0, 0, 0.87) !important',
			fontSize: '20px',
		},
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
	viewContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	viewName: {
		display: 'flex',
		cursor: 'pointer',
	},
	iconMargin: {
		marginTop: '5px',
	},
	menu: {
		zIndex: 1305,
	},
	menuItem: {
		width: '250px',
	},
}));

function ViewItem({ moduleName, view }) {
	const classes = useStyles();
	const [showActions, setShowActions] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [allowEdit, setAllowEdit] = useState(false);
	const [viewName, setViewName] = useState('View Name');

	const userId = globalStateController.getValue('user').mongoId;
	const ViewController = viewStateController(moduleName);

	const isFavourite = view?.favouriteBy?.includes(userId);
	const isDefault = view?.defaultDisplayBy?.includes(userId);

	const handleTextInput = event => {
		event.stopPropagation();

		if (event.key === 'Enter') {
			event.preventDefault();
			ViewController.updateView({
				id: view?._id || null,
				fieldsToUpdate: { name: viewName },
			});
		}

		if (event.key === 'Escape' || event.key === 'Enter') {
			ViewController.updateState({ fetchViewSettings: false });
			setAllowEdit(false);
			setViewName('');
		}
	};

	return allowEdit || !view ? (
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
			placeholder={'View Name'}
			helperText="Return to save"
			autoFocus
			onChange={event => setViewName(event.target.value)}
			onKeyDown={handleTextInput}
		/>
	) : (
		<div
			className={classes.viewContainer}
			onFocus={() => setShowActions(true)}
			onMouseOver={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
		>
			<span className={classes.actionIcons}>
				<div className={classes.viewName} onClick={() => ViewController.applyView(view)}>
					{view.name}
				</div>

				{isFavourite && (
					<StarIcon
						className={classes.iconMargin}
						onClick={() => ViewController.updateViewPreference(view, 'favourite')}
					/>
				)}

				{isDefault && (
					<BookmarkIcon
						className={classes.iconMargin}
						onClick={() => ViewController.updateViewPreference(view, 'default')}
					/>
				)}
			</span>
			{showActions && (
				<span className={classes.actionIcons}>
					<MoreVertIcon onClick={event => setAnchorEl(event.currentTarget)} />
				</span>
			)}
			<Menu
				className={classes.menu}
				id="menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				getContentAnchorEl={null}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				{view.type !== 'Default' && (
					<>
						<MenuItem
							className={classes.menuItem}
							onClick={() => {
								setAnchorEl(null);
								setAllowEdit(true);
								setViewName(view.name);
							}}
						>
							Rename view
						</MenuItem>

						<MenuItem
							className={classes.menuItem}
							onClick={() => {
								setAnchorEl(null);
								ViewController.updateViewPreference(view, 'default');
							}}
						>
							{isDefault ? 'Remove as default view' : 'Set as default view'}
						</MenuItem>

						<MenuItem
							className={classes.menuItem}
							onClick={() => {
								setAnchorEl(null);
								ViewController.updateView({
									id: view?._id,
									fieldsToUpdate: { isDeleted: true },
								});
							}}
						>
							Delete view
						</MenuItem>
					</>
				)}

				<MenuItem
					className={classes.menuItem}
					onClick={() => {
						setAnchorEl(null);
						ViewController.updateViewPreference(view, 'favourite');
					}}
				>
					{isFavourite ? 'Remove as favorite' : 'Set as favorite'}
				</MenuItem>
			</Menu>
		</div>
	);
}

ViewItem.propTypes = {
	moduleName: PropTypes.string.isRequired,
	view: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		favouriteBy: PropTypes.arrayOf(PropTypes.string),
		defaultDisplayBy: PropTypes.arrayOf(PropTypes.string),
	}).isRequired,
};

export default ViewItem;
