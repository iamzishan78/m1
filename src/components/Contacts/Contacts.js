import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setActiveModule, toggleQuickActionsPanel } from 'store/actions/commonActions';
import { AppContext } from 'AppContext';
import { FEATURES } from 'components/Shared/FeatureFlag/common';

import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import QuickActionPanel from 'components/Land/components/QuickActionPanel';
import * as Components from 'components/Contacts/components';

import { contactManagementRoutes } from 'utils/data';

export default function Contacts() {
	const location = useLocation();
	const [stateApp] = useContext(AppContext);
	const dispatch = useDispatch();
	const [allowedPaths, setAllowablePaths] = useState({});
	const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

	useEffect(() => {
		console.log('🚀 ~ Object.keys ~ allowedPaths:', allowedPaths);
		Object.keys(allowedPaths).forEach(option => {
			const RouteComponent = Components[allowedPaths[option].component];
			console.log('🚀 ~ Object.keys ~ RouteComponent:', option, RouteComponent);
		});
	}, [allowedPaths]);

	useEffect(() => {
		let option = {};
		Object.values(contactManagementRoutes).forEach(item => {
			if (location.pathname.startsWith(item.linkPrefix)) {
				option = item;
			}
		});
		if (option) {
			if (contactManagementRoutes[option.parent]) option.parent = contactManagementRoutes[option.parent];
			dispatch(setActiveModule(option));
		}
	}, [dispatch, location.pathname]);

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
		const allPaths = JSON.parse(JSON.stringify(contactManagementRoutes));
		const feature = stateApp.user?.features?.find(feature => feature.name === FEATURES.CONTACTSUBMENU);
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
		setAllowablePaths(allAllowedPaths);
	}, [stateApp?.user]);

	return (
		<>
			<FeatureFlag feature={FEATURES.CONTACTSUBMENU}>
				<QuickActionPanel
					title="CRM"
					handlePanelStateChange={handlePanelStateChange}
					quickActionsPanelState={quickActionsPanelState}
					activeModule={activeModule}
					actions={sidePanelOptions}
				>
					<Switch>
						{Object.keys(allowedPaths).map(option => (
							<Route
								exact
								path={allowedPaths[option].link}
								render={() => {
									const RouteComponent = Components[allowedPaths[option].component];
									return <RouteComponent viewDoc={stateApp.viewDoc} />;
								}}
							/>
						))}
					</Switch>
				</QuickActionPanel>
			</FeatureFlag>
		</>
	);
}
