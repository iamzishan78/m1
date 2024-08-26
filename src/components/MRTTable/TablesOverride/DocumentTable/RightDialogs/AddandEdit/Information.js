import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";

import { styled } from '@material-ui/core/styles';
import moment from "moment";
import CommentComponent from "./Comment";
import { getDocumentType, getDocumentSizeInKBs } from "components/MRTTable/utils/helper";

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


export default function Information({ selectedDocument }) {

  const localDateTime = moment.utc(selectedDocument?.fileCreatedAt ?? selectedDocument?.uploadedDate).local();
  const createdDate = localDateTime.format('MMM Do, YYYY, h:mm a');

  return (
    <>
      <ListContainer>
        <List>
          <StyledListItem>
            <StyledListSubheader style={{ paddingLeft: 0 }}>
              Uploaded By{" "}
            </StyledListSubheader>
            <ListItemText primary={selectedDocument?.fileUploadedBy?.displayName || selectedDocument?.fileUploadedBy?.name} />
          </StyledListItem>
          <StyledListItem>
            <StyledListSubheader>Created Date</StyledListSubheader>
            <ListItemText primary={createdDate} />
          </StyledListItem>
          <StyledListItem>
            <StyledListSubheader style={{ paddingLeft: 0 }}>
              File Type
            </StyledListSubheader>
            <ListItemText primary={getDocumentType(selectedDocument?.fileName)} />
          </StyledListItem>
          <StyledListItem>
            <StyledListSubheader style={{ paddingLeft: 0 }}>
              File Size
            </StyledListSubheader>
            <ListItemText primary={getDocumentSizeInKBs(selectedDocument?.size)} />
          </StyledListItem>
        </List>
      </ListContainer>
      <CommentComponent
        targetLabel={"file"}
        targetSourceId={selectedDocument?._id}
      />
    </>
  );
}