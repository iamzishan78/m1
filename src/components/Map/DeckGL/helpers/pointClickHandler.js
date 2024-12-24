import { popupController } from 'hookstate/popupStateController';

const pointClickHandler = feature => {
	if (feature.properties.id && feature.identifier !== 'Recent Submitted Permits') {
		popupController.setState({
			selectedWellId: feature.properties.id.toLowerCase(),
			wellSelectedCoordinates: feature.geometry.coordinates,
			data: feature.properties,
		});
	} else if (feature.properties.Id && feature.identifier === 'Recent Submitted Permits') {
		popupController.setState({
			selectedPermitId: feature.properties.Id.toLowerCase(),
			permitSelectedCoordinates: feature.geometry.coordinates,
			data: feature.properties,
		});
	}
};

export default pointClickHandler;
