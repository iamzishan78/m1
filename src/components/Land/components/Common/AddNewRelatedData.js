import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { CircularProgress, Dialog, DialogTitle, IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';
import { isEmpty, isString } from 'lodash';
import { grey600, grey400 } from 'material-ui/styles/colors';

import CommonForm from 'components/Shared/FormsFieldsData/CommonForm';
import billingPartiesForm from 'components/Shared/FormsFieldsData/RightDialogsSchema/BillingPartyGrid/billing_parties_form_schema';
import costAllocationForm from 'components/Shared/FormsFieldsData/RightDialogsSchema/CostAllocationGrid/cost_allocation_schema';
import payeeForm from 'components/Shared/FormsFieldsData/RightDialogsSchema/PayeeGrid/payee_form_schema';
import paymentForm from 'components/Shared/FormsFieldsData/RightDialogsSchema/PaymentGrid/payment_form_schema';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

// functions

import { detailCardController } from 'hookstate/detailCardController';
import { paymentState, sideDialogController } from 'hookstate/sideDialogController';
import { tableGlobalController } from 'hookstate/tableController';

import { checkFormRequireField } from 'utils/helper';

const useStyles = makeStyles({
	list: {
		width: 250,
	},
	fullList: {
		width: 'auto',
	},
	maxWidth: {
		width: '100%',
	},

	fileUploadSection: {
		minHeight: '50px',
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'column',
		width: '100%',
	},
	fileUploadTopSection: {
		minHeight: '50px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		marginBottom: '23px',
	},
	uploadTitle: {
		margin: '0',
		color: '#757575',
		fontWeight: 'normal',
		marginBottom: '8px',
	},
	uploadSubtext: {
		color: 'rgb(176, 176, 176)',
		margin: '0',
		fontWeight: 'normal',
	},
	IconSection: {
		minHeight: '35px',
		display: 'flex',
		justifyContent: 'center',
		width: 'fit-content',
	},
	fileDrop: {
		minHeight: '125px',
		width: '100%',
		padding: '10px 40px',
		color: '#757575',
		fontWeight: 'normal',
		backgroundColor: '#eee',
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: '2px dashed rgb(176, 176, 176)',
		marginBottom: '30px',
	},
	imageSubText: {
		letterSpacing: '0.5px',
		textAlign: 'center',
	},
	fileDropError: {
		color: 'red',
	},
	Uploadcomp: {
		// width: "200px !important",
		// height: "200px !important",
	},
	forImage: {
		width: '100px !important',
		height: '100px !important',
		backgroundColor: 'transparent !important',
		// border: "1px solid #999",
		borderRadius: '10px !important',
	},
	forImageContainer: {
		width: '100px !important',
		height: '100px !important',
		borderRadius: '10px !important',
		backgroundColor: '#eeeeee !important',
		// border: "1px solid #999",
		textAlign: 'center',
		fontSize: '1.5rem',
		fontWeight: 'bold',
		color: '#555',
		textTransform: 'uppercase',
		paddingTop: '30px',
		cursor: 'pointer',
		marginBottom: '5px',
	},
	dialogFooter: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingTop: '10px',
		paddingRight: '19px',
		paddingBottom: '40px',
	},
	footerButton: {
		letterSpacing: '1px',
		textTransform: 'capitalize',
		fontWeight: 'bold',
		padding: '8px 20px',
	},
	selectedType: {
		borderBottom: '4px solid #01B0F0',
		display: 'inline',
		cursor: 'pointer',
	},
	unSelectedType: {
		display: 'inline',
		color: '#827F7F',
		cursor: 'pointer',
	},
	optionNumber: {
		fontSize: '12px',
	},
	closeButton: {
		'& svg': {
			fill: grey400,
			'&:hover': {
				fill: grey600,
			},
		},
	},
	dateRoot: {
		color: 'grey',
		'& input': {
			marginLeft: '20px',
		},
	},
});

