import gql from "graphql-tag";

export const ADDLAYER = gql`
  mutation addLayer($layer: LayerInput) {
    addLayer(layer: $layer) {
      success
      message
      layer {
        _id
        layerName
        layerType
        layerCategory
        public
        defaultSettings
        createBy
        file
        originalFile
      }
    }
  }
`;
