import React, { Fragment, useContext, useState, useEffect, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { get } from "lodash";

import { AppContext } from "../../AppContext";
import { TransactContext } from "./TransactContext";
import Board from "react-trello";
import { makeStyles } from "@material-ui/core/styles";
import { UPDATESTAGEDEALDESCRIPTORS } from "../../graphQL/useMutationUpdateStageDealDescriptors";
import CircularProgress from "@material-ui/core/CircularProgress";

import AddDealDialog from "components/Transact/components/DealDialog/AddDealDialog";
import "./index.css";
import TransactAppBar from "./components/TransactAppBar";
import SidePanel from "./components/SidePanel";
import { useSelector, useDispatch } from "react-redux";
import { setFlowState } from "actions";
import { UPDATEDEAL } from "../../graphQL/useMutationUpdateDeal";
import M1nTable from "../Shared/M1nTable/M1nTable";
import CustomAvatar from "components/Shared/ui/CustomAvatar";
import moment from "moment";
import { getRandomColor } from "components/Shared/functions/ui.js";
import vf_currency from "../Shared/valueformatters/vf_currency.js";
import DocViewer from "../Shared/DocViewer";
import { validateEmail } from "components/Login/loginHelpers";
import { GETPIPELINES } from "graphQL/useQueryPipelines";
import { GETPIPELINE } from "graphQL/useQueryPipeline";
import { GET_PROFILES_IMAGES } from "graphQL/useQueryGetProfile";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  list: {
    overflowX: "auto !important",
    height: "100%",
  },
  cardStyle: {
    position: "relative",
    border: "none",
    borderLeft: "4px solid #e2e2e2",
    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
    backgroundColor: "rgb(242, 242, 242)",
    textAlign: "center",
    marginBottom: "10px",
    cursor: "pointer",
    maxWidth: "250px",
    minWidth: "250px",
    maxHeight: "150px",
  },
  cardHeaderStyle: {
    display: "flex",
    flexDirection: "column",
    borderBottom: (props) => (props.description ? "1px solid #e2e2e2" : ""),
    padding: "10px",
    textAlign: "left",
    whiteSpace: "pre-wrap",
    maxWidth: "245px",
  },
  cardDescStyle: {
    color: "#2e4451",
    padding: "10px",
    whiteSpace: "pre-wrap",
    textAlign: "left",
    fontSize: "12px",
  },
  cardTitle: {
    color: "#1CB6DA",
    textTransform: "uppercase",
    width: "85%",
  },
  cardSubheading: {
    fontSize: "12px",
  },
  laneHeaderStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "0px 5px",
    marginBottom: "0px",
  },
  laneHeaderSpanStyle: {
    color: "#2e4451",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "5px",
  },
  laneHeaderNotBold: {
    fontSize: "14px !important",
    fontWeight: "normal !important",
  },
  laneHeaderTotalStyle: {
    fontSize: "14px !important",
    fontWeight: "bold !important",
  },
  boardAndTable: {
    marginTop: "4px",
    maxHeight: "calc(100vh - 140px) !important",
    overflowY: "auto",
    maxWidth: "100vw",
    "& .react-trello-board": {
      height: "calc( 100vh - 140px)",
      "& >div": {
        overflowX: "scroll",
        overflowY: "hidden",
        "&::-webkit-scrollbar": {
          height: "0.75em",
        },
        "&::-webkit-scrollbar-track": {
          "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "lightgray",
          borderRadius: 5,
        },
        height: "100%",
        "& .smooth-dnd-container": {
          height: "100%",
          "& section": {
            height: "100%",
            minHeight: "100%",
          },
        },
      },
    },
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": { minHeight: "calc(100vh - 258px) !important" },
      },
    },
    "& .MuiToolbar-root": { textAlign: "initial" },
  },
  dealOwnerAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: "#fff",
    fontSize: "0.6rem",
    backgroundColor: "#4880F6",
    padding: "0.5em",
  },
  content: {
    flexGrow: 1,
    marginLeft: "315px",
  },
}));

