import React, { useContext } from 'react';
import Board from "react-trello";
import { makeStyles } from "@material-ui/core/styles";
import { TransactContext } from "./TransactContext";



const boardStyle = {
  backgroundColor: ' #eeeeee',
  //overflow: 'scroll',
  //height: '100vh !important',
  //width: '100vw !important',

};



const laneStyle = {
 // fontFamily: "Roboto, Helvetica, Arial, sans-serif"
 fontFamily: "Poppins"
};

const cardStyle = {
  //fontFamily: "Roboto, Helvetica, Arial, sans-serif"
  fontFamily: "Poppins"
};

const data_file = {
  lanes: [
    {
      id: 'lane1',
      title: 'Offer Preparation',
      //label: '2/2',
      style: laneStyle,
      cardStyle: cardStyle,
      cards: [
        {id: 'Card1', 
        title: 'THORNTON, CHARLES T', 
        description: 'API: 4230130541\nWell Name: CHRISTOPHER -38- 4\nNRI: 0.017857\nTax Value: $10,860' , label: '$103,100'}
        
        
      ]
    },
    {
      id: 'lane2',
      title: 'Offer Extended',
      //label: '0/0',
      style: laneStyle,
      cardStyle: cardStyle,
      cards: [
        {id: 'Card3', title: 'SMITH, JAMES E', description: 'Location: WARD, TX\nRoyalty: 20%\nAcreage: 4.83 NMA (7.728 NRA)\nPrice Per NMA: $15,000', label: '$115,900'},
        {id: 'Card2', title: 'CHRISTOPHER, EDITH', description: 'API: 4230130541\nWell Name: CHRISTOPHER -38- 4\nNRI: 0.005952\nTax Value: $3,620', label: '$54,739'}
      ]
    },

    {
      id: 'lane3',
      title: 'Accepted - Due Diligence',
      //label: '0/0',
      style: laneStyle,
      cardStyle: cardStyle,
      cards: [
        {id: 'Card4', title: 'JONES, MICHAEL F', description: 'Location: UPTON, TX\nRoyalty: 12.5%\nAcreage: 10.2 NMA (10.2 NRA)\nPrice Per NMA: $32,000', label: '$326,400'}
      ]
    },

    {
      id: 'lane4',
      title: 'Deal Closed',
      //label: '0/0',
      style: laneStyle,
      cardStyle: cardStyle,
      cards: [
        {id: 'Card5', title: 'MOUSSEAU, VICKI L', description: 'Location: LEA, NM\nRoyalty: 18.75%\nAcreage: 6.7 NMA (10.05 NRA)\nPrice Per NMA: $18,000', label: '$180,900'},
        {id: 'Card6', title: 'CANON, MICHAEL J', description: 'Location: REEVES, TX\nRoyalty: 15.625%\nAcreage: 43 NMA (53.75 NRA)\nPrice Per NMA: $32,000', label: '$571,094'}
            ]
    },
    {
      id: 'lane5',
      title: 'Offer Rejected',
      //label: '0/0',
      style: laneStyle,
      cardStyle: cardStyle,
      cards: [
        {id: 'Card7', title: 'SCARBOROUGH, KATHRYN', description: 'Location: LOVING, TX\nRoyalty: 12.5%\nAcreage: 3 NMA (3 NRA)\nPrice Per NMA: $19,000', label: '$57,000'},
        {id: 'Card8', title: 'TRAYLOR, MARY ELIZABETH', description: 'API: 4230133032\nWell Name: PISTOL 24-24 2H\nNRI: 0.046743\nTax Value: $215,690', label: '$943,291'},
        {id: 'Card9', title: 'KING, JACOB B', description: 'Location: REEVES, TX\nRoyalty: 20%\nAcreage: 150 NMA (240 NRA)\nPrice Per NMA: $9,500', label: '$2,280,000'},
      ]
       
    }
  ]
}



const useStyles = makeStyles(theme => ({
  root: {
    //width: '100vh',
    //height: '100vh',
    //overflow: 'auto',  
  },
  list: {
    //height:'100vh',
    //width: '100vw',
    overflowX: 'auto !important',
    //position: 'relative'
    //overflowX:'hidden',
    //overflowY: 'hidden',
    //position:'absolute',
    //top:'250px',
    //left:'82px',
    //zIndex:4,
    //background:'rgba(255,255,255,0)',
    //color: 'rgba(23, 170, 221, 1)'
  },
}));



const handleCardAdd = event => {
  console.log('card add')
  console.log(event)
};

const handleDataChange= event => {
  console.log('card data change')
  console.log(event)
};

const handleCardDelete = event => {
  console.log('card delete')
  console.log(event)
};


export default function Transact() {
  const classes = useStyles();
  const [stateTransact, setStateTransact] = useContext(TransactContext);







    return (

      <div>
        <Board  className = {classes.list}
        style={boardStyle}
        data={data_file}
        draggable = {true}
        laneDraggable={true}
        cardDraggable={true}
        collapsibleLanes={true}
        editable={true}
        canAddLanes={true}
        editLaneTitle={true}
        hideCardDeleteIcon={false}
        //onCardAdd = {handleCardAdd}
        //onCardDelete = {handleCardDelete}
        //onDataChange = {handleDataChange}
        // handleDragStart = {}
        // handleDragEnd={}
        // handleLaneDragStart
        // onDataChange
        // onCardClick
        // onCardAdd
        // onBeforeCardDelete
        // onCardDelete
        // onCardMoveAcrossLanes
        // onLaneAdd
        // onLaneDelete
        // onLaneUpdate
        // onLaneClick
        // onLaneScroll
        //onCardMoveAcrossL{handleCardAdd}anes = {handleCardAdd}
        
        />
        
      </div>


    );
  }


