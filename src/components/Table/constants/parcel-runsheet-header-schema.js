
/* props is just a style object*/

const DocumentsHeadCells = [
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
    name: "instrumentType",
    label: "Instrument Type",
  },
  {
    name: "fromPartySummary",
    label: "Party of the First (Grantor)",
  },
  {
    name: "toPartySummary",
    label: "Party of the Second (Grantee)",
  },
  {
    name: "effectiveDate",
    label: "Effective Date",
  },
  {
    name: "executionDate",
    label: "Instrument Date",
  },
  {
    name: "fileDate",
    label: "File Date",
  },
  {
    name: "recordType",
    label: "Record Type",
  },
  {
    name: "recordationNumber",
    label: "Rec #",
  },
  {
    name: "volume",
    label: "Volumn",
  },
  {
    name: "page",
    label: "Page",
  },
  {
    name: "legalDescription",
    label: "Legal Description",
  },
  {
    name: "fileId",
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
];


export default DocumentsHeadCells;



