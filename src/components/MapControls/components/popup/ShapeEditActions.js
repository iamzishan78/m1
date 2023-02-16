import React, { useState } from "react";
import { copy } from "utils/helper";
import IconButton from "@material-ui/core/IconButton";

import { default as DrawPoly } from "components/Shared/svgIcons/polygon";
import HighlightAltIcon from "components/Shared/svgIcons/highlightAlt";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import Tooltip from "@material-ui/core/Tooltip";

import { drawShapeLayerToggle } from "components/MapControls/commonHelper";
import { getRotateAbleShapeFromSelectedQuarters } from "components/MapControls/components/DrawShapes/drawShapesHelpers";
import { SRCenter } from "components/Map/MapBoxDrawRotate";

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

      setFeature((feature) => {
        if (!feature.properties.isCircle) {
          const _feature = copy(feature);
          // const _bbox = bbox(feature);
          // const _bboxPolygon = bboxPolygon(_bbox);
          // _feature.geometry = _bboxPolygon.geometry;
          _feature.properties.isrotate = 1
          stateApp?.draw?.deleteAll();
          if (stateApp.draw.get(_feature.id) || editMode) {
            stateApp.draw.delete(_feature.id);
            stateApp.draw.add(_feature);
          }

          stateApp.draw.changeMode('tx_poly', {
            // required
            featureId: feature.id,
            canScale: true,
            canRotate: false, // only rotation enabled
            canTrash: false, // disable feature delete

            rotatePivot: SRCenter.Center, // rotate around center
            scaleCenter: SRCenter.Opposite, // scale around opposite vertex

            singleRotationPoint: true, // only one rotation point
            rotationPointRadius: 1.4, // offset rotation point

            canSelectFeatures: false,
          });
        }
        return feature
      })

      // actionFullEdit(false);
    }
  }

  const onShapeRedraw = (mode) => {
    if (mode !== "redraw") {
      setStateApp((stateApp) => ({ ...stateApp, shapeEditMode: "" }));
      actionFullEdit();
    } else {
      stateApp?.draw?.deleteAll();
      stateApp.draw.changeMode("static");
      setStateApp((state) => ({
        ...state,
        shapeEditMode: "redraw",
        reDrawShape: true,
      }));
    }
  }

  return (
    <>
      <Tooltip title="Redraw Shape">
        <IconButton size="small" aria-label="Redraw Shape" onClick={() => onShapeRedraw(_shapeEditMode !== "redraw" ? "redraw" : "")}>
          <HighlightAltIcon color="secondary" className={_shapeEditMode === "redraw" ? "selected" : ""} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Resize Shape">
        <IconButton size="small" aria-label="Resize Shape" onClick={() => onPreciseEdit(_shapeEditMode !== "resize" ? "resize" : "")}>
          <AspectRatioIcon color="secondary" className={_shapeEditMode === "resize" ? "selected" : ""} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Adjust Shape Points">
        <IconButton size="small" aria-label="Adjust Shape Points" onClick={() => onEditModeChange(_shapeEditMode !== "fullEdit" ? "fullEdit" : "")}>
          <DrawPoly color="secondary" className={_shapeEditMode === "fullEdit" ? "selected" : ""} />
        </IconButton>
      </Tooltip>
    </>
  );
}
