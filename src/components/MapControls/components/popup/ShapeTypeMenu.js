import { FormControl, InputLabel, ListItem, ListItemText, Menu, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';

import { SHAPE_TYPE } from 'components/Navigation/components/Utils/consts';
import AutoCompleteESShapeLayer from 'components/Shared/Forms/Fields/AutoCompleteESShapeLayer';

const useStyles = makeStyles({
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
	inputField: {
		marginTop: '10px',
		padding: '10px',
	},
	dialogFooter: {
		padding: '10px',
		justifyContent: 'end',
		display: 'flex',
	},
});

const OPTIONS = {
	agreement: {
		label: 'Agreement',
		types: [
			{ value: 'contract', label: 'Contract' },
			{ value: 'deed', label: 'Deed' },
			{ value: 'lease', label: 'Lease' },
			{ value: 'surface', label: 'Surface/Row' },
		],
		selectedType: 'lease',
		layerType: 'agreement',
		layerKey: 'shapeJson.properties.type',
		searchFields: SHAPE_TYPE['agreements'].SEARCH_FIELDS,
	},
	tract: {
		label: 'Tract',
		types: [{ value: 'parcel', label: 'Tract' }],
		selectedType: 'parcel',
		layerType: 'parcel',
		layerKey: 'layer',
		searchFields: SHAPE_TYPE['tracts'].SEARCH_FIELDS,
	},
	unit: {
		label: 'Unit',
		types: [{ value: 'unit', label: 'Unit' }],
		selectedType: 'unit',
		layerType: 'unit',
		layerKey: 'shapeJson.properties.type',
		searchFields: SHAPE_TYPE['units'].SEARCH_FIELDS,
	},
};

const ShapeTypeMenu = ({
	shapeAnchorEl,
	setShapeAnchorEl,
	saveAndOpenShapeDetail,
	updateAndOpenShapeDetail,
	classes,
	type,
}) => {
	const [selectedType, setSelectedType] = useState('new');
	const [selectedShapeType, setSelectedShapeType] = useState(OPTIONS[type].selectedType);
	const [selectedShape, setSelectedShape] = useState();
	const shapeActionClasses = useStyles();

	return (
		<Menu
			id="simple-menu"
			elevation={0}
			getContentAnchorEl={null}
			anchorEl={shapeAnchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			PaperProps={{
				style: {
					marginLeft: '173px',
					minWidth: '334px',
				},
			}}
			open={Boolean(shapeAnchorEl)}
			onClose={() => setShapeAnchorEl(null)}
			className={classes.parcelPopover}
		>
			<ListItem
				style={{
					flexDirection: 'column',
					justifyContent: 'start',
					alignItems: 'start',
				}}
			>
				<ListItemText>
					<h4
						onClick={() => {
							setSelectedType('new');
						}}
						className={selectedType === 'new' ? shapeActionClasses.selectedType : shapeActionClasses.unSelectedType}
					>
						New {OPTIONS[type].label}
					</h4>
					<h4
						onClick={() => {
							setSelectedType('existing');
						}}
						className={
							selectedType === 'existing' ? shapeActionClasses.selectedType : shapeActionClasses.unSelectedType
						}
						style={{ marginLeft: '20px' }}
					>
						Existing {OPTIONS[type].label}
					</h4>
				</ListItemText>
			</ListItem>
			{selectedType === 'new' && (
				<>
					<FormControl variant="outlined" fullWidth className={shapeActionClasses.inputField} size="small">
						<InputLabel id={`${type}-outlined-label`}>{OPTIONS[type].label} Type</InputLabel>
						<Select
							labelId={`${type}-outlined-label`}
							defaultValue={'lease'}
							id={`${type}-outlined`}
							value={selectedShapeType}
							fullWidth
							onChange={e => {
								setSelectedShapeType(e.target.value);
							}}
							label={`${OPTIONS[type].label} Type`}
						>
							{OPTIONS[type].types.map(({ value, label }) => (
								<MenuItem value={value}>{label}</MenuItem>
							))}
						</Select>
					</FormControl>
				</>
			)}
			{selectedType === 'existing' && (
				<div
					onKeyDown={e => {
						if (e.key === 'n' || e.key === 'N') {
							e.stopPropagation();
						}
					}}
				>
					<FormControl variant="outlined" fullWidth className={shapeActionClasses.inputField} size="small">
						<AutoCompleteESShapeLayer
							label={`${OPTIONS[type].label} Search`}
							filters={[{ field: OPTIONS[type].layerKey, value: OPTIONS[type].layerType }]}
							setSelectedShapeLayer={setSelectedShape}
							searchFields={OPTIONS[type].searchFields}
						/>
					</FormControl>
				</div>
			)}

			<div className={shapeActionClasses.dialogFooter}>
				<Button
					variant="contained"
					color="default"
					size="medium"
					className={classes.footerButton}
					style={{ margin: '0px 15px 0px 0px' }}
					onClick={() => {
						setShapeAnchorEl(null);
					}}
				>
					Cancel
				</Button>

				<Button
					variant="contained"
					color="primary"
					id="addShapeButton"
					size="medium"
					disabled={selectedType === 'new' ? !selectedType : !selectedShape}
					disableElevation
					onClick={() => {
						selectedType === 'new'
							? saveAndOpenShapeDetail(type, selectedShapeType)
							: updateAndOpenShapeDetail(selectedShape);
					}}
					className={classes.footerButton}
				>
					Add Shape
				</Button>
			</div>
		</Menu>
	);
};

export default ShapeTypeMenu;
