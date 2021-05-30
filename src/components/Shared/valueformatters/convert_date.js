
// this function is intended to convert a date to a presentable format 
import moment from 'moment'

export default function convert_date(value) {

    const convertDate = unixStamp => {

        const date = moment.utc(unixStamp).format("MM/DD/YYYY");
      
        // console.log('UNIXSTAMP',unixStamp)
        if (unixStamp === 'null') {return '--'}
        else if(unixStamp === null) {return '--'}
        else if(unixStamp === undefined) {return '--'}

        else {return date}
      }

    const valueFormatter = (v) => {
        // console.log('VEE',v)
        return convertDate(v);
    };
  

    // console.log('VALUE', value)
    return valueFormatter(value)
  }
  