
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
    name: "fileName",
    esKey: "name.keyword",
    dbName: "name",
    label: "File Name",
    options: {
      filter: true,
    },
  },
  // {
  //   name: "fileState",
  //   label: "FILE STATE",
  // },
  // {
  //   name: "dateTime",
  //   label: "DATE & TIME",
  // },
  {
    name: "documentNumber",
    esKey: "documentNumber.keyword",
    label: "Document Number",
    options: {
      filter: true,
    },
  },
  {
    name: "documentName",
    esKey: "documentName.keyword",
    label: "Document Name",
    options: {
      filter: true,
    },
  },
  {
    name: "documentType",
    esKey: "documentType.keyword",
    label: "Document Type",
    options: {
      filter: true,
    },
  },
  {
    name: "dateTime",
    esKey: "documentDate",
    label: "Document Date",
    options: {
      filter: false,
    },
    custom: { isDate: true, key_as_string: true },
  },
  {
    name: "uploadedDate",
    label: "Document Date",
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

  // TEMPORARY COMMENT OUT UNTIL FEATURE IS FIXED
  // {
  //   name: "partyName1",
  //   label: "Party 1 Name",
  // },
  // {
  //   name: "partyName2",
  //   label: "Party 2 Name",
  // },

  {
    name: "recordingInfo",
    esKey: "recordingInfo.keyword",
    label: "Recording Info",
    options: {
      filter: true,
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
    },
  },
  {
    name: "custom_data",
    label: "Custom Data",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      viewColumns: false,
    },
  },
  {
    name: "viewToken",
    label: "View Token",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      viewColumns: false,
    },
  },
];


export default DocumentsHeadCells;



