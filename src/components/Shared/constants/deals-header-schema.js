
const DealsHeadCells = [
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
      name: "name",
      label: "Deal Name",
    },
    {
      name: "offerPrice",
      label: "Offer Price",
    },
    {
      name: "closeDate",
      label: "Expected Close Date",
    },
    {
      name: "pipelineName",
      label: "Flowline",
    },
    {
      name: "laneName",
      label: "Deal Stage",
    },
    {
      name: "ownerName",
      label: "Deal Owner",
    },
    {
      name: "notes",
      label: "Notes",
    },
  ];

  export default DealsHeadCells;