
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
    label: "File Name",
    esKey: 'name.keyword',
    options: {
      filter: true
    }
  },
  {
    name: "fileId",
    options: {
      display: false,
      filter: true,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },
  // {
  //   name: "dateTime",
  //   label: "DATE & TIME",
  // },
  {
    name: "documentNumber",
    label: "Document Number",
    esKey: "documentNumber.keyword",
    options: {
      filter: true
    }
  },
  {
    name: "documentName",
    label: "Document Name",
    esKey: 'documentName.keyword',
    options: {
      filter: true
    }
  },
  {
    name: "documentType",
    label: "Document Type",
    esKey: 'documentType.keyword',
    options: {
      filter: true
    }
  },
  {
    name: "documentDate",
    label: "Document Date",
    esKey: 'documentDate',
    options: {
      filter: true
    }
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
  // {
  //   name: "RELATED PARTY NAME",
  //   label: "RELATED PARTY NAME",
  // },

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
    label: "Recording Info",
    esKey: 'recordingInfo.keyword',
    options: {
      filter: true
    }
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
    name: "viewToken",
    label: "View Token",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
      viewColumns: false,
    }
  },




];


export default DocumentsHeadCells;



