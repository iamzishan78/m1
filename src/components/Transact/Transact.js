////////////////////////////////////////////////////////////////////////////////
//////////react-trello info: https://github.com/rcdexta/react-trello  //////////
////////////////////////////////////////////////////////////////////////////////

import React, { useContext, useState, useEffect } from "react";
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
  const [id, setId] = useState();
  const [allDeals, setAllDeals] = useState([]);
  const [activeDeals, setActiveDeals] = useState([]);
  const [closedDeals, setClosedDeals] = useState([]);

  const [getTransactionData, { loading, data }] = useLazyQuery(TRANSACTIONDATA);
  const [updateTransaction] = useMutation(UPDATETRANSACTION);

  const [dealDisplayType, setDealDisplayType] = useState("board");

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
    let active = [];
    let closed = [];
    let others = [];
    allDeals.forEach((card) => {
      if (card.laneId === "lane2" || card.laneId === "lane3") active.push(card);
      else if (card.laneId === "lane4") closed.push(card);
      else others.push(card);
    });

    setActiveDeals(active);
    setClosedDeals(closed);
  }, [allDeals]);

  const getLanesWithFixedTitles = (lanes) => {
    return lanes.map((lane) => {
      let title = getLaneTitle(lane.id);
      let cards = [];
      lane.cards.forEach((card) => !card.isDeleted && cards.push({ ...card })); // remove deleted cards
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

  const handleDataChange = (newData) => {
    updateTransaction({
      variables: {
        transactionId: id,
        transaction: { allData: newData, user: stateApp.user.mongoId },
      },
      refetchQueries: ["getTransactionData"],
      awaitRefetchQueries: true,
    });
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

  const closedSum = sumDeals(closedDeals);
  const activeSum = sumDeals(activeDeals);

  return !loading && data && transactData ? (
    <div className={classes.root}>
      <Dialog transactData={transactData} handleDataChange={handleDataChange} />
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
        closedLength={closedDeals.length}
        closedSum={closedSum}
        activeLength={activeDeals.length}
        activeSum={activeSum}
        dealDisplayType={dealDisplayType}
        setDealDisplayType={setDealDisplayType}
      />
      {dealDisplayType === "board" && (
        <Board
          className={classes.list}
          style={{ backgroundColor: "#fff" }}
          data={transactData}
          draggable={true}
          laneDraggable={false}
          cardDraggable={true}
          collapsibleLanes={true}
          editable={false}
          canAddLanes={false}
          editLaneTitle={false}
          hideCardDeleteIcon={false}
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
