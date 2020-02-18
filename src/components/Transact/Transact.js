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
  fontFamily: "Roboto, Helvetica, Arial, sans-serif"
};

const cardStyle = {
  fontFamily: "Roboto, Helvetica, Arial, sans-serif"
};

const data_file = {
  lanes: [
    {
      id: 'lane1',
      title: 'Interested',
      //label: '2/2',
      style: laneStyle,
      cardStyle: cardStyle,
      cards: [
        {id: 'Card1', title: 'Chapman, Kyle T.', description: 'API: 42-301-4534-4556\nWell Name: Roberts 1H', label: '$93,100'},
        {id: 'Card2', title: 'Chery, Frank', description: 'API: 42-710-4431-8390\nWell Name: Thames 1H', label: '$221,800'}
      ]
    },
    {
      id: 'lane2',
      title: 'Offer Extended',
      //label: '0/0',
      style: laneStyle,
      cardStyle: cardStyle,
      cards: [
        {id: 'Card3', title: 'Avery, Jacob', description: 'API: 44-191-3212-0937\nWell Name: Jones 1H', label: '$129,320'}
      ]
    },
    {
      id: 'lane5',
      title: 'Due Diligence',
      //label: '0/0',
      style: laneStyle,
      cardStyle: cardStyle,
      cards: []
    },
    {
      id: 'lane6',
      title: 'Deal Closed',
      //label: '0/0',
      style: laneStyle,
      cardStyle: cardStyle,
      cards: []
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
        laneDraggable={false}
        cardDraggable={true}
        collapsibleLanes={false}
        editable={true}
        canAddLanes={false}
        editLaneTitle={true}
        hideCardDeleteIcon={false}
        onCardAdd = {handleCardAdd}
        onCardDelete = {handleCardDelete}
        onDataChange = {handleDataChange}
        //onCardMoveAcrossL{handleCardAdd}anes = {handleCardAdd}
        
        />
        
      </div>


    );
  }


