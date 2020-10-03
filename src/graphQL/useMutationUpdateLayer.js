import gql from "graphql-tag";

export const UPDATELAYER = gql`
  mutation updateLayer($layer: LayerInput) {
    updateLayer(layer: $layer) {
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
        IsDeleted
      }
    }
  }
`;
