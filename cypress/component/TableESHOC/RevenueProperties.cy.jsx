/* eslint-disable no-undef */
import RevenuePropertiesTable from 'components/Table/Revenue/RevenuePropertiesTable';

describe('Revenue Properties ESHOC Table', () => {
  beforeEach(() => {
    cy.interceptAndWait(['getESSimpleSearch', 'properties_flat'], () => {
      cy.viewport(1600, 1200).mount(
        <RevenuePropertiesTable
          searchBar={false}
          esIndex={'properties_flat'}
          header="Properties"
          esFilters={null}
          targetLabel="Revenue Properties"
          parent="RevenuePropertiesTable"
          loading={false}
          filterToggle={null}
          setESFilters={() => null}
          isCheckboxSticky={true}
          onPropertiesCount={null}
          startPaginationAt={50}
          revenueSearchQuery={null}
          actionColumns={[' ', 'Tags', 'Comments']}
          loadMore={null}
        />
      );
    });
  });

  it('checks created at/by and updated at/by fields in properties grid', () => {
    cy.VerifyAuthInfoECHOC();
  });
});
