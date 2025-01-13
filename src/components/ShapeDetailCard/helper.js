export const getShapeSubtitle = (properties, _shapeName) => {
	const state = properties.State || properties?.StateAbbreviation;
	const section = properties.Section || properties.ShortName;
	const township = properties?.Township;
	const range = properties?.Range;
	let blockTownship = `BLK ${properties?.Block || ''}`;
	if (!properties.Block && (properties.Township || '')) {
		blockTownship = `TOWN ${properties.Township || ''}`;
	}

	let shapeName;
	if (state === 'TX') {
		shapeName = properties.Survey + ' ' + properties.AbstractName;
	} else if (township && range && section) {
		shapeName = `T${township} R${range} — Section ${section}`;
	} else {
		shapeName = _shapeName;
	}
	if (shapeName.includes('undefined')) {
		shapeName = _shapeName;
	}

	let shapeSubtitle;
	if (properties.State === 'TX') {
		shapeSubtitle = `${properties?.County}, ${state || ''} - ${blockTownship}${section ? `, SEC ${section}` : ''}`;
	} else {
		shapeSubtitle = `${properties?.County}, ${state || ''} - ${shapeName}`;
	}

	return shapeSubtitle;
};
