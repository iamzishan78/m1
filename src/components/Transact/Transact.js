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
// const data_file = {
//   lanes: [
//     {
//       id: "lane1",
//       title: "Offer Preparation",
//       cards: [
//         {
//           id: "Card1",
//           title: "THORNTON, CHARLES T",
//           description:
//             "API: 4230130541\nWell Name: CHRISTOPHER -38- 4\nNRI: 0.017857\nTax Value: $10,860",
//           label: "$103,100",
//         },
//       ],
//     },
//     {
//       id: "lane2",
//       title: "Offer Extended",
//       cardStyle: { borderColor: "#EBC253" },
//       cards: [
//         // {
//         //   id: "Card3",
//         //   title: "SMITH, JAMES E",
//         //   description:
//         //     "Location: WARD, TX\nRoyalty: 20%\nAcreage: 4.83 NMA (7.728 NRA)\nPrice Per NMA: $15,000",
//         //   label: "$115,900",
//         // },
//         // {
//         //   id: "Card2",
//         //   title: "CHRISTOPHER, EDITH",
//         //   description:
//         //     "API: 4230130541\nWell Name: CHRISTOPHER -38- 4\nNRI: 0.005952\nTax Value: $3,620",
//         //   label: "$54,739",
//         // },
//       ],
//     },
//     {
//       id: "lane3",
//       title: "Accepted - Due Diligence",
//       cardStyle: { borderColor: "#EBC253" },
//       cards: [
//         {
//           id: "Card4",
//           title: "JONES, MICHAEL F",
//           description:
//             "Location: UPTON, TX\nRoyalty: 12.5%\nAcreage: 10.2 NMA (10.2 NRA)\nPrice Per NMA: $32,000",
//           label: "$326,400",
//         },
//       ],
//     },
//     {
//       id: "lane4",
//       title: "Deal - Closed",
//       cardStyle: { borderColor: "#35DA97" },
//       cards: [
//         {
//           id: "Card5",
//           title: "MOUSSEAU, VICKI L",
//           description:
//             "Location: LEA, NM\nRoyalty: 18.75%\nAcreage: 6.7 NMA (10.05 NRA)\nPrice Per NMA: $18,000",
//           label: "$180,900",
//         },
//         {
//           id: "Card6",
//           title: "CANON, MICHAEL J",
//           description:
//             "Location: REEVES, TX\nRoyalty: 15.625%\nAcreage: 43 NMA (53.75 NRA)\nPrice Per NMA: $32,000",
//           label: "$571,094",
//         },
//       ],
//     },
//     {
//       id: "lane5",
//       title: "Offer - Rejected",

//       cards: [
//         {
//           id: "Card7",
//           title: "SCARBOROUGH, KATHRYN",
//           description:
//             "Location: LOVING, TX\nRoyalty: 12.5%\nAcreage: 3 NMA (3 NRA)\nPrice Per NMA: $19,000",
//           label: "$57,000",
//         },
//         {
//           id: "Card8",
//           title: "TRAYLOR, MARY ELIZABETH",
//           description:
//             "API: 4230133032\nWell Name: PISTOL 24-24 2H\nNRI: 0.046743\nTax Value: $215,690",
//           label: "$943,291",
//         },
//         {
//           id: "Card9",
//           title: "KING, JACOB B",
//           description:
//             "Location: REEVES, TX\nRoyalty: 20%\nAcreage: 150 NMA (240 NRA)\nPrice Per NMA: $9,500",
//           label: "$2,280,000",
//         },
//       ],
//     },
//   ],
// };

