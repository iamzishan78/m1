import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

import { useMutation, useLazyQuery } from '@apollo/client';
import _ from 'lodash';
import PropTypes from 'prop-types';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import AutocompEntityNamesVirtualizeList from 'components/MRTTable/Common/Components/AutocompEntityNamesVirtualizeList';
import { extractValueRecursively } from 'components/MRTTable/utils/helper';
import CommonForm from 'components/Shared/FormsFieldsData/CommonForm';
import parcelOwnerForm from 'components/Shared/FormsFieldsData/RightDialogsSchema/ParcelDetailInterestOwner/parcel_interest_owner_form_schema';
import { setStateIfDeepEqual } from 'components/Shared/functions';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

import { ADDCONTACT } from 'graphQL/useMutationAddContact';
import { ADDOWNERTOAPARCEL } from 'graphQL/useMutationAddOwnerToAParcel';
import { UPDATECONTACT } from 'graphQL/useMutationUpdateContact';
import { UPDATEPARCELOWNER } from 'graphQL/useMutationUpdateParcelOwner';
import { PAGINATEDCONTACTSQUERY } from 'graphQL/useQueryPaginatedContacts';

import { globalStateController } from 'hookstate/globalStateController';
import { sideDialogController, tractInterestOwnerState } from 'hookstate/sideDialogController';
import { tableGlobalController } from 'hookstate/tableController';

import { UserSession } from 'utils/user';

import { showErrorMessage, showSuccessMessage } from '../../../../../../src/actions';

const useStyles = makeStyles(theme => ({
	dialogContent: {
		'& header': {
			position: 'absolute',
			left: '0',
			top: '55px',
		},
	},
	primary: {
		color: 'black',
		backgroundColor: '#E0E0E0',
	},
	secondary: {
		color: 'white',
		backgroundColor: '#26ACD8',
	},
	dialogAction: {
		'& .Mui-disabled': {
			backgroundColor: 'transparent',
		},
	},
	move: {
		zIndex: 10000,
	},
	addContactButton: {
		float: 'right',
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
	},
	addContactButtonSelected: {
		float: 'right',
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		color: `${theme.palette.secondary.main} !important`,
	},
	personAddIcon: {
		color: `${theme.palette.secondary.main} !important`,
		fill: `${theme.palette.secondary.main} !important`,
	},
}));

