
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
    sortKey: 'name.keyword',
    dbName: "name",
    label: "File Name",
    options: {
      filter: true,
    }
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
    sortKey: 'documentNumber.keyword',
    label: "Document Number",
  },
  {
    name: "documentName",
    sortKey: 'documentName.keyword',
    label: "Document Name",
  },
  {
    name: "documentType",
    sortKey: 'documentType.keyword',
    label: "Document Type",
  },
  {
    name: "documentDate",
    sortKey: 'documentDate.keyword',
    label: "Document Date",
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
    sortKey: 'recordingInfo.keyword',
    label: "Recording Info",
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





];


export default DocumentsHeadCells;



