import React, { useEffect } from 'react';
import { get } from 'lodash';
import { TextField, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery } from '@apollo/client';
import ContactCardIcon from 'components/Shared/svgIcons/contact_card';
import { detailCardController } from 'hookstate/detailCardController';
import * as Pages from 'components/Shared/components/common/DetailCard/pages';
import { CONTACT_ENTITY } from 'graphQL/useQueryContactEntity';

import ContactPaginatedAutocomplete from 'components/Revenue/components/Common/ContactsPaginatedAutocomplete';

const useStyles = makeStyles({
	dateRoot: {
		color: 'grey',
		'& input': {
			marginLeft: '20px',
		},
	},
	field: {
		'& .MuiAutocomplete-clearIndicator': {
			marginRight: '10px',
		},
		'& .MuiFormControl-marginNormal': {
			margin: '0px',
		},
		'& .MuiFormControl-marginDense': {
			margin: '0px',
		},
		'& .MuiInputBase-root': {
			borderRadius: '7px',
		},
	},
	contactCardIcon: {
		position: 'absolute',
		right: '12px !important',
		marginTop: '4px !important',
		cursor: 'pointer',
	},
});
function OwnerField({ fieldData, field }) {
	const classes = useStyles();
	let history = useHistory();
	const {
		stateValues: { page, loadingField },
	} = detailCardController.useState(['page', 'loadingField']);

	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate();
	const prevValue = fieldData?.get({ noproxy: true });

	const [getContactEntity, { data: contactEntityData }] = useLazyQuery(CONTACT_ENTITY);

	const contactEntity = contactId => {
		getContactEntity({
			variables: {
				contactId,
			},
		});
	};

	useEffect(() => {
		const entity = get(contactEntityData, 'contactEntity.entity');
		if (entity?._id) {
			callApi(field.key, entity?._id);
		}
	}, [contactEntityData, callApi, field.key]);

	return (
		<ContactPaginatedAutocomplete
			nameAutValue={prevValue?.contactId ? prevValue?.name : ''}
			className={classes.field}
			setNameAutValue={value => {
				if (value) contactEntity(value?._id);
				else callApi(field.key, null);
			}}
			renderInput={params => (
				<TextField
					{...params}
					margin="dense"
					variant="outlined"
					InputLabelProps={{
						...params.InputLabelProps,
						shrink: true,
					}}
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<React.Fragment>
								{params.InputProps.endAdornment}
								{loadingField && loadingField === field?.key && <CircularProgress size={22} color="secondary" />}
								<div
									className={classes.contactCardIcon}
									onClick={e => {
										e.stopPropagation();
										if (prevValue?._id) {
											history.push(`/contact/details/${prevValue?.contactId}`);
											window.setStateApp(stateApp => ({
												...stateApp,
												selectedContact: `${prevValue?.contactId}`,
											}));
										}
									}}
								>
									<ContactCardIcon fill={!prevValue?.contactId ? 'darkgrey' : undefined} />
								</div>
							</React.Fragment>
						),
					}}
				/>
			)}
		/>
	);
}

export default OwnerField;
