const unitsColumnHeaders = [
    {
      name: "uNumber",
      label: "Unit #",
      esKey: "shapeJson.properties.uNumber.keyword",
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "name",
      label: "Unit Name",
      esKey: "name.keyword",
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "State",
      label: "State",
      esKey: "shapeJson.properties.originalProperties.State.keyword",
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "County",
      label: "County",
      esKey: "shapeJson.properties.originalProperties.County.keyword",
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "Block",
      label: "Block",
      esKey: "shapeJson.properties.originalProperties.Block.keyword",
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "Section",
      label: "Section",
      esKey: "shapeJson.properties.originalProperties.Section.keyword",
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "shapeArea",
      label: "Gross Acres",
      esKey: "shapeJson.properties.shapeArea.keyword",
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "uUnitPricing",
      label: "Price/Acre",
      esKey: "shapeJson.properties.uUnitPricing.keyword",
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "PermitCount",
      label: "Active Permits",
      esKey: "permitCount",
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "coordinates",
      label: " ",
      options: {
        filter: false,
        sort: false,
        searchable: false,
        download: false,
        print: false,
        viewColumns: false,
      },
    },
  ];
  
  export default unitsColumnHeaders