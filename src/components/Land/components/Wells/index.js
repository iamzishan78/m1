import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import WellIcon from "components/Shared/svgIcons/well";
import MyWellsGridTable from "components/Table/Wells/MyWellsGridTable";
import WellsFilters from "components/Land/components/Wells/WellsFilters";
import MyWellDialog from "components/Land/components/Wells/MyWellDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "65px",
  },
  custom: {
    marginTop: "25px",
  },
}));

function Wells() {
  const classes = useStyles();
  const { id: globalWellId } = useParams();

  const [filters, setFilters] = useState([]);
  const [selectedWell, setSelectedWell] = useState();
  const [showDialog, setDialog] = useState(false);
  const loadMore = { type: "infiniteScroll", height: "calc(100vh - 166px)" };

  useEffect(() => {
    if (globalWellId) setDialog(true);
  }, [globalWellId]);

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

  const customToolbar = {
    customToolbar: () => (
      <div style={{ display: "inline", float: "left", marginRight: "15px", marginTop: "5px" }}>
        <ButtonGroup variant="contained" color="primary" aria-label="split button">
          <Button color="primary" className={classes.multiSelectionTopBarButtons} onClick={() => setDialog(true)}>
            + Add Well
          </Button>
        </ButtonGroup>
      </div>
    ),
  };

  return (
    <div className={classes.root}>
      <WellsFilters filters={filters} setFilters={setFilters} />
      <div className={classes.custom}>
        <MyWellsGridTable
          dense
          filters={filters}
          header={<Header />}
          parent="WellsTable"
          targetLabel="wells"
          loadMore={loadMore}
          customOptions={customToolbar}
          setSelectedWell={setSelectedWell}
        />
      </div>
      {showDialog && <MyWellDialog selectedWell={selectedWell} setDialog={setDialog} />}
    </div>
  );
}

export default Wells;
