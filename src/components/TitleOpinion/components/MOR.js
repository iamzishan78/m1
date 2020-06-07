import React, { useContext } from "react";
import { TitleOpinionContext } from "../TitleOpinionContext";
import { makeStyles } from "@material-ui/core/styles";
import Section from "./Section";
import SectionTable from "./SectionTable";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  MSWrapper: {
    width: "100%",
    height: "100%",
  },
  genNoteClass: {
    width: "98%",
    margin: "16px !important",
    marginRight: "250px !important",
    "& .MuiInput-underline:before": {
      borderBottom: "0",
    },
  },
}));

export default function MOR() {
  const [stateTitleOpinion, setStateTitleOpinion] = useContext(
    TitleOpinionContext
  );

  let classes = useStyles();

  return (
    <div className={classes.MSWrapper}>
      {stateTitleOpinion.TOData.MORSections.map((section, i) => {
        return (
          <Section
            key={i}
            SectionIndex={i}
            MORSections={true}
            header={section.name}
            addNewSection={
              stateTitleOpinion.TOData.MORSections.length === i + 1
                ? true
                : true
            }
          >
            <SectionTable sectionData={section} sectionNumber={i} MOR={true} />
          </Section>
        );
      })}
      <Section
        header="General Notes"
        className={classes.MSWrapper}
        generalNotes={true}
      >
        <TextField
          className={`${classes.genNoteClass}`}
          id="genNotes"
          multiline
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("genNotes").focus();
          }}
          value={stateTitleOpinion.TOData.generalNotes}
          onChange={(e) => {
            setStateTitleOpinion({
              ...stateTitleOpinion,
              edited: true,
              TOData: {
                ...stateTitleOpinion.TOData,
                generalNotes: e.target.value,
              },
            });
          }}
        />
      </Section>
    </div>
  );
}
