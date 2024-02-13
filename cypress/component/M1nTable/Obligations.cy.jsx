/* eslint-disable no-undef */
import { GETALLACTIVITIES } from "graphQL/useQueryGetAllActivities";
import ldata from "../../fixtures/ldata.json";
import M1nTable from "components/Shared/M1nTable/M1nTable";
import { uniqueId } from "lodash";

const headers = {
  "Content-Type": "application/json",
  "X-ZUMO-AUTH": ldata.x_zumo_auth,
};

describe("Obligation M1nTable", () => {
  it("checks created at/by and updated at/by fields in obligation grid", () => {
    const getAllActivitiesPayload = {
      operationName: "getAllActivities",
      variables: { category: "Obligation" },
      query: GETALLACTIVITIES.loc.source.body,
    };

    cy.request({
      method: "POST",
      url: ldata.url,
      headers: headers,
      body: getAllActivitiesPayload,
    }).then((response) => {
      const result = response.body.data;

      let activities = [];
      result?.activities?.map((act) => {
        const start = new Date(act.dateTime);
        const end = act.endDateTime ? new Date(act.endDateTime) : start;
        activities.push({
          id: uniqueId(),
          ...act,
          start,
          end,
          title: act.fullname,
          notes: act.notes,
          ownerId: act.ownerId,
          type: act.type,
          name: act.name,
        });
      });

      cy.viewport(1600, 1200).mount(
        <M1nTable dense activities={activities} parent="Activities" />
      );

      cy.VerifyAuthInfoM1nTable();
    });
  });
});
