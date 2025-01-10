import React from 'react';

import { globalStateController } from 'hookstate/globalStateController';

export function FeatureFlag({ children, feature, noAccess, noCheck }) {
	const {
		stateValues: { user },
	} = globalStateController.useState(['user']);

	const allowedFeature = user?.features?.find(f => f.name === feature);
	return <>{((allowedFeature && !noAccess) || (!allowedFeature && noAccess) || noCheck) && <> {children}</>}</>;
}

export default FeatureFlag;
