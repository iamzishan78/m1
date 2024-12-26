import { useLazyQuery, useMutation } from '@apollo/client';
import { CircularProgress, Dialog, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import AutoCompleteFieldComponent from 'components/Shared/Forms/Fields/AutoCompleteField';
import WellSearchApiField from 'components/Shared/Forms/Fields/WellSearchApiField';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import CloseIcon2 from 'components/Shared/svgIcons/KeyboardTabBlackIcon';

import { ADD_SHAPE_WELL_INTEREST } from 'graphQL/useMutationAddShapeWellInterest';
import { UPDATE_SHAPE_WELL_INTEREST } from 'graphQL/useMutationUpdateShapeWellInterest';

// contexts

import { WELL_INTEREST_SELECT_OPTIONS } from 'graphQL/useQueryWellInterestSelectOptions';

import { globalStateController } from 'hookstate/globalStateController';
import { tableGlobalController } from 'hookstate/tableController';

const useStyles = makeStyles(theme => ({
	dialogFooter: {
		display: 'flex',
		justifyContent: 'flex-end',
		paddingTop: '10px',
	},
	footerButton: {
		letterSpacing: '1px',
		textTransform: 'capitalize',
		fontWeight: 'bold',
		padding: '8px 20px',
	},
	dialog: {
		zIndex: '9999999999 !important',
	},
	royaltyAcres: {
		'& .MuiInputBase-input': {
			color: 'red',
		},
	},
}));

function RelatedWellsDialog(props) {
	const classes = useStyles();

	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });
	const { control, reset, getValues } = useForm();

	const [loading, setLoading] = useState(false);
	const [selectedWell, setSelectedWell] = useState(null);
	const [wellInterestSelectOptions, setWellInterestSelectOptions] = useState({});
	const [valid, setValid] = useState({});
	const [anchorEl, setAnchorEl] = useState();

	const [getWellInterestsSelectOptions, { data: dataWellInterestsSelectOptions }] = useLazyQuery(
		WELL_INTEREST_SELECT_OPTIONS,
		{
			fetchPolicy: 'cache-and-network',
		}
	);

	const [addShapeWellInterest] = useMutation(ADD_SHAPE_WELL_INTEREST, {
		onCompleted: () => {
			setLoading(false);
			handleClose();
			tableGlobalController.refetch();
		},
	});
	const [updateShapeWellInterests] = useMutation(UPDATE_SHAPE_WELL_INTEREST, {
		onCompleted: () => {
			setLoading(false);
			handleClose();
			tableGlobalController.refetch();
		},
	});

	useEffect(() => {
		getWellInterestsSelectOptions({
			variables: { selectKeys: ['Operator', 'WellType', 'WellStatus', 'WellBoreProfile'] },
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setWellInterestSelectOptions(dataWellInterestsSelectOptions?.wellInterestsSelectOptions?.res);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dataWellInterestsSelectOptions);

	const getOptions = useCallback(
		type => {
			return wellInterestSelectOptions ? wellInterestSelectOptions[type]?.map(e => e.Desc || e.Name) : [];
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[wellInterestSelectOptions]
	);

	useEffect(() => {
		if (props.wellInterest) {
			props.wellInterest.api = props.wellInterest.apiNumber;
			setSelectedWell({
				Id: props.wellInterest.wellId,
				WellName: props.wellInterest.wellName,
				ApiNumber: props.wellInterest.api,
				LeaseId: props.wellInterest.leaseId,
				Lease: props.wellInterest.lease,
				LeaseAcreage: props.wellInterest.leaseAcres,
			});

			reset(props.wellInterest);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.wellInterest]);

	useEffect(() => {
		// if launched from grid row set initializing based on selectedWell state
	}, [selectedWell]);

	const handleClose = () => {
		setSelectedWell(null);
		window.setStateApp(stateApp => ({
			...stateApp,
			wellInterestDialog: false,
			activeWellInterest: null,
		}));
		setValid({});
		reset({});
		props.onClose();
	};

	const handleValidate = () => {
		const tempValid = {
			...valid,
			'selectedWell.Id': !selectedWell?.Id,
		};
		setValid(tempValid);

		return !Object.values(tempValid).reduce((acc, cur) => acc + cur);
	};

	const handleSave = () => {
		setLoading(true);
		if (props.wellInterest) {
			updateShapeWellInterests({
				variables: {
					wellInterests: [
						{
							id: props.wellInterest._id,
							shapeType: props.shapeType,
							globalWellId: selectedWell.Id,
							...getValues(),
						},
					],
				},
				refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList'],
				awaitRefetchQueries: true,
			});
		} else {
			addShapeWellInterest({
				variables: {
					wellInterest: {
						globalWellId: selectedWell.Id,
						userId: getUser?._id,
						shapeType: props.shapeType,
						shapeId: props.shapeId,
						...getValues(),
					},
				},
				refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList', 'getShapeSummaryDetails'],
				awaitRefetchQueries: true,
			});
		}
	};

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const openConfirmationDialog = () => {
		setDeleteDialogOpen(true);
	};
	const handleCloseDialog = () => {
		setDeleteDialogOpen(false);
	};

	const deleteFunc = async () => {
		try {
			setLoading(true);
			updateShapeWellInterests({
				variables: {
					wellInterests: [
						{
							id: props.wellInterest._id,
							isDeleted: true,
						},
					],
				},
				refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList', 'getShapeSummaryDetails'],
				awaitRefetchQueries: true,
			});
		} catch {
			setLoading(false);
		}
	};

	const setTenantWell = well => {
		if (well) {
			reset(well);
		}
	};

	const handleMenuClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const content = (
		<div style={{ padding: '30px' }}>
			<Grid item xs={12} style={{ minHeight: '35px' }}>
				<h4
					style={{
						margin: '0 0 15px 0',
						float: 'left',
						fontSize: '1.1rem',
					}}
				>
					{props.wellInterest ? `Update ${props.shapeType} Well` : `Add Well to ${props.shapeType}`}
				</h4>
				<div style={{ float: 'right' }}>
					{props.wellInterest && (
						<>
							<IconButton
								size="small"
								component="span"
								style={{
									background: 'transparent',
									paddingLeft: '10px',
									align: 'center',
								}}
								onClick={handleMenuClick}
							>
								<MoreHorizIcon id="tractMoreHorizIcon" size="medium" />
							</IconButton>
						</>
					)}
					<IconButton onClick={!loading ? handleClose : undefined} size="small">
						<CloseIcon2 fontSize="small" />
					</IconButton>
					<Menu
						id="dealMenu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
						className={classes.menu}
						getContentAnchorEl={null}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
						transformOrigin={{ vertical: 'top', horizontal: 'center' }}
					>
						<MenuItem
							onClick={() => {
								openConfirmationDialog();
							}}
						>
							<ListItemIcon style={{ minWidth: '30px' }}>
								<DeleteIcon size="medium" />
							</ListItemIcon>
							<ListItemText id="deleteTract">Delete</ListItemText>
						</MenuItem>
					</Menu>
				</div>
			</Grid>
			<Grid item xs={12} style={{ minHeight: '35px' }}>
				<h4
					style={{
						margin: '0 0 15px 0',
						float: 'left',
						fontSize: '1.1rem',
						width: '100%',
					}}
				>
					Select a system well to associate to {props.shapeType?.toLowerCase() || 'unit'}
				</h4>
			</Grid>
			<div>
				<WellSearchApiField setTenantWell={setTenantWell} setSelectedWell={setSelectedWell} />

				{/* <Controller
          as={TextField}
          control={control}
          variant="outlined"
          margin="dense"
          name="wellName"
          label={"Well Name"}
          InputLabelProps={{ shrink: true }}
          fullWidth
          disabled
          defaultValue=""
        />

        <Controller
          as={TextField}
          control={control}
          variant="outlined"
          margin="dense"
          name="api"
          label="API Number"
          InputLabelProps={{ shrink: true }}
          fullWidth
          disabled
          defaultValue=""
        /> */}

				<Controller
					as={TextField}
					control={control}
					variant="outlined"
					margin="dense"
					name="leaseId"
					disabled
					label={'Lease Number'}
					fullWidth
					defaultValue=""
				/>
				<Controller
					as={TextField}
					control={control}
					variant="outlined"
					margin="dense"
					name="lease"
					disabled
					label={'Lease Name'}
					fullWidth
					defaultValue=""
				/>

				<Controller
					control={control}
					name="operator"
					label="Operator"
					defaultValue={''}
					disabled
					options={getOptions('Operator') || []}
					as={<AutoCompleteFieldComponent />}
				/>

				{/* <Controller
              control={control}
              name="leaseAcres"
              render={(props) => (
                <TextField
                  variant="outlined"
                  margin="dense"
                  value={props.value}
                  inputRef={props.ref}
                  onChange={(event) => {
                    props.onChange(parseFloat(event.target.value))
                  }}
                  label={"Lease Acres"}
                  fullWidth
                  defaultValue=""
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
              )}
            /> */}
			</div>

			<div>
				<FormControl variant="outlined" fullWidth size="small">
					<Controller
						control={control}
						name="wellType"
						label="Well Type"
						defaultValue={''}
						disabled
						options={getOptions('WellType') || []}
						as={<AutoCompleteFieldComponent />}
					/>

					<Controller
						control={control}
						name="wellBoreProfile"
						label="Wellbore Profile"
						defaultValue={''}
						disabled
						options={getOptions('WellBoreProfile') || []}
						as={<AutoCompleteFieldComponent />}
					/>

					<Controller
						control={control}
						name="wellStatus"
						label="Well Status"
						defaultValue={''}
						disabled
						options={getOptions('WellStatus') || []}
						as={<AutoCompleteFieldComponent />}
					/>
				</FormControl>
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
					id="saveWellButton"
					disableElevation
					onClick={() => {
						handleValidate() && handleSave();
					}}
					className={classes.footerButton}
					disabled={loading || !valid || !selectedWell}
				>
					{loading ? <CircularProgress size={14} /> : 'Save'}
				</Button>
			</div>
		</div>
	);

	console.log('wellInterest', props.wellInterest);
	return (
		<>
			{deleteDialogOpen && (
				<Dialog
					className={classes.dialog}
					open={deleteDialogOpen ? true : false}
					onClose={handleCloseDialog}
					fullWidth={false}
					maxWidth="sm"
				>
					<DeleteConfirmationDialogContent
						header={'Delete Well'}
						onClose={handleCloseDialog}
						deleteFunc={deleteFunc}
						m1nSelectedRowsIds={null}
						setM1nSelectedRowsIndexes={() => {}}
					>
						Do you want to delete the selected well?
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}
			<RightDialog open={props.open} handleClickDialogClose={handleClose} width={props.width}>
				{content}
			</RightDialog>
		</>
	);
}

export default RelatedWellsDialog;
