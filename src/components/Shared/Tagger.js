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
  const [tagVertex,setTagVertex] = useState(null)
  const [targetSourceId,setTargetSourceId] = useState(props.targetSourceId)
  const [targetName,setTargetName] = useState(props.targetName)
  const [targetLabel,setTargetLabel] = useState(props.targetLabel)
  const [sourceName,setSourceName] = useState(props.sourceName)
  const [sourceSourceId,setSourceSourceId] = useState(props.sourceSourceId)
  const [sourceLabel,setSourceLabel] = useState(props.sourceLabel)
  const [previousTags,setPreviousTags] = useState(null)
  
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

  getTags({ variables: { 
    public:true
   }});
  
},[])

useEffect( () => {

  if(dataTags){
    console.log('setprev',dataTags)
  setPreviousTags([dataTags.tags[0],dataTags.tags[1]])
  setSelected([dataTags.tags[0],dataTags.tags[1]])
  }

},[dataTags])

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

    const handleTagDelete = (option,index) => {

      console.log('delete',option)

      let currentValue = selected;
      let newValue = currentValue.slice(0,index)
      console.log(newValue)
      setSelected(newValue)

    }
    const handleChangeTags = (e,v) => {
     
      setSelected(v) 
      if(v === 0) {
        //an existing tag was selected
        processSelectedTag(e.target.innerText)
      }
      else if (v && v.length > 0) {
        //new tag
       processNewTag(v)
      }
      else {
        //a tag was deleted v=undefined 
        let deletedItem;
        if(e.target.tagName === 'svg') {
          deletedItem = e.target.parentNode.innerText;
        }
        if(e.target.tagName === 'path') {
          deletedItem = e.target.parentNode.parentNode.innerText;
        }
       processDeleteTag(deletedItem)
      }

  const processSelectedTag = async (tagText) => {
      // get id of tag from getUserTags data (since MUI doesn't support array of objects in the UI control)
      //since this tag already exists in cosmos tag collection we don't need to call upsertTag to add it
      //create edge between user and tag (if public tag selected)
      //create edge between tag and parent (owner, well, etc.)
  }
  const processNewTag = async (tagText) => {
    //await upsertTag to cosmos
    //use id returned from upsert to create edges
    //await create edge between user and tag
    //await create edge between tag and parent
    //refresh getTags (public) if this new tag is public
    //refresh getUserTags (private tags this user has an edge to) so they can select this tag again
    //refresh getUserParentTags (user created tag and tag tags porent) to update the value array

  }
  const processDeleteTag = async (tagText) => {
    //don't delete tag from cosmos 
    //don't drop edge between user and tag so they can select it again
    //drop edge between tag and parent since we are removing it from parent but not user
    //don't refresh getTags (public) because we don't actually delete it
    //don't refresn getUserTags (private) because we don't actually drop edge
    //refresh getUserParentTags (user created tag and tag tags porent) to remove it from the value array

  }
      //getNewTags(newValue)

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

  const getNewTags = (selected) => {
    let existingTags = []
    let newTags = []

      selected.forEach( (tag) => {

        previousTags.forEach( (tagObject) => {

            if(tagObject.tag === tag) {
              existingTags.push(tagObject)
            }
            else {
              newTags.push(tag)
            }
        })

      })
    console.log('existingTags',existingTags)
    console.log('newTags',newTags)
  }

  const getDeletedTags = () => {

    let deletedArray = [];
      //compare previous tags to new selection and put deleted ones in deletedArray
    
        previousTags.forEach( (tagObject) => {
          
          selected.forEach( (tag) => {
            if(tagObject.tag === tag) {
              //tag still exists
            }
            else {
              //tag was removed from previous
              deletedArray.push(tagObject)
            }
          })
      })

  }
  
  const deleteTags = (deletedArray) => {

    //delete from cosmos
    
  }

  const createNewTags = (newTags) => {


  }
  const createEdgeForNewTags = (existingTags) => {
    

  }

  const dropEdgesForPreviousTags = (previousTags) => {
    

  }

  const createEdgeForExistingTags = (existingTags) => {
    

  }
  
  

  return (
    <div className={classes.root}>
     
     {dataTags && previousTags ? ( <Autocomplete
        multiple
        id="tags-outlined"
        onChange={(e,newValue) => {
          e.preventDefault()
            handleChangeTags(e,newValue)
        }}
        /* onInputChange={(e,newValue,reason) => {
          e.preventDefault()
            handleInputChange(e,newValue,reason)
        }} */
        options={dataTags.tags.map(option => option.tag)}
        defaultValue={previousTags ? [previousTags[0].tag,previousTags[1].tag]:null}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip key={index}
            variant="outlined" label={option} 
            {...getTagProps({ index })}
            />
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
      />): loadingTags ? (<CircularProgress color="secondary"></CircularProgress>): (null)}
    </div>
  );
}

/* const tags = [
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
]; */