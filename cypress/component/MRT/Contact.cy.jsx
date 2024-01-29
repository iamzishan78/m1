/* eslint-disable no-undef */
import MRTTable from 'components/MRTTable';
import { basic_timeouts } from '../../cypressUtils/data';

describe('Contact.cy.jsx', () => {
  beforeEach(() => {
    cy.interceptApiByIndex('getESSimpleSearch', 'contacts_flat');

    cy.viewport(1600, 1200).mount(<MRTTable name="ContactTable" />);
  });

  it('sorts by Name & Last Updated', () => {
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

    cy.verifyApiResponse('@getESSimpleSearchApiByIndex', {
      responseTimeout: basic_timeouts.midTimeout,
    });

    cy.wait(100);

    cy.mrtSortColumns({ columns });
  });
});
