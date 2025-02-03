import { layerController } from 'hookstate/layerStateController';

export const getLayerColor = (layer, type, colors) => {
	// seting layer color to disabled if selectedAttribute is selected
	if (layer?.layerSettings?.selectedAttribute?.label) {
		return '#263551';
	}
	const { basinLayerColor, GLOUnitsColor, GLOLeasesColor } = colors;
	if (type !== 'layer' && type !== 'marketplace') {
		return {};
	}

	if (layer) {
		if (layer.type === 'Listing') {
			return '#2D3451';
		}
		if (layer.type === 'Auction') {
			return '#FF0000';
		}
		if (layer.type === 'Sponsor') {
			return '#00B050';
		}
	}

	if (layer) {

		if (layer.layerPaintProps && layer.layerPaintProps[0] && layer.layerPaintProps[0].paintProps) {
			if (layer.layerPaintProps[0].paintProps['circle-color']) {
				return layer.layerPaintProps[0].paintProps['circle-color'];
			}
			if (layer.layerPaintProps[0].paintProps['fill-color']) {
				return layer.layerPaintProps[0].paintProps['fill-color'];
			}
			if (layer.layerPaintProps[0].paintProps['line-color']) {
				return layer.layerPaintProps[0].paintProps['line-color'];
			}
			if (layer.layerPaintProps[0].paintProps['icon-color']) {
				return layer.layerPaintProps[0].paintProps['icon-color'];
			}
		}

		if (layer.layerPaintProps && layer.layerPaintProps.ids && layer.layerPaintProps.ids[0]) {
			if (layer.layerPaintProps.ids[0] == 'basinLayer') {
				return basinLayerColor;
			}
			if (layer.layerPaintProps.ids[0] == 'GLOUnits') {
				return GLOUnitsColor;
			}
			if (layer.layerPaintProps.ids[0] == 'GLOLeases') {
				return GLOLeasesColor;
			}
		}
	}
	return '#263451';
};

export const ifLayerHaveData = layer => {
	//// temporary disabling the Title Layer
	if (layer.identifier === 'Title') {
		return false;
	}
	////

	const { wellListFromSearch } = layerController.getValues(['wellListFromSearch']);

	if (
		layer.identifier === 'Search' &&
		!(wellListFromSearch && wellListFromSearch.length > 0)
	) {
		return false;
	}
	return true;
};
