/* eslint-disable no-undef */

import { basic_timeouts, agreementObj } from "../../../cypressUtils/data";

describe("Add Agreement Spec", () => {
  it("passes", () => {
    const { shorTimeout, longTimeout, extraTimeout } = basic_timeouts;

    cy.viewport(1920, 1080);
    cy.visit("http://localhost:3000/");

    cy.checkAndLogin();

    cy.get("[title='Assets']", { timeout: longTimeout })
      .should("be.visible")
      .click();
    cy.get("#quickActionPanel").contains("Agreements").click();
    cy.interceptApi("getESSimpleSearch");

    cy.verifyApiResponse("@getESSimpleSearchApi").then(() => {
      cy.getTableCell("Agreement", 1).then(($tableCell) => {
        cy.wrap($tableCell).click("left");
        cy.wait(shorTimeout);
        cy.get("#header-tabs", { timeout: longTimeout })
          .should("be.visible")
          .contains("Documents")
          .click();
        cy.wait(4000);
        cy.get("button", { timeout: longTimeout })
          .contains("+ ADD RELATED DCMNT")
          .click({ force: true });
        cy.get("input[type=file]", { force: true }).selectFile(
          "cypress/files/sample.pdf",
          {
            force: true,
          }
        );
        cy.get("#fileNumber").type("1111");
        cy.get("#fileName").type("1111");
        cy.get("#fileType").click();
        cy.get(".MuiAutocomplete-popper ul li")
          .first()
          .should("be.visible")
          .trigger("click");
        cy.get("#fileDate").type("11/24/2022");
        cy.get("#book").type("1111");
        cy.get("#page").type("1111");
        cy.get("#instrument").type("1111");

        cy.interceptApi("AddDescriptorFile");

        cy.get("#addFile").click();

        cy.verifyApiResponse("@AddDescriptorFileApi").then((response) => {
          let fileId1 =
            response.response?.body?.data?.createFileDescriptor?.file?.id;
          cy.wait(2000);
          cy.get("button", { timeout: shorTimeout })
            .contains("+ ADD RELATED DCMNT")
            .click();
          cy.wait(2000);
          cy.get("#existinTab", { timeout: shorTimeout }).click();
          cy.get("#seletExistingDoc").click().type("demo_png.png");
          cy.get(".MuiAutocomplete-popper ul li").first().trigger("click");
          cy.interceptApiByIndex("getESSimpleSearch", "documents_flat");

          cy.get("#addFile").click();
          cy.verifyApiResponse("@AddDescriptorFileApi").then((response2) => {
            let fileId2 =
              response2.response?.body?.data?.createFileDescriptor?.file?.id;

            cy.verifyApiResponse("@getESSimpleSearchApi").then(() => {
              cy.interceptApi("deleteFileDescriptor");
              cy.wait(shorTimeout);
              cy.get(
                "#related-docs-div tbody tr:first-child td:first-child input"
              ).click({ force: true });
              cy.get(
                "#related-docs-div tbody tr:nth-child(2) td:first-child input"
              ).click({force: true});

              cy.get("#related-docs-div button[aria-label=delete]").click();
              cy.get("#deleteButton").click();
                cy.wait(shorTimeout);
                cy.verifyApiResponse("@getESSimpleSearchApi").then((result) => {
                  const filesIds =
                    result.response?.body?.data?.getESSimpleSearch?.hits?.map(
                      (file) => file.fileId
                    );

                    cy.log("-*--* fileIDS -*-*-", filesIds)
                    cy.log("-*--* fileID1, fileID2 -*-*-", fileId1, fileId2)
                  cy.expect(filesIds).to.not.include(fileId1);
                  cy.expect(filesIds).to.not.include(fileId2);
                });
            });
          });
        });
      });
    });
  });
});
