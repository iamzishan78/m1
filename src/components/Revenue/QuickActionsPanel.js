import { IconButton } from '@material-ui/core';
import { Divider, Grid, Typography, Drawer } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { SIDE_PANEL_MENU_ITEMS_LIST } from 'components/Revenue/Revenue';

import { toggleQuickActionsPanel } from 'store/actions/commonActions';

import { useStyles, StyledMenu, StyledMenuItem } from './styles';

export default function QuickActionsPanel({ children, handlePanelStateChange, expandedPanel, activeModule }) {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();
	const [sideBarPanel, setSideBarPanel] = useState(false);

	const handleMenuItemClick = path => {
		history.push(path);
	};

	useEffect(() => {
		if (location.pathname.includes('details')) {
			dispatch(toggleQuickActionsPanel(false));
			setSideBarPanel(true);
		} else {
			dispatch(toggleQuickActionsPanel(true));
			setSideBarPanel(false);
		}
		return () => {
			dispatch(toggleQuickActionsPanel(true)); // Dispatch the action on unmount
		};
	}, [location.pathname]);

	return (
		<>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={expandedPanel}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<Grid container direction="row" justify="space-between" display="flex" className={classes.header}>
					<Grid item style={{ alignItems: 'center' }}>
						<Typography variant="h5" style={{ fontWeight: 'normal', paddingLeft: '23px' }}>
							Revenue
						</Typography>
					</Grid>
					<Grid item>
						<IconButton className={classes.iconArrow} color="secondary" onClick={handlePanelStateChange}>
							<>
								<ChevronLeftIcon />
								<MenuIcon id="menuIcon" className={classes.menuIcon} />
							</>
						</IconButton>
					</Grid>
				</Grid>
				<Divider />
				<div style={{ paddingLeft: '23px' }}>
					<Typography className={classes.quickActionText}>Quick Actions</Typography>
					<StyledMenu>
						{Object.keys(SIDE_PANEL_MENU_ITEMS_LIST)
							.filter(key => !SIDE_PANEL_MENU_ITEMS_LIST[key].isExcluded)
							.map((key, index) => (
								<StyledMenuItem
									onClick={() => handleMenuItemClick(SIDE_PANEL_MENU_ITEMS_LIST[key].link)}
									key={index}
									style={{
										backgroundColor: activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST[key].title ? '#4B618F' : '',
									}}
								>
									<ListItemText>{SIDE_PANEL_MENU_ITEMS_LIST[key].title}</ListItemText>
								</StyledMenuItem>
							))}
					</StyledMenu>
				</div>
			</Drawer>
			<div
				className={clsx({
					[classes.revenueRootExpanded]: expandedPanel,
					[classes.revenueRootCollapsed]: !expandedPanel,
				})}
			>
				{children}
			</div>
			<div
				className={classes.pulloutBox}
				onClick={handlePanelStateChange}
				style={{ display: !sideBarPanel ? 'flex' : 'none' }}
			>
				{expandedPanel ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
			</div>
		</>
	);
}
