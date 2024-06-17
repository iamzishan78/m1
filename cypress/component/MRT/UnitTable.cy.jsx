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

let responseHits = [];

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

  //test case to verify Total Unit Interest column visible in grid
  it("Total Unit Interest Colummn Must Exist", () => {
    cy.get("table thead th div.Mui-TableHeadCell-Content-Wrapper")
      .contains("Total Unit Interest")
      .should("exist");
  });

  it('Open Bulk Update for Unit Grid', () => {
    // Intercept and wait for a specific API call ('getESSimpleSearch') and perform actions after the call is made
    cy.interceptAndWait(
      ['getESSimpleSearch'],
      (alias) => {
        // Set the viewport size to simulate a desktop environment
        cy.viewport(1600, 1200).mount(<MRTTable   name="UnitTable" 
          overrideMeta={{
            tabLabels: ['Units', 'Unit Interests'],
          }}
        />, {
          // Pass custom settings to the MRTTable component for the test
          mrtOverrideMeta: {
            tabLabels: ['Units', 'Unit Interests'],
          },
        });
        // Wait for the API call to finish with a custom timeout and process the response
        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then((response) => {
          // Store the hits from the API response for later assertions or usage
          responseHits = response.response.body.data.getESSimpleSearch.hits;
        });
      },
      { wait: false } // Do not automatically wait for the intercepted request
    );

    // Select only the first 5 records
    cy.get('input[type="checkbox"]').not('[aria-label="Toggle select all"]').each((checkbox, index) => {
      if (index < 5) {
        cy.wrap(checkbox).click();
      }
    });


    // Initiate the bulk update process by clicking the bulk update button
    cy.get('[data-testid="bulk-update"]').click();

    // Find and interact with the field selection autocomplete input for choosing "Campaign Name"
    cy.get('[data-testid="select-field-autocomplete"]', { timeout: 10000})
    .should('be.visible')
    .click({ force: true })

    // Add custom CSS to adjust z-index
    cy.addCustomCSS(`
      .MuiAutocomplete-popper {
        z-index: 9999 !important; // Adjust z-index as needed
      }
    `);

    // Focus the input field and type
    cy.get('[data-testid="select-field-autocomplete"] input', { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
    .clear()

    // Ensure the dropdown is visible
    cy.get('.MuiAutocomplete-popper', { timeout: 10000 })
    .should('be.visible');

  });
});
