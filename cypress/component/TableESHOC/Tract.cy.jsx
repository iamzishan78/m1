/* eslint-disable no-undef */
import TractsTable from "components/Table/Tract/TractsTable";

describe("Agreements ESHOC Table", () => {
  beforeEach(() => {
    cy.interceptAndWait(["getESSimpleSearch", "shapes_flat"], () => {
      cy.viewport(1600, 1200).mount(
        <TractsTable
          id="MapGridTractsTable"
          dense
          esIndex={"shapes_flat"}
          parent="search"
          customOptions={null}
          targetLabel={"tract"}
          header={null}
          isSnapGrid
        />
      );
    });
  });

  it("checks created at/by and updated at/by fields in tract grid", () => {
    cy.VerifyAuthInfoECHOC();
  });
});
