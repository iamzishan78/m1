/////////////////////////////////////////////////////////////////////////////////////////////////////////
////                TO USE THIS TABLE IN A NEW USE CASE:
//// 1-Send to this component a prop called 'parent' with a string you choose to identify your use case.
//// 2-Define your HeadCells const, for your columns, in the HeadCells section.
//// 3-Add your query in the queries section.
//// 4-Add in the last useEffect of general section, the loading variable from your new query.
//// 5-Add at the end, but before the return line, your own section where you will run your query
////   and you will set all necessaries local states for your use case and the table,
////   look at the Tracked Owners section as example.
//////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppContext } from "../../../AppContext";
import { Container } from "@material-ui/core";
import TableProvider from "./components/TableProvider";

import { useLazyQuery } from "@apollo/react-hooks";
import { WELLOWNERSQUERY } from "../../../graphQL/useQueryWellOwners";
import { VERTEXEDGESQUERY } from "../../../graphQL/useQueryVertexEdges";
import { OWNERSQUERY } from "../../../graphQL/useQueryOwners";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { CONTACTSQUERY } from "../../../graphQL/useQueryContacts";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: "10px"
  }
}));

////////////HeadCells begin///////////////////////////////////////////////
const OwnersHeadCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  {
    id: "ownershipType",
    numeric: false,
    disablePadding: false,
    label: "Entity"
  },
  { id: "interestType", numeric: false, disablePadding: false, label: "Type" },
  {
    id: "ownershipPercentage",
    numeric: true,
    disablePadding: false,
    label: "Interest"
  },
  {
    id: "appraisedValue",
    numeric: true,
    disablePadding: false,
    label: "Appraised Value"
  },
  { id: "comments", numeric: false, disablePadding: false, label: "" },
  { id: "tags", numeric: false, disablePadding: false, label: "" },
  { id: "isTracked", numeric: false, disablePadding: false, label: "" }
];

const WellsHeadCells = [
  { id: "api", numeric: false, disablePadding: false, label: "API" },
  { id: "wellName", numeric: false, disablePadding: false, label: "Well" },
  { id: "operator", numeric: false, disablePadding: false, label: "Operator" },
  { id: "wellType", numeric: false, disablePadding: false, label: "Type" },
  {
    id: "wellBoreProfile",
    numeric: false,
    disablePadding: false,
    label: "Profile"
  },
  { id: "ownerCount", numeric: true, disablePadding: false, label: "" },
  { id: "comments", numeric: false, disablePadding: false, label: "" },
  { id: "tags", numeric: false, disablePadding: false, label: "" },
  { id: "isTracked", numeric: false, disablePadding: false, label: "" }
];

const ContactsHeadCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  {
    id: "phone",
    numeric: false,
    disablePadding: false,
    label: "Phone"
  },
  {
    id: "openDealsAmount",
    numeric: false,
    disablePadding: false,
    label: "Open Deals Amount"
  },
  {
    id: "salesOwner",
    numeric: false,
    disablePadding: false,
    label: "Sales Owner"
  },
  {
    id: "createAt",
    numeric: false,
    disablePadding: false,
    label: "Create At"
  },
  { id: "comments", numeric: false, disablePadding: false, label: "" },
  { id: "tags", numeric: false, disablePadding: false, label: "" },
  { id: "isTracked", numeric: false, disablePadding: false, label: "" }
];

////////////HeadCells end///////////////////////////////////////////////

