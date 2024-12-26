import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, Button, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';

import { useLazyQuery } from '@apollo/client';

import Acreage from 'components/Land/components/Agreements/detailComponents/summary/Acreage';
import SummaryTable from 'components/ShapeDetailCard/Common/SummaryTable';
import agreementDefaultData from 'components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData';
import { summaryStyles } from 'components/ShapeDetailCard/style';
import CommentComponent from 'components/Shared/CommentComponent';
import ExpandableSearch from 'components/Shared/Forms/Fields/ExpandableSearch';
import TractIcon from 'components/Shared/svgIcons/tract';
import WellIcon from 'components/Shared/svgIcons/well';
import MetaField from 'components/Table/helpers/MetaField';

import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';
import { SHAPE_SUMMARY_DETAILS } from 'graphQL/useQueryShapeSummaryDetail';

import { globalStateController } from 'hookstate/globalStateController';

import { copy } from 'utils/helper';

export default function AgreementSummary(props) {
	const user = useSelector(({ app }) => app.user);
	const [search, setSearch] = useState('');
	const [unitProperties, setProperties] = useState(props.properties);
	const [tableDataState, setTableDataState] = useState({});

	const { globalStateValues } = globalStateController.useState(['showFieldModal'], 'globalStateValues');

	const classes = summaryStyles({ search });

	const [getShapeSummaryDetails, { data: dataShapeSummaryDetails }] = useLazyQuery(SHAPE_SUMMARY_DETAILS);
	const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

	useEffect(() => {
		getShapeSummaryDetails({ variables: { shapeId: props.id, shapeType: 'Unit' } });
		getMetaData({
			variables: {
				user: user?.mongoId,
				category: 'Agreement',
			},
		});
	}, [props.id]);

	const addCustomData = () => {
		globalStateController.updateState({
			showFieldModal: true,
		});
	};

	const hasCustomProvision = props.provisions.find(provision => !provision.templateRef);

	const addAgreementCustomData = data => {
		const customData = copy(props.properties.custom_data) ?? {};
		data.forEach(d => {
			if (!customData[d.name]) {
				customData[d.name] = null;
			}
		});
		props.updateProperties(null, 'custom_data', customData);
	};

	return (
		<>
			<Grid container direction="row" className={classes.summaryCard}>
				<Grid item md={7} sm={12} className={classes.paddingLeft}>
					<Grid container spacing={1} direction="column">
						<Grid item>
							<Grid
								container
								direction="row"
								justifyContent="space-between"
								alignItems="center"
								style={{ justifyContent: 'space-between' }}
							>
								<Grid item md={5}>
									<Grid container spacing={2} className={classes.summaryDetailCard}>
										<Grid item>
											<div className={classes.summaryValue}>
												{' '}
												{dataShapeSummaryDetails?.shapeSummaryDetails?.shapeWells || 0}{' '}
											</div>
											<WellIcon className={classes.icon} color={'#757575'} opacity="1.0" small />
										</Grid>
										<Grid item>
											<div className={classes.summaryValue}>
												{' '}
												{dataShapeSummaryDetails?.shapeSummaryDetails?.shapeOwners || 0}{' '}
											</div>
											<TractIcon className={classes.icon} opacity="1.0" small />
										</Grid>
										<Grid item>
											<div className={classes.summaryValue}>
												{' '}
												{dataShapeSummaryDetails?.shapeSummaryDetails?.documents || 0}{' '}
											</div>
											<InsertDriveFileOutlinedIcon className={classes.icon} opacity="1.0" small />
										</Grid>
									</Grid>
								</Grid>
								<Grid item md={7}>
									<ExpandableSearch setSearch={setSearch} search={search} />
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<SummaryTable
								tableData={agreementDefaultData}
								properties={props.properties}
								updateProperties={props.updateProperties}
								updateCustomProperties={props.updateCustomProperties}
								search={search}
								metaData={metaDataRes}
								customLayer={props.customLayer}
								shapeType={'Agreement'}
							/>
						</Grid>
						<Grid item>
							<Button
								variant="contained"
								onClick={addCustomData}
								color="primary"
								className={classes.addDataButton}
								startIcon={<AddIcon />}
							>
								Add Data
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid item md={5} sm={12}>
					<Grid container spacing={2} direction="row">
						<Grid item md={12} className={classes.provisionCard}>
							<Typography className="heading">Provisions</Typography>
							<Grid container direction="row">
								{props.standardProvisions.map(provision => {
									const found = props.provisions.find(p => p.type === provision.type);
									return (
										<Grid item md={6} className="provisionRow">
											<Box display="inline-flex" className={found ? '' : 'uncheck'}>
												{found ? <CheckIcon fontSize="medium" style={{ color: '#00b050' }} /> : <CloseIcon />}
												<Typography className="text">{provision.type}</Typography>
											</Box>
										</Grid>
									);
								})}
								<Grid item md={6} className="provisionRow">
									<Box display="inline-flex" className={hasCustomProvision ? '' : 'uncheck'}>
										{hasCustomProvision ? <CheckIcon fontSize="medium" style={{ color: '#00b050' }} /> : <CloseIcon />}
										<Typography className="text">Other</Typography>
									</Box>
								</Grid>
							</Grid>
						</Grid>
						<Acreage properties={unitProperties} />

						<Grid item className={classes.descriptionInput}>
							<TextField
								id="outlined-multiline-static"
								label="Description"
								defaultValue={unitProperties.metaDescription}
								value={unitProperties.metaDescription}
								multiline
								fullWidth
								rows={17}
								variant="outlined"
								onChange={e => {
									setProperties({ ...unitProperties, metaDescription: e.target.value });
								}}
								onKeyDown={e => {
									if (e.keyCode === 13 && !e.shiftKey) {
										props.updateProperties(e, 'metaDescription', unitProperties.metaDescription);
									}
								}}
								onFocus={() => {
									setTableDataState({ description: true });
								}}
								InputProps={{
									endAdornment: tableDataState.description === true && (
										<p className={classes.foodText}>
											<span>Return</span> to save
										</p>
									),
								}}
							/>
						</Grid>
						<Grid item md={12} className={classes.commentSection}>
							<CommentComponent targetLabel="Agreement" targetSourceId={props.id} showCommentType />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			{globalStateValues.showFieldModal && (
				<MetaField
					customDataPrefix="shapeJson.properties.custom_data"
					customDataPostfix=".keyword"
					columns={[]}
					category="Agreement"
					updateColumnSorting={addAgreementCustomData}
				/>
			)}
		</>
	);
}
