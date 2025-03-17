import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import HeadsetIcon from '@material-ui/icons/Headset';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import AdminSettingsAppBar from 'components/Navigation/AppBar/AdminSettings';
import RevenueAppBar from 'components/Navigation/AppBar/Revenue';
import ProfileMenu from 'components/Profile/ProfileMenu';
import { ROUTES } from 'components/Shared/FeatureFlag/common';

import { contactManagementRoutes } from 'utils/data';

import { AppContext } from 'AppContext';
import { navController } from 'stateManagement/navStateController';
import { slidoutStateController } from 'stateManagement/slidoutStateController';

import DataAppBar from './AppBar/DataAppBar';
import LandAppBar from './AppBar/Land';
import { useStyles } from './Common';
import ActivityDashboardSearch from './components/ActivityDashboardSearch';
import ActivitySearch from './components/ActivitySearch';
import AnalyticsSearch from './components/AnalyticsSearch';
import ContactBreadcrumbs from './components/ContactBreadcrumbs';
import ContactFormModal from './components/ContactFormModal';
import ContactSearch from './components/ContactSearch';
import DealSearch from './components/DealSearch';
import DocumentSearch from './components/DocumentSearch';
import SearchBarWithToggleButton from './components/SearchBarWithToggleButton';
import SupportCenterModal from './components/SupportCenter';
import SideNavigation from './SideNavigation';

const TabPanel = props => {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			color="secondary"
			component="div"
			role="tabpanel"
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	);
};

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

