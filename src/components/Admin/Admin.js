import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useLocation } from 'react-router-dom';

import AdminOperation from 'components/Admin/AdminOperation';
import BulkDataEditing from 'components/Admin/components/BulkDataEditing';
import Integrations from 'components/Integrations';
import QuickActionPanel from 'components/Land/components/QuickActionPanel';
import AdminSettings from 'components/Shared/AdminSettings';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';

import { setActiveModule, toggleQuickActionsPanel } from 'store/actions/commonActions';

import { AdminManagementRoutes } from 'utils/data';

import { AppContext } from 'AppContext';

import BulkDataEditingDetail from './components/BulkDataEditingDetail';
import Map from './components/Map';

const Components = {
	Map,
	AdminSettings,
	AdminOperation,
	BulkDataEditing,
	BulkDataEditingDetail,
	Integrations,
};

function isM1neralAddress(email) {
	return email.endsWith('@m1neral.com');
}

export default function Admin() {
	const location = useLocation();
	const [stateApp] = useContext(AppContext);
	const dispatch = useDispatch();
	const [allowedPaths, setAllowablePaths] = useState({});
	const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

	useEffect(() => {
		const option = Object.values(AdminManagementRoutes).find(item => {
			if (location.pathname.startsWith('/admin/bulk-editing/')) {
				return item.link.startsWith('/admin/bulk-editing/');
			}

			return item.link === location.pathname;
		});
		if (option) {
			dispatch(setActiveModule(option));
		}
	}, [location.pathname]);

	const handlePanelStateChange = state => {
		dispatch(toggleQuickActionsPanel(state));
	};

	const sidePanelOptions = React.useMemo(() => {
		const options = {};
		Object.keys(allowedPaths).forEach(key => {
			if (!allowedPaths[key].isExcluded) {
				options[key] = allowedPaths[key];
			}
		});
		return options;
	}, [allowedPaths]);

	useEffect(() => {
		const allPaths = JSON.parse(JSON.stringify(AdminManagementRoutes));
		if (!isM1neralAddress(stateApp.user.email)) {
			delete allPaths['ADMINOPERATION'];
			delete allPaths['INTEGRATION'];
		}
		const feature = stateApp.user?.features?.find(feature => feature.name === FEATURES.CONTACTSUBMENU);
		// const feature = stateApp.user?.features?.find(feature => feature.name === FEATURES.ANALYTICSSUBMENU);
		const allAllowedPaths = {};
		if (feature?.JSON) {
			const data = JSON.parse(feature.JSON);
			Object.keys(allPaths).forEach(path => {
				if (data.options.includes(allPaths[path].value)) {
					allAllowedPaths[path] = allPaths[path];
				}
			});
		} else {
			Object.keys(allPaths).forEach(path => {
				if (allPaths[path].isDefault) {
					allAllowedPaths[path] = allPaths[path];
				}
			});
		}

		Object.keys(allPaths).forEach(path => {
			if (allPaths[path].featureFlag === 'AlWAYSSHOW') {
				allAllowedPaths[path] = allPaths[path];
			}
		});

		Object.keys(allPaths).forEach(path => {
			if (allPaths[path].featureFlag === 'DIALPAD_INTEGRATION') {
				allAllowedPaths[path] = allPaths[path];
			}
		});
		setAllowablePaths(allAllowedPaths);
	}, [stateApp?.user]);

	return (
		<FeatureFlag feature={FEATURES.CONTACTSUBMENU}>
			<QuickActionPanel
				title="Admin Settings"
				handlePanelStateChange={handlePanelStateChange}
				quickActionsPanelState={quickActionsPanelState}
				activeModule={activeModule}
				actions={sidePanelOptions}
			>
				{Object.values(allowedPaths).map(option => (
					<Switch key={option.link}>
						<Route exact path={option.link} component={Components[option.component]} />
					</Switch>
				))}
			</QuickActionPanel>
		</FeatureFlag>
	);
}
