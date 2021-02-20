import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import WellIcon from "../../Shared/svgIcons/well";
import ContactsWellInterestsParcelInterests from "./ContactsWellInterestsParcelInterests/ContactsWellInterestsParcelInterests";
import { CONTACTWELLS } from "../../../graphQL/useQueryContactWells";
import vf_currency from "../../Shared/valueformatters/vf_currency.js";


const useStyles = makeStyles((theme) => ({
  root: {
    margin: "23px 23px 0 23px",
  },

  cardContent: { width: "100%", display: "flex" },
  leftColumn: {
    textAlign: "center",
    marginRight: "18px",
  },
  addIcon: {
    backgroundColor: "#D5F4FF",
    float: "right",
    top: "-6px",
  },
  lastContactedSpan: { fontWeight: "normal", marginBottom: "0" },
  icon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#DFEDFF",
    borderRadius: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  h5: { color: "#757575", marginTop: "0" },
}));

export default function WellsCard(props) {
  const classes = useStyles();
  const [interestTypes, setInterestTypes] = useState("");
  const [count, setCount] = useState("-");
  const [avgTaxValues, setAvgTaxValues] = useState(0);
  const [getContactWells, { data: dataContactWells }] = useLazyQuery(CONTACTWELLS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (props.contactData && props.contactData._id) {
      getContactWells({
        variables: {
          contactId: props.contactData._id,
        },
      });
    }
  }, [props.contactData]);

  useEffect(() => {
    if (dataContactWells && dataContactWells.contactWells) {
      const wells = dataContactWells.contactWells;
      setInterestTypes([...new Set(wells.map(well => well.type))].join(", "));
      setCount(wells.length);
      setAvgTaxValues(wells.map(well => well.taxValue).reduce((a, b) => (a + b)) / wells.length);
    }
  }, [dataContactWells]);

  return (
    <div className={classes.root}>
      <div>
        <h4 style={{ marginTop: "0", float: "left" }}>Wells ({ count })</h4>
        <IconButton
          size="small"
          className={classes.addIcon}
          onClick={() => {
            props.handleOpenExpandableCard(
              <ContactsWellInterestsParcelInterests
                activeTap={0}
                contactData={props.contactData}
              />,
              "Associated Interests"
            );
          }}
        >
          <AddIcon htmlColor="rgb(28 173 225 / 81%)" />
        </IconButton>
      </div>
      <div className={classes.cardContent}>
        <div className={classes.leftColumn}>
          <div className={classes.icon}>
            <WellIcon color="rgb(102 146 202" opacity="1" size="36" />
          </div>
        </div>

        <div>
          <h5 className={classes.h5}>
            Types of Interest
            <br />
            <span className={classes.lastContactedSpan}>{ interestTypes }</span>
          </h5>
          <h5 className={classes.h5}>
            Average Value
            <br />
            <span className={classes.lastContactedSpan}>{ vf_currency(avgTaxValues) }</span>
          </h5>
        </div>
      </div>
    </div>
  );
}
