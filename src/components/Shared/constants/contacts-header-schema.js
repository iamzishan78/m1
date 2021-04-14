
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
    label: "Full Name",
    // editable: true,
    options: {
      sort: true,
      filter: false,
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
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "fullContactAddress",
    label: "Primary Address",
    // editable: true,
    options: {
      dbName: "address1",
      sort: true,
      filter: false,
    },
  },
  {
    name: "contactOwner",
    label: "Contact Owner",
    options: {
      dbName: "contactOwners.name",
      // display: true,
      filter: true,
      filterOptions: {
        names: [],
      },
      searchable: false,
      sort: true,
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
    options: {
      // display: true,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "mobilePhone",
    label: "Primary Mobile Phone",
    options: {
      // display: true,
      filter: false,
      searchable: false,
      sort: true,
    },
  },

  {
    name: "AltPhone",
    label: "Primary Work Phone",
    options: {
      // display: true,
      filter: false,
      searchable: false,
      sort: true,
    },
  },
  {
    name: "primaryEmail",
    label: "Primary Email",
    options: {
      // display: true,
      filter: false,
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


const SearchsHeadCells = [


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


  //////////
  {
    name: "tags",
    label: "Tags ",
    options: {
      sort: false,
      download: false,
      print: false,
      filterOptions: {
        names: [],
        logic(rowVal, pickedTags) {
          let containIts = true;
          pickedTags.map((pickedTag) => {
            if (rowVal[0].indexOf(pickedTag) === -1) {
              containIts = false;
            }
          });
          return !containIts;
        },
      },
    },
  },
  {
    name: "commentsCounter",
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
  {
    name: "isTracked",
    label: " ",
    options: {
      searchable: false,
      download: false,
      print: false,
      viewColumns: false,
      filterOptions: {
        names: ["Tracked", "Untracked"],
        logic(tracked, filterVal) {
          return !(
            (filterVal.indexOf("Tracked") >= 0 && tracked) ||
            (filterVal.indexOf("Untracked") >= 0 && !tracked)
          );
        },
      },
      filterType: "dropdown",
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
  {
    name: "detailCard",
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
  {
    name: "isContact",
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


export default ContactsHeadCells;
