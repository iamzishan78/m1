
/* props is just a style object*/
import { formatDate } from 'components/Shared/functions';

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
      setCellProps: () => ({
        style: {
          minWidth: "150px",
          whiteSpace: "pre-wrap",
          position: "sticky",
          left: "125px",
          zIndex: 200
        }
      }),
      setCellHeaderProps: () => ({
        style: {
          position: "sticky",
          minWidth: "150px",
          left: "125px",
          zIndex: 201
        }
      }),
      stickyColumn: true,
      filter: true,
      sortThirdClickReset: true,
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

  // infiniteScroll key should be added in a which do not have customRender in schema file as it will be override in table.js
  {
    name: "documentNumber",
    infiniteScroll: true,
    esKey: "documentNumber.keyword",
    label: "File Number",
    options: {
      filter: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: "documentName",
    esKey: "documentName.keyword",
    label: "File Description",
    options: {
      filter: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: "documentType",
    esKey: "documentType.keyword",
    label: "File Type",
    options: {
      filter: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: "dateTime",
    esKey: "documentDate",
    label: "File Date",
    options: {
      filter: false,
      sortThirdClickReset: true,
    },
    custom: { isDate: true, key_as_string: true },
  },
  {
    name: "uploadedDate",
    label: "File Date",
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
    name: "book",
    esKey: "book.keyword",
    label: "Book",
    options: {
      filter: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: "page",
    esKey: "page.keyword",
    label: "Page",
    options: {
      filter: true,
      sortThirdClickReset: true,
    },
  },
  {
    name: "instrument",
    esKey: "instrument.keyword",
    label: "Instrument #",
    options: {
      filter: true,
      sortThirdClickReset: true,
      setCellProps: () => ({ style: { minWidth: "175px" } }),
    },
  },

  {
    name: "createBy",
    label: "Created By",
    esKey: "createBy",
    options: {
      display: true,
      customRender: (value) => {
        return <>{value?.name}</>
      }
    },
  },

  {
    name: "createAt",
    label: "Created Date",
    esKey: "createAt",
    options: {
      display: true,
      customRender: (value) => {
        return <>{formatDate(value)}</>
      }
    },
    custom: {
      key_as_string: true,
      isDate: true,
    },
  },

  {
    name: "lastUpdateBy",
    label: "Last Updated By",
    esKey: "lastUpdateBy",
    options: {
      display: true,
      customRender: (value) => {
        return <>{value?.name}</>
      }
    },
  },

  {
    name: "lastUpdateAt",
    label: "Last Updated Date",
    esKey: "lastUpdateAt",
    options: {
      display: true,
      customRender: (value) => {
        return <>{formatDate(value)}</>
      }
    },
    custom: {
      key_as_string: true,
      isDate: true,
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

  // hiding recordingInfo
  // {
  //   name: "recordingInfo",
  //   esKey: "recordingInfo.keyword",
  //   label: "Recording Info",
  //   options: {
  //     display: false,
  //     filter: false,

  //   },
  // },
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



