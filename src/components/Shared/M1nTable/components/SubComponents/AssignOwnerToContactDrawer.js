import React, { useState, useEffect } from 'react';

import { Button, Grid, Box, CircularProgress, InputAdornment, IconButton } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseSharp from '@material-ui/icons/CloseSharp';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useMutation, useQuery } from '@apollo/client';
import set from 'lodash/set';

import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import EntityType from 'components/ContactDetailCard/components/FieldContent/EntityType';
import { timeZoneOptions } from 'components/ContactDetailCard/components/FieldContent/timeZoneList';
import Loader from 'components/Loaders';
import RelatedContact from 'components/MRTTable/Common/Dialog/BulkUpdate/RelatedContact';
import ContactAutoComplete from 'components/Shared/ContactAutoComplete';
import FieldBulkAutoComplete from 'components/Shared/FieldBulkAutoComplete';
import { CurrencyFormatCustomWithoutPrefix } from 'components/Shared/Forms/Formatting/CurrencyFormatCustomWithoutPrefix';
import { copy } from 'components/Shared/functions';

import { ASSIGN_OWNER_TO_CONTACT } from 'graphQL/useMutationAssignOwnerToContact';
import { BULKUPSERTTAG } from 'graphQL/useMutationBulkUpsertTagOnContacts';
import { UPSERT_ENTITY_CAMPAIGNS } from 'graphQL/useMutationCampaign';
import { ADD_RELATED_CONTACTS } from 'graphQL/useMutationRelatedContact';
import { UPDATEBULKCONTACT } from 'graphQL/useMutationUpdateBulkContact';
import { UPDATE_PARCEL_OWNERS } from 'graphQL/useMutationUpdateParcelOwners';
import { UPDATE_SHAPE_OWNERS } from 'graphQL/useMutationUpdateShapeOwners';
import { UPDATE_SHAPES } from 'graphQL/useMutationUpdateShapes';
import { PUBLICTAGSQUERY } from 'graphQL/useQueryPublicTags';

import { globalStateController } from 'hookstate/globalStateController';
import { tableGlobalController } from 'hookstate/tableController';

import { Modals } from 'styles/Modal';

import { resetESTableToggle } from 'hookstate';

import RightDialog from '../../../../ContactDetailCard/components/RightDialog';

const styles = () => ({
	topHeading: { fontWeight: 'bold' },
	loading: {
		position: 'absolute',
		left: '250px',
		bottom: '148px',
		zIndex: '150',
	},
	dialogTitle: {
		padding: '25px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	fullWidth: {
		width: '100%',
	},
	chip: {
		'& .MuiAutocomplete-inputRoot': { minHeight: '56px' },
		'& .MuiChip-root': {
			backgroundColor: '#ECEDED',
			color: '#606060',
			borderRadius: '4px',
		},
	},
	input: {
		'& input': {
			caretColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'transparent'),
			color: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '#008ebf'),
			backgroundColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '#D5F4FF'),
			maxWidth: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '33px'),
			width: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '33px'),
			height: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '32px'),
			fontSize: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '25px'),
			margin: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '3px'),
			padding: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '0px !important'),
			borderRadius: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : '50%'),
			textAlign: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'center'),
			cursor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'pointer'),
			'&:hover': {
				boxShadow: ({ showPlusAddIcon }) =>
					!showPlusAddIcon
						? ''
						: '0px 2px 2px -1px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.12), 0px 1px 10px 0px rgba(0,0,0,0.1)',
				backgroundColor: ({ showPlusAddIcon }) => (!showPlusAddIcon ? '' : 'rgba(0, 0, 0, 0.08)'),
			},
			transition: ({ showPlusAddIcon }) =>
				!showPlusAddIcon
					? ''
					: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		},
	},
});

const useStyles = makeStyles(styles);