const transact_data = {
  lanes: [
    {
      id: "lane1",
      title: "Offer Preparation",
      cards: [
        {
          isDeleted: false,
          contactName: "test contact",
          title: "new deal",
          contactId: "5f9827ad6b6638003099563f",
          label: "$500",
          description: "asdasdasd",
          laneId: "lane1",
          dealState: "lost",
          id: "aaab4376-0bc4-429b-8aef-0fde972c1b41",
        },
        {
          isDeleted: false,
          contactName: "test123",
          title: "TESTESTEST",
          contactId: "5f97f1b16b66380030995638",
          label: "$1",
          description: "1234567890",
          laneId: "lane1",
          dealState: null,
          id: "210f14e6-0791-45fe-a001-964af2056809",
        },
        {
          isDeleted: false,
          contactName: "ESTEBAN MORELL",
          title: "new",
          contactId: "5f5d4e25e7dc0c00261e13c9",
          label: "$123",
          description: "123",
          laneId: "lane1",
          dealState: "won",
          id: "6178f426-bfe2-47c1-940c-d993630f4dbc",
        },
      ],
      currentPage: 1,
    },
    {
      id: "lane2",
      title: "Offer Extended",
      cards: [
        {
          isDeleted: false,
          contactName: "finalcontacttest123",
          title: "123",
          contactId: "5f973e56c6bf54002e865a06",
          label: "$1222",
          description: "1234134",
          laneId: "lane2",
          dealState: "won",
          id: "0e3a9a4c-038d-4de3-875d-84aa9080570e",
        },
        {
          isDeleted: false,
          contactName: "12",
          title: "12212",
          contactId: "5f9827566b6638003099563d",
          label: "$12",
          description: "122",
          laneId: "lane2",
          dealState: "lost",
          id: "3bfdfdd2-270b-4aa9-bdef-16686553c6be",
        },
      ],
      currentPage: 1,
    },
    {
      id: "lane3",
      title: "Accepted - Due Diligence",

      cards: [
        {
          contactName: "finalcontacttest123",
          title: "final test 2",
          label: "$202",
          description: "stuff",
          id: "b8279aa6-0865-478b-9a83-087ecfe03b39",
          contactId: "5f973e56c6bf54002e865a06",
          laneId: "lane3",
        },
      ],
      currentPage: 1,
    },
    {
      id: "lane4",
      title: "Deal Closed",
      cards: [
        {
          isDeleted: false,
          contactName: "newcontact2",
          title: "new deal fix",
          contactId: "0981a049-c7fd-408f-a616-464f0758535b",
          label: "$50000",
          description: "new deal test2",
          laneId: "lane4",
          dealState: "won",
          id: "1766847b-73a3-48ed-9588-dcf7470e9689",
        },
        {
          title: "bgfix123",
          label: "$500",
          description: "test",
          id: "15d04b3b-fae6-4ef2-8828-f1ff26e216c4",
          laneId: "lane4",
        },
      ],
      currentPage: 1,
    },
    {
      id: "lane5",
      title: "Offer Rejected",
      cards: [
        {
          contactName: "finalcontacttest123",
          title: "final test 123",
          contactId: "5f973e56c6bf54002e865a06",
          label: "$5555",
          description: "stuff",
          laneId: "lane5",
          id: "0b9cf478-21aa-4e32-bca2-d1167cb3b736",
        },
      ],
      currentPage: 1,
    },
  ],
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "#efefef",
  },
  list: {
    overflowX: "auto !important",
    height: "100%",
  },
}));

let formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const sumDeals = (deals) => {
  let sum = 0;
  deals.forEach(
    (card) =>
      (sum += parseFloat(card.label.split("$").join("").split(",").join("")))
  );
  const formatted = formatter.format(sum);
  return formatted.slice(0, formatted.length - 3);
};

