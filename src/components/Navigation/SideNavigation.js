import React, { useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip, Badge } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Storage } from '@material-ui/icons';
import BarChartIcon from '@material-ui/icons/BarChart';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import ActivityIcon from '@material-ui/icons/Event';
import MapIcon from '@material-ui/icons/Map';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import FlowIcon from '@material-ui/icons/Repeat';

import { useLazyQuery } from '@apollo/client';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import WorkspaceEditModal from 'components/Navigation/components/WorkSpaceEditModal';
import { FEATURES, ROUTES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import { workspaceTenantName } from 'components/Shared/functions';
import Analytics from 'components/Shared/svgIcons/analytics';
import LandScapeIcon from 'components/Shared/svgIcons/LandscapeBlackIcon';

import { mapControlsController } from 'controllers/mapControlsController';
import { navController } from 'controllers/navStateController';

import { GET_NOTIFICATIONS } from 'graphQL/useQueryGetNotifications';
import { VIEWFILEQUERY } from 'graphQL/useQueryViewFile';
import { GET_WORKSPACE_SETTINGS } from 'graphQL/useQueryWorkspaceSettings';

import { AppContext } from 'AppContext';

import { M1neralLogoNavNoAuth, useStyles } from './Common';
import AdminIcon from '.././Shared/svgIcons/admin-setting';

const M1neralLogoWhiteLetters = styled(M1neralLogoNavNoAuth)`
	width: 260px;
	padding-left: 10px;
	padding-right: 15px;
`;

const SideNavigation = ({ openDrawer, handleListItemClick, handleDrawerClose, handleDrawerOpen }) => {
	const [stateApp] = useContext(AppContext);
	const [notificationsLength, setNotificationsLength] = useState([]);
	const [showWorkspaceModal, setWorkspaceModal] = useState(false);
	const [logoSrc, setLogoSrc] = useState(`${process.env.PUBLIC_URL}/icons/logo-192x192.png`);
	const [logoTitle, setLogoTitle] = useState();
	const theme = useTheme();
	const dispatch = useDispatch();

	const [getNotifications, { data: notificationsData }] = useLazyQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'network-only',
	});
	const [getWorkspaceSettings, { data: workspaceSettings }] = useLazyQuery(GET_WORKSPACE_SETTINGS, {
		fetchPolicy: 'network-only',
	});
	const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
		fetchPolicy: 'no-cache',
	});

	const {
		stateValues: { selectedModule },
	} = navController.useState(['selectedModule']);

	const { mapControlsStateValues } = mapControlsController.useState(['mapGridCardActivated'], 'mapControlsStateValues');

	const classes = useStyles({ mapGridCardActivated: mapControlsStateValues.mapGridCardActivated });

	useEffect(() => {
		getWorkspaceSettings({
			variables: {
				workspaceName: workspaceTenantName(),
			},
		});
	}, [getWorkspaceSettings]);

	useEffect(() => {
		getNotifications({
			variables: {
				userId: stateApp.user.mongoId,
				state: 'Active',
				page: 1,
			},
		});
	}, [getNotifications, stateApp.user]);

	useEffect(() => {
		if (notificationsData?.getNotifications?.totalNotifications) {
			setNotificationsLength(notificationsData?.getNotifications?.totalNotifications);
		}
	}, [notificationsData]);

	useEffect(() => {
		if (viewFileResult?.viewFile?.uri) {
			setLogoSrc(viewFileResult?.viewFile?.uri);
		}
	}, [viewFileResult]);

	useEffect(() => {
		if (workspaceSettings?.workspaceSettings?.workspaceSetting?.title) {
			setLogoTitle(workspaceSettings?.workspaceSettings?.workspaceSetting?.title);
		}
		if (workspaceSettings?.workspaceSettings?.workspaceSetting?.file?.fileUrl) {
			viewFile({ variables: { fileId: workspaceSettings.workspaceSettings.workspaceSetting.file._id } });
		} else {
			setLogoSrc(`${process.env.PUBLIC_URL}/icons/logo-192x192.png`);
		}

		dispatch({ type: 'SET_WORKSPACE_SETTINGS', payload: workspaceSettings?.workspaceSettings?.workspaceSetting });
	}, [workspaceSettings]);

	return (
		<div style={{ zIndex: 1223 }}>
			{' '}
			{/* zIndex greater than zIndex of ExpandableCard */}
			<Drawer
				variant="permanent"
				anchor="left"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: openDrawer,
					[classes.drawerClose]: !openDrawer,
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: openDrawer,
						[classes.drawerClose]: !openDrawer,
					}),
				}}
			>
				<div className={classes.toolbar}>
					<div className={classes.drawerOpenLogo} onClick={handleDrawerOpen}>
						{logoSrc && logoTitle ? (
							<div className={classes.workspaceIcon}>
								<img src={logoSrc} alt="Logo Not Found" />
								<Typography variant="h3">{logoTitle}</Typography>
							</div>
						) : (
							<M1neralLogoWhiteLetters />
						)}
					</div>

					<FeatureFlag feature={FEATURES.EDITABLE_WORKSPACE}>
						<Tooltip title="Edit Workspace" className={classes.editWorkspaceIcon}>
							<IconButton size="small" aria-label="Edit Workspace" onClick={() => setWorkspaceModal(true)}>
								<EditIcon fontSize="medium" />
							</IconButton>
						</Tooltip>
					</FeatureFlag>

					<IconButton className={classes.iconArrow} color="secondary" onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? (
							<ChevronRightIcon />
						) : (
							<>
								<ChevronLeftIcon />
								<MenuIcon className={classes.menuIcon} />
							</>
						)}
					</IconButton>
				</div>
				<List className={classes.menuList}>
					<ListItem
						classes={{
							root: classes.menuListItem,
							selected: classes.menuListItemSelected,
						}}
						button
						selected={selectedModule === ROUTES.DASHBOARD.module}
						onClick={() => handleListItemClick('/dashboard')}
						key="dashboard"
					>
						<div className={classes.tabContent}>
							<Tooltip title="Dashboard" placement="right" classes={{ tooltip: classes.iconTooltip }}>
								<ListItemIcon className={classes.sideNavIcon}>
									{/* TODO: Add actual notification count here */}
									<Badge badgeContent={notificationsLength} color="secondary">
										<DashboardIcon />
									</Badge>
								</ListItemIcon>
							</Tooltip>
							<ListItemText className={`${classes.sideNavText} uppercase`} primary="Dashboard" />
						</div>
					</ListItem>

					<ListItem
						classes={{
							root: classes.menuListItem,
							selected: classes.menuListItemSelected,
						}}
						button
						selected={selectedModule === ROUTES.MAP.module}
						onClick={() => handleListItemClick('/')}
						key="home"
					>
						<div className={classes.tabContent}>
							<Tooltip title="Map" placement="right" classes={{ tooltip: classes.iconTooltip }}>
								<ListItemIcon className={classes.sideNavIcon}>
									<MapIcon />
								</ListItemIcon>
							</Tooltip>
							<ListItemText className={`${classes.sideNavText} uppercase`} primary="Map" />
						</div>
					</ListItem>

					<ListItem
						classes={{
							root: classes.menuListItem,
							selected: classes.menuListItemSelected,
						}}
						button
						selected={selectedModule === ROUTES.CONTACT.module}
						onClick={() => {
							window.setStateApp(stateApp => ({
								...stateApp,
								selectedContact: null,
								contactSearchQuery: null,
							}));
							window.setStateNav(stateApp => ({
								...stateApp,
								contactFromMap: false,
							}));
							handleListItemClick('/contacts');
						}}
						key="contacts"
					>
						<div className={classes.tabContent}>
							<Tooltip title="Contacts" placement="right" classes={{ tooltip: classes.iconTooltip }}>
								<ListItemIcon className={classes.sideNavIcon}>
									<PersonIcon />
								</ListItemIcon>
							</Tooltip>
							<ListItemText className={`${classes.sideNavText} uppercase`} primary="Contacts" />
						</div>
					</ListItem>

					<ListItem
						classes={{
							root: classes.menuListItem,
							selected: classes.menuListItemSelected,
						}}
						button
						selected={selectedModule === ROUTES.FLOW.module}
						onClick={() => handleListItemClick('/flow')}
						key="flow"
					>
						<div className={classes.tabContent}>
							<Tooltip title="Flow" placement="right" classes={{ tooltip: classes.iconTooltip }}>
								<ListItemIcon className={classes.sideNavIcon}>
									<FlowIcon />
								</ListItemIcon>
							</Tooltip>
							<ListItemText className={`${classes.sideNavText} uppercase`} primary="Flow" />
							<ListItemSecondaryAction className={classes.sideNavAction}>
								{/* <Button disabled className={`${classes.betaSideNav3} uppercase`} edge="start" aria-label="beta">
                  beta
                </Button>*/}
							</ListItemSecondaryAction>
						</div>
					</ListItem>

					<FeatureFlag feature={FEATURES.LANDMODULE}>
						<ListItem
							classes={{
								root: classes.menuListItem,
								selected: classes.menuListItemSelected,
							}}
							button
							selected={selectedModule === ROUTES.LANDMODULE.module}
							onClick={() => {
								handleListItemClick('/land/agreements');
							}}
							key="land"
						>
							<div className={classes.tabContent}>
								<Tooltip title="Assets" placement="right" classes={{ tooltip: classes.iconTooltip }}>
									<ListItemIcon className={classes.sideNavIcon}>
										<LandScapeIcon />
									</ListItemIcon>
								</Tooltip>
								<ListItemText className={`${classes.sideNavText} uppercase`} primary="Assets" />
								<ListItemSecondaryAction className={classes.sideNavAction}>
									{/* <Button disabled className={`${classes.betaSideNav3} uppercase`} edge="start" aria-label="beta">
                    beta
                  </Button> */}
								</ListItemSecondaryAction>
							</div>
						</ListItem>
					</FeatureFlag>

					<FeatureFlag feature={FEATURES.REVENUEMODULE}>
						<ListItem
							classes={{
								root: classes.menuListItem,
								selected: classes.menuListItemSelected,
							}}
							button
							selected={selectedModule === ROUTES.REVENUEMODULE.module}
							onClick={() => {
								handleListItemClick('/revenue/properties');
							}}
							key="Revenue"
						>
							<div className={classes.tabContent}>
								<Tooltip title="Revenue" placement="right" classes={{ tooltip: classes.iconTooltip }}>
									<ListItemIcon className={classes.sideNavIcon}>
										<BarChartIcon />
									</ListItemIcon>
								</Tooltip>
								<ListItemText className={`${classes.sideNavText} uppercase`} primary="Revenue" />
								<ListItemSecondaryAction className={classes.sideNavAction}>
									{/* <Button disabled className={`${classes.betaSideNav3} uppercase`} edge="start" aria-label="beta">
                    beta
                  </Button> */}
								</ListItemSecondaryAction>
							</div>
						</ListItem>
					</FeatureFlag>

					<ListItem
						classes={{
							root: classes.menuListItem,
							selected: classes.menuListItemSelected,
						}}
						button
						selected={selectedModule === ROUTES.FILES.module}
						onClick={() => {
							window.setStateApp(stateApp => ({
								...stateApp,
								selectedContact: null,
							}));
							handleListItemClick('/documents');
						}}
						key="documents"
					>
						<div className={classes.tabContent}>
							<Tooltip title="Files" placement="right" classes={{ tooltip: classes.iconTooltip }}>
								<ListItemIcon className={classes.sideNavIcon}>
									<DescriptionIcon />
								</ListItemIcon>
							</Tooltip>
							<ListItemText className={`${classes.sideNavText} uppercase`} primary="Files" />
							{/* <ListItemSecondaryAction className={classes.sideNavAction}>
                <Button
                  disabled
                  className={`${classes.betaSideNav3} uppercase`}
                  edge="start"
                  aria-label="beta"
                >
                  beta
                </Button>
              </ListItemSecondaryAction> */}
						</div>
					</ListItem>
					<ListItem
						classes={{
							root: classes.menuListItem,
							selected: classes.menuListItemSelected,
						}}
						button
						selected={selectedModule === ROUTES.CALENDER.module}
						onClick={() => handleListItemClick('/calendar/activities')}
						key="calendar"
					>
						<div className={classes.tabContent}>
							<Tooltip title="Calendar" placement="right" classes={{ tooltip: classes.iconTooltip }}>
								<ListItemIcon className={classes.sideNavIcon}>
									<ActivityIcon />
								</ListItemIcon>
							</Tooltip>
							<ListItemText className={`${classes.sideNavText} uppercase`} primary="Calendar" />
							{/* <ListItemSecondaryAction className={classes.sideNavAction}>
                <Button disabled className={`${classes.betaSideNav3} uppercase`} edge="start" aria-label="beta">
                  beta
                </Button>
              </ListItemSecondaryAction> */}
						</div>
					</ListItem>

					{/* TEMP REMOVAL */}
					{/* <ListItem
            classes={{
              root: classes.menuListItem,
              selected: classes.menuListItemSelected,
            }}
            button
            onClick={(event) => handleListItemClick("/studio")}
            key="studio"
          >
            <div className={classes.tabContent}>
              <ListItemIcon className={classes.sideNavIcon}>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText
                className={`${classes.sideNavText} uppercase`}
                primary="Studio"
              />
              <ListItemSecondaryAction className={classes.sideNavAction}>
                <Button
                  disabled
                  className={`${classes.betaSideNav3} uppercase`}
                  edge="end"
                  aria-label="beta"
                >
                  beta
                </Button>
              </ListItemSecondaryAction>
            </div>
          </ListItem> */}

					<FeatureFlag feature={FEATURES.ANALYTICS}>
						<ListItem
							classes={{
								root: classes.menuListItem,
								selected: classes.menuListItemSelected,
							}}
							button
							selected={selectedModule === ROUTES.ANALYTICS.module}
							onClick={() => {
								window.setStateApp(stateApp => ({
									...stateApp,
									selectedContact: null,
									contactSearchQuery: null,
								}));
								window.setStateNav(stateApp => ({
									...stateApp,
									contactFromMap: false,
								}));
								handleListItemClick('/analytics');
							}}
							key="analytics"
						>
							<div className={classes.tabContent}>
								<Tooltip title="Analytics" placement="right" classes={{ tooltip: classes.iconTooltip }}>
									<ListItemIcon className={classes.sideNavIcon}>
										<Analytics />
									</ListItemIcon>
								</Tooltip>
								<ListItemText className={`${classes.sideNavText} uppercase`} primary="Analytics" />
								{/* <ListItemSecondaryAction className={classes.sideNavAction}>
                  <Button disabled className={`${classes.betaSideNav3} uppercase`} edge="start" aria-label="beta">
                    beta
                  </Button>
                </ListItemSecondaryAction> */}
							</div>
						</ListItem>
					</FeatureFlag>

					<FeatureFlag feature={FEATURES.DATA}>
						<ListItem
							classes={{
								root: classes.menuListItem,
								selected: classes.menuListItemSelected,
							}}
							button
							selected={selectedModule === ROUTES.DATA.module}
							onClick={() => {
								window.setStateApp(stateApp => ({
									...stateApp,
									selectedContact: null,
									contactSearchQuery: null,
								}));
								window.setStateNav(stateApp => ({
									...stateApp,
									contactFromMap: false,
								}));
								handleListItemClick('/data/wells');
							}}
							key="data"
						>
							<div className={classes.tabContent}>
								<Tooltip title="Data" placement="right" classes={{ tooltip: classes.iconTooltip }}>
									<ListItemIcon className={classes.sideNavIcon}>
										<Storage />
									</ListItemIcon>
								</Tooltip>
								<ListItemText className={`${classes.sideNavText} uppercase`} primary="Data" />
							</div>
						</ListItem>
					</FeatureFlag>

					{(stateApp.user.roles.includes('Admin') || stateApp.user.roles.includes('Owner')) && (
						<ListItem
							classes={{
								root: classes.menuListItem + ' ' + classes.alignBottom,
								selected: classes.menuListItemSelected,
							}}
							button
							selected={selectedModule === ROUTES.ADMIN_SETTINGS.module}
							onClick={() => {
								window.setStateApp(stateApp => ({
									...stateApp,
									selectedContact: null,
									contactSearchQuery: null,
								}));
								window.setStateNav(stateApp => ({
									...stateApp,
									contactFromMap: false,
								}));
								handleListItemClick('/admin/map');
							}}
							key="Admin"
						>
							<div className={classes.tabContent}>
								<Tooltip title="Admin Settings" placement="right" classes={{ tooltip: classes.iconTooltip }}>
									<ListItemIcon className={classes.sideNavIcon}>
										<AdminIcon />
									</ListItemIcon>
								</Tooltip>
								<ListItemText className={`${classes.sideNavText} uppercase`} primary="Admin Settings" />
							</div>
						</ListItem>
					)}
				</List>
			</Drawer>
			{showWorkspaceModal && (
				<WorkspaceEditModal
					workspaceSettings={{
						...workspaceSettings.workspaceSettings?.workspaceSetting,
						fileUrl: logoSrc,
					}}
					setWorkspaceModal={setWorkspaceModal}
					setLogoSrc={setLogoSrc}
					setLogoTitle={setLogoTitle}
					logoTitle={logoTitle}
				/>
			)}
		</div>
	);
};

SideNavigation.propTypes = {
	openDrawer: PropTypes.bool.isRequired,
	handleListItemClick: PropTypes.func.isRequired,
	handleDrawerClose: PropTypes.func.isRequired,
	handleDrawerOpen: PropTypes.func.isRequired,
};

export default SideNavigation;
