/* eslint-disable no-undef */
import MRTTable from "components/MRTTable";

describe("UnitInterest Table", () => {
  beforeEach(() => {
    cy.interceptAndWait(["getESSimpleSearch", "campaigns_flat"], () => {
      cy.viewport(1600, 1200).mount(<MRTTable name="CampaignTable" />);
    });
  });

  it("checks created at/by and updated at/by fields in campaign grid", () => {
    cy.VerifyAuthInfoMRT();
  });
});
