import Avatar from 'react-avatar';
import MonetizationOnIcon from '@material-ui/icons/LocalAtmOutlined';
import moment from 'moment';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import { formatDate } from 'components/Shared/functions';
import Contact from 'components/Shared/svgIcons/contact';
import ContactActionMenu from 'components/MRTTable/Common/TableCells/ContactActionMenu';
import ContactToolbar from 'components/MRTTable/TablesOverride/ContactTable/ContactToolbar';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';

const esIndex = 'contacts_flat';

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
			if (view?.name === 'Recently Modified' || view.name === 'Recently Added') {
				view.filters[0].value.range[view.filters[0].field].gte = moment().subtract(30, 'days').toISOString();
				view.filters[0].value.range[view.filters[0].field].lte = moment().toISOString();
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
	search: {
		fields: ["name^4", "_all"]
	},
	showAddContactButton: true,
	TableSchema: [
		{
			...CommonSchema.MONGO_ID,
			name: '_id',
			accessorKey: '_id',
			header: "M1neral Contact System ID",
			isHiddenFieldExport: true,
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			accessorKey: 'name',
			header: 'Name',
			size: 450,
			Cell: ({ renderedCellValue, row }) => {
				const isPurchased = [true, 'true', 'True'].includes(row.getValue('isPurchased'));

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
								color={Avatar.getRandomColor(renderedCellValue, ['#b5d2f6', '#ade2e9', '#eaeaea', '#f2c1e2', '#d7d6fb'])}
								fgColor="#000"
								name={renderedCellValue.split(' ').splice(0, 2).join(' ')}
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
								value={renderedCellValue}
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
											color: "gray"
										}}

									/>
								</FeatureFlag>
							)}
						</p>
					</div>
				)
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'entity',
			accessorKey: 'entity',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'country',
			accessorKey: 'country',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'firstName.keyword',
			accessorKey: 'firstName',
			header: 'First Name',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'middleName.keyword',
			accessorKey: 'middleName',
			header: 'Middle Name',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'lastName.keyword',
			accessorKey: 'lastName',
			header: 'Last Name',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'suffix.keyword',
			accessorKey: 'suffix',
			header: 'Suffix',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'companyName.keyword',
			accessorKey: 'companyName',
			header: 'Company Name',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'ownerType.keyword',
			accessorKey: 'ownerType',
			header: 'Entity Type',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: ['address1.keyword', 'city.keyword', 'state.keyword', 'zip.keyword'].join(','),
			accessorKey: ['address1', 'city', 'state', 'zip'].join(','),
			header: 'Primary Address',
			size: 700,
			isComposite: true,
			isSearchField: false,

			Cell: cell =>
				[(cell.row.getValue('address1') || ''),
				(cell.row.getValue('city') || ''),
				(cell.row.getValue('state') || ''),
				(cell.row.getValue('zip') || '')]?.join(' ')
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'address1.keyword',
			accessorKey: 'address1',
			header: 'Primary Address 1',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'address2.keyword',
			accessorKey: 'address2',
			header: 'Primary Address 2',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'city.keyword',
			accessorKey: 'city',
			header: 'City',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'state.keyword',
			accessorKey: 'state',
			header: 'State',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'zip.keyword',
			accessorKey: 'zip',
			header: 'Zip',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'melissaRowsCount',
			accessorKey: 'melissaRowsCount',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'homePhone.keyword',
			accessorKey: 'homePhone',
			header: 'Primary Home Phone',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'mobilePhone.keyword',
			accessorKey: 'mobilePhone',
			header: 'Primary Mobile Phone',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'account.keyword',
			accessorKey: 'account',
			header: 'Account',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'department.keyword',
			accessorKey: 'department',
			header: 'Department',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'title.keyword',
			accessorKey: 'title',
			header: 'Title',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'mobilephone2.keyword',
			accessorKey: 'mobilephone2',
			header: 'Mobile Phone 2',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'AltPhone.keyword',
			accessorKey: 'AltPhone',
			header: 'Primary Work Phone',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'mobilephone3.keyword',
			accessorKey: 'mobilephone3',
			header: 'Mobile Phone 3',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'homePhone2.keyword',
			accessorKey: 'homePhone2',
			header: 'Home Phone 2',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'homePhone3.keyword',
			accessorKey: 'homePhone3',
			header: 'Home Phone 3',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'AltPhone2.keyword',
			accessorKey: 'AltPhone2',
			header: 'Work Phone 2',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'AltPhone3.keyword',
			accessorKey: 'AltPhone3',
			header: 'Work Phone 3',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'primaryEmail.keyword',
			accessorKey: 'primaryEmail',
			header: 'Primary Email',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contactOwners.name.keyword',
			accessorFn: row => row?.contactOwners?.name,
			id: 'contactOwners.name',
			header: 'Contact Owner',
			isExport: 'contactOwners[0].name',
			Cell: ({ row }) => {
				const name = row?.original?.contactOwners?.map(obj => obj.name)
				return <p>{name?.[0]}</p>
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'secondaryEmail.keyword',
			accessorKey: 'secondaryEmail',
			header: 'Email 2',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'linkedIn.keyword',
			accessorKey: 'linkedIn',
			header: 'LinkedIn Profile',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'facebook.keyword',
			accessorKey: 'facebook',
			header: 'Facebook Profile',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'twitter.keyword',
			accessorKey: 'twitter',
			header: 'Twitter Profile',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'jobTitle.keyword',
			accessorKey: 'jobTitle',
			header: 'Job Title',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'leadStage.keyword',
			accessorKey: 'leadStage',
			header: 'Lead Stage',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'age.keyword',
			accessorKey: 'age',
			header: 'Age',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'bankruptcy.keyword',
			accessorKey: 'bankruptcy',
			header: 'Bankruptcy Flag ',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deceased.keyword',
			accessorKey: 'deceased',
			header: 'Deceased Flag',
			isHiddenFieldExport: true,
			hidden: true,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'lien.keyword',
			accessorKey: 'lien',
			header: 'Lien Flag',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatives.keyword',
			accessorKey: 'relatives',
			header: 'Relative Names',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'email3.keyword',
			accessorKey: 'email3',
			header: 'Email 3',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'status.keyword',
			accessorKey: 'status',
			header: 'Stage',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contactStatus.keyword',
			accessorKey: 'contactStatus',
			header: 'Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'timeZone.keyword',
			accessorKey: 'timeZone',
			header: 'Time Zone',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'territory.keyword',
			accessorKey: 'territory',
			header: 'Territory',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignName.keyword',
			accessorKey: 'campaignName',
			header: 'Campaign Name',
			isHiddenFieldExport: true,
			hidden: true,
			Cell: ({ row }) => {
				return <CampaignNameField value={row?.original?.campaignName?.[0]} fullWidth disabled />
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'notes.keyword',
			accessorKey: 'notes',
			header: 'Comments',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'website.keyword',
			accessorKey: 'website',
			header: 'Website',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'industryType.keyword',
			accessorKey: 'industryType',
			header: 'Industry Type',
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'leadSource.keyword',
			accessorKey: 'leadSource',
			header: 'Lead Source',
			isHiddenFieldExport: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestSummary.wellInterestCount',
			accessorFn: row => row?.interestSummary?.wellInterestCount,
			id: 'interestSummary.wellInterestCount',
			header: 'Well Interest Count',
			isHiddenFieldExport: true,
			hidden: true,
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestSummary.unitInterestCount',
			accessorFn: row => row?.interestSummary?.unitInterestCount,
			id: 'interestSummary.unitInterestCount',
			header: 'Unit Interest Count',
			hidden: true,
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestSummary.unitNraSum',
			accessorFn: row => row?.interestSummary?.unitNraSum,
			id: 'interestSummary.unitNraSum',
			header: 'Unit NRA',
			hidden: true,
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'interestSummary.tractInterestCount',
			accessorFn: row => row?.interestSummary?.tractInterestCount,
			id: 'interestSummary.tractInterestCount',
			header: 'Tract Interest Count',
			hidden: true,
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'isPurchased',
			accessorKey: 'isPurchased',
			header: 'Is Purchased Data',
			isSearchField: false,
			filterSelectOptions: [
				{ label: 'Yes', value: 'true' },
				{ label: 'No', value: 'false' },
			],
			Cell: ({ row }) => {
				const isPurchased = [true, 'true', 'True'].includes(row.getValue('isPurchased'));

				return <>{isPurchased ? 'Yes' : 'No'}</>;
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
				return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={'contact'} />;
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
			accessorKey: 'actionMenu',
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
