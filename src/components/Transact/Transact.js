////////////////////////////////////////////////////////////////////////////////
//////////react-trello info: https://github.com/rcdexta/react-trello  //////////
////////////////////////////////////////////////////////////////////////////////

import React, { useContext, useState, useEffect, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { AppContext } from "../../AppContext";
import Board from "react-trello";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { UPDATESTAGEDEALDESCRIPTORS } from "../../graphQL/useMutationUpdateStageDealDescriptors";
import { GETPIPELINES } from "../../graphQL/useQueryPipelines";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Dialog from "./components/dialog";
import getLaneTitle from "./getLaneTitle";
import AddDealDialog from "../ContactDetailCard/components/AddDealDialog";
import RightDialog from "../ContactDetailCard/components/RightDialog";
import { isEqual } from "lodash";
import "./index.css";
import { AppBar } from "@material-ui/core";
import TransactAppBar from "./components/TransactAppBar";
import TransactTable from "./components/TransactTable";
import { useDispatch, useSelector } from "react-redux";
import { setFlowState } from "../../actions";
import { UPDATEDEAL } from "../../graphQL/useMutationUpdateDeal";
import M1nTable from "../Shared/M1nTable/M1nTable";
import Drawer from "./components/Drawer";
import moment from "moment";

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
    boxShadow:
      "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
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
    borderBottom: "1px solid #e2e2e2",
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
    maxHeight: "calc(100vh - 140px) !important",
    overflowY: "auto",
    maxWidth: "100vw",
    "& .react-trello-board": {
      height: "calc( 100vh - 140px)",
      "& >div": {
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
  customAvatar: {
    borderRadius: "50%",
    backgroundColor: "red",
    padding: "5px",
    color: "#fff",
    width: "25px",
    height: "25px",
    fontSize: "0.7rem",
    textAlign: "center",
  },
}));

let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const CustomAvatar = ({ text = "" }) => {
  const classes = useStyles();

  const getInitials = (name) => {
    if (!name || name.length === 0) return "N/A";
    const split = name ? name.split(" ") : [""];
    let initials = "";
    split.forEach((s) => {
      if (s[0]) initials += s[0];
      if (initials.length === 2) return;
    });
    return initials.toUpperCase();
  };

  return (
    <span
      className={classes.customAvatar}
      style={{
        backgroundColor: getRandomColor(text),
      }}
    >
      {getInitials(text)}
    </span>
  );
};

const defaultColors = [
  "#d73d32",
  "#7e3794",
  "#4285f4",
  "#67ae3f",
  "#d61a7f",
  "#ff4080",
];

function _stringAsciiPRNG(value, m) {
  // Xn+1 = (a * Xn + c) % m
  // 0 < a < m
  // 0 <= c < m
  // 0 <= X0 < m

  const charCodes = [...value].map((letter) => letter.charCodeAt(0));
  const len = charCodes.length;

  const a = (len % (m - 1)) + 1;
  const c = charCodes.reduce((current, next) => current + next) % m;

  let random = charCodes[0] % m;
  for (let i = 0; i < len; i++) random = (a * random + c) % m;

  return random;
}

export function getRandomColor(value, colors = defaultColors) {
  // if no value is passed, always return transparent color otherwise
  // a rerender would show a new color which would will
  // give strange effects when an interface is loading
  // and gets rerendered a few consequent times
  if (!value) return "transparent";

  // value based random color index
  // the reason we don't just use a random number is to make sure that
  // a certain value will always get the same color assigned given
  // a fixed set of colors
  const colorIndex = _stringAsciiPRNG(value, colors.length);
  return colors[colorIndex];
}

