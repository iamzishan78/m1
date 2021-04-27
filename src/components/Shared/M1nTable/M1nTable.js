
import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

// context
import { AppContext } from "../../../AppContext";
import { MapGridContext } from "../../../components/MapGridCard/MapGridContext.js";



import { Container } from "@material-ui/core";
import Table from "./components/Table";


// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";
import { WELLOWNERSQUERY } from "../../../graphQL/useQueryWellOwners";
import { OWNERSQUERY } from "../../../graphQL/useQueryOwners";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { PAGINATEDCONTACTSQUERY } from "../../../graphQL/useQueryPaginatedContacts";
import { CONTACTSFILTEROPTIONS } from "../../../graphQL/useQueryContactsFilterOptions";
import { UPDATEMAILERSTATUSES } from "../../../graphQL/useMutationUpdateMailerStatuses";
import { TRACKSBYOBJECTTYPE } from "../../../graphQL/useQueryTracksByObjectType";
import { TRACKSWELL } from "../../../graphQL/useQueryTracksWell"
import { TAGSAMPLES } from "../../../graphQL/useQueryTagSamples";
import { COMMENTSCOUNTER } from "../../../graphQL/useQueryCommentsCounter";
import { OWNERSWELLSQUERY } from "../../../graphQL/useQueryOwnersWells";
import { ABSTRACTWELLGEOQUERY } from "../../../graphQL/useQueryAbstractWellGeo";
import { GETUSERS } from "../../../graphQL/useQueryGetUsers";
import { CUSTOMLAYER } from "../../../graphQL/useQueryCustomLayer";
import { REMOVECONTACT } from "../../../graphQL/useMutationRemoveContact";
import { REMOVEUSER } from "../../../graphQL/useMutationRemoveUser";
import { UPDATECONTACT } from "../../../graphQL/useMutationUpdateContact";
import { UPDATETRANSACTION } from "../../../graphQL/useMutationUpdateTransaction";
import { PARCELOWNERSQUERY } from "../../../graphQL/useQueryParcelOwners";
import { UPDATEPARCELOWNER } from "../../../graphQL/useMutationUpdateParcelOwner";
import { MELISSARECORDSCOUNTBYIDS } from "../../../graphQL/useQueryGetMelissaRecords";
import { CONTACTDEALS } from "../../../graphQL/useQueryContactDeals";
import { CONTACTPARCELINTERESTS } from "../../../graphQL/useQueryContactParcelInterests";
import { IFARECONTACTS } from "../../../graphQL/useQueryIfOwnersAreContacts";
import { OWNER_WELLINTERESTS } from "../../../graphQL/useQueryOwner_WellInterests";
import { PAGINATEDWELLINTERESTSQUERY } from "../../../graphQL/useQueryPaginatedWellInterests.js";
import { WELLINTERESTSFILTEROPTIONS } from "../../../graphQL/useQueryWellInterestsFilterOptions";
import { SHAPEWELLS } from "../../../graphQL/useQueryPaginatedShapeWells";
import { SHAPEWELLSCOUNT } from "../../../graphQL/useQueryShapeWellsCount";
import { CONTACTWELLS } from "../../../graphQL/useQueryContactWells";

import { useDispatch, useSelector } from "react-redux";
import { deepEqual, deepEqualObjects, setStateIfDeepEqual } from "../functions";
import RightDialog from "../../ContactDetailCard/components/RightDialog";
import AddDealDialog from "../../ContactDetailCard/components/AddDealDialog";
import AddWellInterestDialog from "../../ContactDetailCard/components/ContactsWellInterestsParcelInterests/components/AddWellInterestDialog";
import { setMapGridCardState, showWarningMessage } from "../../../actions";

// Header Schemas 
import ContactsHeadCells from '../constants/contacts-header-schema.js'
import DocumentsHeadCells from '../constants/documents-header-schema'
import WellsHeadCells from '../constants/well-header-schema.js'
import TrackedOwnersHeadCells from '../constants/track-owners-header-schema.js'
import CustomWellsHeadCells from '../constants/custom-wells-header-schema.js'
import OwnersPerWellHeadCells from '../constants/ownersperwell-header-schema.js'
import SearchsHeadCells from '../constants/search-header-schema.js'
import OwnersPerContactsHeadCells from '../constants/ownerspercontacts-header-schema.js'
import OwnersPerParcelHeadCells from '../constants/ownersperparcel-header-schema.js'
import UserManagementHeadCells from '../constants/user-management-header-schema.js'
import DealsHeadCells from '../constants/deals-header-schema.js'
import TransactDealsHeadCells from '../constants/transact-header-schema.js'
import ActivitiesHeadCells from '../constants/activities-header-schema.js'
import ParcelInterestsPerContactHeadCells from '../constants/parcel-interests-per-contact-header-schema.js'
import WellInterests from '../constants/well-interests-schema.js'
import ProductionDetailsHeaders from '../constants/production-detail-header-schema.js'
import ContactWellHeadCells from '../constants/contactperwell-header-schema.js'

// import value formatters 
import ticksToDateString from "../../Shared/valueformatters/ticks-to-string.js";
import { gql, useQuery } from '@apollo/client';

const GET_Documents = gql`
  query getFileDescriptors  {
     getFileDescriptors{
      fileName
      fileState
      fileUrl
      fileId
      userName
      dateTime
      descriptorId
    }
}
`;

const useStyles = makeStyles((theme) => ({
  container: { 
    padding: "0 !important" 
},
}));



