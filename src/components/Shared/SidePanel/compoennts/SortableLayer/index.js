import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import FileTree from "./FileTree";
import { ContextProvider } from "react-sortly";

const dnd = isMobile ? TouchBackend : HTML5Backend;
const SortableLayer = ({ layerMap, panelItems }) => (
  <DndProvider backend={dnd}>
    <ContextProvider>
      {layerMap.length > 0 && <FileTree layerMap={layerMap} panelItems={panelItems} />}
    </ContextProvider>
  </DndProvider>
);

export default SortableLayer;
