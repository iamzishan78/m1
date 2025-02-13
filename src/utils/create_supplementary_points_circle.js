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

function createSupplementaryPointsForCircle(geojson) {
    const { properties, geometry } = geojson;

    if (!properties.user_isCircle) return null;

    const supplementaryPoints = [];
    const vertices = geometry.coordinates[0].slice(0, -1);
    for (let index = 0; index < vertices.length; index += Math.round((vertices.length / 4))) {
        supplementaryPoints.push(createVertex(properties.id, vertices[index], `0.${index}`, false));
    }

    // Calculate center point
    const center = calculateCircleCenter(vertices);
    if (center) {
        supplementaryPoints.push(createVertex(properties.id, center, "center", false));
    }
    return supplementaryPoints;
}
export  default createSupplementaryPointsForCircle;