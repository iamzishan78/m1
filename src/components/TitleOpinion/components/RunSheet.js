import React, { useContext } from "react";
import { TitleOpinionContext } from "../TitleOpinionContext";
import { makeStyles } from "@material-ui/core/styles";
import Section from "./Section";
import SectionTable from "./SectionTable";

const useStyles = makeStyles(theme => ({
  MSWrapper: {
    width: "100%",
    height: "100%"
  }
}));

export default function RunSheet() {
  const [stateTitleOpinion] = useContext(TitleOpinionContext);

  let classes = useStyles();

  return (
    <div className={classes.MSWrapper}>
      {stateTitleOpinion.TOData.runsheetSections.map((section, i) => {
        return (
          <Section
            key={i}
            SectionIndex={i}
            runsheetSections={true}
            header={section.name}
            addNewSection={
              stateTitleOpinion.TOData.runsheetSections.length === i + 1
                ? true
                : true
            }
          >
            <SectionTable sectionData={section} sectionNumber={i} />
          </Section>
        );
      })}
    </div>
  );
}
