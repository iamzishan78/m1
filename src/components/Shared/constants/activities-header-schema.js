const ActivitiesHeadCells = [
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
      label: "Activity Name",
    },
    {
      name: "type",
      label: "Type",
    },
    {
      name: "start",
      label: "Start Date",
    },
    {
      name: "end",
      label: "End Date",
    },
    {
      name: "contactName",
      label: "Contact Name",
    },
    {
      name: "ownerName",
      label: "Activity Owner",
    },
    {
      name: "dealName",
      label: "Deal Name",
    },
    {
      name: "isClosed",
      label: "Closed",
    },
    {
      name: "notes",
      label: "Notes",
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

  export default ActivitiesHeadCells;