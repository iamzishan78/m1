export const API_TYPE = (action) => ({
  STARTED: `${action}_STARTED`,
  FULLFILLED: `${action}_FULLFILLED`,
  REJECTED: `${action}_REJECTED`,
});

export const getSelectedFeaturePolygonString = (feature) => {
  let polygonString = "POLYGON((";
  feature.geometry.coordinates[0].forEach((coordinate, index) => {
    polygonString += coordinate[0] + " " + coordinate[1];
    if (index < feature.geometry.coordinates[0].length - 1) {
      polygonString += ", ";
    }
  });
  polygonString += "))";

  return polygonString;
};
