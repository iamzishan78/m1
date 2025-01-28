export const getPolygonString = feature => {
	if (typeof feature === 'string') {
		return feature;
	}

	let polygonString = '';
	if (feature?.geometry) {
		if (feature.geometry.type === 'MultiPolygon') {
			polygonString = 'MULTIPOLYGON(';
			feature.geometry.coordinates?.forEach((multiCoordinates, index) => {
				polygonString += '((';
				multiCoordinates.forEach(coordinate => {
					coordinate.forEach((cor, corIndex) => {
						polygonString += cor[0] + ' ' + cor[1];
						if (corIndex < coordinate.length - 1) {
							polygonString += ', ';
						}
					});
				});
				polygonString += '))';
				if (index !== feature.geometry.coordinates.length - 1) {
					polygonString += ',';
				}
			});
			polygonString += ')';
		} else {
			polygonString = 'POLYGON((';
			feature.geometry.coordinates?.[0]?.forEach?.((coordinate, index) => {
				polygonString += coordinate[0] + ' ' + coordinate[1];
				if (index < feature.geometry.coordinates[0].length - 1) {
					polygonString += ', ';
				}
			});
			polygonString += '))';
		}
	}
	return polygonString;
};
