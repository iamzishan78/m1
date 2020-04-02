/* eslint-disable no-use-before-define */
import React, { useContext,useState, useEffect } from 'react';
import { useMutation,useLazyQuery } from "@apollo/react-hooks";
import { AppContext } from '../../AppContext'
import { EDGEQUERY } from '../../graphQL/useMutationCreateEdge';
import { DROPEDGEQUERY } from '../../graphQL/useMutationDropEdge';
import { VERTEXEDGESQUERY } from '../../graphQL/useQueryVertexEdges';
import { TAGSQUERY } from '../../graphQL/useQueryTags';
import { USERTAGSQUERY } from '../../graphQL/useQueryUserTags';
import { USERPARENTTAGSQUERY } from '../../graphQL/useQueryUserParentTags';
import { UPSERTTAG } from '../../graphQL/useMutationUpsertTag';
import { CircularProgress } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
//import { graphql } from 'graphql';

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
  const [dropGraphEdge, { data:dataDrop,loading:loadingDrop,errorDrop }] = useMutation(DROPEDGEQUERY);
  const [upsertTag, { data:dataUpsertTag,loading:loadingUpsertTag,errorUpsertTag }] = useMutation(UPSERTTAG);
  const [getVertexEdges, { loading:loadingGraph, data:dataGraph }] = useLazyQuery(VERTEXEDGESQUERY);
  const [getTags, { loading:loadingTags, data:dataTags }] = useLazyQuery(TAGSQUERY);
  const [getMyTags, { loading:loadingMyTags, data:dataMyTags }] = useLazyQuery(TAGSQUERY);
  const [getParentTags, { loading:loadingParentTags, data:dataParentTags }] = useLazyQuery(TAGSQUERY);
  const [getUserTags, { loading:loadingUserTags, data:dataUserTags }] = useLazyQuery(USERTAGSQUERY);
  const [getUserParentTags, { loading:loadingUserParentTags, data:dataUserParentTags }] = useLazyQuery(USERPARENTTAGSQUERY);
 // const [getUserParentTags, { loading:loadingUserParentTags,data:dataUserParentTags }] = useLazyQuery(USERPARENTTAGSQUERY);
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
  const [publicTags,setPublicTags] = useState(null) 
  const [myTags,setMyTags] = useState(null) 
  const [dropTag,setDropTag] = useState(null)
  const [addTag,setAddTag] = useState(null)

  const [userParentTags,setUserParentTags] = useState(null)
  
  //const [userParentTags,setPublicTags] = useState(props.public)
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
  //get public tags for autocomplete list
  refreshTags()
  
},[])

const refreshTags = () => {
console.log('refresh')
   getTags({ variables: { 
    public:true
   }});

   getUserTags({ variables: { 
    userId:stateApp.user.id
   }});

   getUserParentTags({ variables: { 
    sourceSourceId:stateApp.user.id,
    targetSourceId:targetSourceId
   }});

}

/* useEffect( () => {
  //get public tags for autocomplete list
  getUserParentTags({ variables: { 
    source: sourceVertex,
    tag: tagVertex,
    target: targetVertex
   }});
  
},[]) */

useEffect( () => {
  //after public tags results setPublicTags 
  if(dataTags){
    //console.log('setprev',dataTags)
  setPublicTags(dataTags.tags)
  }

},[dataTags])

useEffect( () => {
  //after public tags results setPublicTags 
  if(dataUserTags){
   // console.log('user tags array',dataUserTags)
    getMyTags({ variables: { 
      tagIdArray:dataUserTags.userTags
     }});
  }

},[dataUserTags])

useEffect( () => {
  //after public tags results setPublicTags 
  if(dataUserParentTags){
   // console.log('user parent tags array',dataUserParentTags)
    getParentTags({ variables: { 
      tagIdArray:dataUserParentTags.userParentTags
     }});
  }

},[dataUserParentTags])

useEffect( () => {
  //after public tags results setPublicTags 
  if(dataMyTags && publicTags){
    //console.log('my',dataMyTags)
    setMyTags(dataMyTags.tags) 
    //add my tags to top of public tags 
    let allTags = [];
    publicTags.forEach( (tag) => {
      allTags.push(tag)
    })
    dataMyTags.tags.forEach( (tag) => {
      allTags.unshift(tag)
    })
    
   // console.log(allTags)
    setPublicTags(allTags)
  }
},[dataMyTags])

useEffect( () => {
 // console.log('dpt',dataParentTags)
  //after public tags results setPublicTags 
  if(dataParentTags){
    //console.log('parent tags',dataParentTags)
    let parentTags = [];
    if( dataParentTags.tags && dataParentTags.tags.length > 0) {
      dataParentTags.tags.forEach( (tag) => {
        parentTags.push(tag.tag)
      })
     // console.log('selected tags',parentTags)
      //if(!userParentTags){
       
        setUserParentTags(parentTags)
       // console.log('user parent tags',userParentTags)
      //}
      

     
    }
   
  }
  

},[dataParentTags])


useEffect( () => {
  //after new tag is upserted create edges
    if(dataUpsertTag){
      //console.log('new tag',dataUpsertTag)
  
      setTagVertex({
        sourceId: dataUpsertTag.upsertTag.tag.id,
        label: 'tag',
        name: dataUpsertTag.upsertTag.tag.tag,
        type:'vertex',
        properties:[]
      })
    }
  
  },[dataUpsertTag])

