import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { useLazyQuery } from '@apollo/client';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';

import UnitIcon from '../../Shared/svgIcons/UnitIcon';

import Button from '@material-ui/core/Button';

import { GET_ES_AGGS_LIST } from 'graphQL/useQueryESAggsList';

const useStyles = makeStyles(theme => ({
	root: {
		padding: '10px 0 0 10px',
		width: '100%',
	},

	cardContent: { width: '100%', display: 'flex' },
	leftColumn: {
		textAlign: 'left',
		marginRight: '18px',
	},
	addIcon: {
		backgroundColor: '#D5F4FF',
		float: 'right',
		top: '-6px',
	},
	button: {
		height: '100%',
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'left',
	},
	lastContactedSpan: { fontWeight: 'normal', marginBottom: '0' },
	icon: {
		width: '80px',
		height: '80px',
		backgroundColor: '#F3D5E8',
		borderRadius: '100%',
		margin: '0 auto',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	h5: { color: '#757575', marginTop: '0', textAlign: 'left' },
}));

export default function ShapeOwnership(props) {
	const classes = useStyles();
	let history = useHistory();
	const [count, setCount] = useState('-');
	const [netAcres, setNetAcres] = useState('-');
	const [nra, setNRA] = useState('-');

	const [getESAggsSumNra, { data: aggsData }] = useLazyQuery(GET_ES_AGGS_LIST, {
		context: { batch: true },
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		if (props.contactData && props.contactData._id) {
			getESAggsSumNra({
				variables: {
					esIndex: 'shapeowners_flat',
					filters: [
						{ field: 'contact._id.keyword', value: props.contactData._id },
						{ field: 'shapeType.keyword', value: 'Unit' },
					],
					aggs: {
						sumNra: {
							sum: { field: 'nra' },
						},
					},
				},
			});
		}
	}, [getESAggsSumNra, props.contactData]);

	useEffect(() => {
		if (aggsData?.getESAggsList?.aggregations?.sumNra) {
			setNRA(
				aggsData?.getESAggsList?.aggregations?.sumNra?.value?.toLocaleString('en-US', { maximumFractionDigits: 2 })
			);
			setCount(aggsData?.getESAggsList?.total);
		}
	}, [aggsData]);

	return (
		<Button
			className={classes.button}
			fullWidth={true}
			variant="outlined"
			onClick={() => {
				history.push(`/contact/details/${props.contactData._id}/units`);
			}}
			// style={{justifyContent: "flex-start"}}
		>
			<div className={classes.root}>
				<div>
					<h4 style={{ marginTop: '0', float: 'left' }}>Unit Interests</h4>
					{/* <IconButton
          size="small"
          className={classes.addIcon}
        >
          <AddIcon htmlColor="rgb(28 173 225 / 81%)" />
        </IconButton> */}
				</div>
				<div className={classes.cardContent}>
					<div className={classes.leftColumn}>
						<div className={classes.icon}>
							<UnitIcon />
						</div>
					</div>

					<div>
						<h5 className={classes.h5}>
							Net Royalty Acres
							<br />
							<span className={classes.lastContactedSpan}>{nra}</span>
						</h5>
						<h5 className={classes.h5}>
							Number of Interests
							<br />
							<span className={classes.lastContactedSpan}>{count}</span>
						</h5>
					</div>
				</div>
			</div>
		</Button>
	);
}
