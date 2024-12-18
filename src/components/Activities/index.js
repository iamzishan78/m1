import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useLocation } from 'react-router-dom';

import QuickActionPanel from './QuickActionPanel';
import { toggleQuickActionsPanel, setActiveModule } from 'store/actions/commonActions';
import * as Components from 'components/Activities/Components';
import { replaceLinkId } from 'components/Shared/functions';
import './index.css';

const SIDE_PANEL_MENU_ITEMS_LIST = {
	ACTIVITIES: {
		featureFlag: 'CALENDAR_ACTIVITIES',
		title: 'Activities',
		link: '/calendar/activities',
		component: 'Activities',
		noCheck: true,
	},
	EXPIRATIONS: {
		featureFlag: 'CALENDAR_EXPIRATIONS',
		title: 'Expirations',
		link: '/calendar/expirations',
		component: 'Expirations',
	},
	OBLIGATIONS: {
		featureFlag: 'CALENDAR_OBLIGATIONS',
		title: 'Obligations',
		link: '/calendar/obligations',
		component: 'Obligations',
	},
	PAYMENTS: {
		featureFlag: 'CALENDAR_PAYMENTS',
		title: 'Payments',
		link: '/calendar/payments',
		component: 'Payments',
	},
	APPROVAL_MANAGEMENT: {
		featureFlag: 'CALENDAR_APPROVAL_MANAGEMENT',
		title: 'Approval Management',
		link: '/calendar/approval-management',
		component: 'ApprovalManagement',
	},
};

const Calendar = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

	useEffect(() => {
		const option = Object.values(SIDE_PANEL_MENU_ITEMS_LIST).find(item => {
			const path = location.pathname;
			if (item.link.includes(':id')) {
				return replaceLinkId(item.link, path);
			}
			return path.startsWith(item.link);
		});
		if (option?.parent) {
			dispatch(setActiveModule(SIDE_PANEL_MENU_ITEMS_LIST[option.parent]));
		} else if (option) {
			dispatch(setActiveModule(option));
		}
	}, [location.pathname, dispatch]);

	const handlePanelStateChange = state => {
		dispatch(toggleQuickActionsPanel(state));
	};

	return (
		<QuickActionPanel
			title="Calendar"
			handlePanelStateChange={handlePanelStateChange}
			quickActionsPanelState={quickActionsPanelState}
			activeModule={activeModule}
			actions={SIDE_PANEL_MENU_ITEMS_LIST}
		>
			{Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map(option => (
				<Switch>
					<Route
						path={SIDE_PANEL_MENU_ITEMS_LIST[option].link}
						component={Components[SIDE_PANEL_MENU_ITEMS_LIST[option].component]}
					/>
				</Switch>
			))}
		</QuickActionPanel>
	);
};

export default Calendar;
