const getLaneTitle = (laneID) => {
  switch (laneID) {
    case "lane1":
      return "Offer Preparation";
    case "lane2":
      return "Offer Extended";
    case "lane3":
      return "Accepted - Due Diligence";
    case "lane4":
      return "Deal Closed";
    case "lane5":
      return "Offer Rejected";
    default:
      return "Offer Preparation";
  }
};

export default getLaneTitle;
