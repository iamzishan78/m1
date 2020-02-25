import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import AddPopover from "./AddPopover";
import { TitleOpinionContext } from "../TitleOpinionContext";


const useStyles = makeStyles(theme => ({
  MSWrapper: {
    width: "100%",
    height: "100%"
  },
  sectionHeader: {
    paddingTop: "2px",
    paddingBottom: "0",
    fontSize: "1rem !important",
    minHeight: "40px"
  },
  secctionContent: {
    padding: "0 !important"
  },
  backgroundBlue: {
    background: "#AFDDED"
  },
  backgroundDarkBlue: {
    backgroundColor: "rgb(1,17,51)",
    color: "#FFFFFF"
  }
}));

export default function Section(props) {
  let classes = useStyles();
  const [stateTitleOpinion, setStateTitleOpinion] = React.useContext(
    TitleOpinionContext
  );

  return (
    <div
      onClick={e => {
        e.preventDefault();
        setStateTitleOpinion({
          ...stateTitleOpinion,
          lastClickedSection: props.header + props.SectionIndex
        });
      }}
    >
      <Card className={classes.MSWrapper}>
        <CardHeader
          className={`${classes.sectionHeader} sectionHeader ${
            props.generalNotes
              ? classes.backgroundDarkBlue
              : classes.backgroundBlue
          }`}
          title={props.header}
          action={
            props.addNewSection && (
              <AddPopover
                SectionIndex={props.SectionIndex}
                MORSections={props.MORSections ? props.MORSections : false}
                runsheetSections={
                  props.runsheetSections ? props.runsheetSections : false
                }
              />
            )
          }
        />

        <CardContent className={classes.secctionContent}>
          {props.children}
        </CardContent>
      </Card>
    </div>
  );
}