
// this function will conver ticks to the proper string 

export default function ticksToDateString(ticks) {
    var epochTicks = 621355968000000000;
    var ticksPerMillisecond = 10000; // whoa!
    var maxDateMilliseconds = 8640000000000000;
  
    if (isNaN(ticks)) {
      //      0001-01-01T00:00:00.000Z
      return "NANA-NA-NATNA:NA:BA.TMAN";
    }
  
    // convert the ticks into something javascript understands
    var ticksSinceEpoch = ticks - epochTicks;
    var millisecondsSinceEpoch = ticksSinceEpoch / ticksPerMillisecond;
  
    if (millisecondsSinceEpoch > maxDateMilliseconds) {
      //      +035210-09-17T07:18:31.111Z
      return "+WHOAWH-OA-ISTOO:FA:RA.WAYZ";
    }
  
    // output the result in something the human understands
    var date = new Date(millisecondsSinceEpoch);
    
    return date.toISOString();
  };