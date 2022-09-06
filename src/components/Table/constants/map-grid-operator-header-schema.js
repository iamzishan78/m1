const operatorsColumnHeaders = [
  {
    name: "Operator",
    label: "Operator",
    esKey: "operator.keyword",
    options: {
      setCellProps: () => ({
        style: {
          minWidth: "350px",
          maxWidth: "350px",
          whiteSpace: "nowrap",
          position: "sticky",
          left: "77px",
          zIndex: 200,
          boxShadow: 'inset -1px 0px 0px 0px lightgrey',
          padding: '0px 25px 0px 0px',
        }
      }),

      // styling props applied to the column header cell
      setCellHeaderProps: () => ({
        style: {
          position: "sticky",
          paddingLeft: '35px',
          zIndex: 201,
          left: "77px",
        }
      }),
      ignoreGlobal: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "StateCount",
    label: "# Active States",
    esKey: "stateCount",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "BasinCount",
    label: "# Active Basins",
    esKey: "basinCount",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "TotalWellCount",
    label: "Total Wells",
    esKey: "totalWellCount",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "GasWellCount",
    label: "Gas Wells",
    esKey: "gasWellCount",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "OilWellCount",
    label: "Oil Wells",
    esKey: "oilWellCount",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "ActiveWellCount",
    label: "Active Wells",
    esKey: "activeWellCount",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "DUCWellCount",
    label: "DUCs",
    esKey: "ducWellCount",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "PermitCount",
    label: "Active Permits",
    esKey: "permitCount",
    options: {
      sort: true,
      filter: true,
    },
  },
  {
    name: "coordinates",
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

export default operatorsColumnHeaders