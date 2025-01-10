import React, { useState, useContext, useEffect, useRef } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import LayerIcon from '@material-ui/icons/Layers';

import { useLazyQuery } from '@apollo/client';

import { copy, getPolygonString } from 'components/Shared/functions';

import { GET_PARCELS_FILES_COUNT } from 'graphQL/useQueryGetParcelFiles';
import { SHAPEWELLSCOUNT } from 'graphQL/useQueryShapeWellsCount';

import { globalStateController } from 'hookstate/globalStateController';
import { popupController } from 'hookstate/popupStateController';

import ParcelsDetailCard from './ParcelsDetailCard';
import { getParcelOriginalProperties } from './utils/GetParcelOriginalProps';
import { CUSTOMLAYER } from '../../graphQL/useQueryCustomLayer';
import { ExpandableCardContext } from '../ExpandableCard/ExpandableCardContext';
import DescriptionIcon from '../WellCard/components/svgIcons/DescriptionIcon';
import OwnershipIcon from '../WellCard/components/svgIcons/OwnershipIcon';
import WellIcon from '../WellCard/components/svgIcons/WellIcon';

const useStyles = makeStyles(() => ({
	card: {
		borderStyle: 'none',
		height: '100%',
		boxShadow: 'none',
	},
	content: {
		padding: '0 !important',
		height: '100%',
	},
	cardAction: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'space-evenly',
		backgroundColor: '#fff',
	},
	table: {
		width: '100%',
		height: '100%',
		margin: '0px',
		padding: '0px',
		borderStyle: 'none',
	},
	rowGrey: {
		background: '#F6F6F6',
		border: '0px',
	},
	rowWhite: {
		background: '#FFF',
		border: '0px',
	},
	cell1: {
		border: '0px',
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 600,
		fontSize: '12px',
		lineHeight: '18px',
		color: '#757679',
	},
	cell2: {
		border: '0px',
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 300,
		fontSize: '12px',
		lineHeight: '18px',
		color: '#75767A',
	},
	text1: {
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 600,
		fontSize: '12px',
		lineHeight: '18px',
		color: '#011133',
	},
	text2: {
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 300,
		fontSize: '12px',
		lineHeight: '18px',
		color: '#000',
	},
	iconContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	button: {
		height: '110px',
		width: '100px',
	},
}));

