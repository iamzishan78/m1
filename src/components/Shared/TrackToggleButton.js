import React, { useContext, useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import IconButton from "@material-ui/core/IconButton";
import { AppContext } from "../../AppContext";
import { EDGEQUERY } from "../../graphQL/useMutationCreateEdge";
import { DROPEDGEQUERY } from "../../graphQL/useMutationDropEdge";
import { CircularProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
  root: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    border: 0,
    color: props => (props.dark ? "rgb(1,17,51)" : "#fff"),
    backgroundColor: "transparent",
    transition: " background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  selected: {
    backgroundColor: "transparent !important",
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  selected2: {
    color: "rgba(1, 17, 51, 0.97) !important",
    //background: "rgba(1, 17, 51, 0.97) !important"
    background: "rgba(1, 17, 51, 0)",
    "&:hover": {
      color: "#fff",
      background: "#efefef"
    }
  }
}));

export default function TrackToggleButton(props) {
  let classes = useStyles(props);
  let theme = useTheme();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [selected, setSelected] = useState(
    props.target ? props.target.IsTracked : false
  );
  const [createGraphEdge, { data, loading, error }] = useMutation(EDGEQUERY);
  const [
    dropGraphEdge,
    { dataDrop, loading: loadingDrop, errorDrop }
  ] = useMutation(DROPEDGEQUERY);
  const [source, setSource] = useState(props.source);
  const [target, setTarget] = useState(props.target);
  const [sourceVertex, setSourceVertex] = useState(null);
  const [targetVertex, setTargetVertex] = useState(null);
  const [targetSourceId, setTargetSourceId] = useState(props.targetSourceId);
  const [targetName, setTargetName] = useState(props.targetName);
  const [targetLabel, setTargetLabel] = useState(props.targetLabel);
  const [sourceName, setSourceName] = useState(props.sourceName);
  const [sourceSourceId, setSourceSourceId] = useState(props.sourceSourceId);
  const [sourceLabel, setSourceLabel] = useState(props.sourceLabel);

  useEffect(() => {
    setSourceVertex({
      sourceId: sourceSourceId,
      label: sourceLabel,
      name: sourceName,
      type: "vertex",
      properties: []
    });
  }, [props.sourceSourceId, props.sourceLabel, props.sourceName]);

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
    if (sourceVertex && targetVertex) {
      if (!selected) {
        /* if(stateApp.owners) {
        let owners = stateApp.owners;
          if(target) {
              
              owners.forEach( (owner,index) => {
                  if(owner.Id === target.SourceId) {
                      owners.splice(index)
                  }
              })
              setStateApp(state => ({ ...state, owners: owners }))
          }
      } */
        //remove edge
        dropGraphEdge({
          variables: {
            source: sourceVertex,
            target: targetVertex,
            relationshipLabel: "tracks"
          },
          refetchQueries: ["getVertexEdges"],
          awaitRefetchQueries: true
        });
      } else {
        //add to owners
        /* let owners = []
        if(stateApp.owners) {
            owners = stateApp.owners;
        }
        if(stateApp.selectedOwner) {
            owners.unshift(stateApp.selectedOwner)
      
            setStateApp(state => ({ ...state, owners: owners }))
        } */
        //add edge
        createGraphEdge({
          variables: {
            source: sourceVertex,
            target: targetVertex,
            relationshipLabel: "tracks"
          },
          refetchQueries: ["getVertexEdges"],
          awaitRefetchQueries: true
        });
      }
    }
  }, [selected, sourceVertex, targetVertex]);

  useEffect(() => {
    if (data) {
      console.log("edge add", data);
    }
  }, [data]);
  useEffect(() => {
    if (dataDrop) {
      console.log("edge drop", dataDrop);
    }
  }, [dataDrop]);

  const handleToggle = e => {
    //console.log('toggle item',props.item)
    //setStateApp(state => ({ ...state, selectedOwner: props.item }))
    setSelected(!selected);
    setTargetVertex({
      sourceId: targetSourceId,
      label: targetLabel,
      name: targetName,
      type: "vertex",
      properties: []
    });
  };
  // if (loading || loadingDrop) return <CircularProgress size={28} color="secondary"></CircularProgress>;
  //if (error || errorDrop) return <Alert severity="error">Error occurred.</Alert>;
  return (
    <IconButton>
      <ToggleButton
        size="small"
        classes={{ root: classes.root, selected: classes.selected }}
        value="check"
        selected={selected}
        onChange={e => {
          e.stopPropagation();
          e.persist();
          handleToggle();
        }}
      >
        {loading || loadingDrop ? (
          <CircularProgress size={28} color="secondary"></CircularProgress>
        ) : selected ? (
          <MyLocationIcon color="secondary" />
        ) : (
          <MyLocationIcon />
        )}
      </ToggleButton>
    </IconButton>
  );
}
