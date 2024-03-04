/* eslint-disable no-undef */
import MRTTable from "components/MRTTable";
import { basic_timeouts } from "../../../cypress/cypressUtils/data";

describe("Campaign Contact Table", () => {
  beforeEach(() => {
    cy.interceptAndWait(["getESSimpleSearch", "contacts_flat"], () => {
      cy.viewport(1600, 1200).mount(
        <MRTTable
          name="CampaignContactTable"
          overrideMeta={{
            defaultFilters: [
              {
                field: "campaignName.keyword",
                value: "contact campaign (Cypress do not Delete)",
              },
            ],
          }}
        />
      );
    });
  });

  it("checks default filter is not missing in job", () => {
    cy.get(`[data-testid="over-ride-select-all-div"] input`).click();
    cy.get(
      '.MuiButtonBase-root[data-testid="export-contact-and-purchse-icon-button"]'
    ).click();

    cy.interceptAndWait(
      ["initializeExportJob"],
      (alias) => {
        cy.get(
          '[data-testid="export-contact-and-purchse-icon-checkbox"]'
        ).click();

        cy.get(
          '.MuiButtonBase-root[data-testid="export-contact-and-purchse-confirm-button"]'
        ).click();

        cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(
          (jobResponse) => {
            console.log(
              "filters",
              jobResponse?.request?.body?.variables?.requestPayload?.filters
            );

            cy.wrap(
              jobResponse?.request?.body?.variables?.requestPayload?.filters
            )
              .should("exist")
              .and("be.an", "array")
              .and("not.have.length", 0);
          }
        );
      },
      { wait: false }
    );
  });
});
