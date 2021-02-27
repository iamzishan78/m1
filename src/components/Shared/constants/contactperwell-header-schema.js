
const ContactWellHeadCells = [
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
    { name: "api", label: "API" },
    { name: "lease", label: "Lease" },
    { name: "leaseAcres", label: "Lease Acres" },
    { name: "interestOwner", label: "Interest Owner" },
    {
      name: "entity",
      label: "Entity",
      options: {
        display: false
      }
    },
    { name: "type", label: "Type" },
    { name: "amount", label: "Amount" },
    { name: "taxValue", label: "Tax Value" },
    { name: "nra", label: "NRA" },
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

  export default ContactWellHeadCells;