/**
 * Component that renders different input fields based on the provided field type.
 * @param {Object} props - Component props.
 * @param {string} props.field - Field type to render.
 * @param {Function} props.setFieldKey - Function to set the field value.
 * @param {Function} props.setCampaigns - Function to set the campaigns array.
 * @param {Function} props.setContactOwner - Function to set the contact owner.
 * @param {string} props.contactOwner - Current contact owner value.
 * @param {string} props.fieldKey - Current field value.
 * @param {Array} props.campaigns - Current campaigns array.
 */
function SelectedField({
	field,
	setFieldKey,
	setCampaigns,
	setContactOwner,
	contactOwner,
	fieldKey,
	campaigns,
	classes,
	publicTags,
}) {
	let filterKey = ''; // Initialize filterKey variable to determine specific filter criteria

	// Switch statement to render different input fields based on the field type
	switch (field) {
		case 'Contact Owner':
			// Renders autocomplete field for selecting contact owner
			return (
				<ContactAutoComplete
					value={contactOwner}
					onChange={(e, user) => {
						const value = user && user.value ? user.value : '';
						setFieldKey(value); // Sets the field key value
						setContactOwner(value); // Sets the contact owner value
					}}
				/>
			);
		case 'Campaigns':
			// Renders field for updating campaign name
			// filterKey is not set for this case
			return (
				<CampaignField
					value={fieldKey}
					onChange={values => {
						setFieldKey(values); // Sets the field key value
						setCampaigns(values); // Updates campaigns array
					}}
					fullWidth // Renders field with full width
					targetLabel="Contact" // Sets target label to 'Contact'
					simpleChips // Uses simple chips for rendering
				/>
			);
		case 'Stage':
			filterKey = 'status.keyword'; // Sets filterKey to 'status.keyword' for filtering by stage
			break;
		case 'Status':
			filterKey = 'contactStatus.keyword'; // Sets filterKey to 'contactStatus.keyword' for filtering by status
			break;
		case 'Industry Type':
		case 'Lead Source':
		case 'Territory':
			// Renders text field for entering values for industry type, lead source, or territory
			return (
				<TextField
					placeholder="Enter a value"
					value={fieldKey}
					onChange={({ target }) => {
						setFieldKey(target.value); // Sets the field key value based on input
					}}
					autoFocus={true} // Automatically focuses on input
					className={classes.fullWidth} // Uses CSS class 'fullWidth'
				/>
			);
		case 'Time Zone':
			// Renders autocomplete field for selecting time zone
			return (
				<Autocomplete
					id="combo-box-demo"
					options={timeZoneOptions} // Provides time zone options for selection
					onChange={(e, newValue) => {
						setFieldKey(newValue); // Sets the field key value based on selected time zone
					}}
					value={fieldKey} // Current selected time zone value
					renderInput={params => <TextField {...params} size="small" placeholder="Select Timezone" />} // Renders input field for selecting time zone
				/>
			);
		case 'Tags':
			// Renders autocomplete field for selecting multiple tags
			return (
				<Autocomplete
					multiple // Allows selecting multiple tags
					className={classes.chip} // Uses CSS class 'chip' for styling
					id="update-contacts-tags"
					options={publicTags?.publicTags || []} // Provides options for tags selection
					getOptionLabel={option => option} // Retrieves label for each tag option
					value={fieldKey || []} // Current selected tags array
					onChange={(e, newTagsArr) => setFieldKey(newTagsArr)} // Sets the field key value based on selected tags array
					renderInput={params => <TextField {...params} variant="outlined" className={classes.input} />} // Renders input field for selecting tags
				/>
			);
		// Additional cases can be added as needed for different field types
		case 'Max Pricing (Per NRA)':
		case 'Target Pricing (Per NRA)':
			// Add text field for Max Pricing and Target Pricing bulk update
			return (
				<TextField
					key={field} // Use key to force re-render and re-apply focus
					placeholder={field}
					value={fieldKey}
					onChange={({ target }) => {
						setFieldKey(target.value);
					}}
					autoFocus={true} // This will automatically focus the field when rendered
					className={classes.fullWidth}
					InputProps={{
						startAdornment: <InputAdornment position="start">$</InputAdornment>,
						inputComponent: CurrencyFormatCustomWithoutPrefix,
					}}
				/>
			);
		case 'Entity Type':
			filterKey = 'ownerType.keyword'; // Sets filterKey to 'ownerType.keyword' for filtering by entity type
			return (
				<EntityType
					setDocumentType={value => {
						setFieldKey(value.name); // Sets the field key value based on selected entity type
					}}
					value={fieldKey} // Current selected entity type value
				/>
			);
		case 'Related Contact':
			// Renders component for selecting related contacts
			return <RelatedContact setFieldKey={setFieldKey} />;
		default:
	}

	// Conditional rendering based on filterKey value
	if (filterKey) {
		return (
			<FieldBulkAutoComplete
				value={fieldKey || []} // Current selected value or empty array
				placeholder={`Select ${field}`} // Placeholder text for the field
				filterKey={filterKey} // Sets filter key based on field type
				onChange={(e, fieldKey) => {
					setFieldKey(fieldKey.value); // Sets the field key value based on selected value
				}}
			/>
		);
	}
	return ''; // Default case returns an empty string
}

