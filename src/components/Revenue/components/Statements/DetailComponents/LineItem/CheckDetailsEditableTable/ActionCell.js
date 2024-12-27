import React, { useState } from 'react';

import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export function ActionCell({ id, onChange }) {
	const [anchorEl, setAnchorEl] = useState(null);

	return (
		<>
			<Button onClick={e => setAnchorEl(e.currentTarget)}>
				<MoreVertIcon id="moreVertActionIcon" aria-controls={`menu-${id}`} aria-haspopup="true" />
			</Button>

			<Menu
				id={`menu-${id}`}
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				elevation={1}
				onClose={() => setAnchorEl(null)}
				style={{ marginTop: '40px' }}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<MenuItem
					// className={classes.userMenuItem}
					onClick={e => {
						onChange(true);
						setAnchorEl(null);
					}}
				>
					<ListItemIcon>
						<DeleteIcon fontSize="small" style={{ color: '#fd0114' }} />
					</ListItemIcon>
					<ListItemText id="deleteLineItem" primary="Delete Line Item" />
				</MenuItem>
			</Menu>
		</>
	);
}
