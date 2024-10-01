import React, { useMemo, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { drawController } from 'hookstate/drawStateController';
import MouseClicked from '../../../Shared/svgIcons/MouseClicked';
import DrawPoly from '../../../Shared/svgIcons/polygon';
import Rect from '../../../Shared/svgIcons/rectangle';
import CheckCircle from '../../../Shared/svgIcons/check-circle';
import { layerController } from 'hookstate/layerStateController';

const DrawShapesPopup = props => {
  const { classes, children, handleClose } = props;

  const drawState = drawController.useState([
    'multiSelectLandGrids',
    'currentFeature',
    'selectedAbstracts',
    'shapeToExtend',
    'shapeEditMode',
  ]);
  const drawStateValues = drawState.stateValues;
  const { zoom, layerStateValues } = layerController.useState(['zoom'], 'layerStateValues');

  const availableShapes = useMemo(
    () => [
      {
        title: 'Multiple Select',
        mode: 'simple_select',
        icon: <MouseClicked />,
        disable: layerStateValues.zoom <= 12,
      },
      {
        title: 'Polygon',
        mode: 'draw_polygon',
        icon: <DrawPoly />,
        disable: drawStateValues.multiSelectLandGrids,
      },
      {
        title: 'Circle',
        mode: 'drag_circle',
        icon: <RadioButtonUncheckedIcon id='mapCircle' fontSize="small" />,
        disable: drawStateValues.multiSelectLandGrids,
      },
      {
        title: 'Rectangle',
        mode: 'draw_rectangle',
        icon: <Rect />,
        disable: drawStateValues.multiSelectLandGrids,
      },
    ],
    [zoom, drawState.multiSelectLandGrids]
  );

  const parcelLabel = drawStateValues.selectedAbstracts.length > 1 ? 'tracts' : 'tract';

  const tooltipText =
    drawStateValues.selectedAbstracts.length > 0
      ? `${`${drawStateValues.selectedAbstracts.length} ${parcelLabel}`} selected`
      : 'Tooltip';

  return (
    <>
      <span className={classes.label}>{tooltipText}</span>

      {/* ------------------------------- Shape Icons ------------------------------ */}
      <span className={classes.actions}>
        {availableShapes.map(shape => (
          <Fragment key={shape.title}>
            <Tooltip title={shape.title} className={shape.disable ? classes.disableAction : ''}>
              <IconButton
                size="small"
                onClick={() => drawController.onActionClick(handleClose, shape)}
                aria-label={shape.title}
                disabled={shape.disable}
              >
                {shape.icon}
              </IconButton>
            </Tooltip>
          </Fragment>
        ))}
      </span>

      {/* --------------------------- Set Boundary Button -------------------------- */}
      <span className={classes.multiSelectCheck}>
        {(drawStateValues.selectedAbstracts.length > 0) && (
          <Tooltip title="Set Boundary">
            <IconButton size="small" aria-label="Set Boundary" onClick={drawController.createMultiSelectedFeature}>
              <CheckCircle />
            </IconButton>
          </Tooltip>
        )}
      </span>

      {children}
    </>
  );
};

export default DrawShapesPopup;
