/* eslint-disable no-undef */

import { GETPIPELINE } from "graphQL/useQueryPipeline";
import ldata from "../../fixtures/ldata.json";
import M1nTable from "components/Shared/M1nTable/M1nTable";

const headers = {
  "Content-Type": "application/json",
  "X-ZUMO-AUTH": ldata.x_zumo_auth,
};

describe("Flow Line M1nTable", () => {
  it("checks created at/by and updated at/by fields in agreement grid", () => {
    const getPipeLinePayload = {
      operationName: "getPipeline",
      variables: { id: "65a15844bce604464fc1f0ad" },
      query: GETPIPELINE.loc.source.body,
    };

    cy.request({
      method: "POST",
      url: ldata.url,
      headers: headers,
      body: getPipeLinePayload,
    }).then((response) => {
      const result = response.body.data;

      let deals = [];
      let pipe = {
        ...result.pipeline,
        lanes: result.pipeline.lanes?.map((lane) => ({
          ...lane,
          cards: lane.cards?.map((card) => {
            if (!card.metadata.IsDeleted) {
              deals.push({
                cardId: card.id,
                laneId: lane.id,
                laneName: lane.title,
                pipeline: result.pipeline._id,
                pipelineName: result.pipeline.name,
                ownerName:
                  card?.metadata?.owners &&
                  card.metadata.owners[0]?.relatedObject?.name
                    ? card.metadata.owners[0].relatedObject.name
                    : null,
                contactName:
                  card?.metadata?.contacts &&
                  card.metadata.contacts[0]?.relatedObject?.entity?.name
                    ? card.metadata.contacts[0].relatedObject.entity.name
                    : null,
                isContact:
                  card?.metadata?.contacts &&
                  card.metadata.contacts[0]?.relatedObject?._id
                    ? card.metadata.contacts[0].relatedObject._id
                    : null,
                ...card.metadata,
              });
            }

            return { ...card };
          }),
        })),
      };

      cy.viewport(1600, 1200).mount(
        <M1nTable
          dense
          filteredTabTransactData={deals}
          parent="TransactDeals"
          flowLineType={"deal"}
        />
      );

      cy.VerifyAuthInfoM1nTable();
    });
  });
});
