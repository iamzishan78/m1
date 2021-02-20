const CustomWellsHeadCells = [
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
    { name: "wellName", label: "Well" },
    { name: "apiNumber", label: "API" },
    { name: "operator", label: "Operator" },
    { name: "wellType", label: "Type" },
    { name: "wellProfile", label: "Profile" },
    { name: "wellStatus", label: "Status" },
    {
      name: "tags",
      label: "Tags ",
      options: {
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
  ];
  
export default CustomWellsHeadCells;
