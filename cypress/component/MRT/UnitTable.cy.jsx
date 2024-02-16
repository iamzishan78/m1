/* eslint-disable no-undef */
import MRTTable from "components/MRTTable";
import { basic_timeouts } from "../../../cypress/cypressUtils/data";
import { globalStateController } from "hookstate/globalStateController";
import ldata from "../../fixtures/ldata.json";
import { REVERTCYPRESSDELETE } from "graphQL/useMutationCommonCypressRevert";
import { headers } from "../../cypressUtils/cypressHeaders";

const columns = [{ name: "M1neral System ID" }];

const countyColumn = {
  name: "County",
  type: "string",
};

describe("Unit Table", () => {
  beforeEach(() => {
    cy.interceptAndWait(["getESSimpleSearch", "shapes_flat"], () => {
      cy.viewport(1600, 1200).mount(<MRTTable name="UnitTable" />);
    });
  });

  it("exports with M1neral System ID", () => {
    cy.mrtExport({ columns });
  });

  it("should delete selected rows", () => {
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

    cy.mrtApplyFilter({
      column: countyColumn,
      callback: (response) => {
        const deletedIdsArray = response.map((item) => item._id);

        globalStateController.updateState({
          testCase: {
            cypressDelete: true,
          },
        });

        cy.interceptAndWait(
          ["gridGenericRemove"],
          (alias) => {
            cy.get(`[data-testid="over-ride-select-all-div"] input`).click();

            cy.get(
              '.MuiButtonBase-root[data-testid="delete-icon-button"]'
            ).click();

            cy.get('.MuiButtonBase-root[data-testid="delete-confirm"]').click();

            cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(
              (deleteResponse) => {
                const data =
                  deleteResponse?.response?.body?.data?.gridGenericRemove.data;

                expect(deleteResponse?.response?.statusCode).to.eq(200);
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
                }).then((r) => {
                  expect(r.status).to.eq(200);
                });
              }
            );
          },
          { wait: false }
        );
      },
    });
  });

  it("checks created at/by and updated at/by fields in unit grid", () => {
    cy.VerifyAuthInfoMRT();
  });
});
