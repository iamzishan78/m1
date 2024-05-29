import PropertyInterestDetailsSection from 'components/Revenue/components/Properties/DetailComponents/PropertyInterestDetailsSection';
import InterestDetailForm from 'components/Revenue/components/Properties/DetailComponents/InterestDetailForm';

describe('Property interest details ESHOC Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getESSimpleSearch', 'propertyinterest_flat'], () => {
      cy.viewport(1600, 1200).mount(
        <>
          <InterestDetailForm
            propertyDetails={{
              name: '11371.1 - Well 123 345',
              description: 'TRAINER UNIT 1H',
              purchaserNumber: '11371.1',
              IsDeleted: false,
              lastUpdateAt: '2024-05-15T12:23:22.511Z',
              lastUpdateBy: {
                _id: '659ce7cf97935e0ffa857858',
                email: 'support@m1neral.com',
                name: 'M1neral Support',
                displayName: 'M1neral Support',
              },
              wells: [],
              tags: [],
              comments: [],
              lastCheck: {
                _id: '65eb347b57bd33a1131cca68',
                interestType: ['R1'],
                checkNumber: '262148.3',
                checkDate: '2024-01-26T15:53:03.669Z',
                netOwnerValue: 0.04,
              },
              owner: {
                interestSummary: {},
                _id: '6656d11e88a7d2272e83a8c3',
              },
              operator: {
                name: 'Antero Resources Corporation',
                interestSummary: {},
                _id: '6656d11e88a7d2272e83a8c2',
              },
              purchaser: {
                name: 'Antero Resources Corporation',
                interestSummary: {},
                _id: '6656d11e88a7d2272e83a8c1',
              },
              flatSyncAt: '2024-05-29T06:54:22.124Z',
              _id: '65e0abb5bcae748d7e57b1ac',
              sort: [1, 804],
            }}
            selectedInterest={null}
            setShowOwnerDialog={() => null}
            propertyOwnerContact={null}
            onClose={() => null}
            propertyId={'65e0abb5bcae748d7e57b1ac'}
          />
          <PropertyInterestDetailsSection
            propertyId={'65e0abb5bcae748d7e57b1ac'}
            setSelectedInterest={() => null}
            showInterestDetails={true}
            onClickAdd={() => null}
            setNewAgmtState={() => null}
          />
        </>
      );
    });
  });

  it('checks by creating property interests', () => {
    cy.get('#autocompEntityNamesVirtualizeList').click();
    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();

    cy.interceptAndWait(
      ['addPropertyInterest'],
      (alias) => {
        cy.contains('span.MuiButton-label', 'Add').click();
        cy.wait(alias, { timeout: 400000 }).then((res) => {
          expect(res.response.body.data.addPropertyInterest.success).to.be.equal(true);
        });
      },
      { wait: false }
    );
  });
});