export default function Transact() {
  const classes = useStyles();
  let history = useHistory();
  const dispatch = useDispatch();
  const { pipeToShow, pipeToShowTab, selectedPipe } = useSelector(({ Flow }) => Flow);
  console.log("PIPETOSHOW: ", pipeToShow);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [, setStateTransact] = useContext(TransactContext);
  const [filteredBoardTransactData, setFilteredBoardTransactData] = useState({
    lanes: [],
  });
  const [filteredTabTransactData, setFilteredTabTransactData] = useState([]);
  const [dealFilter, setDealFilter] = useState("all");

  const cardColors = useRef({});

  const [getPipelines, { data: pipelinesData }] = useLazyQuery(GETPIPELINES);
  const [getPipeline, { data: pipelineData }] = useLazyQuery(GETPIPELINE, {
    fetchPolicy: "cache-and-network",
  });
  const [updateStageDealDescriptors] = useMutation(UPDATESTAGEDEALDESCRIPTORS);
  const [updateDeal] = useMutation(UPDATEDEAL);

  const [getProfilesImages, profiledata] = useLazyQuery(GET_PROFILES_IMAGES, {
    fetchPolicy: "cache-first",
  });

  const filterBoardCards = (lanes, filter) => {
    return lanes.map((lane) => {
      let cards = [...lane.cards];

      switch (filter) {
        case "all":
          cards = cards.filter((card) => !card.metadata.IsDeleted); // remove deleted cards
          break;

        case "deleted":
          cards = cards.filter((card) => card.metadata.IsDeleted); // get deleted cards
          break;

        default:
          cards = cards.filter((card) => card.metadata.status === filter && !card.metadata.IsDeleted);
          break;
      }

      return { ...lane, cards };
    });
  };

  useEffect(() => {
    getProfilesImages({
      variables: {},
    });
  }, [getProfilesImages]);

  useEffect(() => {
    getPipelines();
  }, [getPipelines]);

  useEffect(() => {
    if (selectedPipe) {
      getPipeline({ variables: { id: selectedPipe._id } });
    }
  }, [selectedPipe, getPipeline]);

  useEffect(() => {
    if (pipelinesData) {
      //// select first one as default
      const pipelineId = history.location.pathname.split("/")[2];
      let laneId = "";
      let cardId = "";
      if (history.location.pathname.includes("lane")) {
        laneId = history.location.pathname.split("/")[4];
      }
      if (history.location.pathname.includes("card")) {
        cardId = history.location.pathname.split("/")[6];
      }

      if (pipelinesData.pipelines && pipelinesData.pipelines.length > 0) {
        let activePipeline = {};

        if (pipelineId) {
          activePipeline = pipelinesData.pipelines.find((p) => p._id === pipelineId);
        }
        if (!activePipeline) {
          const isExist = !!pipelinesData.pipelines.find((p) => p._id === selectedPipe?._id);
          if (selectedPipe && isExist) {
            activePipeline = pipelinesData.pipelines.find((p) => p._id === selectedPipe._id);
          } else activePipeline = pipelinesData.pipelines[0];
        }
        if (laneId && cardId) {
          history.push(`/flow/${activePipeline._id}/lane/${laneId}/card/${cardId}`);
        } else {
          history.push(`/flow/${activePipeline._id}`);
        }

        dispatch(
          setFlowState({
            selectedPipe: activePipeline,
            pipelines: pipelinesData.pipelines,
          })
        );
      } else
        dispatch(
          setFlowState({
            selectedPipe: null,
            pipelines: [],
            pipeToShow: false,
          })
        );
    }
  }, [pipelinesData]);

  useEffect(() => {
    if (pipelineData) {
      if (pipelineData.pipeline) {
        let laneId = "";
        let cardId = "";
        if (history.location.pathname.includes("lane")) {
          laneId = history.location.pathname.split("/")[4];
        }
        if (history.location.pathname.includes("card")) {
          cardId = history.location.pathname.split("/")[6];
        }

        let deals = [];
        let pipe = {
          ...pipelineData.pipeline,
          lanes: pipelineData.pipeline.lanes?.map((lane) => ({
            ...lane,
            cards: lane.cards?.map((card) => {
              if (!card.metadata.IsDeleted) {
                if (lane.id === laneId && cardId === card.id) {
                  setStateApp((stateApp) => ({
                    ...stateApp,
                    dealDialog: true,
                    activeDeal: {
                      cardId,
                      laneId,
                      ...card.metadata,
                    },
                  }));
                }
                deals.push({
                  cardId: card.id,
                  laneId: lane.id,
                  laneName: lane.title,
                  pipeline: pipelineData.pipeline._id,
                  pipelineName: pipelineData.pipeline.name,
                  ownerName:
                    card?.metadata?.owners && card.metadata.owners[0]?.relatedObject?.name
                      ? card.metadata.owners[0].relatedObject.name
                      : null,
                  contactName:
                    card?.metadata?.contacts && card.metadata.contacts[0]?.relatedObject?.entity?.name
                      ? card.metadata.contacts[0].relatedObject.entity.name
                      : null,
                  isContact:
                    card?.metadata?.contacts && card.metadata.contacts[0]?.relatedObject?._id
                      ? card.metadata.contacts[0].relatedObject._id
                      : null,
                  ...card.metadata,
                });
              }

              return { ...card };
            }),
          })),
        };

        dispatch(
          setFlowState({
            pipeToShow: pipe,
            pipeToShowTab: deals,
          })
        );
      } else
        dispatch(
          setFlowState({
            pipeToShow: null,
            pipeToShowTab: null,
          })
        );
    }
  }, [pipelineData]);

  useEffect(() => {
    if (pipeToShow?.lanes && dealFilter) {
      setFilteredBoardTransactData({
        lanes: [...filterBoardCards(pipeToShow.lanes, dealFilter)],
      });

      const cardColorsAndImages = (lanes) => {
        lanes.forEach((lane) => {
          lane &&
            lane.cards &&
            lane.cards.forEach((card) => {
              const owner = card && card.metadata && card.metadata.owners && card.metadata.owners[0];
              const ownerId = owner && card.metadata.owners[0].id;

              if (!(ownerId in cardColors.current)) {
                cardColors.current = {
                  ...cardColors.current,
                  [ownerId]: getRandomColor(ownerId),
                };
              }
              // card.metadata.owners[0].id
            });
        });
      };

      if (filteredBoardTransactData.lanes?.length) {
        cardColorsAndImages(filteredBoardTransactData.lanes);
      } else {
        cardColorsAndImages(pipeToShow.lanes);
      }
    }
  }, [pipeToShow, dealFilter]);

  useEffect(() => {
    if (profiledata?.data?.profileByEmail?.profiles) {
      setStateTransact(profiledata.data.profileByEmail.profiles);
    }
  }, [profiledata]);

  const filterTabCards = (cards, filter) => {
    return cards.filter((card) => {
      switch (filter) {
        case "all":
          return !card.IsDeleted; // remove deleted cards

        case "deleted":
          return card.IsDeleted; // get deleted cards

        default:
          return card.status === filter && !card.IsDeleted;
      }
    });
  };

  useEffect(() => {
    if (pipeToShowTab && dealFilter) {
      setFilteredTabTransactData([...filterTabCards(pipeToShowTab, dealFilter)]);
    }
  }, [pipeToShowTab, dealFilter]);

  const handleDataChange = (newData) => {};

  const handleCardClick = (cardId, metadata, laneId) => {
    history.push(`${history.location.pathname}/lane/${laneId}/card/${cardId}`);
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: true,
      activeDeal: {
        cardId,
        laneId,
        ...metadata,
      },
    }));
  };

  const handleCardDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
    // handle drag within lanes - runs first

    let unfilteredSourceLane = pipeToShow.lanes.find((lane) => lane?.id === sourceLaneId);
    let unfilteredTargetLane = pipeToShow.lanes.find((lane) => lane?.id === targetLaneId);

    let filteredTargetLane = filteredBoardTransactData.lanes.find((lane) => lane?.id === targetLaneId);

    let unfilteredSourcePosition = unfilteredSourceLane.cards.findIndex((card) => card?.id === cardId);
    let unfilteredTargetPosition = (() => {
      if (position === 0) return 0;
      let atEnd = position >= filteredTargetLane?.cards?.length;
      let prevCardFilteredPosition = position - atEnd;
      let prevCardAtPosition = filteredTargetLane?.cards[prevCardFilteredPosition];
      let prevCardUnfilteredPosition = unfilteredTargetLane?.cards.findIndex((card) => {
        return card?.id === prevCardAtPosition?.id;
      });

      return (prevCardUnfilteredPosition += atEnd);
    })();

    // update moved card descriptor
    let movedCardDescriptor = {
      _id: cardDetails.metadata.descriptorId,
      relatedObject: targetLaneId,
      position: unfilteredTargetPosition,
    };

    // update unfilteredSourceLane descriptors
    // including dragging down in same lane
    let sourceSliceStart = unfilteredSourcePosition + 1;
    let sourceSliceEnd = sourceLaneId === targetLaneId ? unfilteredTargetPosition + 1 : undefined;
    let unfilteredSourceLaneDescriptors = [
      ...unfilteredSourceLane.cards.slice(sourceSliceStart, sourceSliceEnd).map((card, index) => {
        return {
          _id: card.metadata.descriptorId,
          position: unfilteredSourcePosition + index,
        };
      }),
    ];

    // update unfilteredTargetLane descriptors
    // including dragging up in same lane
    let targetSliceStart = unfilteredTargetPosition;
    let targetSliceEnd = sourceLaneId === targetLaneId ? unfilteredSourcePosition : undefined;
    let unfilteredTargetLaneDescriptors = [
      ...unfilteredTargetLane.cards.slice(targetSliceStart, targetSliceEnd).map((card, index) => {
        return {
          _id: card.metadata.descriptorId,
          position: unfilteredTargetPosition + index + 1,
        };
      }),
    ];

    updateStageDealDescriptors({
      variables: {
        stageDealDescriptors: [movedCardDescriptor, ...unfilteredSourceLaneDescriptors, ...unfilteredTargetLaneDescriptors],
      },
      refetchQueries: ["getPipeline"],
      // awaitRefetchQueries: true,
    });

    if (sourceLaneId !== targetLaneId) {
      let updatedDeal = {
        _id: cardId,
        stageChangeDate: new Date().toUTCString(),
      };

      if (
        unfilteredTargetLane?.metadata?.dealsStatus &&
        unfilteredTargetLane.metadata.dealsStatus.toLowerCase() !== cardDetails?.metadata?.status?.toLowerCase()
      )
        updatedDeal = {
          ...updatedDeal,
          status: unfilteredTargetLane.metadata.dealsStatus.toLowerCase(),
        };

      updateDeal({
        variables: {
          deal: { ...updatedDeal },
        },
        refetchQueries: ["getPipeline", "getContactDeals"],
        // awaitRefetchQueries: true,
      });
    }
  };

  const onCardMoveAcrossLanes = (fromLaneId, toLaneId, cardId, addedIndex) => {
    if (fromLaneId !== toLaneId) {
    }
  };

  const getCardColor = (rotting, stageChangeDate) => {
    if (!selectedPipe.rottenness) return "rgb(242, 242, 242)";

    let cardColor = "limegreen";
    if (rotting && stageChangeDate) {
      let rottingDate = null;
      rottingDate = moment(stageChangeDate).add(rotting, "days");

      let total = rottingDate.diff(moment(stageChangeDate), "days");
      let current = rottingDate.diff(moment(), "days"); // swap date values if doesn't work as intended

      let percentageDone = ((total - current) / total) * 100;

      if (percentageDone >= 100) cardColor = "red";
      else if (percentageDone >= 75) cardColor = "yellow";
    }
    return cardColor;
  };

  const GetCard = React.memo((cardProps) => {
    const CardClasses = useStyles(cardProps);
    const { metadata, title, description, id, laneId } = cardProps;
    const cardPrice = metadata && metadata.offerPrice ? metadata.offerPrice : 0;
    const formattedPrice = vf_currency(cardPrice);

    let formattedDate = null;

    if (metadata?.closeDate) formattedDate = moment.parseZone(new Date(metadata.closeDate)).format("MM/DD/YY");

    let owner = null;
    let ownerId = null;
    let ownerEmail = null;
    let ownerObject = metadata?.owners[0] ? metadata?.owners[0] : null;

    if (ownerObject && ownerObject.relatedObject?.name) {
      owner = ownerObject.relatedObject.name;
      ownerId = ownerObject.relatedObject.id;

      if (validateEmail(ownerObject.relatedObject.email)) {
        ownerEmail = ownerObject.relatedObject.email;
      }
    }

    let desc = description;
    if (description && description.length > 50) desc = description.slice(0, 53) + "...";

    const stageChangeDate = metadata.stageChangeDate && moment.parseZone(metadata.stageChangeDate);

    const lane = filteredBoardTransactData.lanes.find((lane) => lane.id === laneId);

    const cardColor = getCardColor(get(lane, "metadata.rotting"), stageChangeDate);

    return (
      <article
        className={CardClasses.cardStyle}
        onClick={() => handleCardClick(id, metadata, laneId)}
        style={{ borderLeft: `4px solid ${cardColor}` }}
      >
        <header className={CardClasses.cardHeaderStyle}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className={CardClasses.cardTitle}>{title.length > 30 ? `${title.substr(0, 40)}...` : title}</span>
            {owner && <CustomAvatar email={ownerEmail} text={owner} color={cardColors[ownerId]} />}
          </div>

          <div className={CardClasses.cardSubheading}>
            {formattedDate && (
              <>
                <br />
                <span>
                  Est. Close {"   "}
                  <span style={{ fontWeight: "normal" }}>{formattedDate}</span>
                </span>
              </>
            )}

            {formattedPrice && (
              <>
                <br />

                <span>
                  Offer Price <span style={{ fontWeight: "normal" }}>{formattedPrice}</span>
                </span>
              </>
            )}
          </div>
        </header>
        <div className={CardClasses.cardDescStyle}>{desc}</div>
      </article>
    );
  });

  const getLaneHeader = ({ title, id, metadata }) => {
    const lane = filteredBoardTransactData?.lanes?.find((lane) => lane.id === id);
    let dealCount = 0;
    if (lane) dealCount = lane?.cards.length;

    let priceSum = 0;
    lane && lane.cards.forEach((card) => (priceSum += card && card.metadata && card.metadata.offerPrice ? card.metadata.offerPrice : 0));

    const formattedTotal = vf_currency(priceSum);

    let forecast = null;
    let forecastFormatted = "";
    if (priceSum > 0 && metadata.dealProbability > 0) {
      forecast = priceSum * (metadata.dealProbability / 100);
      forecastFormatted = vf_currency(forecast);
    }

    return (
      <header className={classes.laneHeaderStyle}>
        <span className={classes.laneHeaderSpanStyle}>
          {title} ({dealCount})
        </span>
        <span className={classes.laneHeaderTotalStyle}>
          Total: <span className={classes.laneHeaderNotBold}>{formattedTotal}</span>
        </span>
        <span className={classes.laneHeaderTotalStyle}>
          Forecast: <span className={classes.laneHeaderNotBold}>{forecast === 0 || forecast === null ? "--" : forecastFormatted}</span>
        </span>
      </header>
    );
  };

  return (
    <div className={classes.root}>
      <DocViewer></DocViewer>
      {stateApp.dealDialog && (
        <AddDealDialog
          open={stateApp.dealDialog ? true : false}
          width="450px"
          isTransactPage
          onClose={() =>
            setStateApp((stateApp) => ({
              ...stateApp,
              dealDialog: false,
              activeDeal: { cardId: null, laneId: null },
            }))
          }
        />
      )}
      {/**
       * Here goes the Side Panel for Flowlines
       */}
      <SidePanel />

      <main className={classes.content}>
        <TransactAppBar dealFilter={dealFilter} setDealFilter={setDealFilter} setStateApp={setStateApp} />
        {pipeToShow ? (
          <div className={classes.boardAndTable}>
            {stateApp.dealDisplayType === "board" && (
              <Board
                className={classes.list}
                style={{ backgroundColor: "#fff" }}
                data={filteredBoardTransactData}
                draggable={true}
                laneDraggable={false}
                cardDraggable={true}
                collapsibleLanes={false}
                editable={false}
                canAddLanes={false}
                editLaneTitle={false}
                hideCardDeleteIcon={true}
                handleDragEnd={handleCardDragEnd}
                onDataChange={handleDataChange}
                onCardClick={handleCardClick}
                onCardMoveAcrossLanes={onCardMoveAcrossLanes}
                laneStyle={{
                  backgroundColor: "#fff",
                  color: "#011133",
                  fontWeight: "bold",
                  textAlign: "left",
                }}
                cardStyle={{
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                  backgroundColor: "#F2F2F2",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
                components={{
                  LaneHeader: (laneProps) => getLaneHeader(laneProps),
                  Card: (cardProps) => <GetCard {...cardProps} />,
                }}

                //onCardAdd = {handleCardAdd}
                //onCardDelete = {handleCardDelete}
                // handleDragStart = {}
                // handleDragEnd={}
                // handleLaneDragStart
                // onDataChange
                // onCardAdd
                // onBeforeCardDelete
                // onCardDelete
                // onCardMoveAcrossLanes
                // onLaneAdd
                // onLaneDelete
                // onLaneUpdate
                // onLaneClick
                // onLaneScroll
                //onCardMoveAcrossLanes
              />
            )}
            {stateApp.dealDisplayType === "table" && (
              <M1nTable dense filteredTabTransactData={filteredTabTransactData} parent="TransactDeals" />
            )}
          </div>
        ) : pipeToShow === false ? (
          <h1 style={{ marginTop: 80 }}>No flowlines currently exist - please setup a new flowline and corresponding stages.</h1>
        ) : (
          <CircularProgress size={80} disableShrink color="secondary" />
        )}
      </main>
    </div>
  );
}
