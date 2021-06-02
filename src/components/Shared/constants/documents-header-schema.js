
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
    label: "Document Number",
  },
  {
    name: "documentName",
    label: "Document Name",
  },
  {
    name: "documentType",
    label: "Document Type",
  },
  {
    name: "dateTime",
    label: "Document Date",
  },
  // {
  //   name: "RELATED PARTY NAME",
  //   label: "RELATED PARTY NAME",
  // },

  {
    name: "partyName1",
    label: "Party 1 Name",
  },
  {
    name: "partyName2",
    label: "Party 2 Name",
  },
  {
    name: "RECORDING INFO",
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



