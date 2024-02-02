/* eslint-disable no-undef */
import MRTTable from "components/MRTTable";

const columns = [{ name: "M1neral System ID" }];

const countyColumn = {
  name: "County",
  type: "string",
};

describe("UnitInterest Table", () => {
  beforeEach(() => {
    cy.interceptAndWait(["getESSimpleSearch", "shapes_flat"], () => {
      cy.viewport(1600, 1200).mount(<MRTTable name="UnitTable" />);
    });
  });

  it("exports with M1neral System ID", () => {
    cy.mrtExport({ columns });
  });
});
