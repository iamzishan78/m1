import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useLocation, Redirect } from 'react-router-dom';

import { useLazyQuery } from '@apollo/client';

import * as Components from 'components/Land/components';
import QuickActionPanel from 'components/Land/components/QuickActionPanel';
import { replaceLinkId } from 'components/Shared/functions';

import { ALL_CUSTOM_ASSET_INFO } from 'graphQL/useQueryAllCustomAssetInfo';

//Actions
import { toggleQuickActionsPanel, setActiveModule } from 'store/actions/commonActions';

export const SIDE_PANEL_MENU_ITEMS_LIST = {
	// PORTFOLIO: {
	//   featureFlag: "LANDPORTFOLIO",
	//   title: "Portfolio",
	//   link: "/land/portfolio",
	//   component: "Portfolio",
	// },
	AGREEMENTS: {
		featureFlag: 'LANDMODULE',
		title: 'Agreements',
		link: '/land/agreements',
		component: 'Agreements',
	},
	AGREEMENT_DETAIL: {
		isExcluded: true,
		parent: 'AGREEMENTS',
		title: 'Agreements',
		link: '/land/agreement/details/:id',
		component: 'AgreementDetails',
	},
	TRACTS: {
		featureFlag: 'LANDMODULE',
		title: 'Tracts',
		link: '/land/tracts',
		component: 'Tracts',
	},
	UNIT: {
		featureFlag: 'LANDMODULE',
		title: 'Units',
		link: '/land/units',
		component: 'Units',
	},
	WELLS: {
		featureFlag: 'LANDMODULE',
		title: 'Wells',
		link: '/land/wells',
		component: 'Wells',
	},
	WELL_DETAILS: {
		featureFlag: 'LANDMODULE',
		title: 'Wells',
		link: '/land/well/details/:id',
		parent: 'WELLS',
		component: 'Wells',
		isExcluded: true,
	},
	// ADVANCED_SEARCH: {
	//   featureFlag: "LANDMODULE",
	//   title: "Advanced Search",
	//   link: "/land/search",
	//   component: "AdvancedSearch",
	//   hideSearch: true,
	// },
};

export default function Land() {
	const location = useLocation();
	const dispatch = useDispatch();
	const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);
	const [sidePanelMenuList, setSidePanelMenuList] = useState(SIDE_PANEL_MENU_ITEMS_LIST);

	// Query for getting all custom assets
	const [getAllCustomAsset, { data: allCustomAsset }] = useLazyQuery(ALL_CUSTOM_ASSET_INFO, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		const option = Object.values(sidePanelMenuList).find(item => {
			const path = location.pathname;
			if (item.link.includes(':id')) {
				return replaceLinkId(item.link, path);
			}
			return path.startsWith(item.link);
		});
		if (option?.parent) {
			dispatch(setActiveModule(sidePanelMenuList[option.parent]));
		} else if (option) {
			dispatch(setActiveModule(option));
		}
	}, [location.pathname, dispatch, sidePanelMenuList]);

	useEffect(() => {
		// Get all custom assets
		getAllCustomAsset({
			variables: {
				type: 'Custom',
			},
		});
	}, [getAllCustomAsset]);

	useEffect(() => {
		if (allCustomAsset) {
			const dynamicAsset = allCustomAsset?.getAllCustomAssetInfo?.res;

			// Set dynamic assets in side panel
			setSidePanelMenuList(prevList => {
				const newList = { ...prevList };
				dynamicAsset?.forEach(item => {
					const key = item.name.replace(/\s+/g, '_').toUpperCase();
					newList[key] = {
						featureFlag: 'LANDMODULE',
						title: item.name,
						name: item.name,
						tableName: item.tableName,
						modelName: item.modelName,
						link: `/land/customAsset/${item.tableName}`,
						component: 'DynamicAssetGrid',
					};

					newList[`${key}_DETAIL`] = {
						featureFlag: 'LANDMODULE',
						name: item.name,
						tableName: item.tableName,
						modelName: item.modelName,
						link: '/land/customAsset/:tableName/details/:id',
						component: 'GenericDetailCardContainer',
						value: 'GenericDetailCardContainer',
						hideSearch: true,
						isDefault: true,
						isExcluded: true,
						parent: key,
					};

					newList[`${key}_DETAIL_DOCUMENTS`] = {
						featureFlag: 'LANDMODULE',
						name: item.name,
						tableName: item.tableName,
						modelName: item.modelName,
						link: '/land/customAsset/:tableName/details/:id/documents',
						component: 'DocumentsCardContainer',
						value: 'DocumentsCardContainer',
						hideSearch: true,
						isDefault: true,
						isExcluded: true,
						parent: `${key}_DETAIL`,
					};
				});
				return newList;
			});
		}
	}, [allCustomAsset]);

	const handlePanelStateChange = state => {
		dispatch(toggleQuickActionsPanel(state));
	};

	return (
		<QuickActionPanel
			title="Asset Management"
			handlePanelStateChange={handlePanelStateChange}
			quickActionsPanelState={quickActionsPanelState}
			activeModule={activeModule}
			actions={sidePanelMenuList}
		>
			<Switch>
				{Object.keys(sidePanelMenuList).map(option => (
					<Route
						key={option.title}
						exact
						path={sidePanelMenuList[option].link}
						component={Components[sidePanelMenuList[option].component]}
					/>
				))}
				<Redirect to={'/land/agreements'} />
			</Switch>
		</QuickActionPanel>
	);
}
