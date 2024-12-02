import { call, takeLatest, put, select } from 'redux-saga/effects';
import get from 'lodash/get';

import Api from 'api';
import { getContactCampaignAction, convertTaxOwnerToContactAction } from 'store/actions/contactActions';
import { campaignVariables } from 'utils/data';
import { formatTaxOwners, copy } from 'utils/helper';
import { CREATE_JOB } from 'graphQL/useMutationCreateJob';
import { UPDATE_JOB } from 'graphQL/useMutationUpdateJob';
import { INITIALIZE_EXPORT_JOB } from 'graphQL/useMutationinitializeExportJob';
import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';
import { setReduxKey, toggleBulkUploadAction } from 'store/actions/commonActions';
import { GET_JOB_UPLOAD_URI } from 'graphQL/useQueryGetJobUploadUri';
import { GET_CONTACT_CAMPAIGN, CONVERT_TAX_OWNER_TO_CONTACT, CONVERT_MULTIPLE_OWNER_TO_CONTACT } from 'store/type';

function* getContactCampaign(action) {
	try {
		const { search } = action.payload;
		const contactCampaign = yield call(Api.query, GET_ES_FILTER_LIST, {
			...campaignVariables,
			search,
		});
		yield put(
			getContactCampaignAction.FULLFILLED(
				contactCampaign.data.getESFilterList.hits.filter(hit => hit.key).map(hit => hit.key)
			)
		);
	} catch (error) {
		yield put(getContactCampaignAction.REJECTED());
	}
}

function* convertTaxOwnerToContact(action) {
	const shapeOwners = yield select(state => state.owner.shapeOwners);
	const bulkUpload = yield select(state => state.common.bulkUpload);
	try {
		const { userId } = action.payload;
		const owners = formatTaxOwners(copy(shapeOwners), action.payload);

		const uploadUri = yield call(
			Api.query,
			GET_JOB_UPLOAD_URI,
			{
				jobName: 'Contacts',
				jobType: 'CONTACTS',
				userId,
			},
			{
				fetchPolicy: 'no-cache',
			}
		);

		const { uri, id, internalKey } = uploadUri.data.getJobUploadUri.job;

		const res = yield call(Api.fetchBlob, JSON.stringify(owners), id, internalKey, uri);
		if (res?._response?.status === 201) {
			const jobResponse = yield call(Api.mutate, CREATE_JOB, { jobId: id, sendEmail: false });
			yield call(Api.mutate, UPDATE_JOB, {
				job: {
					_id: id,
					createJobResponse: get(jobResponse, 'data.createJob', null),
				},
			});
		}

		yield put(toggleBulkUploadAction(!bulkUpload));
	} catch (error) {
		yield put(convertTaxOwnerToContactAction.REJECTED());
	}
}

function* convertMultipleOwnerToContact(action) {
	const bulkUpload = yield select(state => state.common.bulkUpload);
	yield put(setReduxKey('contactsAdded', false));
	try {
		const { rows, entitiesIds, existingContactId, autoCalculateOfferPrice, actionType, userId, jobType, jobName } =
			action.payload;
		let _id, _res;
		if (entitiesIds?.length > 0) {
			const id = yield call(Api.mutate, INITIALIZE_EXPORT_JOB, {
				entitiesIds,
			});
			_id = id;
		} else {
			let owners = [];
			for (let i = 0; i < rows.length; i++) {
				owners.push({ node: { ...rows[i], OwnerType: rows[i].ownershipType } });
			}
			owners = formatTaxOwners(copy(owners), action.payload);

			const uploadUri = yield call(
				Api.query,
				GET_JOB_UPLOAD_URI,
				{
					jobName: jobName ? jobName : 'Contacts',
					jobType: jobType ? jobType : 'CONTACTS',
					userId,
					requestPayload: {
						existingContactId,
						actionType,
						autoCalculateOfferPrice,
					},
				},
				{
					fetchPolicy: 'no-cache',
				}
			);

			const { uri, id, internalKey } = uploadUri.data.getJobUploadUri.job;

			const res = yield call(Api.fetchBlob, JSON.stringify(owners), id, internalKey, uri);
			_id = id;
			_res = res;
		}

		if (_res?._response?.status === 201) {
			const jobResponse = yield call(Api.mutate, CREATE_JOB, { jobId: _id, sendEmail: false });
			yield call(Api.mutate, UPDATE_JOB, {
				job: {
					_id: _id,
					createJobResponse: get(jobResponse, 'data.createJob', null),
				},
			});
		}

		yield put(toggleBulkUploadAction(!bulkUpload));
	} catch (error) {
		yield put(convertTaxOwnerToContactAction.REJECTED());
	}
}

/// /////////// Watchers ///////////////////////
export function* watcherContacts() {
	yield takeLatest(GET_CONTACT_CAMPAIGN.STARTED, getContactCampaign);
	yield takeLatest(CONVERT_TAX_OWNER_TO_CONTACT.STARTED, convertTaxOwnerToContact);
	yield takeLatest(CONVERT_MULTIPLE_OWNER_TO_CONTACT.STARTED, convertMultipleOwnerToContact);
}
