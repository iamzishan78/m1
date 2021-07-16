
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
    name: "grantor",
    label: "Party of the First (Grantor)",
  },
  {
    name: "grantee",
    label: "Party of the Second (Grantee)",
  },
  {
    name: "effective_date",
    label: "Effective Date",
  },
  {
    name: "instrument_date",
    label: "Instrument Date",
  },
  {
    name: "file_date",
    label: "File Date",
  },
  {
    name: "record_type",
    label: "Record Type",
  },
  {
    name: "rec_num",
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
    name: "legal_description",
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



