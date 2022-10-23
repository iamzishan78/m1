import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import WellIcon from "components/Shared/svgIcons/well";
import MyWellsGridTable from "components/Table/Wells/MyWellsGridTable";
import WellsFilters from "components/Land/components/Wells/WellsFilters";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "65px",
  },
  custom: {
    marginTop: "25px",
  },
}));

function Wells(props) {
  const [filters, setFilters] = useState([]);
  const classes = useStyles();

  const loadMore = { type: "infiniteScroll", height: "calc(100vh - 166px)" };

  const Header = () => {
    return (
      <div
        style={{
          width: "fit-content",
          display: "flex",
          alignItems: "center",
        }}
      >
        <WellIcon opacity={1} />
        <span
          style={{
            marginLeft: "10px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Wells
        </span>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <WellsFilters filters={filters} setFilters={setFilters} />
      <div className={classes.custom}>
        <MyWellsGridTable dense filters={filters} header={<Header />} parent="WellsTable" targetLabel="wells" loadMore={loadMore} />
      </div>
    </div>
  );
}

export default Wells;
