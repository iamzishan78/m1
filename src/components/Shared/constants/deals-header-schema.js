
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
      name: "receivedDate",
      label: "Deal Received",
    },
    {
      name: "bidDate",
      label: "Bid Date",
    },
    {
      name: "closeDate",
      label: "Close Date",
    },
    {
      name: "closedPrice",
      label: "Closed Price",
    },
    {
      name: "totalNRA",
      label: "Total NRA",
    },
    {
      name: "totalNMA",
      label: "Total NMA",
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