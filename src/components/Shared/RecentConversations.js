import React, { useState } from "react";
// import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Typography from "@material-ui/core/Typography";
import Avatar from "react-avatar";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  avatar: {
    marginRight: "20px",
  },
  moreIcon: {
    color: "lightgray",
  },
  viewAll: {
    margin: "0 0 8px 0",
    float: "right",
    color: theme.palette.secondary.main,
    cursor: "pointer",
    fontWeight: "normal",
    "&:hover": { color: "#757575" },
    transition: "color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
}));

const dataList = [
  {
    name: "Jacob Avery",
    email: "jacob@m1neral.com",
    time: "5 months ago",
    title: "Re: Offer Sent Last Week",
    secondary:
      "No Problem thanks for the update. Have a great weekend. Best regards...",
  },
  {
    name: "Kyle Chapman",
    email: "kyle@m1neral.com",
    time: "5 months ago",
    title: "Re: Offer Sent Last Week",
    secondary:
      "The offer has been sent - please let me know if you have any further...",
  },
  {
    name: "Jacob Avery",
    email: "jacob@m1neral.com",
    time: "5 months ago",
    title: "Re: Offer Sent Last Week",
    secondary:
      "No Problem thanks for the update. Have a great weekend. Best regards...",
  },
  {
    name: "Kyle Chapman",
    email: "kyle@m1neral.com",
    time: "5 months ago",
    title: "Re: Offer Sent Last Week",
    secondary:
      "The offer has been sent - please let me know if you have any further...",
  },
];

export default ({
  header,
  // dataList,
  ...props
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid item xs={12} style={{ minHeight: "28px" }}>
        <h4 style={{ margin: "0 0 8px 0", float: "left" }}>{header}</h4>
        <h4
          className={classes.viewAll}
          onClick={() => {
            props.handleOpenExpandableCard(
              "Pass your card content here",
              "Conversations"
            );
          }}
        >
          View All
        </h4>
      </Grid>
      <Grid item xs={12}>
        <List className={classes.root} style={{ padding: "0" }}>
          {dataList.map((data, index) => (
            <ListItem
              key={index}
              button
              style={{
                backgroundColor:
                  index & 1
                    ? "rgba(248, 248, 248, 0.54)"
                    : "rgb(246, 246, 246)",
              }}
              onClick={() => {}}
            >
              <Grid item xs={4}>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      style={{
                        color: "rgb(104, 104, 104)",
                        fontWeight: "bold",
                      }}
                    >{`${data.name} <${data.email}>`}</Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      style={{ color: "rgb(176, 176, 176)" }}
                    >
                      {data.time}
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={8}>
                <ListItemText
                  primary={
                    <Typography variant="body2" style={{ color: "#757575" }}>
                      {data.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" style={{ color: "#757575" }}>
                      {data.secondary}
                    </Typography>
                  }
                />
              </Grid>
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <DeleteOutlineIcon style={{ color: "#757575" }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
    </div>

    // <div className={classes.root}>
    //   <div style={{ height: "48px", padding: "10px 24px" }}>
    //     <Typography variant="h6">{header}</Typography>
    //   </div>
    //   <div>
    //     <List className={classes.root}>
    //       {
    //         // dataList.map(data => (
    //         //   <ListItem>
    //         //     <ListItemAvatar>
    //         //       <Avatar name={data.conversation.name} size="60" round />
    //         //     </ListItemAvatar>
    //         //     <ListItemText primary={data.conversation.email} secondary="5 months ago" />
    //         //     <ListItemText primary={data.conversation.title} secondary={data.conversation.content.substr(0, 57) + '...'} />
    //         //     <ListItemIcon>
    //         //       <MoreVertIcon color='secondary' />
    //         //     </ListItemIcon>
    //         //   </ListItem>
    //         // ))
    //       }
    //       <ListItem>
    //         <ListItemAvatar className={classes.avatar}>
    //           <Avatar name={"Jacob Avery"} size="60" round />
    //         </ListItemAvatar>
    //         <ListItemText
    //           primary={"jacob@m1neral.com"}
    //           secondary="5 months ago"
    //         />
    //         <ListItemText
    //           primary={"Re: Offer Sent Last Week"}
    //           secondary={
    //             "No Problem thanks for the update. Have a great weekend. Best regards..."
    //           }
    //         />
    //         <ListItemIcon>
    //           <MoreVertIcon className={classes.moreIcon} />
    //         </ListItemIcon>
    //       </ListItem>
    //       <ListItem>
    //         <ListItemAvatar className={classes.avatar}>
    //           <Avatar name={"Kyle Chapman"} size="60" round />
    //         </ListItemAvatar>
    //         <ListItemText
    //           primary={"kyle@m1neral.com"}
    //           secondary="5 months ago"
    //         />
    //         <ListItemText
    //           primary={"Re: Offer Sent Last Week"}
    //           secondary={
    //             "The offer has been sent - please let me know if you have any further..."
    //           }
    //         />
    //         <ListItemIcon>
    //           <MoreVertIcon className={classes.moreIcon} />
    //         </ListItemIcon>
    //       </ListItem>
    //     </List>
    //   </div>
    // </div>
  );
};
