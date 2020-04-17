////////////////////////////////////////////////////////////////////////////////
//////////react-trello info: https://github.com/rcdexta/react-trello  //////////
////////////////////////////////////////////////////////////////////////////////

import React, { useContext, useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { AppContext } from "../../AppContext";
import Board from "react-trello";
import { makeStyles } from "@material-ui/core/styles";
import { TransactContext } from "./TransactContext";
import { TRANSACTIONDATA } from "../../graphQL/useQueryTransactionData";
import { UPDATETRANSACTION } from "../../graphQL/useMutationUpdateTransaction";
import CircularProgress from "@material-ui/core/CircularProgress";
import { USERBYEMAIL } from "../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed

const data_file = {
  lanes: [
    {
      id: "lane1",
      title: "Offer Preparation",
      cards: [
        {
          id: "Card1",
          title: "THORNTON, CHARLES T",
          description:
            "API: 4230130541\nWell Name: CHRISTOPHER -38- 4\nNRI: 0.017857\nTax Value: $10,860",
          label: "$103,100",
        },
      ],
    },
    {
      id: "lane2",
      title: "Offer Extended",
      cards: [
        {
          id: "Card3",
          title: "SMITH, JAMES E",
          description:
            "Location: WARD, TX\nRoyalty: 20%\nAcreage: 4.83 NMA (7.728 NRA)\nPrice Per NMA: $15,000",
          label: "$115,900",
        },
        {
          id: "Card2",
          title: "CHRISTOPHER, EDITH",
          description:
            "API: 4230130541\nWell Name: CHRISTOPHER -38- 4\nNRI: 0.005952\nTax Value: $3,620",
          label: "$54,739",
        },
      ],
    },
    {
      id: "lane3",
      title: "Accepted - Due Diligence",
      cards: [
        {
          id: "Card4",
          title: "JONES, MICHAEL F",
          description:
            "Location: UPTON, TX\nRoyalty: 12.5%\nAcreage: 10.2 NMA (10.2 NRA)\nPrice Per NMA: $32,000",
          label: "$326,400",
        },
      ],
    },
    {
      id: "lane4",
      title: "Deal Closed",
      cards: [
        {
          id: "Card5",
          title: "MOUSSEAU, VICKI L",
          description:
            "Location: LEA, NM\nRoyalty: 18.75%\nAcreage: 6.7 NMA (10.05 NRA)\nPrice Per NMA: $18,000",
          label: "$180,900",
        },
        {
          id: "Card6",
          title: "CANON, MICHAEL J",
          description:
            "Location: REEVES, TX\nRoyalty: 15.625%\nAcreage: 43 NMA (53.75 NRA)\nPrice Per NMA: $32,000",
          label: "$571,094",
        },
      ],
    },
    {
      id: "lane5",
      title: "Offer Rejected",

      cards: [
        {
          id: "Card7",
          title: "SCARBOROUGH, KATHRYN",
          description:
            "Location: LOVING, TX\nRoyalty: 12.5%\nAcreage: 3 NMA (3 NRA)\nPrice Per NMA: $19,000",
          label: "$57,000",
        },
        {
          id: "Card8",
          title: "TRAYLOR, MARY ELIZABETH",
          description:
            "API: 4230133032\nWell Name: PISTOL 24-24 2H\nNRI: 0.046743\nTax Value: $215,690",
          label: "$943,291",
        },
        {
          id: "Card9",
          title: "KING, JACOB B",
          description:
            "Location: REEVES, TX\nRoyalty: 20%\nAcreage: 150 NMA (240 NRA)\nPrice Per NMA: $9,500",
          label: "$2,280,000",
        },
      ],
    },
  ],
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  list: {
    overflowX: "auto !important",
    height: "100%",
  },
}));

export default function Transact() {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const [stateTransact, setStateTransact] = useContext(TransactContext);
  const [transactData, setTransactData] = useState();
  const [id, setId] = useState();

  const [getTransactionData, { loading, data }] = useLazyQuery(TRANSACTIONDATA);
  const [updateTransaction] = useMutation(UPDATETRANSACTION);

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

  useEffect(() => {
    //////stateApp.user._id//////////temporary
    if (user._id !== "") {
      getTransactionData({
        variables: {
          userId: user._id, //////stateApp.user._id//////////temporary
        },
      });
    }
  }, [user]); ////////////remove dependency//////////temporary

  useEffect(() => {
    if (data && data.transactionData && data.transactionData.allData) {
      setTransactData(data.transactionData.allData);
      setId(data.transactionData._id);
    }
  }, [data]);

  const handleDataChange = (newData) => {
    updateTransaction({
      variables: {
        transactionId: id,
        transaction: { allData: newData, user: user._id },
      },
      refetchQueries: ["getTransactionData"],
      awaitRefetchQueries: true,
    });
  };

  const handleCardClick = (cardId, metadata, laneId) => {
    console.log("mmm");
    console.log(laneId);
  };

  return !loading && data && transactData ? (
    <div className={classes.root}>
      <Board
        className={classes.list}
        style={{ backgroundColor: " #eeeeee" }}
        data={transactData}
        draggable={true}
        laneDraggable={true}
        cardDraggable={true}
        collapsibleLanes={true}
        editable={true}
        canAddLanes={true}
        editLaneTitle={true}
        hideCardDeleteIcon={false}
        onDataChange={handleDataChange}
        onCardClick={handleCardClick}

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
    </div>
  ) : (
    <CircularProgress size={80} disableShrink color="secondary" />
  );
}
