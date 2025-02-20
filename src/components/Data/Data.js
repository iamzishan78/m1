import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useLocation } from 'react-router-dom';

import QuickActionPanel from 'components/Land/components/QuickActionPanel';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';

import { setActiveModule, toggleQuickActionsPanel } from 'store/actions/commonActions';

import { dataManagementRoutes } from 'utils/data';

import { AppContext } from 'AppContext';

import Content from './Content';

export default function Data() {
	const location = useLocation();
	const [stateApp] = useContext(AppContext);
	const dispatch = useDispatch();
	const [allowedPaths, setAllowablePaths] = useState({});
	const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

	useEffect(() => {
		let option = Object.values(dataManagementRoutes).find(item => {
			return item.link === location.pathname;
		});
		if (option) {
			dispatch(setActiveModule(option));
		}
	}, [dispatch, location.pathname]);

	const handlePanelStateChange = state => {
		dispatch(toggleQuickActionsPanel(state));
	};

	const sidePanelOptions = React.useMemo(() => {
		const options = {};
		Object.values(allowedPaths).forEach(allowedPath => {
			if (!allowedPath.isExcluded) {
				options[allowedPath.value] = allowedPath;
			}
		});
		return options;
	}, [allowedPaths]);

	useEffect(() => {
		const allPaths = JSON.parse(JSON.stringify(dataManagementRoutes));

		const feature = stateApp.user?.features?.find(feature => feature.name === FEATURES.DATA);
		const allAllowedPaths = {};
		if (feature) {
			Object.keys(allPaths).forEach(path => {
				allAllowedPaths[path] = allPaths[path];
			});
		}

		setAllowablePaths(allAllowedPaths);
	}, [stateApp?.user]);

	return (
		<>
			<FeatureFlag feature={FEATURES.DATA}>
				<QuickActionPanel
					title="Data"
					handlePanelStateChange={handlePanelStateChange}
					quickActionsPanelState={quickActionsPanelState}
					activeModule={activeModule}
					actions={sidePanelOptions}
				>
					{Object.values(allowedPaths).map(option => {
						return (
							<Switch key={option.link}>
								<Route
									exact
									path={option.link}
									component={() => {
										return <Content path={option} />;
									}}
								/>
							</Switch>
						);
					})}
				</QuickActionPanel>
			</FeatureFlag>
		</>
	);
}
