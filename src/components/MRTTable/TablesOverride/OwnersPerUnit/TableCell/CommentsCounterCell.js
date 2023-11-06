import React, { memo, useState, useEffect } from 'react';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import { useLazyQuery } from '@apollo/client';
import { COMMENTSCOUNTER } from 'graphQL/useQueryCommentsCounter';
import { globalStateController } from 'hookstate/globalStateController';

function CommentsCounterCell({ ownerEntity }) {
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });
	const [totalcoments, setTotalComments] = useState(0);
	const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(COMMENTSCOUNTER, {
		fetchPolicy: 'cache-and-network',
	});

	useEffect(() => {
		if (ownerEntity && getUser?._id) {
			getCommentsCounter({
				variables: {
					objectsIdsArray: [ownerEntity],
					userId: getUser._id,
				},
			});
		}
	}, [ownerEntity, getUser, getCommentsCounter]);

	useEffect(() => {
		const comments = dataCommentsCounter?.commentsCounter || [];
		let value = 0;
		if (comments.length) {
			value = comments[0].total;
		}
		setTotalComments(value);
	}, [dataCommentsCounter]);

	return <CommentCell id={ownerEntity} value={totalcoments} />;
}

export default memo(CommentsCounterCell);