export default function Transact() {
  const classes = useStyles();
  // const [stateTransact, setStateTransact] = useContext(TransactContext);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [transactData, setTransactData] = useState();
  const [filteredTransactData, setFilteredTransactData] = useState(null);
  const prevFiltertedTransactData = usePrevious(filteredTransactData);
  const [id, setId] = useState();
  const [allDeals, setAllDeals] = useState([]);
  const [openDeals, setOpenDeals] = useState([]);
  const [wonDeals, setWonDeals] = useState([]);
  const [lostDeals, setLostDeals] = useState([]);
  const [deletedDeals, setDeletedDeals] = useState([]);

  const [getTransactionData, { loading, data }] = useLazyQuery(TRANSACTIONDATA);
  const [updateTransaction] = useMutation(UPDATETRANSACTION);

  const [dealDisplayType, setDealDisplayType] = useState("board");
  const [dealFilter, setDealFilter] = useState("open");
  const prevDealFilter = usePrevious(dealFilter);

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      getTransactionData({
        variables: {
          userId: stateApp.user.mongoId,
        },
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (
      !loading &&
      data?.transactionData?.allData?.lanes &&
      data.transactionData.allData.lanes.length > 0
    ) {
      const lanes = data?.transactionData?.allData?.lanes;

      // get all deals
      const all = [];
      lanes.forEach((deal) => {
        deal.cards.forEach((card) => {
          all.push(card);
        });
      });
      setAllDeals(all);
    }
  }, [data]);

  useEffect(() => {
    let open = [];
    let won = [];
    let lost = [];
    let deleted = [];
    allDeals.forEach((card) => {
      if (card.dealState === "won") won.push(card);
      else if (card.dealState === "lost") lost.push(card);
      else if (card.isDeleted) deleted.push(card);
      else open.push(card);
    });

    setOpenDeals(open);
    setWonDeals(won);
    setLostDeals(lost);
    setDeletedDeals(deleted);
  }, [allDeals]);

  useEffect(() => {
    if (transactData) {
      let lanes = transactData.lanes;
      let filterted = filterCards(lanes, dealFilter);
      console.log("TRANSACT DATA", transactData.lanes);
      console.log("FILTERED DATA", dealFilter, filterted);

      setFilteredTransactData({ lanes: [...filterted] });

      updateTransaction({
        variables: {
          transactionId: id,
          transaction: { allData: transactData, user: stateApp.user.mongoId },
        },
        refetchQueries: ["getTransactionData"],
        awaitRefetchQueries: true,
      });
    }
  }, [transactData, dealFilter]);

  // const didLaneChange = (current, prev) => {
  //   let changed = false;
  //   console.log(current, prev);

  //   for (let i = 0; i < current.length; i++) {
  //     if (current[i].cards.length !== prev[i].cards.length) {
  //       changed = true;
  //       break;
  //     }
  //   }

  //   return changed;
  // };

  const getChanged = (current, prev) => {
    let oldLane;
    let newLane;
    let newLaneIndex;
    let oldLaneIndex;
    let card;

    for (let i = 0; i < current.length; i++) {
      if (current[i].cards.length > prev[i].cards.length) {
        newLane = current[i];
        newLaneIndex = i;
      } else if (current[i].cards.length < prev[i].cards.length) {
        oldLane = current[i];
        oldLaneIndex = i;
      }
    }

    console.log(current, prev, newLaneIndex, oldLaneIndex);
    if (newLaneIndex !== undefined && oldLaneIndex !== undefined) {
      card = current[newLaneIndex].cards.find(
        (card) =>
          prev[oldLaneIndex].cards.findIndex((c) => c.id === card.id) !== -1
      );
    }

    return { oldLane, newLane, oldLaneIndex, newLaneIndex, card };
  };

  useEffect(() => {
    if (
      filteredTransactData &&
      prevFiltertedTransactData &&
      !isEqual(filteredTransactData, prevFiltertedTransactData)
    ) {
      console.log("CURRENT DATA", filteredTransactData);
      console.log("PREV DATA", prevFiltertedTransactData);

      // HANDLE LANE CHANGE HERE
      // const {
      //   oldLane,
      //   newLane,
      //   card: movedCard,
      //   oldLaneIndex,
      //   newLaneIndex,
      // } = getChanged(
      //   filteredTransactData.lanes,
      //   prevFiltertedTransactData.lanes
      // );

      // console.log(
      //   oldLaneIndex,
      //   newLaneIndex,
      //   oldLane,
      //   newLane,
      //   movedCard,
      //   transactData
      // );

      // setTransactData((prev) => {
      //   const td = { ...prev };

      //   let updatedOldLaneCards = td.lanes[oldLaneIndex].cards.filter(
      //     (card) => card.id !== movedCard.id
      //   );
      //   let updatedOldLane = {
      //     ...td.lanes[oldLaneIndex],
      //     cards: updatedOldLaneCards,
      //   };

      //   let updatedNewLaneCards = [...td.lanes[newLaneIndex].cards, movedCard];
      //   let updatedNewLane = {
      //     ...td.lanes[oldLaneIndex],
      //     cards: updatedNewLaneCards,
      //   };

      //   const before =
      //     oldLaneIndex < newLaneIndex ? oldLaneIndex : newLaneIndex;
      //   const laneBefore =
      //     oldLaneIndex < newLaneIndex ? updatedOldLane : updatedNewLane;

      //   const after = before === newLaneIndex ? oldLaneIndex : newLaneIndex;
      //   const laneAfter =
      //     before === newLaneIndex ? updatedOldLane : updatedNewLane;

      //   console.log(td);
      //   console.log(td, laneBefore, laneAfter, before, after);
      //   return {
      //     // ...td,
      //     lanes: [
      //       ...td.lanes.slice(0, before),
      //       laneBefore,
      //       ...td.lanes.slice(before + 1, after),
      //       laneAfter,
      //       ...td.lanes.slice(after + 1),
      //     ],
      //   };
      // });
    }
  }, [filteredTransactData]);

  const filterCards = (lanes, filter) => {
    return lanes.map((lane) => {
      let title = getLaneTitle(lane.id);
      let cards = [];
      if (filter === "all") {
        lane.cards.forEach(
          (card) => !card.isDeleted && cards.push({ ...card })
        ); // remove deleted cards
      } else if (filter === "won") {
        lane.cards.forEach(
          (card) =>
            !card.isDeleted &&
            card.dealState === "won" &&
            cards.push({ ...card })
        ); // get won cards
      } else if (filter === "lost") {
        lane.cards.forEach(
          (card) =>
            !card.isDeleted &&
            card.dealState === "lost" &&
            cards.push({ ...card })
        ); //get lost cards
      } else if (filter === "open") {
        lane.cards.forEach(
          (card) =>
            !card.isDeleted && !card.dealState && cards.push({ ...card })
        ); // get open cards
      } else if (filter === "deleted") {
        lane.cards.forEach((card) => card.isDeleted && cards.push({ ...card })); // get deleted cards
      }
      return { ...lane, title, cards };
    });
  };

  const getLanesWithFixedTitles = (lanes) => {
    return lanes.map((lane) => {
      let title = getLaneTitle(lane.id);
      let cards = [];
      lane.cards.forEach((card) => cards.push({ ...card }));
      return { ...lane, title, cards };
    });
  };

  useEffect(() => {
    if (
      data &&
      data.transactionData &&
      data.transactionData.allData &&
      data.transactionData.allData.lanes
    ) {
      setTransactData({
        ...data.transactionData.allData,
        lanes: getLanesWithFixedTitles(data.transactionData.allData.lanes),
      });
      setId(data.transactionData._id);
    }
  }, [data]);

  // useEffect(() => {
  //   if (transactData) {
  //     setFilteredTransactData(transactData);
  //   }
  // }, [transactData]);

  const handleDataChange = (newData) => {
    console.log("DATA CHANGE", newData);
    setFilteredTransactData(newData);
    // updateTransaction({
    //   variables: {
    //     transactionId: id,
    //     transaction: { allData: newData, user: stateApp.user.mongoId },
    //   },
    //   refetchQueries: ["getTransactionData"],
    //   awaitRefetchQueries: true,
    // });
  };

  const handleCardClick = (cardId, metadata, laneId) => {
    setStateApp((stateApp) => ({
      ...stateApp,
      dealDialog: true,
      activeDeal: {
        cardId,
        laneId,
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
    if (sourceLaneId !== targetLaneId) {
      const lanes = transactData.lanes;
      const sourceLane = lanes.find((lane) => lane.id === sourceLaneId);
      const targetLane = lanes.find((lane) => lane.id === targetLaneId);
      const sourceLaneIndex = lanes.findIndex(
        (lane) => lane.id === sourceLaneId
      );
      const targetLaneIndex = lanes.findIndex(
        (lane) => lane.id === targetLaneId
      );

      const updatedSourceLane = {
        ...sourceLane,
        cards: sourceLane.cards.filter((card) => card.id !== cardId),
      };

      // const updatedTargetLane = {
      //   ...targetLane,
      //   cards: [
      //     ...targetLane.cards.slice(0, position),
      //     { ...cardDetails },
      //     ...targetLane.cards.slice(position + 1),
      //   ],
      // };

      const updatedTargetLane = {
        ...targetLane,
        cards: [...targetLane.cards, { ...cardDetails }],
      };

      let updatedLanes;
      if (sourceLaneIndex < targetLaneIndex) {
        updatedLanes = [
          ...lanes.slice(0, sourceLaneIndex),
          updatedSourceLane,
          ...lanes.slice(sourceLaneIndex + 1, targetLaneIndex),
          updatedTargetLane,
          ...lanes.slice(targetLaneIndex + 1),
        ];
      } else {
        updatedLanes = [
          ...lanes.slice(0, targetLaneIndex),
          updatedTargetLane,
          ...lanes.slice(targetLaneIndex + 1, sourceLaneIndex),
          updatedSourceLane,
          ...lanes.slice(sourceLaneIndex + 1),
        ];
      }

      setTransactData({ lanes: updatedLanes });
      console.log(cardId, sourceLaneId, targetLaneId, position, cardDetails);
    }
  };

  const wonSum = sumDeals(wonDeals);
  const openSum = sumDeals(openDeals);

  return !loading && data && transactData ? (
    <div className={classes.root}>
      {/* <Dialog transactData={transactData} handleDataChange={handleDataChange} /> */}
      {/* <AddDealDialog
            onClose={() =>
              setStateApp((stateApp) => ({
                ...stateApp,
                dealDialog: false,
              }))
            }
            contactId={props.contact?._id}
          /> */}

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
      <TransactAppBar
        wonLength={wonDeals.length}
        wonSum={wonSum}
        openLength={openDeals.length}
        openSum={openSum}
        dealDisplayType={dealDisplayType}
        setDealDisplayType={setDealDisplayType}
        dealFilter={dealFilter}
        setDealFilter={setDealFilter}
      />
      {dealDisplayType === "board" && (
        <Board
          className={classes.list}
          style={{ backgroundColor: "#fff" }}
          data={filteredTransactData || transactData}
          handleDragEnd={handleCardDragEnd}
          draggable={true}
          laneDraggable={false}
          cardDraggable={true}
          collapsibleLanes={true}
          editable={false}
          canAddLanes={false}
          editLaneTitle={false}
          hideCardDeleteIcon={true}
          onDataChange={handleDataChange}
          onCardClick={handleCardClick}
          laneStyle={{
            backgroundColor: "#fff",
            color: "#011133",
            fontWeight: "bold",
          }}
          cardStyle={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
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
      {dealDisplayType === "table" && <TransactTable deals={allDeals} />}
    </div>
  ) : (
    <CircularProgress size={80} disableShrink color="secondary" />
  );
}
