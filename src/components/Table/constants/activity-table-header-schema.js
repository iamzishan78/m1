import GlobalSettings from "GlobalSettings";

const ActivitiesHeadCells = [
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
    name: "name",
    label: "Activity Name",
    esKey: "name.keyword",
    options: {
      ...GlobalSettings.muiGridStandardOptions,
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "type",
    label: "Activity Type",
    esKey: "type.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "start",
    label: "Start Date",
    esKey: "dateTime",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
    style: { minWidth: 185 }
  },
  {
    name: "end",
    label: "End Date",
    esKey: "endDateTime",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
    style: { minWidth: 185 }
  },
  {
    name: "dealName",
    label: "Deal Name",
    esKey: "deal.name.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
    style: { minWidth: 200 }
  },
  {
    name: "contactName",
    label: "Contact Name",
    esKey: "contactName.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
    style: { minWidth: 250 }
  },
  {
    name: "ownerName",
    label: "Activity Owner",
    esKey: "ownerName.keyword",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
  },
  {
    name: "notes",
    label: "Notes",
    options: {
      display: true,
      sort: true,
      filter: true,
    },
    style: { minWidth: 300 }
  },
  {
    name: "isClosed",
    label: "Completed?",
    esKey: "isClosed",
    options: {
      ignoreGlobal: true,
      display: true,
      sort: true,
      filter: true,
      customRender: (value) => {
        return value ? "Completed" : "Not completed"
      }
    },
  },

];

export default ActivitiesHeadCells;