export default function ParcelCard() {
	const parcelPLSS = useRef(false);

	// contexts
	const [stateExpandableCard] = useContext(ExpandableCardContext);
	const [wellNumber, setWellNumber] = useState();

	const popupState = popupController.useState(['selectedParcel', 'parcelDetailCardTabIndex']);

	const [parcelObj, setParcelObj] = useState();
	const [parcelProperties, setProperties] = useState();
	const classes = useStyles();

	// queries
	const [getShapeWellsCount, { data: dataShapeWellsCount }] = useLazyQuery(SHAPEWELLSCOUNT, {
		fetchPolicy: 'cache-and-network',
		skip: true,
	});
	const [getParcelFilesCount, { data: dataParcelFiles }] = useLazyQuery(GET_PARCELS_FILES_COUNT, {
		fetchPolicy: 'cache-and-network',
	});
	const documentCount = dataParcelFiles?.getParcelFilesCount || 0;
	const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);

	const selectedParcel = popupState?.stateValues?.selectedParcel;

	useEffect(() => {
		if (dataShapeWellsCount) {
			setWellNumber(dataShapeWellsCount?.shapeWellsCount);
		}
	}, [dataShapeWellsCount]);

	useEffect(() => {
		if (selectedParcel) {
			getCustomLayer({
				variables: {
					id: selectedParcel.id,
				},
			});
		}
	}, [popupState.selectedParcel]);

	useEffect(() => {
		if (parcelObj) {
			getShapeWellsCount({
				variables: {
					polygon: getPolygonString(parcelObj.shape),
				},
			});
		}
	}, [parcelObj]);

	useEffect(() => {
		if (parcelObj) {
			getParcelFilesCount({
				variables: {
					relatedObjectId: parcelObj?._id || globalStateController.getValue('user'),
					relatedObjectType: 'Parcel',
				},
			});
		}
	}, [parcelObj]);

	useEffect(() => {
		if (dataCustomLayer && dataCustomLayer.customLayer) {
			let shape = dataCustomLayer.customLayer.shape;
			if (typeof shape === 'string') {
				shape = JSON.parse(shape);
			}
			if (dataCustomLayer.customLayer.shapeJson) {
				shape = copy(dataCustomLayer.customLayer.shapeJson);
			}
			setParcelObj({
				...dataCustomLayer.customLayer,
				shape: shape,
			});
			const properties = getParcelOriginalProperties(shape.properties);

			setProperties(properties);
		}
	}, [dataCustomLayer]);
	const handleOpenDetails = tabIndex => {
		popupController.updateState({
			expandedCard: true,
			parcelDetailCardTabIndex: tabIndex,
			popupOpen: false,
		});

		popupController.fitParcelBounds();
	};
	if (parcelObj && parcelObj.state === 'TX') {
		parcelPLSS.current = true;
	}
	return parcelObj ? (
		!stateExpandableCard.expanded ? (
			<div style={{ height: '100%', padding: '9px' }}>
				<Card>
					<CardActions classes={{ root: classes.cardAction }}>
						{/* eslint-disable-next-line no-magic-numbers */}
						<Button className={classes.button} onClick={() => handleOpenDetails(3)}>
							<div className={classes.iconContainer}>
								<WellIcon htmlColor="black" viewBox="0 0 36 31" fontSize="large" />
								<Typography align="center" className={classes.text1} variant="subtitle2">
									Wells
								</Typography>
								<Typography align="center" className={classes.text2} variant="caption">
									{wellNumber || '0'}
								</Typography>
							</div>
						</Button>
						<Button className={classes.button} onClick={() => handleOpenDetails(1)}>
							<div className={classes.iconContainer}>
								<OwnershipIcon htmlColor="black" viewBox="0 0 45 31" fontSize="large" />
								<Typography align="center" className={classes.text1} variant="subtitle2">
									Owners
								</Typography>
								<Typography align="center" className={classes.text2} variant="caption">
									{parcelObj?.ownerCount || '0'}
								</Typography>
							</div>
						</Button>
						{/* eslint-disable-next-line no-magic-numbers */}
						<Button className={classes.button} onClick={() => handleOpenDetails(4)}>
							<div className={classes.iconContainer}>
								<DescriptionIcon htmlColor="black" viewBox="5 0 17 26" fontSize="large" />
								<Typography align="center" className={classes.text1} variant="subtitle2">
									Documents
								</Typography>
								<Typography align="center" className={classes.text2} variant="caption">
									{documentCount}
								</Typography>
							</div>
						</Button>
						<Button className={classes.button} onClick={() => handleOpenDetails(0)}>
							<div className={classes.iconContainer}>
								<LayerIcon htmlColor="black" viewBox="5 0 17 26" fontSize="large" />
								<Typography align="center" className={classes.text1} variant="subtitle2">
									Acres
								</Typography>
								<Typography align="center" className={classes.text2} variant="caption">
									{selectedParcel.sdGrossAcres || selectedParcel.shapeArea}
								</Typography>
							</div>
						</Button>
					</CardActions>
					<CardContent className={classes.content}>
						<Table className={classes.table} size="small" aria-label="well table">
							<TableBody>
								<TableRow className={classes.rowGrey}>
									<TableCell className={classes.cell1} align="left">
										County
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{parcelProperties.county}
									</TableCell>
								</TableRow>
								<TableRow className={classes.rowWhite}>
									<TableCell className={classes.cell1} align="left">
										State
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{parcelProperties.state}
									</TableCell>
								</TableRow>
								<TableRow className={classes.rowGrey}>
									<TableCell className={classes.cell1} align="left">
										{parcelPLSS.current ? 'Survey' : 'Meridian'}
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{parcelPLSS.current ? parcelProperties.survey : parcelProperties.meridian}
									</TableCell>
								</TableRow>
								<TableRow className={classes.rowWhite}>
									<TableCell className={classes.cell1} align="left">
										{parcelPLSS.current ? 'Block' : 'Township'}
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{parcelPLSS.current ? parcelProperties.block : parcelProperties.township}
									</TableCell>
								</TableRow>
								<TableRow className={classes.rowGrey}>
									<TableCell className={classes.cell1} align="left">
										{parcelPLSS.current ? 'Section' : 'Range'}
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{parcelPLSS.current ? parcelProperties.section : parcelProperties.range}
									</TableCell>
								</TableRow>
								<TableRow className={classes.rowWhite}>
									<TableCell className={classes.cell1} align="left">
										{parcelPLSS.current ? 'Abstract' : 'Section'}
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{parcelPLSS.current ? parcelProperties.abstract : parcelProperties.section}
									</TableCell>
								</TableRow>
								{parcelPLSS.current && (
									<TableRow className={classes.rowGrey}>
										<TableCell className={classes.cell1} align="left">
											Alt Survey
										</TableCell>
										<TableCell className={classes.cell2} align="right">
											{parcelProperties.altSurvey}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		) : (
			<div style={{ height: '100%' }}>
				<Card className={classes.card}>
					<CardContent className={classes.content}>
						<ParcelsDetailCard
							id={selectedParcel.id}
							selectTabIndex={popupState.stateValues.parcelDetailCardTabIndex}
						/>
					</CardContent>
				</Card>
			</div>
		)
	) : (
		<CircularProgress color="secondary" />
	);
}
