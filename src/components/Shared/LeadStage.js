import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { UPDATECONTACT } from "../../graphQL/useMutationUpdateContact";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  stepper: {
    width: "100%",
    height: "100%",
    display: "flex",
    backgroundColor: "#fff",
  },
  step: {
    flex: "1",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    position: "relative",
    textAlign: "center",
    padding: "10px 15px",

    "& + div": {
      marginLeft: "3px",
    },
  },
  activeStep: {
    color: "#fff",
    marginLeft: "5px",
    backgroundColor: "#011133",
  },
  inActiveStep: {
    color: "#011133",
    marginLeft: "5px",
    backgroundColor: "#E2E9F0",
  },
  circle: {
    backgroundColor: "#fff",
    width: 20,
    height: 20,
    borderRadius: 10,
    border: "1px solid #eee",
    zIndex: 1,
    position: "absolute",
    top: "50%",
    right: "-10px",
    marginTop: "-10px",
    boxShadow: "0px 0px 5px 2px #0002",
  },
  arrow: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRight: "2px solid #000",
    borderTop: "2px solid #000",
    transform: "rotate(45deg)",
    top: "50%",
    marginTop: "-4px",
    left: "3px",
  },
}));

const Step = ({ name, active, onClick, last }) => {
  const classes = useStyles();
  return (
    <div
      className={`${classes.step} ${
        active ? classes.activeStep : classes.inActiveStep
      }`}
      onClick={onClick}
    >
      <h4 style={{ margin: 0 }}>{name}</h4>
      {active && !last && (
        <div className={classes.circle}>
          <div className={classes.arrow} />
        </div>
      )}
    </div>
  );
};

export default function LeadStage({ leadStage, id }) {
  const [updateContact] = useMutation(UPDATECONTACT);
  const leadStages = [
    "New",
    "Contacted",
    "Interested",
    "Follow-up",
    "Offer Sent",
    "Closed",
  ];

  const [currentLeadStage, setCurrentLeadStage] = useState(leadStage);

  // useEffect(() => {
  //   setCurrentLeadStage(leadStage);
  // }, [leadStage]);

  let index = leadStages.findIndex((stg) => stg === currentLeadStage);
  if (index === -1) index = 0;

  const classes = useStyles();

  const setStage = (stg) => {
    if (stg === leadStage) return;
    console.log(`setting stage ${leadStage} to ${stg} for id ${id}`);
    updateContact({
      variables: {
        contact: {
          _id: id,
          leadStage: stg,
          lastUpdateLeadStageAt: new Date().toString(),
        },
      },
      // refetchQueries: ["getContact"],
      // awaitRefetchQueries: false,
    });
    setCurrentLeadStage(stg);
  };

  return (
    <div className={classes.stepper}>
      {leadStages.map((stg, i) => (
        <Step
          name={stg}
          active={i <= index}
          last={i === leadStages.length - 1}
          key={stg}
          onClick={() => setStage(stg)}
        />
      ))}
    </div>
  );
}
