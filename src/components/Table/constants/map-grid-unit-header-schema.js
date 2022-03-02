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
      name: "ownersCount",
      label: "Owners",
      esKey: "ownerCount.keyword",
      options: {
        sort: true,
        filter: false,
      },
    },
    {
      name: "campaignName",
      label: "Campaign Name",
      esKey: "shapeJson.properties.campaignName",
      options: {
        customRender: (value) => value?.map(v => `${v}, `),
        sort: true,
        filter: true,
      },
    },
    {
      name: "qualifier",
      label: "Qualifier",
      esKey: "shapeJson.properties.qualifier.name.keyword",
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "unitStatus",
      label: "Unit Status",
      options: {
        sort: true,
        filter: false,
      },
    },
    {
      name: "lastUpdated",
      label: "Last Updated",
      esKey: "_ts",
      options: {
        sort: true,
        filter: false,
      }
    },
    {
      name: "tags",
      label: "Tags ",
      options: {
        sort: false,
        filter: false,
        download: false,
        print: false,
        filterOptions: {
          names: [],
          logic(rowVal, pickedTags) {
            let containIts = true;
            pickedTags.map((pickedTag) => {
              if (rowVal[0].indexOf(pickedTag) === -1) {
                containIts = false;
              }
            });
            return !containIts;
          },
        },
      },
    },
    {
      name: "commentsCounter",
      label: " ",
      options: {
        filter: false,
        searchable: false,
        sort: false,
        download: false,
        print: false,
        viewColumns: false,
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