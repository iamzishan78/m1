export const SHAPE_TYPE = {
  wells: {
    SEARCH_FIELDS: ["wellName", "api", 'ApiNumber'],
  },
  contacts: {
    SEARCH_FIELDS: ['name', 'address1', 'city', 'state', 'zip'],
  },
  'tax owners': {
    SEARCH_FIELDS: ["ownerName", "streetAddress", "city", "state", "zip"],
  },
  operators: {
    SEARCH_FIELDS: ["operator", 'Operator'],
  },
  leases: {
    SEARCH_FIELDS: ["lease", "leaseId"],
  },
  'land grid': {
    SEARCH_FIELDS: [
      "_all"
      // "level1Type",
      // "level1Name",
      // "level2Type",
      // "level2Name",
      // "level3Type",
      // "level3Name",
      // "level4Type",
      // "level4Name",
      // "level5Type",
      // "level5Name",
      // "level6Type",
      // "level6Name"
    ],
  },
  units: {
    SEARCH_FIELDS: ["name", "shapeJson.properties.uNumber", "shapeJson.properties.originalProperties.County", "data.shapeJson.properties.originalProperties.State"],
  },
  tracts: {
    SEARCH_FIELDS: ['name', 'shapeLabel', 'state', "shapeJson.properties.originalProperties.County"],
  },
  agreements: {
    SEARCH_FIELDS: ['name', 'shapeJson.properties.shapeLabel', 'state', "shapeJson.properties.originalProperties.County", 'shapeJson.properties.agreementNumber', 'shapeJson.properties.agreementType'],
  },
}