function M1nTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // contexts
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateGrid, setStateGrid] = useContext(MapGridContext);
  const { loading: DocumentLoading, error, data: DocumentsData } = useQuery(GET_Documents);
 console.log(DocumentsData, 'DocumentsData')
  // function states 
  const [addDealOpen, setAddDealOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState();
  const [rows, Rows] = useState([]);
  const setRows = (newState) => {setStateIfDeepEqual(Rows, newState);};
  const [total, Total] = useState(false);
  const setTotal = (newState) => {setStateIfDeepEqual(Total, newState);};
  const [header, Header] = useState("");
  const setHeader = (newState) => {setStateIfDeepEqual(Header, newState);};
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => {setStateIfDeepEqual(Columns, newState);};
  const [columnsBase, ColumnsBase] = useState([]);
  const setColumnsBase = (newState) => {setStateIfDeepEqual(ColumnsBase, newState);};
  const [loading, Loading] = useState(true);
  const setLoading = (newState) => {setStateIfDeepEqual(Loading, newState);};
  const [addAble, AddAble] = useState(true);
  const setAddAble = (newState) => {setStateIfDeepEqual(AddAble, newState);};
  const [uploadIcon, UploadIcon] = useState(null);
  const setUploadIcon = (newState) => {setStateIfDeepEqual(UploadIcon, newState);};
  const [targetLabel, TargetLabel] = useState(null);
  const setTargetLabel = (newState) => {setStateIfDeepEqual(TargetLabel, newState);};
  const [targetLabelToExpand, TargetLabelToExpand] = useState(null);
  const setTargetLabelToExpand = (newState) => {setStateIfDeepEqual(TargetLabelToExpand, newState);};
  const [deleteFunc, setDeleteFunc] = useState(null);
  const [showTracks, ShowTracks] = useState(true);
  const setShowTracks = (newState) => {setStateIfDeepEqual(ShowTracks, newState);};
  const [orderByTracks, OrderByTracks] = useState(true);
  const setOrderByTracks = (newState) => {setStateIfDeepEqual(OrderByTracks, newState);};
  const [startPaginationAt, StartPaginationAt] = useState();
  const setStartPaginationAt = (newState) => {setStateIfDeepEqual(StartPaginationAt, newState);};
  const [viewportFeatures, ViewportFeatures] = useState(null);
  const setViewportFeatures = (newState) => {setStateIfDeepEqual(ViewportFeatures, newState);};
  const [warningShowed, WarningShowed] = useState(false);
  const setWarningShowed = (newState) => {setStateIfDeepEqual(WarningShowed, newState);};
  const [dataContacts, DataContacts] = useState(null);
  const setDataContacts = (newState) => {setStateIfDeepEqual(DataContacts, newState);};
  const [dataWellInterests, DataWellInterests] = useState(null);
  const setDataWellInterests = (newState) => {setStateIfDeepEqual(DataWellInterests, newState);};
  const [dataTracks, DataTracks] = useState(null);
  const setDataTracks = (newState) => {setStateIfDeepEqual(DataTracks, newState);};
  const [selectedYear, setSelectedYear] = useState(2020)  // production selected year state 

  // selectors
  const {searchloading,searchResultData,selectedOwnerWellIntsSummary,} = useSelector(({ MapGridCard }) => MapGridCard);


  // queries 
  const [tracksByObjectType, { data: constDataTracks }] = useLazyQuery(TRACKSBYOBJECTTYPE,{fetchPolicy: "cache-and-network",});
  const [tracksWell, { data: dataWellTracks }] = useLazyQuery(TRACKSWELL,{fetchPolicy: "cache-and-network",});
  const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(COMMENTSCOUNTER,{fetchPolicy: "cache-and-network",});
  const [getTagSamples, { data: dataTagSamples }] = useLazyQuery(TAGSAMPLES, {fetchPolicy: "cache-and-network",});
  const [getOwners, { data: dataOwners }] = useLazyQuery(OWNERSQUERY, {fetchPolicy: "cache-and-network",});
  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  const [getPaginatedShapeWells, { data: dataShapeWells }] = useLazyQuery(SHAPEWELLS, {fetchPolicy: "cache-and-network",});
  const [getShapeWellsCount, { data: dataShapeWellsCount }] = useLazyQuery(SHAPEWELLSCOUNT, {fetchPolicy: "cache-and-network",});
  const [getWellOwners, { data: dataWellOwners }] = useLazyQuery(WELLOWNERSQUERY);
  const [getContactWells, { data: dataContactWells }] = useLazyQuery(CONTACTWELLS);
  const [getAllUsers, { data: userLists }] = useLazyQuery(GETUSERS, {fetchPolicy: "cache-and-network",});
  const [removeUser] = useMutation(REMOVEUSER);
  const [getPaginatedContacts, { data: constDataContacts }] = useLazyQuery(PAGINATEDCONTACTSQUERY,{fetchPolicy: "no-cache",});
  const [getContactsFilterOptions,{ data: dataContactsFilterOptions },] = useLazyQuery(CONTACTSFILTEROPTIONS, {fetchPolicy: "cache-and-network",});
  const [updateMailerStatuses] = useMutation(UPDATEMAILERSTATUSES);
  const [getContactDeals, { data: dataDeals }] = useLazyQuery(CONTACTDEALS, {fetchPolicy: "cache-and-network",});
  const [removeContact] = useMutation(REMOVECONTACT);
  const [updateContact] = useMutation(UPDATECONTACT);
  const [updateTransaction] = useMutation(UPDATETRANSACTION);
  const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);
  const [getParcelOwners, { data: dataParcelOwners }] = useLazyQuery(PARCELOWNERSQUERY);
  const [updateParcelOwner] = useMutation(UPDATEPARCELOWNER);
  const [getMelissaRowsCount, { data: dataMelissaRowsCount }] = useLazyQuery(MELISSARECORDSCOUNTBYIDS,{fetchPolicy: "cache-and-network",});
  const [getContactParcelInterests,{ data: dataContactParcelInterests },] = useLazyQuery(CONTACTPARCELINTERESTS, {fetchPolicy: "cache-and-network",});
  const [checkIfOwnersAreContacts,{ data: checkIfOwnersAreContactsData },] = useLazyQuery(IFARECONTACTS, {fetchPolicy: "cache-and-network",});
  const [getAbstractWellGeo, { data: abstractWellData }] = useLazyQuery(ABSTRACTWELLGEOQUERY);
  const [getPaginatedWellInterests,{ data: constDataWellInterests },] = useLazyQuery(PAGINATEDWELLINTERESTSQUERY, {fetchPolicy: "cache-and-network",});
  const [getWellInterestsFilterOptions,{ data: dataWellInterestsFilterOptions },] = useLazyQuery(WELLINTERESTSFILTEROPTIONS, {fetchPolicy: "cache-and-network",});


  ////////////General begin///////////////////////////////////////////////

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

  useEffect(() => {
    if (
      props.parent &&
      constDataTracks &&
      constDataTracks.tracksByObjectType
    ) {
      if (constDataTracks.tracksByObjectType.length !== 0) {
        const tracksIdArray = constDataTracks.tracksByObjectType.map(
          (track) => track.trackOn
        );

        setDataTracks(tracksIdArray);
        // setRows(tracksIdArray);
        // setLoading(false);

      } 
    }
  }, [constDataTracks]);

  ////////////General end///////////////////////////////////////////////

  ////////////Tracked Owners begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "trackOwners") {
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
      dataTracks
    ) {
      if (dataTracks.length !== 0) {
        // setLoading(true);

        getOwners({
          variables: {
            ownerIdArray: dataTracks,
          },
        });
        getCommentsCounter({
          variables: {
            objectsIdsArray: dataTracks,
            userId: stateApp.user.mongoId,
          },
        });
        getTagSamples({
          variables: {
            objectsIdsArray: dataTracks,
            userId: stateApp.user.mongoId,
          },
        });
        checkIfOwnersAreContacts({
          variables: { idsArray: dataTracks },
        });
      } else {
        setRows([]);
        setLoading(false);
      }
    }
  }, [dataTracks]);

  useEffect(() => {
    if (props.parent && (props.parent === "trackOwners" || props.parent === "gridOwners") && dataOwners) {
      if (
        dataOwners.owners &&
        dataOwners.owners.length > 0 &&
        dataCommentsCounter &&
        dataCommentsCounter.commentsCounter &&
        dataTagSamples &&
        dataTagSamples.tagSamples &&
        checkIfOwnersAreContactsData &&
        checkIfOwnersAreContactsData.ifAreContacts
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
          gridOwnersCount: owners.length,
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
      setTargetLabel("well");
      if (props.header) {
        setHeader(props.header);
      } else {
        setHeader("Wells");
      }
      setAddAble(false);
    }
  }, [props.parent, props.header]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "trackWells" &&
      dataTracks
    ) {
      if (dataTracks.length !== 0) {
        getWells({
          variables: {
            wellIdArray: dataTracks,
          },
        });
        getCommentsCounter({
          variables: {
            objectsIdsArray: dataTracks,
            userId: stateApp.user.mongoId,
          },
        });
        getTagSamples({
          variables: {
            objectsIdsArray: dataTracks,
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
    if (dataWells?.wells)
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

            for (
              let i = 0;
              i < dataCommentsCounter.commentsCounter.length;
              i++
            ) {
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

  ////////////Grid Wells begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "gridWells") {
      getPaginatedShapeWells({
        variables: {
          polygon: stateApp.gridPolygonString,
          userId: stateApp.user.mongoId,
        },
      });
      getShapeWellsCount({
        variables: {
          polygon: stateApp.gridPolygonString,
        },
      });
      setTargetLabel("well");
      setHeader(props.header);
      setAddAble(false);
    }
  }, [props.parent]);

  useEffect(() => {
    if (
      props.parent && props.parent === "gridWells" &&
      dataShapeWells && dataShapeWells.paginatedShapeWells
    ) {
      let wells = [...dataShapeWells.paginatedShapeWells.edges.map(
        (el) => el.node
      )];

      const objectsIdsArray = dataShapeWells.paginatedShapeWells.edges.map(
        (well) => well.node.id
      );
      getCommentsCounter({
        variables: {
          objectsIdsArray: objectsIdsArray,
          userId: stateApp.user.mongoId,
        },
      });
      getTagSamples({
        variables: {
          objectsIdsArray: objectsIdsArray,
          userId: stateApp.user.mongoId,
        },
      });
      
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

        well.isTracked = false;
        well.commentsCounter = 0;
        well.tags = [[], 0];
        return well;
      });

      const cleanAvailableTags = []; // get from backend

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
        gridWellsCount: wells.length,
      }));
      setLoading(false);
    }
  }, [dataShapeWells]);

  useEffect(() => {
    if (
      props.parent && props.parent === "gridWells" &&
      constDataTracks && constDataTracks.tracksByObjectType &&
      dataShapeWells && dataShapeWells.paginatedShapeWells &&
      dataCommentsCounter && dataCommentsCounter.commentsCounter &&
      dataTagSamples && dataTagSamples.tagSamples
    ) {
      let wells = rows;
      wells = wells.map((w) => {
        let well = { ...w };

        well.isTracked = false;
        well.commentsCounter = 0;
        well.tags = [[], 0];

        for (let i = 0; i < constDataTracks.tracksByObjectType.length; i++) {
          if (well.id === constDataTracks.tracksByObjectType[i].trackOn) {
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

      setRows(wells);
      setLoading(false);
    }
  }, [dataShapeWells, dataTracks, dataCommentsCounter, dataTagSamples]);
  ////////////Grid Wells end///////////////////////////////////////////////

  ////////////Contact Wells begin///////////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "assocTaxRollInterests") {
      getContactWells({
        variables: {
          contactId: props.contactId,
        },
      });
      setTargetLabel("well");
      setHeader(props.header);
      setAddAble({ type: "wellInterest" });
    }
  }, [props.parent]);

  useEffect(() => {
    if (
      props.parent && props.parent === "assocTaxRollInterests" &&
      dataContactWells && dataContactWells.contactWells
    ) {

      let wells = dataContactWells.contactWells;
      const objectsIdsArray = wells.map(
        (well) => well.wellId
      );
      getCommentsCounter({
        variables: {
          objectsIdsArray: objectsIdsArray,
          userId: stateApp.user.mongoId,
        },
      });
      getTagSamples({
        variables: {
          objectsIdsArray: objectsIdsArray,
          userId: stateApp.user.mongoId,
        },
      });
      
      wells = wells.map((w) => {
        let well = { ...w };

        well.detailCard = well.wellId;
        well.isTracked = false;
        well.commentsCounter = 0;
        well.tags = [[], 0];
        return well;
      });

      setRows(wells);

      const cleanAvailableTags = []; // get from backend
      setColumns([
        ...(cleanAvailableTags.length > 0
          ? ContactWellHeadCells.map((column) => {
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
          : ContactWellHeadCells.map((column) => {
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
        //flyToColumn,
      ]);
      setLoading(false);
    }
  }, [dataContactWells]);

  useEffect(() => {
    if (
      props.parent && props.parent === "assocTaxRollInterests" &&
      constDataTracks && constDataTracks.tracksByObjectType &&
      dataContactWells && dataContactWells.contactWells &&
      dataCommentsCounter && dataCommentsCounter.commentsCounter &&
      dataTagSamples && dataTagSamples.tagSamples
    ) {
      let wells = dataContactWells.contactWells;
      wells = wells.map((w) => {
        let well = { ...w };

        well.detailCard = well.wellId;
        well.isTracked = false;
        well.commentsCounter = 0;
        well.tags = [[], 0];

        for (let i = 0; i < constDataTracks.tracksByObjectType.length; i++) {
          if (well.wellId === constDataTracks.tracksByObjectType[i].trackOn) {
            well.isTracked = true;
            break;
          }
        }
        for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
          if (well.wellId === dataCommentsCounter.commentsCounter[i]._id) {
            well.commentsCounter =
              dataCommentsCounter.commentsCounter[i].total;
            break;
          }
        }
        for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
          if (well.wellId === dataTagSamples.tagSamples[i]._id) {
            well.tags = [
              dataTagSamples.tagSamples[i].tags,
              dataTagSamples.tagSamples[i].total,
            ];

            break;
          }
        }
        return well;
      });

      setRows(wells);
      setLoading(false);
    }
  }, [dataContactWells, dataTracks, dataCommentsCounter, dataTagSamples]);
  ////////////Contact Wells end///////////////////////////////////////////////

  ////////////Wells Per Owner begin///////////////////////////////////////////

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "WellsPerOwner" &&
      props.wellsIdsArray &&
      stateApp.user &&
      stateApp.user.mongoId
    ) {
      setTargetLabel("well");
      setHeader("Wells");
      setAddAble(false);
      getWells({
        variables: {
          wellIdArray: props.wellsIdsArray,
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
      if (
        dataWells.wells &&
        dataWells.wells.results &&
        dataWells.wells.results.length > 0 &&
        dataCommentsCounter &&
        dataCommentsCounter.commentsCounter &&
        dataTagSamples &&
        dataTagSamples.tagSamples &&
        dataTracks
      ) {
        dataWells.wells.results.forEach((well) => {
          well.isTracked = false;
          well.commentsCounter = 0;
          well.tags = [[], 0];

          for (let i = 0; i < dataTracks.length; i++) {
            if (well.id === dataTracks[i]) {
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
      setTargetLabel("owner");
      setHeader("Tax Roll Ownership");
      setAddAble(false);
      getWellOwners({
        variables: {
          id: props.selectedWell.id,
          selectedYear: selectedYear.toString()
        },
      });
    }
  }, [props.selectedWell, selectedYear]);

  useEffect(() => {
    if (props.parent && props.parent === "OwnersPerWell" && dataWellOwners) {
      if (dataWellOwners.wellOwners && dataWellOwners.wellOwners.length > 0) {
        
        console.log('data wells owners',dataWellOwners )
        
        setLoading(true);
        const objectsIdsArray = dataWellOwners.wellOwners.map(
          (wellOwner) => wellOwner.globalOwnerId
        );
        getCommentsCounter({
          variables: { objectsIdsArray, userId: stateApp.user.mongoId },
        });
        getTagSamples({
          variables: { objectsIdsArray, userId: stateApp.user.mongoId },
        });
        checkIfOwnersAreContacts({
          variables: { idsArray: objectsIdsArray },
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
      dataTracks &&
      checkIfOwnersAreContactsData &&
      checkIfOwnersAreContactsData.ifAreContacts
    ) {
      const wellOwners = dataWellOwners.wellOwners.map((o) => {
        let wellOwner = { ...o };
        wellOwner.commentsCounter = 0;
        wellOwner.tags = [[], 0];
        wellOwner.wellsCounter = [];
        wellOwner.isTracked = false;

        for (
          let i = 0;
          i < checkIfOwnersAreContactsData.ifAreContacts.length;
          i++
        ) {
          if (
            wellOwner.globalOwnerId ===
            checkIfOwnersAreContactsData.ifAreContacts[i].globalOwner
          ) {
            wellOwner.isContact =
              checkIfOwnersAreContactsData.ifAreContacts[i].isContact;

            wellOwner.entity =
              checkIfOwnersAreContactsData.ifAreContacts[i]._id;
            break;
          }
        }

        for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
          if (
            wellOwner.globalOwnerId ===
            dataCommentsCounter.commentsCounter[i]._id
          ) {
            wellOwner.commentsCounter =
              dataCommentsCounter.commentsCounter[i].total;
            break;
          }
        }

        for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
          if (wellOwner.globalOwnerId === dataTagSamples.tagSamples[i]._id) {
            wellOwner.tags = [
              dataTagSamples.tagSamples[i].tags,
              dataTagSamples.tagSamples[i].total,
            ];

            break;
          }
        }

        for (let i = 0; i < dataTracks.length; i++) {
          if (
            wellOwner.globalOwnerId === dataTracks[i]
          ) {
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
    checkIfOwnersAreContactsData,
    dataTracks,
  ]);

  ////////////Owners Per Well end///////////////////////////////////////////////






  
  ////////////"detail-well-card-contact-ties" begin///////////////////////////////////////////////









  ////////////Contacts begin///////////////////////////////////////////////

  useEffect(() => {
    // this use effect appears to kick off the contacts workflow in the table 

    if (    
            props.parent  
            && (props.parent === "Contacts")  // for parent of contact screen 
        ) {
          setLoading(true);
          setTargetLabel("contact");
          setHeader("Contacts");
          setOrderByTracks(false);
          setAddAble({ parent: false, type: "contact" });
          getPaginatedContacts({variables: { search: stateGrid.gridSearchTarget }});
          getContactsFilterOptions();
          updateMailerStatuses({ variables: { userId: stateApp.user.mongoId } });
          setUploadIcon(true);
          setStartPaginationAt(25);
          setColumnsBase(ContactsHeadCells);
        }

      else  if (    
          props.parent  
          && (props.parent ==='search' && props.targetLabel === "contacts")  // for parent of contact screen              
      ) {
        setLoading(true);
        setTargetLabel("contact");
        setHeader("Contacts");
        setOrderByTracks(false);
        setAddAble({ parent: false, type: "contact" });
        getPaginatedContacts({variables: { search: stateGrid.gridSearchTarget }});
        getContactsFilterOptions();
        updateMailerStatuses({ variables: { userId: stateApp.user.mongoId } });
        setUploadIcon(false);
        setStartPaginationAt(25);
        setColumnsBase(ContactsHeadCells);

      } 
      else if (    
        props.parent  
        && (props.parent === "Documents")  // for parent of contact screen 
    ) {
      setLoading(true);
      setTargetLabel("documents");
      setHeader("Documents");
      setOrderByTracks(false);
      setAddAble({ parent: false, type: "document" });
      getPaginatedContacts({variables: { search: stateGrid.gridSearchTarget }});
      getContactsFilterOptions();
      updateMailerStatuses({ variables: { userId: stateApp.user.mongoId } });
      setUploadIcon(true);
      setStartPaginationAt(25);
      setColumnsBase(DocumentsHeadCells);}
    

  }, [props.parent,
      stateGrid.gridSearchTarget]);




      useEffect(() => {
        if (props.parent && props.parent === "detail-well-card-contact-ties") {
          setLoading(true);
          setTargetLabel("contact");
          setHeader("Contacts");
          setOrderByTracks(false);
          setAddAble({ parent: false, type: "contact" });    
          // getPaginatedContacts({variables: { search: "jacob" }});
          // getContactsFilterOptions();
          // updateMailerStatuses({ variables: { userId: stateApp.user.mongoId } });
          // setUploadIcon(false);
          setStartPaginationAt(25);
          setColumnsBase(ContactsHeadCells);
        }
      }, [props.selectedWell, selectedYear]);
    
    
    



  useEffect(() => {
    if (

      props.parent 
      && constDataContacts 
      && (
                 (props.parent === "Contacts")  // for parent of contact screen 
              || (props.parent ==='search' && props.targetLabel === "contacts") // for parent of search grid 
              || (props.parent === "detail-well-card-contact-ties") // for parent of detail well card 
              ||  (props.parent === "Documents")
              ) 
    ) {

      if (columns.length === 0) {
        setColumns(
          columnsBase.map((column) => {
            switch (column.name) {
              default:
                return column;
            }
          })
        );
      }
    // } else {
    //   setLoading(false);
    // }

      if (
        constDataContacts?.paginatedContacts?.edges &&
        constDataContacts.paginatedContacts.edges.length > 0
      ) {
        let tmpDataContacts = {
          ...constDataContacts,
          paginatedContacts: {
            ...constDataContacts.paginatedContacts,
            edges: [
              ...constDataContacts.paginatedContacts.edges.map((edge) => {
                return {
                  ...edge,
                  node: {
                    ...edge.node,
                    isTracked: false,
                  },
                };
              }),
            ],
          },
        };

        // this initial load is to make the grid appear more performantly 
        // the descriptors come in a later use effect 
        setDataContacts(tmpDataContacts);
        setRows([
          ...tmpDataContacts.paginatedContacts.edges.map((el) => el.node),
        ]);
        setLoading(false);
      } else {
        setLoading(false);
        setRows([]);
      }
    
    }
  }, [
    constDataContacts,
  ]);


  useEffect(() => {
    if (
      props.parent
      && ((props.parent === "Contacts")  // for parent of contact screen 
            || (props.parent ==='search' && props.targetLabel === "contacts")) // for grid card on map 
      && dataContacts?.paginatedContacts?.edges
      && dataContacts?.paginatedContacts?.edges.length > 0
    ) {
      const objectsIdsArray = [];
      dataContacts.paginatedContacts.edges.forEach(({ node }) => {
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
    }
  }, [dataContacts]);




  useEffect(() => {
    if (
      props.parent
      && ((props.parent === "Contacts")  // for parent of contact screen 
            || (props.parent ==='search' && props.targetLabel === "contacts")) // for grid card on map 
      && dataContactsFilterOptions
    ) {
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
        let filterContactOwner = [
          ...dataContactsFilterOptions.contactsFilterOptions.contactOwner.map(
            (contactOwner) => {
              return contactOwner._id;
            }
          ),
        ];

        setColumns(
          columnsBase.map((column) => {
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

              case "contactOwner":
                return {
                  ...column,
                  options: {
                    ...column.options,
                    filterOptions: {
                      ...column.options.filterOptions,
                      names: filterContactOwner,
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
  }, [dataContactsFilterOptions, columnsBase]);

  useEffect(() => {
    if (
      props.parent
      && ((props.parent === "Contacts")  // for parent of contact screen 
            || (props.parent ==='search' && props.targetLabel === "contacts")) // for grid card on map 
      && dataContacts &&
      dataContacts.paginatedContacts.edges &&
      dataContacts.paginatedContacts.edges.length > 0 &&
      dataCommentsCounter &&
      dataCommentsCounter.commentsCounter &&
      dataTagSamples &&
      dataTagSamples.tagSamples &&
      dataMelissaRowsCount &&
      dataMelissaRowsCount.getMelissaRecordsCountForContactIds
    ) {
      let tmpDataContacts = {
        ...dataContacts,
        paginatedContacts: {
          ...dataContacts.paginatedContacts,
          edges: [
            ...dataContacts.paginatedContacts.edges.map((edge) => {
              return {
                ...edge,
                node: { ...edge.node },
              };
            }),
          ],
        },
      };

      tmpDataContacts.paginatedContacts.edges.forEach(({ node }) => {
        node.commentsCounter = 0;
        node.tags = [[], 0];

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

      setRows([
        ...tmpDataContacts.paginatedContacts.edges.map((el) => el.node),
      ]);
      setLoading(false);
    }
  }, [
    // dataTracks,
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
              refetchQueries: [
                "getPaginatedContacts",
                "getContact",
                "checkIfOwnersAreContacts",
              ],
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
      (!props.showTracks || (dataTracks)) &&
      (props.targetLabel !== "owner" ||
        (checkIfOwnersAreContactsData &&
          checkIfOwnersAreContactsData.ifAreContacts)) &&
      props.privateColumns
    ) {
      if (searchResultData.length > 0) {
        searchResultData.forEach((result) => {
          result.id = result.Id;
          console.log('value result', result)
          console.log('props.target', props.targetLabel)

          // setting flyto coordinates for well 
          if (props.targetLabel && props.targetLabel == "well") {
            if (result.Longitude) result.longitude = result.Longitude;
            if (result.Latitude) result.latitude = result.Latitude;

            result.coordinates = {};
            if (result.Longitude && result.Latitude){
              result.coordinates.center = [result.Longitude, result.Latitude];
              result.coordinates.wellId = result.Id
            }
            //// set in the detailCard column
            result.detailCard = result.Id;

            // setting flyto coordinates for location 
          } else if (props.targetLabel && props.targetLabel == "location") {
            result.coordinates = {};
            if (result.bbox) result.coordinates.bbox = result.bbox;
            if (result.center) result.coordinates.center = result.center;

          } else if (props.targetLabel && props.targetLabel == "operator") {
              result.coordinates = {
                objToPopulateSearchLayer: {
                  objectType: props.targetLabel,
                  objectId: result.Id,
                  objectName: result.Operator,
                },
              };
            } else if (props.targetLabel && props.targetLabel == "lease") {
              result.coordinates = {
                objToPopulateSearchLayer: {
                  objectType: props.targetLabel,
                  objectId: result.LeaseId,
                  objectName: result.Lease,
                },
              };              
          // setting flyto coordinates for owners 
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
            for (let i = 0; i < dataTracks.length; i++) {
              if (result.Id === dataTracks[i]) {
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

        if (props.showTracks) 
          buildingColumns.push(SearchsHeadCells[3]);
        if (
          props.targetLabel &&
          (props.targetLabel == "well" || props.targetLabel == "owner")
        )
          //would only set the detail card icon for wells & owners
          buildingColumns.push(SearchsHeadCells[5]);
        if (
          // this is the fly-to labeler for grid ... 
          // seems to be running really slow 
          // also in general doesnt seem to work except for wells 
          // and locations 
          // probably need to somehow refactor 

          
          props.targetLabel 
           &&( props.targetLabel == "well" 
            || props.targetLabel == "location" 
            || props.targetLabel == "operator"
            || props.targetLabel == "lease" 
            || props.targetLabel == "contact" 
            || props.targetLabel == "owner"
            )
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
    if (props.parent && props.parent === "ownersPerParcel") {
      setLoading(true);
      setTargetLabel("Parcel Ownership");
      setHeader("Parcel Ownership");
      setAddAble({
        type: "ownerToParcel",
        customLayerId: props.customLayer._id,
      });
      getParcelOwners({
        variables: { customLayerId: props.customLayer._id },
      });
    }
  }, [props.customLayer]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "ownersPerParcel" &&
      dataParcelOwners
    ) {
      if (dataParcelOwners.parcelOwners && dataParcelOwners.parcelOwners.length > 0) {
        setLoading(true);
        const objectsIdsArray = dataParcelOwners.parcelOwners.map(
          (owner) => owner.ownerEntity
        );

        getCommentsCounter({
          variables: { objectsIdsArray, userId: stateApp.user.mongoId },
        });
        getTagSamples({
          variables: { objectsIdsArray, userId: stateApp.user.mongoId },
        });
        checkIfOwnersAreContacts({
          variables: { idsArray: objectsIdsArray },
        });
      } else {
        setLoading(false);
        setRows([]);
      }
    }
  }, [dataParcelOwners]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "ownersPerParcel" &&
      dataCommentsCounter &&
      dataCommentsCounter.commentsCounter &&
      dataTagSamples &&
      dataTagSamples.tagSamples &&
      dataTracks &&
      checkIfOwnersAreContactsData &&
      checkIfOwnersAreContactsData.ifAreContacts
    ) {

      const parcelOwners = dataParcelOwners.parcelOwners.map((o) => {
        let parcelOwner = { ...o };
        parcelOwner.commentsCounter = 0;
        parcelOwner.tags = [[], 0];
        parcelOwner.isTracked = false;

        for (
          let i = 0;
          i < checkIfOwnersAreContactsData.ifAreContacts.length;
          i++
        ) {
          if (
            parcelOwner.ownerEntity ===
            checkIfOwnersAreContactsData.ifAreContacts[i]._id
          ) {
            parcelOwner.isContact =
              checkIfOwnersAreContactsData.ifAreContacts[i].isContact;

            break;
          }
        }

        for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
          if (parcelOwner.ownerEntity === dataCommentsCounter.commentsCounter[i]._id) {
            parcelOwner.commentsCounter =
              dataCommentsCounter.commentsCounter[i].total;
            break;
          }
        }

        for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
          if (parcelOwner.ownerEntity === dataTagSamples.tagSamples[i]._id) {
            parcelOwner.tags = [
              dataTagSamples.tagSamples[i].tags,
              dataTagSamples.tagSamples[i].total,
            ];

            break;
          }
        }

        for (let i = 0; i < dataTracks.length; i++) {
          if (parcelOwner.ownerEntity === dataTracks[i]) {
            parcelOwner.isTracked = true;
            break;
          }
        }

        return parcelOwner;
      });

      let availableTags = [];
      dataTagSamples.tagSamples.map((sample) => {
        availableTags = [...availableTags, ...sample.tags];
      });
      const cleanAvailableTags = [...new Set(availableTags)];

      setColumns(
        cleanAvailableTags.length > 0
          ? OwnersPerParcelHeadCells.map((column) => {
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
          : OwnersPerParcelHeadCells.map((column) => {
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
          }));

      setRows(parcelOwners);
      setLoading(false);
    }
  }, [
    dataParcelOwners,
    dataTagSamples,
    checkIfOwnersAreContactsData,
    dataCommentsCounter,
    dataTracks,
  ]);

  useEffect(() => {
    if (abstractWellData) {
      const objectsIdsArray = abstractWellData.abstractWellGeo.map(
        (wellInterest) => wellInterest.wellId
      );

      getCommentsCounter({
        variables: { objectsIdsArray, userId: stateApp.user.mongoId },
      });
      getTagSamples({
        variables: { objectsIdsArray, userId: stateApp.user.mongoId },
      });
    }
  }, [abstractWellData]);


  useEffect(() => {
    if (props.parent && props.parent === "ownersPerParcelWells") {
      setHeader("Associated Wells");
      if (abstractWellData) {
        if (
          abstractWellData.abstractWellGeo &&
          abstractWellData.abstractWellGeo.length > 0 &&
          dataCommentsCounter &&
          dataCommentsCounter.commentsCounter &&
          dataTagSamples &&
          dataTagSamples.tagSamples
        ) {
          let wells = [...abstractWellData.abstractWellGeo];
          wells = wells.map((o) => {
            let wells = { ...o };
            wells.commentsCounter = 0;
            wells.tags = [[], 0];

            for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
              if (wells.wellId === dataCommentsCounter.commentsCounter[i]._id) {
                wells.commentsCounter =
                  dataCommentsCounter.commentsCounter[i].total;
                break;
              }
            }

            for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
              if (wells.wellId === dataTagSamples.tagSamples[i]._id) {
                wells.tags = [
                  dataTagSamples.tagSamples[i].tags,
                  dataTagSamples.tagSamples[i].total,
                ];

                break;
              }
            }
            return wells;
          });

          let availableTags = [];
          dataTagSamples.tagSamples.map((sample) => {
            availableTags = [...availableTags, ...sample.tags];
          });
          const cleanAvailableTags = [...new Set(availableTags)];

          wells.forEach(element => {
            if (stateApp.trackedWells) {
              const found = stateApp.trackedWells.find((x) => x.id == element.wellId);
              if (found) {
                element.isTracked = true;
              } else {
                element.isTracked = false;
              }
            } else {
              element.isTracked = false;
            }
          });

          setRows(wells);
          setColumns(
            cleanAvailableTags.length > 0
              ? CustomWellsHeadCells.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filterOptions: {
                        ...column.options.filterOptions,
                        names: cleanAvailableTags
                      },
                    },
                  };
                }
                return column;
              })
              : CustomWellsHeadCells.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filterOptions: {
                        ...column.options.filterOptions
                      },
                    },
                  };
                }
                return column;
              })
          );
        }
      }
      setLoading(false);
    }

  }, [abstractWellData, dataCommentsCounter, dataTagSamples, checkIfOwnersAreContactsData])



//////////// SELECTED POLYGON WELL //////////////////////////////////////

  // useEffect(()=> {
  //   if (stateApp.selectedPolygonString) {
  //     getAbstractWellGeo({
  //       variables: {
  //         polygon: stateApp.selectedPolygonString,
  //       },
  //     });
  //   }
  // }, [stateApp.selectedPolygonString]);

  useEffect(() => {

  }, []);

  useEffect(() => {
    if (abstractWellData) {
      const objectsIdsArray = abstractWellData.abstractWellGeo.map(
        (wellInterest) => wellInterest.wellId
      );

      getCommentsCounter({
        variables: { objectsIdsArray, userId: stateApp.user.mongoId },
      });
      getTagSamples({
        variables: { objectsIdsArray, userId: stateApp.user.mongoId },
      });
      // let set_tracked = [];
      // let reconstruct_wells = [];
      // stateApp.trackedwells.forEach(element => {
      //   const found = abstractWellData.abstractWellGeo.find(x => x.wellId == element.id);
      //   if (found) {
      //     set_tracked.push(found);
      //   }
      // });
      // // Tags = 0
      // // Tracks = 1
      // // Comments =0
      // abstractWellData.abstractWellGeo.forEach(element => {
      //   if (element in set_tracked) {
      //     reconstruct_wells.push({...element, isTracked: true});
      //   } else {
      //     reconstruct_wells.push({...element, isTracked: false});
      //   }
      // });
      // setStateApp({
      //   ...stateApp,
      //   selectedBoundaryWell: reconstruct_wells
      // });
    }
  }, [abstractWellData]);


  useEffect(() => {
    if (props.parent && props.parent === "ownersPerParcelWells") {
      setHeader("Associated Wells");
      if (abstractWellData) {
        if (
          abstractWellData.abstractWellGeo &&
          abstractWellData.abstractWellGeo.length > 0 &&
          dataCommentsCounter &&
          dataCommentsCounter.commentsCounter &&
          dataTagSamples &&
          dataTagSamples.tagSamples
        ) {
          let wells = [...abstractWellData.abstractWellGeo];
          wells = wells.map((o) => {
            let wells = { ...o };
            wells.commentsCounter = 0;
            wells.tags = [[], 0];

            for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
              if (wells.wellId === dataCommentsCounter.commentsCounter[i]._id) {
                wells.commentsCounter =
                  dataCommentsCounter.commentsCounter[i].total;
                break;
              }
            }

            for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
              if (wells.wellId === dataTagSamples.tagSamples[i]._id) {
                wells.tags = [
                  dataTagSamples.tagSamples[i].tags,
                  dataTagSamples.tagSamples[i].total,
                ];

                break;
              }
            }
            return wells;
          });

          let availableTags = [];
          dataTagSamples.tagSamples.map((sample) => {
            availableTags = [...availableTags, ...sample.tags];
          });
          const cleanAvailableTags = [...new Set(availableTags)];

          wells.forEach(element => {
            if (stateApp.trackedWells) {
              const found = stateApp.trackedWells.find((x) => x.id == element.wellId);
              if (found) {
                element.isTracked = true;
              } else {
                element.isTracked = false;
              }
            } else {
              element.isTracked = false;
            }
          });

          setRows(wells);
          setColumns(
            cleanAvailableTags.length > 0
              ? CustomWellsHeadCells.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filterOptions: {
                        ...column.options.filterOptions,
                        names: cleanAvailableTags
                      },
                    },
                  };
                }
                return column;
              })
              : CustomWellsHeadCells.map((column) => {
                if (column.name === "tags") {
                  return {
                    ...column,
                    options: {
                      ...column.options,
                      filterOptions: {
                        ...column.options.filterOptions
                      },
                    },
                  };
                }
                return column;
              })
          );
        }
      }
      setLoading(false);
    }

  }, [abstractWellData, dataCommentsCounter, dataTagSamples, checkIfOwnersAreContactsData])
  //////////// SELECTED POLYGON WELL //////////////////////////////////////





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
                "getparcelOwners",
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

          for (let i = 0; i < dataTracks.length; i++) {
            if (
              parcelInterest._id === dataTracks[i]
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
                "getparcelOwners",
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
      } else {
        setRows([]);
      }
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
    if (props.parent && props.parent === "Deals" && stateApp.user) {
      setLoading(true);
      setTargetLabel("deal");
      setHeader("Deals");
      getContactDeals({
        variables: {
          contactId: props.contact?._id,
        },
      });
      setAddAble({ type: "deals" });
      setUploadIcon(false);
      setStartPaginationAt(25);
      setOrderByTracks(false);
    }
  }, [props.parent, props.contact]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "Deals" &&
      dataDeals?.contactDeals &&
      props.contact
    ) {
      setTargetLabel("deal");
      setRows([...dataDeals.contactDeals]);
      setColumns([...DealsHeadCells]);
      setLoading(false);
    }

  }, [dataDeals]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "Documents" &&
      DocumentsData?.getFileDescriptors 
    ) {
      setTargetLabel("documents");
      setRows([...DocumentsData.getFileDescriptors]);
      setColumns([...DocumentsHeadCells]);
      setLoading(false);
    }

  }, [DocumentsData]);

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

          updateTransaction({
            variables: {
              transactionId: dataDeals.transactionData._id,
              transaction: { allData: newData, user: stateApp.user.mongoId },
            },
            refetchQueries: [
              "getContact",
              "getPaginatedContacts",
              "getContactDeals",
            ],
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

  ////////////Transact Deals start////////////////////////////////////////////////

  useEffect(() => {
    if (props.parent && props.parent === "TransactDeals") {
      setTargetLabel("deal");
      setHeader("Deals");
      setAddAble(false);
      setUploadIcon(false);
      setStartPaginationAt(25);
      setOrderByTracks(false);
    }
  }, [props.parent]);

  useEffect(() => {
    if (props.parent && props.parent === "TransactDeals") {
      setLoading(props.filteredTabTransactData ? false : true);

      if (props.filteredTabTransactData) {
        setRows([...props.filteredTabTransactData]);
        setColumns(TransactDealsHeadCells);
      }
    }
  }, [props.parent, props.filteredTabTransactData]);

  ////////////Transact Deals end////////////////////////////////////////////////

  ////////////Activities start////////////////////////////////////////////////

  useEffect(() => {
    if (props.parent && props.parent === "Activities") {
      setTargetLabel("activity");
      setHeader("Activities");
      setAddAble(false);
      setUploadIcon(false);
      setStartPaginationAt(25);
      setOrderByTracks(false);
    }
  }, [props.parent]);

  useEffect(() => {
    if (props.parent && props.parent === "Activities") {
      setLoading(props.activities ? false : true);

      if (props.activities) {
        setRows([...props.activities]);
        setColumns(ActivitiesHeadCells);
      }
    }
  }, [props.parent, props.activities]);

  ////////////Activities end////////////////////////////////////////////////

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
      dataTracks
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
        for (let i = 0; i < dataTracks.length; i++) {
          if (
            well.id === dataTracks[i].toLowerCase()
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
      getPaginatedWellInterests({
        variables: {
          filters: {
            field: "id",
            value: props.id,
          },
        },
      });

      // to populate the search layer
      dispatch(
        setMapGridCardState({
          objToPopulateSearchLayer: {
            objectId: props.id,
            objectType: "owner",
          },
        })
      );
    }
  }, [props.id, stateApp.user]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "owner_WellInterests" &&
      constDataWellInterests
    ) {
      if (
        constDataWellInterests?.paginatedWellInterests?.edges &&
        constDataWellInterests.paginatedWellInterests.edges.length > 0
      ) {
        setDataWellInterests([
          ...constDataWellInterests.paginatedWellInterests.edges.map(
            (el) => el.node
          ),
        ]);
        setLoading(false);
      } else {
        setLoading(false);
        setRows([]);
      }
    }
  }, [constDataWellInterests]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "owner_WellInterests" &&
      dataWellInterests &&
      stateApp.user &&
      stateApp.user.mongoId
    ) {
      const IdsArray = [];
      dataWellInterests.forEach((well) => {
        if (well && well.wellId) {
          IdsArray.push(well.wellId);
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
  }, [dataWellInterests, stateApp.user]);

  useEffect(() => {
    if (
      props.parent &&
      props.parent === "owner_WellInterests" &&
      dataWellInterests
    ) {
      if (
        dataWellInterests.length > 0 &&
        dataCommentsCounter &&
        dataCommentsCounter.commentsCounter &&
        dataTagSamples &&
        dataTagSamples.tagSamples &&
        dataTracks
      ) {
        let wells = dataWellInterests.map((w) => {
          let well = { ...w };

          well.isTracked = false;
          well.commentsCounter = 0;
          well.tags = [[], 0];

          //// set in the detailCard column
          well.detailCard = well.wellId;

          well.coordinates = {};
          if (well.longitude && well.latitude)
            well.coordinates.center = [well.longitude, well.latitude];

          for (let i = 0; i < dataTracks.length; i++) {
            if (well.wellId === dataTracks[i]) {
              well.isTracked = true;
              break;
            }
          }
          for (let i = 0; i < dataCommentsCounter.commentsCounter.length; i++) {
            if (well.wellId === dataCommentsCounter.commentsCounter[i]._id) {
              well.commentsCounter =
                dataCommentsCounter.commentsCounter[i].total;
              break;
            }
          }
          for (let i = 0; i < dataTagSamples.tagSamples.length; i++) {
            if (well.wellId === dataTagSamples.tagSamples[i]._id) {
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
        setLoading(false);
      }
      // else {
      //   setRows([]);
      // }

      // setLoading(false);
    }
  }, [dataWellInterests, dataTagSamples, dataCommentsCounter, dataTracks]);

  //////////// Owner_WellInterests end///////////////////////////////////////////////

  /////////// PRODUCTION DETAILS ////////////////////////////////////////
  useEffect(() => {
    if (props.parent && props.parent === "production_WellDetails") {
      setLoading(true);
      setTargetLabel("production_detail");
      setHeader("Monthly Production");
      setColumns(ProductionDetailsHeaders);
      setLoading(false);
      setAddAble(false);
      setRows(props.productionDetails);
      setOrderByTracks(false);
      setTotal(true);
    }
  }, [props.props]);
  /////////// PRODUCTION DETAILS ////////////////////////////////////////

  ////////////-----Add your code section here-----///////////////////////
  const getWellOwnersByYear = (selectedYear) => {
    setSelectedYear(selectedYear)
  }
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

      {props.parent && props.parent === "assocTaxRollInterests" && (
        <AddWellInterestDialog
          open={stateApp.wellInterestDialog ? true : false}
          width="450px"
          onClose={() =>
            setStateApp((stateApp) => ({
              ...stateApp,
              wellInterestDialog: false,
            }))
          }
          contactId={props.contactId}
        />
      )}

      <Table
        style={{ backgroundColor: "#fff" }}
        header={header}
        columns={columns}
        rows={rows}
        total={total}
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
          getPaginatedContacts,
          getContactsFilterOptions,
          contactsCount: dataContactsFilterOptions?.contactsFilterOptions?.totalCount[0]
            ? dataContactsFilterOptions?.contactsFilterOptions?.totalCount[0]?.totalCount
            : 0,
          setLoading,
        }}
        wellInterestsPageProps={{
          ownerId: props.id,
          getPaginatedWellInterests,
          getWellInterestsFilterOptions,
          wellInterestsCount: selectedOwnerWellIntsSummary?.interestsCount
            ? selectedOwnerWellIntsSummary.interestsCount
            : 0,
          setLoading,
        }}
        shapeWellsPageProps={{
          getPaginatedShapeWells,
          shapeWellsCount: (dataShapeWellsCount && dataShapeWellsCount.shapeWellsCount) ? dataShapeWellsCount.shapeWellsCount : 0,
          setLoading,
        }}
        parent={props.parent}
        setColumnsBase={setColumnsBase}
        getWellOwnersByYear={getWellOwnersByYear}
      />
    </Container>
  );
}

export default React.memo(M1nTable, deepEqualObjects);
