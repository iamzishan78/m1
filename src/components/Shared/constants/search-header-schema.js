const SearchsHeadCells = [


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
  
  
    //////////
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
        searchable: false,
        download: false,
        print: false,
        viewColumns: false,
        filterOptions: {
          names: ["Tracked", "Untracked"],
          logic(tracked, filterVal) {
            return !(
              (filterVal.indexOf("Tracked") >= 0 && tracked) ||
              (filterVal.indexOf("Untracked") >= 0 && !tracked)
            );
          },
        },
        filterType: "dropdown",
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
      name: "isContact",
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
  ];

export default SearchsHeadCells;