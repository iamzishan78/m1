import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import arrayMove from "array-move";
import React, { useContext, useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { DashboardContext } from "../DashboardContext";
import ProdCard from "./ProdCard"
import CardWrapper from "./CardTemplate";
import TwitterCard from "./TwitterCard";
import StockCard from "./StockCard";
import RigsCard from "./RigsCard"
import RSSFeed from "./RssFeed"

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  cgriditem: {
    height: "800px",

  },
  cgridcard: {
    height: "100%",
  },
}));

const SortableItem = SortableElement(({ content }) => {
  const classes = useStyles();


  const sizeHandle = (ele) => {
    
    if(ele=="x"){
      var arr = [3,3,4,4,6];
    } else if(ele=="2x"){
      var arr = [5,8,8,8,8];
    } else if(ele=="bi"){
      var arr = [5,9,12,12,12];
    } else if(ele=="full"){
      var arr = [12,12,12,12,12];
    }
    else {
      var arr = [6,6,6,6,6];
    }
    return(arr);

  };

  const sizeArray = sizeHandle(content.size);



  return (
    <Grid 
        item 
        xl={sizeArray[0]}
        lg={sizeArray[1]}
        md={sizeArray[2]}
        sm={sizeArray[3]}
        xs={sizeArray[4]}
        className={classes.cgriditem}>
      <Card className={classes.cgridcard}>{content.el}</Card>
    </Grid>
  );
});

const SortableList = SortableContainer(({ items }) => {
  return (
    <Grid item container 
      spacing={4}>
      {items.map((content, index) => {
        return (
          <SortableItem
            key={`l-${content.key}`}
            index={index}
            content={content}
          />
        );
      })}
    </Grid>
  );
});

const CardGrid = () => {
  const [stateDashboard, setStateDashboard] = useContext(DashboardContext);
  const [items, setItems] = useState([
    { el: <RigsCard title={5} />, size: "bi", key: 1 },
    { el: <StockCard title={3} />, size: "x", key: 2},
    { el: <ProdCard title={1} />, size: "bi", key: 3 },
    { el: <RSSFeed title={4} />, size: "x", key: 4 },
    { el: <TwitterCard title={2} />, size: "x", key: 5 },   
    
    
  ]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const diff = Math.abs(oldIndex - newIndex);
    const swappable = diff == 1 || diff == 2;
    if (swappable) {
      setItems((items) => {
        // const newArr = arrayMove(items, oldIndex, newIndex); //moves items forward
        const temp = [...items];
        [temp[oldIndex], temp[newIndex]] = [
          temp[newIndex],
          temp[oldIndex],
        ]; // swaps items at oldIndex and newIndex
        const cardIndices = temp.map(({ key }, index) => ({ key, index }));
        setStateDashboard({ ...stateDashboard, cardIndices });
        return temp;
      });
    }
    return;
  };
  return (
    <SortableList
      items={items}
      transitionDuration={0}
      onSortEnd={onSortEnd}
      useDragHandle={true}
      useWindowAsScrollContainer={true}
      disableAutoscroll={true}
    />
  );
};

export default CardGrid;
