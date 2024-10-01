import React, { useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { get } from 'lodash';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch } from 'react-redux';

import { UPSERTCUSTOMLAYER } from 'graphQL/useMutationUpsertCustomLayer';
import { globalStateController } from 'hookstate/globalStateController';
import { popupController } from 'hookstate/popupStateController';
import { drawController } from 'hookstate/drawStateController';
import ShapeAOIPopup from '../popup/ShapeAOIPopup';
import DrawShapePopup from '../popup/DrawShapesPopup';
import ShapeActionsPopup from '../popup/ShapeActionsPopup';
import { mapControlsController } from 'hookstate/mapControlsController';

const useStyles = makeStyles(theme => ({
  mapOverlay: {
    position: 'fixed',
    minWidth: '320px',
    bottom: '20px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(1, 17, 51, 1.0)',
    color: '#fff',
    borderRadius: '25px',
  },
  mapOverlayInner: {
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    borderRadius: '3px',
    padding: '10px 20px',
  },
  popUp: {
    minWidth: '320px',
    padding: '10px 20px',
    borderRadius: '15px',
    backgroundColor: '#ffffff',
  },
  content: {
    flexDirection: 'row',
    display: 'flex',
    placeContent: 'center space-between',
    alignItems: 'center',
  },
  label: {
    margin: '0 10px',
    fontWeight: 'bold',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
    '& button': {
      marginLeft: '5px',
      marginRight: '5px',
    },
    '& svg': {
      color: '#fff',
      '&:hover': {
        color: 'rgb(102 146 202)',
      },
      '&.selected': {
        color: 'rgb(102 146 202)',
      },
      '&.disabled': {
        color: '#777',
      },
    },
  },
  disableAction: {
    '& svg': {
      color: '#717171',
    },
  },
  selectedAction: {
    '& svg': {
      color: 'rgb(102 146 202)',
    },
  },
  whiteText: {
    color: '#fff',
    '&:hover': {
      color: 'rgb(102 146 202)',
    },
  },
  gray: {
    color: '#777',
    '&:hover': {
      color: '#777',
    },
    '& svg': {
      color: '#777',
      '&:hover': {
        color: '#777',
      },
      '&.selected': {
        color: '#777',
      },
    },
    '& svg.close': {
      color: '#fff',
      '&:hover': {
        color: 'rgb(102 146 202)',
      },
    },
  },
  clearAction: {
    color: 'rgb(102 146 202)',
  },
  footer: {
    margin: '5px 0',
  },
  divider: {
    borderRight: '1px solid',
    backgroundColor: 'white',
    height: '20px',
    opacity: 0.8,
    margin: '5px',
  },
  multiSelectCheck: {
    display: 'flex',
    alignItems: 'center',
    '& button': {
      marginLeft: '5px',
      marginRight: '5px',
    },
    '& svg': {
      color: 'green',
    },
  },
  buttonContainer: {
    display: 'flex',
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
  },
  button: {
    width: '40%',
    justifyContent: 'space-evenly',
    backgroundColor: 'light gray',
    color: 'dark gray',
  },
  modalContainer: {
    background: 'white',
    width: '500px',
    textAlign: 'center',
    padding: '15px',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  parcelPopover: {
    '& .MuiPopover-paper': {
      left: '49% !important',
      top: 'auto !important',
      bottom: '98px !important',
    },
    '& .Mui-disabled': {
      paddingBottom: '10px',
      borderBottom: '1px solid lightgrey',
    },
    '& .MuiMenuItem-root': {
      '&:hover': {
        color: 'rgba(23, 170, 221, 1)',
      },
    },
  },
  convertPopoverGrid: {
    paddingRight: theme.spacing(3),
    color: 'black',
  },
  hoverGrid: {
    '&:hover': {
      color: 'gray',
    },
  },
  convertPopover: {
    '& .MuiPopover-paper': {
      left: '47% !important',
      top: 'auto !important',
      bottom: '98px !important',
    },
    '& .Mui-disabled': {
      paddingBottom: '10px',
      borderBottom: '1px solid lightgrey',
    },
    '& .MuiMenuItem-root': {
      '&:hover': {
        color: 'gray',
      },
    },
  },
  convertMenuColor: {
    color: 'black',
    '&:hover': {
      color: theme.palette.info.main,
    },
  },
  downloadIcon: { width: '30px', height: '28px' },
  contactIcon: { width: '35px', height: '20px' },
  areaExceed: {
    fontSize: 16,
    marginTop: 10,
  },
}));

const AddShapePopup = ({ onlyAddShape, upsertCustomLayer }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { drawStateValues } = drawController.useState(['currentFeature', 'showDataCard'], 'drawStateValues');

  const actionClose = (...props) => drawController.actionClose(dispatch, ...props);

  const isAOI = drawStateValues.currentFeature?.properties?.sdType === 'interest';
  const { mapControlsStateValues } = mapControlsController.useState(['mapGridCardActivated'], 'mapControlsStateValues');
  return (
    <>
      {/* --------------------------- for edit/create AOI -------------------------- */}
      {drawStateValues.showDataCard && isAOI && <ShapeAOIPopup upsertCustomLayer={upsertCustomLayer} />}

      <div className={classes.mapOverlay} style={mapControlsStateValues.mapGridCardActivated ? { bottom: '530px' } : {}}>
        <div className={classes.mapOverlayInner}>
          <div className={classes.content}>
            <ShapeActionsPopup
              classes={classes}
              selectedFeature={drawStateValues.currentFeature}
              popupCloseAction={actionClose}
              onlyAddShape={onlyAddShape}
            >
              <span className={classes.clearAction}>
                <Tooltip title="Close">
                  <IconButton size="small" onClick={actionClose} aria-label="Close" className={classes.clearAction}>
                    <CloseIcon className="close" fontSize="small" />
                  </IconButton>
                </Tooltip>
              </span>
            </ShapeActionsPopup>
          </div>
        </div>
      </div>
    </>
  );
};

export default function DrawShapes() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [upsertCustomLayer, { data: customLayerInsertedData }] = useMutation(UPSERTCUSTOMLAYER);

  const { mapReady, globalStateValues } = globalStateController.useState(['mapReady'], 'globalStateValues');
  const popupState = popupController.useState(['selectedUserDefinedLayer', 'selectedParcel', 'selectedShape']);
  const drawState = drawController.useState([
    'showShapeActionsPopup',
    'currentFeature',
    'showAddShapePopup',
    'lastSelectedDrawMode',
    'reDrawShape',
    'shapeEdit',
    'shapeEditMode',
    'showDrawShapesPopup',
    'editDraw',
    'addShape'
  ]);
  const drawStateValues = drawState.stateValues;

  const eventsConfiguredRef = useRef(false);

  useEffect(() => {
    const customLayer = get(customLayerInsertedData, 'upsertCustomLayer.customLayer');

    if (!customLayer) return;

    drawController.updateState({
      selectedAoi: customLayer,
    });
  }, [customLayerInsertedData]);

  useEffect(() => {
    const { showShapeActionsPopup } = drawStateValues;
    const { selectedUserDefinedLayer, selectedParcel, selectedShape } = popupState.stateValues;

    if (!selectedUserDefinedLayer) return;

    const isAOI = selectedUserDefinedLayer?.properties?.sdType === 'interest';

    drawController.updateState({
      currentFeature: selectedUserDefinedLayer,
      selectedAoi: isAOI ? selectedUserDefinedLayer : null,
    });

    if (isAOI && showShapeActionsPopup && !selectedParcel && !selectedShape) drawController.setShowDataCard(true);
  }, [popupState.selectedUserDefinedLayer]);

  useEffect(() => {
    if (!globalStateValues.mapReady) return;

    if (eventsConfiguredRef.current) return;

    /* ------------------------------ Run Only Once ----------------------------- */

    window.mapRef?.on('draw.update', drawController.drawUpdateListener);

    window.mapRef?.on('draw.create', drawController.drawCreateListener);

    window.mapRef?.on('draw.selectionchange', drawController.drawSelectionChangeListener);

    eventsConfiguredRef.current = true;
  }, [drawState.currentFeature, mapReady]);

  const actionClose = (...props) => drawController.actionClose(dispatch, ...props);

  const handleClose = () => mapControlsController.updateState({ anchorEl: null });

  const { currentFeature } = drawStateValues;

  const showDrawShapePopup =
    (drawStateValues.showDrawShapesPopup && !currentFeature) ||
    drawStateValues.addShape ||
    drawStateValues.reDrawShape;

  const showAddAndEditShapePopup =
    (drawStateValues.editDraw || drawStateValues.showShapeActionsPopup) &&
    currentFeature &&
    !drawStateValues.reDrawShape &&
    !currentFeature.id?.includes('draw_polygon') &&
    !currentFeature.id?.includes('drag_circle') &&
    !currentFeature.id?.includes('draw_rectangle') &&
    !currentFeature.id?.includes('edit_polygon');

  if (!globalStateValues.mapReady) return null;

  if (showDrawShapePopup)
    return (
      <ClickAwayListener onClickAway={handleClose}>
        <div className={classes.mapOverlay}>
          <div className={classes.mapOverlayInner}>
            <div className={classes.content}>
              <DrawShapePopup handleClose={handleClose} classes={classes}>
                <span className={classes.clearAction}>
                  <Tooltip title="Close">
                    <IconButton size="small" onClick={actionClose} aria-label="Close" className={classes.clearAction}>
                      <CloseIcon className="close" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </span>
              </DrawShapePopup>
            </div>
          </div>
        </div>
      </ClickAwayListener>
    );

  if (showAddAndEditShapePopup || drawStateValues.showAddShapePopup)
    return <AddShapePopup onlyAddShape={!!drawStateValues.showAddShapePopup} upsertCustomLayer={upsertCustomLayer} />;

  return null;

  // return (
  // 	<>
  // 		{showDrawShapePopup && (
  // 			<ClickAwayListener onClickAway={handleClose}>
  // 				<div className={classes.mapOverlay}>
  // 					<div className={classes.mapOverlayInner}>
  // 						<div className={classes.content}>
  // 							<DrawShapePopup handleClose={handleClose} classes={classes}>
  // 								<span className={classes.clearAction}>
  // 									<Tooltip title="Close">
  // 										<IconButton size="small" onClick={actionClose} aria-label="Close" className={classes.clearAction}>
  // 											<CloseIcon className="close" fontSize="small" />
  // 										</IconButton>
  // 									</Tooltip>
  // 								</span>
  // 							</DrawShapePopup>
  // 						</div>
  // 					</div>
  // 				</div>
  // 			</ClickAwayListener>
  // 		)}
  // 		{showAddAndEditShapePopup && <AddShapePopup upsertCustomLayer={upsertCustomLayer} />}
  // 		{drawStateValues.showAddShapePopup && <AddShapePopup onlyAddShape upsertCustomLayer={upsertCustomLayer} />}
  // 	</>
  // );
}