export default function Transact() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { pipeToShow, pipeToShowTab } = useSelector(({ Flow }) => Flow);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [filteredBoardTransactData, setFilteredBoardTransactData] = useState({
    lanes: [],
  });
  const [filteredTabTransactData, setFilteredTabTransactData] = useState([]);
  const [dealFilter, setDealFilter] = useState("all");

  const cardColors = useRef({});

  const [updateStageDealDescriptors] = useMutation(UPDATESTAGEDEALDESCRIPTORS);
  const [updateDeal] = useMutation(UPDATEDEAL);

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
          cards = cards.filter(
            (card) => card.metadata.status == filter && !card.metadata.IsDeleted
          );
          break;
      }

      return { ...lane, cards };
    });
  };

  useEffect(() => {
    if (pipeToShow?.lanes && dealFilter) {
      setFilteredBoardTransactData({
        lanes: [...filterBoardCards(pipeToShow.lanes, dealFilter)],
      });
      console.log("DATA: ", filteredBoardTransactData);

      filteredBoardTransactData.lanes &&
        filteredBoardTransactData.lanes.forEach((lane) => {
          lane &&
            lane.cards &&
            lane.cards.forEach((card) => {
              const ownerId =
                card &&
                card.metadata &&
                card.metadata.owners &&
                card.metadata.owners[0] &&
                card.metadata.owners[0].id;
              if (!(ownerId in cardColors.current)) {
                cardColors.current = {
                  ...cardColors.current,
                  [ownerId]: getRandomColor(ownerId),
                };
              }
              // card.metadata.owners[0].id
            });
        });
    }
  }, [pipeToShow, dealFilter]);

  const filterTabCards = (cards, filter) => {
    return cards.filter((card) => {
      switch (filter) {
        case "all":
          return !card.IsDeleted; // remove deleted cards

        case "deleted":
          return card.IsDeleted; // get deleted cards

        default:
          return card.status == filter && !card.IsDeleted;
      }
    });
  };

  useEffect(() => {
    if (pipeToShowTab && dealFilter) {
      setFilteredTabTransactData([
        ...filterTabCards(pipeToShowTab, dealFilter),
      ]);
    }
  }, [pipeToShowTab, dealFilter]);

  useEffect(() => {
    console.log("FILTERED DATA: ", filteredTabTransactData);
  }, [filteredTabTransactData]);

  const handleDataChange = (newData) => {
    console.log("DATA CHANGE", newData);
  };

  const handleCardClick = (cardId, metadata, laneId) => {
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

  const handleCardDragEnd = (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) => {
    // handle drag within lanes - runs first
    console.log(
      `handleCardDragEnd: ${cardId}, ${sourceLaneId}, ${targetLaneId}, ${position}, ${cardDetails}`
    );

    let unfilteredSourceLane = pipeToShow.lanes.find(
      (lane) => lane?.id === sourceLaneId
    );
    let unfilteredTargetLane = pipeToShow.lanes.find(
      (lane) => lane?.id === targetLaneId
    );

    let filteredSourceLane = filteredBoardTransactData.lanes.find(
      (lane) => lane?.id === sourceLaneId
    );
    let filteredTargetLane = filteredBoardTransactData.lanes.find(
      (lane) => lane?.id === targetLaneId
    );

    let filteredSourcePosition = filteredSourceLane.cards.findIndex(
      (card) => card?.id === cardId
    );
    let filteredTargetPosition = position;

    let unfilteredSourcePosition = unfilteredSourceLane.cards.findIndex(
      (card) => card?.id === cardId
    );
    let unfilteredTargetPosition = (() => {
      if (position === 0) return 0;
      let atEnd = position >= filteredTargetLane?.cards?.length;
      let prevCardFilteredPosition = position - atEnd;
      let prevCardAtPosition =
        filteredTargetLane?.cards[prevCardFilteredPosition];
      let prevCardUnfilteredPosition = unfilteredTargetLane?.cards.findIndex(
        (card) => {
          return card?.id === prevCardAtPosition?.id;
        }
      );

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
    let sourceSliceEnd =
      sourceLaneId === targetLaneId ? unfilteredTargetPosition + 1 : undefined;
    let unfilteredSourceLaneDescriptors = [
      ...unfilteredSourceLane.cards
        .slice(sourceSliceStart, sourceSliceEnd)
        .map((card, index) => {
          return {
            _id: card.metadata.descriptorId,
            position: unfilteredSourcePosition + index,
          };
        }),
    ];

    // update unfilteredTargetLane descriptors
    // including dragging up in same lane
    let targetSliceStart = unfilteredTargetPosition;
    let targetSliceEnd =
      sourceLaneId === targetLaneId ? unfilteredSourcePosition : undefined;
    let unfilteredTargetLaneDescriptors = [
      ...unfilteredTargetLane.cards
        .slice(targetSliceStart, targetSliceEnd)
        .map((card, index) => {
          return {
            _id: card.metadata.descriptorId,
            position: unfilteredTargetPosition + index + 1,
          };
        }),
    ];

    updateStageDealDescriptors({
      variables: {
        stageDealDescriptors: [
          movedCardDescriptor,
          ...unfilteredSourceLaneDescriptors,
          ...unfilteredTargetLaneDescriptors,
        ],
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
        unfilteredTargetLane.metadata.dealsStatus.toLowerCase() !==
          cardDetails?.metadata?.status?.toLowerCase()
      )
        updatedDeal = {
          ...updatedDeal,
          status: unfilteredTargetLane.metadata.dealsStatus.toLowerCase(),
        };

      console.log("UPDATED DEAL: ", updatedDeal);

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
      console.log(
        `onCardMoveAcrossLanes: ${fromLaneId}, ${toLaneId}, ${cardId}, ${addedIndex}`
      );
    }
  };

  const getCardColor = (rotting, stageChangeDate) => {
    let cardColor = "limegreen";
    let rottingDate = null;
    rottingDate = moment(stageChangeDate).add(rotting, "days");
    // console.log("ROTTING DATE: ", rottingDate);
    // console.log(
    //   "ROTTING STAGE CHANGE DIFFERENCE: ",
    //   rottingDate.diff(moment(metadata.stageChangeDate), "days")
    // );
    // console.log(
    //   "ROTTING CURRENT DIFFERENCE: ",
    //   rottingDate.diff(new Date(), "days")
    // );

    let total = rottingDate.diff(moment(stageChangeDate), "days");
    let current = rottingDate.diff(moment(), "days"); // swap date values if doesn't work as intended

    let percentageDone = ((total - current) / total) * 100;

    if (percentageDone >= 100) cardColor = "red";
    else if (percentageDone >= 75) cardColor = "yellow";

    return cardColor;
  };

  const getCard = ({ metadata, title, description, id, laneId }) => {
    const cardPrice = metadata && metadata.offerPrice ? metadata.offerPrice : 0;
    const formatted = formatter.format(cardPrice);
    const formattedPrice = formatted.slice(0, formatted.length - 3);

    let formattedDate = null;

    if (metadata?.closeDate)
      formattedDate = moment
        .parseZone(new Date(metadata.closeDate))
        .format("MM/DD/yyyy");

    let owner = null;
    let ownerId = null;
    let ownerObject = metadata?.owners[0] ? metadata?.owners[0] : null;

    if (ownerObject && ownerObject.relatedObject?.name) {
      owner = ownerObject.relatedObject.name;
      ownerId = ownerObject.relatedObject.id;
    }

    let desc = description;
    if (description && description.length > 50)
      desc = description.slice(0, 53) + "...";

    const stageChangeDate =
      metadata.stageChangeDate && moment.parseZone(metadata.stageChangeDate);

    const lane = filteredBoardTransactData.lanes.find(
      (lane) => lane.id === laneId
    );

    // console.log("STAGECHANGEDATE: ", stageChangeDate);
    // console.log("ROTTING: ", lane.metadata.rotting);

    let cardColor = "limegreen";
    if (lane?.metadata?.rotting && stageChangeDate) {
      cardColor = getCardColor(lane.metadata.rotting, stageChangeDate);
    }

    return (
      <article
        className={classes.cardStyle}
        onClick={() => handleCardClick(id, metadata, laneId)}
        style={{
          borderLeft: `4px solid ${cardColor}`,
        }}
      >
        <header className={classes.cardHeaderStyle}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className={classes.cardTitle}>{title}</span>
            {owner && <CustomAvatar text={owner} color={cardColors[ownerId]} />}
          </div>
          <div className={classes.cardSubheading}>
            <span>{formattedPrice}</span>
            {formattedDate && (
              <>
                <br />
                <span>
                  Est. Close {"  "}
                  <span style={{ fontWeight: "normal" }}>{formattedDate}</span>
                </span>
              </>
            )}
          </div>
        </header>
        <div className={classes.cardDescStyle}>{desc}</div>
      </article>
    );
  };

  const getLaneHeader = ({ title, id, metadata }) => {
    const lane = filteredBoardTransactData?.lanes?.find(
      (lane) => lane.id === id
    );
    let dealCount = 0;
    if (lane) dealCount = lane?.cards.length;

    let priceSum = 0;
    lane &&
      lane.cards.forEach(
        (card) =>
          (priceSum +=
            card && card.metadata && card.metadata.offerPrice
              ? card.metadata.offerPrice
              : 0)
      );

    const formatted = formatter.format(priceSum);
    const formattedTotal = formatted.slice(0, formatted.length - 3);

    let forecast = null;
    let forecastFormatted = "";
    if (priceSum > 0 && metadata.dealProbability > 0) {
      forecast = priceSum * (metadata.dealProbability / 100);
      let formatted2 = formatter.format(forecast);
      forecastFormatted = formatted2.slice(0, formatted2.length - 3);
    }

    return (
      <header className={classes.laneHeaderStyle}>
        <span className={classes.laneHeaderSpanStyle}>
          {title} ({dealCount})
        </span>
        <span className={classes.laneHeaderTotalStyle}>
          Total:{" "}
          <span className={classes.laneHeaderNotBold}>{formattedTotal}</span>
        </span>
        <span className={classes.laneHeaderTotalStyle}>
          Forecast:{" "}
          <span className={classes.laneHeaderNotBold}>
            {forecast === 0 || forecast === null ? "--" : forecastFormatted}
          </span>
        </span>
      </header>
    );
  };

  return (
    <div className={classes.root}>
      {stateApp.dealDialog && <Drawer />}
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
      <TransactAppBar dealFilter={dealFilter} setDealFilter={setDealFilter} />
      {pipeToShow ? (
        <div className={classes.boardAndTable}>
          {stateApp.dealDisplayType === "board" && (
            <Board
              className={classes.list}
              style={{ backgroundColor: "#fff" }}
              // data={filteredBoardTransactData || transactData}
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
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                backgroundColor: "#F2F2F2",
                textAlign: "center",
                marginBottom: "10px",
              }}
              components={{
                LaneHeader: (laneProps) => getLaneHeader(laneProps),
                Card: (cardProps) => getCard(cardProps),
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
            <M1nTable
              dense
              filteredTabTransactData={filteredTabTransactData}
              parent="TransactDeals"
            />
          )}
        </div>
      ) : pipeToShow === false ? (
        <h1 style={{ marginTop: 80 }}>
          No pipelines currently exist - please setup a new pipeline and
          corresponding stages.
        </h1>
      ) : (
        <CircularProgress size={80} disableShrink color="secondary" />
      )}
    </div>
  );
}
