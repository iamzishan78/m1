/* eslint-disable no-undef */
import MRTTable from "components/MRTTable";

const columns = [
  {
    name: "Check Number",
    type: "combination_value",
    selector: "div > div > a",
  },
  {
    name: "Check ID",
    type: "string",
  },
];

describe("Properties Table", () => {
  beforeEach(() => {
    cy.interceptAndWait(["getESSimpleSearch", "checks_flat"], () => {
      cy.viewport(1600, 1200).mount(<MRTTable name="RevenueStatementsTable" />);
    });
  });

  it("should check the filter on Property Column", () => {
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();
    cy.mrtSingleSelect({ column: columns[0] });
  });

  it("should check the filter on Property Description Column", () => {
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();
    cy.mrtSingleSelect({ column: columns[1] });
  });

  it("should check sorting is working fine on different columns", () => {
    cy.wait(100);

    cy.mrtSortColumn({ column: columns[0] });
    cy.mrtSortColumn({ column: columns[1] });
  });
});
