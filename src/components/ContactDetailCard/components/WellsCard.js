import React, { useState, useEffect, useContext } from "react";
import { useLazyQuery } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import WellIcon from "../../Shared/svgIcons/well";
import { useHistory } from "react-router-dom";
import { CONTACTWELLS } from "../../../graphQL/useQueryContactWells";
import vf_currency from "../../Shared/valueformatters/vf_currency.js";
import { AppContext } from "../../../AppContext";
import AddWellInterestDialog from "./ContactsWellInterestsParcelInterests/components/AddWellInterestDialog";
import { CONTACT_WELL_CARD_DETAIL } from "graphQL/useQueryContactWellCardDetail";
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: "23px 23px 0 23px",
    cursor: "pointer",
    width: "100%"
  },

  cardContent: { width: "100%", display: "flex" },
  leftColumn: {
    textAlign: "left",
    marginRight: "18px",
  },
  addIcon: {
    backgroundColor: "#D5F4FF",
    "float": "right",
    top: "-6px",
  },
  button: {
    height: "100%",
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'left'
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
  h5: { color: "#757575", marginTop: "0", textAlign: "left", },
}));

export default function WellsCard(props) {
  const classes = useStyles();
  let history = useHistory();
  const [interestTypes, setInterestTypes] = useState("");
  const [count, setCount] = useState("-");
  const [avgTaxValues, setAvgTaxValues] = useState(0);
  const [getContactWellCardDetail, { data: dataContactWellDetail }] = useLazyQuery(CONTACT_WELL_CARD_DETAIL, {
    fetchPolicy: "cache-and-network",
  });
  const [stateApp, setStateApp] = useContext(AppContext);

  useEffect(() => {
    if (props.contactData && props.contactData._id) {
      getContactWellCardDetail({
        variables: {
          contactId: props.contactData._id,
        },
      });
    }
  }, [props.contactData]);

  useEffect(() => {
    if (dataContactWellDetail?.contactWellCardDetail) {
      setInterestTypes(dataContactWellDetail.contactWellCardDetail?.interestTypes)
      setAvgTaxValues(dataContactWellDetail.contactWellCardDetail?.avgTaxValues)
      setCount(dataContactWellDetail.contactWellCardDetail?.total)
    }
  }, [dataContactWellDetail]);

  return (

    <Button
      className={classes.button}
      fullWidth={true}
      variant='outlined'
    // style={{justifyContent: "flex-start"}}
    >
      <div className={classes.root} onClick={() => {
        history.push(`/contact/details/${props.contactData._id}/wells`)
        //   props.handleOpenExpandableCard(
        //     <ContactsWellInterestsParcelInterests
        //       activeTap={0}
        //       contactData={props.contactData}
        //     />,
        //     "Associated Interests"
        //   );
      }}
      >

        <AddWellInterestDialog
          open={stateApp.wellInterestDialog ? true : false}
          width="450px"
          onClose={() =>
            setStateApp((stateApp) => ({
              ...stateApp,
              wellInterestDialog: false,
            }))
          }
          contactId={props.contactData._id}
        />
        <div>
          <h4 style={{ marginTop: "0", "float": "left" }}>Tax Roll &amp; Well  ({count})</h4>
          <IconButton
            size="small"
            className={classes.addIcon}
            onClick={() =>
              setStateApp((stateApp) => ({
                ...stateApp,
                wellInterestDialog: true,
              }))
            }
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
              <span className={classes.lastContactedSpan}>{interestTypes || "NONE"}</span>
            </h5>
            <h5 className={classes.h5}>
              Average Value
              <br />
              <span className={classes.lastContactedSpan}>{vf_currency(avgTaxValues) || vf_currency("0")}</span>
            </h5>
          </div>
        </div>

      </div>
    </Button>

  );
}
