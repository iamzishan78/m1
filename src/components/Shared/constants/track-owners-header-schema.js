import React from "react";

/* props is just a style object*/

const TrackedOwnersHeadCells = [
  /// appears this code is used for the track grid owners 
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
  { name: "name", label: "Name" },
  {
    name: "StreetAddress",
    label: "Street Address",
  },
  {
    name: "City",
    label: "City",
  },
  {
    name: "State",
    label: "State",
  },
  {
    name: "Zip",
    label: "Zip Code",
  },

  //need to add in the address on file for global owner
  // {
  //   name: "",
  //   label: "Address",
  // },



  //removing due to the fact that tracked owners are global owners with multiple interests and not well level interests
  // {
  //   name: "ownershipType",
  //   label: "Entity",
  // },
  // { name: "interestType", label: "Type" },
  // {
  //   name: "ownershipPercentage",
  //   label: "Interest",
  // },

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


export default TrackedOwnersHeadCells;
