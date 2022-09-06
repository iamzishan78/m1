import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import WellIcon from "components/Shared/svgIcons/well";
import MyWellsGridTable from "components/Table/Wells/MyWellsGridTable";
import WellsFilters from "components/Land/components/Wells/WellsFilters";

const useStyles = makeStyles((theme) => ({
  custom: {
    padding: 0,
    "& ::-webkit-scrollbar": {
      height: "0.7em !important",
    },
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "72vh",
          "@media (max-height:900px)": {
            maxHeight: "72vh",
          },
          "@media (max-height:800px)": {
            maxHeight: "70vh",
          },
          "@media (max-height:768px)": {
            maxHeight: "65vh",
          },
        },
      },
    },
  },
}));

function Wells(props) {
  const [filters, setFilters] = useState([]);
  const classes = useStyles();

  const loadMore = { type: 'infiniteScroll', height: "calc(100vh - 166px)" }

  const Header = () => {
    return (
      <div style={{
        width: "fit-content",
        display: "flex",
        alignItems: "center"
      }}>
        <WellIcon opacity={1} />
        <span style={{
          marginLeft: '10px',
          fontSize: "16px",
          fontWeight: "bold"
        }}>
          Wells
        </span>
      </div>
    )
  }

  return (
    <div style={{ 
      marginTop: "65px",
      marginLeft: '-10px',
      marginBottom: '-10px'
      }}>
      <WellsFilters filters={filters} setFilters={setFilters} />
      <div className={classes.custom} >
        <MyWellsGridTable
          dense
          filters={filters}
          header={<Header />}
          parent="WellsTable"
          targetLabel="wells"
          loadMore={loadMore}
        />
      </div>
    </div>
  );
}

export default Wells;
