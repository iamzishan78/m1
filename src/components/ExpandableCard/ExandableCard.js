import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { ExpandableCardContext } from "./ExpandableCardContext";

//material-ui components
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ExpandIcon from "./components/svgIcons/ExpandIcon";
import ShrinkIcon from "./components/svgIcons/ShrinkIcon";

import { useLazyQuery } from "@apollo/react-hooks";
import { TRACKBYUSERANDOBJECTID } from "../../graphQL/useQueryTrackByUserAndObjectId";
import { USERBYEMAIL } from "../../graphQL/useQueryUserByEmail"; //////////////temporary while signed user fixed

import TrackToggleButton from "../Shared/TrackToggleButton";
import $ from "jquery";
/* <ExpandableCard 
  expanded={false}
  component={<Test hello="hello world"/>}
  title="My Titlle" 
  subTitle="My Sub Title"
  cardWidth={300} 
  chardHeight={300} 
  cardWidthExpanded={600}
  cardHeightExpanded={600}
  source={stateApp.user}
  sourceSourceId={stateApp.user.id}
  sourceName={stateApp.user.name}
  sourceLabel='user'
  target={row}
  targetSourceId={row.id}
  targetName={row.name}
  targetLabel='owner' />
*/

export default function ExpandableCard(props) {
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateExpandableCard, setStateExpandableCard] = useContext(
    ExpandableCardContext
  );
  const [expanded, setExpanded] = useState(props.expanded);
  const [title, setTitle] = useState(props.title);
  const [subTitle, setSubTitle] = useState(props.subTitle);
  const [parent, setParent] = useState(props.parent);
  const [cardWidth, setCardWidth] = useState(props.cardWidth);
  const [cardWidthExpanded, setCardWidthExpanded] = useState(
    props.cardWidthExpanded
  );
  const [mouseX, setMouseX] = useState(props.mouseX);
  const [mouseY, setMouseY] = useState(props.mouseY);
  const [position, setPosition] = useState(props.position);
  const [cardHeight, setCardHeight] = useState(props.cardHeight);
  const [zIdx, setZidx] = useState(props.zIndex);
  const [cardLeft, setCardLeft] = useState(props.cardLeft);
  const [cardTop, setCardTop] = useState(props.cardTop);
  const [cardHeightExpanded, setCardHeightExpanded] = useState(
    props.cardHeightExpanded
  );
  const [width, setWidth] = useState(props.cardWidth);
  const [height, setHeight] = useState(props.cardHeight);
  const [source, setSource] = useState(props.source);
  const [target, setTarget] = useState(props.target);
  const [targetSourceId, setTargetSourceId] = useState(props.targetSourceId);
  const [targetName, setTargetName] = useState(props.targetName);
  const [targetLabel, setTargetLabel] = useState(props.targetLabel);
  const [sourceName, setSourceName] = useState(props.sourceName);
  const [sourceSourceId, setSourceSourceId] = useState(props.sourceSourceId);
  const [sourceLabel, setSourceLabel] = useState(props.sourceLabel);
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
      height: height,
      background: "#011133",
      borderStyle: "solid",
      borderWidth: "thin",
      borderColor: "#011133",
      //display: 'block'
    },
    title: {
      fontFamily: "Poppins",
      color: "#FFFFFF",
      fontSize: "15px",
    },
    subheader: {
      fontFamily: "Poppins",
      color: "#FFFFFF",
      fontSize: "11px",
    },
    content: {
      transition: "height 0.1s",
      backgroundColor: "#fff",
      padding: "0px",
      height: height,
      overflowY: "auto",
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
    if (dataTrack && props.target) {
      setTarget({
        ...props.target,
        isTracked: dataTrack.trackByUserAndObjectId ? true : false,
      });
    }
  }, [dataTrack, props.target]);

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
      $("#tempPopupHolder").append($("#popupContainer > div"));
    }
    setWidth(cardWidthExpanded);
    setHeight(cardHeightExpanded);
    //setZidx(9)
    //setPosition('absolute')
    setCardTop("70px");
    setCardLeft("10px");
    setStateExpandableCard((state) => ({ ...state, expanded: true }));
  };

  const handleShrink = () => {
    if (parent === "map" && $("#popupContainer").length) {
      console.log("jquery shrink");
      $("#popupContainer").append($("#tempPopupHolder >div"));
    }
    setCardTop(mouseY);
    setCardLeft(mouseX);
    setStateExpandableCard((state) => ({ ...state, expanded: false }));
    setWidth(cardWidth);
    setHeight(cardHeight);
    // setZidx(0)
    //setPosition('relative')
  };
  const handleClose = () => {
    if (parent === "map" && $("#popupContainer").length) {
      console.log("jquery close");
      $("#popupContainer").append($("#tempPopupHolder > div"));

      setStateApp((state) => ({ ...state, popupOpen: false }));
      let popUps = document.getElementsByClassName("mapboxgl-popup");
      if (popUps[0]) popUps[0].remove();
    }
    //setStateApp(state => ({...state,showExpandableCard:false}))
    props.handleCloseExpandableCard();

    //if EC is inside map popup you need to close it
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        classes={{ title: classes.title, subheader: classes.subheader }}
        action={
          <div>
            <TrackToggleButton
              target={target}
              targetLabel={targetLabel}
              targetSourceId={targetSourceId.toLowerCase()}
            />

            {stateExpandableCard.expanded ? (
              <IconButton
                color="secondary"
                onClick={handleShrink}
                aria-label="shrink"
              >
                <ShrinkIcon viewBox="0 0 64 64" fontSize="small" />
              </IconButton>
            ) : (
              <IconButton onClick={handleExpand} aria-label="expand">
                <ExpandIcon
                  viewBox="0 0 64 64"
                  color="secondary"
                  fontSize="small"
                />
              </IconButton>
            )}
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon fontSize="small" color="secondary" />
            </IconButton>
          </div>
        }
        // title={
        //   title
        //     ? title.length > 30
        //       ? `${title.substr(0, 30)}...${
        //           stateExpandableCard.expanded
        //             // ? props.Api !== undefined
        //             //   ? `(${props.Api})`
        //             //   : ""
        //             // : ""
        //         }`
        //       : `${title} ${
        //           stateExpandableCard.expanded
        //             // ? props.Api !== undefined
        //             //   ? `(${props.Api})`
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
