import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Integrations from 'components/Integrations';

import { setActiveModule, toggleQuickActionsPanel } from 'store/actions/commonActions';
import { AppContext } from 'AppContext';
import { FEATURES } from 'components/Shared/FeatureFlag/common';

import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import QuickActionPanel from 'components/Land/components/QuickActionPanel';

import { AdminManagementRoutes } from 'utils/data';
import Map from './components/Map';
import AdminSettings from 'components/Shared/AdminSettings';
import Flatten from 'components/Admin/Flatten';
import Reindex from 'components/Admin/Reindex';
import BulkDataEditing from 'components/Admin/components/BulkDataEditing';
import BulkDataEditingDetail from './components/BulkDataEditingDetail';

const Components = {
	Map,
	AdminSettings,
	Flatten,
	Reindex,
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			delete allPaths['FLATTENING'];
			delete allPaths['REINDEX'];
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
					<Switch>
						<Route exact path={option.link} component={Components[option.component]} />
					</Switch>
				))}
			</QuickActionPanel>
		</FeatureFlag>
	);
}
