import React, { useContext, useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import Tooltip from "@material-ui/core/Tooltip";
import { AppContext } from "../../AppContext";
import { TOGGLETRACK } from "../../graphQL/useMutationToggleCreateRemoveTrack";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: (props) => (props.iconZiseSmall ? "30px" : "48px"),
    height: (props) => (props.iconZiseSmall ? "30px" : "48px"),
    borderRadius: "50%",
    border: 0,
    color: (props) => (props.dark ? "rgb(1,17,51)" : "#fff"),
    backgroundColor: "transparent !important",
    "&:hover": {
      backgroundColor: (props) =>
        props.dark ? "#dadbde !important" : "#031d40 !important",
    },
  },

  selected2: {
    color: "rgba(1, 17, 51, 0.97) !important",
    background: "rgba(1, 17, 51, 0)",
    "&:hover": {
      color: "#fff",
      background: "#efefef",
    },
  },
}));

export default function TrackToggleButton(props) {
  let classes = useStyles(props);
  const [stateApp] = useContext(AppContext);
  const [selected, setSelected] = useState(false);
  const [toggleCreateRemoveTrack, { data, loading }] = useMutation(TOGGLETRACK);

  useEffect(() => {
    if (props.target) {
      if (props.target.isTracked) {
        setSelected(true);
      } else {
        setSelected(false);
      }
    }
  }, [props.target]);

  useEffect(() => {
    if (
      data &&
      data.toggleCreateRemoveTrack &&
      data.toggleCreateRemoveTrack.success
    ) {
      setSelected(data.toggleCreateRemoveTrack.tracking);
    }
  }, [data]);

  const handleToggle = () => {
    toggleCreateRemoveTrack({
      variables: {
        track: {
          user: stateApp.user.mongoId,
          objectType: props.targetLabel,
          trackOn: props.targetSourceId,
        },
      },
      refetchQueries: ["tracksByUserAndObjectType", "trackByUserAndObjectId"], ////add all queries for components with track icons////
      awaitRefetchQueries: true,
    });
  };

  return (
    <Tooltip
      title={`${props.target.isTracked ? "Untrack" : "Track"}${
        props.targetLabel
          ? " " +
            props.targetLabel.charAt(0).toUpperCase() +
            props.targetLabel.slice(1)
          : ""
      }`}
      placement="top"
    >
      <ToggleButton
        size="small"
        classes={{ root: classes.root }}
        value="check"
        selected={selected}
        onChange={(e) => {
          e.stopPropagation();
          e.persist();
          handleToggle();
        }}
      >
        {loading ? (
          <CircularProgress size={28} color="secondary"></CircularProgress>
        ) : selected ? (
          <MyLocationIcon color="secondary" />
        ) : (
          <MyLocationIcon />
        )}
      </ToggleButton>
    </Tooltip>
  );
}
