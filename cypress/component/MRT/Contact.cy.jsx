/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';

const columns = [
  {
    name: 'Last Updated',
    type: 'date',
  },
  {
    name: 'Name',
    type: 'string',
    selector: 'div > p > div > div > a',
  },
];

describe('Contact Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getESSimpleSearch', 'contacts_flat'], () => {
      cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />);
    });
  });

  it('sorts by Name & Last Updated', () => {
    cy.wait(100);

    cy.mrtSortColumn({ column: columns[0] });
    cy.mrtSortColumn({ column: columns[1] });
  });

  it(
    'Filters by Name & Last Updated Single Select',
    { retries: { runMode: 5, openMode: 2 } },
    () => {
      cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

      cy.mrtSingleSelect({ column: columns[0] });
      cy.mrtSingleSelect({ column: columns[1] });
    }
  );

  it('Filters by Name Multi Select', { retries: { runMode: 5, openMode: 2 } }, () => {
    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();
    cy.mrtMultiSelect({ column: columns[1] });
  });
});
