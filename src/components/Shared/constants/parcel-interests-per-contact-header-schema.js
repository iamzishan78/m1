const ParcelInterestsPerContactHeadCells = [
    {
      name: "_id",
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
      name: "ownerEntity",
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
      name: "customLayerId",
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
    //// from parcel
    { name: "customLayerName", label: "Name" },
    { name: "customLayerState", label: "State" },
    { name: "customLayerCounty", label: "County" },
    { name: "Grid1", label: "Survey/ Meridian" },
    { name: "Grid2", label: "Block/ Township" },
    { name: "Grid3", label: "Section/ Range" },
    { name: "Grid4", label: "Abstract/ Section" },
    { name: "Grid5", label: "Alternate Survey" },
    //// from parcelOwnership
    { name: "depthFrom", label: "Depth From", editable: true },
    { name: "depthTo", label: "Depth To", editable: true },
    { name: "interest", label: "Interest", editable: true },
    { name: "nma", label: "NMA", editable: true },
    { name: "nra", label: "NRA", editable: true },
  
    {
      name: "parcelIcon",
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
      label: "Track",
      options: {
        searchable: false,
        download: false,
        print: false,
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
  ];

  export default ParcelInterestsPerContactHeadCells;