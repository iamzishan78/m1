import moment from "moment";

const UserManagementHeadCells = [
  {
    name: "id",
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
    name: "displayName",
    label: "Name",
    options: {
      filter: false,
      searchable: true,
      sort: true,
      download: false,
      print: false,
      viewColumns: false,
      editable: true,
    },
  },
  {
    name: "emails",
    label: "User Email",
    options: {
      filter: false,
      searchable: true,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },

  {
    name: "role",
    label: "Role",
    options: {
      filter: true,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,
    },
  },

  {
    name: "lastLogin",
    label: "Last Login",
    options: {
      display: true,
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,

      customBodyRender: (value, tableMeta, updateValue) => {
        console.log(value, tableMeta, updateValue)
        return (
          <span style={{ padding: 10 }}>{value ? moment(value).format("MM/DD/YYYY") : ""}</span>
        );
      },
    },
  },
  {
    name: "actions",
    label: " ",
    options: {
      filter: false,
      searchable: false,
      sort: false,
      download: false,
      print: false,
      viewColumns: false,

    },
  },
];


export default UserManagementHeadCells;
