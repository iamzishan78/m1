import { hookstate } from '@hookstate/core';

import { ROUTES } from 'components/Shared/FeatureFlag/common';
import { copy } from 'components/Shared/functions';

/* -------------------------------------------------------------------------- */
/*                           Layer State Controller                           */
/* -------------------------------------------------------------------------- */

export const layerStateInitialState = {
	projectedLayers: [],
	client: null,
	history: null,
	boundingStates: null,
	bbox: null,
	zoom: 0,
	recalculate: false,

	wellListFromSearch: [], // Not Moved
	rigsData: [], // Not Moved
};

export const layerState = hookstate(copy(layerStateInitialState));

/* -------------------------------------------------------------------------- */
/*                            Draw State Controller                           */
/* -------------------------------------------------------------------------- */

export const drawInitialState = {
	showDataCard: false,
	isDrawing: false,
	editDraw: false,
	showShapeActionsPopup: false,
	showDrawShapesPopup: false,
	multiSelectLandGrids: false,
	selectedAbstracts: [],
	currentFeature: null,
	shapeEdit: false,
	shapeEditMode: '',
	showAddShapePopup: false,
	featureToEdit: null,
	featureOrMapShape: null,
	selectedAoi: null,
	selectedPolygonString: '',
	reDrawShape: false,
	shapeToExtend: null,
	lastSelectedDrawMode: 'none',
	shapeActionsFilterSelected: false,
	selectedAction: '',
	addShape: false,
};

export const drawState = hookstate(copy(drawInitialState));