useEffect( () => {
//after new tag is upserted create edges
if(!dropTag){
  if(tagVertex && sourceVertex && targetVertex){
    
   // console.log('new tag vertex',tagVertex)
   // console.log('target vertex',targetVertex)

    //create edge between user and tag
      
      createEdgeAsyncAwait(sourceVertex,tagVertex,targetVertex)

          //create edge between tag and parent
          
      
 
  
}
}
else {
 // console.log('dropVertex',tagVertex,targetVertex)
  //keep edge between user and tag and don't delete tag
        //remove edge between tag and parent/well
        dropGraphEdge({ 
          variables: { source:tagVertex,target:targetVertex,relationshipLabel: 'tags' },
          refetchQueries: ["getUserTags","getParentTags","getUserParentTags"],
          awaitRefetchQueries: true
         });  
}

},[tagVertex,sourceVertex,targetVertex])

const createEdgeAsyncAwait = async (sourceVertex,tagVertex,targetVertex) => {

  await createGraphEdge({
    variables: {
      source: sourceVertex,
      target: tagVertex,
      relationshipLabel: "created"
    },
    refetchQueries: ["getUserTags","getParentTags","getUserParentTags"],
    awaitRefetchQueries: true
  });

  await createGraphEdge({
    variables: {
      source: tagVertex,
      target: targetVertex,
      relationshipLabel: "tags"
    },
    refetchQueries: ["getUserTags","getParentTags","getUserParentTags"],
    awaitRefetchQueries: true
  });


}


useEffect( () => {
  
  if(data) {
    //console.log('createEdge',data)

  }

  if(error) {
    console.log('createEdge error',error)
  }
  
  
},[data,error])

useEffect( () => {
  
  if(dataDrop) {
    //console.log('dropEdge',dataDrop)
    
  }

  if(errorDrop) {
    console.log('dropEdge error',errorDrop)
  }
  
  setDropTag(null)
  
},[dataDrop])


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
    setTargetVertex({
      sourceId: targetSourceId,
      label: targetLabel,
      name: targetName,
      type:'vertex',
      properties:[]
    })
  },[props.targetSourceId,props.targetLabel,props.targetName])

  useEffect( () => {
    if(dropTag && targetVertex){
      //console.log('drop',dropTag)
      setTagVertex({
        sourceId: dropTag.id,
        label: 'tag',
        name: dropTag.tag,
        type:'vertex',
        properties:[]
      })
         
             
      //setDropTag(null)
    }
  },[dropTag,targetVertex])

  useEffect( () => {
    if(addTag && targetVertex){
      
      setTagVertex({
        sourceId: addTag.id,
        label: 'tag',
        name: addTag.tag,
        type:'vertex',
        properties:[]
      })
        //setting tagVertex fires create edge useeffect   
        //clear
        setAddTag(null)
    }
  },[addTag,targetVertex])

    useEffect( () => {
        setPublicTags(props.public)
        if(props.public){
            setLabel('Public Tags')
        }
        else {
            setLabel('Private Tags')
        }
    },[props.public])

    
    

  const processSelectedTag = async (tagText) => {

    let tagToAdd;
      publicTags.forEach( (item) => {
        if(item.tag === tagText) {
          tagToAdd = item
        }
      })
     setAddTag(tagToAdd)
      // get id of tag from getUserTags data (since MUI doesn't support array of objects in the UI control)
      //since this tag already exists in cosmos tag collection we don't need to call upsertTag to add it
      //create edge between user and tag (if public tag selected)
      //create edge between tag and parent (owner, well, etc.)
  }
  const processNewTag = async (tagText) => {
    let tagToAdd;
    publicTags.forEach( (item) => {
      if(item.tag === tagText) {
        tagToAdd = item
      }
    })
    if(!tagToAdd) {
      tagToAdd = {
        tag:tagText,
        public:false
      }
    }
    //await upsertTag to cosmos
    //refresh getUserTags (private tags this user has an edge to) so they can select this tag again
    upsertTag(
      { variables: {tag: tagToAdd},
     // refetchQueries: ["getUserTags"],
     // awaitRefetchQueries: true
    })
    //use id returned from upsert to create edges
   
    //await create edge between tag and parent
    //refresh getTags (public) if this new tag is public
    
    //refresh getUserParentTags (user created tag and tag tags porent) to update the value array

  }
  const processDeleteTag = async (tagText) => {

      //loop through tags to get id that goes with tagText 
      let tagToDrop;
      publicTags.forEach( (item) => {
        if(item.tag === tagText) {
          tagToDrop = item
        }
      })
     // console.log('tag to drop',tagToDrop)
    setDropTag(tagToDrop)
    //fires off useEffect to dropVertex 

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
      
  
  const handleChangeTags = (e,v) => {
    e.persist()
   // console.log('v',v,e)
    setSelected(v) 
    if(e.key && e.key === 'Enter'){
    //if(v === 0) {
      //an existing tag was selected
     // processSelectedTag(e.target.innerText)
   // }
   // else if (v && v.length > 0) {
      //new tag
     processNewTag(v[v.length-1])
    }
    else if(e.target.tagName === 'svg' || e.target.tagName === 'path') {
      //a tag was deleted v=undefined 
      let deletedItem;
      if(e.target.tagName === 'svg') {
        deletedItem = e.target.parentNode.innerText;
      }
      if(e.target.tagName === 'path') {
        deletedItem = e.target.parentNode.parentNode.innerText;
      }
     // console.log(deletedItem)
     processDeleteTag(deletedItem)
    }
    else {
      processSelectedTag(e.target.innerText)
    }
  }

  return (
    <div className={classes.root}>
     
     {publicTags ? ( <Autocomplete
        multiple
        id="tags-outlined"
        onChange={(e,newValue) => {
            handleChangeTags(e,newValue)
        }}
        options={publicTags.map(option => option.tag)}
        value={userParentTags ? userParentTags:[]}
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
