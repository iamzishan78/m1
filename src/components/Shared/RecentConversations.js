import React, {useState} from "react";
// import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from "@material-ui/core/Typography";
import Avatar from "react-avatar";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  avatar: {
    marginRight: "20px"
  }
}));

export default ({
  header,
  // dataList
}) => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState({});
  const [options, setOptions] = useState({});

  return (
    <div className={classes.root}>
      <div style={{height: "48px", padding: "10px"}}>
        <Typography variant="h5">
          {header}
        </Typography>
      </div>
      <div>
      <List className={classes.root}>
        {
          // dataList.map(data => (
          //   <ListItem>
          //     <ListItemAvatar>
          //       <Avatar name={data.conversation.name} size="60" round />
          //     </ListItemAvatar>
          //     <ListItemText primary={data.conversation.email} secondary="5 months ago" />
          //     <ListItemText primary={data.conversation.title} secondary={data.conversation.content.substr(0, 57) + '...'} />
          //     <ListItemIcon>
          //       <MoreVertIcon color='secondary' />
          //     </ListItemIcon>
          //   </ListItem>
          // ))
        }
        <ListItem>
          <ListItemAvatar className={classes.avatar}>
            <Avatar name={"Jacob"} size="60" round />
          </ListItemAvatar>
          <ListItemText primary={"jacob@m1neral.com"} secondary="5 months ago" />
          <ListItemText primary={"Re Power Rangers(5)"} secondary={"No Problem thx for the update..."} />
          <ListItemIcon>
            <MoreVertIcon color='secondary' />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemAvatar className={classes.avatar}>
            <Avatar name={"Kyle"} size="60" round />
          </ListItemAvatar>
          <ListItemText primary={"jacob@m1neral.com"} secondary="5 months ago" />
          <ListItemText primary={"Re Power Rangers(5)"} secondary={"No Problem thx for the update..."} />
          <ListItemIcon>
            <MoreVertIcon color='secondary' />
          </ListItemIcon>
        </ListItem>
        
      </List>
      </div>
    </div>
  )
}