
/* props is just a style object*/

const ContactsHeadCells = [
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
      name: "entity",
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
      name: "address1",
      label: "Primary Address 1",
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
      name: "address2",
      label: "Primary Address 2",
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
      name: "city",
      label: "City",
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
      name: "state",
      label: "State",
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
      name: "zip",
      label: "Zip",
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
      name: "country",
      label: "Country",
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
      label: "Name",
      esKey: 'name.keyword',
      // editable: true,
      options: {
        sort: true,
        filter: true,
      },
    },
    {
      name: "title",
      label: "Title",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "firstName",
      label: "First Name",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "middleName",
      label: "Middle Name",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "suffix",
      label: "Suffix",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "companyName",
      label: "Company Name",
      options: {
        // display: true,
        display: false,
        filter: false,
        searchable: false,
        sort: true,
      },
    },
    {
      name: "fullContactAddress",
      label: "Primary Address",
      // editable: true,
      esKey: 'address1.keyword',
      options: {
        dbName: "address1",
        sort: true,
        filter: true,
      },
    },
  
    {
      name: "melissaRowsCount",
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
      name: "homePhone",
      label: "Primary Home Phone",
      esKey: 'homePhone.keyword',
      options: {
        // display: true,
        filter: true,
        searchable: false,
        sort: true,
      },
    },
    {
      name: "mobilePhone",
      label: "Primary Mobile Phone",
      esKey: 'mobilePhone.keyword',
      options: {
        // display: true,
        filter: true,
        searchable: false,
        sort: true,
      },
    },
  
    {
      name: "AltPhone",
      label: "Primary Work Phone",
      esKey: 'AltPhone.keyword',
      options: {
        // display: true,
        filter: true,
        searchable: false,
        sort: true,
      },
    },
    {
      name: "primaryEmail",
      label: "Primary Email",
      esKey: 'primaryEmail.keyword',
      options: {
        // display: true,
        filter: true,
        searchable: false,
        sort: true,
      },
    },
    {
      name: "contactOwner",
      label: "Contact Owner",
      esKey: 'contactOwners.name.keyword',
      options: {
        dbName: "contactOwners.name",
        // display: true,
        filter: false,
        filterOptions: {
          names: [],
        },
        searchable: false,
        sort: true,
      },
    },
    {
      name: "secondaryEmail",
      label: "Email 2",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "linkedIn",
      label: "LinkedIn Profile",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "facebook",
      label: "Facebook Profile",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "twitter",
      label: "Twitter Profile",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "jobTitle",
      label: "Job Title",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "leadStage",
      label: "Lead Stage",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "age",
      label: "Age",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },  {
      name: "relatives",
      label: "Relative Names",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "homePhone2",
      label: "Home Phone 2",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "homePhone3",
      label: "Home Phone 3",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "mobilephone2",
      label: "Mobile Phone 2",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "mobilephone3",
      label: "Mobile Phone 3",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "AltPhone2",
      label: "Work Phone 2",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "AltPhone3",
      label: "Work Phone 3",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "email3",
      label: "Email 3",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "timeZone",
      label: "Time Zone",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "territory",
      label: "Territory",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "campaignName",
      label: "Campaign Name",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "notes",
      label: "Comments",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "website ",
      label: "Website",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "industryType",
      label: "Industry Type",
      options: {
        display: false,
        filter: false,
        searchable: false,
        sort: false,
      },
    },
    {
      name: "leadSource",
      label: "Lead Source",
      // editable: false,
      options: {
        display: false,
        sort: false,
        filter: false,
        filterOptions: {
          names: [],
        },
      },
    },
    {
      name: "lastUpdateBy.name",
      label: "Updated By",
      options: {
        display: false,
        sort: false,
        filter: false,
        filterOptions: {
          names: [],
        },
      },
    },
    {
      name: "lastUpdateAt",
      label: "Last Updated",
      options: {
        filter: false,
      },
    },
    // {
    //   name: "createBy.name",
    //   label: "Created By",
    //   options: {
    //     display: false,
    //     filter: false,
    //     searchable: false,
    //     sort: false,
    //   },
    // },
    // {
    //   name: "createAt",
    //   label: "Created Date",
    //   options: {
    //     display: false,
    //     filter: false,
    //     searchable: false,
    //     sort: false,
    //   },
    // },
    {
      name: "tags",
      label: "Tags ",
      options: {
        dbName: "tags.tag",
        sort: true,
        download: false,
        print: false,
        filter: false,
        filterOptions: {
          names: [],
        },
      },
    },
    {
      name: "commentsCounter",
      label: " ",
      options: {
        dbName: "comments.comment",
        filter: false,
        searchable: false,
        sort: true,
        download: false,
        print: false,
        viewColumns: false,
      },
    },
    {
      name: "isPurchased",
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
    //   name: "isTracked",
    //   label: "Track",
    //   options: {
    //     searchable: false,
    //     download: false,
    //     print: false,
    //     filterOptions: {
    //       names: ["Tracked", "Untracked"],
    //       logic(tracked, filterVal) {
    //         return !(
    //           (filterVal.indexOf("Tracked") >= 0 && tracked) ||
    //           (filterVal.indexOf("Untracked") >= 0 && !tracked)
    //         );
    //       },
    //     },
    //     filterType: "dropdown",
    //   },
    // },
  ];
  

  export default ContactsHeadCells;
  