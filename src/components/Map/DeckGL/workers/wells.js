export const workerFunction = event => {
  const getFillColor = w => {
    switch (w.properties.wellType) {
      // rgb(2, 207, 53)
      case 'OIL':
      case 'OIL AND GAS':
        return [2, 207, 53];

      // rgb(230, 15, 15)
      case 'GAS':
        return [230, 15, 15];

      // rgb(74, 211, 242)
      case 'WATER':
        return [74, 211, 242];

      // rgb(251, 152, 40)
      case 'PERMIT':
      case 'PERMIT - NEW DRILL':
      case 'PERMIT - EXISTING WELL':
        return [251, 152, 40];

      // rgba(30, 26, 26, 0.55)
      case 'PERMITTED':
        return [30, 26, 26, 0.55];

      // rgb(192, 0, 0)
      default:
        return [192, 0, 0];
    }
  };
  const { data, type } = event.data;
  const colors = new Uint8Array(data.flatMap(d => getFillColor(d)));

  const customMessageObject = {};
  const customMessageArray = [];

  if (type === 'point') {
    customMessageObject.positions = new Float64Array(
      data.flatMap(d => d.geometry.geometries?.[0]?.coordinates || d.geometry.coordinates)
    );
    customMessageArray.push(customMessageObject.positions.buffer);
  } else if (type === 'line') {
    customMessageObject.sourcePositions = new Float64Array(
      data.flatMap(d => d.geometry.geometries?.[1]?.coordinates?.[0])
    );
    customMessageObject.targetPositions = new Float64Array(
      data.flatMap(d => d.geometry.geometries?.[1]?.coordinates?.[1])
    );
    customMessageArray.push(customMessageObject.sourcePositions.buffer);
    customMessageArray.push(customMessageObject.targetPositions.buffer);
  }

  postMessage({ count: data.length, ...customMessageObject, colors }, [
    ...customMessageArray,
    colors.buffer,
  ]);
};
