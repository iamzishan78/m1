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
  