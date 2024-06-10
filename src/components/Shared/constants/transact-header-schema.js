const TransactDealsHeadCells = (flowLineType = 'deal') => {

  const TableHeads = [
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
      label: flowLineType === "general" ? "Task Name" : "Deal Name",
    },
    // Here cols will be added based on flowLineType
    {
      name: "pipelineName",
      label: "Flowline",
    },
    {
      name: "laneName",
      label: "Deal Stage",
    },
    {
      name: "status",
      label: "Status",
    },
    {
      name: "ownerName",
      label: "Owner",
    },
    {
      name: "notes",
      label: "Notes",
    },
    // {
    //   name: "isContact",
    //   label: " ",
    //   options: {
    //     filter: false,
    //     searchable: false,
    //     sort: false,
    //     download: false,
    //     print: false,
    //     viewColumns: false,
    //   },
    // },
  ];

  if (flowLineType === "general") {
    TableHeads.splice(2, 0, { name: "dueDate", label: "Due Date" })
  } else {
    const dealFLowLineCols = [
      // {
      //   name: "contactName",
      //   label: "Contact Name",
      // },
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

      // show user Information who created
      {
        name: "createBy",
        label: "Created By",
      },

      {
        name: "createAt",
        label: "Created Date",
      },

      {
        name: "lastUpdateBy",
        label: "Last Updated By",
      },

      {
        name: "lastUpdateAt",
        label: "Last Updated Date",
      }

    ];
    TableHeads.splice(2, 0, ...dealFLowLineCols);
  }

  return TableHeads
};


export default TransactDealsHeadCells;