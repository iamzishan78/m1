import React, { useState } from "react";
import { copy } from "utils/helper";
import { bbox, bboxPolygon } from "@turf/turf";
import IconButton from "@material-ui/core/IconButton";

import { default as DrawPoly } from "components/Shared/svgIcons/polygon";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import Tooltip from "@material-ui/core/Tooltip";

import { drawShapeLayerToggle } from "components/MapControls/commonHelper";
import { getRotateAbleShapeFromSelectedQuarters } from "components/MapControls/components/DrawShapes/drawShapesHelpers";

export default function ShapeEditActions({ shapeEdit, shapeEditMode, actionFullEdit, setStateApp, stateApp }) {
  const [feature, setFeature] = useState();

  React.useEffect(() => {
    if (shapeEdit) {
      if (shapeEditMode === "rotate") onRotateHandle("rotate");
      if (shapeEditMode === "" && shapeEdit) {
        setStateApp(stateApp => ({ ...stateApp, shapeEdit: false }));
      }
      if (!feature) setFeature(stateApp.currentFeature);
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
      const _feature = copy(stateApp.currentFeature);

      drawShapeLayerToggle(stateApp, "visible")
      stateApp.draw.deleteAll();
      getRotateAbleShapeFromSelectedQuarters(_feature, stateApp.draw);
      setStateApp((stateApp) => ({ ...stateApp, shapeEdit: true, shapeEditMode: "rotate" }));
    }
  };

  const onEditModeChange = (mode) => {
    if (mode !== "fullEdit") {
      setStateApp((stateApp) => ({ ...stateApp, shapeEditMode: "" }));
      actionFullEdit();
    } else {
      if (_shapeEditMode === "rotate") {
        stateApp?.draw?.deleteAll();
      }
      setStateApp((stateApp) => ({ ...stateApp, shapeEditMode: "fullEdit" }));
      if (stateApp.draw.get(feature.id)) {
        stateApp.draw.delete(feature.id);
        stateApp.draw.add(feature);
      }
      actionFullEdit(false);
    }
  }

  const onPreciseEdit = (mode) => {
    if (mode !== "resize") {
      setStateApp((stateApp) => ({ ...stateApp, shapeEditMode: "" }));
      actionFullEdit();
    } else {
      const editMode = _shapeEditMode;
      if (editMode === "rotate") {
        stateApp?.draw?.deleteAll();
      }
      setStateApp((stateApp) => ({ ...stateApp, shapeEditMode: "resize" }));
      if (!feature.properties.isCircle) {
        const _feature = copy(feature);
        const _bbox = bbox(feature);
        const _bboxPolygon = bboxPolygon(_bbox);
        _feature.geometry = _bboxPolygon.geometry;
        if (stateApp.draw.get(_feature.id) || editMode) {
          stateApp.draw.delete(_feature.id);
          stateApp.draw.add(_feature);
        }
      }
      actionFullEdit(false);
    }
  }

  return (
    <>
      {/* <Tooltip title="Rotate Shape">
        <IconButton size="small" aria-label="Rotate Shape" onClick={() => onRotateHandle(_shapeEditMode !== "rotate" ? "rotate" : "")}>
          <AutorenewIcon color="secondary" className={_shapeEditMode === "rotate" ? "selected" : ""} />
        </IconButton>
      </Tooltip> */}

      <Tooltip title="Resize Shape">
        <IconButton size="small" aria-label="Resize Shape" onClick={() => onPreciseEdit(_shapeEditMode !== "resize" ? "resize" : "")}>
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
