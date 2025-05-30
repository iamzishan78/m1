import React, { useState, useEffect } from 'react';
import { useFieldArray, Controller, useWatch } from 'react-hook-form';

import {
	TextField,
	MenuItem,
	Button,
	Grid,
	Checkbox,
	FormControlLabel,
	FormHelperText,
	Tabs,
	Tab,
	Radio,
	RadioGroup,
	Typography,
	makeStyles,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Chip,
	IconButton,
} from '@material-ui/core';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import PropTypes from 'prop-types';

import { entityKeyTypes } from 'components/MRTTable/utils/data';
import { removeSpaces } from 'components/MRTTable/utils/helper';

import { tableGlobalController } from 'stateManagement/tableController';

const useStyles = makeStyles(theme => ({
	fieldActions: {
		display: 'flex',
		justifyContent: 'flex-end',
		marginLeft: 'auto',
		alignItems: 'center',
	},
	removeButton: {
		borderColor: theme.palette.error.light,
		color: theme.palette.error.main,
		marginRight: '8px',
		background: 'none',
		'&:hover': {
			background: 'none',
		},
	},

	root: {
		'& .MuiAccordion-root': {
			border: '1px solid rgba(0, 0, 0, 0.12)',
			borderRadius: '8px',
			boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
			transition: 'all 0.3s ease-in-out',
			'&:hover': {
				boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
				borderColor: theme.palette.primary.main,
			},
			'&:before': {
				display: 'none',
			},
			'&.Mui-expanded': {
				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
				borderColor: theme.palette.primary.main,
			},
		},
		'& .MuiAccordionSummary-root': {
			padding: '0 20px',
			minHeight: '56px',
		},
		'& .MuiAccordionDetails-root': {
			padding: '0 20px 20px',
			display: 'block',
		},
	},
	fieldContainer: {
		marginBottom: '12px',
		border: '1px solid rgba(0, 0, 0, 0.12)',
		borderRadius: '8px',
		backgroundColor: '#fff',
		overflow: 'hidden',
		transition: 'all 0.2s ease-in-out',
	},
	fieldHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '12px 16px',
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
		backgroundColor: '#fff',
	},
	fieldTitle: {
		display: 'flex',
		alignItems: 'center',
		flex: 1,
		'& .MuiTypography-subtitle1': {
			fontWeight: 600,
			fontSize: '1rem',
		},
		'& .MuiChip-root': {
			marginLeft: '12px',
			fontSize: '0.75rem',
			height: '24px',
			backgroundColor: theme.palette.grey[100],
		},
	},
	tabsContainer: {
		backgroundColor: theme.palette.background.paper,
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
		position: 'relative',
	},
	tabs: {
		'& .MuiTab-root': {
			minWidth: 'auto',
			padding: '20px 40px',
			textTransform: 'none',
			fontWeight: 500,
			fontSize: '0.9rem',
			color: theme.palette.text.secondary,
			transition: 'all 0.3s ease-in-out',
			borderBottom: '2px solid transparent',
		},
		'& .Mui-selected': {
			backgroundColor: theme.palette.background.paper,
			color: theme.palette.primary.main,
			fontWeight: 600,
			borderBottom: `2px solid ${theme.palette.primary.main}`,
		},
	},
	tabPanel: {
		padding: '24px',
		backgroundColor: theme.palette.background.paper,
	},
	formGrid: {
		marginBottom: '16px',
		'& .MuiTypography-body2': {
			color: theme.palette.text.secondary,
			fontWeight: 500,
			marginBottom: '8px',
		},
		'& .MuiOutlinedInput-root': {
			'& fieldset': {
				borderColor: 'rgba(0, 0, 0, 0.23)',
			},
			'&:hover fieldset': {
				borderColor: theme.palette.primary.main,
			},
		},
	},
	checkboxGroup: {
		display: 'flex',
		flexWrap: 'wrap',
		marginTop: '12px',
		gap: '12px',
		'& .MuiFormControlLabel-root': {
			marginRight: '24px',
			'& .MuiTypography-root': {
				fontSize: '0.875rem',
				color: theme.palette.text.primary,
			},
			'& .MuiCheckbox-root': {
				color: theme.palette.text.secondary,
				'&.Mui-checked': {
					color: theme.palette.primary.main,
				},
				'&.Mui-disabled': {
					color: theme.palette.action.disabled,
					opacity: 0.6,
					'& + .MuiFormControlLabel-label': {
						color: theme.palette.text.disabled,
					},
				},
			},
		},
	},
	accessControlSection: {
		marginBottom: '16px',
		padding: '16px',
		backgroundColor: theme.palette.grey[50],
		borderRadius: '6px',
	},
	userRoleHeader: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: '16px',
		'& .MuiTypography-subtitle1': {
			fontWeight: 600,
		},
		'& .MuiSvgIcon-root': {
			marginRight: '12px',
			color: theme.palette.primary.main,
		},
	},
	accessOption: {
		display: 'flex',
		alignItems: 'center',
		'& .MuiSvgIcon-root': {
			marginRight: '12px',
			fontSize: '20px',
			color: theme.palette.text.secondary,
		},
		'& span': {
			fontSize: '0.875rem',
		},
	},
	radioGroup: {
		marginLeft: '32px',
		'& .MuiFormControlLabel-root': {
			marginBottom: '8px',
			'& .MuiRadio-root': {
				color: theme.palette.text.secondary,
				'&.Mui-checked': {
					color: theme.palette.primary.main,
				},
			},
			'&.Mui-disabled': {
				color: theme.palette.action.disabled,
				opacity: 0.6,
				'& + .MuiFormControlLabel-label': {
					color: theme.palette.text.disabled,
				},
			},
		},
	},
	adminAccessText: {
		marginLeft: '32px',
		color: theme.palette.text.secondary,
		fontSize: '0.875rem',
	},
	addFieldButton: {
		marginBottom: '16px',
		padding: '8px 16px',
		fontWeight: 600,
		fontSize: '0.875rem',
		boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
		'&:hover': {
			boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
		},
	},
	removeFieldButton: {
		marginTop: '24px',
		display: 'flex',
		justifyContent: 'flex-end',
		'& .MuiButton-root': {
			padding: '8px 20px',
			fontWeight: 600,
			fontSize: '0.875rem',
		},
	},
	infoText: {
		color: theme.palette.text.secondary,
		marginBottom: '24px',
		fontSize: '0.875rem',
		lineHeight: 1.5,
	},
	errorIndicator: {
		backgroundColor: theme.palette.error.main,
		color: 'white',
		borderRadius: '50%',
		padding: '2px 6px',
		fontSize: '0.75rem',
		marginLeft: '8px',
		fontWeight: 'bold',
	},
	fieldTitleError: {
		'& .MuiTypography-subtitle1': {
			color: theme.palette.error.main,
		},
	},
}));

