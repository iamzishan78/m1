import { useMutation } from '@apollo/client';
import { useLazyQuery } from '@apollo/client';
import { Typography, Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { get } from 'lodash';
import loadashFilter from 'lodash/filter';
import React, { useState, useEffect } from 'react';

import ContactAutoComplete from 'components/Shared/ContactAutoComplete';
import { UPDATE_CONTACT_PURCHASE_DATA } from 'graphQL/useMutationContactPurchaseData';
import { UPDATECONTACT } from 'graphQL/useMutationUpdateContact';
import { UPDATEMELISSA, UPDATEMELISSAADDRESS } from 'graphQL/useMutationUpdateMelissaRecords';

import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';

import { getAddressUrl, getZillowAddressUrl } from 'utils/helper';
import { AppContext } from 'AppContext';
import PencilEditIcon from 'components/ContactDetailCard/components/FieldContent/PencilEditIcon';
import MergeHistory from 'components/ContactDetailCard/components/FieldContent/MergeHistory';
import CopyPurchaseInfo from 'components/ContactDetailCard/components/FieldContent/CopyPurchaseInfo';
import {
	textFieldLabels,
	getHrefValue,
	LinkTypes,
	FieldTypes,
	outcomeOptions,
} from 'components/ContactDetailCard/components/FieldContent/helper';
import useStyles from 'components/ContactDetailCard/components/FieldContent/style';

import CampaignField from './CampaignField';
import EntityType from './EntityType';
import { timeZoneOptions } from './timeZoneList';

import { contactStatusOptions } from 'components/ContactDetailedInfo/helper';
import ContactStatus from 'components/ContactDetailCard/components/AutoCompleteWithAddNew';

import AutoCompleteAddNewField from './AutoCompleteAddNewField';

import GoogleMapIcon from 'components/Shared/svgIcons/GoogleMapIcon';
import ZillowIcon from 'components/Shared/svgIcons/ZillowIcon';
import ReactSelectField from 'components/Shared/M1nTable/components/SubComponents/ReactSelectField';
import { formatDate } from 'components/Shared/functions';

const filter = createFilterOptions();
export default function FieldContent({
	children,
	id,
	isPurchased,
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
	...props
}) {
	const [stateApp, setStateApp] = React.useContext(AppContext);
	const [edit, setEdit] = useState(null);
	const [editContent, setEditContent] = useState({ content });
	const [showContent, setShowContent] = useState(content);
	const [isCurEdited, setIsCurEdited] = useState(isEdited);
	const [fieldsCount, setFieldsCount] = useState(0);

	const [updateContact, { loading }] = useMutation(UPDATECONTACT);
	const [updateContactPurchaseData, { loading: loadingPurchaseData }] = useMutation(UPDATE_CONTACT_PURCHASE_DATA);
	const [updateMelissa] = useMutation(UPDATEMELISSA);
	const [updateMelissaAddress] = useMutation(UPDATEMELISSAADDRESS);
	const classes = useStyles({ noMargin, loading: loading || loadingPurchaseData, fieldsCount });

	const [getFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });
	// const [getCampaignFilters, { data: campaignfiltersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: "no-cache" });

	const [statusOptions, setStatusOptions] = useState([]);

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
				if (content.hasOwnProperty(fieldName) && !ignorableFieldsInCount.includes(fieldName)) {
					count++;
				}
			}
			setFieldsCount(count);
		}
	}, [content]);

	useEffect(() => {
		editContent.ownerType && handleUpdating();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [edit]);

	const getOrganizedContent = () => {
		let textArray = [];
		for (const key in showContent) {
			if (showContent.hasOwnProperty(key) && showContent[key] && showContent[key] !== '') {
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

	const handleUpdating = (val = null) => {
		const customData = {};

		// Iterate over the keys of the original object
		for (const key in editContent) {
			if (editContent.hasOwnProperty(key)) {
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
							purchaseData: trimmedEditContent,
						},
						refetchQueries: ['getContactPurchaseData'],
						awaitRefetchQueries: false,
					});
				} else {
					updateContact({
						variables: {
							contact: trimmedEditContent,
							ignoreResponse: true,
						},
						refetchQueries: ['getPaginatedContacts', 'getContact', 'getparcelOwners'],
						awaitRefetchQueries: false,
					}).then(res => {
						let entries = Object.entries(editContent);
						entries.forEach(entry => {
							content = { ...content, [entry[0]]: entry[1] };
						});
						setShowContent({ ...content });
						setEditContent({ ...content });
						setStateApp({ ...stateApp, contactUpdated: id });
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
			}).then(res => {
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
			}).then(res => {
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

	const formatFieldValue = (val, metaField) => {
		if (metaField?.type === 'date') {
			return formatDate(val)
		}
		return val;
	}

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
			} else if (editContent.hasOwnProperty(fieldName)) {
				const metaField = metafields ? metafields.find(meta => meta?.esKey === fieldName) : null;
				inputsArray.push(
					fieldName === 'contactStatus' ? (
						<ContactStatus
							className={classes.maxWidth}
							setValue={value => {
								let val = value.name;
								const data = contactStatusOptions.find(s => s.label === val);
								if (data) {
									val = data.value;
								}
								setEditContent(editContent => ({
									...editContent,
									[fieldName]: val,
								}));
								handleUpdating(val);
							}}
							fieldKey="contactStatus"
							value={editContent[fieldName] === null ? '' : editContent[fieldName]}
							onKeyDown={event => keyDownHandler(event, [fieldName])}
							onBlur={() => onBlurHandler([fieldName])}
						/>
					) : fieldName === 'status' ? (
						<Status
							className={classes.maxWidth}
							options={statusOptions}
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
								handleUpdating(val);
							}}
							value={editContent[fieldName] === null ? '' : editContent[fieldName]}
							onKeyDown={event => keyDownHandler(event, [fieldName])}
							onBlur={() => onBlurHandler([fieldName])}
						/>
					) : fieldName === 'timeZone' ? (
						<Autocomplete
							id={'fieldContentInput' + fieldName}
							key={'fieldContentInput' + fieldName}
							options={timeZoneOptions}
							getOptionLabel={option => option || editContent[fieldName]}
							onChange={(e, data) => {
								e.persist();
								setEditContent(editContent => ({
									...editContent,
									[fieldName]: data || '',
								}));
							}}
							value={editContent[fieldName] === null ? '' : editContent[fieldName]}
							autoComplete
							onKeyDown={event => keyDownHandler(event, [fieldName])}
							onBlur={() => onBlurHandler([fieldName])}
							style={{ width: '100%' }}
							renderInput={params => (
								<TextField
									{...params}
									label={fieldsCount > 1 ? textFieldLabels(fieldName) : null}
									className={classes.editTextField}
								/>
							)}
						/>
					) : fieldName.startsWith('custom_data') && metaField?.type === 'dropdown' ? (
						<Autocomplete
							id={'fieldContentInput' + fieldName}
							key={'fieldContentInput' + fieldName}
							options={metaField?.dropdownOptions.map(option => option?.value)}
							getOptionLabel={option => option || editContent[fieldName]}
							onChange={(e, data) => {
								e.persist();
								setEditContent(editContent => ({
									...editContent,
									[fieldName]: data || '',
								}));
							}}
							value={editContent[fieldName] === null ? '' : editContent[fieldName]}
							autoComplete
							onKeyDown={event => keyDownHandler(event, [fieldName])}
							onBlur={() => onBlurHandler([fieldName])}
							style={{ width: '100%' }}
							renderInput={params => (
								<TextField
									{...params}
									label={fieldsCount > 1 ? textFieldLabels(fieldName) : null}
									className={classes.editTextField}
								/>
							)}
						/>
					) : fieldName.startsWith('custom_data') && metaField?.type === 'multiselect' ? (
						<ReactSelectField
							fullWidth
							showUnderline
							showChevron={true}
							index={'contacts'}
							dropdownOptions={metaField?.dropdownOptions}
							column={metaField}
							value={editContent[fieldName] === null ? '' : editContent[fieldName]}
							onCustomKeyChange={value => {
								const fields = {}; // Initialize an empty object to store field values
								fields[fieldName] = value;

								// Reset edit state and update editContent with field values
								setEdit(null); // It closes popup on blur
								setEditContent({ ...fields });
								handleUpdating(value);
							}}
						/>
					) : fieldName.startsWith('custom_data') && metaField?.type === 'date' ? (
						<>
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
								multiline={false} // For date fields, multiline should be false
								type="date" // Use date type for date picker
								value={editContent[fieldName] === null ? '' : editContent[fieldName]}
								onChange={e => {
									e.persist();
									setEditContent(editContent => ({
										...editContent,
										[fieldName]: e.target.value, // Ensure value is in YYYY-MM-DD format
									}));
								}}
								onKeyDown={event => keyDownHandler(event, [fieldName])}
								onBlur={() => onBlurHandler([fieldName])}
							/>
						</>
					) : fieldName === 'ownerType' ? (
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
					) : fieldName === 'outcome' ? (
						<AutoCompleteAddNewField
							id="contact-detail-outcome"
							queryParams={{
								esIndex: 'contacts_flat',
								filterKey: 'outcome.keyword',
								size: 50,
							}}
							onChange={data => {
								setEditContent(editContent => ({
									...editContent,
									[fieldName]: data.name || '',
								}));

								handleUpdating(data.name);
							}}
							defaultOptions={outcomeOptions}
							value={editContent[fieldName] === null ? '' : editContent[fieldName]}
							onKeyDown={event => keyDownHandler(event, [fieldName])}
							onBlur={() => onBlurHandler([fieldName])}
						/>
					) : (
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
							multiline
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
					)
				);
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
			]; /////return an input if only one field
		}
	}

	let textArray = getOrganizedContent();

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
			const metaField = metafields ? metafields.find((metafield) => {
				return Object.keys(content).includes(metafield.esKey)
			}) : null;

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
						{textArray.length > 0
							? onlyChildren
								? children
									? children
									: ''
								: formatFieldValue(textArray.join(', '), metaField)
							: `${name ? name + ' ' : ''} Not Available`}{' '}
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
				</span>)
		})());

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

