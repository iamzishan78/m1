import React from "react";

import IconButton from "@material-ui/core/IconButton";

import { default as DrawPoly } from "components/Shared/svgIcons/polygon";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import Tooltip from "@material-ui/core/Tooltip";

import { changeModeToScaleRotate } from "components/MapControls/components/DrawShapes/drawShapesHelpers";

export default function ShapeEditActions({ shapeEdit, shapeEditMode, actionFullEdit, setStateApp, stateApp }) {

  const _shapeEditMode = React.useMemo(() => {
    if (shapeEdit) {
      return shapeEditMode;
    } return "";
  }, [shapeEdit, shapeEditMode]);

  const onRotate = () => {
    if (_shapeEditMode === "rotate") {
      // stateApp.draw.deleteAll();
      const all = stateApp.draw.getAll();
      const feature = all.features.find((f) => f.properties.isrotate)
      stateApp.draw.changeMode("direct_select", { featureId: feature.id, });
      changeModeToScaleRotate(stateApp.draw);
      setStateApp(stateApp => ({ ...stateApp, shapeEditMode: "" }));
    } else {
      setStateApp(stateApp => ({ ...stateApp, shapeEdit: true, shapeEditMode: "rotate" }));
    }
  }

  return (
    <>
      <Tooltip title="Rotate Shape">
        <IconButton size="small" aria-label="Rotate Shape" onClick={onRotate}>
          <AutorenewIcon color="secondary" className={_shapeEditMode === "rotate" ? "selected" : ""} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Resize Shape">
        <IconButton size="small" aria-label="Resize Shape">
          <AspectRatioIcon color="secondary" className={_shapeEditMode === "resize" ? "selected" : ""} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit Shape">
        <IconButton size="small" aria-label="Edit Shape" onClick={actionFullEdit}>
          <DrawPoly color="secondary" className={_shapeEditMode === "fullEdit" ? "selected" : ""} />
        </IconButton>
      </Tooltip>
    </>
  );
}
