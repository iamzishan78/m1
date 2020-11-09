////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                TO USE THIS TABLE:
//// 1-Send to this component a prop called 'parent' with a trackOwners/trackWells/Contacts/OwnersPerWell...
////  -if it is OwnersPerWell use case add another prop "selectedWell" with the well
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                TO USE THIS TABLE IN A NEW USE CASE:
//// 1-Send to this component a prop called 'parent' with a string you choose to identify your use case.
//// 2-Define your HeadCells const, for your columns, in the HeadCells section.
//// 3-Add your query in the queries section.
//// 4-At the end, but before the return line, add your own section where you will run your queries
////   and you will set all necessaries local states for your use case and the table,
////   look at the Tracked Owners section as example.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////external table package info: https://github.com/gregnb/mui-datatables /////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import { Container } from "@material-ui/core";
import Table from "./components/Table";

import { useLazyQuery, useMutation } from "@apollo/client";
import { WELLOWNERSQUERY } from "../../../graphQL/useQueryWellOwners";
import { OWNERSQUERY } from "../../../graphQL/useQueryOwners";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
// import { CONTACTSQUERY } from "../../../graphQL/useQueryContacts";
import { PAGINATEDCONTACTSQUERY } from "../../../graphQL/useQueryPaginatedContacts";
import { CONTACTSFILTEROPTIONS } from "../../../graphQL/useQueryContactsFilterOptions";
import { TRACKSBYOBJECTTYPE } from "../../../graphQL/useQueryTracksByObjectType";
import { TAGSAMPLES } from "../../../graphQL/useQueryTagSamples";
import { COMMENTSCOUNTER } from "../../../graphQL/useQueryCommentsCounter";
import { OWNERSWELLSQUERY } from "../../../graphQL/useQueryOwnersWells";
import { CONTACT } from "../../../graphQL/useQueryContact";
import { GETUSERS } from "../../../graphQL/useQueryGetUsers";
import { CUSTOMLAYER } from "../../../graphQL/useQueryCustomLayer";
import { REMOVECONTACT } from "../../../graphQL/useMutationRemoveContact";
import { REMOVEUSER } from "../../../graphQL/useMutationRemoveUser";
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";
import { UPDATETRANSACTION } from "../../../graphQL/useMutationUpdateTransaction";
import { UPDATEPARCELOWNER } from "../../../graphQL/useMutationUpdateParcelOwner";
import { MELISSARECORDSCOUNTBYIDS } from "../../../graphQL/useQueryGetMelissaRecords";
import { TRANSACTIONDATA } from "../../../graphQL/useQueryTransactionData";
import { CONTACTPARCELINTERESTS } from "../../../graphQL/useQueryContactParcelInterests";
import { IFARECONTACTS } from "../../../graphQL/useQueryIfOwnersAreContacts";
import { OWNER_WELLINTERESTS } from "../../../graphQL/useQueryOwner_WellInterests";

import { useDispatch, useSelector } from "react-redux";
import { deepEqual, deepEqualObjects, setStateIfDeepEqual } from "../functions";
import RightDialog from "../../ContactDetailCard/components/RightDialog";
import AddDealDialog from "../../ContactDetailCard/components/AddDealDialog";
import { setMapGridCardState, showWarningMessage } from "../../../actions";
import { first } from "@amcharts/amcharts4/.internal/core/utils/Array";

const useStyles = makeStyles((theme) => ({
  container: { padding: "0 !important" },
}));

var ticksToDateString = function (ticks) {
  var epochTicks = 621355968000000000;
  var ticksPerMillisecond = 10000; // whoa!
  var maxDateMilliseconds = 8640000000000000;

  if (isNaN(ticks)) {
    //      0001-01-01T00:00:00.000Z
    return "NANA-NA-NATNA:NA:BA.TMAN";
  }

  // convert the ticks into something javascript understands
  var ticksSinceEpoch = ticks - epochTicks;
  var millisecondsSinceEpoch = ticksSinceEpoch / ticksPerMillisecond;

  if (millisecondsSinceEpoch > maxDateMilliseconds) {
    //      +035210-09-17T07:18:31.111Z
    return "+WHOAWH-OA-ISTOO:FA:RA.WAYZ";
  }

  // output the result in something the human understands
  var date = new Date(millisecondsSinceEpoch);
  return date.toISOString();
};

////////////HeadCells begin///////////////////////////////////////////////
const TrackedOwnersHeadCells = [
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
  // {
  //   name: "ownershipType",
  //   label: "Entity",
  // },
  // { name: "interestType", label: "Type" },
  // {
  //   name: "ownershipPercentage",
  //   label: "Interest",
  // },

  // TEMPORARY COMMENT OUT. DO NOT DELETE
  // WILL BE ADDED IN AFTER DEVELOPING A SYSTEM TO
  // AGGREGATE OWNERS
  // {
  //   name: "appraisedValue",
  //   label: "Appraised Value",
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
  // {
  //   name: "contactsCounter",
  //   label: " ",
  //   options: {
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },

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

  /* 
  // TEMPORARY COMMENT OUT. DO NOT DELETE 
  // WILL BE RE-ADDED ONCE WE FIGURE OUT HOW TO DRAW AGGREGATIONS 
  // FOR UNIVERSAL OWNERS


  // {
  //   name: "wellsCounter",
  //   label: " ",
  //   options: {
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },
 */

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

const WellsHeadCells = [
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
  { name: "wellName", label: "Well" },
  { name: "api", label: "API" },
  { name: "operator", label: "Operator" },
  { name: "wellType", label: "Type" },
  {
    name: "wellBoreProfile",
    label: "Profile",
  },
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
  // {
  //   name: "ownerCount",
  //   label: " ",
  //   options: {
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },
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
];

const OwnersPerWellHeadCells = [
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
  { name: "name", label: "Name" },
  {
    name: "ownershipType",
    label: "Entity",
  },
  { name: "interestType", label: "Type" },
  {
    name: "ownershipPercentage",
    label: "Interest",
  },
  {
    name: "appraisedValue",
    label: "Appraised Value",
  },
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
  // {
  //   name: "contactsCounter",
  //   label: " ",
  //   options: {
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },

  /*   
// TEMPORARY COMMENT OUT. DO NOT DELETE 
  // WILL BE RE-ADDED ONCE WE HAVE A WAY OF AGGREGATING A 
  // UNIVERSAL OWNER 

  // {
  //   name: "wellsCounter",
  //   label: " ",
  //   options: {
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // }, 
  */

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
    label: "Track",
    options: {
      searchable: false,
      download: false,
      print: false,
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
];

const OwnersPerContactsHeadCells = [
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
  { name: "name", label: "Name" },
  {
    name: "ownershipType",
    label: "Entity",
  },
  {
    name: "appraisedValue",
    label: "Appraised Value",
  },
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
  // {
  //   name: "contactsCounter",
  //   label: " ",
  //   options: {
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },

  /*   
  // TEMPORARY COMMENT OUT. DO NOT REMOVE 
  // WILL BE UNCOMMENTED ONCE WE UNDERSTAND A MORE 
  // UNIVERSAL OWNER ID. 

  // {
  //   name: "wellsCounter",
  //   label: " ",
  //   options: {
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },
 */

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
    label: "Track",
    options: {
      searchable: false,
      download: false,
      print: false,
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
];

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

  { name: "name", label: "Name", editable: true, options: { filter: false } },
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
    name: "fullContactAddress",
    label: "Primary Address",
    editable: true,
    options: { filter: false },
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
    name: "mobilephone",
    label: "Primary Mobile Phone",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
    },
  },
  {
    name: "homePhone",
    label: "Primary Home Phone",
    options: {
      display: false,
      filter: false,
      searchable: false,
      sort: false,
    },
  },
  {
    name: "primaryEmail",
    label: "Primary Email",
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
    editable: false,
    options: {
      filterOptions: {
        names: [],
      },
    },
  },
  {
    name: "lastUpdateBy.name",
    label: "Updated By",
    options: {
      filterOptions: {
        names: [],
      },
    },
  },
  { name: "lastUpdateAt", label: "Last Updated", options: { filter: false } },

  {
    name: "tags",
    label: "Tags ",
    options: {
      sort: false,
      download: false,
      print: false,
      filterOptions: {
        names: [],
      },
    },
  },
  // {
  //   name: "owners", //ownerPerContactCount
  //   label: " ",
  //   options: {
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },
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

