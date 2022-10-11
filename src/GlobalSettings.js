// this is an array of global default settings. 
// initally being used for commonalities on grids 

import Typography from "@material-ui/core/Typography";
import GlobalStyles from "GlobalStyles.js";

const GlobalSettings = {

  muiGridControlCodeInjection: {
    numerals: {
      numerals: () => (
        <div style={{ position: 'relative', zIndex: 100 }}>
          <div style={{ position: 'absolute', left: '-25px', top: '15px', fontWeight: 'bold' }}>
            {/* {tableMeta.rowIndex + 1} */}
          </div>
        </div>
      ),
    }
  },

  // this is custom options settings for control grid elements (frist column w/ row level indicators and controls)
  muiGridControlOptions: {

    // styling props applied to the individual cells w/in a column
    setCellProps: () => ({
      style: {
        minWidth: "450px",
        maxWidth: "450px",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        position: "sticky",
        left: "77px",
        zIndex: 200,
        boxShadow: 'inset -1px 0px 0px 0px lightgrey',
        padding: '0px 25px 0px 0px',
      }
    }),

    // styling props applied to the column header cell
    setCellHeaderProps: () => ({
      style: {
        position: "sticky",
        paddingLeft: '70px',
        zIndex: 201,
        left: "77px",
      }
    }),

    // indicates if the column will be added to sorting
    sort: true,

    // indicates if the column will be added to filtering
    filter: true,

    // indicates if the column will show on the "show column" toolbar 
    viewColumns: false,

    // display indicates if the default is set to show the column in the grid 
    display: true,
  },

  // this is custom options settings for control grid elements (frist column w/ row level indicators and controls)
  muiGridInfScrollOptions: {

    // styling props applied to the individual cells w/in a column
    setCellProps: () => ({
      style: {
        minWidth: "460px",
        maxWidth: "492px",
        whiteSpace: "pre-wrap",
        position: "sticky",
        left: "109px",
        zIndex: 200,
        boxShadow: 'inset -1px 0px 0px 0px lightgrey',
        padding: '0px 25px 0px 0px',
      }
    }),

    // styling props applied to the column header cell
    setCellHeaderProps: () => ({
      style: {
        position: "sticky",
        zIndex: 201,
        left: "108.5px",
        paddingLeft: "0px"
      }
    }),

    // indicates if the column will be added to sorting
    sort: true,

    // indicates if the column will be added to filtering
    filter: true,

    // indicates if the column will show on the "show column" toolbar 
    viewColumns: false,

    // display indicates if the default is set to show the column in the grid 
    display: true,

  },


  // this is custom options settings for standard grid elements (data display)
  muiGridStandardOptions: {

    // styling props applied to the individual cells w/in a column
    setCellProps: () => ({
      style: {
        minWidth: "250px",
        maxWidth: "250px",
        padding: '0px 25px',
        // background: "white",
        // boxShadow: 'inset -1px 0px 0px 0px lightgrey',
      }
    }),

    // styling props applied to the column header cell
    setCellHeaderProps: () => ({
      style: {
        padding: '0px 25px',
      }
    }),

    // indicates if the column will be added to sorting
    sort: true,

    // indicates if the column will be added to filtering
    filter: true,

    // indicates if the column will show on the "show column" toolbar 
    viewColumns: true,

    // display indicates if the default is set to show the column in the grid 
    display: true,

    // gridElementStyling: {
    //     width: '250px',
    //     padding: '0px 25px 0px 0px'
    //   },
    //   gridElementEmptyStyling: {
    //     color: "#959595"
    //   }

    customRender: (value, tableMeta) => {
      return (
        <Typography
          noWrap
          variant='body2'
        >
          {value ? (value) : (<span
            style={{ color: GlobalStyles.colors.mutedGrey }}
          >--</span>)}
        </Typography>
      );
    },
  },
};

export const GlobalStickyStyles = ({ setCellProps, setCellHeaderProps }) => {

  return {
    setCellProps: () => ({
      style: {
        whiteSpace: "pre-wrap",
        position: "sticky",
        left: "77px",
        zIndex: 200,
        boxShadow: 'inset -1px 0px 0px 0px lightgrey',
        padding: '0px 25px 0px 0px',
        minWidth: setCellProps.maxWidth,
        ...setCellProps
      }
    }),
    // styling props applied to the column header cell
    setCellHeaderProps: () => ({
      style: {
        position: "sticky",
        zIndex: 201,
        left: "77px",
        ...setCellHeaderProps
      }
    }),
    ignoreGlobal: true,
  }
}



export default GlobalSettings;
