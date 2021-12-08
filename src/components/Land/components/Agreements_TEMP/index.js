import React from "react";
import AnalyticsCards from "components/Land/components/Common/AnalyticsCards";

const cards = [
  {
    heading: "Total Agreements",
    points: "1,462",
  },
  {
    heading: "Active",
    points: "992",
  },
  {
    heading: "Inactive",
    points: "471",
  },
  {
    heading: "Unapproved",
    points: "17",
    type: "warning",
  },
];

export default function Agreements(props) {
  return <AnalyticsCards cards={cards} />;
}