export const Status = ({ setDocumentType, value, options, ...other }) => {
	const useStyles = makeStyles({
		inputRoot: {
			backgroundColor: '#ffffff',
		},
		listbox: {
			boxSizing: 'border-box',
			'& ul': {
				padding: 0,
				margin: 0,
			},
		},
	});

	const classes = useStyles();

	const [search, setSearch] = useState(value);

	useEffect(() => {
		setSearch(value);
	}, [value]);

	const onInputChange = (event, value) => {
		setSearch(value);
	};

	return (
		<Autocomplete
			defaultValue={search}
			value={search}
			disableListWrap
			classes={classes}
			options={
				options?.map(type => {
					return { _id: type, name: type };
				}) ?? []
			}
			getOptionLabel={option => {
				// Value selected with enter, right from the input
				if (typeof option === 'string') {
					return option;
				}
				// Add "xxx" option created dynamically
				if (option.inputValue) {
					return option.name;
				}

				if (option?.name) {
					return option.name;
				} else {
					return '';
				}
			}}
			getOptionSelected={(option, value) => {
				return option?._id === search;
			}}
			renderOption={option => {
				if (option._id === 'newEntity') {
					return <Typography style={{ color: 'midnightblue' }}>Add '{option.name}'</Typography>;
				}

				return (
					<Grid container spacing={0}>
						<Grid container item xs={12} alignItems="center">
							<Grid item xs>
								<span style={{ fontWeight: 400 }}>{option.name}</span>
							</Grid>
						</Grid>
					</Grid>
				);
			}}
			onInputChange={onInputChange}
			filterOptions={(options, params) => {
				let inputValue = JSON.parse(JSON.stringify(search));
				if (inputValue.name) {
					inputValue = inputValue.name;
				}
				const filtered = filter(options, { ...params, inputValue });
				const isExist = loadashFilter(filtered, filter => {
					return filter._id === inputValue;
				});
				// Suggest the creation of a new value
				if (inputValue !== '' && (!isExist || isExist.length === 0)) {
					filtered.unshift({
						name: inputValue,
						_id: 'newEntity',
					});
				}
				return filtered;
			}}
			onChange={(event, newValue) => {
				if (newValue && newValue._id) {
					if (newValue._id !== 'newEntity') {
						setDocumentType(newValue);
					} else {
						setDocumentType({ _id: 'newEntity', name: newValue.name });
					}
				} else {
					setSearch('');
					setDocumentType({ _id: '', name: '' });
				}
			}}
			renderInput={params => (
				<TextField
					margin="dense"
					{...params}
					InputProps={{
						...params.InputProps,
					}}
					size="small"
				/>
			)}
			{...other}
		/>
	);
};
