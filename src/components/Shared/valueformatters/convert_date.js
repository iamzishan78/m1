// this function is intended to convert a date to a presentable format
import moment from 'moment';

export default function convert_date(value) {
	if (!value) {
		return null;
	}

	const convertDate = unixStamp => {
		const date = moment(unixStamp).utc(true).format('MM/DD/YYYY');

		if (unixStamp === 'null') {
			return '--';
		} else if (unixStamp === null) {
			return '--';
		} else if (unixStamp === undefined) {
			return '--';
		} else {
			return date;
		}
	};

	return convertDate(value);
}
