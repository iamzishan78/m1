const wellsColumnHeaders = [
    {
      name: "id",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
        download: false,
        print: false,
        viewColumns: false,
      },
    },
    {
      name: "wellId",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
        download: false,
        print: false,
        viewColumns: false,
      },
    },
    {
      name: "wellName",
      label: "Well",
      options: {
        filter: false,
      },
    },
    {
      name: "apiNumber",
      label: "API",
      options: {
        filter: false,
      },
    },
    {
      name: "operator",
      label: "Operator",
      options: {
        filter: false,
      },
    },
    {
      name: "interestType",
      label: "Type",
      options: {
        filter: false,
      },
    },
    {
      name: "ownershipPercentage",
      label: "Interest",
      options: {
        filter: false,
      },
    },
    {
      name: "appraisedValue",
      label: "Appraised Value",
      options: {
        filter: false,
      },
    },
    {
      name: "tags",
      label: "Tags ",
      options: {
        filter: false,
        sort: false,
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
      name: "isTracked",
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
    {
      name: "detailCard",
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

  export default wellsColumnHeaders;