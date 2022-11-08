
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
      setCellProps: () => ({
        style: {
          minWidth: "150px",
          whiteSpace: "pre-wrap",
          position: "sticky",
          left: "77px",
          zIndex: 200
        }
      }),
      setCellHeaderProps: () => ({
        style: {
          position: "sticky",
          minWidth: "150px",
          left: "77px",
          zIndex: 201
        }
      }),
      filter: true
    }
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
    name: "documentNumber",
    label: "File Number",
    esKey: "documentNumber.keyword",
    options: {
      filter: true
    }
  },
  {
    name: "documentName",
    label: "File Name",
    esKey: 'documentName.keyword',
    options: {
      filter: true
    }
  },
  {
    name: "documentType",
    label: "File Type",
    esKey: 'documentType.keyword',
    options: {
      filter: true
    }
  },
  {
    name: "documentDate",
    label: "File Date",
    esKey: 'documentDate',
    options: {
      filter: true
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
    },
  },
  {
    name: "page",
    esKey: "page.keyword",
    label: "Page",
    options: {
      filter: true,
    },
  },
  {
    name: "instrument",
    esKey: "instrument.keyword",
    label: "Instrument #",
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



