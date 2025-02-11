import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';


import { Grid, Typography, Box, Accordion, AccordionSummary, AccordionDetails, IconButton } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

import PropTypes from 'prop-types';

import CustomTextField from 'components/Shared/FormsFieldsData/Fields/CustomTextField.js';
import AgreementIcon from 'components/Shared/svgIcons/agreements';
import TractIcon from 'components/Shared/svgIcons/tract';
import WellIcon from 'components/Shared/svgIcons/well';

import { useStyles as summaryStyles } from '../style';
import Acreage from './Acreage';
import FieldsSection from './fieldsSection';
import RecodingInformation from './RecordingInfo';

export default function Summary({
	flexDirection,
	agreementDetails,
	activeAgreement,
	agreementProvisions,
	standardProvisions,
	updateAgreement,
	shapeSummaryDetails,
}) {
	const [onFocusDescription, setFocusSate] = useState(false);
	const classes = summaryStyles();
	const { control, reset } = useForm();

	useEffect(() => {
		if (agreementDetails) {
			reset(agreementDetails);
		}
	}, [reset, agreementDetails]);

	const hasCustomProvision = agreementProvisions.find(provision => !provision.templateRef);

	return (
		<>
			<div className={classes.root}>
				<Accordion className={classes.accordionRoot} defaultExpanded={true}>
					<AccordionSummary
						expandIcon={
							<IconButton>
								<ExpandMoreIcon fontSize="large" />
							</IconButton>
						}
					>
						<Grid container direction="row" justify="space-between" alignItems="center">
							<Grid item className={classes.summaryHeader}>
								<Typography variant="h5" className={classes.titleText}>
									Summary
								</Typography>
								<Grid container spacing={1} justify="flex-start" className={classes.summaryHeaderIcons}>
									<Grid item>
										<div className={classes.summaryValue}> {shapeSummaryDetails?.relatedParties || 0} </div>
										<PeopleAltIcon opacity="1.0" />
									</Grid>
									<Grid item>
										<div className={classes.summaryValue}> {agreementProvisions?.length || 0} </div>
										<AgreementIcon opacity="1.0" />
									</Grid>
									<Grid item>
										<div className={classes.summaryValue}> {shapeSummaryDetails?.shapeWells || 0} </div>
										<WellIcon opacity="1.0" small color="#757575" />
									</Grid>
									<Grid item>
										<div className={classes.summaryValue}> {shapeSummaryDetails?.shapeOwners || 0} </div>
										<TractIcon opacity="1.0" small />
									</Grid>
									<Grid item>
										<div className={classes.summaryValue}> {shapeSummaryDetails?.documents || 0} </div>
										<InsertDriveFileOutlinedIcon opacity="1.0" small />
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</AccordionSummary>
					<AccordionDetails className={classes.accordionDetails}>
						<Grid
							container
							direction="row"
							justify="flex-start"
							style={{
								padding: '10px 0px',
								display: 'flex',
								flexDirection: flexDirection,
								gap: '40px',
							}}
						>
							<Grid item className={classes.infoSection}>
								<FieldsSection
									agreementDetails={{
										...agreementDetails,
										_id: activeAgreement?._id,
									}}
									updateAgreement={updateAgreement}
									control={control}
								/>
							</Grid>
							<Grid item className={classes.mapSection}>
								<Grid item md={12} className={classes.provisionCard}>
									<Typography className="heading">Provisions</Typography>
									<Grid container direction="row">
										{standardProvisions.map(provision => {
											const found = agreementProvisions.find(p => p.type === provision.type);
											return (
												<Grid item md={6} className="provisionRow" key={provision._id}>
													<Box display="inline-flex" className={found ? '' : 'uncheck'}>
														{found ? <CheckIcon fontSize="medium" style={{ color: '#00b050' }} /> : <CloseIcon />}
														<Typography className="text">{provision.type}</Typography>
													</Box>
												</Grid>
											);
										})}
										<Grid item md={6} className="provisionRow">
											<Box display="inline-flex" className={hasCustomProvision ? '' : 'uncheck'}>
												{hasCustomProvision ? (
													<CheckIcon fontSize="medium" style={{ color: '#00b050' }} />
												) : (
													<CloseIcon />
												)}
												<Typography className="text">Other</Typography>
											</Box>
										</Grid>
									</Grid>
								</Grid>
								<div style={{ padding: '0px 5px 5px 5px', backgroundColor: '#F6F8F9' }}>
									<Acreage properties={agreementDetails} />
								</div>
								<div style={{ padding: '0px 5px 5px 5px', backgroundColor: '#F6F8F9' }}>
									<RecodingInformation properties={agreementDetails} updateAgreement={updateAgreement} />
								</div>
								<Grid item className={classes.descriptionInput}>
									<CustomTextField
										fieldEvents={{
											onFocus: () => setFocusSate(true),
											onBlur: () => setFocusSate(false),
											onKeyDown: event => {
												if (event.key === 'Enter') {
													console.log('Enter pressed', { val: event.target.value });
													document.activeElement.blur();
													updateAgreement('metaDescription', event.target.value);
												}
											},
										}}
										fieldConfig={{
											type: 'text',
											multiline: true,
											variant: 'outlined',
											labelAsHeading: false,
										}}
										fieldAttributes={{
											defaultValue: agreementDetails?.metaDescription || '',
											label: 'Description',
											InputProps: {
												endAdornment: onFocusDescription === true && (
													<p className={classes.foodText}>
														<span>Return</span> to save
													</p>
												),
											},
										}}
										rows={10}
										id={'outlined-multiline-static'}
									/>
								</Grid>
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			</div>
		</>
	);
}

Summary.propTypes = {
	flexDirection: PropTypes.oneOf(['row', 'column']),
	agreementDetails: PropTypes.object,
	activeAgreement: PropTypes.shape({
		_id: PropTypes.string,
	}),
	agreementProvisions: PropTypes.arrayOf(
		PropTypes.shape({
			templateRef: PropTypes.string,
			type: PropTypes.string,
		})
	),
	standardProvisions: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string,
			type: PropTypes.string,
		})
	),
	updateAgreement: PropTypes.func,
	shapeSummaryDetails: PropTypes.shape({
		relatedParties: PropTypes.number,
		shapeWells: PropTypes.number,
		shapeOwners: PropTypes.number,
		documents: PropTypes.number,
	}),
};
