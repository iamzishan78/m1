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
import TableProvider from "./components/TableProvider";

import { useLazyQuery } from "@apollo/react-hooks";
import { WELLOWNERSQUERY } from "../../../graphQL/useQueryWellOwners";
import { OWNERSQUERY } from "../../../graphQL/useQueryOwners";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { CONTACTSQUERY } from "../../../graphQL/useQueryContacts";
import { TRACKSBYUSERANDOBJECTTYPE } from "../../../graphQL/useQueryTracksByUserAndObjectType";
import { TAGSAMPLES } from "../../../graphQL/useQueryTagSamples";
import { COMMENTSCOUNTER } from "../../../graphQL/useQueryCommentsCounter";
import { USERBYEMAIL } from "../../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed

const useStyles = makeStyles((theme) => ({
  container: { padding: "0 !important" },
}));

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
  { name: "api", label: "API" },
  { name: "wellName", label: "Well" },
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
  {
    name: "ownerCount",
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
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  {
    name: "phone",
    label: "Phone",
  },
  {
    name: "openDealsAmount",
    label: "Open Deals Amount",
    money: true,
  },
  {
    name: "salesOwner",
    label: "Sales Owner",
  },
  {
    name: "createAt",
    label: "Create At",
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
  //   name: "owners",
  //   label: "Owners",
  //   options: {
  //     filter: false,
  //     searchable: false,
  //     sort: false,
  //     download: false,
  //     print: false,
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

////////////HeadCells end///////////////////////////////////////////////

export default function Contacts(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [rows, setRows] = useState();
  const [header, setHeader] = useState(""); ////set it as "" for no header, and as null to higth the whole header row
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addAble, setAddAble] = useState(true);

  const [source, setSource] = useState(null);
  const [sourceId, setSourceId] = useState(stateApp.user.id);
  const [sourceLabel, setSourceLabel] = useState(null);
  const [edgeLabel, setEdgeLabel] = useState(null);
  const [targetLabel, setTargetLabel] = useState(null);

  //////begin////////temporary  while signed user fixed

  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
  const [user, setUser] = useState({ _id: "" });

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email,
        },
      });
    }
  }, [stateApp.user.email]);

  useEffect(() => {
    if (dataUser && dataUser.userByEmail) {
      setUser(dataUser.userByEmail);
    }
  }, [dataUser]);

  /////end/////////temporary while signed user fixed

  ////////////Queries begin///////////////////////////////////////////////

  const [tracksByUserAndObjectType, { data: dataTracks }] = useLazyQuery(
    TRACKSBYUSERANDOBJECTTYPE
  );
  const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(
    COMMENTSCOUNTER
  );
  const [getTagSamples, { data: dataTagSamples }] = useLazyQuery(TAGSAMPLES);
  //////////
  const [getOwners, { data: dataOwners }] = useLazyQuery(OWNERSQUERY);
  //////////
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  //////////
  const [getWellOwners, { data: dataWellOwners }] = useLazyQuery(
    WELLOWNERSQUERY
  );
  //////////
  const [
    getContacts,
    { loading: loadingContacts, data: dataContacts },
  ] = useLazyQuery(CONTACTSQUERY);

  ////////////Queries end///////////////////////////////////////////////

  ////////////General begin///////////////////////////////////////////////

  useEffect(() => {
    //////stateApp.user._id////////temporary while signed user fixed
    if (targetLabel && user._id !== "") {
      setLoading(true);

      tracksByUserAndObjectType({
        variables: {
          userId: user._id, //////stateApp.user._id////////temporary while signed user fixed
          objectType: targetLabel,
        },
      });
    }
  }, [user, targetLabel]); //////stateApp.user._id////////temporary while signed user fixed

  ////////////General end///////////////////////////////////////////////

  ////////////Tracked Owners begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "trackOwners") {
      setTargetLabel("owner");
    }
  }, []);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "trackOwners" &&
      dataTracks &&
      dataTracks.tracksByUserAndObjectType
    ) {
      if (dataTracks.tracksByUserAndObjectType.length !== 0) {
        const tracksIdArray = dataTracks.tracksByUserAndObjectType.map(
          (track) => track.trackOn
        );

        getOwners({
          variables: {
            ownerIdArray: tracksIdArray,
            authToken: stateApp.user.authToken,
          },
        });
        getCommentsCounter({
          variables: { objectsIdsArray: tracksIdArray, userId: user._id }, //////stateApp.user._id////////temporary while signed user fixed
        });
        getTagSamples({
          variables: { objectsIdsArray: tracksIdArray, userId: user._id }, //////stateApp.user._id////////temporary while signed user fixed
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
        dataOwners.owners.results &&
        dataOwners.owners.results.length > 0 &&
        dataCommentsCounter &&
        dataCommentsCounter.commentsCounter &&
        dataTagSamples &&
        dataTagSamples.tagSamples
      ) {
        dataOwners.owners.results.forEach((owner) => {
          owner.isTracked = true;
          owner.commentsCounter = 0;
          owner.tags = [[], 0];

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
        });

        let availableTags = [];
        dataTagSamples.tagSamples.map((sample) => {
          availableTags = [...availableTags, ...sample.tags];
        });
        const cleanAvailableTags = [...new Set(availableTags)];

        setRows(dataOwners.owners.results);
        setHeader("Owners");
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
        setAddAble(false);
        setStateApp((state) => ({
          ...state,
          owners: dataOwners.owners.results,
        }));
      } else {
        setRows([]);
      }
      setLoading(false);
    }
  }, [dataOwners, dataTagSamples, dataCommentsCounter]);
  ////////////Tracked Owners end///////////////////////////////////////////////

  ////////////Tracked Wells begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "trackWells") {
      setTargetLabel("well");
    }
  }, []);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "trackWells" &&
      dataTracks &&
      dataTracks.tracksByUserAndObjectType
    ) {
      if (dataTracks.tracksByUserAndObjectType.length !== 0) {
        const tracksIdArray = dataTracks.tracksByUserAndObjectType.map(
          (track) => track.trackOn
        );

        getWells({
          variables: {
            wellIdArray: tracksIdArray,
            authToken: stateApp.user.authToken,
          },
        });
        getCommentsCounter({
          variables: { objectsIdsArray: tracksIdArray, userId: user._id }, //////stateApp.user._id////////temporary while signed user fixed
        });
        getTagSamples({
          variables: { objectsIdsArray: tracksIdArray, userId: user._id }, //////stateApp.user._id////////temporary while signed user fixed
        });
      } else {
        setRows([]);
        setLoading(false);
      }
    }
  }, [dataTracks]);

  useEffect(() => {
    if (props.parent && props.parent === "trackWells" && dataWells) {
      if (
        dataWells.wells &&
        dataWells.wells.results &&
        dataWells.wells.results.length > 0 &&
        dataCommentsCounter &&
        dataCommentsCounter.commentsCounter &&
        dataTagSamples &&
        dataTagSamples.tagSamples
      ) {
        dataWells.wells.results.forEach((well) => {
          well.isTracked = true;
          well.commentsCounter = 0;
          well.tags = [[], 0];

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
        setHeader("Wells");
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
        setAddAble(false);
        setStateApp((state) => ({
          ...state,
          wells: dataWells.wells.results,
        }));
      } else {
        setRows([]);
      }
      setLoading(false);
    }
  }, [dataWells, dataTagSamples, dataCommentsCounter]);
  ////////////Tracked Wells end///////////////////////////////////////////////

  ////////////Owners Per Well begin///////////////////////////////////////////////

  useEffect(() => {
    if (props.parent && props.parent === "OwnersPerWell") {
      setTargetLabel("owner");
      getWellOwners({
        variables: { api: props.selectedWell.api },
      });
    }
  }, [props.selectedWell]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "OwnersPerWell" &&
      dataWellOwners &&
      dataTracks &&
      dataTracks.tracksByUserAndObjectType
    ) {
      if (dataWellOwners.wellOwners && dataWellOwners.wellOwners.length > 0) {
        const objectsIdsArray = [];
        dataWellOwners.wellOwners.forEach((wellOwner) => {
          wellOwner.isTracked = false;
          objectsIdsArray.push(wellOwner.id);

          for (
            let i = 0;
            i < dataTracks.tracksByUserAndObjectType.length;
            i++
          ) {
            if (
              wellOwner.id === dataTracks.tracksByUserAndObjectType[i].trackOn
            ) {
              wellOwner.isTracked = true;
              break;
            }
          }
        });

        setHeader("Owners Per Well");
        setAddAble(false);

        getCommentsCounter({
          variables: { objectsIdsArray, userId: user._id }, //////stateApp.user._id////////temporary while signed user fixed
        });
        getTagSamples({
          variables: { objectsIdsArray, userId: user._id }, //////stateApp.user._id////////temporary while signed user fixed
        });
      } else {
        setLoading(false);
        setRows([]);
      }
    }
  }, [dataWellOwners, dataTracks]);

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
      dataTagSamples.tagSamples
    ) {
      dataWellOwners.wellOwners.forEach((wellOwner) => {
        wellOwner.commentsCounter = 0;
        wellOwner.tags = [[], 0];

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
      setRows(dataWellOwners.wellOwners);
      setLoading(false);
    }
  }, [dataWellOwners, dataTracks, dataTagSamples, dataCommentsCounter]);

  ////////////Owners Per Well end///////////////////////////////////////////////

  ////////////Contacts begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "Contacts" && user._id !== "") {
      setTargetLabel("contact");
      getCommentsCounter({
        variables: { objectsIdsArray: ["1234"], userId: user._id }, ///////temporary
      });
      getTagSamples({
        variables: { objectsIdsArray: ["1234"], userId: user._id }, /////temporary
      });
    }
  }, [user]);
  /////temporary /////

  const ContactExample = {
    _id: "1234",
    name: "James",
    lastName: "Sampleton",
    account: "Widgetz.io (sample)",
    email: "jamessampleton@gmail.com",
    salesOwner: "Jacob Avery",
    workPhone: "(473)-160-8265",
    mobilePhone: "1-926-555-9503",
    jobTitle: "CEO",
    department: "Engineering",
    status: "Qualified Lead",
    doNotDisturb: "No",
    addres: "1552 camp st",
    zipcode: 92093,
    openDealsAmount: "$7,000",
    createAt: "11 days ago",
  };

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "Contacts" &&
      dataTracks &&
      dataTracks.tracksByUserAndObjectType &&
      dataCommentsCounter &&
      dataCommentsCounter.commentsCounter &&
      dataTagSamples &&
      dataTagSamples.tagSamples
    ) {
      setRows([
        {
          _id: ContactExample._id,
          name: `${ContactExample.name} ${ContactExample.lastName}`,
          email: ContactExample.email,
          phone: ContactExample.mobilePhone,
          openDealsAmount: ContactExample.openDealsAmount,
          salesOwner: ContactExample.salesOwner,
          createAt: ContactExample.createAt,
          isTracked:
            dataTracks.tracksByUserAndObjectType.length !== 0 &&
            dataTracks.tracksByUserAndObjectType[0].trackOn ===
              ContactExample._id
              ? true
              : false,
          commentsCounter:
            dataCommentsCounter.commentsCounter.length > 0
              ? dataCommentsCounter.commentsCounter[0].total
              : 0,
          tags: [
            dataTagSamples.tagSamples.length > 0
              ? dataTagSamples.tagSamples[0].tags
              : [],
            dataTagSamples.tagSamples.length > 0
              ? dataTagSamples.tagSamples[0].total
              : 0,
          ],
        },
      ]);

      let availableTags = [];
      dataTagSamples.tagSamples.map((sample) => {
        availableTags = [...availableTags, ...sample.tags];
      });
      const cleanAvailableTags = [...new Set(availableTags)];

      setHeader("Contacts");
      setColumns(
        cleanAvailableTags.length > 0
          ? ContactsHeadCells.map((column) => {
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
          : ContactsHeadCells.map((column) => {
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
      setAddAble({
        externalAdd: true,
        externalAddFunction: props.externalAddFunction,
      });
      setLoading(false);
    }
  }, [dataTracks, dataCommentsCounter, dataTagSamples]);

  // useEffect(() => {
  //   if (props.parent && props.parent === "Contacts" && dataGraph) {
  //     if (dataGraph.vertexEdges.success) {
  //       getContacts({
  //         variables: {
  //           contactsIdArray: dataGraph.vertexEdges.sourceIds
  //         }
  //       });
  //     } else {
  //       setRows([]);
  //       setLoading(false);
  //     }
  //   }
  // }, [stateApp.user, dataGraph]);

  // useEffect(() => {
  //   if (props.parent && props.parent === "Contacts" && dataContacts) {
  //     getTrackedContacts({
  //       variables: { source: source, edgeLabel: "tracks", targetLabel }
  //     });
  //   }
  // }, [dataContacts]);

  // useEffect(() => {
  //   if (props.parent && props.parent === "Contacts" && dataContacts) {
  //     if (
  //       dataContacts.contacts &&
  //       dataContacts.contacts.results &&
  //       dataContacts.contacts.results > 0
  //     ) {
  //       dataContacts.contacts.results.forEach(contact => {
  //         if (dataTrackedContacts&&dataTrackedContacts.success) {
  //           dataTrackedContacts.vertexEdges.sourceIds.forEach(sourceId => {
  //             if (contact.id === sourceId) {
  //               contact.isTracked = true;
  //             }
  //           });
  //         }
  //       });

  //       setRows(dataContacts.contacts.results);
  //       setHeader("Contacts");
  //       setColumns(ContactsHeadCells);
  //       setAddAble({
  //         externalAdd: true,
  //         externalAddFunction: props.externalAddFunction
  //       });
  //     } else {
  //       setRows([]);
  //     }
  //     setLoading(false);
  //   }
  // }, [dataTrackedContacts]);

  /////temporary end/////

  ////////////Contacts end///////////////////////////////////////////////

  ////////////-----Add your code section here-----///////////////////////

  return (
    <Container maxWidth="xl" className={classes.container}>
      <TableProvider
        header={header}
        columns={columns}
        rows={rows}
        loading={loading}
        addAble={addAble}
        targetLabel={targetLabel}
      />
    </Container>
  );
}
