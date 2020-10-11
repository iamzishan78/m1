import React, { useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { NavigationContext } from "../NavigationContext";

const playList = [
  'ABO-PECOS SLOPE',
'ANTRIM',
'AUSTIN CHALK',
'AVALON-BONE SPRING',
'BAKKEN',
'BARNETT',
'BARNETT-WOODFORD',
'BEND',
'BEREA-MURRYSVILLE',
'BOWDOIN-GREENHORN',
'BRADFORD-VENANGO-ELK',
'CHATTANOOGA',
'CLEVELAND',
'CODELL-NIOBRARA',
'CODY',
'CONASAUGA',
'COTTON VALLEY',
'CRETACEOUS-LOWER TERTIARY',
'D SAND',
'DAKOTA',
'DAVIS',
'DEVONIAN (OHIO)',
'EAGLE',
'EAGLE FORD',
'EXCELLO-MULKY',
'FAYETTEVILLE',
'FLOYD-CHATTANOOGA',
'FLOYD-NEAL',
'GAMMON',
'GILMER LIME',
'GRANITE WASH',
'HEATH FM',
'HERMOSA',
'HILLIARDBAXTERMANCOS-NIOBRARA',
'JUDITH RIVER- EAGLE',
'MANCOS',
'MANCOS-DAKOTA',
'MANNING CANYON',
'MARCELLUS',
'MEDINA-CLINTON-TUSCARORA',
'MESAVERDE',
'MESAVERDE_',
'MESAVERDE-LANCE',
'MESAVERDE-LANCE-LEWIS',
'MESAVERDE-WASATCH',
'MONTEREY',
'MONTEREY-TEMBLOR',
'MORROW',
'MOWRY',
'MUDDY J SAND',
'MUDDY-FRONTIER-MESAVERDE',
'NEW ALBANY',
'NIOBRARA EAST',
'NIOBRARA FM',
'NIOBRARA- MOWRY',
'NW SHELF PERM-PENN CARBONATE',
'OLMOS',
'OZONA CANYON',
'PEARSALL',
'PICTURED CLLIFFS',
'PIERRE -NIOBRARA',
'RED FORK',
'STUART CITY-EDWARDS',
'THIRTY-ONE CARBONATE-CHERT',
'TRAVIS PEAK',
'TUSCALOOSA',
'UTICA',
'VICKSBURG',
'WILCOX LOBO',
'WOODFORD',
'WOODFORD-CANEY',
];

export default function FilterPlay() {
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [playName, setPlayName] = React.useState(
    stateNav.playName ? stateNav.playName : null
  );

  const handlePlayChange = (value) => {
    let filter;
    if (value && value.length) {
      filter = ["match", ["get", "play"], value, true, false];
      setStateNav((stateNav) => ({ ...stateNav, playName: value }));
      setPlayName(value);
    } else {
      filter = null;
      setStateNav((stateNav) => ({ ...stateNav, playName: [] }));
    }
    setStateNav((stateNav) => ({ ...stateNav, filterPlay: filter }));
  };

  return (
    <Autocomplete
      ChipProps={{ color: "secondary" }}
      defaultValue={stateNav.playName}
      onChange={(event, newValue) => {
        handlePlayChange(newValue);
      }}
      multiple
      options={playList}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Play"
          placeholder=""
          fullWidth={true}
        />
      )}
      disableListWrap
    />
  );
}
