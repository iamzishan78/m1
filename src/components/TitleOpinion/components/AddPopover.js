import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import { TitleOpinionContext } from "../TitleOpinionContext";
import IconButton from "@material-ui/core/IconButton";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import Modal from "./Modal";

const useStyles = makeStyles(theme => ({
  iconAdd: {
    top: "5px"
  },
  btn: {
    paddingBottom: "10px !important",
    width: "125px"
  }
}));

export default function SimplePopover(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [, setStateTitleOpinion] = useContext(TitleOpinionContext);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addRow = event => {
    event.preventDefault();

    setStateTitleOpinion(stateTitleOpinion => {
      const sections = props.MORSections
        ? stateTitleOpinion.TOData.MORSections
        : stateTitleOpinion.TOData.runsheetSections;
      let row = {};
      sections[props.SectionIndex].columns.map(column => {
        row = { ...row, [column.key]: "" };
      });
      sections[props.SectionIndex].rows.push(row);

      return {
        ...stateTitleOpinion,
        edited: true,
        TOData: {
          ...stateTitleOpinion.TOData,
          [props.MORSections ? "MORSections" : "runsheetSections"]: [
            ...sections
          ]
        }
      };
    });
    setAnchorEl(null);
  };

  const addColumn = name => {
    setStateTitleOpinion(stateTitleOpinion => {
      const sections = props.MORSections
        ? stateTitleOpinion.TOData.MORSections
        : stateTitleOpinion.TOData.runsheetSections;

      let id = sections[props.SectionIndex].columns.length;
      sections[props.SectionIndex].columns.push({
        key: `id${id}`,
        name,
        editable: true,
        resizable: true
      });
      sections[props.SectionIndex].rows = sections[props.SectionIndex].rows.map(
        row => {
          return { ...row, [`id${id}`]: "" };
        }
      );

      return {
        ...stateTitleOpinion,
        edited: true,
        TOData: {
          ...stateTitleOpinion.TOData,
          [props.MORSections ? "MORSections" : "runsheetSections"]: [
            ...sections
          ]
        }
      };
    });
    setAnchorEl(null);
  };

  const addSection = name => {
    setStateTitleOpinion(stateTitleOpinion => {
      const sections = props.MORSections
        ? stateTitleOpinion.TOData.MORSections
        : stateTitleOpinion.TOData.runsheetSections;
      let row = {};
      sections[props.SectionIndex].columns.map(column => {
        row = { ...row, [column.key]: "" };
      });

      sections.splice(props.SectionIndex + 1, 0, {
        name,
        columns: sections[props.SectionIndex].columns,
        rows: [row, row, row, row, row]
      });

      return {
        ...stateTitleOpinion,
        edited: true,
        TOData: {
          ...stateTitleOpinion.TOData,
          [props.MORSections ? "MORSections" : "runsheetSections"]: [
            ...sections
          ]
        }
      };
    });

    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton
        aria-label="settings"
        onClick={handleClick}
        className={classes.iconAdd}
      >
        <AddCircleRoundedIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Button
          className={classes.btn}
          aria-describedby={id}
          variant="contained"
          color="primary"
          onClick={addRow}
        >
          New Row
        </Button>
        <br />

        {/* //////removed untill the use case is redefined/////// */}
        {/* <Modal Column={addColumn} /> */}

        <Modal Section={addSection} />
      </Popover>
    </div>
  );
}
