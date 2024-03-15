import React, { Fragment,  useState, useCallback, useContext, useEffect, } from 'react'
import CardHeader from "@material-ui/core/CardHeader";
import { TextField, } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CREATE_NOTE } from 'graphQL/useMutationNote';
import { useMutation } from '@apollo/client';
import { ProfileContext } from "../../Profile/ProfileContext";
import { GET_USER_NOTES } from "graphQL/useQueryGetNote";
import { useLazyQuery } from "@apollo/client";
const useStyles = makeStyles((theme) => ({
  notes: {
    backgroundColor: "#FFFCDC",
    display: "block",
    width: "-webkit-fill-available",
    margin: "25px 20px",
    "& .MuiOutlinedInput-root": {
      width: "100%",
      "& fieldset": {
        borderColor: "white",
      },
    },
  },
}));
function Notepad() {
  const [description, setDescription] = useState('');
  const classes = useStyles();
  const [stateProfile, setStateProfile] = useContext(ProfileContext);
  const [getNote, { data }] = useLazyQuery(GET_USER_NOTES);
  useEffect(() => {
    if (stateProfile?.fields?._id) {
      getNote({
          variables: {
            userId: stateProfile?.fields?._id,
          },
        })
    }
  }, [stateProfile])
  useEffect(() => {
    setDescription(data?.getUserNotes?.description)
  }, [data]);
  const [createNote] = useMutation(CREATE_NOTE, {
    variables: { content: { description, userId:  stateProfile.fields._id} },
    refetchQueries: [{ query: GET_USER_NOTES, variables: { userId: stateProfile.fields._id } }],
  });
  const handleCreateNote = useCallback(async () => {
    await createNote();
  }, [createNote]);
  
  const handleBlur = () => {
    handleCreateNote(); 
  };
  return (
    <Fragment>
      <CardHeader
      style={{ margin: "8px" }}
      title={`Private notepad`}
    />
    <TextField
      margin="dense"
      variant="outlined"
      multiline
      rows="32"
      value={description}
      label="Notes"
      fullWidth
      //   required
      onChange={(e) => {
        setDescription(e.target.value);
      }}
      className={classes.notes}
      onBlur={handleBlur}
    />
    </Fragment>
    
  )
}
export default Notepad