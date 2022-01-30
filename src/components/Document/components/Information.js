import React from "react";
import { AppContext } from "AppContext";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";

import { styled } from '@material-ui/core/styles';
import moment from "moment";

const ListContainer = styled('div')({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "2em",
  maxHeight: "calc(100vh - 310px)",
})

const StyledListItem = styled(ListItem)({
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "start",
});

const StyledListSubheader = styled(ListSubheader)({
  paddingLeft: 0,
  lineHeight: '25px'
});

export default function Information() {

  const [stateApp] = React.useContext(AppContext);
  const uploadDate = moment(stateApp.selectedDocument.uploadedDate).format("MMM Do, YYYY, h:mm a");

  return (
    <ListContainer>
      <List>
        <StyledListItem>
          <StyledListSubheader>Owner</StyledListSubheader>
          <ListItemText primary="-----" />
        </StyledListItem>
        <StyledListItem>
          <StyledListSubheader style={{ paddingLeft: 0}}>Uploader</StyledListSubheader>
          <ListItemText primary="-----" />
        </StyledListItem>
        <StyledListItem>
          <StyledListSubheader>Created</StyledListSubheader>
          <ListItemText primary={uploadDate} />
        </StyledListItem>
        <StyledListItem>
          <StyledListSubheader style={{ paddingLeft: 0}}>Size</StyledListSubheader>
          <ListItemText primary="-----" />
        </StyledListItem>
        <StyledListItem>
          <StyledListSubheader style={{ paddingLeft: 0}}>File Type</StyledListSubheader>
          <ListItemText primary="-----" />
        </StyledListItem>                
      </List>
    </ListContainer>
  );
}