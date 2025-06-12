import DeckGlOverlay from 'components/Map/DeckGL/helpers/DeckGlOverlay';
import { ifPlatformLandGridIdentifiers } from 'components/Shared/functions/shapeLayer';

import { drawController } from 'stateManagement/drawStateController';
import { popupController } from 'stateManagement/popupStateController';

const onAbstactLayerClick = (feature, action) => {
	if (!feature) {
		drawController.updateState({
			selectedAbstracts: [],
		});
		return;
	}

	const selectedAbstracts = drawController.getValue('selectedAbstracts');

	let drawStateToUpdate;

	DeckGlOverlay.addLayer({
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

	if (DeckGlOverlay?.getLayer('Land Grid_selection')) {
		DeckGlOverlay.removeLayer('Land Grid_selection');
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

	DeckGlOverlay.addLayer({
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
	const isFeatureSelected = selectedAbstracts.some(abstract => {
		const abstractIds = [abstract?.properties?.Id, abstract?.id, abstract?._id];
		const featureIds = [feature?.properties?.Id, feature?.id, feature?._id];

		return featureIds.some((id, idx) => id && abstractIds[idx] === id);
	});
	if (
		window.event.ctrlKey ||
		window.event.metaKey ||
		drawController.getValue('multiSelectLandGrids') ||
		ifPlatformLandGridIdentifiers(feature.layer.id)
	) {
		if (isFeatureSelected) {
			onAbstactLayerClick(feature, 'remove');
		} else {
			onAbstactLayerClick(feature, 'add');
		}
	}
};

export default landgridLayerClickHandler;
