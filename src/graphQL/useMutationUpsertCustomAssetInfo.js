import gql from 'graphql-tag';

export const UPSERT_CUSTOM_ASSET_INFO = gql`
  mutation upsertCustomAssetInfo(
    $tableName: String
    $modelKeys: [JSON]
    $creationPlace: String
  ) {
    upsertCustomAssetInfo(
      tableName: $tableName
      modelKeys: $modelKeys
      creationPlace: $creationPlace
    )
  }
`;