export default function AssignOwnerToContactDrawer({
	onClose,
	rows,
	setRows,
	showSuccessMessage,
	getContactCampaignAction,
	campaignList,
	selectedCampaign,
	...rest
}) {
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const classes = useStyles();
	const modalClass = Modals();
	const [contactOwner, setContactOwner] = useState('');
	const [field, setField] = useState('');
	const [fieldKey, setFieldKey] = useState();
	const [loading, setLoading] = useState(false);
	const [campaigns, setCampaigns] = useState([]);
	const [rowsLoading, setRowsLoading] = useState(false);

	const { data: publicTags } = useQuery(PUBLICTAGSQUERY, {
		fetchPolicy: 'cache-and-network',
	});

	const options = {
		refetchQueries: ['getESContacts', 'getDbData'],
		awaitRefetchQueries: true,
		onCompleted: () => {
			tableGlobalController.refetch();
		},
	};

	const [updateShapeOwners] = useMutation(UPDATE_SHAPE_OWNERS, {
		...options,
		refetchQueries: ['getDbData', 'getESFilterList', 'getCustomLayer'],
	});
	const [updateParcelOwners] = useMutation(UPDATE_PARCEL_OWNERS, {
		...options,
		refetchQueries: ['getDbData', 'getESFilterList', 'getCustomLayer'],
	});
	const [updateShapes] = useMutation(UPDATE_SHAPES, {
		...options,
		refetchQueries: ['getDbData', 'getESFilterList', 'getCustomLayer'],
	});
	const [assignOwnerToContact] = useMutation(ASSIGN_OWNER_TO_CONTACT, options);
	const [updateBulkContact] = useMutation(UPDATEBULKCONTACT, options);
	const [updateBulkTags] = useMutation(BULKUPSERTTAG, options);
	const [upsertEntityCampaigns] = useMutation(UPSERT_ENTITY_CAMPAIGNS, {
		onCompleted: () => {
			tableGlobalController.refetch();
		},
	});

	//add RelatedContacts Api
	const [addRelatedContacts] = useMutation(ADD_RELATED_CONTACTS, {
		onCompleted: () => {
			tableGlobalController.refetch();
		},
	});

	const unitTableFields = [
		// Add unit grid fields for bulk update
		{ title: 'Campaigns', value: 'campaigns' },
		{ title: 'Max Pricing (Per NRA)', value: 'uMaxUnitPricing' },
		{ title: 'Target Pricing (Per NRA)', value: 'uUnitPricing' },
		{ title: 'Tags', value: 'contactStatus' },
	];

	const otherTableFields = [
		{ title: 'Campaigns', value: 'campaigns' },
		{ title: 'Contact Owner', value: 'contactOwner' },
		{ title: 'Entity Type', value: 'ownerType' },
		{ title: 'Industry Type', value: 'industryType' },
		{ title: 'Lead Source', value: 'leadSource' },
		{ title: 'Stage', value: 'status' },
		{ title: 'Status', value: 'contactStatus' },
		{ title: 'Tags', value: 'contactStatus' },
		{ title: 'Territory', value: 'territory' },
		{ title: 'Time Zone', value: 'timeZone' },
		{ title: 'Related Contact', value: 'relatedcontact' },
	];

	const fieldsToUpdate = rest.header === 'UnitTable' ? [...unitTableFields] : [...otherTableFields];

	useEffect(() => {
		if (!['Industry Type', 'Lead Source', 'Territory', 'Time Zone', 'Tags'].includes(field)) {
			getContactCampaignAction({
				search: fieldKey ? `${fieldKey}*` : '*',
			});
		}
	}, [fieldKey]);

	useEffect(() => {
		if (!rows || rows.length === 0) {
			setRowsLoading(true);
		} else {
			setRowsLoading(false);
		}
	}, [rows]);

	useEffect(() => {
		if (selectedCampaign) {
			setCampaigns([selectedCampaign]);
		}
	}, [selectedCampaign]);

	const onDelete = row => {
		setRows(rows.filter(r => r._id !== row._id));
	};

	const onFieldToUpdateChange = field => {
		setField(field);
		if (field === 'Campaigns' && selectedCampaign) {
			setFieldKey(selectedCampaign.name);
		} else {
			setFieldKey('');
		}
	};

	const updateCampaign = (shape, field, value) => {
		/* -------------------------------- Data Fix -------------------------------- */
		if (field.includes('originalProperties.')) {
			delete shape.properties[field];
		}
		if (field.includes('originalProperties.State')) {
			set(shape.properties, 'originalProperties.StateAbbreviation', value);
		}
		if (field.includes('originalProperties.Section')) {
			set(shape.properties, 'originalProperties.ShortName', value);
		}
		if (field.includes('originalProperties.Meridian')) {
			set(shape.properties, 'originalProperties.PrincipalMeridian', value);
		}
		/* -------------------------------- Data Fix -------------------------------- */

		set(shape.properties, field, value); // Set field and its value in shapeJson

		const customLayer = {};

		if (field.includes('originalProperties')) {
			set(shape.properties, field.replace('originalProperties.', '').toLowerCase(), value);
		}
		customLayer.shape = JSON.stringify(shape); // Assign updated shape
		customLayer.shapeJson = shape; // Assign updated shapeJson

		return customLayer;
	};

	const bulkShapeUpdate = (shapesToUpdate, errorMsg) => {
		// Update the shapes with the new data
		updateShapes({
			variables: {
				shapes: shapesToUpdate,
			},
			refetchQueries: ['getESFilterList', 'getCustomLayer'], // Refetch these queries after the update
			awaitRefetchQueries: true,
		}).then(
			res => {
				// Toggle the reset state for the table to refresh its data
				resetESTableToggle.set(!resetESTableToggle.get());

				// Check if the response data is present and updateShapes was successful
				if (res.data && res.data.updateShapes) {
					const success = res.data.updateShapes.success;
					if (success) {
						// Show a success toast and message if the update was successful
						Loader.successToast('contact-creation', 'Updated');
						showSuccessMessage(`${field} Bulk Updated Successfully`);

						// Call the onBulkUpdateComplete callback if it exists
						if (rest.onBulkUpdateComplete) {
							rest.onBulkUpdateComplete();
						}
					} else {
						// Show an error toast if the update was not successful
						Loader.errorToast('contact-creation', 'Updated');
					}
				} else {
					// Show an error toast if the response data is not as expected
					Loader.errorToast('contact-creation', 'Failed');
				}
			},
			err => {
				console.log(err);
				Loader.errorToast('contact-creation', errorMsg);
			}
		);
	};

	const onAssign = () => {
		const contactIds = rows.map(row => row.contactId || row._id);

		const errorMsg = 'Failed to assign to contact owner';
		Loader.createToast(
			'contact-creation',
			`${rest.header === 'UnitTable' ? 'Unit' : 'Contact'} Bulk Update in progress`
		);

		if (field === 'Contact Owner') {
			assignOwnerToContact({
				variables: { contactIds, contactOwner, userId: getUser?._id },
				refetchQueries: ['getESContacts'],
				awaitRefetchQueries: true,
			}).then(
				res => {
					resetESTableToggle.set(!resetESTableToggle.get());
					if (res.data && res.data.assignOwnerToContact) {
						const { success, message } = res.data.assignOwnerToContact;
						if (success) {
							Loader.successToast('contact-creation', message);
							showSuccessMessage('Contacts Updated Successfuly');
							if (rest.onBulkUpdateComplete) {
								rest.onBulkUpdateComplete();
							}
						} else {
							Loader.errorToast('contact-creation', message);
						}
					} else {
						Loader.errorToast('contact-creation', errorMsg);
					}
				},
				err => {
					console.log(err);
					Loader.errorToast('contact-creation', errorMsg);
				}
			);
		} else if (field === 'Tags') {
			const contactIds = rows.map(row => row.contactId || row._id);

			updateBulkTags({
				variables: {
					tags: fieldKey,
					user: getUser?._id,
					contactIds,
					objectType: rest?.objectType,
				},
				refetchQueries: rest?.refetchQueries,
				awaitRefetchQueries: true,
			}).then(
				res => {
					resetESTableToggle.set(!resetESTableToggle.get());
					if (res.data && res.data.bulkUpsertTagOnContacts) {
						const { success, message } = res.data.bulkUpsertTagOnContacts;

						if (success) {
							Loader.successToast('contact-creation', message);
							showSuccessMessage('Contacts Updated Successfuly');
						} else {
							Loader.errorToast('contact-creation', message);
						}
					} else {
						Loader.errorToast('contact-creation', errorMsg);
					}
				},
				err => {
					console.log(err);
					Loader.errorToast('contact-creation', errorMsg);
				}
			);
		} else if (field === 'Related Contact') {
			// calling addRelatedContacts api
			addRelatedContacts({
				variables: {
					relationshipType: fieldKey?.relationshipType,
					descriptorObject: fieldKey?.descriptorObject?.value,
					relatedObject: contactIds,
					userId: getUser?._id,
				},
			}).then(
				res => {
					resetESTableToggle.set(!resetESTableToggle.get());
					if (res.data && res.data.addRelatedContacts) {
						const { success, message } = res.data.addRelatedContacts;

						if (success) {
							Loader.successToast('contact-creation', message);
							showSuccessMessage('Contacts Updated Successfuly');
						} else {
							Loader.errorToast('contact-creation', message);
						}
					} else {
						Loader.errorToast('contact-creation', errorMsg);
					}
				},
				err => {
					console.log(err);
					Loader.errorToast('contact-creation', errorMsg);
				}
			);
		} else if (field === 'Max Pricing (Per NRA)' || field === 'Target Pricing (Per NRA)') {
			// Map through each row to create an array of shapes to update
			const shapesToUpdate = rows.map(row => {
				// Update the campaign with the new value and fieldKey, creating a custom layer for each row
				const customlayer = updateCampaign(
					copy(row.shapeJson),
					fieldsToUpdate.find(fieldtoUpdate => fieldtoUpdate.title === field).value,
					fieldKey
				);

				// Return an object with the updated custom layer information
				return {
					customLayer: customlayer,
					customLayerId: row._id,
					userId: getUser?._id,
				};
			});

			bulkShapeUpdate(shapesToUpdate, errorMsg);
		} else {
			const fieldToUpdate = { [fieldsToUpdate.find(fieldtoUpdate => fieldtoUpdate.title === field).value]: fieldKey };
			if (field === 'Campaigns') {
				switch (rest.header) {
					case 'ContactTable':
					case 'CampaignContactTable':
					case 'UnitTable':
						{
							let entityType = 'Contact';
							let refetchQueries = ['getESContacts'];

							if (rest.header === 'UnitTable') {
								entityType = 'Shape';
								refetchQueries = ['getESFilterList', 'getCustomLayer'];
							}

							const variables = {
								campaigns,
								entityIds: rows.map(row => row._id),
								entityType,
							};

							upsertEntityCampaigns({
								variables,
								refetchQueries,
							}).then(
								res => {
									if (res.data && res.data.upsertEntityCampaigns) {
										resetESTableToggle.set(!resetESTableToggle.get());
										const success = res.data.upsertEntityCampaigns.success;
										if (success) {
											Loader.successToast('contact-creation', 'Updated');
											showSuccessMessage(`${field} Bulk Updated Successfully`);
											if (rest.onBulkUpdateComplete) {
												rest.onBulkUpdateComplete();
											}
										} else {
											Loader.errorToast('contact-creation', 'Updated');
										}
									} else {
										Loader.errorToast('contact-creation', 'Failed');
									}
								},
								err => {
									console.log(err);
									Loader.errorToast('contact-creation', errorMsg);
								}
							);
						}
						break;

					case 'TractPerUnitTable':
						const parcelOwnersToUpdate = rows.map(row => ({
							_id: row._id,
							shapeId: row.customLayerId,
							campaigns,
							relatedObject: row.ownerEntity,
							createBy: getUser?._id,
							lastUpdateBy: getUser?._id,
						}));

						updateParcelOwners({
							variables: {
								parcelOwners: parcelOwnersToUpdate,
							},
							refetchQueries: ['getESFilterList', 'getCustomLayer'],
							awaitRefetchQueries: true,
						}).then(
							res => {
								resetESTableToggle.set(!resetESTableToggle.get());
								if (res.data && res.data.updateParcelOwners) {
									const success = res.data.updateParcelOwners.success;
									if (success) {
										Loader.successToast('contact-creation', 'Updated');
										showSuccessMessage(`${field} Bulk Updated Successfully`);
										if (rest.onBulkUpdateComplete) {
											rest.onBulkUpdateComplete();
										}
									} else {
										Loader.errorToast('contact-creation', 'Updated');
									}
								} else {
									Loader.errorToast('contact-creation', 'Failed');
								}
							},
							err => {
								console.log(err);
								Loader.errorToast('contact-creation', errorMsg);
							}
						);

						break;

					default:
						const shapeOwnersToUpdate = rows.map(row => ({
							_id: row._id,
							shapeId: row.customLayerId,
							campaigns,
							relatedObject: row.ownerEntity,
							createBy: getUser?._id,
							lastUpdateBy: getUser?._id,
						}));

						updateShapeOwners({
							variables: {
								shapeType: 'Unit',
								shapeOwners: shapeOwnersToUpdate,
								userId: getUser?._id,
							},
							refetchQueries: ['getESFilterList', 'getCustomLayer'],
							awaitRefetchQueries: true,
						}).then(
							res => {
								resetESTableToggle.set(!resetESTableToggle.get());
								if (res.data && res.data.updateShapeOwners) {
									const success = res.data.updateShapeOwners.success;
									if (success) {
										Loader.successToast('contact-creation', 'Updated');
										showSuccessMessage(`${field} Bulk Updated Successfully`);
										if (rest.onBulkUpdateComplete) {
											rest.onBulkUpdateComplete();
										}
									} else {
										Loader.errorToast('contact-creation', 'Updated');
									}
								} else {
									Loader.errorToast('contact-creation', 'Failed');
								}
							},
							err => {
								console.log(err);
								Loader.errorToast('contact-creation', errorMsg);
							}
						);

						break;
				}

				delete fieldToUpdate.campaigns;
			} else {
				if (Object.entries(fieldToUpdate).length > 0) {
					updateBulkContact({
						variables: {
							contactIds: contactIds,
							keysToUpdate: fieldToUpdate,
							lastUpdateBy: getUser?._id,
							ignoreResponse: false,
						},
						refetchQueries: ['getESContacts'],
						awaitRefetchQueries: true,
					}).then(
						res => {
							resetESTableToggle.set(!resetESTableToggle.get());
							if (res.data && res.data.updateBulkContact) {
								const success = res.data.updateBulkContact.some(res => res.success);
								if (success) {
									Loader.successToast('contact-creation', 'Updated');
									showSuccessMessage(`${field} Bulk Updated Successfully`);
									if (rest.onBulkUpdateComplete) {
										rest.onBulkUpdateComplete();
									}
								} else {
									Loader.errorToast('contact-creation', 'Updated');
								}
							} else {
								Loader.errorToast('contact-creation', 'Failed');
							}
						},
						err => {
							console.log(err);
							Loader.errorToast('contact-creation', errorMsg);
						}
					);
				}

				delete fieldToUpdate.campaigns;
			}
		}

		onClose();
		setLoading(false);
	};

	return (
		<RightDialog open width="700px">
			{rowsLoading ? (
				<div className={modalClass.loaderWrapper}>
					<CircularProgress color="secondary" className={modalClass.loader} size={80} disableShrink />
				</div>
			) : (
				<>
					<MuiDialogTitle disableTypography className={classes.dialogTitle}>
						<Typography className={classes.topHeading} variant="h5" component="h1">
							Bulk Update
						</Typography>
						<IconButton aria-label="close" onClick={onClose} size="medium">
							<KeyboardTabIcon fontSize="large" />
						</IconButton>
					</MuiDialogTitle>
					<DialogContent>
						<Box p={0} pt={2} pb={2}>
							{rows.map(row => (
								<Grid container direction="row" spacing={2} alignItems="center" key={row.id}>
									<Grid item md={11}>
										<Typography style={{ backgroundColor: '#edfbff' }}>
											<Grid container alignItems="center" style={{ paddingLeft: 10 }}>
												<Grid item md={4}>
													{row.name}
												</Grid>
												<Grid item md={8}>
													{row.address1} {row.address2} {row.city}, {row.state} {row.zip}
												</Grid>
											</Grid>
										</Typography>
									</Grid>
									<Grid item md={1}>
										<IconButton aria-label="delete" onClick={() => onDelete(row)}>
											<CloseSharp />
										</IconButton>
									</Grid>
								</Grid>
							))}
						</Box>
						<Box p={0} pt={2} pb={2}>
							<Grid container direction="column">
								<Grid item>
									<Typography style={{ fontWeight: 'bold', paddingBottom: '10px' }}>
										Search for the field you would like to update from the list below
									</Typography>
								</Grid>
								<Grid item>
									<Autocomplete
										freeSolo
										id="free-solo-2-demo"
										data-testid="select-field-autocomplete"
										disableClearable
										options={fieldsToUpdate.map(field => field.title)}
										onChange={(e, field) => {
											setFieldKey('');
											onFieldToUpdateChange(field);
										}}
										renderInput={params => (
											<TextField
												{...params}
												placeholder="Select field to update"
												variant="outlined"
												InputProps={{
													...params.InputProps,
													type: 'search',
													startAdornment: (
														<InputAdornment position="start">
															<SearchIcon htmlColor="#757575" />
														</InputAdornment>
													),
												}}
											/>
										)}
									/>
								</Grid>
								<Grid item>
									<Typography style={{ fontWeight: 'bold', marginTop: '30px' }}>{field}</Typography>
								</Grid>
								<Grid item>
									<SelectedField
										field={field}
										setFieldKey={setFieldKey}
										setCampaigns={setCampaigns}
										setContactOwner={setContactOwner}
										contactOwner={contactOwner}
										fieldKey={fieldKey}
										campaigns={campaigns}
										classes={classes}
										publicTags={publicTags}
									/>
								</Grid>
							</Grid>
						</Box>
					</DialogContent>

					<DialogActions className={modalClass.actionButtons}>
						<Button onClick={onClose}>Cancel</Button>
						<Button
							variant="contained"
							component="span"
							disabled={!fieldKey}
							style={!fieldKey ? {} : { backgroundColor: '#00abed', color: 'white' }}
							onClick={onAssign}
							data-testid="action-button"
						>
							Update
						</Button>
					</DialogActions>

					{loading && (
						<div className={classes.loading}>
							<CircularProgress size={80} disableShrink color="secondary" />
						</div>
					)}
				</>
			)}
		</RightDialog>
	);
}
