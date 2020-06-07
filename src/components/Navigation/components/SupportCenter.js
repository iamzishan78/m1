import React, { useContext } from "react";
import styled from "styled-components";
import { AppContext } from "../../../AppContext";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Switch from "@material-ui/core/Switch";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import RateReviewIcon from "@material-ui/icons/RateReviewOutlined";
import ScreenShareIcon from "@material-ui/icons/ScreenShareOutlined";

const M1neralLogo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 11320 2490"
    className={props.className}
  >
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <path
        fill="#12ABE0"
        d="M1396 1823c-201 202-528 202-729 0-15-15-30-31-43-48l-366 366c14 16 29 31 44 47 403 402 1056 402 1459 0 356-356 397-908 124-1309l-379 378c80 188 43 413-110 566zm-839-163c-80-188-43-413 110-566 201-201 528-201 729 0 16 15 30 32 43 48l366-366c-14-16-29-31-44-47L1032 0 302 729c-356 356-397 908-124 1309l379-378zm292-384c101-100 264-100 365 0 101 101 101 264 0 365s-264 101-365 0c-100-101-100-264 0-365z"
      ></path>
      <g transform="translate(2687 379)">
        <path
          fill="#12ABE0"
          d="M2703 1686L2703 64 2703 0 2505 64 2072 202 2132 432 2422 351 2422 1686z"
        ></path>
        <path fill="black" d="M8354 6L8354 1686 8633 1686 8633 6z"></path>
        <path
          fill="black"
          d="M1324 699c156 0 246 103 246 297v690h279V911c0-297-161-465-426-465-184 0-313 85-412 214-65-129-187-214-362-214-186 0-292 101-370 209V471H0v1215h279v-683c0-189 106-304 260-304s246 106 246 295v692h279v-686c0-195 108-301 260-301zM3099 471v1215h278v-686c0-188 113-301 274-301 166 0 260 108 260 297v690h279V913c0-283-159-467-433-467-189 0-301 99-380 214V471h-278zM5053 446c-347 0-594 285-594 633v4c0 376 272 631 624 631 223 0 382-90 497-228l-163-145c-97 95-194 145-329 145-180 0-320-110-350-308h893c2-28 5-53 5-79 0-349-196-653-583-653zm306 548h-624c26-189 145-320 316-320 184 0 290 140 308 320zM5916 471v1215h279v-462c0-323 170-481 414-481h16V448c-214-9-354 115-430 297V471h-279zM6759 1086c0 345 274 628 644 628 142 0 269-41 373-110v110h279V446h-279v107c-102-68-228-107-368-107-373 0-649 287-649 635v5zm649 386c-216 0-371-179-371-391v-5c0-211 143-386 366-386 219 0 373 177 373 391v5c0 209-142 386-368 386z"
        ></path>
      </g>
    </g>
  </svg>
);

const M1neralLogoStyled = styled(M1neralLogo)`
  width: 150px;
  margin: auto;
  vertical-align: middle;
`;

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    textAlign: "center",
  },
}));

function SupportCenterModal(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const { open, onClose, openContactForm } = props;

  const toggleUserSnap = () => {
    setStateApp({ ...stateApp, userSnap: !stateApp.userSnap });
  };

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={onClose}>
      <DialogTitle id="simple-dialog-title" className={classes.dialogTitle}>
        <M1neralLogoStyled />
      </DialogTitle>
      <List>
        <ListItem autoFocus button>
          <ListItemAvatar>
            <ScreenShareIcon color="secondary" fontSize="large" />
          </ListItemAvatar>
          <ListItemText
            primary="Draw on the screen feedback tool"
            secondary="Provide feedback with a screenshot"
          />
          <Switch
            checked={stateApp.userSnap}
            onChange={toggleUserSnap}
            color="primary"
            name="checkedB"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </ListItem>

        <ListItem autoFocus button onClick={openContactForm}>
          <ListItemAvatar>
            <RateReviewIcon color="secondary" fontSize="large" />
          </ListItemAvatar>
          <ListItemText
            primary="General feedback"
            secondary="Provide general feedback of this page"
          />
        </ListItem>
      </List>
    </Dialog>
  );
}

export default SupportCenterModal;
