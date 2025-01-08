import React, { Fragment, useState, useCallback, useContext, useEffect } from 'react';

import { TextField } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';

import { useMutation } from '@apollo/client';
import { useLazyQuery } from '@apollo/client';

import { CREATE_NOTE } from 'graphQL/useMutationNote';
import { GET_USER_NOTES } from 'graphQL/useQueryGetNote';

import { globalStateController } from 'hookstate/globalStateController';

import { ProfileContext } from '../../Profile/ProfileContext';

const useStyles = makeStyles(theme => ({
	notes: {
		backgroundColor: '#FFFCDC',
		display: 'block',
		width: '-webkit-fill-available',
		margin: '25px 20px',
		'& .MuiOutlinedInput-root': {
			width: '100%',
			'& fieldset': {
				borderColor: 'white',
			},
		},
	},
}));
function Notepad() {
	const [description, setDescription] = useState('');
	const classes = useStyles();
	const [stateProfile, setStateProfile] = useContext(ProfileContext);
	const [getNote, { data }] = useLazyQuery(GET_USER_NOTES);
	useEffect(() => {
		const user = globalStateController.getValue('user');
		if (stateProfile?.fields?._id || user) {
			getNote({
				variables: {
					userId: stateProfile?.fields?._id || user?._id,
				},
			});
		}
	}, [stateProfile]);
	useEffect(() => {
		setDescription(data?.getUserNotes?.description);
	}, [data]);
	const [createNote] = useMutation(CREATE_NOTE, {
		variables: {
			content: { description, userId: stateProfile?.fields?._id || globalStateController.getValue('user')?._id },
		},
		refetchQueries: [
			{
				query: GET_USER_NOTES,
				variables: { userId: stateProfile?.fields?._id || globalStateController.getValue('user')?._id },
			},
		],
	});
	const handleCreateNote = useCallback(async () => {
		await createNote();
	}, [createNote]);

	const handleBlur = () => {
		handleCreateNote();
	};
	return (
		<Fragment>
			<CardHeader style={{ margin: '8px' }} title={'Private notepad'} />
			<TextField
				margin="dense"
				variant="outlined"
				multiline
				rows="32"
				value={description}
				label="Notes"
				fullWidth
				//   required
				onChange={e => {
					setDescription(e.target.value);
				}}
				className={classes.notes}
				onBlur={handleBlur}
				data-testid="notes-description-text-area"
			/>
		</Fragment>
	);
}
export default Notepad;
