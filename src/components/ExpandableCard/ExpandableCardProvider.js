import React from "react";
import { ExpandableCardContextProvider } from "./ExpandableCardContext";

import ExpandableCard from "./ExandableCard";

export default function ExpandableCardProvider(props) {
  return (
    <ExpandableCardContextProvider>
      <ExpandableCard
        expanded={props.expanded}
        handleCloseExpandableCard={props.handleCloseExpandableCard}
        component={props.component}
        title={props.title}
        parent={props.parent}
        subTitle={props.subTitle}
        mouseX={props.mouseX}
        mouseY={props.mouseY}
        position={props.position}
        zIndex={props.zIndex}
        cardLeft={props.cardLeft}
        cardTop={props.cardTop}
        cardWidth={props.cardWidth}
        cardHeight={props.cardHeight}
        cardWidthExpanded={props.cardWidthExpanded}
        cardHeightExpanded={props.cardHeightExpanded}
        source={props.source}
        sourceSourceId={props.sourceSourceId}
        sourceName={props.sourceName}
        sourceLabel={props.sourceLabel}
        target={props.target}
        targetSourceId={props.targetSourceId}
        targetName={props.targetName}
        targetLabel={props.targetLabel}
        Api={props.Api}
        noTrackAvailable={props.noTrackAvailable}
      />
    </ExpandableCardContextProvider>
  );
}
