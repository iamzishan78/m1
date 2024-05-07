/* eslint-disable no-undef */
import DocumentsTable from "components/Table/Documents/DocumentsTable";

describe("Document ESHOC Table", () => {
  beforeEach(() => {
    cy.interceptAndWait(["getESDocuments"], () => {
      cy.viewport(1600, 1200).mount(
        <DocumentsTable
          parent="Documents"
          documentSearchQuery={null}
          refetch={null}
          refetchData={() => {}}
        />
      );
    });
  });

  it("checks created at/by and updated at/by fields in document grid", () => {
    cy.VerifyAuthInfoECHOC();
  });
});
