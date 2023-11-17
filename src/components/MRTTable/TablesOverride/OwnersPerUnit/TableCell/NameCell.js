import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MonetizationOnIcon from '@material-ui/icons/LocalAtmOutlined';
import Grid from '@material-ui/core/Grid';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';

const useStyles = makeStyles(() => ({
	agreementNumber: {
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		alignItems: 'center',

		'&:hover': {
			'& $actionButtons': {
				display: 'flex',
			},
		},
	},

	monetizationIcon: {
		margin: '10px',
		color: 'gray',
	},
}));

function NameCell({ renderedCellValue, isPurchased }) {
	const classes = useStyles();

	isPurchased = [true, 'true', 'True'].includes(isPurchased);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				minWidth: '250px',
			}}
		>
			<Grid container spacing={0} direction="row" className={classes.agreementNumber}>
				<Grid
					item
					style={{
						display: 'flex',
						justifyContent: 'flex-start',
					}}
				>
					<p
						className="row-click"
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							minWidth: '300px',
						}}
					>
						{renderedCellValue}

						{isPurchased && (
							<FeatureFlag feature={FEATURES.IDICORE}>
								<MonetizationOnIcon className={classes.monetizationIcon} />
							</FeatureFlag>
						)}
					</p>
				</Grid>
			</Grid>
		</div>
	);
}

export default memo(NameCell);
