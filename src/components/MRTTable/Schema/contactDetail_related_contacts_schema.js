import Avatar from 'react-avatar';
import MonetizationOnIcon from '@material-ui/icons/LocalAtmOutlined';
import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import ContactDettailRelatedContactsToolBar from 'components/MRTTable/TablesOverride/ContactDetailRelatedContactsTable/ContactDetailRelatedContactsToolbar';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

const esIndex = 'contacts_flat';

const ContactDetailRelatedContactMeta = {
	esIndex,
	pageSize: 25,
	defaultSort: { field: 'lastUpdateAt', order: 'desc', unmapped_type: 'date' },
	maxTableHeight: 'calc(100vh - 200px)',
	CustomToolBar: ContactDettailRelatedContactsToolBar,
	pagination: {
		pageIndex: 0,
		pageSize: 25,
	},
	isInFiniteScroll: true,
	columnVirtualization: true,
	isSelectAllAllowed: true,
	showAddContactButton: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id.keyword',
			id: '_id',
			accessorKey: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			accessorKey: 'name',
			header: 'Name',
			size: 400,
			Cell: ({ renderedCellValue, row }) => {
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
								link={`/contact/details/${row.getValue('_id')}/?tenant=${window.sessionStorage.getItem('tenantName')}`}
								onClick={e => {
									e.stopPropagation();
								}}
							/>
							{!!(row.getValue('isPurchased') === 'true' || row.getValue('isPurchased') === true) && (
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
			...CommonSchema.COMMON_COLUMN,
			name: 'address1.keyword',
			accessorKey: 'address1',
			header: 'Address',
			size: 400,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'mobilePhone.keyword',
			accessorKey: 'mobilePhone',
			header: 'Mobile Phone',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'homePhone.keyword',
			accessorKey: 'homePhone',
			header: 'Home Phone',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'primaryEmail.keyword',
			accessorKey: 'primaryEmail',
			header: 'Email',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'relatedContacts.relationshipType.keyword',
			accessorKey: 'relatedContacts.relationshipType',
			header: 'Relationship Type',
			isArrayKey: true,
			handleArrayExport: {
				esType: 'array',
				// field in data array that will be matched
				referenceKey: 'relatedObject',
				// field in customprops that will be matched
				referenceValueKey: 'contactId',
				// field that needs to be exported from matched object
				actualKey: 'relationshipType',
			},
		},
	],
};

export default ContactDetailRelatedContactMeta;
