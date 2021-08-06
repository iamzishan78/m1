import React from "react";
import { UdLayerCardContextProvider } from "./UdLayerCardContext";

import UdLayerCard from "./UdLayerCard";

function UdLayerCardProvider(props) {
    return (
        <UdLayerCardContextProvider>
            <UdLayerCard
                selectedUserDefinedLayer={props.selectedUserDefinedLayer}
                parent={props.parent}
                mouseX={props.mouseX}
                mouseY={props.mouseY}
                position={props.position}
                zIndex={props.zIndex}
                cardWidth={props.cardWidth}
            />
        </UdLayerCardContextProvider>
    );
}

UdLayerCardProvider.whyDidYouRender = true;
export default React.memo(UdLayerCardProvider);