export default function AddNewRelatedData({ title, addNewData, formName }) {
	const Controller = sideDialogController(formName);
	const formState = Controller.useCompleteState();
	const classes = useStyles();
	let [loader, setLoader] = useState(false);
	const { control, reset, getValues, setValue, watch } = useForm();
	const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
	const [state, setState] = useState({
		right: false,
	});
	const [error, setError] = useState(false);

	const paymentMultiGrid = tableGlobalController.getValue('paymentMultiGrid');

	// Memoize form schema to avoid unnecessary re-renders
	const formSchema = useMemo(() => {
		switch (formName) {
			case 'payeeDialog': {
				return payeeForm({
					getValues,
					setValue,
				});
			}
			case 'billingPartiesDialog': {
				return billingPartiesForm({
					getValues,
					setValue,
				});
			}
			case 'costAllocationDialog': {
				return costAllocationForm({
					getValues,
					setValue,
				});
			}
			case 'paymentDialog': {
				return paymentForm({
					getValues,
					setValue,
					isUpdate: !isEmpty(paymentMultiGrid?.paymentData),
				});
			}
			default: {
				return null;
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formState?.rerenderJson]);

	const handleDeleteCancel = () => {
		setOpenDeleteConfirmDialog(false);
	};
	const handleClose = () => {
		detailCardController.updateState({ drawer: '' });
	};

	const toggleDrawer = (anchor, open) => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	const onSubmit = () => {
		const data = getValues();

		if (!isEmpty(paymentMultiGrid?.paymentData) && formName === 'paymentDialog') {
			data._id = paymentMultiGrid.paymentData._id;
		}

		if (checkFormRequireField(data, formSchema)) {
			setError(true);
			return;
		} else {
			setError(false);
		}
		Object.keys(data)?.forEach(key => {
			if (isString(data[key])) {
				data[key] = data[key].replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
			}
		});
		addNewData(data, setLoader);
	};

	useEffect(() => {
		if (!isEmpty(paymentMultiGrid?.paymentData) && formName === 'paymentDialog') {
			const rowData = paymentMultiGrid?.paymentData;
			const filteredData = Object.keys(rowData).reduce((acc, key) => {
				if (key in paymentState) {
					acc[key] = rowData[key];
				}
				return acc;
			}, {});
			filteredData.assignedTo = rowData?.assignedTo?._id || '';
			Controller.updateState(filteredData);
			reset(filteredData);
		}
	}, [paymentMultiGrid?.paymentData]);

	const DocumentDetail = anchor => (
		<div
			style={{ width: '500px', marginLeft: '15px', overflowX: 'hidden' }}
			className={clsx(classes.list, {
				[classes.fullList]: anchor === 'top' || anchor === 'bottom',
			})}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List>
				<ListItem
					style={{
						display: 'flex',
						justifyContent: 'between',
						width: '100%',
						alignItems: 'center',
					}}
				>
					<ListItemText>
						<h3>Related {title}</h3>
					</ListItemText>
					<ListItemIcon>
						<IconButton
							size="small"
							component="span"
							style={{
								background: 'transparent',
								paddingLeft: '10px',
								align: 'center',
							}}
							className={classes.closeButton}
							onClick={handleClose}
						>
							<KeyboardTabBlackIcon size="medium" />
						</IconButton>
					</ListItemIcon>
				</ListItem>
				<ListItem
					style={{
						flexDirection: 'column',
						alignItems: 'normal',
					}}
				>
					<CommonForm
						formSchema={formSchema}
						control={control}
						reset={reset}
						watch={watch}
						dialogKey={formName}
						error={error}
					/>
				</ListItem>
			</List>

			<div className={classes.dialogFooter}>
				<Button
					variant="contained"
					color="default"
					size="medium"
					disableElevation
					// disabled={updateDealLoading || addContactLoading}
					className={classes.footerButton}
					style={{
						margin: '0px 15px 0px 0px',
					}}
					onClick={() => {
						handleClose();
					}}
				>
					Cancel
				</Button>

				<Button
					id="saveDocumentButton"
					variant="contained"
					color="secondary"
					size="medium"
					disableElevation
					disabled={false}
					onClick={onSubmit}
					className={classes.footerButton}
				>
					Save
				</Button>
			</div>
		</div>
	);

	return (
		<div>
			<Drawer anchor={'right'} open={true}>
				<Dialog open={openDeleteConfirmDialog} onClose={handleDeleteCancel} style={{ zIndex: 99999999999 }}></Dialog>
				<Dialog open={loader} style={{ zIndex: 99999999999 }}>
					<DialogTitle id="alert-dialog-title">
						<CircularProgress />
					</DialogTitle>
				</Dialog>

				<>{DocumentDetail('right')}</>
			</Drawer>
		</div>
	);
}
