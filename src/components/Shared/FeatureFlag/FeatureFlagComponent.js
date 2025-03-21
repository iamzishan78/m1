import React from 'react';

import { globalStateController } from 'stateManagement/globalStateController';

export function FeatureFlag({ children, feature, noAccess, noCheck }) {
	const {
		stateValues: { user },
	} = globalStateController.useState(['user']);

	const allowedFeature = user?.features?.find(f => f.name === feature);
	const userAccess =
		!!allowedFeature && (user?.featureSettings?.[feature] !== undefined ? user?.featureSettings?.[feature] : true);

	return (
		<>{((allowedFeature && !noAccess && userAccess) || (!allowedFeature && noAccess) || noCheck) && <> {children}</>}</>
	);
}

export default FeatureFlag;
