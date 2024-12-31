import ParcelAgreementTable from 'components/Table/Parcel/ParcelAgreementTable';

import { basic_timeouts } from '../../../cypress/cypressUtils/data';

describe('TractDetail Runsheet  ESHOC Table', () => {
	beforeEach(() => {
		cy.interceptAndWait(['getDbData', 'runsheetinstrument_flat'], () => {
			cy.viewport(1600, 1200).mount(
				<ParcelAgreementTable
					esIndex="runsheetinstrument_flat"
					parent="ownersPerParcel"
					targetLabel="parcelRunsheet"
					customLayer={{
						_id: '65a9129609723f222ab5a4e8',
					}}
					dense
					header={null}
					isCheckboxSticky={true}
				/>
			);
		});
	});

	it('add comments ', () => {
		cy.get('.MuiButtonBase-root[data-testid="comment-icon-button-0"]').click();

		cy.interceptAndWait(
			['getCommentsByObjectId'],
			alias => {
				cy.get('.MuiAutocomplete-root[data-testid="comment-auto-complete"]').click();
				cy.get('.MuiFormControl-root[data-testid="comment-text-field"]')
					.click()
					.clear()
					.type('Cypress Testing Comment');

				cy.get('.MuiButtonBase-root[data-testid="comment-add-button"]').click();

				cy.wait(alias, { timeout: basic_timeouts.longTimeout }).then(addCommentRes => {
					const result = addCommentRes?.response?.body?.data?.commentsByObjectId;
					const existComment = result.some(comment => comment.comment.includes('Cypress Testing Comment'));
					console.log(existComment, 'result', result);
					expect(existComment).to.eq(true);

					cy.get('.MuiButtonBase-root[data-testid="comment-delete-icon-0"]').click();
				});
			},
			{ wait: false }
		);
	});
});
