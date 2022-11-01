
// this function is intended to convert a date to a presentable format 
import moment from 'moment'

export default function convert_date(value) {

  const convertDate = unixStamp => {

    const date = moment.utc(new Date(unixStamp)).format("MM/DD/YYYY");

    if (unixStamp === 'null') { return '--' }
    else if (unixStamp === null) { return '--' }
    else if (unixStamp === undefined) { return '--' }

    else { return date }
  }

  return convertDate(value);
}
