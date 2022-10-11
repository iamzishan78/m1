/* eslint-disable no-undef */

describe("[Unit Summary] test 'Reviewer' Field", () => {
  it("passes", () => {
    cy.viewport(1400, 900);
    cy.visit("http://localhost:3000");

    cy.checkAndLogin("#workSpaceSignin");

    cy.wait(14000);

    cy.get("#data-name-select", { timeout: 14000 })
      .should("be.visible")
      .click();
    cy.wait(1000);
    cy.get(".MuiList-root", { timeout: 10000 })
      .should("be.visible")
      .contains("Units")
      .click();

    cy.wait(2000);

    cy.get("#cognitive-search-autocomplete", { timeout: 10000 })
      .should("be.visible")
      .type("p-t")
      .then((option) => {
        option[0].click();
      });

    cy.wait(4000);

    cy.get("ul.MuiAutocomplete-listbox")
      .children({ timeout: 8000 })
      .eq(1)
      .children()
      .eq(1)
      .children()
      .eq(1)
      .click({ force: true });
    // cy.visit('http://localhost:3000/map/units/6297e022992e6a5c9b92e6d4')
    cy.wait(4000);
    cy.get("#expandIcon").click();

    cy.intercept("POST", "http://localhost:7071/api/m1graph", (req) => {
      if (req.body.operationName === "updateCustomLayer") {
        req.alias = "updateCustomLayerApiCheck";
      }
    });

    cy.wait(2000);
    cy.contains("Reviewer")
      .siblings(".MuiTableCell-root")
      .children()
      .children()
      .children()
      .eq(1)
      .trigger("mouseover", { force: true })
      .children()
      .click({ force: true });

    cy.contains("Reviewer")
      .siblings(".MuiTableCell-root")
      .eq(0)
      .children()
      .children()
      .children()
      .eq(0)
      .get("#reviewerInput", { timeout: 5000 })
      .should("be.visible")
      .type("jacob");

    cy.get(".MuiAutocomplete-popper li[data-option-index=\"0\"]")
      .should("be.visible")
      .click();


    cy.wait("@updateCustomLayerApiCheck", { timeout: 10000 }).then(
      (interception) => {
        cy.log("Intercepted Log");
        assert.isNotNull(
          interception.response.body,
          "Update Custom Layer api called Successfully"
        );
      }
    );
    // cy.get('.MuiList-root', { timeout: 10000 }).should('be.visible').contains('Units').click()
  });
});
