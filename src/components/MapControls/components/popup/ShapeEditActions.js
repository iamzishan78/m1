import React from "react";

import IconButton from "@material-ui/core/IconButton";

import { default as DrawShapeIcon } from "../../../Shared/svgIcons/draw_shape";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import Tooltip from "@material-ui/core/Tooltip";

export default function ShapeEditActions({ shapeEdit, shapeEditMode }) {

  const _shapeEditMode = React.useMemo(() => {
    if (shapeEdit) {
      return shapeEditMode;
    } return "";
  }, [shapeEdit, shapeEditMode]);

  return (
    <>
      <Tooltip title="Rotate Shape">
        <IconButton size="small" aria-label="Rotate Shape">
          <AutorenewIcon color="secondary" className={_shapeEditMode === "rotate" ? "selected" : ""} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Resize Shape">
        <IconButton size="small" aria-label="Resize Shape">
          <AspectRatioIcon color="secondary" className={_shapeEditMode === "resize" ? "selected" : ""} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit Shape">
        <IconButton size="small" aria-label="Edit Shape">
          <DrawShapeIcon color="secondary" className={_shapeEditMode === "edit" ? "selected" : ""} />
        </IconButton>
      </Tooltip>
    </>
  );
}
