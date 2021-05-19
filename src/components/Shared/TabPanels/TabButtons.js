import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    tapsLabelsButtonsSelected: {
      boxShadow: "none",
      color: "#fff",
      backgroundColor: theme.palette.secondary.main,
      "&:hover": { color: "#757575", boxShadow: "none !important" },
    },
    tapsLabelsButtons: {
      boxShadow: "none",
      backgroundColor: "#fff",
      color: "#757575",
      "&:hover": { boxShadow: "none !important" },
    },
  }));

const TabButtons = ({ labels, value, setValue }) => {
    const classes = useStyles();
    return (
      <>
        {labels &&
          labels.length &&
          labels.map((label, i) => (
            <Button
              key={i}
              size="small"
              variant="contained"
              className={
                value === i
                  ? classes.tapsLabelsButtonsSelected
                  : classes.tapsLabelsButtons
              }
              onClick={() => {
                setValue(i);
              }}
            >
              {label}
            </Button>
          ))}
      </>
    );
  };

export default TabButtons
  