const OwnersPerParcelHeadCells = [
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
    name: "ownerEntityId",
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
  { name: "name", label: "Name", editable: true },
  {
    name: "entity",
    label: "Entity",
    editable: true,
    dropDownOptions: [
      "Corporation",
      "Educational Institution",
      "Governmental Body",
      "Individual",
      "Non Profit",
      "Religious Institution",
      "Trust",
      "Unknown",
    ],
  },
  {
    name: "type",
    label: "Type",
    editable: true,
    dropDownOptions: [
      "Fee Interest",
      "Leasehold",
      "Mineral Interest",
      "Non-Executive Mineral Interest (NEMI)",
      "Overriding Royalty (ORRI)",
      "Royalty Interest (NPRI)",
      "Surface Rights",
      "Unknown",
      "Working Interest",
    ],
  },
  { name: "depthFrom", label: "Depth From", editable: true },
  { name: "depthTo", label: "Depth To", editable: true },
  { name: "interest", label: "Interest", editable: true },
  { name: "nma", label: "NMA", editable: true },
  { name: "nra", label: "NRA", editable: true },
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
    label: "Track",
    options: {
      searchable: false,
      download: false,
      print: false,
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
];

// const ParcelInterestsPerContactHeadCells = [
//   {
//     name: "_id",
//     options: {
//       display: false,
//       filter: false,
//       searchable: false,
//       sort: false,
//       download: false,
//       print: false,
//       viewColumns: false,
//     },
//   },
//   {
//     name: "ownerEntityId",
//     options: {
//       display: false,
//       filter: false,
//       searchable: false,
//       sort: false,
//       download: false,
//       print: false,
//       viewColumns: false,
//     },
//   },
//   {
//     name: "customLayerId",
//     options: {
//       display: false,
//       filter: false,
//       searchable: false,
//       sort: false,
//       download: false,
//       print: false,
//       viewColumns: false,
//     },
//   },
//   //// from parcel
//   { name: "customLayerName", label: "Name" },
//   { name: "customLayerState", label: "State" },
//   { name: "customLayerCounty", label: "County" },
//   { name: "Grid1", label: "Survey/ Meridian" },
//   { name: "Grid2", label: "Block/ Township" },
//   { name: "Grid3", label: "Section/ Range" },
//   { name: "Grid4", label: "Abstract/ Section" },
//   { name: "Grid5", label: "Alternate Survey" },
//   //// from parcelOwnership
//   { name: "depthFrom", label: "Depth From", editable: true },
//   { name: "depthTo", label: "Depth To", editable: true },
//   { name: "interest", label: "Interest", editable: true },
//   { name: "nma", label: "NMA", editable: true },
//   { name: "nra", label: "NRA", editable: true },

//   {
//     name: "parcelIcon",
//     label: " ",
//     options: {
//       filter: false,
//       searchable: false,
//       sort: false,
//       download: false,
//       print: false,
//       viewColumns: false,
//     },
//   },
//   {
//     name: "commentsCounter",
//     label: " ",
//     options: {
//       filter: false,
//       searchable: false,
//       sort: false,
//       download: false,
//       print: false,
//       viewColumns: false,
//     },
//   },
//   {
//     name: "isTracked",
//     label: "Track",
//     options: {
//       searchable: false,
//       download: false,
//       print: false,
//       filterOptions: {
//         names: ["Tracked", "Untracked"],
//         logic(tracked, filterVal) {
//           return !(
//             (filterVal.indexOf("Tracked") >= 0 && tracked) ||
//             (filterVal.indexOf("Untracked") >= 0 && !tracked)
//           );
//         },
//       },
//       filterType: "dropdown",
//     },
//   },
// ];

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
  // {
  //   name: "userType",
  //   label: "User Type",
  //   options: {
  //     filter: true,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },
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
  // {
  //   name: "adminAccess",
  //   label: "Admin Access",
  //   options: {
  //     filter: true,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
  //     viewColumns: false,
  //   },
  // },
  {
    name: "lastLogin",
    label: "Last Login",
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

const DealsHeadCells = [
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
    name: "title",
    label: "Name",
  },
  {
    name: "contactName",
    label: "Contact",
  },
  {
    name: "dealStage",
    label: "Deal Stage",
  },
  {
    name: "label",
    label: "Deal Amount",
  },
  {
    name: "description",
    label: "Deal Details",
  },
];

const ParcelInterestsPerContactHeadCells = [
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
    name: "ownerEntityId",
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
    name: "customLayerId",
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
  //// from parcel
  { name: "customLayerName", label: "Name" },
  { name: "customLayerState", label: "State" },
  { name: "customLayerCounty", label: "County" },
  { name: "Grid1", label: "Survey/ Meridian" },
  { name: "Grid2", label: "Block/ Township" },
  { name: "Grid3", label: "Section/ Range" },
  { name: "Grid4", label: "Abstract/ Section" },
  { name: "Grid5", label: "Alternate Survey" },
  //// from parcelOwnership
  { name: "depthFrom", label: "Depth From", editable: true },
  { name: "depthTo", label: "Depth To", editable: true },
  { name: "interest", label: "Interest", editable: true },
  { name: "nma", label: "NMA", editable: true },
  { name: "nra", label: "NRA", editable: true },

  {
    name: "parcelIcon",
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
    label: "Track",
    options: {
      searchable: false,
      download: false,
      print: false,
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
];

const WellInterests = [
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
  { name: "wellName", label: "Well" },
  { name: "apiNumber", label: "API" },
  { name: "operator", label: "Operator" },
  { name: "interestType", label: "Type" },
  {
    name: "ownershipPercentage",
    label: "Interest",
  },
  {
    name: "appraisedValue",
    label: "Appraised Value",
  },
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

////////////HeadCells end///////////////////////////////////////////////

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const joinAddress = (row) => {
  let rowData = {
    address1: row.address1,
    address2: row.address2,
    city: row.city,
    state: row.state,
    zip: row.zip,
    country: row.country,
  };
  let textArray = [];
  for (const key in rowData) {
    if (rowData.hasOwnProperty(key) && rowData[key] && rowData[key] !== "") {
      if (key === "zip" || key === "country") {
        textArray = [
          [textArray.join(", "), capitalizeFirstLetter(rowData[key])].join(" "),
        ];
      } else textArray.push(capitalizeFirstLetter(rowData[key]));
    }
  }

  return textArray.join(", ");
};

function M1nTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [rows, Rows] = useState([]);
  const [addDealOpen, setAddDealOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState();
  const setRows = (newState) => {
    setStateIfDeepEqual(Rows, newState);
  };
  const [header, Header] = useState("");
  const setHeader = (newState) => {
    setStateIfDeepEqual(Header, newState);
  };
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };
  const [loading, Loading] = useState(true);
  const setLoading = (newState) => {
    setStateIfDeepEqual(Loading, newState);
  };
  const [addAble, AddAble] = useState(true);
  const setAddAble = (newState) => {
    setStateIfDeepEqual(AddAble, newState);
  };
  const [uploadIcon, UploadIcon] = useState(null);
  const setUploadIcon = (newState) => {
    setStateIfDeepEqual(UploadIcon, newState);
  };
  const [targetLabel, TargetLabel] = useState(null);
  const setTargetLabel = (newState) => {
    setStateIfDeepEqual(TargetLabel, newState);
  };
  const [deleteFunc, setDeleteFunc] = useState(null);
  // const setDeleteFunc = (newState) => {
  //   setStateIfDeepEqual(DeleteFunc, newState);
  // };
  const [showTracks, ShowTracks] = useState(true);
  const setShowTracks = (newState) => {
    setStateIfDeepEqual(ShowTracks, newState);
  };
  const [orderByTracks, OrderByTracks] = useState(true);
  const setOrderByTracks = (newState) => {
    setStateIfDeepEqual(OrderByTracks, newState);
  };
  const [startPaginationAt, StartPaginationAt] = useState();
  const setStartPaginationAt = (newState) => {
    setStateIfDeepEqual(StartPaginationAt, newState);
  };
  const [viewportFeatures, ViewportFeatures] = useState(null);
  const setViewportFeatures = (newState) => {
    setStateIfDeepEqual(ViewportFeatures, newState);
  };
  const [warningShowed, WarningShowed] = useState(false);
  const setWarningShowed = (newState) => {
    setStateIfDeepEqual(WarningShowed, newState);
  };
  const { searchloading, searchResultData } = useSelector(
    ({ MapGridCard }) => MapGridCard
  );

  ////////////Queries begin///////////////////////////////////////////////

  const [tracksByObjectType, { data: dataTracks }] = useLazyQuery(
    TRACKSBYOBJECTTYPE,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(
    COMMENTSCOUNTER,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [getTagSamples, { data: dataTagSamples }] = useLazyQuery(TAGSAMPLES, {
    fetchPolicy: "cache-and-network",
  });
  //////////
  const [getOwners, { data: dataOwners }] = useLazyQuery(OWNERSQUERY);
  const [getOwnersWells, { data: dataOwnersWells }] = useLazyQuery(
    OWNERSWELLSQUERY
  );
  //////////
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  //////////
  const [getWellOwners, { data: dataWellOwners }] = useLazyQuery(
    WELLOWNERSQUERY
  );
  //////////
  // const [getContactInM1nTable, { data: dataContact }] = useLazyQuery(CONTACT, {
  //   fetchPolicy: "cache-and-network",
  // });

  /////////
  const [getAllUsers, { data: userLists }] = useLazyQuery(GETUSERS, {
    fetchPolicy: "cache-and-network",
  });
  const [removeUser] = useMutation(REMOVEUSER);
  //////////

  const [getContacts, { data: constDataContacts }] = useLazyQuery(
    PAGINATEDCONTACTSQUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [
    getContactsFilterOptions,
    { data: dataContactsFilterOptions },
  ] = useLazyQuery(CONTACTSFILTEROPTIONS, {
    fetchPolicy: "cache-and-network",
  });
  //////////
  const [getTransactionData, { data: dataDeals }] = useLazyQuery(
    TRANSACTIONDATA
  );
  //////////
  const [removeContact] = useMutation(REMOVECONTACT);

  const [updateContact] = useMutation(UPDATECONTACT);
  //////////
  const [updateTransaction] = useMutation(UPDATETRANSACTION);
  //////////
  const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);
  //////////
  const [updateParcelOwner] = useMutation(UPDATEPARCELOWNER);
  //////////
  const [getMelissaRowsCount, { data: dataMelissaRowsCount }] = useLazyQuery(
    MELISSARECORDSCOUNTBYIDS,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  //////////
  const [
    getContactParcelInterests,
    { data: dataContactParcelInterests },
  ] = useLazyQuery(CONTACTPARCELINTERESTS, {
    fetchPolicy: "cache-and-network",
  });
  /////////
  const [
    checkIfOwnersAreContacts,
    { data: checkIfOwnersAreContactsData },
  ] = useLazyQuery(IFARECONTACTS, {
    fetchPolicy: "cache-and-network",
  });
  //////////
  const [
    getOwner_WellInterests,
    { data: dataOwner_WellInterests },
  ] = useLazyQuery(OWNER_WELLINTERESTS);
  ////////////Queries end///////////////////////////////////////////////

  ////////////General begin///////////////////////////////////////////////

  // workaround to make constDataContacts.contacts[i] editable
  // TODO: set correct isTracked on backend, not frontend
  const [dataContacts, setDataContacts] = useState(null);
  useEffect(() => {
    if (constDataContacts && constDataContacts.paginatedContacts.edges) {
      let tmpDataContacts = {
        ...constDataContacts,
        paginatedContacts: {
          ...constDataContacts.paginatedContacts,
          edges: [
            ...constDataContacts.paginatedContacts.edges.map((edge) => {
              return {
                ...edge,
                node: { ...edge.node },
              };
            }),
          ],
        },
      };

      setDataContacts(tmpDataContacts);
    }
  }, [constDataContacts]);

  useEffect(() => {
    if (
      targetLabel &&
      stateApp.user &&
      stateApp.user.mongoId &&
      showTracks &&
      targetLabel !== "contact"
    ) {
      tracksByObjectType({
        variables: {
          objectType:
            targetLabel === "Parcel Interest"
              ? "Parcel Ownership"
              : targetLabel,
        },
      });
    }
  }, [stateApp.user, targetLabel, showTracks]);

  ////////////General end///////////////////////////////////////////////

  ////////////Tracked Owners begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "trackOwners") {
      console.log("ue mintable 2");
      setTargetLabel("owner");

      if (props.header) {
        setHeader(props.header);
      } else {
        setHeader("Owners");
      }
      setAddAble(false);
    }
  }, [props.parent, props.header]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "trackOwners" &&
      dataTracks &&
      dataTracks.tracksByObjectType
    ) {
      console.log("ue mintable 3");
      if (dataTracks.tracksByObjectType.length !== 0) {
        setLoading(true);
        const tracksIdArray = dataTracks.tracksByObjectType.map(
          (track) => track.trackOn
        );

        getOwners({
          variables: {
            ownerIdArray: tracksIdArray,
          },
        });
        // getOwnersWells({
        //   variables: {
        //     ownersIds: tracksIdArray,
        //   },
        // });
        getCommentsCounter({
          variables: {
            objectsIdsArray: tracksIdArray,
            userId: stateApp.user.mongoId,
          },
        });
        getTagSamples({
          variables: {
            objectsIdsArray: tracksIdArray,
            userId: stateApp.user.mongoId,
          },
        });
        checkIfOwnersAreContacts({
          variables: { idsArray: tracksIdArray },
        });
      } else {
        setRows([]);
        setLoading(false);
      }
    }
  }, [dataTracks]);

  useEffect(() => {
    if (props.parent && props.parent === "trackOwners" && dataOwners) {
      if (
        dataOwners.owners &&
        dataOwners.owners.length > 0 &&
        dataCommentsCounter &&
        dataCommentsCounter.commentsCounter &&
        dataTagSamples &&
        dataTagSamples.tagSamples &&
        checkIfOwnersAreContactsData &&
        checkIfOwnersAreContactsData.ifAreContacts
        //  && dataOwnersWells
      ) {
        let owners = [...dataOwners.owners];
        owners = owners.map((o) => {
          let owner = { ...o };
          owner.isTracked = true;
          owner.commentsCounter = 0;
          owner.tags = [[], 0];
          owner.wellsCounter = [];
          owner.coordinates = {
            objToPopulateSearchLayer: {
              objectType: "owner",
              objectId: owner.id,
            },
          };
          owner.isContact = false;
          // if (dataOwnersWells.ownersWells) {
          //   for (let i = 0; i < dataOwnersWells.ownersWells.length; i++) {
          //     if (owner.id === dataOwnersWells.ownersWells[i].ownerId) {
          //       owner.wellsCounter = dataOwnersWells.ownersWells[i].wells.map(
          //         (well) => well.wellId
          //       );
          //       break;
          //     }
          //   }
          // }

          for (
            let i = 0;
            i < checkIfOwnersAreContactsData.ifAreContacts.length;
            i++
          ) {
            if (
              owner.id ===
              checkIfOwnersAreContactsData.ifAreContacts[i].globalOwner
            ) {
              owner.isContact =
                checkIfOwnersAreContactsData.ifAreContacts[i].isContact;

              owner.entity = checkIfOwnersAreContactsData.ifAreContacts[i]._id;
              break;
            }
          }

          for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
            if (owner.id === dataCommentsCounter.commentsCounter[i]._id) {
              owner.commentsCounter =
                dataCommentsCounter.commentsCounter[i].total;
              break;
            }
          }

          for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
            if (owner.id === dataTagSamples.tagSamples[i]._id) {
              owner.tags = [
                dataTagSamples.tagSamples[i].tags,
                dataTagSamples.tagSamples[i].total,
              ];

              break;
            }
          }
          return owner;
        });

        let availableTags = [];
        dataTagSamples.tagSamples.map((sample) => {
          availableTags = [...availableTags, ...sample.tags];
        });
        const cleanAvailableTags = [...new Set(availableTags)];

        setRows(owners);

        setColumns(
          cleanAvailableTags.length > 0
            ? TrackedOwnersHeadCells.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filterOptions: {
                        ...column.options.filterOptions,
                        names: cleanAvailableTags,
                      },
                    },
                  };
                }
                return column;
              })
            : TrackedOwnersHeadCells.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filter: false,
                    },
                  };
                }
                return column;
              })
        );

        setStateApp((state) => ({
          ...state,
          owners: owners,
        }));
        setLoading(false);
      } else {
        if (dataOwners.owners && dataOwners.owners.length === 0) {
          setRows([]);
          setLoading(false);
        }
      }
    }
  }, [
    dataOwners,
    dataTagSamples,
    dataCommentsCounter,
    checkIfOwnersAreContactsData,
    //  dataOwnersWells
  ]);
  ////////////Tracked Owners end///////////////////////////////////////////////

  ////////////Tracked Wells begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "trackWells") {
      console.log("ue mintable 5");
      setTargetLabel("well");

      if (props.header) {
        setHeader(props.header);
      } else {
        setHeader("Wells");
      }
      setAddAble(false);
    }
  }, [props.parent]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "trackWells" &&
      dataTracks &&
      dataTracks.tracksByObjectType
    ) {
      console.log("ue mintable 6");
      if (dataTracks.tracksByObjectType.length !== 0) {
        setLoading(true);
        const tracksIdArray = dataTracks.tracksByObjectType.map(
          (track) => track.trackOn
        );

        getWells({
          variables: {
            wellIdArray: tracksIdArray,
            authToken: stateApp.user.authToken,
          },
        });
        getCommentsCounter({
          variables: {
            objectsIdsArray: tracksIdArray,
            userId: stateApp.user.mongoId,
          },
        });
        getTagSamples({
          variables: {
            objectsIdsArray: tracksIdArray,
            userId: stateApp.user.mongoId,
          },
        });
      } else {
        setRows([]);
        setLoading(false);
      }
    }
  }, [dataTracks]);

  useEffect(() => {
    if (props.parent && props.parent === "trackWells" && dataWells) {
      console.log("ue mintable 7");
      if (
        dataWells.wells &&
        dataWells.wells.results &&
        dataWells.wells.results.length > 0 &&
        dataCommentsCounter &&
        dataCommentsCounter.commentsCounter &&
        dataTagSamples &&
        dataTagSamples.tagSamples
      ) {
        let wells = [...dataWells.wells.results];
        wells = wells.map((w) => {
          let well = { ...w };

          //// temporary to fix the ticks dates fields comming from the rest api
          if (well.permitApprovedDate && well.permitApprovedDate != "null")
            well.permitApprovedDate = ticksToDateString(
              well.permitApprovedDate
            );
          if (well.spudDate && well.spudDate != "null")
            well.spudDate = ticksToDateString(well.spudDate);
          if (well.completionDate && well.completionDate != "null")
            well.completionDate = ticksToDateString(well.completionDate);
          if (well.firstProductionDate && well.firstProductionDate != "null")
            well.firstProductionDate = ticksToDateString(
              well.firstProductionDate
            );
          //// temporary end

          well.isTracked = true;
          well.commentsCounter = 0;
          well.tags = [[], 0];

          well.coordinates = {};
          if (well.Longitude && well.Latitude)
            well.coordinates.center = [well.Longitude, well.Latitude];
          if (well.longitude && well.latitude)
            well.coordinates.center = [well.longitude, well.latitude];

          for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
            if (well.id === dataCommentsCounter.commentsCounter[i]._id) {
              well.commentsCounter =
                dataCommentsCounter.commentsCounter[i].total;
              break;
            }
          }
          for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
            if (well.id === dataTagSamples.tagSamples[i]._id) {
              well.tags = [
                dataTagSamples.tagSamples[i].tags,
                dataTagSamples.tagSamples[i].total,
              ];

              break;
            }
          }
          return well;
        });

        let availableTags = [];
        dataTagSamples.tagSamples.map((sample) => {
          availableTags = [...availableTags, ...sample.tags];
        });
        const cleanAvailableTags = [...new Set(availableTags)];

        setRows(wells);

        const flyToColumn = {
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
        };

        setColumns([
          ...(cleanAvailableTags.length > 0
            ? WellsHeadCells.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filterOptions: {
                        ...column.options.filterOptions,
                        names: cleanAvailableTags,
                      },
                    },
                  };
                }
                return column;
              })
            : WellsHeadCells.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filter: false,
                    },
                  };
                }
                return column;
              })),
          flyToColumn,
        ]);

        setStateApp((state) => ({
          ...state,
          trackedwells: wells,
        }));
        setLoading(false);
      } else {
        if (
          dataWells.wells &&
          dataWells.wells.results &&
          dataWells.wells.results.length === 0
        ) {
          setRows([]);
          setLoading(false);
        }
      }
    }
  }, [dataWells, dataTagSamples, dataCommentsCounter]);
  ////////////Tracked Wells end///////////////////////////////////////////////

  ////////////Wells Per Owner begin///////////////////////////////////////////

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "WellsPerOwner" &&
      props.wellsIdsArray &&
      stateApp.user &&
      stateApp.user.mongoId
    ) {
      console.log("ue mintable 8");
      setTargetLabel("well");
      setHeader("Wells");
      setAddAble(false);
      getWells({
        variables: {
          wellIdArray: props.wellsIdsArray,
          authToken: stateApp.user.authToken,
        },
      });
      getCommentsCounter({
        variables: {
          objectsIdsArray: props.wellsIdsArray,
          userId: stateApp.user.mongoId,
        },
      });
      getTagSamples({
        variables: {
          objectsIdsArray: props.wellsIdsArray,
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [props.wellsIdsArray, stateApp.user]);

  useEffect(() => {
    if (props.parent && props.parent === "WellsPerOwner" && dataWells) {
      console.log("ue mintable 9");
      if (
        dataWells.wells &&
        dataWells.wells.results &&
        dataWells.wells.results.length > 0 &&
        dataCommentsCounter &&
        dataCommentsCounter.commentsCounter &&
        dataTagSamples &&
        dataTagSamples.tagSamples &&
        dataTracks &&
        dataTracks.tracksByObjectType
      ) {
        dataWells.wells.results.forEach((well) => {
          well.isTracked = false;
          well.commentsCounter = 0;
          well.tags = [[], 0];

          for (let i = 0; i < dataTracks.tracksByObjectType.length; i++) {
            if (well.id === dataTracks.tracksByObjectType[i].trackOn) {
              well.isTracked = true;
              break;
            }
          }
          for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
            if (well.id === dataCommentsCounter.commentsCounter[i]._id) {
              well.commentsCounter =
                dataCommentsCounter.commentsCounter[i].total;
              break;
            }
          }
          for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
            if (well.id === dataTagSamples.tagSamples[i]._id) {
              well.tags = [
                dataTagSamples.tagSamples[i].tags,
                dataTagSamples.tagSamples[i].total,
              ];

              break;
            }
          }
        });

        let availableTags = [];
        dataTagSamples.tagSamples.map((sample) => {
          availableTags = [...availableTags, ...sample.tags];
        });
        const cleanAvailableTags = [...new Set(availableTags)];

        setRows(dataWells.wells.results);

        setColumns(
          cleanAvailableTags.length > 0
            ? WellsHeadCells.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filterOptions: {
                        ...column.options.filterOptions,
                        names: cleanAvailableTags,
                      },
                    },
                  };
                }
                return column;
              })
            : WellsHeadCells.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filter: false,
                    },
                  };
                }
                return column;
              })
        );

        setStateApp((state) => ({
          ...state,
          wells: dataWells.wells.results,
        }));
      } else {
        setRows([]);
      }

      setLoading(false);
    }
  }, [dataWells, dataTagSamples, dataCommentsCounter, dataTracks]);

  //////////// Wells Per Owner end///////////////////////////////////////////////

  ////////////Owners Per Well begin///////////////////////////////////////////////

  useEffect(() => {
    if (props.parent && props.parent === "OwnersPerWell") {
      setLoading(true);
      console.log("ue mintable 10");
      setTargetLabel("owner");
      setHeader("Tax Roll Ownership");
      setAddAble(false);
      getWellOwners({
        variables: { id: props.selectedWell.id },
      });
    }
  }, [props.selectedWell]);

  useEffect(() => {
    if (props.parent && props.parent === "OwnersPerWell" && dataWellOwners) {
      console.log("ue mintable 11");
      if (dataWellOwners.wellOwners && dataWellOwners.wellOwners.length > 0) {
        setLoading(true);
        const objectsIdsArray = dataWellOwners.wellOwners.map(
          (wellOwner) => wellOwner.id
        );

        // getOwnersWells({
        //   variables: {
        //     ownersIds: objectsIdsArray,
        //   },
        // });
        getCommentsCounter({
          variables: { objectsIdsArray, userId: stateApp.user.mongoId },
        });
        getTagSamples({
          variables: { objectsIdsArray, userId: stateApp.user.mongoId },
        });
      } else {
        setLoading(false);
        setRows([]);
      }
    }
  }, [dataWellOwners]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "OwnersPerWell" &&
      dataWellOwners &&
      dataWellOwners.wellOwners &&
      dataWellOwners.wellOwners.length > 0 &&
      dataCommentsCounter &&
      dataCommentsCounter.commentsCounter &&
      dataTagSamples &&
      dataTagSamples.tagSamples &&
      // dataOwnersWells &&
      dataTracks &&
      dataTracks.tracksByObjectType
    ) {
      const wellOwners = dataWellOwners.wellOwners.map((o) => {
        let wellOwner = { ...o };
        wellOwner.commentsCounter = 0;
        wellOwner.tags = [[], 0];
        wellOwner.wellsCounter = [];
        wellOwner.isTracked = false;

        // if (dataOwnersWells.ownersWells) {
        //   for (let i = 0; i < dataOwnersWells.ownersWells.length; i++) {
        //     if (wellOwner.id === dataOwnersWells.ownersWells[i].ownerId) {
        //       wellOwner.wellsCounter = dataOwnersWells.ownersWells[i].wells.map(
        //         (well) => well.wellId
        //       );
        //       break;
        //     }
        //   }
        // }

        for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
          if (wellOwner.id === dataCommentsCounter.commentsCounter[i]._id) {
            wellOwner.commentsCounter =
              dataCommentsCounter.commentsCounter[i].total;
            break;
          }
        }

        for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
          if (wellOwner.id === dataTagSamples.tagSamples[i]._id) {
            wellOwner.tags = [
              dataTagSamples.tagSamples[i].tags,
              dataTagSamples.tagSamples[i].total,
            ];

            break;
          }
        }

        for (let i = 0; i < dataTracks.tracksByObjectType.length; i++) {
          if (wellOwner.id === dataTracks.tracksByObjectType[i].trackOn) {
            wellOwner.isTracked = true;
            break;
          }
        }

        return wellOwner;
      });

      let availableTags = [];
      dataTagSamples.tagSamples.map((sample) => {
        availableTags = [...availableTags, ...sample.tags];
      });
      const cleanAvailableTags = [...new Set(availableTags)];

      setColumns(
        cleanAvailableTags.length > 0
          ? OwnersPerWellHeadCells.map((column) => {
              if (column.name === "tags") {
                return {
                  ...column,
                  options: {
                    ...column.options,
                    filterOptions: {
                      ...column.options.filterOptions,
                      names: cleanAvailableTags,
                    },
                  },
                };
              }
              return column;
            })
          : OwnersPerWellHeadCells.map((column) => {
              if (column.name === "tags") {
                return {
                  ...column,
                  options: {
                    ...column.options,
                    filter: false,
                  },
                };
              }
              return column;
            })
      );

      setRows(wellOwners);
      setLoading(false);
    }
  }, [
    dataWellOwners,
    dataTracks,
    dataTagSamples,
    dataCommentsCounter,
    // dataOwnersWells,
    dataTracks,
  ]);

  ////////////Owners Per Well end///////////////////////////////////////////////

  ////////////Contacts begin///////////////////////////////////////////////

  useEffect(() => {
    if (props.parent && props.parent === "Contacts") {
      setLoading(true);
      console.log("ue mintable 22");
      setTargetLabel("contact");
      setHeader("Contacts");
      setAddAble({ parent: false, type: "contact" });
      getContacts();
      getContactsFilterOptions();
      setUploadIcon(true);
      setStartPaginationAt(25);
    }
  }, [props.parent]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "Contacts" &&
      dataContacts /*&&
      dataContactsFilterOptions &&
      dataTracks &&
      dataTracks.tracksByObjectType*/
    ) {
      console.log("ue mintable 23");
      if (
        dataContacts.paginatedContacts.edges &&
        dataContacts.paginatedContacts.edges.length > 0
      ) {
        const objectsIdsArray = [];
        dataContacts.paginatedContacts.edges.forEach(({ node }) => {
          node.isTracked = false;
          objectsIdsArray.push(node._id);
        });

        getCommentsCounter({
          variables: { objectsIdsArray, userId: stateApp.user.mongoId },
        });
        getTagSamples({
          variables: { objectsIdsArray, userId: stateApp.user.mongoId },
        });
        getMelissaRowsCount({
          variables: { objectsIdsArray },
        });
      } else {
        setLoading(false);
        setRows([]);
      }
    }
  }, [
    dataContacts,
    // dataContactsFilterOptions,
    // dataTracks
  ]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "Contacts" &&
      dataContactsFilterOptions
    ) {
      console.log("ue mintable 23.5");
      if (
        dataContactsFilterOptions &&
        dataContactsFilterOptions.contactsFilterOptions
      ) {
        let filterTags = [
          ...dataContactsFilterOptions.contactsFilterOptions.tags.map((tag) => {
            return tag._id;
          }),
        ];
        let filterLeadSource = [
          ...dataContactsFilterOptions.contactsFilterOptions.leadSource.map(
            (leadSource) => {
              return leadSource._id;
            }
          ),
        ];
        let filterLastUpdateBy = [
          ...dataContactsFilterOptions.contactsFilterOptions.lastUpdateBy.map(
            (lastUpdateBy) => {
              return lastUpdateBy._id;
            }
          ),
        ];

        setColumns(
          ContactsHeadCells.map((column) => {
            switch (column.name) {
              case "tags":
                return {
                  ...column,
                  options: {
                    ...column.options,
                    filterOptions: {
                      ...column.options.filterOptions,
                      names: filterTags,
                    },
                  },
                };

              case "leadSource":
                return {
                  ...column,
                  options: {
                    ...column.options,
                    filterOptions: {
                      ...column.options.filterOptions,
                      names: filterLeadSource,
                    },
                  },
                };

              case "lastUpdateBy.name":
                return {
                  ...column,
                  options: {
                    ...column.options,
                    filterOptions: {
                      ...column.options.filterOptions,
                      names: filterLastUpdateBy,
                    },
                  },
                };

              default:
                return column;
            }
          })
        );
      } else {
        setLoading(false);
      }
    }
  }, [dataContactsFilterOptions]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "Contacts" &&
      dataContacts &&
      dataContacts.paginatedContacts.edges &&
      dataContacts.paginatedContacts.edges.length > 0 &&
      dataCommentsCounter &&
      dataCommentsCounter.commentsCounter &&
      dataTagSamples &&
      dataTagSamples.tagSamples &&
      dataMelissaRowsCount &&
      dataMelissaRowsCount.getMelissaRecordsCountForContactIds
    ) {
      console.log("ue mintable 24");
      dataContacts.paginatedContacts.edges.forEach(({ node }) => {
        node.commentsCounter = 0;
        node.tags = [[], 0];
        // node.fullContactAddress = joinAddress(node);
        // node.contactName = node.name;

        for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
          if (node._id === dataCommentsCounter.commentsCounter[i]._id) {
            node.commentsCounter = dataCommentsCounter.commentsCounter[i].total;
            break;
          }
        }

        for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
          if (node._id === dataTagSamples.tagSamples[i]._id) {
            node.tags = [
              dataTagSamples.tagSamples[i].tags,
              dataTagSamples.tagSamples[i].total,
            ];

            break;
          }
        }

        let foundMelissaRowsCount = dataMelissaRowsCount.getMelissaRecordsCountForContactIds.find(
          (value) => {
            return node._id === value._id;
          }
        );
        if (foundMelissaRowsCount) {
          node.melissaRowsCount = foundMelissaRowsCount.total;
        }
      });

      setRows([...dataContacts.paginatedContacts.edges.map((el) => el.node)]);
      setLoading(false);
    }
  }, [
    dataContacts,
    dataTracks,
    dataTagSamples,
    dataCommentsCounter,
    dataMelissaRowsCount,
  ]);

  ////////////Contact Delete begin////////////////////////////////////////

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "Contacts" &&
      stateApp.user &&
      stateApp.user.mongoId
    ) {
      console.log("ue mintable 25");
      setDeleteFunc(() => (contactsIdsToDelete) => {
        if (contactsIdsToDelete) {
          for (let i = 0; i < contactsIdsToDelete.length; i++) {
            updateContact({
              variables: {
                contact: {
                  _id: contactsIdsToDelete[i],
                  lastUpdateBy: stateApp.user.mongoId,
                  IsDeleted: true,
                },
              },
              refetchQueries: ["getContacts", "getContact", "getCustomLayer"],
              awaitRefetchQueries: true,
            });
          }
        }
      });
    }
  }, [props.parent, stateApp.user]);

  ////////////Contacts end///////////////////////////////////////////////

  //////////// Search begin///////////////////////////////////////////////
  useEffect(() => {
    if (searchloading) {
      setLoading(true);
    }
  }, [searchloading]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "search" &&
      props.header &&
      props.targetLabel &&
      stateApp &&
      searchResultData &&
      stateApp.user &&
      stateApp.user.mongoId
    ) {
      setTargetLabel(props.targetLabel);
      setHeader(props.header);
      setAddAble(false);
      setOrderByTracks(false);
      setStartPaginationAt(100);
      if (searchResultData.length > 0) {
        // setLoading(true);
        const objectsIdsArray = searchResultData.map((result) => result.Id);
        if (props.showComments)
          getCommentsCounter({
            variables: { objectsIdsArray, userId: stateApp.user.mongoId },
          });
        if (props.showTags)
          getTagSamples({
            variables: { objectsIdsArray, userId: stateApp.user.mongoId },
          });
        if (props.showTracks) setShowTracks(true);
        if (props.targetLabel == "owner")
          checkIfOwnersAreContacts({
            variables: { idsArray: objectsIdsArray },
          });
      } else {
        setShowTracks(false);
        if (!searchloading) {
          setRows([]);
          setLoading(false);
        }
      }
    }
  }, [
    props.parent,
    props.header,
    props.targetLabel,
    searchResultData,
    stateApp.user,
    props.showTracks,
    props.showComments,
    props.showTags,
    searchloading,
  ]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "search" &&
      stateApp &&
      searchResultData &&
      (!props.showComments ||
        (dataCommentsCounter && dataCommentsCounter.commentsCounter)) &&
      (!props.showTags || (dataTagSamples && dataTagSamples.tagSamples)) &&
      (!props.showTracks || (dataTracks && dataTracks.tracksByObjectType)) &&
      (props.targetLabel !== "owner" ||
        (checkIfOwnersAreContactsData &&
          checkIfOwnersAreContactsData.ifAreContacts)) &&
      props.privateColumns
    ) {
      if (searchResultData.length > 0) {
        searchResultData.forEach((result) => {
          result.id = result.Id;

          if (props.targetLabel && props.targetLabel == "well") {
            if (result.Longitude) result.longitude = result.Longitude;
            if (result.Latitude) result.latitude = result.Latitude;

            result.coordinates = {};
            if (result.Longitude && result.Latitude)
              result.coordinates.center = [result.Longitude, result.Latitude];

            //// set in the detailCard column
            result.detailCard = result.Id;
          } else if (props.targetLabel && props.targetLabel == "location") {
            result.coordinates = {};
            if (result.bbox) result.coordinates.bbox = result.bbox;
            if (result.center) result.coordinates.center = result.center;
          } else if (props.targetLabel && props.targetLabel == "owner") {
            result.coordinates = {
              objToPopulateSearchLayer: {
                objectType: "owner",
                objectId: result.Id,
              },
            };

            result.isContact = false;
            for (
              let i = 0;
              i < checkIfOwnersAreContactsData.ifAreContacts.length;
              i++
            ) {
              if (
                result.Id ===
                checkIfOwnersAreContactsData.ifAreContacts[i].globalOwner
              ) {
                result.isContact =
                  checkIfOwnersAreContactsData.ifAreContacts[i].isContact;

                result.entity =
                  checkIfOwnersAreContactsData.ifAreContacts[i]._id;
                break;
              }
            }
          }

          if (props.showComments) {
            result.commentsCounter = 0;
            for (
              let i = 0;
              i < dataCommentsCounter.commentsCounter.length;
              i++
            ) {
              if (result.Id === dataCommentsCounter.commentsCounter[i]._id) {
                result.commentsCounter =
                  dataCommentsCounter.commentsCounter[i].total;
                break;
              }
            }
          }

          if (props.showTags) {
            result.tags = [[], 0];
            for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
              if (result.Id === dataTagSamples.tagSamples[i]._id) {
                result.tags = [
                  dataTagSamples.tagSamples[i].tags,
                  dataTagSamples.tagSamples[i].total,
                ];

                break;
              }
            }
          }

          if (props.showTracks) {
            result.isTracked = false;
            for (let i = 0; i < dataTracks.tracksByObjectType.length; i++) {
              if (result.Id === dataTracks.tracksByObjectType[i].trackOn) {
                result.isTracked = true;
                break;
              }
            }
          }
        });

        const buildingColumns = [SearchsHeadCells[0], ...props.privateColumns];

        if (props.showTags) {
          let availableTags = [];
          dataTagSamples.tagSamples.map((sample) => {
            availableTags = [...availableTags, ...sample.tags];
          });
          const cleanAvailableTags = [...new Set(availableTags)];

          buildingColumns.push(
            cleanAvailableTags.length > 0
              ? {
                  ...SearchsHeadCells[1],
                  options: {
                    ...SearchsHeadCells[1].options,
                    filterOptions: {
                      ...SearchsHeadCells[1].options.filterOptions,
                      names: cleanAvailableTags,
                    },
                  },
                }
              : {
                  ...SearchsHeadCells[1],
                  options: {
                    ...SearchsHeadCells[1].options,
                    filter: false,
                  },
                }
          );
        }

        if (props.targetLabel && props.targetLabel == "owner")
          buildingColumns.push(SearchsHeadCells[6]);

        if (props.showComments) buildingColumns.push(SearchsHeadCells[2]);

        if (props.showTracks) buildingColumns.push(SearchsHeadCells[3]);
        if (
          (props.targetLabel && props.targetLabel == "well") ||
          props.targetLabel == "owner"
        )
          //would only set the detail card icon for wells & owners
          buildingColumns.push(SearchsHeadCells[5]);
        if (
          props.targetLabel &&
          (props.targetLabel == "well" ||
            props.targetLabel == "location" ||
            props.targetLabel == "owner")
        )
          //would only set flyto for wells, locations & owners
          buildingColumns.push(SearchsHeadCells[4]);

        setColumns([...buildingColumns]);
        setRows([...searchResultData]);
        setLoading(false);
      }
    }
  }, [
    props.parent,
    searchResultData,
    dataTracks,
    dataTagSamples,
    dataCommentsCounter,
    checkIfOwnersAreContactsData,
    props.privateColumns,
    props.showTracks,
    props.showComments,
    props.showTags,
  ]);

  //////////// Search end///////////////////////////////////////////////

  ////////////Owners Per Parcel begin///////////////////////////////////////////////

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "ownersPerParcel" &&
      props.customLayer &&
      stateApp.user
    ) {
      setTargetLabel("Parcel Ownership");
      setHeader("Parcel Ownerships");
      setAddAble({
        type: "ownerToParcel",
        customLayerId: props.customLayer._id,
      });

      if (props.customLayer.owners && props.customLayer.owners.length > 0) {
        const objectsIdsArray = props.customLayer.owners.map(
          (owner) => owner._id
        );

        getCommentsCounter({
          variables: {
            objectsIdsArray,
            userId: stateApp.user.mongoId,
          },
        });
      } else {
        setLoading(false);
        setRows([]);
      }
    }
  }, [props.parent, props.customLayer, stateApp.user]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "ownersPerParcel" &&
      props &&
      props.customLayer &&
      props.customLayer.owners &&
      props.customLayer.owners.length > 0 &&
      dataTracks &&
      dataTracks.tracksByObjectType &&
      dataCommentsCounter &&
      dataCommentsCounter.commentsCounter
    ) {
      let owners = [];
      props.customLayer.owners.forEach((parcelOwner) => {
        let owner = { ...parcelOwner };
        owner.commentsCounter = 0;
        owner.tags = [[], 0];
        owner.isTracked = false;

        for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
          if (owner._id === dataCommentsCounter.commentsCounter[i]._id) {
            owner.commentsCounter =
              dataCommentsCounter.commentsCounter[i].total;
            break;
          }
        }

        for (let i = 0; i < dataTracks.tracksByObjectType.length; i++) {
          if (owner._id === dataTracks.tracksByObjectType[i].trackOn) {
            owner.isTracked = true;
            break;
          }
        }
        owners.push(owner);
      });

      setColumns(OwnersPerParcelHeadCells);
      setRows(owners);
      setLoading(false);
    }
  }, [props.parent, props.customLayer, dataTracks, dataCommentsCounter]);
  ////////////Owners Per Parcel begin//////////Delete//////////////////////////////

  useEffect(() => {
    if (props.parent && props.parent === "ownersPerParcel") {
      setDeleteFunc(() => (idsToDelete) => {
        if (idsToDelete && idsToDelete.length > 0) {
          for (let i = 0; i < idsToDelete.length; i++) {
            updateParcelOwner({
              variables: {
                parcelOwner: { _id: idsToDelete[i], IsDeleted: true },
              },
              refetchQueries: [
                "getCustomLayer",
                "getContactParcelInterests",
                "getAllEntityNamesToAddAsParcelOwner",
              ],
              awaitRefetchQueries: true,
            });
          }
        }
      });
    }
  }, [props.parent]);

  ////////////Owners Per Parcel end/////////////////////////////////////////////////

  ////////////Parcel Interests Per Contact begin///////////////////////////////////////////////

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "contactParcelInterests" &&
      props.contact &&
      props.header &&
      props.entityId
    ) {
      setTargetLabel("Parcel Interest");
      setHeader(props.header);
      setAddAble({
        type: "parcelInterestsToEntity",
        entityId: props.entityId,
      });
      getContactParcelInterests({
        variables: {
          contactId: props.contact._id,
        },
      });
      setLoading(true);
    }
  }, [props.contact, props.entityId, props.header]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "contactParcelInterests" &&
      dataContactParcelInterests &&
      dataContactParcelInterests.contactParcelInterests &&
      stateApp.user
    ) {
      if (dataContactParcelInterests.contactParcelInterests.length > 0) {
        const objectsIdsArray = dataContactParcelInterests.contactParcelInterests.map(
          (parcelInterest) => parcelInterest._id
        );

        getCommentsCounter({
          variables: {
            objectsIdsArray,
            userId: stateApp.user.mongoId,
          },
        });
      } else {
        setLoading(false);
        setRows([]);
      }
    }
  }, [props.parent, dataContactParcelInterests, stateApp.user]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "contactParcelInterests" &&
      dataContactParcelInterests &&
      dataContactParcelInterests.contactParcelInterests &&
      dataContactParcelInterests.contactParcelInterests.length > 0 &&
      dataTracks &&
      dataTracks.tracksByObjectType &&
      dataCommentsCounter &&
      dataCommentsCounter.commentsCounter
    ) {
      let arcelInterests = dataContactParcelInterests.contactParcelInterests.map(
        (p) => {
          let parcelInterest = { ...p };
          parcelInterest.commentsCounter = 0;
          parcelInterest.isTracked = false;

          for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
            if (
              parcelInterest._id === dataCommentsCounter.commentsCounter[i]._id
            ) {
              parcelInterest.commentsCounter =
                dataCommentsCounter.commentsCounter[i].total;
              break;
            }
          }

          for (let i = 0; i < dataTracks.tracksByObjectType.length; i++) {
            if (
              parcelInterest._id === dataTracks.tracksByObjectType[i].trackOn
            ) {
              parcelInterest.isTracked = true;
              break;
            }
          }
          return parcelInterest;
        }
      );

      setColumns(ParcelInterestsPerContactHeadCells);
      setRows([...dataContactParcelInterests.contactParcelInterests]);
      setLoading(false);
    }
  }, [
    props.parent,
    dataContactParcelInterests,
    dataTracks,
    dataCommentsCounter,
  ]);

  ////////////Parcel Interests Per Contact begin//////////Delete//////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "contactParcelInterests") {
      setDeleteFunc(() => (idsToDelete) => {
        if (idsToDelete && idsToDelete.length > 0) {
          for (let i = 0; i < idsToDelete.length; i++) {
            updateParcelOwner({
              variables: {
                parcelOwner: { _id: idsToDelete[i], IsDeleted: true },
              },
              refetchQueries: [
                "getCustomLayer",
                "getContactParcelInterests",
                "getAllEntityNamesToAddAsParcelOwner",
              ],
              awaitRefetchQueries: true,
            });
          }
        }
      });
    }
  }, [props.parent]);

  ////////////Parcel Interests Per Contact end/////////////////////////////////////////////////

  ////////////User management//////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "UserManagement") {
      setLoading(true);
      getAllUsers();
      if (userLists?.allUsers) {
        setTargetLabel("usermanagement");
        setHeader("Active Users");
        setRows(userLists.allUsers);
        setColumns(UserManagementHeadCells);
        setLoading(false);
        setAddAble({
          type: "inviteUser",
        });
        setOrderByTracks(false);
      }
    } else {
      setRows([]);
    }
  }, [props.parent, userLists]);

  ///////// Remove User ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "UserManagement") {
      setDeleteFunc(() => (userId) => {
        if (userId) {
          removeUser({
            variables: {
              userId,
            },
            refetchQueries: ["getAllUsers"],
            awaitRefetchQueries: true,
          });
        }
      });
    }
  }, [props.parent]);
  ////////////User management end //////////////////////////////////////////////////////////////
  ////////////Deals start////////////////////////////////////////////////

  useEffect(() => {
    console.log("DEALS CHECK : ", props.parent, props.contact, stateApp.user);
    if (props.parent && props.parent === "Deals" && stateApp.user) {
      setLoading(true);
      console.log("ue mintable 22");
      setTargetLabel("deals");
      setHeader("Deals");
      getTransactionData({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
      setAddAble({ type: "deals" });
      setUploadIcon(false);
      setStartPaginationAt(25);
    }
  }, [props.parent, stateApp.user]);

  useEffect(() => {
    console.log("DEALS m1n : ", props.parent, dataDeals);
    if (
      props.parent &&
      props.parent === "Deals" &&
      dataDeals &&
      props.contact
    ) {
      console.log("DATA DEALS : ", dataDeals);
      const lanes = dataDeals?.transactionData?.allData?.lanes;

      const all = [];
      console.log("ALL : ", all, lanes);
      if (lanes) {
        lanes.forEach((deal) => {
          deal.cards.forEach((card) => {
            if (props.contact?._id === card.contactId && !card.isDeleted)
              all.push(card);
          });
        });
      }

      const dealsRowsData = all.map((deal) => ({
        ...deal,
        id: deal.id,
        dealStage: lanes.find((lane) => lane.id === deal.laneId).title,
      }));
      // all.forEach((deal) => {
      //   console.log("DEAL: ", deal)
      //   let dealData = {
      //     name: deal.title,
      //     contact: deal.contactName,
      //     dealStage: lanes.find((lane) => lane.id === deal.laneId).title,
      //     dealAmount: deal.label,
      //     dealDetails: deal.description,
      //     id: deal.id, //// "deal.laneId" check if this is the rigth id to delete the data
      //   };

      //   dealsRowsData.push(dealData);
      // });
      setTargetLabel("deals");
      setRows(dealsRowsData);
      setColumns([...DealsHeadCells]);
      setLoading(false);
    }

    console.log(
      "%cCONTACT ID : ",
      "font-size:20px; color:green;",
      props.contact
    );
  }, [props.parent, dataDeals, props.contact]);

  // deals delete
  useEffect(() => {
    if (props.parent && props.parent === "Deals") {
      setDeleteFunc(() => (idsToDelete) => {
        if (idsToDelete && idsToDelete.length > 0) {
          let lanes = new Array(dataDeals?.transactionData?.allData?.lanes)[0];
          lanes = lanes.map((lane) => {
            let cardsNew = [];
            if (lane.cards && lane.cards.length > 0) cardsNew = [...lane.cards];
            cardsNew = cardsNew.map((card) => {
              const foundIndex = idsToDelete.findIndex((id) => id === card.id);
              if (foundIndex > -1) {
                return { ...card, isDeleted: true };
              } else return card;
            });
            return { ...lane, cards: cardsNew };
          });

          const newData = { ...dataDeals.transactionData.allData, lanes };

          console.log({
            transactionId: dataDeals.transactionData._id,
            transaction: { allData: newData, user: stateApp.user.mongoId },
          });

          updateTransaction({
            variables: {
              transactionId: dataDeals.transactionData._id,
              transaction: { allData: newData, user: stateApp.user.mongoId },
            },
            refetchQueries: ["getTransactionData", "getContact", "getContacts"],
            awaitRefetchQueries: true,
          });
        }
      });
    }
  }, [
    props.parent,
    dataDeals,
    props.contact,
    updateTransaction,
    stateApp.user.mongoId,
  ]);

  ////////////Deals end////////////////////////////////////////////////

  ////////////Map Viewport Wells begin///////////////////////////////////////////////

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "mapViewportWells" &&
      stateApp.viewportWells
    ) {
      const IdsArray = [];
      stateApp.viewportWells.forEach((well) => {
        if (well && well.id) {
          IdsArray.push(well.id);
        }
      });

      if (IdsArray.length > 0) {
        setLoading(true);
        getCommentsCounter({
          variables: {
            objectsIdsArray: IdsArray,
            userId: stateApp.user.mongoId,
          },
        });
        getTagSamples({
          variables: {
            objectsIdsArray: IdsArray,
            userId: stateApp.user.mongoId,
          },
        });
        setViewportFeatures(stateApp.viewportWells);
      } else {
        setViewportFeatures(null);
        setRows([]);
        setLoading(false);

        if (!warningShowed) {
          dispatch(
            showWarningMessage(
              "We didn't find any well in the viewport, please make sure at least one layer with wells it's active, or zoom out untill you visualize some well spots."
            )
          );
          setWarningShowed(true);
        }
      }
    }
  }, [props.parent, stateApp.viewportWells, stateApp.user]);

  useEffect(() => {
    if (props.parent && props.parent === "mapViewportWells") {
      setTargetLabel("well");

      if (props.header) {
        setHeader(props.header);
      } else {
        setHeader("Wells");
      }
      setAddAble(false);
    }
  }, [props.parent]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "mapViewportWells" &&
      viewportFeatures &&
      viewportFeatures.length > 0 &&
      dataCommentsCounter &&
      dataCommentsCounter.commentsCounter &&
      dataTagSamples &&
      dataTagSamples.tagSamples &&
      dataTracks &&
      dataTracks.tracksByObjectType
    ) {
      let wells = [...viewportFeatures];
      wells = wells.map((w) => {
        let well = { ...w };

        well.isTracked = false;
        well.commentsCounter = 0;
        well.tags = [[], 0];

        well.coordinates = {};
        if (well.longitude && well.latitude)
          well.coordinates.center = [well.longitude, well.latitude];

        for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
          if (well.id === dataCommentsCounter.commentsCounter[i]._id) {
            well.commentsCounter = dataCommentsCounter.commentsCounter[i].total;
            break;
          }
        }
        for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
          if (well.id === dataTagSamples.tagSamples[i]._id) {
            well.tags = [
              dataTagSamples.tagSamples[i].tags,
              dataTagSamples.tagSamples[i].total,
            ];

            break;
          }
        }
        for (let i = 0; i < dataTracks.tracksByObjectType.length; i++) {
          if (
            well.id === dataTracks.tracksByObjectType[i].trackOn.toLowerCase()
          ) {
            well.isTracked = true;
            break;
          }
        }

        return well;
      });

      let availableTags = [];
      dataTagSamples.tagSamples.map((sample) => {
        availableTags = [...availableTags, ...sample.tags];
      });
      const cleanAvailableTags = [...new Set(availableTags)];

      setRows(wells);

      const flyToColumn = {
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
      };

      setColumns([
        ...(cleanAvailableTags.length > 0
          ? WellsHeadCells.map((column) => {
              if (column.name === "tags") {
                return {
                  ...column,
                  options: {
                    ...column.options,
                    filterOptions: {
                      ...column.options.filterOptions,
                      names: cleanAvailableTags,
                    },
                  },
                };
              }
              return column;
            })
          : WellsHeadCells.map((column) => {
              if (column.name === "tags") {
                return {
                  ...column,
                  options: {
                    ...column.options,
                    filter: false,
                  },
                };
              }
              return column;
            })),
        flyToColumn,
      ]);

      setLoading(false);
    }
  }, [viewportFeatures, dataTagSamples, dataCommentsCounter, dataTracks]);

  ////////////Map Viewport Wells end///////////////////////////////////////////////

  ////////////Owner_WellInterests begin///////////////////////////////////////////

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "owner_WellInterests" &&
      props.id &&
      stateApp.user &&
      stateApp.user.mongoId
    ) {
      setTargetLabel("well");
      setHeader("Well Interests");
      setAddAble(false);
      getOwner_WellInterests({
        variables: {
          id: props.id,
        },
      });
    }
  }, [props.id, stateApp.user]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "owner_WellInterests" &&
      dataOwner_WellInterests &&
      dataOwner_WellInterests.owner_WellInterests &&
      stateApp.user &&
      stateApp.user.mongoId
    ) {
      const IdsArray = [];
      dataOwner_WellInterests.owner_WellInterests.forEach((well) => {
        if (well && well.id) {
          IdsArray.push(well.id);
        }
      });

      if (IdsArray.length > 0) {
        getCommentsCounter({
          variables: {
            objectsIdsArray: IdsArray,
            userId: stateApp.user.mongoId,
          },
        });
        getTagSamples({
          variables: {
            objectsIdsArray: IdsArray,
            userId: stateApp.user.mongoId,
          },
        });
      } else {
        setRows([]);
        setLoading(false);
      }
    }
  }, [dataOwner_WellInterests, stateApp.user]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "owner_WellInterests" &&
      dataOwner_WellInterests &&
      dataOwner_WellInterests.owner_WellInterests
    ) {
      if (
        dataOwner_WellInterests.owner_WellInterests.length > 0 &&
        dataCommentsCounter &&
        dataCommentsCounter.commentsCounter &&
        dataTagSamples &&
        dataTagSamples.tagSamples &&
        dataTracks &&
        dataTracks.tracksByObjectType
      ) {
        let wells = dataOwner_WellInterests.owner_WellInterests.map((w) => {
          let well = { ...w };

          well.isTracked = false;
          well.commentsCounter = 0;
          well.tags = [[], 0];

          //// set in the detailCard column
          well.detailCard = well.id;

          well.coordinates = {};
          if (well.longitude && well.latitude)
            well.coordinates.center = [well.longitude, well.latitude];

          for (let i = 0; i < dataTracks.tracksByObjectType.length; i++) {
            if (well.id === dataTracks.tracksByObjectType[i].trackOn) {
              well.isTracked = true;
              break;
            }
          }
          for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
            if (well.id === dataCommentsCounter.commentsCounter[i]._id) {
              well.commentsCounter =
                dataCommentsCounter.commentsCounter[i].total;
              break;
            }
          }
          for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
            if (well.id === dataTagSamples.tagSamples[i]._id) {
              well.tags = [
                dataTagSamples.tagSamples[i].tags,
                dataTagSamples.tagSamples[i].total,
              ];

              break;
            }
          }
          return well;
        });

        let availableTags = [];
        dataTagSamples.tagSamples.map((sample) => {
          availableTags = [...availableTags, ...sample.tags];
        });
        const cleanAvailableTags = [...new Set(availableTags)];

        setColumns(
          cleanAvailableTags.length > 0
            ? WellInterests.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filterOptions: {
                        ...column.options.filterOptions,
                        names: cleanAvailableTags,
                      },
                    },
                  };
                }
                return column;
              })
            : WellInterests.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filter: false,
                    },
                  };
                }
                return column;
              })
        );

        setRows(wells);
        //// to populate the search layer
        dispatch(
          setMapGridCardState({
            objToPopulateSearchLayer: {
              objectType: "wells",
              wells,
            },
          })
        );
        setLoading(false);
      }
      // else {
      //   setRows([]);
      // }

      // setLoading(false);
    }
  }, [
    dataOwner_WellInterests,
    dataTagSamples,
    dataCommentsCounter,
    dataTracks,
  ]);

  //////////// Owner_WellInterests end///////////////////////////////////////////////

  ////////////-----Add your code section here-----///////////////////////
  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      {props.parent && props.parent === "Deals" && (
        <AddDealDialog
          open={stateApp.dealDialog ? true : false}
          width="450px"
          onClose={() =>
            setStateApp((stateApp) => ({
              ...stateApp,
              dealDialog: false,
              activeDeal: { cardId: null, laneId: null },
            }))
          }
          contactId={props.contact?._id}
        />
      )}
      <Table
        style={{ backgroundColor: "#fff" }}
        header={header}
        columns={columns}
        rows={rows}
        loading={loading}
        addAble={addAble}
        targetLabel={targetLabel}
        deleteFunc={deleteFunc}
        uploadIcon={uploadIcon}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={orderByTracks}
        startPaginationAt={startPaginationAt}
        contactId={props.contact?._id}
        contactsPageProps={{
          getContacts,
          contactsCount: dataContactsFilterOptions
            ? dataContactsFilterOptions.contactsFilterOptions.totalCount[0]
                .totalCount
            : 0,
          setLoading,
        }}
        parent={props.parent}
      />
    </Container>
  );
}

export default React.memo(M1nTable, deepEqualObjects);
