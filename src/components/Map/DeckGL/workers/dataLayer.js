export const pointWorkerFunction = event => {
  const { data } = event.data;

  const customMessageObject = {};
  const customMessageArray = [];

  customMessageObject.positions = new Float64Array(
    data.flatMap(d => d.geometry.geometries?.[0]?.coordinates || d.geometry.coordinates)
  );
  customMessageArray.push(customMessageObject.positions.buffer);

  postMessage({ count: data.length, ...customMessageObject }, [...customMessageArray]);
};
