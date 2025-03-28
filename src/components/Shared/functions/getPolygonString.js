import Terraformer from 'terraformer-wkt-parser';
import * as turf from '@turf/turf';

export const getPolygonString = feature => {
	// If input is already a WKT string, attempt to fix it
	if (typeof feature === 'string') {
		return fixWKT(feature);
	}

	// Validate input structure
	if (!feature?.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
		return '';
	}

	try {
		let geoJSON = feature.geometry;

		// Fix self-intersections & ensure valid geometry
		geoJSON = fixSelfIntersections(geoJSON);

		// Ensure all polygon rings are closed
		geoJSON = ensureClosedGeometry(geoJSON);

		// Convert back to WKT
		const wktString = Terraformer.convert(geoJSON);

		return wktString;
	} catch (error) {
		console.error('Error converting GeoJSON to WKT:', error);
		return '';
	}
};

const fixWKT = wkt => {
	try {
		let geoJSON = Terraformer.parse(wkt);

		// Fix self-intersections
		geoJSON = fixSelfIntersections(geoJSON);

		// Ensure all polygon rings are closed
		geoJSON = ensureClosedGeometry(geoJSON);

		// Convert back to WKT
		return Terraformer.convert(geoJSON);
	} catch (error) {
		console.warn('Invalid WKT detected and could not be fixed:', wkt, error);
		return ''; // Return empty string if unfixable
	}
};

const ensureClosedRing = ring => {
	if (ring.length < 3) return ring; // Invalid polygon, return as is

	const first = ring[0];
	const last = ring[ring.length - 1];

	if (first[0] !== last[0] || first[1] !== last[1]) {
		ring.push([...first]); // Close the ring
	}

	return ring;
};

const ensureClosedGeometry = geoJSON => {
	if (geoJSON.type === 'Polygon') {
		geoJSON.coordinates = geoJSON.coordinates.map(ensureClosedRing);
	} else if (geoJSON.type === 'MultiPolygon') {
		geoJSON.coordinates = geoJSON.coordinates.map(polygon => polygon.map(ensureClosedRing));
	}
	return geoJSON;
};

const fixSelfIntersections = geoJSON => {
	try {
		if (geoJSON.type === 'Polygon') {
			// Fix self-intersections in a Polygon
			const cleaned = turf.unkinkPolygon(geoJSON);
			if (cleaned.features.length > 0) {
				return cleaned.features[0].geometry; // Return the first valid polygon
			}
		} else if (geoJSON.type === 'MultiPolygon') {
			// Fix self-intersections for each polygon inside MultiPolygon
			const fixedPolygons = geoJSON.coordinates.map(polygon => {
				const singlePolygon = { type: 'Polygon', coordinates: polygon };
				const cleaned = turf.unkinkPolygon(singlePolygon);
				return cleaned.features.length > 0 ? cleaned.features[0].geometry.coordinates : polygon;
			});

			return { type: 'MultiPolygon', coordinates: fixedPolygons };
		}
	} catch (error) {
		console.warn('Failed to fix self-intersections:', error);
	}

	return geoJSON; // Return original if fixing fails
};
