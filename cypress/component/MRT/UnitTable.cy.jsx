/* eslint-disable no-undef */
import MRTTable from "components/MRTTable";
import { basic_timeouts } from "../../cypressUtils/data";
import { tableGlobalController } from "hookstate/tableController";
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

  it("exports with M1neral System ID", () => {
    cy.verifyApiResponse("@getESSimpleSearchApiByIndex", {
      responseTimeout: basic_timeouts.midTimeout,
    });

    cy.mrtExport({ columns });
  });

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
      const idsArray = response.hits.map((item) => item._id);

      console.log("1st ", idsArray);

      tableGlobalController.updateState({
        cypress: {
          cypressDelete: true,
        },
      });

      cy.get(`[data-testid="over-ride-select-all-div"] input`).click();

      cy.get('.MuiButtonBase-root[data-testid="delete-icon-button"]').click();

      cy.get('.MuiButtonBase-root[data-testid="delete-confirm"]').click();

      cy.interceptApi("gridGenericRemove", null, null, ldata.url);

      cy.verifyApiResponse("@gridGenericRemoveApi", {
        responseTimeout: basic_timeouts.longTimeout,
      }).then((response) => {
        console.log("response remove", response);

        cy.interceptApiByIndex("getESSimpleSearch", "shapes_flat");

        cy.verifyApiResponse("@getESSimpleSearchApiByIndex", {
          responseTimeout: basic_timeouts.midTimeout,
        }).then((interception) => {
          const response =
            interception?.response?.body?.data[
              interception?.request?.body?.operationName
            ];

          console.log("idsArray in othe then", idsArray);

          console.log("response", response.hits);

          const missingIds = idsArray.filter((id) =>
            response.hits.some((item) => item._id === id)
          );

          console.log("missingIds", missingIds);
          cy.wrap(missingIds).should("be.empty");
        });

        console.log("done");
      });
    });
  });
});
