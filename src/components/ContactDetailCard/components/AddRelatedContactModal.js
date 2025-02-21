/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';

import { Button, TextField, IconButton, CircularProgress, FormControl, Grid, makeStyles } from '@material-ui/core';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import { Autocomplete } from '@material-ui/lab';

import { useLazyQuery, useMutation } from '@apollo/client';
import get from 'lodash/get';

import AutoCompleteAddNewField from 'components/Common/AutoCompleteWithAddNew';

import { ADD_RELATED_CONTACT } from 'graphQL/useMutationRelatedContact';
import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

import { tableGlobalController } from 'hookstate/tableController';

import RightDialog from './RightDialog';
import { AppContext } from '../../../AppContext';

const useStyles = makeStyles(theme => ({
	dialogHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dialogFooter: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingTop: '10px',
		paddingRight: '19px',
		paddingBottom: '40px',
	},
}));

const RelationshipTypeOptions = ['Child', 'Cousin', 'Parent', 'Spouse'];

export default function AddRelatedContactModal(props) {
	const autoCompletRef = useRef(null);
	const classes = useStyles();
	const [formFields, setFormFields] = useState({
		contact: null,
		relationType: '',
	});
	const [stateApp, setStateApp] = useContext(AppContext);
	const userId = stateApp.user.mongoId;

	const [getESSearch, { data: esFilter, loading }] = useLazyQuery(GET_DB_DATA, {
		fetchPolicy: 'no-cache',
	});
	const [addContact, { data: response, loading: isSubmitting }] = useMutation(ADD_RELATED_CONTACT, {
		refetchQueries: ['getContactSummary', 'getContact'],
		onCompleted: () => {
			tableGlobalController.refetch();
		},
	});

	useEffect(() => {
		getContacts();
	}, [stateApp.addRelatedContactDialog]);

	useEffect(() => {
		if (response?.addRelatedContact?.success) {
			setFormFields({
				contact: null,
				relationType: '',
			});
			autoCompletRef.current.updateDefaultValue('');
			handleClose();
		}
	}, [response]);

	const getContacts = (search = '') => {
		getESSearch({
			variables: {
				index: 'contacts_flat',
				pagination: {
					first: 25,
					after: null,
				},
				search: {
					query: search ? `*${search}*` : null,
					fields: ['name', '_id'],
				},
				sort: {
					field: 'lastUpdateAt',
					order: 'desc',
					unmapped_type: 'date',
				},
				filters: [],
			},
		});
	};

	const handleClose = () => setStateApp({ ...stateApp, addRelatedContactDialog: false });
	const handleSave = () => {
		addContact({
			variables: {
				relationshipType: formFields.relationType,
				descriptorObject: formFields.contact.value,
				relatedObject: props.relatedObject,
				userId,
			},
			refetchQueries: ['getContactSummary', 'getContact'],
			awaitRefetchQueries: true,
		});
	};

	const onInputChange = (_, value) => {
		getContacts(value);
	};

	const formattedContactOptions = useMemo(() => {
		const options = get(esFilter, 'getDbData.hits', []).map(option => ({
			value: option._id,
			name: option.name,
			fullObject: option,
		}));

		return options;
	}, [esFilter, loading]);

	const formIsFilled = formFields.contact && formFields.relationType;

	return (
		<RightDialog open={stateApp.addRelatedContactDialog} handleClickDialogClose={handleClose} width={props.width}>
			<div style={{ padding: '30px' }}>
				<Grid item xs={12} style={{ minHeight: '35px' }}>
					<h4
						style={{
							margin: 0,
							float: 'left',
							fontSize: '1.1rem',
						}}
					>
						{stateApp.activeWellInterest ? 'Update Related Contact' : 'Add Related Contact'}
					</h4>
					<div style={{ float: 'right' }}>
						<IconButton onClick={handleClose} size="small">
							<KeyboardTabIcon fontSize="large" />
						</IconButton>
					</div>
				</Grid>

				<div style={{ marginTop: '15px' }}>
					<FormControl variant="outlined" fullWidth size="small"></FormControl>
					<h4
						style={
							{
								//margin: "0 0 15px 0",
								//float: "left",
								//fontSize: "1.1rem",
							}
						}
					>
						Selected a related contact and set relationship type
					</h4>

					<div style={{ marginBottom: '10px ' }}>
						<Autocomplete
							id="search-contacts"
							getOptionSelected={(option, value) => option.name === value.name}
							getOptionLabel={option => option.name}
							options={formattedContactOptions}
							loading={loading}
							value={formFields.contact}
							onInputChange={onInputChange}
							onChange={(_, newValue) => {
								setFormFields({ ...formFields, contact: newValue });
							}}
							renderInput={params => (
								<TextField
									{...params}
									label="Search Contact"
									variant="outlined"
									size="small"
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<React.Fragment>
												{loading ? <CircularProgress color="inherit" size={20} /> : null}
												{params.InputProps.endAdornment}
											</React.Fragment>
										),
									}}
								/>
							)}
						/>
					</div>
					<div style={{ marginBottom: '10px' }}>
						<AutoCompleteAddNewField
							ref={autoCompletRef}
							id="related-contact-search"
							queryParams={{
								esIndex: 'contacts_flat',
								filterKey: 'relatedContacts.relationshipType.keyword',
								size: 50,
							}}
							onChange={data => {
								setFormFields({ ...formFields, relationType: data.name });
							}}
							defaultOptions={RelationshipTypeOptions}
							value={formFields.relationType}
							inputProps={{ variant: 'outlined', label: 'Relationship Type' }}
						/>
					</div>
				</div>

				<div className={classes.dialogFooter}>
					<Button
						variant="contained"
						color="default"
						size="medium"
						disableElevation
						onClick={handleClose}
						disabled={loading}
						className={classes.footerButton}
						style={{
							margin: '0px 15px 0px 0px',
						}}
					>
						Cancel
					</Button>

					<Button
						variant="contained"
						color="secondary"
						size="medium"
						disableElevation
						onClick={handleSave}
						className={classes.footerButton}
						disabled={isSubmitting || !formIsFilled}
					>
						{isSubmitting ? <CircularProgress size={14} /> : 'Save'}
					</Button>
				</div>
			</div>
		</RightDialog>
	);
}
