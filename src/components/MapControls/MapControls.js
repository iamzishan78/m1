import React, { memo } from "react";
import AddUserData from "./components/addUserData";
import AddUserGroupData from "./components/addUserGroupData";
import DrawShapes from "./components/DrawShapes/DrawShapes";
import SidePanel from "../Shared/SidePanel/SidePanel";
import { mapControlsController } from "hookstate/mapControlsController";

const MapControls = () => {
  const { mapControlsStateValues } = mapControlsController.useState(['selectedMapControl', 'layerAddControl'], 'mapControlsStateValues');

  return <div>
    <SidePanel />
    {mapControlsStateValues.selectedMapControl === "draw" ? <DrawShapes /> : null}
    {mapControlsStateValues.layerAddControl === "add" ? <AddUserData /> : null}
    {mapControlsStateValues.layerAddControl === "addGroup" ? <AddUserGroupData /> : null}
  </div>
}

export default memo(MapControls)
