import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useHistory, useLocation } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { Divider, Grid, Typography, Drawer } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import MenuIcon from '@material-ui/icons/Menu';

import { useStyles, StyledMenu, StyledMenuItem } from 'components/Land/style';

import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import AdvanceSearch from 'components/Land/components/AdvanceSearch';

export default function QuickActionsPanel({
	children,
	title,
	actions,
	handlePanelStateChange,
	quickActionsPanelState,
	activeModule,
	PanelAction,
}) {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const [sideBarPanel, setSideBarPanel] = useState(false);
	const handleMenuItemClick = path => {
		history.push(path);
	};

	useEffect(() => {
		if (location.pathname.includes('agreement/details')) {
			handlePanelStateChange(false);
			setSideBarPanel(true);
		} else {
			handlePanelStateChange(true);
			setSideBarPanel(false);
		}
	}, [location.pathname]);

	return (
		<>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={quickActionsPanelState}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<Grid container direction="row" justify="space-between" display="flex" className={classes.header}>
					<Grid item style={{ alignItems: 'center', paddingLeft: '23px' }}>
						<Typography variant="h5" style={{ fontWeight: 'normal' }}>
							{title}
						</Typography>
					</Grid>
					<Grid item>
						<IconButton className={classes.iconArrow} color="secondary" onClick={() => handlePanelStateChange(false)}>
							<>
								<ChevronLeftIcon />
								<MenuIcon id="menuIcon" className={classes.menuIcon} />
							</>
						</IconButton>
					</Grid>
				</Grid>
				{PanelAction ? <PanelAction /> : <Divider />}
				<div style={{ paddingLeft: '23px' }}>
					<Typography className={classes.quickActionText}>Quick Actions</Typography>
					<StyledMenu id="quickActionPanel">
						{Object.keys(actions)
							.filter(key => !actions[key].isExcluded && actions[key].featureFlag)
							.map((key, index) => (
								<FeatureFlag feature={FEATURES[actions[key].featureFlag]} noCheck={actions[key].noCheck}>
									<StyledMenuItem
										onClick={() => handleMenuItemClick(actions[key].link)}
										key={index}
										isSelected
										style={{
											backgroundColor: activeModule.title === actions[key].title ? '#4B618F' : '',
										}}
									>
										<ListItemText id={`${actions[key].title} 101`}>{actions[key].title}</ListItemText>
									</StyledMenuItem>
								</FeatureFlag>
							))}
					</StyledMenu>
				</div>
				<AdvanceSearch activeModule={activeModule} />
			</Drawer>
			<FeatureFlag feature={FEATURES[activeModule.featureFlag]} noCheck={activeModule.noCheck}>
				<div
					className={clsx({
						[classes.landRootExpanded]: quickActionsPanelState,
						[classes.landRootCollapsed]: !quickActionsPanelState,
					})}
				>
					{children}
				</div>
				<div
					className={classes.pulloutBox}
					onClick={() => handlePanelStateChange(!quickActionsPanelState)}
					style={{ display: !sideBarPanel ? 'flex' : 'none' }}
				>
					{quickActionsPanelState ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
				</div>
			</FeatureFlag>
		</>
	);
}
