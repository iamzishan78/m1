import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { useLazyQuery } from "@apollo/client";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import _ from 'lodash';

import { CONTACT_PARCEL_INTERESTS } from "graphQL/useQueryContactParcelInterest";
import ParcelIcon from "../../Shared/svgIcons/ParcelIcon";
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
  root: {
    margin: "23px 23px 0 23px",
    width: "100%"
  },

  cardContent: { width: "100%", display: "flex" },
  leftColumn: {
    textAlign: "left",
    marginRight: "18px",
  },
  addIcon: {
    backgroundColor: "#D5F4FF",
    float: "right",
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
    backgroundColor: "#D4F4F9",
    borderRadius: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  h5: { color: "#757575", marginTop: "0", textAlign: "left", },
}));

export default function ParcelsCard(props) {
  const classes = useStyles();
  let history = useHistory();
  const [count, setCount] = useState("-");
  const [netAcres, setNetAcres] = useState("-");
  const [nra, setNRA] = useState("-");

  const [getContactParcels, { data: dataContactParcels }] = useLazyQuery(CONTACT_PARCEL_INTERESTS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (props.contactData && props.contactData._id) {
      getContactParcels({
        variables: {
          contactId: props.contactData._id,
        },
      });
    }
  }, [getContactParcels, props.contactData]);

  useEffect(() => {
    if (dataContactParcels && dataContactParcels.contactParcelInterest) {
      const wells = dataContactParcels.contactParcelInterest;
      let net_acres = 0
      let nra = 0
      for (let i = 0; i < wells.length; i++) {
        const newNetAcres = wells[i].net_acres ? wells[i].net_acres : 0
        net_acres = net_acres + newNetAcres
        const newNra = wells[i].nra ? wells[i].nra : 0
        nra = nra + newNra
      }
      setNRA(nra)
      setNetAcres(net_acres)
      setCount(wells.length);
    }
  }, [dataContactParcels]);

  return (

    <Button
      className={classes.button}
      fullWidth={true}
      variant='outlined'
    // style={{justifyContent: "flex-start"}}
    >

      <div className={classes.root} onClick={() => {
        history.push(`/contact/details/${props.contactData._id}/parcels`)
      }}>
        <div>
          <h4 style={{ marginTop: "0", float: "left" }}>Parcels ({count})</h4>
          {/* <IconButton
          size="small"
          className={classes.addIcon}
        >
          <AddIcon htmlColor="rgb(28 173 225 / 81%)" />
        </IconButton> */}
        </div>
        <div className={classes.cardContent}>
          <div className={classes.leftColumn}>
            <div className={classes.icon}>
              <ParcelIcon />
            </div>
          </div>

          <div>
            <h5 className={classes.h5}>
              Net Acres
              <br />
              <span className={classes.lastContactedSpan}>{netAcres}</span>
            </h5>
            <h5 className={classes.h5}>
              Net Royalty Acres
              <br />
              <span className={classes.lastContactedSpan}>{nra}</span>
            </h5>
          </div>
        </div>
      </div>
    </Button>
  );
}
