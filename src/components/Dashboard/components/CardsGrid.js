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

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  cgriditem: {
    height: "500px",

  },
  cgridcard: {
    height: "100%",
  },
}));

const SortableItem = SortableElement(({ content }) => {
  const classes = useStyles();
  return (
    <Grid 
        item 
        xl={content.size == "2x" ? 9 : 3} 
        lg={content.size == "2x" ? 9 : 3} 
        md={content.size == "2x" ? 8 : 4} 
        sm={content.size == "2x" ? 8 : 4} 
        xs={content.size == "2x" ? 6 : 6} 
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
    { el: <ProdCard title={1} />, size: "2x", key: 1 },
    { el: <TwitterCard title={2} />, size: "x", key: 2 },
    { el: <CardWrapper title={3} />, size: "2x", key: 3 },
    { el: <CardWrapper title={4} />, size: "x", key: 4 },
    { el: <CardWrapper title={5} />, size: "3x", key: 5 },

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
