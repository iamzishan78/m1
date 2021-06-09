export const clearMapAndCloseShapeActionsPopup = (stateApp, setStateApp) => {
    const { draw, map, currentFeature } = stateApp;
    draw.delete(currentFeature?.id);
    setStateApp((state) => ({
        ...state,
        editDraw: false,
        currentFeature: undefined,
        isAbstractedLayersPolygon: false,
        multiSelectLandGrids: false,
        selectedAbstracts: [],
        showShapeActionsPopup: false,
        showDrawShapesPopup: false,
    }));

    // unselecting the grids
    const featuresList = map.getSource("abstract_geo_source")._data.features;
    for (let i = 0; i < featuresList.length; i++) {
        const id = featuresList[i].properties.Id;
        map.setFeatureState({ source: "abstract_geo_source", id: id }, { click: false });
    }
};