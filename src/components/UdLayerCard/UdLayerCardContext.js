import React, { useState, createContext } from "react";
const UdLayerCardContext = createContext([{}, () => { }]);

const UdLayerCardContextProvider = React.memo((props) => {
    const [stateUdLayerCard, setStateUdLayerCard] = useState({
        selectedUdLayer: {},
        openUdLayerDetails: false,
    });
    return <UdLayerCardContext.Provider value={[stateUdLayerCard, setStateUdLayerCard]}>{props.children}</UdLayerCardContext.Provider>;
});

UdLayerCardContext.whyDidYouRender = true;
UdLayerCardContextProvider.whyDidYouRender = true;
export { UdLayerCardContext, UdLayerCardContextProvider };
