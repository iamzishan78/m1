import { colorPallete } from 'utils/consts';

export const getMetaCss = ({ option, iconType, isMetaPopup = false }) => {
	const pallete = colorPallete.find(pallete => pallete.id === option?.palleteId);
	if (iconType === 'Chip') {
		return {
			maxWidth: '150px',
			backgroundColor: pallete?.color,
			color: pallete?.textColor,
			display: 'flex',
			justifyContent: 'space-between',
			alignoptions: 'center',
			margin: '3px 2px',
		};
	} else if (iconType === 'Bullet Point') {
		return {
			marginTop: isMetaPopup ? 4 : 0,
			marginLeft: 5,
			marginRight: 5,
			width: 15,
			height: 15,
			backgroundColor: pallete?.color || 'balck',
			display: 'inline-block',
			borderRadius: 10,
		};
	} else {
		return {};
	}
};
