import React, {useContext,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from 'react-avatar';
import Typography from '@material-ui/core/Typography';
import {AppContext} from '../../AppContext'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor:'#fff'
  },
  title: {
    fontSize: 10,
  },
  pos: {
    marginBottom: 12,
  },
  content: {
    height:'100%',
    backgroundColor:'white'
  },
  list: {
    width:'100%',
    height:'100%',
    background:'rgba(255,255,255,0)',
    color: 'rgba(23, 170, 221, 1)',
    overflowY:'auto',
    padding: 0,
  },
  listItem:{
    fontFamily: 'Poppins',
    /* '&:hover': {
      background: '#4B618F'
    }, */
    backgroundColor: 'white',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.common.black
    },
    '& .MuiListItemText-secondary': {
      color: 'rgba(23, 170, 221, 1)',
      fontSize:16
    },
  },
  textInput: {
    width:'100%'
  }
}));

export default function Comments() {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext)
  const [commentsArray,setCommentsArray] = useState([])
  const [textValue,setTextValue] = useState('')

  const handleComment = (event) => {
      
      let newComment = {
          name: stateApp.user.name,
          text: event.target.value
      }
      
    setCommentsArray([newComment,...commentsArray])
    setTextValue('')
  }
  return  (
    <Card className={classes.root} variant="outlined">
      <CardHeader
        title="Comments"
      />
      <CardActions>
      <TextField className={classes.textInput}
          id="outlined-input"
          label="Comment"
          variant="outlined"
          onChange={(e)=>{setTextValue(e.target.value)}}
          value={textValue}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
                handleComment(event)
            }
          }}
        />
      </CardActions>
      <CardContent className={classes.content}>
      <List className={classes.list}>
      {commentsArray.map( (comment,index) => (
      <ListItem key={index} className={classes.listItem} alignItems="flex-start">
       <ListItemAvatar>
          <Avatar name={comment.name} size="38" round  />
        </ListItemAvatar>
        <ListItemText
          primary={comment.name}
          secondary= {comment.text}
        />
      </ListItem>
      ))}
      </List>
      </CardContent>
      
    </Card>
    )
  
}