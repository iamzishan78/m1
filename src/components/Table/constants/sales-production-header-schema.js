const ProductionDetailsHeaders = [
    {
      name: "Id",
      editable: false,
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: true,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
      },
    },
    {
      name: "propertyNumber",
      label: "Property Number",
      esKey: "property.number.keyword",
      options: {
        sort: true,
        searchable: false,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
      },
    },
    {
      name: "propertyName",
      label: "Property Number",
      esKey: "property.name.keyword",
      options: {
        sort: true,
        searchable: false,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
      },
    },
    {
      name: "apiNumber",
      label: "API Number",
      esKey: "wells.apiNumber.keyword",
      options: {
        sort: true,
        searchable: false,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
      },
    },
    {
      name: "wellName",
      label: "Well Name",
      esKey: "wells.wellName.keyword",
      options: {
        sort: true,
        searchable: false,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
      },
    },
    {
      name: "date",
      label: "Sales Date",
      esKey: "date",
      options: {
        sort: true,
        searchable: false,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
      },
      custom: {
        key_as_string: true,
        isDate: true,
      },
    },
    {
      name: "product",
      label: "Product",
      esKey: "product.keyword",
      options: {
        sort: true,
        searchable: false,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
      },
    },
    {
      name: "reportedVolume",
      label: "Reported Volume",
      esKey: "data.allocatedGas",
      options: {
        filter: false,
        sort: true,
        searchable: false,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
      },
    },
    {
      name: "statementVolume",
      label: "Statement Volume",
      esKey: "grossPropertyVolume",
      options: {
        sort: true,
        searchable: false,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
      },
    },
    {
      name: "overShort",
      label: "Over/Short",
      esKey: "data.allocatedWater",
      options: {
        filter: false,
        sort: true,
        searchable: false,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
        customRender: (value, tableMeta) => {
          return (
            <p
              style={{
                fontWeight: 600,
                color: value > 0 ? "#177B1E" : "#F4273D",
              }}
            >
              {value >0 ? value : value *-1}
            </p>
          );
        }
      },
    },
    {
      name: "difference",
      label: "% Difference",
      esKey: "data.allocatedWater",
      options: {
        filter: false,
        sort: true,
        searchable: false,
        download: false,
        print: true,
        viewColumns: false,
        selectableRows: false,
        customRender: (value, tableMeta) => {
          return (
            <p
              style={{
                fontWeight: 600,
                color: tableMeta.rowData[tableMeta.columnIndex-1] > 0 ? "#177B1E" : "#F4273D",
              }}
            >
              {value?.replace('-','')}
            </p>
          );
        }
      },
    },
  ];


  export default ProductionDetailsHeaders;