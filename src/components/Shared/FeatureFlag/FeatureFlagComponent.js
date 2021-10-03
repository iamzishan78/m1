import { AppContext } from "AppContext";
import React, { useContext } from "react";

export function FeatureFlag({ children, feature }) {
    const [stateApp] = useContext(AppContext);
    return (
        <>
            {stateApp?.user?.features?.find(f => f.name === feature) && <> {children}</>}
        </>
    );
};

export default FeatureFlag;
