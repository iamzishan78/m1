
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
    name: "instrument_type",
    label: "Instrument Type",
  },
  {
    name: "documentNumber",
    label: "Party of the First (Grantor)",
  },
  {
    name: "documentName",
    label: "Party of the Second (Grantee)",
  },
  {
    name: "documentType",
    label: "Effective Date",
  },
  {
    name: "dateTime",
    label: "Instrument Date",
  },
  {
    name: "dateTime",
    label: "File Date",
  },
  {
    name: "recordingInfo",
    label: "Record Type",
  },
  {
    name: "recordingInfo",
    label: "Rec #",
  },
  {
    name: "recordingInfo",
    label: "Volumn",
  },
  {
    name: "recordingInfo",
    label: "Page",
  },
  {
    name: "recordingInfo",
    label: "Legal Description",
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
    name: " ",
    label: " ",
    options: {
      display: true,
      filter: false,
      searchable: false,
      sort: false,
      viewColumns: false,
    }
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



