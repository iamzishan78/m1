import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import { useMutation } from '@apollo/client';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import { extractValueRecursively } from 'components/MRTTable/utils/helper';
import CommonForm from 'components/Shared/FormsFieldsData/CommonForm';
import contactForm from 'components/Shared/FormsFieldsData/RightDialogsSchema/ContactGrid/contact_form_schema';

import { ADDCONTACT } from 'graphQL/useMutationAddContact';

import { globalStateController } from 'stateManagement/globalStateController';
import { sideDialogController } from 'stateManagement/sideDialogController';
import { tableGlobalController } from 'stateManagement/tableController';

const useStyles = makeStyles(theme => ({
	dialogContent: {
		maxHeight: 'calc(100vh - 135px)',
		'& header': {
			position: 'absolute',
			left: '0',
			top: '55px',
		},
		flex: 'none',
	},
	dialogFooter: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingTop: '10px',
		margin: '0 28px 15px 0',
	},
	footerButton: {
		letterSpacing: '1px',
		textTransform: 'capitalize',
		fontWeight: 'bold',
		padding: '8px 20px',
		width: '120px',
	},
	closeIcon: {
		color: theme.palette.secondary.main,
	},
	loaderWrapper: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		zIndex: 9999,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	loader: {
		position: 'absolute',
		top: '50%',
		left: '50%',
	},
}));

export default function AddContactDialogContent(props) {
	const Controller = sideDialogController('contactDialog');
	const formState = Controller.useCompleteState();

	const { user } = globalStateController.useState(['user']);
	const getUser = user;

	const { control, reset, getValues, setValue, watch } = useForm();

	const { firstName } = getValues() || {};

	const formSchema = useMemo(() => {
		return contactForm({
			getValues,
			setValue,
		});
	}, [formState?.rerenderJson]);

	const [addContact, { loading }] = useMutation(ADDCONTACT);

	const handleClickDialogClose = e => {
		e.preventDefault();
		props.onClose();
		Controller.reset();
	};

	const handleClickAdd = async e => {
		const contactFormValues = getValues();

		Controller.updateState({
			...contactFormValues,
		});

		const updatedFormStateValues = Controller.getAllValues();

		// got required contact values
		const contact = extractValueRecursively({
			...updatedFormStateValues,
			ownerType: updatedFormStateValues?.ownerType ?? null,
			createBy: getUser?._id,
			lastUpdateBy: getUser?._id,
		});

		const { DialogKey, ...filteredContact } = contact;

		await addContact({
			variables: { contact: filteredContact },
			refetchQueries: ['getPaginatedContacts', 'getContact', 'getESContacts', 'getDbData'],
			awaitRefetchQueries: true,
		});
		tableGlobalController.refetch();
		handleClickDialogClose(e);
	};

	const classes = useStyles();

	return (
		<RightDialog open handleClickDialogClose={handleClickDialogClose} width="450px">
			{loading && (
				<div className={classes.loaderWrapper}>
					<CircularProgress color="secondary" className={classes.loader} size={40} />
				</div>
			)}

			<Grid item xs={12} style={{ maxHeight: '60px', padding: 22 }}>
				<h4
					id="addContactHeading"
					style={{
						margin: '0 0 15px 0',
						float: 'left',
						fontSize: '1.4rem',
					}}
				>
					Add New Contact
				</h4>
				<div style={{ float: 'right' }}>
					<IconButton onClick={handleClickDialogClose} size="small">
						<CloseIcon className={classes.closeIcon} fontSize="small" />
					</IconButton>
				</div>
			</Grid>
			<DialogContent className={classes.dialogContent}>
				<CommonForm formSchema={formSchema} control={control} reset={reset} watch={watch} dialogKey={'contactDialog'} />
			</DialogContent>
			<div className={classes.dialogFooter}>
				<Button
					onClick={handleClickDialogClose}
					color="default"
					size="medium"
					variant="contained"
					className={classes.footerButton}
					style={{
						margin: '0px 15px 0px 0px',
					}}
				>
					Cancel
				</Button>
				<Button
					id="addContactButton"
					disabled={!firstName}
					data-testid="contact-add-button"
					onClick={handleClickAdd}
					variant="contained"
					color="secondary"
					className={classes.footerButton}
					size="medium"
				>
					Add
				</Button>
			</div>
		</RightDialog>
	);
}
