import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useLocation } from "react-router-dom";

import QuickActionPanel from "components/Land/components/QuickActionPanel";
import { toggleQuickActionsPanel } from "store/actions/commonActions";
import * as Components from "components/Activities/Components";
import { FEATURES } from "components/Shared/FeatureFlag/common";

import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";

const SIDE_PANEL_MENU_ITEMS_LIST = {
    ACTIVITIES: {
        featureFlag: "LANDMODULE",
        title: "Activities",
        link: "/calendar/activities",
        component: "Activities",
    },
    OBLIGATIONS: {
        featureFlag: "LANDMODULE",
        title: "Obligations",
        link: "/calendar/agreements",
        component: "Obligations",
    },
    PAYMENTS: {
        featureFlag: "LANDMODULE",
        title: "Payments",
        link: "/calendar/payments",
        component: "Payments",
    },
    EXPIRATIONS: {
        featureFlag: "LANDMODULE",
        title: "Expirations",
        link: "/calendar/expirations",
        component: "Expirations",
    },
    APPROVAL_MANAGEMENT: {
        featureFlag: "LANDMODULE",
        title: "Approval Management",
        link: "/calendar/approval-management",
        component: "ApprovalManagement",
    },
};

const Calendar = () => {
    const dispatch = useDispatch();
    const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

    const handlePanelStateChange = (state) => {
        dispatch(toggleQuickActionsPanel(state));
    };

    return (
        // <FeatureFlag feature={FEATURES.CONTACTSUBMENU}>
        <QuickActionPanel
            title="Calendar"
            handlePanelStateChange={handlePanelStateChange}
            quickActionsPanelState={quickActionsPanelState}
            activeModule={activeModule}
            actions={SIDE_PANEL_MENU_ITEMS_LIST}
        >
            {Object.keys(SIDE_PANEL_MENU_ITEMS_LIST).map((option) => (
                <Switch>
                    <Route path={SIDE_PANEL_MENU_ITEMS_LIST[option].link} component={Components[SIDE_PANEL_MENU_ITEMS_LIST[option].component]} />
                </Switch>
            ))}
        </QuickActionPanel>
        // </FeatureFlag>
    )
}

export default Calendar;
