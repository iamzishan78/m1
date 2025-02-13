import createVertex from '@mapbox/mapbox-gl-draw/src/lib/create_vertex';
// Function to calculate the center of a circle given its boundary points
const calculateCircleCenter = (vertices) => {
    let sumX = 0, sumY = 0;
    vertices.forEach(([x, y]) => {
        sumX += x;
        sumY += y;
    });
    return [sumX / vertices.length, sumY / vertices.length];
};

function createSupplementaryPointsForCircle(geojson, display) {
    const { properties, geometry } = geojson;

    if (!properties.user_isCircle) return null;

    const supplementaryPoints = [];
    const vertices = geometry.coordinates[0].slice(0, -1);
    for (let index = 0; index < vertices.length; index += Math.round((vertices.length / 4))) {
        supplementaryPoints.push(createVertex(properties.id, vertices[index], `0.${index}`, false));
    }

    // Calculate center point
    const center = calculateCircleCenter(vertices);
    if (center && display) {
        supplementaryPoints.push(createVertex(properties.id, center, "center", false));

        // Draw a line from center to last drawn point of the circle
        const lastPoint = vertices[vertices.length - 1];
        const centerLine = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [center, lastPoint]
            },
            properties: {
                id: `${properties.id}_centerLine`,
                parent: properties.id,
                active: false
            }
        };

        // Push line feature to be displayed on the map
        display(centerLine);
    }
    return supplementaryPoints;
}
export  default createSupplementaryPointsForCircle;