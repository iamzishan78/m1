/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts } from '../../cypressUtils/data';

const columns = [
  {
    name: 'Name',
    type: 'string',
    selector: 'div > p > div > div > a',
  },
  {
    name: 'Last Updated',
    type: 'date',
  },
];

describe('Contact.cy.jsx', () => {
  beforeEach(() => {
    cy.interceptApiByIndex('getESSimpleSearch', 'contacts_flat');

    cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />);
  });

  it('sorts by Name & Last Updated', () => {
    cy.verifyApiResponse('@getESSimpleSearchApiByIndex', {
      responseTimeout: basic_timeouts.midTimeout,
    });

    cy.wait(100);

    cy.mrtSortColumns({ columns });
  });

  it('filters by Name & Last Updated', () => {
    cy.verifyApiResponse('@getESSimpleSearchApiByIndex', {
      responseTimeout: basic_timeouts.midTimeout,
    });

    cy.wait(100);

    cy.get('.MuiButtonBase-root[aria-label="Show/Hide filters"]').click();

    cy.mrtSingleSelect({ column: columns[0] });
    cy.mrtSingleSelect({ column: columns[1] });

  });
});
