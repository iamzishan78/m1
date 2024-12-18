/* eslint-disable no-undef */
import CampaignDetail from 'components/Contacts/components/campaign/CampaignDetail';
import { basic_timeouts } from '../../cypressUtils/data';

describe('Campaign Detail Page', () => {
	beforeEach(() => {
		cy.interceptAndWait(['getCampaign'], () => {
			cy.viewport(1600, 1200).mount(<CampaignDetail />, {
				testCase: { campaignId: '65d875052525694504b694b1' },
			});
		});
	});

	it('change campaign name', () => {
		cy.interceptAndWait(
			['upsertCampaign'],
			alias => {
				cy.get('.MuiFormControl-root[data-testid="campaign-name-text-field"] div textarea:first-child')
					.click()
					.type('{selectall}')
					.clear()
					.type('update cypress test case (Campaign Name change)')
					.blur();
				cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(updateResponse => {
					expect(updateResponse?.response?.body?.data?.upsertCampaign?.message).to.eq(
						'Campaign Name Changes and Job is created Successfullly'
					);

					cy.wait(basic_timeouts.shorTimeout);

					cy.get('.MuiFormControl-root[data-testid="campaign-name-text-field"] div textarea:first-child')
						.click()
						.type('{selectall}')
						.clear()
						.type('cypress test case (Campaign Name change)')
						.blur();
				});
			},
			{ wait: false }
		);
	});
});
