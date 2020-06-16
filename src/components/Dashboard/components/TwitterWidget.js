import React, { useContext } from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { DashboardContext } from "../DashboardContext";

const TwitterWidget = () => {
  const [stateDashboard] = useContext(DashboardContext);
  const { cardIndices, userhandle } = stateDashboard;
  const tcard = cardIndices?.find((ind) => ind.key === 2);
  return (
    <TwitterTimelineEmbed
      key={`${userhandle}-${tcard?.index}`}
      sourceType="timeline"
      screenName={userhandle}
      options={{ height: 680 }}
      placeholder="Loading" 
    />
  );
};

export default TwitterWidget;
