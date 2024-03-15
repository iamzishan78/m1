/* eslint-disable no-undef */
import RevenueStatementTable from "components/Table/Revenue/RevenueStatementTable";

describe("Revenue Statement ESHOC Table", () => {
  beforeEach(() => {
    cy.interceptAndWait(["getESSimpleSearch", "checks_flat"], () => {
      cy.viewport(1600, 1200).mount(
        <RevenueStatementTable
          header="Revenue Statements"
          targetLabel="check"
          onGettingPotentialIssues={() => {}}
          onGettingStatements={() => {}}
          esFilters={null}
          filterToggle={null}
          parent="RevenueStatementTable"
          revenueSearchQuery={null}
          loadMore={null}
        />
      );
    });
  });

  it("checks created at/by and updated at/by fields in revenue grid", () => {
    cy.VerifyAuthInfoECHOC();
  });
});
