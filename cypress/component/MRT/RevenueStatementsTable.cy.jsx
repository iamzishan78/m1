/* eslint-disable no-undef */

// Importing MRTTable component
import MRTTable from "components/MRTTable";

// Definition of columns for the table
const columns = [
  {
    name: "Check Number",
    type: "combination_value",
    selector: "div > div > a",
  },
  {
    name: "Payor Name",
    type: "string",
  },
];

// Test suite description for Properties Table
describe("Properties Table", () => {
  // Before each test, intercept network requests and mount the MRTTable component
  beforeEach(() => {
    cy.interceptAndWait(["getESSimpleSearch", "checks_flat"], () => {
      cy.viewport(1600, 1200).mount(<MRTTable name="RevenueStatementsTable" />);
    });
  });

  // Test case to check the filter on Property Column
  it("should check the filter on Property Column", () => {
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();
    cy.mrtSingleSelect({ column: columns[0] });
  });

  // Test case to check the filter on Property Description Column
  it("should check the filter on Property Description Column", () => {
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();
    cy.mrtSingleSelect({ column: columns[1] });
  });

  // Test case to check sorting is working fine on different columns
  it("should check sorting is working fine on different columns", () => {
    cy.wait(100);

    cy.mrtSortColumn({ column: columns[0] });
    cy.mrtSortColumn({ column: columns[1] });
  });
});
