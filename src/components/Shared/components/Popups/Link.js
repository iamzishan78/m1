import { ClickAwayListener } from '@material-ui/core';
import React from 'react';

const LinkPopup = ({ id, url, onClickAway, onLinkClick, className, maxLength }) => {
	return (
		<ClickAwayListener onClickAway={onClickAway} key={id}>
			<div className={className}>
				<a href={url} target="_blank" rel="noopener noreferrer" onClick={onLinkClick}>
					{url.length > maxLength ? `${url.slice(0, maxLength)}...` : url}
				</a>
			</div>
		</ClickAwayListener>
	);
};

export default LinkPopup;
