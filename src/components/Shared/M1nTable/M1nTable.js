////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                TO USE THIS TABLE:
//// 1-Send to this component a prop called 'parent' with a trackOwners/trackWells/Contacts/OwnersPerWell...
////  -if it is OwnersPerWell use case add another prop "selectedWell" with the well
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                TO USE THIS TABLE IN A NEW USE CASE:
//// 1-Send to this component a prop called 'parent' with a string you choose to identify your use case.
//// 2-Define your HeadCells const, for your columns, in the HeadCells section.
//// 3-Add your query in the queries section.
//// 4-Add at the end, but before the return line, add your own section where you will run your queries
////   and you will set all necessaries local states for your use case and the table,
////   look at the Tracked Owners section as example.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
import { TRACKSBYUSERANDOBJECTTYPE } from "../../../graphQL/useQueryTracksByUserAndObjectType";
import { USERBYEMAIL } from "../../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed

const useStyles = makeStyles((theme) => ({
  container: { padding: "0 !important" },
}));

////////////HeadCells begin///////////////////////////////////////////////
const OwnersHeadCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  {
    id: "ownershipType",
    numeric: false,
    disablePadding: false,
    label: "Entity",
  },
  { id: "interestType", numeric: false, disablePadding: false, label: "Type" },
  {
    id: "ownershipPercentage",
    numeric: true,
    disablePadding: false,
    label: "Interest",
  },
  {
    id: "appraisedValue",
    numeric: true,
    disablePadding: false,
    label: "Appraised Value",
    money: true,
  },
  { id: "contacts", numeric: false, disablePadding: false, label: "" },
  { id: "comments", numeric: false, disablePadding: false, label: "" },
  { id: "tags", numeric: false, disablePadding: false, label: "" },
  { id: "isTracked", numeric: false, disablePadding: false, label: "" },
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
    label: "Profile",
  },
  { id: "ownerCount", numeric: true, disablePadding: false, label: "" },
  { id: "comments", numeric: false, disablePadding: false, label: "" },
  { id: "tags", numeric: false, disablePadding: false, label: "" },
  { id: "isTracked", numeric: false, disablePadding: false, label: "" },
];

const ContactsHeadCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  {
    id: "phone",
    numeric: false,
    disablePadding: false,
    label: "Phone",
  },
  {
    id: "openDealsAmount",
    numeric: false,
    disablePadding: false,
    label: "Open Deals Amount",
    money: true,
  },
  {
    id: "salesOwner",
    numeric: false,
    disablePadding: false,
    label: "Sales Owner",
  },
  {
    id: "createAt",
    numeric: false,
    disablePadding: false,
    label: "Create At",
  },
  { id: "owners", numeric: false, disablePadding: false, label: "" },
  { id: "comments", numeric: false, disablePadding: false, label: "" },
  { id: "tags", numeric: false, disablePadding: false, label: "" },
  { id: "isTracked", numeric: false, disablePadding: false, label: "" },
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
  const [
    getVertexEdges,
    { loading: loadingGraph, data: dataGraph },
  ] = useLazyQuery(VERTEXEDGESQUERY);
  //////////
  const [
    getOwners,
    { loading: loadingOwners, data: dataOwners },
  ] = useLazyQuery(OWNERSQUERY);
  //////////
  const [getWells, { loading: loadingWells, data: dataWells }] = useLazyQuery(
    WELLSQUERY
  );
  //////////
  const [
    getWellOwners,
    { loading: loadingWellOwners, data: dataWellOwners },
  ] = useLazyQuery(WELLOWNERSQUERY);
  //////////
  const [
    tracksByUserAndObjectType,
    { loading: loadingTracks, data: dataTracks },
  ] = useLazyQuery(TRACKSBYUSERANDOBJECTTYPE);
  //////////
  const [
    getTrackedContacts,
    { loading: loadingTrackedContacts, data: dataTrackedContacts },
  ] = useLazyQuery(VERTEXEDGESQUERY);
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
        dataOwners.owners.results.length > 0
      ) {
        const owners = dataOwners.owners.results.map((owner) => ({
          ...owner,
          isTracked: true,
        }));
        setRows(owners);
        setHeader("Owners");
        setColumns(OwnersHeadCells);
        setAddAble(true);
        setStateApp((state) => ({
          ...state,
          owners,
        }));
      } else {
        setRows([]);
      }
      setLoading(false);
    }
  }, [dataOwners]);
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
        dataWells.wells.results.length > 0
      ) {
        const wells = dataWells.wells.results.map((well) => ({
          ...well,
          isTracked: true,
        }));

        setRows(wells);
        setHeader("Wells");
        setColumns(WellsHeadCells);
        setAddAble(false);
        setStateApp((state) => ({
          ...state,
          wells,
        }));
      } else {
        setRows([]);
      }
      setLoading(false);
    }
  }, [dataWells]);
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
        dataWellOwners.wellOwners.forEach((wellOwner) => {
          wellOwner.isTracked = false;
          dataTracks.tracksByUserAndObjectType.forEach((track) => {
            if (wellOwner.id === track.trackOn) {
              wellOwner.isTracked = true;
            }
          });
        });

        setRows(dataWellOwners.wellOwners);
        setHeader("Owners Per Well");
        setColumns(OwnersHeadCells);
        setAddAble(true);
      } else {
        setRows([]);
      }
      setLoading(false);
    }
  }, [dataWellOwners, dataTracks]);
  ////////////Owners Per Well end///////////////////////////////////////////////

  ////////////Contacts begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "Contacts") {
      setTargetLabel("contact");
    }
  }, []);
  /////temporary /////

  const ContactExample = {
    id: "1234",
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
    openDealsAmount: "7000",
    createAt: "11 days ago",
  };

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "Contacts" &&
      dataTracks &&
      dataTracks.tracksByUserAndObjectType
    ) {
      setRows([
        {
          id: ContactExample.id,
          name: `${ContactExample.name} ${ContactExample.lastName}`,
          email: ContactExample.email,
          phone: ContactExample.mobilePhone,
          openDealsAmount: ContactExample.openDealsAmount,
          salesOwner: ContactExample.salesOwner,
          createAt: ContactExample.createAt,
          isTracked:
            dataTracks.tracksByUserAndObjectType.length !== 0 &&
            dataTracks.tracksByUserAndObjectType[0].trackOn ===
              ContactExample.id,
        },
      ]);
      setHeader("Contacts");
      setColumns(ContactsHeadCells);
      setAddAble({
        externalAdd: true,
        externalAddFunction: props.externalAddFunction,
      });
      setLoading(false);
    }
  }, [dataTracks]);

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
