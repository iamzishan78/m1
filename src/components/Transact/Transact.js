////////////////////////////////////////////////////////////////////////////////
//////////react-trello info: https://github.com/rcdexta/react-trello  //////////
////////////////////////////////////////////////////////////////////////////////

import React, { useContext, useState, useEffect, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { AppContext } from "../../AppContext";
import Board from "react-trello";
import { makeStyles } from "@material-ui/core/styles";
import { TransactContext } from "./TransactContext";
import { TRANSACTIONDATA } from "../../graphQL/useQueryTransactionData";
import { UPDATETRANSACTION } from "../../graphQL/useMutationUpdateTransaction";
import { UPDATESTAGEDEALDESCRIPTORS } from "../../graphQL/useMutationUpdateStageDealDescriptors";
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
import CallMadeIcon from "@material-ui/icons/CallMade";
import M1nTable from "../Shared/M1nTable/M1nTable";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  list: {
    overflowX: "auto !important",
    height: "100%",
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
}));

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

    if (
      sourceLaneId !== targetLaneId &&
      unfilteredTargetLane?.metadata?.dealsStatus &&
      unfilteredTargetLane.metadata.dealsStatus.toLowerCase() !==
        cardDetails?.metadata?.status?.toLowerCase()
    ) {
      updateDeal({
        variables: {
          deal: {
            _id: cardId,
            status: unfilteredTargetLane.metadata.dealsStatus.toLowerCase(),
          },
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

  return (
    <div className={classes.root}>
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
              }}
              cardStyle={{
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                backgroundColor: "#F2F2F2",
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
          No pipelines currently exist - please setup a new pipeline and corresponding stages.
        </h1>
      ) : (
        <CircularProgress size={80} disableShrink color="secondary" />
      )}
    </div>
  );
}
