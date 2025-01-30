import DeckGlLayer from 'components/Map/DeckGL/helpers/DeckGlLayer';

import { drawController } from 'hookstate/drawStateController';
import { popupController } from 'hookstate/popupStateController';

const onAbstactLayerClick = (feature, action) => {
	if (!feature) {
		drawController.updateState({
			selectedAbstracts: [],
		});
		return;
	}

	const selectedAbstracts = drawController.getValue('selectedAbstracts');

	let drawStateToUpdate;

	DeckGlLayer.addLayer({
		layerId: 'Land Grid_selection',
		type: 'SimpleGeoJsonLayer',
		props: {
			data: [],
			pickable: true,
			stroked: false,
			filled: true,
			getFillColor: [136, 136, 136, 77],
		},
	});

	if (DeckGlLayer?.getLayer('Land Grid_selection')) {
		DeckGlLayer.removeLayer('Land Grid_selection');
	}

	let requiredAbstracts = [];

	if (action === 'add') {
		requiredAbstracts = [...selectedAbstracts, feature];
		drawStateToUpdate = {
			...drawStateToUpdate,
			showDrawShapesPopup: true,
			currentFeature: undefined,
			selectedAbstracts: requiredAbstracts,
		};
	}
	if (action === 'remove') {
		requiredAbstracts = selectedAbstracts.filter(abstract => abstract.properties.Id !== feature.properties.Id);
		drawStateToUpdate = {
			...drawStateToUpdate,
			currentFeature: undefined,
			selectedAbstracts: requiredAbstracts,
		};
	}

	DeckGlLayer.addLayer({
		layerId: 'Land Grid_selection',
		type: 'SimpleGeoJsonLayer',
		props: {
			data: requiredAbstracts,
			pickable: true,
			stroked: false,
			filled: true,
			getFillColor: [136, 136, 136, 77],
		},
	});

	if (drawStateToUpdate) {
		drawController.updateState(drawStateToUpdate);
	}
	popupController.updateState({
		popupOpen: false,
	});
};

const landgridLayerClickHandler = feature => {
	if (!feature) {
		return;
	}
	const drawMode = window.drawRef.getMode();
	if (drawMode.includes('draw') || drawMode.includes('drag')) {
		return;
	}

	const selectedAbstracts = drawController.getValue('selectedAbstracts');
	const isFeatureSelected = selectedAbstracts.find(abstract => abstract?.properties?.Id === feature?.properties?.Id);
	if (window.event.ctrlKey || window.event.metaKey || drawController.getValue('multiSelectLandGrids')) {
		if (isFeatureSelected) {
			onAbstactLayerClick(feature, 'remove');
		} else {
			onAbstactLayerClick(feature, 'add');
		}
	}
};

export default landgridLayerClickHandler;