const DynamicForm = ({ control, setValue, errors, clearErrors, isAssociationDialog = false }) => {
	const [expandedField, setExpandedField] = useState(null);
	const [activeTab, setActiveTab] = useState({});
	const [isAddingField, setIsAddingField] = useState(false);
	const classes = useStyles();

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'fields',
	});

	// Watch all fields including access properties
	const watchedFields = useWatch({
		control,
		name: 'fields',
	});

	// Handle field expansion on initial load and new field additions
	useEffect(() => {
		if (fields.length > 0) {
			if (fields.length === 1 && expandedField === null) {
				// First field on initial load
				setExpandedField(fields[0].id);
			} else if (isAddingField) {
				// New field added
				setExpandedField(fields[fields.length - 1].id);
				setIsAddingField(false);
			}
		}
	}, [fields, isAddingField]);

	const handleTabChange = (fieldId, newValue) => {
		setActiveTab(prev => ({
			...prev,
			[fieldId]: newValue,
		}));
	};

	const handleAccordionChange = fieldId => (event, isExpanded) => {
		setExpandedField(isExpanded ? fieldId : null);
	};

	const { stateValues } = tableGlobalController.useState(['AssetCustomEntityDialog']);
	const { type, isAddEditAsset } = stateValues.AssetCustomEntityDialog || {};

	const isCreateAssetMode = type === 'addCustomAsset';

	// Check if any field has isControlColumn set to true
	const hasControlColumnSelected = watchedFields.some(field => field.isControlColumn === true);

	const handleAddField = () => {
		setIsAddingField(true);
		append({
			_id: '',
			mappingKey: '',
			keyType: '',
			label: '',
			isSummaryField: false,
			isControlColumn: false,
			isGridDisplayed: true,
			isDialogDisplayed: true,
			isRequired: false,
			accessControl: {
				admin: 'Full',
				owner: 'Full',
				user: 'Full',
			},
		});
	};

	const renderFieldProperties = (field, index) => {
		return (
			<div className={classes.tabPanel}>
				<Grid container spacing={3} className={classes.formGrid}>
					{field?._id && (
						<Controller
							name={`fields[${index}]._id`}
							control={control}
							defaultValue={field._id || ''}
							render={({ field }) => <input type="hidden" {...field} />}
						/>
					)}
					<Grid item xs={12} md={4}>
						<Typography variant="body2" gutterBottom>
							Label
						</Typography>
						<Controller
							control={control}
							name={`fields[${index}].label`}
							defaultValue={field.label || ''}
							render={({ field }) => (
								<>
									<TextField
										size="small"
										type="text"
										variant="outlined"
										value={field.value}
										inputRef={field.ref}
										onWheel={e => e.target.blur()}
										onChange={e => {
											field.onChange(e.target.value);
											const mappedKey = removeSpaces(e.target.value);
											setValue(`fields[${index}].mappingKey`, mappedKey);
											clearErrors(`fields.${index}.mappingKey`);
										}}
										placeholder="Field label"
										fullWidth
										error={!!errors?.[index]?.label}
										disabled={!isCreateAssetMode}
									/>
									<FormHelperText error>{errors?.[index]?.label?.message || ' '}</FormHelperText>
								</>
							)}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<Typography variant="body2" gutterBottom>
							Key
						</Typography>
						<Controller
							control={control}
							name={`fields[${index}].mappingKey`}
							defaultValue={field.mappingKey || ''}
							render={({ field }) => (
								<>
									<TextField
										size="small"
										type="text"
										variant="outlined"
										value={field.value}
										inputRef={field.ref}
										onWheel={e => e.target.blur()}
										InputLabelProps={{ shrink: !!field.value }}
										onChange={e => {
											const mappedKey = removeSpaces(e.target.value);
											field.onChange(mappedKey);
										}}
										placeholder="Field key"
										fullWidth
										error={!!errors?.[index]?.mappingKey}
										disabled={!isCreateAssetMode}
									/>
									<FormHelperText error>{errors?.[index]?.mappingKey?.message || ' '}</FormHelperText>
								</>
							)}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<Typography variant="body2" gutterBottom>
							Key Type
						</Typography>
						<Controller
							control={control}
							name={`fields[${index}].keyType`}
							defaultValue={field.keyType || ''}
							render={({ field }) => (
								<>
									<TextField
										select
										size="small"
										type="text"
										variant="outlined"
										value={field.value}
										inputRef={field.ref}
										onWheel={e => e.target.blur()}
										onChange={e => {
											field.onChange(e.target.value);
										}}
										placeholder="Select key type"
										fullWidth
										error={!!errors?.[index]?.keyType}
										disabled={!isCreateAssetMode}
									>
										{entityKeyTypes.map(option => (
											<MenuItem key={option.value} value={option.value}>
												{option.label}
											</MenuItem>
										))}
									</TextField>
									<FormHelperText error>{errors?.[index]?.keyType?.message || ' '}</FormHelperText>
								</>
							)}
						/>
					</Grid>
				</Grid>

				<div className={classes.checkboxGroup}>
					{isAddEditAsset && (
						<FormControlLabel
							control={
								<Controller
									control={control}
									name={`fields[${index}].isSummaryField`}
									render={({ field }) => (
										<Checkbox
											checked={!!field.value}
											onChange={e => field.onChange(e.target.checked)}
											color="primary"
											size="small"
											disabled={isAssociationDialog}
										/>
									)}
								/>
							}
							label="Summary Field"
						/>
					)}

					<FormControlLabel
						control={
							<Controller
								control={control}
								name={`fields[${index}].isControlColumn`}
								render={({ field }) => (
									<Checkbox
										checked={!!field.value}
										onChange={e => {
											field.onChange(e.target.checked);
											setValue(`fields[${index}].isRequired`, e.target.checked);
										}}
										color="primary"
										size="small"
										disabled={(hasControlColumnSelected && !field.value) || isAssociationDialog} // Disable if another control column is selected
									/>
								)}
							/>
						}
						label="Control Column"
					/>

					<FormControlLabel
						control={
							<Controller
								control={control}
								name={`fields[${index}].isGridDisplayed`}
								defaultValue={field.isGridDisplayed ?? true}
								render={({ field }) => (
									<Checkbox
										checked={!!field.value}
										onChange={e => field.onChange(e.target.checked)}
										color="primary"
										size="small"
										disabled={isAssociationDialog}
									/>
								)}
							/>
						}
						label="Grid Column"
					/>

					<FormControlLabel
						control={
							<Controller
								control={control}
								name={`fields[${index}].isDialogDisplayed`}
								defaultValue={field.isDialogDisplayed ?? true}
								render={({ field }) => (
									<Checkbox
										checked={!!field.value}
										onChange={e => field.onChange(e.target.checked)}
										color="primary"
										size="small"
										disabled={isAssociationDialog}
									/>
								)}
							/>
						}
						label="Dialog Field"
					/>

					<FormControlLabel
						control={
							<Controller
								control={control}
								name={`fields[${index}].isRequired`}
								defaultValue={field.isRequired ?? false}
								render={({ field }) => (
									<Checkbox
										checked={!!field.value}
										onChange={e => field.onChange(e.target.checked)}
										color="primary"
										size="small"
										disabled={watchedFields[index]?.isControlColumn || isAssociationDialog} // Disable when Control Column is selected
									/>
								)}
							/>
						}
						label="Required"
					/>
				</div>
			</div>
		);
	};

	const renderAccessControl = (field, index) => {
		return (
			<div className={classes.tabPanel}>
				<Typography variant="body2" className={classes.infoText}>
					Configure how different user roles can access this field. By default, all roles have full access.
				</Typography>

				<div className={classes.accessControlSection}>
					<div className={classes.userRoleHeader}>
						<ShieldIcon />
						<Typography variant="subtitle1">
							<strong>Admins</strong>
						</Typography>
						<Typography variant="body2" style={{ marginLeft: '8px', color: '#666' }}>
							(Full access by default)
						</Typography>
					</div>
					<Typography variant="body2" className={classes.adminAccessText}>
						Full access (view and edit)
					</Typography>
				</div>

				<div className={classes.accessControlSection}>
					<div className={classes.userRoleHeader}>
						<PersonIcon />
						<Typography variant="subtitle1">
							<strong>Owners</strong>
						</Typography>
					</div>
					<Controller
						name={`fields[${index}].accessControl.owner`}
						control={control}
						defaultValue="Full"
						render={({ field }) => (
							<RadioGroup {...field} className={classes.radioGroup}>
								<FormControlLabel
									value="Full"
									control={<Radio size="small" />}
									label={
										<div className={classes.accessOption}>
											<VisibilityIcon />
											<span>Full access (view and edit)</span>
										</div>
									}
									disabled={isAssociationDialog}
								/>
								<FormControlLabel
									value="Readonly"
									control={<Radio size="small" />}
									label={
										<div className={classes.accessOption}>
											<LockIcon />
											<span>Read-only (can view but not edit)</span>
										</div>
									}
									disabled={isAssociationDialog}
								/>
								<FormControlLabel
									value="Hidden"
									control={<Radio size="small" />}
									label={
										<div className={classes.accessOption}>
											<VisibilityOffIcon />
											<span>Hidden (cannot view or edit)</span>
										</div>
									}
									disabled={isAssociationDialog}
								/>
							</RadioGroup>
						)}
					/>
				</div>

				<div className={classes.accessControlSection}>
					<div className={classes.userRoleHeader}>
						<GroupIcon />
						<Typography variant="subtitle1">
							<strong>Users</strong>
						</Typography>
					</div>
					<Controller
						name={`fields[${index}].accessControl.user`}
						control={control}
						defaultValue="Full"
						render={({ field }) => (
							<RadioGroup {...field} className={classes.radioGroup}>
								<FormControlLabel
									value="Full"
									control={<Radio size="small" />}
									label={
										<div className={classes.accessOption}>
											<VisibilityIcon />
											<span>Full access (view and edit)</span>
										</div>
									}
									disabled={isAssociationDialog}
								/>
								<FormControlLabel
									value="Readonly"
									control={<Radio size="small" />}
									label={
										<div className={classes.accessOption}>
											<LockIcon />
											<span>Read-only (can view but not edit)</span>
										</div>
									}
									disabled={isAssociationDialog}
								/>
								<FormControlLabel
									value="Hidden"
									control={<Radio size="small" />}
									label={
										<div className={classes.accessOption}>
											<VisibilityOffIcon />
											<span>Hidden (cannot view or edit)</span>
										</div>
									}
									disabled={isAssociationDialog}
								/>
							</RadioGroup>
						)}
					/>
				</div>
			</div>
		);
	};

	const getAccessRestrictionText = field => {
		if (!field?.accessControl) {
			return null;
		}

		const restrictions = [];
		const { admin, owner, user } = field.accessControl;

		// Add access types for each role
		restrictions.push(`Admin: ${admin}`);
		restrictions.push(`Owner: ${owner}`);
		restrictions.push(`User: ${user}`);

		return `Access: ${restrictions.join(' | ')}`;
	};

	const getFieldErrors = index => {
		if (!errors?.[index]) {
			return null;
		}

		const fieldErrors = errors[index];
		const errorCount = Object.keys(fieldErrors).length;
		return errorCount > 0 ? errorCount : null;
	};

	return (
		<div className={classes.root}>
			{isCreateAssetMode && (
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					className={classes.addFieldButton}
					onClick={handleAddField}
				>
					Add Field
				</Button>
			)}

			{fields.map((field, index) => {
				const fieldId = field.id;
				const currentTab = activeTab[fieldId] || 0;
				const currentField = watchedFields[index];
				const restrictionText = getAccessRestrictionText(currentField);
				const errorCount = getFieldErrors(index);

				return (
					<div key={fieldId} className={classes.fieldContainer}>
						<Accordion expanded={expandedField === fieldId} onChange={handleAccordionChange(fieldId)}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls={`field-${index}-content`}
								id={`field-${index}-header`}
							>
								<div className={`${classes.fieldTitle} ${errorCount ? classes.fieldTitleError : ''}`}>
									<Typography variant="subtitle1">
										{currentField?.label || `Field ${index + 1}`}
										{errorCount && <span className={classes.errorIndicator}>{errorCount}</span>}
									</Typography>
									{restrictionText && <Chip size="small" label={restrictionText} variant="outlined" />}
								</div>
								<div className={classes.fieldActions}>
									<IconButton
										size="small"
										onClick={e => {
											e.stopPropagation();
											remove(index);
										}}
										disabled={!isCreateAssetMode || fields.length <= 1}
										className={classes.removeButton}
									>
										<DeleteIcon />
									</IconButton>
								</div>
							</AccordionSummary>

							<AccordionDetails>
								<div className={classes.tabsContainer}>
									<Tabs
										value={currentTab}
										onChange={(e, newValue) => handleTabChange(fieldId, newValue)}
										indicatorColor="primary"
										textColor="primary"
										className={classes.tabs}
									>
										<Tab label="Field Properties" />
										<Tab label="Access Control" />
									</Tabs>
								</div>

								{currentTab === 0 ? renderFieldProperties(field, index) : renderAccessControl(field, index)}
							</AccordionDetails>
						</Accordion>
					</div>
				);
			})}
		</div>
	);
};

DynamicForm.propTypes = {
	control: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
	errors: PropTypes.object,
	clearErrors: PropTypes.func,
	isAssociationDialog: PropTypes.bool,
};

export default DynamicForm;
