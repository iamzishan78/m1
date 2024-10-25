import React, { memo } from 'react';
import Avatar from 'react-avatar';

import { Badge } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { detailCardController } from 'hookstate/detailCardController';
import { globalStateController } from 'hookstate/globalStateController';

import useStyles from './useStyles';
import Tags from 'components/Shared/Tagger';
import FieldContent from 'components/ContactDetailCard/components/FieldContent';

const StyleBadge = withStyles({
	badge: {
		transform: 'unset',
		background: '#38c52e',
		color: '#fff',
		border: '2px solid',
		width: '30px',
		height: '30px',
		borderRadius: '50%',
	},
})(props => <Badge {...props} />);

const Header = () => {
	const classes = useStyles({});

	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const { stateValues } = detailCardController.useState(['currentAssetRecord']);
	const currentAssetRecord = stateValues.currentAssetRecord;

	const getControlColumnData = () => {
		const controlColumnKey = currentAsset?.modelKeys?.find(key => !!key.isControlColumn)?.mappingKey;
		if (controlColumnKey && currentAssetRecord) return currentAssetRecord[controlColumnKey];
	};

	if (!currentAssetRecord) return null;

	return (
		<div style={{ display: 'flex' }}>
			<StyleBadge>
				<Avatar
					color={Avatar.getRandomColor(getControlColumnData(), ['#b5d2f6', '#ade2e9', '#eaeaea', '#f2c1e2', '#d7d6fb'])}
					name={getControlColumnData()}
					size="93"
					round
				/>
			</StyleBadge>
			<div className={classes.titleText}>
				<div className={classes.userName}>
					<h2 style={{ width: 'max-content' }}>
						<FieldContent
							noInputFooter
							noMargin
							id={currentAssetRecord?._id}
							content={{ name: getControlColumnData() }}
							disabled
						></FieldContent>
					</h2>
				</div>
				<div className={classes.tagsContainer}>
					<div className={classes.tags}>
						<Tags
							width="100%"
							targetSourceId={currentAssetRecord?._id}
							targetLabel="contact"
							publicLeftBottom
							onlyTags
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(Header);
