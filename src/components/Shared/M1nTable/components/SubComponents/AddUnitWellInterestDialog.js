import React, { useState, useEffect, useContext, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CloseIcon2 from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import { CircularProgress, Dialog, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import RightDialog from '../../../../ContactDetailCard/components/RightDialog';
import { WELL_INTEREST_SELECT_OPTIONS } from 'graphQL/useQueryWellInterestSelectOptions';
import { ADD_SHAPE_WELL_INTEREST } from 'graphQL/useMutationAddShapeWellInterest';
import { UPDATE_SHAPE_WELL_INTEREST } from 'graphQL/useMutationUpdateShapeWellInterest';
import DeleteConfirmationDialogContent from './DeleteConfirmationDialogContent';
import { useForm, Controller } from 'react-hook-form';

// contexts
import { AppContext } from 'AppContext';
import WellSearchApiField from 'components/Shared/Forms/Fields/WellSearchApiField';
import AutoCompleteFieldComponent from 'components/Shared/Forms/Fields/AutoCompleteField';
import { NumberFormatCustom } from 'components/Shared/Forms/Formatting/NumberFormatCustom';

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

function AddUnitInterestDialog(props) {
	const classes = useStyles();

	const [stateApp, setStateApp] = useContext(AppContext);
	const { control, reset, register, getValues } = useForm();

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
		},
	});
	const [updateShapeWellInterests] = useMutation(UPDATE_SHAPE_WELL_INTEREST, {
		onCompleted: () => {
			setLoading(false);
			handleClose();
		},
	});

	useEffect(() => {
		getWellInterestsSelectOptions({
			variables: { selectKeys: ['Operator', 'WellType', 'WellStatus', 'WellBoreProfile'] },
		});
	}, []);

	useEffect(() => {
		setWellInterestSelectOptions(dataWellInterestsSelectOptions?.wellInterestsSelectOptions?.res);
	}, dataWellInterestsSelectOptions);

	const getOptions = useCallback(
		type => {
			return wellInterestSelectOptions ? wellInterestSelectOptions[type]?.map(e => e.Desc || e.Name) : [];
		},
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
	}, [props.wellInterest]);

	useEffect(() => {
		// if launched from grid row set initializing based on selectedWell state
	}, [selectedWell]);

	const handleClose = () => {
		setSelectedWell(null);
		setStateApp(stateApp => ({
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

	// Function to handle the save operation
	const handleSave = () => {
		// Set the loading state to true
		setLoading(true);

		// Check if there is an existing well interest
		if (props.wellInterest) {
			// Update the existing well interest
			updateShapeWellInterests({
				// Pass the necessary variables for the update mutation
				variables: {
					wellInterests: [
						{
							id: props.wellInterest._id, // ID of the existing well interest
							shapeType: props.shapeType, // Type of shape
							globalWellId: selectedWell.Id, // Global ID of the selected well
							wellName: selectedWell.WellName, // Name of the selected well
							measuredDepth: selectedWell?.measuredDepth, // Measured depth of the selected well
							lateralLength: selectedWell?.lateralLength, // Lateral length of the selected well
							lastTwelveMonthBOE: selectedWell?.lastTwelveMonthBOE, // Last twelve months' Barrel of Oil Equivalent (BOE) for the selected well
							...getValues(), // Spread the rest of the values obtained from the form
						},
					],
				},
				// Specify the queries to be refetched after the mutation
				refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList'],
				// Await the refetch queries to complete before proceeding
				awaitRefetchQueries: true,
			});
		} else {
			// Add a new well interest
			addShapeWellInterest({
				// Pass the necessary variables for the add mutation
				variables: {
					wellInterest: {
						globalWellId: selectedWell.Id, // Global ID of the selected well
						userId: stateApp.user.mongoId, // User ID of the current user
						shapeType: props.shapeType, // Type of shape
						shapeId: props.shapeId, // ID of the shape
						wellName: selectedWell.WellName, // Name of the selected well
						measuredDepth: selectedWell?.measuredDepth, // Measured depth of the selected well
						lateralLength: selectedWell?.lateralLength, // Lateral length of the selected well
						lastTwelveMonthBOE: selectedWell?.lastTwelveMonthBOE, // Last twelve months' Barrel of Oil Equivalent (BOE) for the selected well
						...getValues(), // Spread the rest of the values obtained from the form
					},
				},
				// Specify the queries to be refetched after the mutation
				refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList', 'getShapeSummaryDetails'],
				// Await the refetch queries to complete before proceeding
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
		if (well) reset(well);
	};

	const handleMenuClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const content = (
		<div style={{ padding: '30px' }}>
			{/* <Grid item xs={12} style={{ minHeight: "35px" }}>
        <h4
          style={{
            margin: "0 0 15px 0",
            float: "left",
            fontSize: "1.1rem",
          }}
        >
          {props.wellInterest
            ? `Update ${props.shapeType} Well`
            : `Add ${props.shapeType} Well`}
        </h4>
        <div style={{ float: "right" }}>
          {props.wellInterest && (
            <>
              <IconButton
                disabled={loading}
                onClick={openConfirmationDialog}
                size="small"
                style={{ margin: "0 8px" }}
              >
                {loading ? (
                  <CircularProgress size={20} color="secondary" />
                ) : (
                  <DeleteIcon className={classes.closeIcon} fontSize="small" />
                )}
              </IconButton>
            </>
          )}
          <IconButton onClick={!loading ? handleClose : undefined} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </Grid> */}

			<Grid item xs={12} style={{ minHeight: '35px' }}>
				<h4
					style={{
						margin: '0 0 15px 0',
						float: 'left',
						fontSize: '1.1rem',
					}}
				>
					{/* {props.seletedTract ? `Update ${props.shapeType} Tract` : `Associate Tract to ${props.shapeType}`} */}
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
				<h4
					style={{
						margin: '0 0 15px 0',
						float: 'left',
						fontSize: '1.1rem',
					}}
				>
					Select a system well to associate to unit
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
						options={getOptions('WellType') || []}
						as={<AutoCompleteFieldComponent />}
					/>

					<Controller
						control={control}
						name="wellBoreProfile"
						label="Wellbore Profile"
						defaultValue={''}
						options={getOptions('WellBoreProfile') || []}
						as={<AutoCompleteFieldComponent />}
					/>

					<Controller
						control={control}
						name="wellStatus"
						label="Well Status"
						defaultValue={''}
						options={getOptions('WellStatus') || []}
						as={<AutoCompleteFieldComponent />}
					/>

					<Controller
						control={control}
						name="lastTwelveMonthBOE"
						label="Last 12 (BOE)"
						as={TextField}
						variant="outlined"
						margin="dense"
						disabled
						fullWidth
						defaultValue=""
					/>
					<Controller
						control={control}
						name="measuredDepth"
						label="MD (ft)"
						as={TextField}
						variant="outlined"
						margin="dense"
						disabled
						fullWidth
						defaultValue=""
					/>
					<Controller
						control={control}
						name="lateralLength"
						label="Lateral Length (ft)"
						defaultValue={''}
						as={TextField}
						variant="outlined"
						margin="dense"
						disabled
						fullWidth
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
						header={`Delete Well`}
						onClose={handleCloseDialog}
						deleteFunc={deleteFunc}
						m1nSelectedRowsIds={null}
						setM1nSelectedRowsIndexes={() => {}}
					>
						Do you want to delete the selected well?
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}
			{props.drawerContainer && ReactDOM.createPortal(content, props.drawerContainer)}
			{!props.drawerContainer && (
				<RightDialog open={props.open} handleClickDialogClose={handleClose} width={props.width}>
					{content}
				</RightDialog>
			)}
		</>
	);
}

export default AddUnitInterestDialog;
