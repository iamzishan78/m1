import React, { useState, memo } from 'react';

import { Breadcrumbs, Typography, IconButton, Menu, MenuItem, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore as ExpandMoreIcon, NavigateNext as NavigateNextIcon } from '@material-ui/icons';

import PropTypes from 'prop-types';


import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';

const useStyles = makeStyles(() => ({
	root: props => ({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'left',
		...props.styleOverride.bgColor,
	}),
	iconButton: props => ({
		...props.styleOverride.color,
	}),
	typography: props => ({
		marginLeft: '10px',
		fontSize: '16px',
		...props.styleOverride.color,
	}),
	breadcrumbSeparator: props => ({
		...props.styleOverride.color,
	}),
	viewContainer: {
		display: 'flex',
		color: '#18AADD',
		fontSize: '16px',
		cursor: 'pointer',
	},
	italicText: {
		fontStyle: 'italic',
	},
	expandIcon: {
		height: '0px',
		color: '#18AADD',
		fontSize: '16px',
		cursor: 'pointer',
	},
	menu: {
		zIndex: 1305,
	},
	menuItem: {
		width: '250px',
	},
	circularProgressContainer: {
		width: '24px',
		height: '24px',
	},
}));

function ViewComponent({ moduleName, buttonRef }) {
	const [showIcon, setShowIcon] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const ViewController = viewStateController(moduleName);
	const { jsxEl: Icon } = ViewController.getValue('icon');
	const { label, styleOverride } = ViewController.getValues(['label', 'styleOverride']);
	const {
		stateValues: { isLoading, selectedView },
	} = ViewController.useState(['isLoading', 'selectedView']);
	const classes = useStyles({ styleOverride });

	return (
		<div className={classes.root}>
			<div ref={buttonRef}>
				{isLoading ? (
					<div className={classes.circularProgressContainer}>
						<CircularProgress size={24} color="secondary" />
					</div>
				) : (
					<IconButton className={classes.iconButton} onClick={() => ViewController.updateState({ isViewOpen: true })}>
						<Icon />
					</IconButton>
				)}
			</div>

			<Breadcrumbs
				separator={<NavigateNextIcon fontSize="small" className={classes.breadcrumbSeparator} />}
				aria-label="breadcrumb"
			>
				<Typography className={classes.typography} color="inherit">
					{label}
				</Typography>
				<div>
					<div
						className={classes.viewContainer}
						onClick={event => setAnchorEl(event.currentTarget)}
						onFocus={() => setShowIcon(true)}
						onMouseOver={() => setShowIcon(true)}
						onMouseLeave={() => setShowIcon(false)}
					>
						<Typography>
							<span className={selectedView?.isModified ? classes.italicText : ''}>{selectedView?.name}</span>
						</Typography>
						<span className={classes.expandIcon}>{showIcon && <ExpandMoreIcon />}</span>
					</div>
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
						<MenuItem
							className={classes.menuItem}
							disabled={selectedView?.type === 'Default'}
							onClick={() => {
								setAnchorEl(null);
								ViewController.updateState({ fetchViewSettings: true });
								ViewController.updateView({
									id: selectedView?._id,
								});
							}}
						>
							Update view
						</MenuItem>
						<MenuItem
							onClick={() => {
								setAnchorEl(null);
								ViewController.updateState({ isViewOpen: true, fetchViewSettings: true });
							}}
						>
							Save as new view
						</MenuItem>
					</Menu>
				</div>
			</Breadcrumbs>
		</div>
	);
}

ViewComponent.propTypes = {
	moduleName: PropTypes.string,
	buttonRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]), // Support both callback refs and object refs
};

export default memo(ViewComponent);