function AddParcelOwnerDialogContent({ selectedRow, ...props }) {
	const dispatch = useDispatch();
	const workspaceSettings = useSelector(({ app }) => app.workspaceSettings);
	const tenantName = UserSession.getStorageItem('tenantName');

	const formState = sideDialogController('tractInterestDialog').useCompleteState();
	const formStateValues = formState?.get({ noproxy: true });

	const { user } = globalStateController.useState(['user']);
	const getUser = user;

	const { control, reset, getValues, setValue, watch } = useForm();

	// Rendering form state onn nra related value changes
	const formSchema = useMemo(() => {
		return parcelOwnerForm({
			getValues,
			setValue,
			tenantName,
			state: props?.customLayer?.state,
			newOwner: formStateValues?.newOwner,
		});
	}, [
		formStateValues?.newOwner,
		formState?.rerenderJson,
		formState?.uMaxUnitPricing,
		formState?.uUnitPricing,
		formState?.uUnitPricingNMA,
		formState?.uMaxUnitPricingNMA,
	]);

	const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);
	const [nameAutInputValue, NameAutInputValue] = useState('');
	const setNameAutInputValue = newState => {
		setStateIfDeepEqual(NameAutInputValue, newState);
	};
	const [hasNextPage, setHasNextPage] = useState(true);
	const [isNextPageLoading, setIsNextPageLoading] = useState(false);

	// CONTACT

	const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(
		PAGINATEDCONTACTSQUERY,
		{
			fetchPolicy: 'cache-and-network',
			nextFetchPolicy: 'cache-first',
		}
	);

	const [addContact, { data: addContactData }] = useMutation(ADDCONTACT);

	const [addOwnerToAParcel, { data: mutationData }] = useMutation(ADDOWNERTOAPARCEL);

	const [updateParcelOwner, { data: updateData }] = useMutation(UPDATEPARCELOWNER);

	const [updateContact] = useMutation(UPDATECONTACT);

	useEffect(() => {
		if (_.get(addContactData, 'addContact.contact')) {
			const contact = {
				name: addContactData.addContact.contact.name,
				_id: addContactData.addContact.contact._id,
			};
			sideDialogController('tractInterestDialog').updateState({
				name: contact?.name,
				ownerEntity: contact?._id,
				relatedObject: contact?._id,
			});
		}
	}, [addContactData]);

	useEffect(() => {
		if (allContacts?.paginatedContacts) {
			setMongoEntitiesArray([...(allContacts?.paginatedContacts?.edges?.map(el => el.node) || [])]);
			setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
		}
		setIsNextPageLoading(false);
	}, [allContacts]);

	useEffect(() => {
		// will also run during initial mount
		setIsNextPageLoading(true);
		getPaginatedContacts({
			variables: {
				search: nameAutInputValue,
			},
		});
	}, [nameAutInputValue]);

	const loadNextPage = async pageVariables => {
		setIsNextPageLoading(true);
		fetchMorePaginatedContacts(pageVariables);
		return null;
	};

	const handleClickDialogClose = () => {
		props.onClose();
		sideDialogController('tractInterestDialog').reset();
	};

	useEffect(() => {
		let type = null;
		if (mutationData && mutationData.addOwnerToAParcel) {
			type = { name: 'add', success: mutationData.addOwnerToAParcel.success };
		} else if (updateData && updateData.updateParcelOwner) {
			type = { name: 'updat', success: updateData.updateParcelOwner.success };
		}

		if (type) {
			if (type.success) {
				dispatch(
					showSuccessMessage(
						formStateValues?.name
							? `${formStateValues?.name} was successfully ${type.name}ed`
							: `The owner was successfully ${type.name}ed`
					)
				);

				handleClickDialogClose();
			} else {
				dispatch(showErrorMessage('Error occurred'));
			}

			window.setStateApp(stateApp => ({
				...stateApp,
				universalCircularLoaderAct: false,
			}));
			tableGlobalController.refetch();
		}
	}, [mutationData, updateData]);

	useEffect(() => {
		const { uUnitPricingNMA, uMaxUnitPricingNMA, uUnitPricing, uMaxUnitPricing, leaseBonusPerAcre } =
			props?.customLayer?.shapeJson?.properties || {};
		sideDialogController('tractInterestDialog').updateState({
			uUnitPricingNMA,
			uMaxUnitPricingNMA,
			uUnitPricing,
			uMaxUnitPricing,
			leaseBonusPerAcre,
		});
	}, [props?.customLayer?.shapeJson?.properties]);

	useEffect(() => {
		sideDialogController('tractInterestDialog').updateState({
			workspaceSettings,
		});
	}, [workspaceSettings]);

	const handleUpdateContact = ownerToAdd => {
		if (
			((ownerToAdd?.contactStatus || selectedRow?.contactStatus) &&
				selectedRow?.contactStatus !== ownerToAdd.contactStatus) ||
			((ownerToAdd?.status || selectedRow?.status) && selectedRow?.status !== ownerToAdd.status) ||
			((ownerToAdd?.contactOwners?.label || selectedRow?.contactOwners?.[0]) &&
				selectedRow?.contactOwners?.[0] !== ownerToAdd?.contactOwners?.label) ||
			((ownerToAdd?.ownerType || selectedRow?.ownerType) && selectedRow?.ownerType !== ownerToAdd.ownerType) ||
			((ownerToAdd?.campaignPriority || selectedRow?.campaignPriority) &&
				selectedRow?.campaignPriority !== ownerToAdd.campaignPriority)
		) {
			// Fixed label value issue
			updateContact({
				variables: {
					contact: {
						_id: ownerToAdd.ownerEntity._id || ownerToAdd.ownerEntity,
						contactStatus: ownerToAdd.contactStatus && (ownerToAdd.contactStatus.value || ownerToAdd.contactStatus),
						status: ownerToAdd.status && (ownerToAdd.status.value || ownerToAdd.status),
						...(ownerToAdd?.contactOwners && _.isString(ownerToAdd?.contactOwners)
							? { contactOwnerId: ownerToAdd.contactOwners }
							: {}),
						lastUpdateBy: getUser?._id,
						ownerType: ownerToAdd.ownerType && (ownerToAdd.ownerType.value || ownerToAdd.ownerType),
						campaignPriority:
							ownerToAdd.campaignPriority && (ownerToAdd.campaignPriority.value || ownerToAdd.campaignPriority),
						isPurchased: ownerToAdd.isPurchased && (ownerToAdd.isPurchased.value || ownerToAdd.isPurchased),
					},
				},
			});
		}
	};

	const handleClickAdd = e => {
		e.preventDefault();
		const parcelOwnerFormValue = getValues();
		const qtr = [
			parcelOwnerFormValue?.qtr1 || null,
			parcelOwnerFormValue?.qtr2 || null,
			parcelOwnerFormValue?.qtr3 || null,
			parcelOwnerFormValue?.qtr4 || null,
		];
		sideDialogController('tractInterestDialog').updateState({
			...parcelOwnerFormValue,
			qtr: qtr,
			customLayer: props.customLayerId,
		});
		if (formStateValues?.newOwner) {
			sideDialogController('tractInterestDialog').updateState({ relatedObject: { ...parcelOwnerFormValue } });
		} else {
			handleUpdateContact(formStateValues);
		}

		// Fixed label value issue
		if (selectedRow) {
			const parcelOwner = extractValueRecursively({
				_id: selectedRow?._id,
				...formStateValues,
				deals: formStateValues?.deals || [],
				relatedObject: formStateValues.relatedObject,
				createBy: getUser?._id,
				lastUpdateBy: getUser?._id,
			});
			updateParcelOwner({
				variables: { parcelOwner },
				refetchQueries: ['getparcelOwners', 'getDbData', 'getCustomLayer'],
				awaitRefetchQueries: true,
			});
		} else {
			// Fixed label value issue
			// Update parcel owner object for autocompletes
			const parcelOwner = extractValueRecursively({
				...formStateValues,
				deals: formStateValues?.deals || [],
				relatedObject: formStateValues.relatedObject,
				createBy: getUser?._id,
				lastUpdateBy: getUser?._id,
			});
			addOwnerToAParcel({
				variables: { parcelOwner },
				refetchQueries: ['getCustomLayer', 'getparcelOwners', 'getDbData'],
				awaitRefetchQueries: true,
			});
		}

		window.setStateApp(state => ({ ...state, universalCircularLoaderAct: true }));
	};

	useEffect(() => {
		if (selectedRow) {
			const filteredSelectedRow = _.pick(selectedRow, Object.keys(tractInterestOwnerState));
			const rowData = _.merge({}, tractInterestOwnerState, filteredSelectedRow);

			rowData?.depthFrom === 'All depths' && rowData?.depthTo === 'All depths'
				? (rowData.depthBoth = 'true')
				: (rowData.depthBoth = 'false');
			const [qtr1, qtr2, qtr3, qtr4] = rowData?.qtr || [];
			rowData.qtr1 = qtr1;
			rowData.qtr2 = qtr2;
			rowData.qtr3 = qtr3;
			rowData.qtr4 = qtr4;
			rowData.contactStatus = selectedRow?.contact?.contactStatus;
			rowData.status = selectedRow?.contact?.status;
			rowData.contactOwners = selectedRow?.contactOwners; // auto-complete the contact owner in slideout
			rowData.relatedObject = selectedRow?.contactId || selectedRow?.ownerEntity;
			sideDialogController('tractInterestDialog').updateState(rowData);
			reset(rowData);
		}
	}, [selectedRow]);

	const classes = useStyles();

	return (
		<div className={classes.move}>
			<RightDialog open handleClickDialogClose={handleClickDialogClose} width="500px">
				<Grid container display="flex" direction="row" justifyContent="space-between" alignItems="center">
					<Grid item md={10} xs={10}>
						<DialogTitle id="customized-dialog-title" style={{ fontWeight: 'bold' }}>
							{selectedRow ? 'Update' : 'Add'} Tract Ownership
						</DialogTitle>
					</Grid>
					<Grid item md={1} xs={1} style={{ marginRight: '30px' }}>
						<IconButton
							size="small"
							component="span"
							style={{
								float: 'right',
							}}
							onClick={handleClickDialogClose}
						>
							<KeyboardTabBlackIcon />
						</IconButton>
					</Grid>
				</Grid>
				<DialogContent className={classes.dialogContent}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							{!formStateValues?.newOwner && <h3 style={{ float: 'left' }}>Name</h3>}
							{!selectedRow && (
								<div
									className={formStateValues?.newOwner ? classes.addContactButtonSelected : classes.addContactButton}
									onClick={() => {
										sideDialogController('tractInterestDialog').updateState({ newOwner: !formStateValues?.newOwner });
									}}
								>
									<PersonAddOutlinedIcon className={formStateValues?.newOwner ? classes.personAddIcon : null} />
									<p>&nbsp;Add new</p>
								</div>
							)}
							{!formStateValues?.newOwner && (
								<AutocompEntityNamesVirtualizeList
									mongoEntitiesArray={mongoEntitiesArray}
									setMongoEntitiesArray={setMongoEntitiesArray}
									nameAutValue={formStateValues?.name}
									setNameAutValue={contact => {
										sideDialogController('tractInterestDialog').updateState({
											name: contact?.name,
											ownerEntity: contact?._id,
											relatedObject: contact?._id,
										});
										// Setting owner type when contact is selected
										if (contact?.ownerType) {
											setValue('ownerType', { label: contact?.ownerType, value: contact?.ownerType });
										}
									}}
									nameAutInputValue={nameAutInputValue}
									setNameAutInputValue={setNameAutInputValue}
									hasNextPage={hasNextPage}
									isNextPageLoading={isNextPageLoading}
									loadNextPage={loadNextPage}
									disabled={formStateValues?.newOwner}
									placeholder={'Search existing contact'}
									addNew
									addNewOnClick={value => {
										const contact = { name: value };
										sideDialogController('tractInterestDialog').updateState({ name: value });
										setValue('name', value);
										addContact({
											variables: {
												contact: {
													...contact,
													createBy: getUser?._id,
													lastUpdateBy: getUser?._id,
												},
											},
											refetchQueries: ['getPaginatedContacts', 'getContact'],
											awaitRefetchQueries: true,
										});
									}}
								/>
							)}
						</Grid>

						<CommonForm
							formSchema={formSchema}
							control={control}
							reset={reset}
							watch={watch}
							dialogKey={'tractInterestDialog'}
						/>
					</Grid>
				</DialogContent>
				<DialogActions className={classes.dialogAction}>
					<Button
						className={classes.primary}
						onClick={handleClickDialogClose}
						color="primary"
						style={{ marginBottom: '40px' }}
					>
						Cancel
					</Button>
					<Button
						className={classes.secondary}
						disabled={!formStateValues?.name && !formStateValues?.newOwner ? true : false}
						onClick={handleClickAdd}
						color="secondary"
						style={{ marginBottom: '40px', marginRight: '20px' }}
					>
						{selectedRow ? 'Update' : 'Add'}
					</Button>
				</DialogActions>
			</RightDialog>
		</div>
	);
}

AddParcelOwnerDialogContent.propTypes = {
	selectedRow: PropTypes.shape({
		_id: PropTypes.string,
		contactStatus: PropTypes.string,
		status: PropTypes.string,
		contactOwners: PropTypes.array,
		ownerType: PropTypes.string,
		campaignPriority: PropTypes.string,
		qtr: PropTypes.string,
		contact: PropTypes.shape({
			_id: PropTypes.string,
			contactStatus: PropTypes.string,
			status: PropTypes.string,
		}),
		contactId: PropTypes.string,
		ownerEntity: PropTypes.string,
	}),
	onClose: PropTypes.func.isRequired,
	customLayer: PropTypes.shape({
		_id: PropTypes.string,
		state: PropTypes.string,
		shapeJson: PropTypes.shape({
			properties: PropTypes.shape({
				uAcres: PropTypes.number,
				uUnitPricing: PropTypes.number,
				uMaxUnitPricing: PropTypes.number,
			}),
		}),
	}),
	customLayerId: PropTypes.string,
};

export default AddParcelOwnerDialogContent;
