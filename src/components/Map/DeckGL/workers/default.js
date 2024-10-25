export const workerFunction = event => {
  try {
    const { data, type } = event.data;

    const customMessageObject = {};
    const customMessageArray = [];

    // const options = { PositionDataType: Float64Array };

    switch (type) {
      case 'geojson':
        // const binaryFeatures = geojsonToBinary(data, options);
        customMessageObject.data = data;

        break;

      case 'polygon':
        // const binaryFeatures = geojsonToBinary(data, options);
        customMessageObject.data = data;

        break;

      case 'text':
        // const binaryFeatures = geojsonToBinary(data, options);
        customMessageObject.data = data;

        break;

      default:
        break;
    }

    postMessage({ /* count: data.length ,*/ ...customMessageObject }, [
      ...customMessageArray,
    ]);
  } catch (err) {
    console.log('🚀 ~ file: default.js:1393 ~ workerFunction ~ err:', err);
  }
};
