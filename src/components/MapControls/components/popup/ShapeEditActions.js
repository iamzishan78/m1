import React, { useEffect, useState } from "react";
import { copy } from "utils/helper";
import IconButton from "@material-ui/core/IconButton";

import { default as DrawPoly } from "components/Shared/svgIcons/polygon";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import Tooltip from "@material-ui/core/Tooltip";

import { drawShapeLayerToggle, findBoundsMap } from "components/MapControls/commonHelper";
import { changeModeToScaleRotate, drawBoundary, getDrawAdustedShape, getNewShapeFromSelectedQuarters, getRotateAbleShapeFromSelectedQuarters } from "components/MapControls/components/DrawShapes/drawShapesHelpers";

export default function ShapeEditActions({ shapeEdit, shapeEditMode, actionFullEdit, setStateApp, stateApp }) {

  React.useEffect(() => {
    if (shapeEdit) {
      if (shapeEditMode === "rotate") onRotateHandle("rotate");

      // if (shapeEditMode === "fullEdit") onEditModeChange("fullEdit");
      if (shapeEditMode === "" && shapeEdit) {
        setStateApp(stateApp => ({ ...stateApp, shapeEdit: false }));
      }
    }
  }, [shapeEdit, shapeEditMode]);

  const _shapeEditMode = React.useMemo(() => {
    if (shapeEdit) {
      return shapeEditMode;
    } return "";
  }, [shapeEdit, shapeEditMode]);

  const onRotateHandle = (mode) => {
    if (mode !== "rotate") {
      stateApp?.draw?.deleteAll();
      setStateApp((stateApp) => ({ ...stateApp, shapeEdit: false, shapeEditMode: "" }));
    } else {
      const feature = copy(stateApp?.currentFeature)

      drawShapeLayerToggle(stateApp, "visible")
      stateApp.draw.deleteAll();
      getRotateAbleShapeFromSelectedQuarters(feature, stateApp.draw);
      setStateApp((stateApp) => ({ ...stateApp, shapeEdit: true, shapeEditMode: "rotate" }));
    }
  }

  const onEditModeChange = (mode) => {
    if (mode !== "fullEdit") {
      setStateApp((stateApp) => ({ ...stateApp, shapeEditMode: "" }));
      actionFullEdit();
    } else {
      if (_shapeEditMode === "rotate") {
        stateApp?.draw?.deleteAll();
        actionFullEdit(false);
        // stateApp.draw.changeMode("direct_select", {
        //   featureId: stateApp?.currentFeature?.id,
        // });
      }
      setStateApp((stateApp) => ({ ...stateApp, shapeEditMode: "fullEdit" }));
    }
  }

  return (
    <>
      <Tooltip title="Rotate Shape">
        <IconButton size="small" aria-label="Rotate Shape" onClick={() => onRotateHandle(_shapeEditMode !== "rotate" ? "rotate" : "")}>
          <AutorenewIcon color="secondary" className={_shapeEditMode === "rotate" ? "selected" : ""} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Resize Shape">
        <IconButton size="small" aria-label="Resize Shape">
          <AspectRatioIcon color="secondary" className={_shapeEditMode === "resize" ? "selected" : ""} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit Shape">
        <IconButton size="small" aria-label="Edit Shape" onClick={() => onEditModeChange(_shapeEditMode !== "fullEdit" ? "fullEdit" : "")}>
          <DrawPoly color="secondary" className={_shapeEditMode === "fullEdit" ? "selected" : ""} />
        </IconButton>
      </Tooltip>
    </>
  );
}
