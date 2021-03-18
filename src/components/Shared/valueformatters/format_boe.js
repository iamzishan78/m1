


// this function is intended to format the boe values for front end

export default function formatBOE(value) {

      const valueFormatter = (boe) => {
        if (!boe || isNaN(boe)) return "--";
      
        return Math.round(boe).toLocaleString();
      };
          
    return valueFormatter(value)
}
