/* eslint-disable no-undef */
import MRTTable from "components/MRTTable";

const columns = [
  {
    name: "Property",
    type: "combination_value",
    selector: "div > div > div > a",
  },
  {
    name: "Property Description",
    type: "string",
  },
];

describe("Properties Table", () => {
  beforeEach(() => {
    cy.interceptAndWait(["getESSimpleSearch", "properties_flat"], () => {
      cy.viewport(1600, 1200).mount(<MRTTable name="PropertiesTable" />);
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
});
