
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
    name: "DOCUMENT NAME",
    label: "Document Name",
  },
  {
    name: "DOCUMENT TYPE",
    label: "Document Type",
  },
  {
    name: "DOCUMENT DATE",
    label: "Document Date",
  },
  // {
  //   name: "RELATED PARTY NAME",
  //   label: "RELATED PARTY NAME",
  // },

  {
    name: "PARTY 1 NAME",
    label: "Party 1 Name",
  },
  {
    name: "PARTY 2 NAME",
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



