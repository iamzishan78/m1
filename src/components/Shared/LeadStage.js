import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { UPDATECONTACT } from "../../graphQL/useMutationUpdateContact";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  stepper: {
    width: "100%",
    display: "flex",
  },
  activeStep: {
    flex: "1",
    color: "#fff",
    cursor: "pointer",
    display: "block",
    lineHeight: "1",
    position: "relative",
    textAlign: "center",
    marginLeft: "5px",
    borderColor: "transparent #fff transparent transparent",
    borderStyle: "solid",
    borderWidth: "20px 16px 20px 0px",
    backgroundColor: "#011133",

    "&::before": {
      top: "-20px",
      left: "-16px",
      width: "0",
      height: "54px",
      content: "'' !important",
      display: "block",
      position: "absolute",
      borderTop: "20px solid transparent",
      borderRight: "16px solid #011133",
      borderBottom: "20px solid transparent",
    },
  },
  inActiveStep: {
    flex: "1",
    color: "#011133",
    cursor: "pointer",
    display: "block",
    lineHeight: "1",
    position: "relative",
    textAlign: "center",
    marginLeft: "5px",
    borderColor: "transparent #fff transparent transparent",
    borderStyle: "solid",
    borderWidth: "20px 16px 20px 0px",
    backgroundColor: "#E2E9F0",

    "&::before": {
      top: "-20px",
      left: "-16px",
      width: "0",
      height: "54px",
      content: "'' !important",
      display: "block",
      position: "absolute",
      borderTop: "20px solid transparent",
      borderRight: "16px solid #E2E9F0",
      borderBottom: "20px solid transparent",
    },
  },
}));

const Step = ({ name, active, onClick }) => {
  const classes = useStyles();
  return (
    <div
      className={active ? classes.activeStep : classes.inActiveStep}
      onClick={onClick}
    >
      <h4 style={{ margin: 0 }}>{name}</h4>
    </div>
  );
};

export default function LeadStage({ leadStage, id }) {
  const [updateContact] = useMutation(UPDATECONTACT);
  const leadStages = [
    "New",
    "Contacted",
    "Interested",
    "Under Review",
    "Demo",
    "Converted/Unqualified",
  ];

  let index = leadStages.findIndex((stg) => stg === leadStage);
  if (index === -1) index = 0;

  const classes = useStyles();

  const setStage = (stg) => {
    if(stg === leadStage) return;
    console.log(`setting stage ${leadStage} to ${stg} for id ${id}`)
    updateContact({
      variables: {
        contact: {
          _id: id,
          leadStage: stg,
        },
      },
      refetchQueries: ["getContact"],
      awaitRefetchQueries: true,
    });
  };

  return (
    <div className={classes.stepper}>
      {leadStages.map((stg, i) => (
        <Step
          name={stg}
          active={i <= index}
          key={stg}
          onClick={() => setStage(stg)}
        />
      ))}
    </div>
  );
}
