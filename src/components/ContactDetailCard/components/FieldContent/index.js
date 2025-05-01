import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { TextField, Link, CircularProgress } from '@material-ui/core';

import { useLazyQuery, useMutation } from '@apollo/client';
import { get, has } from 'lodash';
import PropTypes from 'prop-types';

import CopyPurchaseInfo from 'components/ContactDetailCard/components/FieldContent/CopyPurchaseInfo';
import {
	textFieldLabels,
	getHrefValue,
	LinkTypes,
	FieldTypes,
	outcomeOptions,
} from 'components/ContactDetailCard/components/FieldContent/helper';
import MergeHistory from 'components/ContactDetailCard/components/FieldContent/MergeHistory';
import PencilEditIcon from 'components/ContactDetailCard/components/FieldContent/PencilEditIcon';
import useStyles from 'components/ContactDetailCard/components/FieldContent/style';
import { contactStatusOptions, phoneStatusOptions } from 'components/ContactDetailedInfo/helper';
import ReactSelectField from 'components/MRTTable/Common/Components/ReactSelectField';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import CustomTypography from 'components/Shared/components/Fields/CustomTypography';
import ContactAutoComplete from 'components/Shared/ContactAutoComplete';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import { phonenumber } from 'components/Shared/FormsFieldsData/RightDialogsSchema/ContactGrid/contact_form_schema';
import { formatDate } from 'components/Shared/functions';
import GoogleMapIcon from 'components/Shared/svgIcons/GoogleMapIcon';
import ZillowIcon from 'components/Shared/svgIcons/ZillowIcon';

import { UPDATE_CONTACT_PURCHASE_DATA } from 'graphQL/useMutationContactPurchaseData';
import { UPDATECONTACT } from 'graphQL/useMutationUpdateContact';
import { UPDATEMELISSA, UPDATEMELISSAADDRESS } from 'graphQL/useMutationUpdateMelissaRecords';
import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';

import { getAddressUrl, getZillowAddressUrl } from 'utils/helper';

import { showErrorMessage } from 'actions';
import { AppContext } from 'AppContext';

import CampaignField from './CampaignField';
import EntityType from './EntityType';
import { timeZoneOptions } from './timeZoneList';

