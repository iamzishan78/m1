import React, { useEffect } from "react";
import { get } from "lodash";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

// Components
import NavHeader from "components/Land/components/Common/NavHeader";
import CampaignHeader from "components/Contacts/components/campaign/campaignHeader";

import { GET_CAMPAIGN } from "graphQL/useQueryCampaign";

const CampaignDetail = () => {
  const { campaignId } = useParams();

  const [getCampaign, { data: campaignData }] = useLazyQuery(GET_CAMPAIGN);

  useEffect(() => {
    if (campaignId)
      getCampaign({
        variables: {
          campaignId,
        },
      });
  }, [campaignId, getCampaign]);

  return (
    <NavHeader title={`${get(campaignData, "getCampaign.name")}`}>
      <CampaignHeader campaign={get(campaignData, "getCampaign", {})} />
    </NavHeader>
  );
};

export default CampaignDetail;
