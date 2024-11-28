import CloseIcon from '@material-ui/icons/Close';
import { copy } from 'components/Shared/functions';
const { getMetaCss } = require('./getMetaCss');

export const ChipMeta = ({ index, chipsArray, chipValue, option, iconType, onCustomKeyChange, isSingleSelect }) => {
	const chipStyles = getMetaCss({ option, iconType });

	return (
		<span className="colorText" style={chipStyles}>
			<div
				style={{
					maxWidth: '100px',
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
				}}
			>
				<span id="badgeValue">{chipValue}</span>
			</div>

			{isSingleSelect || (
				<CloseIcon
					style={{ fontSize: 13, marginLeft: 10, cursor: 'pointer' }}
					onClick={e => {
						e.stopPropagation();
						const newValue = copy(chipsArray);
						newValue.splice(index, 1);
						onCustomKeyChange(newValue);
					}}
				/>
			)}
		</span>
	);
};
