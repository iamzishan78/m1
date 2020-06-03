import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import React from "react";
import { sortableHandle } from "react-sortable-hoc";

const useStyles = makeStyles((theme) => ({
  header: {
    padding: "8px 8px 0 8px",
  },
}));

const DragHandle = sortableHandle(() => (
  <IconButton aria-label="drag">
    <DragIndicatorOutlinedIcon fontSize="default" />
  </IconButton>
));

const Template = ({ title }) => {
  const classes = useStyles();
  return (
    <CardHeader
      action={<DragHandle />}
      title={`Card-${title}`}
      className={classes.header}
    />
  );
};
export default Template;
