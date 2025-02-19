import { popupController } from 'controllers/popupStateController';

const pointClickHandler = feature => {
	popupController.setState({
		selectedWellId: feature.properties.id.toLowerCase(),
		wellSelectedCoordinates: feature.geometry.coordinates,
		data: feature.properties,
	});
};

export default pointClickHandler;