export default function FieldContent({
	children,
	id,
	isPurchased = false,
	entity,
	melissaRecordId = null,
	melissaAddressRecordId = null,
	content,
	childrenLeft,
	onlyChildren,
	name,
	noMargin,
	noInputFooter,
	linkType,
	fieldType = FieldTypes.Contact,
	isEdited = false,
	isMerged = false,
	disabled,
	row,
	handleQuickActionActivity,
	metafields,
	purchaseDataId = null,
}) {
	const [stateApp, setStateApp] = React.useContext(AppContext);
	const [edit, setEdit] = useState(null);
	const [editContent, setEditContent] = useState({ content });
	const [showContent, setShowContent] = useState(content);
	const [isCurEdited, setIsCurEdited] = useState(isEdited);
	const [fieldsCount, setFieldsCount] = useState(0);
	const dispatch = useDispatch();

	const [updateContact, { loading }] = useMutation(UPDATECONTACT);
	const [updateContactPurchaseData, { loading: loadingPurchaseData }] = useMutation(UPDATE_CONTACT_PURCHASE_DATA);
	const [updateMelissa] = useMutation(UPDATEMELISSA);
	const [updateMelissaAddress] = useMutation(UPDATEMELISSAADDRESS);
	const classes = useStyles({ noMargin, loading: loading || loadingPurchaseData, fieldsCount });

	const [getFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });
	// const [getCampaignFilters, { data: campaignfiltersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

	const [statusOptions, setStatusOptions] = useState([]);

	const handleUpdating = (val = null) => {
		const customData = {};

		// Iterate over the keys of the original object
		for (const key in editContent) {
			if (has(editContent, key)) {
				// Check if the key starts with 'custom_data.'
				if (key.startsWith('custom_data.')) {
					// Extract the custom field name
					const customField = key.split('custom_data.')[1];
					// Add the custom field to the nested object
					customData[customField] = val || editContent[key];
					// Delete the original flat custom_data field
					delete editContent[key];
				}
			}
		}

		// If there are nested custom data fields, add them to the original object
		if (Object.keys(customData).length > 0) {
			editContent.custom_data = customData;
		}

		if (fieldType === FieldTypes.Contact) {
			let trimmedEditContent = {
				_id: id,
				lastUpdateBy: stateApp.user.mongoId,
			};

			if (entity) {
				trimmedEditContent.entity = entity;
			}
			let differences = false;
			for (const field in editContent) {
				const value = val ? val : editContent[field];
				if (value !== null && value !== undefined) {
					if (field === 'status') {
						trimmedEditContent[field] = value;
					} else if (field === 'custom_data') {
						trimmedEditContent[field] = editContent?.custom_data;
					} else {
						trimmedEditContent[field] = typeof value === 'string' ? value.trim() : value;
					}
					if (trimmedEditContent[field] !== content[field]) {
						differences = true;
					}
				}
			}

			if (differences) {
				if (isPurchased) {
					updateContactPurchaseData({
						variables: {
							purchaseData: { ...trimmedEditContent, ...(purchaseDataId && { purchaseDataId }) },
							isDialpadEnabled: stateApp.user?.features?.some(feature => feature.name === FEATURES.DIALPAD_INTEGRATION),
						},
						refetchQueries: ['getContactPurchaseData', 'getDailpadContact'],
						awaitRefetchQueries: false,
					}).then(({ data }) => {
						if (data?.updateContactPurchaseData && !data.updateContactPurchaseData?.success) {
							dispatch(showErrorMessage(data?.updateContactPurchaseData?.message));
						}
					});
				} else {
					updateContact({
						variables: {
							contact: trimmedEditContent,
							ignoreResponse: true,
							isDialpadEnabled: stateApp.user?.features?.some(feature => feature.name === FEATURES.DIALPAD_INTEGRATION),
						},
						refetchQueries: ['getPaginatedContacts', 'getContact', 'getparcelOwners', 'getDailpadContact'],
						awaitRefetchQueries: false,
					}).then(({ data }) => {
						let entries = Object.entries(editContent);
						entries.forEach(entry => {
							content = { ...content, [entry[0]]: entry[1] };
						});
						setShowContent({ ...content });
						setEditContent({ ...content });
						setStateApp({ ...stateApp, contactUpdated: id });
						if (data?.updateContact && !data.updateContact?.success) {
							dispatch(showErrorMessage(data?.updateContact?.message));
						}
					});
				}
			}
		} else if (fieldType === FieldTypes.MelissaRecord) {
			let entries = Object.entries(editContent)[0];
			let key = entries[0];
			let updatedValue = entries[1];
			updateMelissa({
				variables: {
					melissaRecord: {
						_id: melissaRecordId,
						[key]: updatedValue,
					},
				},
				refetchQueries: ['getLastMelissaRecord'],
				awaitRefetchQueries: true,
			}).then(() => {
				setIsCurEdited(true);
				let entries = Object.entries(editContent);
				entries.forEach(entry => {
					content = { ...content, [entry[0]]: entry[1] };
				});
				setShowContent({ ...content });
				setEditContent({ ...content });
			});
		} else if (fieldType === FieldTypes.MelissaAddressRecord) {
			let entries = Object.entries(editContent)[0];
			let key = entries[0];
			let updatedValue = entries[1];
			updateMelissaAddress({
				variables: {
					melissaAddressRecord: {
						_id: melissaAddressRecordId,
						[key]: updatedValue,
					},
				},
				refetchQueries: ['getLastMelissaRecord'],
				awaitRefetchQueries: true,
			}).then(() => {
				setIsCurEdited(true);
				let entries = Object.entries(editContent);
				entries.forEach(entry => {
					content = { ...content, [entry[0]]: entry[1] };
				});
				setShowContent({ ...content });
				setEditContent({ ...content });
			});
		}
		setEdit(null);
	};

	useEffect(() => {
		getFilters({
			variables: {
				esIndex: 'contacts_flat',
				filterKey: 'status.keyword',
				size: 50,
			},
		});
	}, [getFilters]);

	useEffect(() => {
		if (filtersData?.getESFilterList?.hits) {
			const allFiltersData = filtersData.getESFilterList.hits.map(hit => hit.key);
			let filterData = filtersData.getESFilterList.hits.map(hit => hit.key);
			for (let i = 0; i < contactStatusOptions.length; i++) {
				filterData = filterData.filter(d => d !== contactStatusOptions[i].value && d !== contactStatusOptions[i].label);
			}
			for (let i = 0; i < contactStatusOptions.length; i++) {
				if (
					(contactStatusOptions[i].notInclude && allFiltersData.find(d => d === contactStatusOptions[i].value)) ||
					!contactStatusOptions[i].notInclude
				) {
					filterData.push(contactStatusOptions[i].label);
				}
			}
			setStatusOptions(filterData);
		}
	}, [filtersData]);

	useEffect(() => {
		const ignorableFieldsInCount = ['contactOwnerId'];

		if (content) {
			setEditContent({ ...content });
			setShowContent({ ...content });

			let count = 0;
			for (const fieldName in content) {
				if (has(content, fieldName) && !ignorableFieldsInCount.includes(fieldName)) {
					count++;
				}
			}
			setFieldsCount(count);
		}
	}, [content]);

	useEffect(() => {
		editContent.ownerType && handleUpdating();
	}, [editContent.ownerType]);

	useEffect(() => {
		if (fieldsCount <= 1) {
			let fieldName;
			for (const key in editContent) {
				fieldName = key;
				break;
			}
			if (document.getElementById('fieldContentInput' + fieldName)) {
				document.getElementById('fieldContentInput' + fieldName).focus();
			}
		}
	}, [edit]);

	const getOrganizedContent = () => {
		let textArray = [];
		for (const key in showContent) {
			if (has(showContent, key) && showContent[key] && showContent[key] !== '') {
				if (
					key === 'zip' ||
					key === 'country' ||
					key === 'zipAlt' ||
					key === 'countryAlt' ||
					key === 'title' ||
					key === 'firstName' ||
					key === 'middleName' ||
					key === 'lastName' ||
					key === 'suffix'
				) {
					textArray = [[textArray.join(', '), showContent[key]].join(' ')];
				} else if (key === 'jobTitle') {
					textArray = [[textArray.join(', '), showContent[key]].join(' - ')];
				} else if (key === 'contactOwner' || key === 'contactOwnerId') {
					if (key === 'contactOwner') {
						textArray.push(showContent[key] || '');
					}
				} else {
					textArray.push(showContent[key]);
				}
			}
		}

		return textArray;
	};

	const handleEditClick = (e, isCopy = false) => {
		e.persist();
		e.preventDefault();
		if (isCopy) {
			navigator.clipboard.writeText(getOrganizedContent() || '');
		} else {
			setEdit(!edit ? e.currentTarget : null);
		}
	};

	const keyDownHandler = (event, fieldNames) => {
		event.stopPropagation();
		const fields = {};
		fieldNames.forEach(field => (fields[field] = content[field]));
		if (event.key === 'Escape') {
			setEdit(null);
			setEditContent({ ...fields });
		}
		if (event.key === 'Enter') {
			event.preventDefault();
			handleUpdating();
		}
	};

	const onBlurHandler = fieldNames => {
		const fields = {}; // Initialize an empty object to store field values

		// Iterate over fieldNames and assign corresponding values from content object
		fieldNames.forEach(field => (fields[field] = content[field]));
		// Check if editContent exists and has more than one property, return if true
		// if editContent has more than one property we don't need to close popup on blur
		if (Object.keys(editContent || {})?.length > 1) {
			return;
		}

		// Reset edit state and update editContent with field values
		setEdit(null); // It closes popup on blur
		setEditContent({ ...fields });
	};

	const formatFieldValue = (val, metaField) => {
		if (metaField?.type === 'date') {
			return formatDate(val);
		} else if (metaField?.type === 'link') {
			return (
				<Link href={val} target="_blank">
					{val}
				</Link>
			);
		}
		return val;
	};

	let inputsArray = [];
	if (edit) {
		for (const fieldName in editContent) {
			if (fieldName === 'contactOwner' || fieldName === 'contactOwnerId') {
				if (fieldName === 'contactOwner') {
					inputsArray.push(
						<ContactAutoComplete
							value={editContent.contactOwnerId ? editContent.contactOwnerId : ''}
							onChange={(e, user) => {
								setEditContent({ contactOwner: user.text, contactOwnerId: user.value });
							}}
							onKeyDown={event => keyDownHandler(event, ['contactOwner', 'contactOwnerId'])}
							onBlur={() => onBlurHandler(['contactOwner', 'contactOwnerId'])}
						/>
					);
				}
			} else if (has(editContent, fieldName)) {
				const metaField = metafields ? metafields.find(meta => meta?.esKey === fieldName) : null;
				let component;

				switch (fieldName) {
					case 'contactStatus':
						component = (
							<CustomAutoComplete
								fieldAttributes={{
									label: 'Status',
									value: editContent[fieldName] === null ? '' : editContent[fieldName],
									query: GET_ES_FILTER_LIST,
									variables: {
										esIndex: 'contacts_flat',
										filterKey: 'contactStatus.keyword',
										size: 50,
									},
									getOptions: res => res?.data?.getESFilterList?.hits?.map(hit => hit.key).filter(option => option),
								}}
								fieldConfig={{
									size: 'small',
									margin: 'dense',
									variant: 'outlined',
								}}
								fieldEvents={{
									onChange: ({ value }) => {
										let val = value;
										const data = contactStatusOptions.find(s => s.label === val);
										if (data) {
											val = data.value;
										}
										setEditContent(editContent => ({
											...editContent,
											[fieldName]: val,
										}));
										handleUpdating(val);
									},
									onBlur: () => onBlurHandler([fieldName]),
								}}
								onKeyDown={event => keyDownHandler(event, [fieldName])}
							/>
						);
						break;

					case 'status':
						component = (
							<CustomAutoComplete
								fieldAttributes={{
									value: editContent[fieldName] === null ? '' : editContent[fieldName],
									optionArray: statusOptions.filter(option => option),
								}}
								fieldEvents={{
									onChange: ({ value }) => {
										let val = value;
										const data = contactStatusOptions.find(s => s.label === val);
										if (data) {
											val = data.value;
										}
										setEditContent(editContent => ({
											...editContent,
											[fieldName]: val,
										}));
										handleUpdating(val);
									},
									onBlur: () => onBlurHandler([fieldName]),
								}}
								fieldConfig={{
									variant: 'outlined',
									textfieldRestProps: {
										className: classes.editTextField,
										autoFocus: true,
									},
								}}
								onKeyDown={event => keyDownHandler(event, [fieldName])}
							/>
						);
						break;

					case 'timeZone':
						component = (
							<CustomAutoComplete
								fieldAttributes={{
									value: editContent[fieldName] === null ? '' : editContent[fieldName],
									label: fieldsCount > 1 ? textFieldLabels(fieldName) : null,
									optionArray: timeZoneOptions,
								}}
								fieldConfig={{
									size: 'small',
									variant: 'outlined',
									textfieldRestProps: {
										className: classes.editTextField,
										style: { width: '100%' },
										id: 'fieldContentInput' + fieldName,
										autoFocus: true,
									},
								}}
								fieldEvents={{
									onChange: ({ value }) => {
										setEditContent(editContent => ({
											...editContent,
											[fieldName]: value || '',
										}));
									},
									onBlur: () => onBlurHandler([fieldName]),
								}}
								onKeyDown={event => keyDownHandler(event, [fieldName])}
							/>
						);
						break;

					case 'ownerType':
						component = (
							<EntityType
								className={classes.maxWidth}
								setDocumentType={value => {
									let val = value.name;
									const data = contactStatusOptions.find(s => s.label === val);
									if (data) {
										val = data.value;
									}
									setEditContent(editContent => ({
										...editContent,
										[fieldName]: val,
									}));
								}}
								value={editContent[fieldName] === null ? '' : editContent[fieldName]}
								onKeyDown={event => keyDownHandler(event, [fieldName])}
								onBlur={() => onBlurHandler([fieldName])}
							/>
						);
						break;

					case 'outcome':
						component = (
							<CustomAutoComplete
								fieldAttributes={{
									value: editContent[fieldName] === null ? '' : editContent[fieldName],
									optionArray: outcomeOptions,
									queryParams: {
										esIndex: 'contacts_flat',
										filterKey: 'outcome.keyword',
										size: 50,
									},
								}}
								fieldConfig={{
									size: 'small',
									variant: 'outlined',
									textfieldRestProps: {
										className: classes.editTextField,
										style: { width: '100%' },
										id: 'contact-detail-outcome',
										autoFocus: true,
									},
								}}
								fieldEvents={{
									onChange: ({ value }) => {
										setEditContent(editContent => ({
											...editContent,
											[fieldName]: value || '',
										}));
										handleUpdating(value);
									},
									onBlur: () => onBlurHandler([fieldName]),
								}}
								onKeyDown={event => keyDownHandler(event, [fieldName])}
							/>
						);
						break;

					case 'phone1Status':
					case 'phone2Status':
					case 'phone3Status':
					case 'phone4Status':
					case 'phone5Status':
						component = (
							<CustomAutoComplete
								fieldAttributes={{
									value: editContent[fieldName] === null ? '' : editContent[fieldName],
									label: fieldsCount > 1 ? textFieldLabels(fieldName) : null,
									optionArray: phoneStatusOptions,
								}}
								fieldConfig={{
									size: 'small',
									variant: 'outlined',
									textfieldRestProps: {
										className: classes.editTextField,
										style: { width: '100%' },
										id: 'fieldContentInput' + fieldName,
										autoFocus: true,
									},
								}}
								fieldEvents={{
									onChange: ({ value }) => {
										setEditContent(editContent => ({
											...editContent,
											[fieldName]: value || '',
										}));
									},
									onBlur: () => onBlurHandler([fieldName]),
								}}
								onKeyDown={event => keyDownHandler(event, [fieldName])}
							/>
						);
						break;

					default:
						if (fieldName.startsWith('custom_data')) {
							switch (metaField?.type) {
								case 'dropdown':
									component = (
										<CustomAutoComplete
											fieldAttributes={{
												value: editContent[fieldName] === null ? '' : editContent[fieldName],
												label: fieldsCount > 1 ? textFieldLabels(fieldName) : null,
												optionArray: metaField?.dropdownOptions.map(option => option?.value),
											}}
											fieldConfig={{
												size: 'small',
												variant: 'outlined',
												textfieldRestProps: {
													className: classes.editTextField,
													style: { width: '100%' },
													id: 'fieldContentInput' + fieldName,
													autoFocus: true,
												},
											}}
											fieldEvents={{
												onChange: ({ value }) => {
													setEditContent(editContent => ({
														...editContent,
														[fieldName]: value || '',
													}));
												},
												onBlur: () => onBlurHandler([fieldName]),
											}}
											onKeyDown={event => keyDownHandler(event, [fieldName])}
										/>
									);
									break;

								case 'multiselect':
									component = (
										<ReactSelectField
											fullWidth
											showUnderline
											showChevron={true}
											index={'contacts'}
											dropdownOptions={metaField?.dropdownOptions}
											column={metaField}
											value={editContent[fieldName] === null ? '' : editContent[fieldName]}
											onCustomKeyChange={value => {
												const fields = {};
												fields[fieldName] = value;
												setEdit(null); // It closes popup on blur
												setEditContent({ ...fields });
												handleUpdating(value);
											}}
										/>
									);
									break;

								case 'date':
									component = (
										<TextField
											key={'fieldContentInput' + fieldName}
											id={'fieldContentInput' + fieldName}
											data-testid={fieldName}
											className={classes.editTextField}
											variant="outlined"
											size="small"
											autoComplete="nope"
											fullWidth
											label={fieldsCount > 1 ? textFieldLabels(fieldName) : null}
											multiline={false}
											type="date"
											value={editContent[fieldName] === null ? '' : editContent[fieldName]}
											onChange={e => {
												e.persist();
												setEditContent(editContent => ({
													...editContent,
													[fieldName]: e.target.value,
												}));
											}}
											onKeyDown={event => keyDownHandler(event, [fieldName])}
											onBlur={() => onBlurHandler([fieldName])}
										/>
									);
									break;

								default:
									break;
							}
						}

						if (!component) {
							component = (
								<CustomTextField
									fieldEvents={{
										onChange: value => {
											setEditContent(editContent => ({
												...editContent,
												[fieldName]: row?.isPhoneNumber && !phonenumber(value) ? '' : value,
											}));
										},
										onKeyDown: event => keyDownHandler(event, [fieldName]),
										onBlur: () => onBlurHandler([fieldName]),
									}}
									fieldConfig={{
										autoFocus: true,
										size: 'small',
										variant: 'outlined',
										textfieldRestProps: {
											autoFocus: true,
										},
									}}
									fieldAttributes={{
										name: fieldName,
										value: editContent[fieldName] === null ? '' : editContent[fieldName],
										label: fieldsCount > 1 ? textFieldLabels(fieldName) : null,
										InputProps: {
											autoComplete: 'nope',
										},
									}}
								/>
							);
						}
				}

				if (component) {
					inputsArray.push(component);
				}
			}
		}

		if (fieldsCount <= 1) {
			return [
				inputsArray,
				noInputFooter ? null : (
					<p key="2" className={classes.foodText}>
						<span>Return</span> to save
					</p>
				),
			];
		}
	}

	let textArray = getOrganizedContent();

	function getFormattedText({ textArray, onlyChildren, children, metaField, name }) {
		let result;

		if (textArray.length > 0) {
			const renderGenericField = !metaField || (metaField?.type && ['link', 'text'].includes(metaField.type));

			if (renderGenericField) {
				return <CustomTypography value={textArray} />;
			} else if (onlyChildren) {
				result = children || '';
			} else {
				result = formatFieldValue(textArray.join(', '), metaField);
			}
		} else {
			result = `${name ? name + ' ' : ''} Not Available`;
		}

		return result;
	}

	const renderOutput = Object.keys(content).includes('campaigns') ? (
		<CampaignField
			className={classes.maxWidth}
			onChange={value => {
				setEditContent(editContent => ({
					...editContent,
					campaigns: value,
				}));
				handleUpdating(value);
			}}
			value={get(editContent, 'campaigns', [])}
			fullWidth
			targetLabel="Contact"
			targetLabelId={id}
			onKeyDown={event => keyDownHandler(event, ['campaigns'])}
			onBlur={() => onBlurHandler(['campaigns'])}
		/>
	) : (
		(() => {
			// Find the metafield object with an eskey matching a key in content
			const metaField = metafields
				? metafields.find(metafield => {
						return Object.keys(content).includes(metafield.esKey);
					})
				: null;

			return (
				<span>
					{childrenLeft && !onlyChildren && children ? children : ''}
					{/* Wrap the contact details tab title inside span to fix it position */}
					<span
						style={{
							marginTop: '4px',
							display: 'inline-block',
						}}
					>
						{getFormattedText({ textArray, onlyChildren, children, metaField, name })}
					</span>
					{!onlyChildren && !disabled && (
						<PencilEditIcon
							handleUpdating={handleUpdating}
							anchorEl={edit}
							setAnchorEl={setEdit}
							content={inputsArray}
							onClick={handleEditClick}
							isCopy={true}
							setEditContent={setEditContent}
							editContent={content}
							row={row}
							handleQuickActionActivity={handleQuickActionActivity}
							isPurchased={isPurchased}
						/>
					)}
					{fieldType === FieldTypes.Contact && isMerged && (
						<MergeHistory handleUpdating={handleUpdating} content={content} contactId={id} />
					)}
					{isPurchased && (
						<CopyPurchaseInfo
							updateContact={updateContact}
							userId={stateApp.user.mongoId}
							content={content}
							contactId={id}
						/>
					)}
					{textArray.length > 0 && name === 'Address' ? ( // show google map and zillow icon when address exists
						<>
							<Link onClick={() => window.open(getAddressUrl(content), '_blank')}>
								<GoogleMapIcon />
							</Link>
							<Link onClick={() => window.open(getZillowAddressUrl(content), '_blank')}>
								<ZillowIcon />
							</Link>
						</>
					) : (
						''
					)}
					{!childrenLeft && !onlyChildren && children ? children : ''}
					{isCurEdited ? ' (edited)' : ''}
				</span>
			);
		})()
	);

	return (
		<React.Fragment>
			<p
				className={`${textArray.length === 0 ? classes.notAvailableP : ''} ${classes.fieldContentP}`}
				style={{ width: 'auto' }}
				data-testid={name}
			>
				{(linkType === LinkTypes.Mail || linkType === LinkTypes.Simple) && textArray.length > 0 ? (
					<a
						href={getHrefValue(textArray.join(', '), linkType)}
						target="_blank"
						className={classes.noTextDecoration}
						rel="noreferrer"
					>
						{renderOutput}
					</a>
				) : (
					renderOutput
				)}
			</p>
			{(loading || loadingPurchaseData) && (
				<div style={{ height: '0', width: '0' }}>
					<CircularProgress className={classes.loader} size={22} color="secondary" />
				</div>
			)}
		</React.Fragment>
	);
}

FieldContent.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	isPurchased: PropTypes.bool,
	entity: PropTypes.string,
	melissaRecordId: PropTypes.string,
	melissaAddressRecordId: PropTypes.string,
	content: PropTypes.object.isRequired,
	childrenLeft: PropTypes.node,
	onlyChildren: PropTypes.bool,
	name: PropTypes.string,
	noMargin: PropTypes.bool,
	noInputFooter: PropTypes.bool,
	linkType: PropTypes.oneOf([LinkTypes.Mail, LinkTypes.Simple]),
	fieldType: PropTypes.oneOf([FieldTypes.Contact, FieldTypes.MelissaRecord, FieldTypes.MelissaAddressRecord]),
	isEdited: PropTypes.bool,
	isMerged: PropTypes.bool,
	disabled: PropTypes.bool,
	row: PropTypes.object,
	handleQuickActionActivity: PropTypes.func,
	metafields: PropTypes.array,
	purchaseDataId: PropTypes.string,
};