export default function Contacts(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [rows, setRows] = useState();
  const [header, setHeader] = useState(""); ////set it as "" for no header, and as null to higth the whole header row
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addAble, setAddAble] = useState(true);
  const [ownersColumn, setOwnersColumn] = useState(false);

  const [source, setSource] = useState(null);
  const [sourceId, setSourceId] = useState(stateApp.user.id);
  const [sourceLabel, setSourceLabel] = useState(null);
  const [edgeLabel, setEdgeLabel] = useState(null);
  const [targetLabel, setTargetLabel] = useState(null);

  ////////////Queries begin///////////////////////////////////////////////
  const [
    getVertexEdges,
    { loading: loadingGraph, data: dataGraph }
  ] = useLazyQuery(VERTEXEDGESQUERY);
  //////////
  const [
    getOwners,
    { loading: loadingOwners, data: dataOwners }
  ] = useLazyQuery(OWNERSQUERY);
  //////////
  const [getWells, { loading: loadingWells, data: dataWells }] = useLazyQuery(
    WELLSQUERY
  );
  //////////
  const [
    getWellOwners,
    { loading: loadingWellOwners, data: dataWellOwners }
  ] = useLazyQuery(WELLOWNERSQUERY);
  //////////
  const [
    getTrackedContacts,
    { loading: loadingTrackedContacts, data: dataTrackedContacts }
  ] = useLazyQuery(VERTEXEDGESQUERY);
  const [
    getContacts,
    { loading: loadingContacts, data: dataContacts }
  ] = useLazyQuery(CONTACTSQUERY);
  ////////////Queries end///////////////////////////////////////////////

  ////////////General begin///////////////////////////////////////////////
  useEffect(() => {
    if (!source) {
      setSource({
        sourceId: sourceId,
        label: sourceLabel,
        type: "vertex",
        properties: []
      });
    } else {
      getVertexEdges({
        variables: { source: source, edgeLabel, targetLabel }
      });
    }
  }, [stateApp.user, source]);

  useEffect(() => {
    setLoading(
      loadingGraph ||
        loadingOwners ||
        loadingContacts ||
        loadingWellOwners ||
        loadingTrackedContacts ||
        loadingWells
    );
  }, [
    loadingGraph,
    loadingOwners,
    loadingContacts,
    loadingTrackedContacts,
    loadingWellOwners,
    loadingWells
  ]);
  ////////////General end///////////////////////////////////////////////

  ////////////Tracked Owners begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "trackOwners") {
      // setSourceId(stateApp.user.id);
      setSourceLabel("user");
      setEdgeLabel("tracks");
      setTargetLabel("owner");
    }
  }, []);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "trackOwners" &&
      dataGraph &&
      dataGraph.vertexEdges.sourceIds &&
      dataGraph.vertexEdges.sourceIds.length > 0
    ) {
      getOwners({
        variables: {
          ownerIdArray: dataGraph.vertexEdges.sourceIds,
          authToken: stateApp.user.authToken
        }
      });
    }
  }, [stateApp.user, dataGraph]);

  useEffect(() => {
    if (props.parent && props.parent === "trackOwners") {
      if (dataOwners) {
        dataOwners.owners.results.forEach(owner => {
          if (
            dataGraph &&
            dataGraph.vertexEdges.sourceIds &&
            dataGraph.vertexEdges.sourceIds.length > 0
          ) {
            dataGraph.vertexEdges.sourceIds.forEach(sourceId => {
              if (owner.id === sourceId) {
                owner.isTracked = true;
              }
            });
          }
        });

        setRows(dataOwners.owners.results);
        setHeader("Owners");
        setColumns(OwnersHeadCells);
        setAddAble(true);
        setStateApp(state => ({
          ...state,
          owners: dataOwners.owners.results
        }));
      } else {
        setRows([]);
      }
    }
  }, [dataOwners]);
  ////////////Tracked Owners end///////////////////////////////////////////////

  ////////////Tracked Wells begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "trackWells") {
      setSourceLabel("user");
      setEdgeLabel("tracks");
      setTargetLabel("well");
    }
  }, []);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "trackWells" &&
      dataGraph &&
      dataGraph.vertexEdges.sourceIds &&
      dataGraph.vertexEdges.sourceIds.length > 0
    ) {
      getWells({
        variables: {
          wellIdArray: dataGraph.vertexEdges.sourceIds,
          authToken: stateApp.user.authToken
        }
      });
    }
  }, [stateApp.user, dataGraph]);

  useEffect(() => {
    if (props.parent && props.parent === "trackWells") {
      if (dataWells) {
        dataWells.wells.results.forEach(well => {
          if (
            dataGraph &&
            dataGraph.vertexEdges.sourceIds &&
            dataGraph.vertexEdges.sourceIds.length > 0
          ) {
            dataGraph.vertexEdges.sourceIds.forEach(sourceId => {
              if (well.id === sourceId) {
                well.isTracked = true;
              }
            });
          }
        });

        setRows(dataWells.wells.results);
        setHeader("Wells");
        setColumns(WellsHeadCells);
        setAddAble(false);
        setOwnersColumn(true);
        setStateApp(state => ({
          ...state,
          wells: dataWells.wells.results
        }));
      } else {
        setRows([]);
      }
    }
  }, [dataWells]);
  ////////////Tracked Wells end///////////////////////////////////////////////

  ////////////Owners Per Well begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "OwnersPerWell") {
      // setSourceId(stateApp.user.id);
      setSourceLabel("user");
      setEdgeLabel("tracks");
      setTargetLabel("well");
    }
  }, []);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "OwnersPerWell" &&
      dataGraph &&
      stateApp.selectedWell
    ) {
      getWellOwners({
        variables: { api: stateApp.selectedWell.api }
      });
    }
  }, [stateApp.user, dataGraph, stateApp.selectedWell]);

  useEffect(() => {
    if (props.parent && props.parent === "OwnersPerWell") {
      if (dataWellOwners && dataWellOwners.wellOwners) {
        dataWellOwners.wellOwners.forEach(wellOwner => {
          if (
            dataGraph &&
            dataGraph.vertexEdges.sourceIds &&
            dataGraph.vertexEdges.sourceIds.length > 0
          ) {
            dataGraph.vertexEdges.sourceIds.forEach(sourceId => {
              if (wellOwner.id === sourceId) {
                wellOwner.isTracked = true;
              }
            });
          }
        });

        setRows(dataWellOwners.wellOwners);
        setHeader(null);
        setColumns(OwnersHeadCells);
        setAddAble(true);
      } else {
        setRows([]);
      }
    }
  }, [dataWellOwners]);
  ////////////Owners Per Well end///////////////////////////////////////////////

  ////////////Contacts begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "Contacts") {
      setSourceLabel("user");
      setEdgeLabel("userContacts");
      setTargetLabel("contact");
    }
  }, []);
  /////temporary /////

  const ContactExample = {
    basic: {
      id: "1234",
      name: "James",
      lastName: "Sampleton",
      accounts: ["Widgetz.io (sample)"],
      emails: ["jamessampleton@gmail.com"],
      salesOwner: "Jacob Avery",
      phones: [
        { id: "Work", phone: "(473)-160-8265" },
        { id: "Mobile", phone: "1-926-555-9503" }
      ]
    },
    others: {
      jobTitle: "CEO",
      department: "Engineering",
      status: "Qualified Lead",
      doNotDisturb: "No",
      addres: "1552 camp st",
      zipcode: 92093,
      openDealsAmount: "$ 7,000.00",
      createAt: "11 days ago"
    }
  };

  useEffect(() => {
    if (props.parent && props.parent === "Contacts") {
      setRows([
        {
          id: ContactExample.basic.id,
          name: `${ContactExample.basic.name} ${ContactExample.basic.lastName}`,
          email: ContactExample.basic.emails[0],
          phone: ContactExample.basic.phones[0].phone,
          openDealsAmount: ContactExample.others.openDealsAmount,
          salesOwner: ContactExample.basic.salesOwner,
          createAt: ContactExample.others.createAt
        }
      ]);
      setHeader("Contacts");
      setColumns(ContactsHeadCells);
      setAddAble(false);
    }
  }, []);

  // useEffect(() => {
  //   if (
  //     props.parent &&
  //     props.parent === "Contacts" &&
  //     dataGraph &&
  //     dataGraph.vertexEdges.sourceIds &&
  //     dataGraph.vertexEdges.sourceIds.length > 0
  //   ) {
  //     getContacts({
  //       variables: {
  //         contactsIdArray: dataGraph.vertexEdges.sourceIds
  //       }
  //     });
  //   }
  // }, [stateApp.user, dataGraph]);

  // useEffect(() => {
  //   if (props.parent && props.parent === "Contacts") {
  //     if (!source) {
  //       setSource({
  //         sourceId: sourceId,
  //         label: sourceLabel,
  //         type: "vertex",
  //         properties: []
  //       });
  //     } else {
  //       getTrackedContacts({
  //         variables: { source: source, edgeLabel: "tracks", targetLabel }
  //       });
  //     }
  //   }
  // }, [dataContacts]);

  // useEffect(() => {
  //   if (props.parent && props.parent === "Contacts") {
  //     if (dataContacts) {
  //       dataContacts.contacts.results.forEach(contact => {
  //         if (
  //           dataTrackedContacts &&
  //           dataTrackedContacts.vertexEdges.sourceIds &&
  //           dataTrackedContacts.vertexEdges.sourceIds.length > 0
  //         ) {
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
  //       setAddAble(false);
  //     } else {
  //       setRows([]);
  //     }
  //   }
  // }, [dataTrackedContacts]);

  /////temporary end/////

  ////////////Contacts end///////////////////////////////////////////////

  return (
    <Container maxWidth="xl" className={classes.container}>
      <TableProvider
        header={header}
        columns={columns}
        rows={rows}
        loading={loading}
        addAble={addAble}
        targetLabel={targetLabel}
        ownersColumn={ownersColumn}
      />
    </Container>
  );
}
