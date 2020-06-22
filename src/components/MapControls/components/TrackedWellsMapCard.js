import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { AppContext } from "../../../AppContext";
import { useLazyQuery } from "@apollo/react-hooks";
import { WELLSQUERY } from "../../../graphQL/useQueryWells";
import { TRACKSBYUSERANDOBJECTTYPE } from "../../../graphQL/useQueryTracksByUserAndObjectType";
import { USERBYEMAIL } from "../../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed
import Draggable from "react-draggable";

const useStyles = makeStyles((theme) => ({


  rootList: {
    width: "250px",
    height: "10vh",
    position: "relative",
    top: "5vh",
    left: "82px",
  },
  wellList: {
    // width: "250px",
    // height: "10vh",
    // position: "relative",
    // top: "5vh",
    // left: "82px",
    zIndex: 4,
    background: "rgba(255,255,255,0)",
    color: "rgba(23, 170, 221, 1)",
    overflowY: "auto",
    padding: 0,
  },
  wellListItem: {
    fontFamily: "Poppins",
    "&:hover": {
      background: "#4B618F",
    },
    backgroundColor: "rgba(38, 52, 81, 1.0)",
    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
      color: theme.palette.common.white,
    },
    "& .MuiListItemText-secondary": {
      color: "rgba(23, 170, 221, 1)",
    },
  },
  subHeader: {
    color: "white",
    backgroundColor: "#011133 !important",
  },
}));

export default function TrackedWellsMapCard(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = useState(true);

  const [getWells, { data: dataWells }] = useLazyQuery(WELLSQUERY);
  const [tracksByUserAndObjectType, { data: dataTracks }] = useLazyQuery(
    TRACKSBYUSERANDOBJECTTYPE
  );

  useEffect(() => {
    if (stateApp.user && stateApp.user.mongoId) {
      setLoading(true);

      tracksByUserAndObjectType({
        variables: {
          userId: stateApp.user.mongoId,
          objectType: "well",
        },
      });
    }
  }, [stateApp.user]);

  useEffect(() => {
    if (dataTracks && dataTracks.tracksByUserAndObjectType) {
      if (dataTracks.tracksByUserAndObjectType.length !== 0) {
        const tracksIdArray = dataTracks.tracksByUserAndObjectType.map(
          (track) => track.trackOn
        );

        getWells({
          variables: {
            wellIdArray: tracksIdArray,
            authToken: stateApp.user.authToken,
          },
        });
      } else {
        setRows([]);
        setLoading(false);
      }
    }
  }, [dataTracks]);

  useEffect(() => {
    if (dataWells) {
      if (
        dataWells.wells &&
        dataWells.wells.results &&
        dataWells.wells.results.length > 0
      ) {
        console.log(dataWells);
        setRows(dataWells.wells.results);

        setStateApp((state) => ({
          ...state,
          trackedwells: dataWells.wells.results,
        }));
      } else {
        setRows([]);
      }
      setLoading(false);
    }
  }, [dataWells]);

  const handleListClick = (well) => {
    setStateApp((state) => ({ 
      ...state,
      popupOpen: false,
      selectedWell: null,
      selectedWellId: well.id,
      flyTo: well ? {longitude: well.longitude, latitude: well.latitude} : null
    }));
  };

  return rows && rows.length > 0 ? (

    <div className={classes.mapWrapper}>
      <Draggable>

        <div className={classes.rootList}>
          <List dense className={classes.wellList} aria-label="secondary wells">
            <ListItem className={classes.subHeader} key="subheader" button>
              <ListItemText
                primary={`Tracked Wells (${rows.length})`}
                secondary=""
              />
            </ListItem>
            {rows.map((well) => (
              <ListItem
                onClick={() => handleListClick(well)}
                className={classes.wellListItem}
                key={well.wellName}
                button
              >
                <ListItemText primary={well.wellName} secondary={well.operator} />
              </ListItem>
            ))}
          </List>
        </div>

      </Draggable>
    </div>

  ) : loading ? (
    <CircularProgress size={80} disableShrink color="secondary" />
  ) : (
    <Skeleton variant="rect" height={300}>
      <Typography variant="button">Not Available</Typography>
    </Skeleton>
  );
}
