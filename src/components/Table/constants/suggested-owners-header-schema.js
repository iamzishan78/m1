import React from "react";

/* props is just a style object*/

const SuggestedOwnersHeadCells = [
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
  { name: "wellName", label: "Well" },
  {
    name: "apiNumber",
    label: "API",
  },
  {
    name: "lease",
    label: "Lease",
  },
  {
    name: "leaseAcres",
    label: "Lease Acres",
  },
  {
    name: "name",
    label: "Interest Owner",
  },
  {
    name: "interestType",
    label: "Interest Type",
  },
  {
    name: "interest",
    label: "Interest",
  },
  {
    name: "value",
    label: "Tax Value",
  },
  {
    name: "nra",
    label: "NRA",
  },
  {
    name: "isContact",
    label: " ",
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
];


export default SuggestedOwnersHeadCells;
