import { AppContext } from "AppContext";
import React, { useContext } from "react";

export function FeatureFlag({ children, feature, noAccess }) {
    const [stateApp] = useContext(AppContext);
    const allowedFeature = stateApp?.user?.features?.find(f => f.name === feature)
    return (
        <>
            {((allowedFeature && !noAccess) || (!allowedFeature && noAccess)) && <> {children}</>}
        </>
    );
};

export default FeatureFlag;
