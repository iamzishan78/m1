import React, { useMemo, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { get } from "lodash";

import { MapControlsContext } from "components/MapControls/MapControlsContext";
import AddALayer from "components/MapControls/components/addALayer";
import SourceLayerManager from "components/MapControls/components/SourceLayerManager";
import LayerStyling from "components/MapControls/components/Layer/LayerStyling";
import LayerManager from "components/MapControls/components/Layer/LayerManager";
import { AppContext } from "AppContext";
import TransferDataManager from "components/MapControls/components/TransferDataManager";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    listStyleType: "none",
    zIndex: "1240",
    left: props.leftPixels,
    width: "525px",
    height: "calc(100vh - 0px)",
  }),
}));

const Secondarypanel = () => {
  const [stateMapControls] = useContext(MapControlsContext);
  const [stateApp] = useContext(AppContext);

  const leftPixels = useMemo(() => {
    return get(document.getElementById("layer-side-panel"), "style.minWidth", "0px");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get(document.getElementById("layer-side-panel"), "style.minWidth", "0px")]);

  const classes = useStyles({ leftPixels });
  return (
    <div className={classes.root}>
      {stateMapControls.manageLayer && <LayerManager />}
      {stateMapControls.manageSourceLayer && <SourceLayerManager />}
      {stateMapControls.manageTransferData && <TransferDataManager />}
      {stateMapControls.addLayer && <AddALayer />}
      {stateMapControls.selectedLayer && <LayerStyling layer={stateApp.selectedLayer} fileName={stateApp.selectedLayer.fileName} />}
    </div>
  );
};

export default Secondarypanel;
