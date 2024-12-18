/* eslint-disable no-undef */
import ActivitiesTable from '../../../src/components/Table/Activities/ActivitiesTable';

describe('Activities ESHOC Table', () => {
	beforeEach(() => {
		cy.interceptAndWait(['getESSimpleSearch', 'activities_flat'], () => {
			cy.viewport(1600, 1200).mount(
				<ActivitiesTable
					activityFilterByType={'all'}
					activityFilterByTime={'all'}
					activityFilterByOwner={'all'}
					esIndex={'activities_flat'}
					searchFields={['name', '_all']}
					filtersChange={() => {}}
					appliedFilters={null}
					filterToggle={null}
					targetLabel={'activitiesDashboard'}
					header="Activities"
					parent="Activities"
				/>
			);
		});
	});

	it('checks created at/by and updated at/by fields in activities grid', () => {
		cy.VerifyAuthInfoECHOC();
	});
});
