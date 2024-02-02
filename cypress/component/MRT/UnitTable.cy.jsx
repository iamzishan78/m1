/* eslint-disable no-undef */
import MRTTable from "components/MRTTable";
import { basic_timeouts } from "../../cypressUtils/data";
import { globalStateController } from "hookstate/globalStateController";
import ldata from "../../fixtures/ldata.json";

const columns = [{ name: "M1neral System ID" }];

const countyColumn = {
  name: "County",
  type: "string",
};

describe("UnitInterest Table", () => {
  beforeEach(() => {
    cy.interceptApiByIndex("getESSimpleSearch", "shapes_flat");

    cy.viewport(1600, 1200).mount(<MRTTable name="UnitTable" />);
  });

  // it("exports with M1neral System ID", () => {
  //   cy.verifyApiResponse("@getESSimpleSearchApiByIndex", {
  //     responseTimeout: basic_timeouts.midTimeout,
  //   });

  //   cy.mrtExport({ columns });
  // });

  it("should delete selected rows", () => {
    cy.verifyApiResponse("@getESSimpleSearchApiByIndex", {
      responseTimeout: basic_timeouts.midTimeout,
    });

    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

    cy.interceptApiByIndex("getESSimpleSearch", "shapes_flat");

    cy.mrtSingleSelect({ column: countyColumn });

    cy.verifyApiResponse("@getESSimpleSearchApiByIndex", {
      responseTimeout: basic_timeouts.midTimeout,
    }).then((interception) => {
      const response =
        interception?.response?.body?.data[
          interception?.request?.body?.operationName
        ];
      const deletedIdsArray = response.hits.map((item) => item._id);

      globalStateController.updateState({
        testCase: {
          cypressDelete: true,
        },
      });

      cy.interceptApi("gridGenericRemove");

      cy.interceptApi("getESSimpleSearch");

      cy.verifyApiResponse("@getESSimpleSearchApi", {
        responseTimeout: basic_timeouts.midTimeout,
      });

      cy.wait(3000);

      cy.interceptApi("getESSimpleSearch");

      cy.get(`[data-testid="over-ride-select-all-div"] input`).click();

      cy.get('.MuiButtonBase-root[data-testid="delete-icon-button"]').click();

      cy.get('.MuiButtonBase-root[data-testid="delete-confirm"]').click();

      cy.verifyApiResponse("@gridGenericRemoveApi", {
        responseTimeout: basic_timeouts.midTimeout,
      }).then((deleteResponse) => {
        cy.verifyApiResponse("@getESSimpleSearchApi", {
          responseTimeout: basic_timeouts.midTimeout,
        }).then((interception) => {
          const response =
            interception?.response?.body?.data[
              interception?.request?.body?.operationName
            ];

          const reInitializeIdsArray = response.hits.map((item) => item._id);

          const missingIds = deletedIdsArray.filter((id) =>
            reInitializeIdsArray.some((_id) => _id === id)
          );

          console.log("1st ", deletedIdsArray);
          console.log("reInitializeIdsArray", reInitializeIdsArray);
          console.log("missingIds", missingIds);

          cy.wrap(missingIds).should("be.empty");

          const headers = {
            "Content-Type": "application/json",
            "X-ZUMO-AUTH": ldata.x_zumo_auth,
          };

          const data = deleteResponse.response.body.data.gridGenericRemove.data;
          const getLayerPayload = {
            operationName: "revertCypressDelete",
            variables: { data },
            query: REVERTCYPRESSDELETE.loc.source.body,
          };

          cy.request({
            method: "POST",
            url: ldata.url,
            headers: headers,
            body: getLayerPayload,
          });
        });
      });
    });
  });
});
