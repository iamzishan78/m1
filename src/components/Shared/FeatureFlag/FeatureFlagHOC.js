import { AppContext } from "AppContext";
import React, { useContext } from "react";

export const FeatureFlagHOC = (Component, feature) => {
    return function HOC(props) {
        const [stateApp] = useContext(AppContext);

        return (
            <>
                {stateApp?.user?.features?.find(f => f.name === feature) && <Component {...props} />}
            </>
        );
    };
};

export default FeatureFlagHOC;
