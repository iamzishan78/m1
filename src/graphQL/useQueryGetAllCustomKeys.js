import gql from "graphql-tag";

export  const GET_ALL_CUSTOM_DATA_KEYS = gql`
      query getCustomDataKeys{
          getAllKeys(esIndex:"shapes_flat", pathToKey:"shapeJson.properties.custom_data")
      }
`;