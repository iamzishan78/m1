import React, { useState, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import { get } from 'lodash';
import PropTypes from 'prop-types';

import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import { textFieldLabels, getHrefValue, LinkTypes } from 'components/ContactDetailCard/components/FieldContent/helper';
import PencilEditIcon from 'components/ContactDetailCard/components/FieldContent/PencilEditIcon';
import useStyles from 'components/ContactDetailCard/components/FieldContent/style';
import * as Pages from 'components/Shared/components/common/DetailCard/pages';

import { detailCardController } from 'stateManagement/detailCardController';
import { globalStateController } from 'stateManagement/globalStateController';

import { AppContext } from 'AppContext';

export default function FieldContent({
	children,
	id,
	content,
	childrenLeft,
	onlyChildren,
	name,
	noMargin,
	noInputFooter,
	linkType,
	isEdited = false,
	disabled,
}) {
	const [stateApp, setStateApp] = React.useContext(AppContext);
	const [edit, setEdit] = useState(null);
	const [editContent, setEditContent] = useState({ content });
	const [showContent, setShowContent] = useState(content);
	const [isCurEdited, setIsCurEdited] = useState(isEdited);
	const [fieldsCount, setFieldsCount] = useState(0);

	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const {
		stateValues: { page, loadingField },
	} = detailCardController.useState(['page', 'loadingField']);

	const isLoading = loadingField === name;

	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate();

	const classes = useStyles({ noMargin, loading: isLoading, fieldsCount });

	useEffect(() => {
		if (content) {
			setEditContent({ ...content });
			setShowContent({ ...content });

			let count = 0;
			for (const fieldName in content) {
				if (Object.prototype.hasOwnProperty.call(content, fieldName)) {
					count++;
				}
			}
			setFieldsCount(count);
		}
	}, [content]);

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
	}, [edit, editContent, fieldsCount]);

	const getOrganizedContent = () => {
		let textArray = [];
		for (const key in showContent) {
			if (Object.prototype.hasOwnProperty.call(showContent, key) && showContent[key] && showContent[key] !== '') {
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

	const handleUpdating = (val = null) => {
		let differences = false;
		for (const field in editContent) {
			const value = val ? val : editContent[field];
			if (value !== null && value !== undefined) {
				const trimmedValue = typeof value === 'string' ? value.trim() : value;
				if (trimmedValue !== content[field]) {
					differences = true;
				}
			}
		}

		if (differences) {
			setIsCurEdited(true);
			callApi({ key: name, value: val });
			let entries = Object.entries(editContent);
			entries.forEach(entry => {
				content = { ...content, [entry[0]]: entry[1] };
			});
			setShowContent({ ...content });
			setEditContent({ ...content });
			setStateApp({ ...stateApp, contactUpdated: id });
		}

		setEdit(null);
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
			handleUpdating(event.target.value);
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

	let inputsArray = [];
	if (edit) {
		for (const fieldName in editContent) {
			if (Object.prototype.hasOwnProperty.call(editContent, fieldName)) {
				inputsArray.push(
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

	const renderOutput = Object.keys(content).includes('campaignName') ? (
		<CampaignNameField
			className={classes.maxWidth}
			onChange={value => {
				setEditContent(editContent => ({
					...editContent,
					campaignName: value,
				}));
				handleUpdating(value);
			}}
			value={get(editContent, 'campaignName', [])}
			fullWidth
			targetLabel={currentAsset?.name}
			targetLabelId={id}
			onKeyDown={event => keyDownHandler(event, ['campaignName'])}
			onBlur={() => onBlurHandler(['campaignName'])}
		/>
	) : (
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
						: textArray.join(', ')
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
				/>
			)}

			{!childrenLeft && !onlyChildren && children ? children : ''}
			{isCurEdited ? ' (edited)' : ''}
		</span>
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
			{isLoading && (
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
	content: PropTypes.node,
	childrenLeft: PropTypes.node,
	onlyChildren: PropTypes.bool,
	name: PropTypes.string,
	noMargin: PropTypes.bool,
	noInputFooter: PropTypes.bool,
	linkType: PropTypes.oneOf(Object.values(LinkTypes)), // Example for limited string values
	isEdited: PropTypes.bool,
	disabled: PropTypes.bool,
};
