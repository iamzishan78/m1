import React, { useContext } from 'react';

import { AppContext } from 'AppContext';

export function FeatureFlag({ children, feature, noAccess, noCheck }) {
	const [stateApp] = useContext(AppContext);
	const allowedFeature = stateApp?.user?.features?.find(f => f.name === feature);
	return <>{((allowedFeature && !noAccess) || (!allowedFeature && noAccess) || noCheck) && <> {children}</>}</>;
}

export default FeatureFlag;
