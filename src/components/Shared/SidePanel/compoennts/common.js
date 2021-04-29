export const getLayerColor = (layer, type, colors) => {
    const { basinLayerColor, GLOUnitsColor, GLOLeasesColor } = colors
    // layerName: "Rig Activity"
    if (type !== "layer" && type !== "marketplace") return {};

    if (layer) {
        if (layer.type === "Listing") return "#2D3451";
        if (layer.type === "Auction") return "#FF0000";
        if (layer.type === "Sponsor") return "#00B050";
    }

    if (layer) {
        if (layer.identifier == "Rig Activity") return "#263451";

        if (
            layer.layerPaintProps &&
            layer.layerPaintProps[0] &&
            layer.layerPaintProps[0].paintProps
        ) {
            if (layer.layerPaintProps[0].paintProps["circle-color"])
                return layer.layerPaintProps[0].paintProps["circle-color"];
            if (layer.layerPaintProps[0].paintProps["fill-color"])
                return layer.layerPaintProps[0].paintProps["fill-color"];
            if (layer.layerPaintProps[0].paintProps["line-color"])
                return layer.layerPaintProps[0].paintProps["line-color"];
            if (layer.layerPaintProps[0].paintProps["icon-color"])
                return layer.layerPaintProps[0].paintProps["icon-color"];
        }

        if (
            layer.layerPaintProps &&
            layer.layerPaintProps.ids &&
            layer.layerPaintProps.ids[0]
        ) {
            if (layer.layerPaintProps.ids[0] == "basinLayer")
                return basinLayerColor;
            if (layer.layerPaintProps.ids[0] == "GLOUnits") return GLOUnitsColor;
            if (layer.layerPaintProps.ids[0] == "GLOLeases") return GLOLeasesColor;
        }
    }
    return "#263451";
};

export const ifLayerHaveData = (layer, stateApp) => {
    //// temporary disabling the Title Layer
    if (layer.identifier === "Title") return false;
    ////

    if (
        (layer.identifier === "User Tags" &&
            !(
                stateApp.wellListFromTagsFilter &&
                stateApp.wellListFromTagsFilter.length > 0
            )) ||
        (layer.identifier === "Search" &&
            !(
                stateApp.wellListFromSearch && stateApp.wellListFromSearch.length > 0
            )) ||
        (layer.identifier === "Tracked Wells" &&
            !(stateApp.trackedwells && stateApp.trackedwells.length > 0)) ||
        (layer.identifier === "Tracked Owners" &&
            !(stateApp.trackedOwnerWells && stateApp.trackedOwnerWells.length > 0))
    )
        return false;
    return true;
};