export default function Navigation(props) {
	const [stateApp] = useContext(AppContext);

	const [openSupportCenter, setOpenSupportCenter] = useState(false);
	const [openContactForm, setOpenContactForm] = useState(false);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [supportDrawer, setSupportDrawer] = useState(false);
	const [matchTrack, setMatchTrack] = useState(false);
	const [matchActivities, setMatchActivities] = useState(false);
	const [matchFind, setMatchFind] = useState(false);
	const [matchDocument] = useState(false);

	let history = useHistory();
	let location = useLocation();
	const classes = useStyles({
		user: stateApp.user,
		// Determine if the component is rendered on the map page based on location pathname and props
		isMap: location.pathname === '/' || location.pathname.startsWith('/map/') || props.isMap,
		isCalendar: location.pathname.startsWith('/calendar'),
	});

	useEffect(() => {
		Object.values(ROUTES).forEach(value => {
			if (
				value.route.equals?.some(path => path === location.pathname) ||
				value.route.startsWith?.some(path => location.pathname.startsWith(path))
			) {
				navController.updateState({
					selectedModule: value.module,
				});
			}
		});
	}, [location]);

	useEffect(() => {
		if (location.pathname === '/track') {
			setMatchTrack(true);
		} else {
			setMatchTrack(false);
		}
	}, [location.pathname]);

	useEffect(() => {
		if (location.pathname.startsWith('/calendar/activities')) {
			setMatchActivities(true);
		} else {
			setMatchActivities(false);
		}
	}, [location.pathname]);

	useEffect(() => {
		// Update matchFind state based on whether the component is rendered on the map page
		if (location.pathname === '/' || location.pathname.startsWith('/map/') || props.isMap) {
			setMatchFind(true); // Set matchFind to true if component is on the map page
		} else {
			setMatchFind(false); // Set matchFind to false if component is not on the map page
		}
	}, [location.pathname]);

	const handleDrawerClose = () => {
		setOpenDrawer(false);
	};

	const handleListItemClick = path => {
		history.push(path);
		handleDrawerClose();
	};

	const handleDrawerOpen = () => {
		setOpenDrawer(true);
	};

	const handleSupportOpen = () => {
		setOpenDrawer(false);
		setSupportDrawer(false);
		setOpenSupportCenter(true);
	};

	const handleOpenContactForm = () => {
		setOpenSupportCenter(false);
		setOpenContactForm(true);
	};

	const requestDemo = () => {
		window.open('mailto:sales@m1neral.com?subject=Request for demo of premium features', '_blank');
	};

	const checkIfIgnoreHeader = () => {
		if (
			location.pathname.startsWith('/revenue/statement/details') ||
			location.pathname.includes('/line-item') ||
			location.pathname.startsWith('/revenue/property/details') ||
			location.pathname.startsWith('/analytics/property/details') ||
			location.pathname.startsWith('/land/agreement/details') ||
			location.pathname.startsWith('/contacts/campaign/details')
		) {
			return true;
		}
		return false;
	};

	// const checkIfShowBackgroundOnHeader = () => {
	//   if (location.pathname.startsWith("/revenue/statements") || location.pathname.startsWith("/revenue/properties")) {
	//     return true;
	//   }
	//   return false;
	// };

	// const matchAgreements = () => {
	//   return location.pathname === "/landmanagement/agreements";
	// };

	return (
		<div className={classes.root}>
			<CssBaseline />
			{!checkIfIgnoreHeader() && (
				<AppBar
					position="fixed"
					className={clsx(!location.pathname.startsWith('/land') ? classes.appBar : classes.appBarWhite, {
						[classes.appBarShift]: openDrawer,
					})}
					style={
						location.pathname === '/contacts/activityDashboard' || location.pathname.includes('revenue')
							? { background: 'white' }
							: null
					}
					// style={{
					//   background: checkIfShowBackgroundOnHeader() && "#ffffff",
					//   boxShadow: checkIfShowBackgroundOnHeader() && "0 0 10px rgba(0,0,0,0.3)"
					// }}
				>
					{stateApp.user && (
						<Toolbar>
							{location.pathname.startsWith('/calendar') && (
								<>
									<ActivitySearch />
								</>
							)}
							{location.pathname === '/contacts/activityDashboard' && (
								<>
									<ActivityDashboardSearch showLabel={location.pathname === '/contacts/activityDashboard'} />
								</>
							)}
							{location.pathname === '/documents' && (
								<>
									<DocumentSearch />
								</>
							)}
							{(location.pathname === '/contacts' ||
								location.pathname === '/contacts/' ||
								Object.values(contactManagementRoutes).find(
									item => item.link === location.pathname && item.search
								)) && <ContactSearch />}
							{location.pathname.includes('/contact/details') && <ContactBreadcrumbs />}

							{['/analytics/revenues', '/analytics', '/analytics/land', '/analytics/audit'].includes(
								location.pathname
							) && <AnalyticsSearch classes={classes} user={stateApp.user} />}
							{/* <Typography
                  variant="h4"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    marginLeft: quickActionsPanelState ? 433 : 15,
                  }}
                >
                  {_.capitalize(location.pathname.split("/").pop())} Analytics
                </Typography> */}

							{location.pathname.startsWith('/flow') && <DealSearch />}
							{location.pathname === '/dashboard' && (
								<Typography variant="h4" style={{ color: 'black', fontWeight: 'bold', marginLeft: 15 }}>
									Dashboard
								</Typography>
							)}
							{location.pathname.startsWith('/land') && <LandAppBar classes={classes} user={stateApp.user} />}
							{location.pathname.startsWith('/revenue') && <RevenueAppBar classes={classes} />}
							{location.pathname.startsWith('/admin') && <AdminSettingsAppBar />}

							{location.pathname.startsWith('/data') && <DataAppBar />}

							{matchTrack ? <CardHeader className={classes.trackHeader} /> : null}
							{(matchFind || matchDocument) && (
								<div className={classes.search} id="searchBarDivParent">
									<SearchBarWithToggleButton />
								</div>
							)}
							<div className={classes.grow1} />

							{matchActivities ? (
								<div>
									<div className={classes.filterTabs} style={{ paddingRight: '10px' }}>
										<Button
											onClick={() => slidoutStateController.showSlideout()}
											color="primary"
											variant="contained"
											startIcon={<Add />}
										>
											Add Activity
										</Button>
									</div>
								</div>
							) : (
								<div style={{ display: 'none' }}></div>
							)}
							{/* {matchAgreements() && (
              <div ref={anchorEl} className={classes.filterTabs} style={{ paddingRight: "10px" }}>
                <Button onClick={() => handleListItemClick("/agreement/details")} color="primary" variant="contained" startIcon={<Add />}>
                  Add Agreement
                </Button>
              </div>
            )} */}

							<ProfileMenu />
						</Toolbar>
					)}
				</AppBar>
			)}
			{stateApp.user && (
				<SideNavigation
					openDrawer={openDrawer}
					handleListItemClick={handleListItemClick}
					handleDrawerClose={handleDrawerClose}
					handleDrawerOpen={handleDrawerOpen}
				/>
			)}

			{supportDrawer && (
				<ClickAwayListener onClickAway={() => setSupportDrawer(false)}>
					<div className={classes.supportDrawer}>
						<List component="div">
							<ListItem button onClick={() => handleSupportOpen()}>
								<ListItemIcon>
									<HeadsetIcon />
								</ListItemIcon>
								<ListItemText primary="Support Center" />
							</ListItem>
							<ListItem button onClick={requestDemo}>
								<ListItemIcon>
									<DesktopWindowsIcon />
								</ListItemIcon>
								<ListItemText primary="Request Demo" />
							</ListItem>
						</List>
					</div>
				</ClickAwayListener>
			)}

			<ClickAwayListener onClickAway={() => setOpenSupportCenter(false)}>
				<SupportCenterModal
					open={openSupportCenter}
					openContactForm={handleOpenContactForm}
					onClose={() => setOpenSupportCenter(false)}
				/>
			</ClickAwayListener>

			<ContactFormModal open={openContactForm} onClose={() => setOpenContactForm(false)} />

			<main className={classes.content}>
				<div className={classes.toolbar} />
				{props.children}
			</main>
		</div>
	);
}

Navigation.propTypes = {
	children: PropTypes.node.isRequired, // Ensures `children` is a valid React node and required
	isMap: PropTypes.bool,
};
