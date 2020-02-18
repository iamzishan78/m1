/* eslint-disable no-use-before-define */
import React, { useContext,useState, useEffect } from 'react';
import { useMutation,useLazyQuery } from "@apollo/react-hooks";
import { AppContext } from '../../AppContext'
import { EDGEQUERY } from '../../graphQL/useMutationCreateEdge';
import { DROPEDGEQUERY } from '../../graphQL/useMutationDropEdge';
import { VERTEXEDGESQUERY } from '../../graphQL/useQueryVertexEdges';
import { TAGSQUERY } from '../../graphQL/useQueryTags';
import { CircularProgress } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { graphql } from 'graphql';

const useStyles = makeStyles(theme => ({
  root: {
    width: 500,
     '& > * + *': {
      marginTop: theme.spacing(5),
    }
  },
}));

export default function Tags(props) {
  const [stateApp,setStateApp] = useContext(AppContext)
  const [createGraphEdge, { data,loading,error, }] = useMutation(EDGEQUERY);
  const [dropGraphEdge, { dataDrop,loading:loadingDrop,errorDrop }] = useMutation(DROPEDGEQUERY);
  const [getVertexEdges, { loading:loadingGraph, data:dataGraph }] = useLazyQuery(VERTEXEDGESQUERY);
  const [getTags, { loading:loadingTags, data:dataTags }] = useLazyQuery(TAGSQUERY);
  const [source,setSource] = useState(props.source)
  const [target,setTarget] = useState(props.target)
  const [sourceVertex,setSourceVertex] = useState(null)
  const [targetVertex,setTargetVertex] = useState(null)
  const [targetSourceId,setTargetSourceId] = useState(props.targetSourceId)
  const [targetName,setTargetName] = useState(props.targetName)
  const [targetLabel,setTargetLabel] = useState(props.targetLabel)
  const [sourceName,setSourceName] = useState(props.sourceName)
  const [sourceSourceId,setSourceSourceId] = useState(props.sourceSourceId)
  const [sourceLabel,setSourceLabel] = useState(props.sourceLabel)
  
  const [publicTags,setPublicTags] = useState(props.public)
  const [selected,setSelected] = useState()
  const [label,setLabel] = useState(null)
  const classes = useStyles();

  /* Steps:
  Populate autocomplete with this user's tags
    get user-tag ids from graph
    get tags from cosmos using the id array
    set tags result to autocomplete options
  Populate existing well tags for this user
    Get tags for current well that are also linked to user
    set default value in autocomplete to this tag array
  Update tags
    onChange compare previous tags to current ones
    call dropEdge for the ones that were removed. (tag-well only.don't delete tag or its link to the user)
    call upsertTag to add new tags to cosmos
    call createEdge for new user-tag link (using tag id from upsert)
    call createEdge for the new tag-well link
    do nothing for ones in both
  */


  useEffect( () => {
    setSourceVertex({
      sourceId: sourceSourceId,
      label: sourceLabel,
      name: sourceName,
      type:'vertex',
      properties:[]
    })
  },[props.sourceSourceId,props.sourceLabel,props.sourceName])

  useEffect( () => {
    if(sourceVertex && targetVertex){
      if(!selected) {
        //remove edge between user and tag
        //remove edge between tag and well
            dropGraphEdge({ 
              variables: { source:sourceVertex,target:targetVertex,relationshipLabel: 'tagged' },
              refetchQueries:['getVertexEdges'],
              awaitRefetchQueries:true
             });
        }
        else { 
    
          //add edge from user to tag
          //add edge from tag to well
          createGraphEdge({ variables: { 
            source:sourceVertex,target:targetVertex,relationshipLabel: 'tagged' },
            refetchQueries:['getVertexEdges'],
            awaitRefetchQueries:true
           });
  
        }
    }
  },[selected,sourceVertex,targetVertex])

    useEffect( () => {
        setPublicTags(props.public)
        if(props.public){
            setLabel('Public Tags')
        }
        else {
            setLabel('Private Tags')
        }
    },[props.public])

    const handleChangeTags = (e,newValue) => {
      
      let selectedTagsArray = newValue;
      let newTag = e.target.value;
      setSelected(newValue)

      //set tag as source for well target
      //set tag as target for user source
     /*  setTargetVertex({
        sourceId:targetSourceId,
        label: targetLabel,
        name: targetName,
        type:'vertex',
        properties:[]
      }) */
      
  }
  

  return (
    <div className={classes.root}>
     
      <Autocomplete
        multiple
        id="tags-outlined"
        onChange={(e,newValue) => {
          e.preventDefault()
            handleChangeTags(e,newValue)
        }}
        options={tags.map(option => option.tag)}
        defaultValue={[tags[0].tag]}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label= {label ? label:'Tags'}
            placeholder="New..."
            fullWidth
          />
        )}
      />
    </div>
  );
}

const tags = [
  { tag: 'Capital Appreciation', id: "0" },
  { tag: 'Divorce', id: "1" },
  { tag: 'Eagle Ford', id: "2" },
  { tag: 'Followup', id: "3" },
  { tag: 'High Cash Flow', id: "4" },
  { tag: 'Interested', id: "5" },
  { tag: 'Lease Change', id: "6" },
  { tag: 'Motivated Seller', id: "7" },
  { tag: 'Permian', id: "8" },
  { tag: 'Recent Permit', id: "9" },
  { tag: 'Recent Death', id: "10" }
];