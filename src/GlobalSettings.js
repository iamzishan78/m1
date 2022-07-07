// this is an array of global default settings. 
// initally being used for commonalities on grids 

import Typography from "@material-ui/core/Typography";
import GlobalStyles from "GlobalStyles.js";


const GlobalSettings = {

    muiGridControlCodeInjection: {
        numerals:{
                            //  {             // props.parent === 'Documents' && 
                            //   <div style={{ position: 'relative', zIndex: 100 }}>
                            //     <div style={{ position: 'absolute', left: '-25px', top: '15px', fontWeight: 'bold' }}>
                            //       {tableMeta.rowIndex + 1}
                            //     </div>
                            //   </div>
                            // }
                            numerals: () => (
                              <div style={{ position: 'relative', zIndex: 100 }}>
                                <div style={{ position: 'absolute', left: '-25px', top: '15px', fontWeight: 'bold' }}>
                                  {tableMeta.rowIndex + 1}
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
                whiteSpace: "nowrap",
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

        // customRender: (value, tableMeta) => {
        //     // const splitNumber = value?.split("_");
        //     // const styles = {
        //     //   minWidth: 225,
        //     //   fontWeight: 600,
        //     //   color: "#17aadd",
        //     //   cursor: "pointer",
        //     // };
        //     return (
        //       <div
        //         // style={{borderRight: 'solid red'}}
        //       >
        //                     {
        //                       // props.parent === 'Documents' && 
        //                       <div style={{ position: 'relative', zIndex: 100 }}>
        //                         <div style={{ position: 'absolute', left: '-25px', top: '15px', fontWeight: 'bold' }}>
        //                           {tableMeta.rowIndex + 1}
        //                         </div>
        //                       </div>
        //                     }
            
        //         </div>
        //     );
        //   },

    },

   
    // this is custom options settings for standard grid elements (data display)
    muiGridStandardOptions: {

        // styling props applied to the individual cells w/in a column
        setCellProps: () => ({
            style: {
                minWidth: "250px",
                maxWidth: "250px",
                padding: '0px 25px 0px 25px',
                // background: "white",
                // boxShadow: 'inset -1px 0px 0px 0px lightgrey',
            }
          }),

        // styling props applied to the column header cell
        setCellHeaderProps: () => ({
        style: {
            padding: '0px 25px 0px 25px',
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
            //   <p
            //     onClick={(e) => {
            //       e.stopPropagation();
            //       if (isSnapGrid)
            //         history.push(`/map/${tableMeta.rowData[18]}s/${tableMeta.rowData[0]}`,
            //           { showAgreementBreadcrumb: false }
            //         );
            //       else
            //         history.push(`/land/agreement/details/${tableMeta.rowData[0]}`,
            //           { showAgreementBreadcrumb: true }
            //         );
            //     }}
            //     style={{ fontWeight: 600, color: "#17aadd", cursor: "pointer" }}
            //   >
            

            <Typography
            noWrap
            variant='body2'
            // className={classes.gridElementStyling}
            // style={{width: '250px',
            //         padding: '0px 25px 0px 0px'}}
            >
            {value ? (value) : (<span 
            style={{color: GlobalStyles.colors.mutedGrey}}
            >--</span>)}

          </Typography>

            //   </p>
            );
          },

    }

    };
  
  export default GlobalSettings;