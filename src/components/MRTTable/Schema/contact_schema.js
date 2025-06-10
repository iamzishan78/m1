/* eslint-disable react/prop-types */
import React from 'react';
import Avatar from 'react-avatar';

import MonetizationOnIcon from '@material-ui/icons/LocalAtmOutlined';

import { isEmpty, pickBy } from 'lodash';

import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import Loaders from 'components/Loaders';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import ContactActionMenu from 'components/MRTTable/Common/TableCells/ContactActionMenu';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import ContactToolbar from 'components/MRTTable/TablesOverride/ContactTable/ContactToolbar';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import Contact from 'components/Shared/svgIcons/contact';

import { UPDATECONTACT } from 'graphQL/useMutationUpdateContact.js';

import { tableGlobalController } from 'stateManagement/tableController';

import { copy } from 'utils/helper';

const esIndex = 'contacts_flat';

const onCustomKeyChange = async (client, row, value, item) => {
	const loaderId = `upadting-${row?._id}`;

	try {
		// Starting update loader
		Loaders.createToast(loaderId, 'Updation in Progress');

		// Copying all custom data of user
		const customData = copy(row?.custom_data) ?? {};
		const filteredCustomData = pickBy(customData, value => value !== '' && !isEmpty(value));

		const contact = {
			_id: row._id,
			custom_data: {
				...filteredCustomData,
				[item.name]: value,
			},
		};

		// Runnig mutation
		await client.mutate({
			variables: {
				contact,
				ignoreResponse: true,
			},
			mutation: UPDATECONTACT,
			refetchQueries: ['getDbFilters'],
		});

		// Updating loader for process completion
		Loaders.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch {
		Loaders.errorToast(loaderId, 'Failed to Update');
	}
};

const ContactMeta = {
	esIndex,
	pageSize: 25,
	defaultSort: { field: 'lastUpdateAt', order: 'desc', unmapped_type: 'date' },
	maxTableHeight: 'calc(100vh - 200px)',
	CustomToolBar: ContactToolbar,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	gridViewSettings: {
		label: 'Contact Management',
		module: 'Contacts',
		Icon: Contact,
		defaultView: {
			name: 'All Contacts',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Contacts') {
				view.filters[0].value = user.name;
			}

			return view;
		},
		cssOverride: {
			top: '138px',
			left: '40px',
			marginLeft: '-9px',
		},
	},
	isInFiniteScroll: true,
	columnVirtualization: true,
	// Fetching Meta data for grid
	fetchMetaData: {
		category: 'Contacts', // enable to show custom field inside unit grid
	},
	onCustomKeyChange,
	showAddContactButton: true,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			id: '_id',
			header: 'M1neral Contact System ID',
			isHiddenFieldExport: true,
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			id: 'name',
			header: 'Name',
			size: 450,
			Cell: ({ renderedCellValue, row }) => {
				const isPurchased = [true, 'true', 'True'].includes(row.getValue('isPurchased'));

				const NAME_SPLICE_LENGTH = 2;

				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						{typeof renderedCellValue === 'string' && (
							<Avatar
								color={Avatar.getRandomColor(renderedCellValue, [
									'#b5d2f6',
									'#ade2e9',
									'#eaeaea',
									'#f2c1e2',
									'#d7d6fb',
								])}
								fgColor="#000"
								name={renderedCellValue.split(' ').splice(0, NAME_SPLICE_LENGTH).join(' ')}
								size="35"
								round
							/>
						)}

						<p
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								minWidth: '300px',
								marginLeft: '10px',
							}}
						>
							<ColumnWithLink
								value={renderedCellValue || 'N/A'}
								link={`/contact/details/${row.getValue('_id')}`}
								onClick={e => {
									e.stopPropagation();
								}}
							/>
							{isPurchased && (
								<FeatureFlag feature={FEATURES.IDICORE}>
									<MonetizationOnIcon
										style={{
											marginLeft: '10px',
											color: 'gray',
										}}
									/>
								</FeatureFlag>
							)}
						</p>
					</div>
				);
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'country',
			id: 'country',
			header: 'Country',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'firstName.keyword',
			id: 'firstName',
			header: 'First Name',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'middleName.keyword',
			id: 'middleName',
			header: 'Middle Name',
			isHiddenFieldExport: true,
			hidden: true,
		},

		// // Make formerName to visibile in contact grid
		// {
		// 	...CommonSchema.STRING_COLUMN,
		// 	name: 'formerName.keyword',
		// 	id: 'formerName',
		// 	header: 'Also Known As',
		// 	isHiddenFieldExport: true,
		// 	hidden: true,
		// },

		{
			...CommonSchema.STRING_COLUMN,
			name: 'lastName.keyword',
			id: 'lastName',
			header: 'Last Name',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'suffix.keyword',
			id: 'suffix',
			header: 'Suffix',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'companyName.keyword',
			id: 'companyName',
			header: 'Company Name',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'ownerType.keyword',
			id: 'ownerType',
			header: 'Entity Type',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'primaryAddress.keyword',
			id: 'primaryAddress',
			header: 'Primary Address',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'address1.keyword',
			id: 'address1',
			header: 'Primary Address 1',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'address2.keyword',
			id: 'address2',
			header: 'Primary Address 2',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'city.keyword',
			id: 'city',
			header: 'City',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'state.keyword',
			id: 'state',
			header: 'State',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'county.keyword',
			id: 'county',
			header: 'County',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'zip.keyword',
			id: 'zip',
			header: 'Zip',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'melissaRowsCount',
			id: 'melissaRowsCount',
			header: 'Melissa Rows Count',
			hidden: true,
			isSearchField: false,
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'homePhone.keyword',
			id: 'homePhone',
			header: 'Primary Home Phone',
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'mobilePhone.keyword',
			id: 'mobilePhone',
			header: 'Primary Mobile Phone',
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'phone1.keyword',
			id: 'phone1',
			header: 'Phone 1 (Purchased Data)',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'phone2.keyword',
			id: 'phone2',
			header: 'Phone 2 (Purchased Data)',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'phone3.keyword',
			id: 'phone3',
			header: 'Phone 3 (Purchased Data)',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'phone4.keyword',
			id: 'phone4',
			header: 'Phone 4 (Purchased Data)',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'phone5.keyword',
			id: 'phone5',
			header: 'Phone 5 (Purchased Data)',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'department.keyword',
			id: 'department',
			header: 'Department',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'title.keyword',
			id: 'title',
			header: 'Title',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'mobilephone2.keyword',
			id: 'mobilephone2',
			header: 'Mobile Phone 2',
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'AltPhone.keyword',
			id: 'AltPhone',
			header: 'Primary Work Phone',
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'mobilephone3.keyword',
			id: 'mobilephone3',
			header: 'Mobile Phone 3',
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'homePhone2.keyword',
			id: 'homePhone2',
			header: 'Home Phone 2',
			hidden: true,
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'homePhone3.keyword',
			id: 'homePhone3',
			header: 'Home Phone 3',
			hidden: true,
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'AltPhone2.keyword',
			id: 'AltPhone2',
			header: 'Work Phone 2',
			hidden: true,
		},

		{
			...CommonSchema.DIALPAD_COLUMN,
			name: 'AltPhone3.keyword',
			id: 'AltPhone3',
			header: 'Work Phone 3',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'primaryEmail.keyword',
			id: 'primaryEmail',
			header: 'Primary Email',
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'account.keyword',
			id: 'account',
			header: 'Account',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'secondaryEmail.keyword',
			id: 'secondaryEmail',
			header: 'Email 2',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'linkedIn.keyword',
			id: 'linkedIn',
			header: 'LinkedIn Profile',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'facebook.keyword',
			id: 'facebook',
			header: 'Facebook Profile',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'twitter.keyword',
			id: 'twitter',
			header: 'Twitter Profile',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'jobTitle.keyword',
			id: 'jobTitle',
			header: 'Job Title',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'leadStage.keyword',
			id: 'leadStage',
			header: 'Lead Stage',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'age.keyword',
			id: 'age',
			header: 'Age',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'bankruptcy.keyword',
			id: 'bankruptcy',
			header: 'Bankruptcy Flag ',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'deceased.keyword',
			id: 'deceased',
			header: 'Deceased Flag',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'lien.keyword',
			id: 'lien',
			header: 'Lien Flag',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'relatives.keyword',
			id: 'relatives',
			header: 'Relative Names',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'email3.keyword',
			id: 'email3',
			header: 'Email 3',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'status.keyword',
			id: 'status',
			header: 'Stage',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'contactStatus.keyword',
			id: 'contactStatus',
			header: 'Status',
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'timeZone.keyword',
			id: 'timeZone',
			header: 'Time Zone',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'territory.keyword',
			id: 'territory',
			header: 'Territory',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			type: 'array',
			name: 'campaigns',
			id: 'campaigns',
			header: 'Campaigns',
			isHiddenFieldExport: true,
			hidden: true,
			Cell: ({ row }) => {
				return <CampaignField value={row?.original?.campaigns} fullWidth disabled />;
			},
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'notes.keyword',
			id: 'notes',
			header: 'Comments',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'website.keyword',
			id: 'website',
			header: 'Website',
			hidden: true,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'industryType.keyword',
			id: 'industryType',
			header: 'Industry Type',
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'outcome.keyword',
			accessorKey: 'outcome',
			header: 'Outcome',
			hidden: true,
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'leadSource.keyword',
			id: 'leadSource',
			header: 'Lead Source',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'interestSummary.wellInterestCount',
			id: 'interestSummary.wellInterestCount',
			header: 'Well Interest Count',
			isHiddenFieldExport: true,
			hidden: true,
			isSearchField: false,
		},

		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'interestSummary.unitInterestCount',
			id: 'interestSummary.unitInterestCount',
			header: 'Unit Interest Count',
			hidden: true,
			isSearchField: false,
		},

		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'interestSummary.unitNraSum',
			id: 'interestSummary.unitNraSum',
			header: 'Unit NRA',
			hidden: true,
			isSearchField: false,
		},

		{
			...CommonSchema.NUMBER_COLUMN,
			name: 'interestSummary.tractInterestCount',
			id: 'interestSummary.tractInterestCount',
			header: 'Tract Interest Count',
			hidden: true,
			isSearchField: false,
		},

		{
			...CommonSchema.STRING_COLUMN,
			name: 'isPurchased',
			id: 'isPurchased',
			header: 'Purchased Data Exists',
			isSearchField: false,
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			type: 'boolean',
			Cell: ({ row }) => {
				const isPurchased = [true, 'true', 'True'].includes(row.getValue('isPurchased'));

				return <>{isPurchased ? 'Yes' : 'No'}</>;
			},
		},
		{
			...CommonSchema.STRING_COLUMN,
			name: 'contactOwners.name.keyword',
			id: 'contactOwners.name',
			header: 'Contact Owner',
			isExport: 'contactOwners[0].name',
			Cell: ({ row }) => {
				const name = row?.original?.contactOwners?.map(obj => obj.name);
				return <p>{name?.[0]}</p>;
			},
		},

		CommonSchema.CREATED_BY,
		CommonSchema.CREATED_DATE,
		CommonSchema.LAST_UPDATED_BY,
		CommonSchema.LAST_UPDATED_DATE,

		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				return (
					<TagCell
						id={targetSourceId}
						targetSourceId={targetSourceId}
						tags={row?.original?.tags}
						targetLabel={'contact'}
					/>
				);
			},
		},

		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={'contact'} />;
			},
		},
		{
			...CommonSchema.ACTION_COLUMN,
			name: 'actionMenu',
			id: 'actionMenu',
			header: '',
			size: 70,
			Cell: ({ row }) => {
				const id = row.getValue('_id');
				const name = row.getValue('name');

				return <ContactActionMenu id={id} name={name} esIndex={esIndex} dialogType="dialog" />;
			},
		},
	],
};

export default ContactMeta;
