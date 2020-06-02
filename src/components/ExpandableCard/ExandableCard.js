import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { ExpandableCardContext } from "./ExpandableCardContext";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ExpandIcon from "./components/svgIcons/ExpandIcon";
import ShrinkIcon from "./components/svgIcons/ShrinkIcon";
import Tooltip from "@material-ui/core/Tooltip";
import { useLazyQuery } from "@apollo/react-hooks";
import { TRACKBYUSERANDOBJECTID } from "../../graphQL/useQueryTrackByUserAndObjectId";
import { USERBYEMAIL } from "../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed
import TaggerWithIcon from "../Shared/TaggerWithIcon";
import CommentsWithIcon from "../Shared/CommentsWithIcon";
import TrackToggleButton from "../Shared/TrackToggleButton";
import $ from "jquery";
import BugsIcon from "../Shared/svgIcons/bug.js";

export default function ExpandableCard(props) {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateExpandableCard, setStateExpandableCard] = useContext(
    ExpandableCardContext
  );
  const [title] = useState(props.title);
  const [subTitle] = useState(props.subTitle);
  const [parent] = useState(props.parent);
  const [cardWidth] = useState(props.cardWidth);
  const [cardWidthExpanded] = useState(props.cardWidthExpanded);
  const [mouseX] = useState(props.mouseX);
  const [mouseY] = useState(props.mouseY);
  const [position] = useState(props.position);
  const [cardHeight] = useState(props.cardHeight);
  const [zIdx, setZidx] = useState(props.zIndex);
  const [cardLeft, setCardLeft] = useState(props.cardLeft);
  const [cardTop, setCardTop] = useState(props.cardTop);
  const [cardHeightExpanded] = useState(props.cardHeightExpanded);
  const [width, setWidth] = useState(props.cardWidth);
  const [height, setHeight] = useState(props.cardHeight);
  const [target, setTarget] = useState({});
  const [targetSourceId] = useState(props.targetSourceId);
  const [targetLabel] = useState(props.targetLabel);
  const theme = useTheme();

  const useStyles = makeStyles((theme) => ({
    card: {
      position: position,
      left: cardLeft,
      top: cardTop,
      zIndex: zIdx,
      WebkitTransform: "translateZ(0)",
      transition: "width 0.1s, height 0.1s, left 0.1s, top 0.1s",
      width: width,
      height: props.expanded ? height : null,
      background: "#011133",
      borderStyle: "solid",
      borderWidth: "thin",
      borderColor: "#011133",
      //display: 'block'
      "& .MuiCardHeader-action": {
        alignSelf: "auto",
      },
    },
    title: {
      fontFamily: "Poppins",
      color: "#FFFFFF",
      fontSize: props.title === "Contact" ? "22px" : "15px",
    },
    headerIcons: {
      // paddingTop: "10px",
      "& .MuiBadge-anchorOriginTopRightRectangle": {
        right: "10px",
        top: "5px",
      },
    },
    subheader: {
      fontFamily: "Poppins",
      color: "#FFFFFF",
      fontSize: "11px",
    },
    content: {
      transition: "height 0.1s",
      backgroundColor: "#fff",
      padding: "0 !important",
      height: height,
      overflowY: "auto",
      height: stateExpandableCard.expanded
        ? "calc(100% - 72px)"
        : "fit-content",
    },
    icons: {
      "&:hover": {
        backgroundColor: "#031d40",
      },
    },
  }));
  const classes = useStyles();

  const [
    trackByUserAndObjectId,
    { loading: loadingTrack, data: dataTrack },
  ] = useLazyQuery(TRACKBYUSERANDOBJECTID);

  //////begin////////temporary  while signed user fixed

  const [getUserByEmail, { data: dataUser }] = useLazyQuery(USERBYEMAIL);
  const [user, setUser] = useState({ _id: "" });

  useEffect(() => {
    if (stateApp && stateApp.user && stateApp.user.email) {
      getUserByEmail({
        variables: {
          userEmail: stateApp.user.email,
        },
      });
    }
  }, [stateApp.user.email]);

  useEffect(() => {
    if (dataUser && dataUser.userByEmail) {
      setUser(dataUser.userByEmail);
    }
  }, [dataUser]);

  /////end/////////temporary while signed user fixed

  useEffect(() => {
    //////stateApp.user._id////////temporary while signed user fixed
    if (user._id !== "" && props.targetSourceId) {
      trackByUserAndObjectId({
        variables: {
          userId: user._id, //////stateApp.user._id////////temporary while signed user fixed
          objectId: props.targetSourceId.toLowerCase(),
        },
      });
    }
  }, [user, props.targetSourceId]); //////stateApp.user._id////////temporary while signed user fixed

  useEffect(() => {
    if (dataTrack) {
      setTarget({
        isTracked: dataTrack.trackByUserAndObjectId ? true : false,
      });
    }
  }, [dataTrack]);

  useEffect(() => {
    setZidx(props.zIndex);
  }, [props.zIndex]);

  useEffect(() => {
    setWidth(cardWidth);
    setHeight(cardHeight);
    if (props.expanded) {
      handleExpand();
    } else {
      handleShrink();
    }
  }, [props.expanded]);

  const handleExpand = () => {
    if (parent === "map" && $("#popupContainer").length) {
      console.log("jquery expand");
    }
    setWidth(cardWidthExpanded);
    setHeight(cardHeightExpanded);
    //setZidx(9)
    //setPosition('absolute')
    //setCardTop(0);
    //setCardLeft(0);
    setStateApp((state) => ({ ...state, expandedCard: true }));
    setStateExpandableCard((state) => ({ ...state, expanded: true }));
  };

  const handleShrink = () => {
    if (parent === "map" && $("#popupContainer").length) {
      console.log("jquery shrink");
    }
    setCardTop(mouseY);
    setCardLeft(mouseX);
    setStateExpandableCard((state) => ({ ...state, expanded: false }));
    setStateApp((state) => ({ ...state, expandedCard: false }));
    setWidth(cardWidth);
    setHeight(cardHeight);

    // {showExpandableCard && !stateApp.expandedCard ? (
  };

  const handleClose = () => {
    if (parent === "map") {
      if ($("#tempPopupHolder").length) {
        console.log("jquery close");
        let popUps = document.getElementsByClassName("mapboxgl-popup");
        if (popUps[0]) popUps[0].remove();
      }

      setStateApp((state) => ({
        ...state,
        popupOpen: false,
      }));
    }

    props.handleCloseExpandableCard();

    //if EC is inside map popup you need to close it
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        id="detailCardHeader"
        classes={{ title: classes.title, subheader: classes.subheader }}
        action={
          <div className={classes.headerIcons}>
            <CommentsWithIcon
              objectId={targetSourceId.toLowerCase()}
              iconZiseSmall={!stateExpandableCard.expanded}
            />

            <TaggerWithIcon
              objectId={targetSourceId.toLowerCase()}
              iconZiseSmall={!stateExpandableCard.expanded}
            />

            {!props.noTrackAvailable && (
              <TrackToggleButton
                target={target}
                targetLabel={targetLabel}
                targetSourceId={targetSourceId.toLowerCase()}
                iconZiseSmall={!stateExpandableCard.expanded}
              />
            )}

            {stateExpandableCard.expanded
              ? parent !== "table" && (
                  <Tooltip title={"Shrink"} placement="top">
                    <IconButton
                      color="secondary"
                      onClick={handleShrink}
                      aria-label="shrink"
                      className={classes.icons}
                    >
                      <ShrinkIcon viewBox="0 0 64 64" />
                    </IconButton>
                  </Tooltip>
                )
              : parent !== "table" && (
                  <Tooltip title={"Expand"} placement="top">
                    <IconButton
                      size="small"
                      onClick={handleExpand}
                      aria-label="expand"
                      className={classes.icons}
                    >
                      <ExpandIcon viewBox="0 0 64 64" color="secondary" />
                    </IconButton>
                  </Tooltip>
                )}
                  


            {stateExpandableCard.expanded && (
              <Tooltip title={"Report Bug"} placement="top">
                <IconButton
                  size="large"
                  onClick={handleExpand}
                  //aria-label="expand"
                  className={classes.icons}
                >
                  <BugsIcon viewBox="0 0 64 64" color="white" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={"Close"} placement="top">
              <IconButton
                size={stateExpandableCard.expanded ? "medium" : "small"}
                onClick={handleClose}
                aria-label="close"
                className={classes.icons}
              >
                <CloseIcon color="secondary" />
              </IconButton>
            </Tooltip>
          </div>
        }
        // title={
        //   title
        //     ? title.length > 30
        //       ? `${title.substr(0, 30)}...${
        //           stateExpandableCard.expanded
        //             // ? props. !== undefined
        //             //   ? `(${props.})`
        //             //   : ""
        //             // : ""
        //         }`
        //       : `${title} ${
        //           stateExpandableCard.expanded
        //             // ? props. !== undefined
        //             //   ? `(${props.})`
        //             //   : ""
        //             // : ""
        //         }`
        //     : "--"
        // }

        title={
          title
            ? title.length > 30
              ? `${title.substr(0, 35)}...`
              : title
            : "--"
        }
        subheader={
          subTitle
            ? subTitle.length > 35
              ? `${subTitle.substr(0, 35)}...`
              : subTitle
            : "--"
        }
      />
      <CardContent className={classes.content}>{props.component}</CardContent>
    </Card>
  );
}
