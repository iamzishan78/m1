import ParcelAgreementTable from "components/Table/Parcel/ParcelAgreementTable";

describe("TractDetail Runsheet  ESHOC Table", () => {
  beforeEach(() => {
    cy.interceptAndWait(
      ["getESSimpleSearch", "runsheetinstrument_flat"],
      () => {
        cy.viewport(1600, 1200).mount(
          <ParcelAgreementTable
            esIndex="runsheetinstrument_flat"
            parent="ownersPerParcel"
            targetLabel="parcelRunsheet"
            customLayer={{
              _id: "65a9129609723f222ab5a4e8",
            }}
            dense
            header={null}
            isCheckboxSticky={true}
          />
        );
      }
    );
  });

  it("add comments ", () => {
    cy.scrollTo("right", { ensureScrollable: false });
  });
});
