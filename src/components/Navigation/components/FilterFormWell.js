import React, { useState, useContext, useRef, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Grow from '@material-ui/core/Grow';
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { NavigationContext } from "../NavigationContext";
import OperatorAutoComplete from "./OperatorAutoComplete";
import FilterDatePickerPermit from "./FilterDatePickerPermit";
import FilterDatePickerCompletetion from "./FilterDatePickerCompletetion";
import FilterDatePickerSpud from "./FilterDatePickerSpud";
import FilterDatePickerFirstProd from "./FilterDatePickerFirstProd";
import OperatorFilterJ from "./OperatorFilterJ";

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 10;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-around",
    //maxWidth: 220,
    minWidth: 500
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row"
  },
  datesRow: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "column",
    flex: "1",
    flexGrow: 2,
    maxWidth: 400,
    minWidth: 300
  },
  formControl: {
    margin: "15px",
    minWidth: 120,
    maxWidth: 300,
    color: "black",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
    // flexDirection: "column",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: "100px"
  },
  indicator: {
    backgroundColor: "rgba(23, 170, 221, 1) !important"
  },
  inputLabel: {
    color: "black"
  },
  
}));

const MenuProps = {
  disablePortal: true,
  PaperProps: {
    style: {
      marginTop: "55px",
      backgroundColor: "#fff",
      color: "#000",
      maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
      width: 250,
      transformOrigin: 'bottom' ? 'center top' : 'center bottom',
    }
  },
};

const profileList = ["Directional", "Horizontal", "SideTracked", "Vertical"];
//chips multiselect doesn't support objects, so you need two lists. one of names and one of objects to setfilters with
const profileListObjects = [
  {
    id: "78a33b0b-46c8-4d81-ac70-22f3f601b2b1",
    name: "Directional"
  },
  {
    id: "e9a9a604-08e2-412e-9a0a-53cb24eae5ca",
    name: "Horizontal"
  },
  {
    id: "374b9c40-f0ff-4f27-90a9-f9ab93892173",
    name: "SideTracked"
  },
  {
    id: "da27ff9b-f9a0-4c92-8b2b-1bb1465219d8",
    name: "Vertical"
  }
];

const typesList = [
  "Gas",
  "Injection",
  "Oil",
  "Oil and Gas",
  // "Planned",
  "P&A",
  "Unknown",
  "Water",
  // "Storage"
];



const typesListObjects = [
  
  {
    id: "58a67831-5573-49a4-afd7-1010d0b5f194",
    name: "Gas"
  },
  {
    id: "c0d276a7-bd31-4860-b883-5ca13db4e357",
    name: "Injection"
  },
  {
    id: "327e98c4-588d-41f9-8a70-d6105882da00",
    name: "Oil"
  },
  {
    id: "53e0ac18-5111-4618-a5ca-4c2c567f2438",
    name: "Oil and Gas"
  },
  {
    id: "19d94997-a1df-41a8-8a3c-06b6a08f4998",
    name: "P&A"
  },
  {
    id: "66acfa22-0ab7-4369-9d66-586edeae2279",
    name: "Unknown"
  },
  {
    id: "b98dfa5b-c911-40bf-b869-bc56c3edaa2e",
    name: "Water"
  },
  // {
  //   id: "93404e09-84b9-4666-be2c-30a293a817da",
  //   name: "Planned"
  // },
  
  // {
  //   id: "aa1fc32b-c65c-46a0-a5c9-ab88ec5dd64a",
  //   name: "Storage"
  // }
];

const statusList = ["Active", "P&A", "Permit", "Shutin", "Unknown"];
const statusListObjects = [
  {
    id: "3ac3bad5-8c35-40e3-a266-c6af3630ee3e",
    name: "Active"
  },
  {
    id: "2bedd5aa-5275-4077-8009-3d0a2ef61e53",
    name: "Permit"
  },
  {
    id: "cd655540-6e64-4d3d-945a-df9cbf3b090f",
    name: "P&A"
  },
  {
    id: "fa7bed00-4392-4959-ae03-ce611410aba2",
    name: "Shutin"
  },
  {
    id: "73fbd1c6-0114-47ce-93cb-d5da49c0539b",
    name: "Unknown"
  },
];


const operatorList = [	"1849 ENERGY PARTNERS OPRTNG LLC",
                    "4SIGHT OPERATING COMPANY",
                    "ABRAXAS PETROLEUM",
                    "ACADIA OIL",
                    "ACOCK/ANAQUA OPERATING COMPANY",
                    "ADAMS AFFILIATES",
                    "AETHON ENERGY OPERATING",
                    "AGHORN OPERATING",
                    "AMERADA HESS",
                    "AMERICAN PETROFINA CO OF TEX",
                    "AMERICO ENERGY RESOURCES",
                    "AMOCO PRODUCTION COMPANY",
                    "AMPLIFY ENERGY OPERATING",
                    "ANADARKO PETROLEUM",
                    "ANDERSON JAMES K",
                    "APACHE",
                    "APPROACH OPERATING",
                    "APV MCCAMEY",
                    "ARCADIA OPERATING",
                    "ARCH OIL AND GAS COMPANY",
                    "ARCO OIL AND GAS COMPANY",
                    "ARMOR PETROLEUM",
                    "ARROWHEAD PRODUCTION",
                    "ASPEN OPERATING COMPANY",
                    "ATLANTIC RICHFIELD COMPANY",
                    "ATLAS OPERATING",
                    "ATMOS ENERGY CORP MIDTEX DIV",
                    "AURORA RESOURCES",
                    "AVALON TX OPERATING LLC",
                    "AZTECA PETROLEUM",
                    "B AND B OIL",
                    "BAKER OPERATING",
                    "BALLARD EXPLORATION COMPANYINC",
                    "BANNER OIL AND GAS",
                    "BAR L PRODUCERS",
                    "BASA RESOURCES",
                    "BASTROP OIL AND GAS",
                    "BAYLOR OPERATING",
                    "BCEMACH II LLC",
                    "BEDROCK PRODUCTION LLC",
                    "BERRY OIL COMP",
                    "BETTIS BOYLE AND STOVALL",
                    "BHP BILLITON PETROLEUM",
                    "BIRCH OPERATIONS",
                    "BLACK BAYOU OPERATING",
                    "BLACKBEARD OPERATING",
                    "BLACKBRUSH O AND G",
                    "BLS PRODUCTION",
                    "BLUESTONE NATURAL RES II",
                    "BOAZ ENERGY II OPERATING",
                    "BORDERLINE OPERATING",
                    "BP AMERICA PRODUCTION COMPANY",
                    "BPX OPERATING COMPANY",
                    "BRADLEY OPERATING COMPANY",
                    "BRAKA OPERATING",
                    "BRECK OPERATING",
                    "BREITBURN OPERATING",
                    "BRG LONE STAR",
                    "BRIDWELL OIL COMPANY",
                    "BROWN GEO R LPTHE",
                    "BTA OIL PRODUCERS",
                    "BUFFCO PRODUCTION",
                    "BURK ROYALTY",
                    "BURK ROYALTY COMPANY",
                    "BURLINGTON RESOURCES OIL AND GAS COMPANY",
                    "BXP OPERATING",
                    "C AND E OPERATING",
                    "CADDO ENERGY",
                    "CALLON PETROLEUM COMPANY",
                    "CALTEX ENERGY COMPANY",
                    "CAMBRIAN MANAGEMENT",
                    "CARRIZO OIL AND GAS",
                    "CBP OPERATING",
                    "CCI EAST TEXAS UPSTREAM",
                    "CCI GULF COAST UPSTREAM",
                    "CENTENNIAL RESOURCE PRODUCTION",
                    "CENTURY PETROLEUM",
                    "CHAMPION LONE STAR OPERATINGLLC",
                    "CHAMPLIN PETROLEUM COMPANY",
                    "CHARRO OPERATING",
                    "CHESAPEAKE OPERATING",
                    "CHEVRON",
                    "CHOLLA PETROLEUM",
                    "CIMAREX ENERGY COMPANY",
                    "CITATION OIL AND GAS",
                    "CITIES SERVICE OIL COMPANY",
                    "CLARK OIL COMPANY",
                    "CLAYTON WILLIAMS ENERGY",
                    "CLEAR FORK INCORPORATED",
                    "CLEARLY PETROLEUM",
                    "CML EXPLORATION",
                    "COASTAL OIL AND GAS",
                    "COBRA OIL AND GAS",
                    "COG OPERATING",
                    "COLUMBUS ENERGY",
                    "COMPASS ENERGY OPERATING",
                    "COMSTOCK OIL AND GAS",
                    "COMSTOCK OIL AND GASLA",
                    "CONOCO",
                    "CONOCOPHILLIPS CANADA RESOURCES",
                    "CONTINENTAL OIL COMPANY",
                    "COOPER OIL AND GAS",
                    "CORPUS CHRISTI OIL AND GAS COMPANY",
                    "COTTONWOOD PETROLEUM COMPANY",
                    "COURSON OIL AND GAS",
                    "COX JOHNLLC",
                    "CRAIG BOB",
                    "CROSS TIMBERS ENERGY",
                    "CROWN CENTRAL PETROLEUM",
                    "CROWNQUEST OPERATING",
                    "DALLAS PRODUCTION",
                    "DAVIS BROTHERS",
                    "DAYLIGHT PETROLEUM",
                    "DE3 OPERATING",
                    "DECLEVA PAUL",
                    "DELRAY OIL",
                    "DELTA OIL AND GAS",
                    "DENBURY ONSHORE",
                    "DEVON ENERGY PRODUCTION COMPANY",
                    "DEWBRE PETROLEUM",
                    "DIAMOND CHEMICALS COMPANY",
                    "DIAMOND S ENERGY COMPANY",
                    "DIAMONDBACK ENERGY",
                    "DISCOVERY NATURAL RESOURCES",
                    "DISCOVERY OPERATING",
                    "DJH OIL AND GAS",
                    "DOMINION OKLAHOMA TEXAS E AND P",
                    "DP PERMIAN OPERATOR LLC",
                    "DREYFUS LOUIS NATURAL GAS",
                    "DYERSDALE ENERGY",
                    "EAGLE FORD OIL",
                    "EAGLE OIL AND GAS COMPANY",
                    "EAGLERIDGE OPERATING",
                    "EASTLAND OPERATING",
                    "EASTWEST ENERGY",
                    "ECHO PRODUCTION",
                    "EL DORADO GAS AND OIL",
                    "EL DORADO OIL AND GAS",
                    "ENCANA OIL AND GAS",
                    "ENDEAVOR ENERGY RESOURCES",
                    "ENDURO OIL COMPANY",
                    "ENERGAS COMPANY",
                    "ENERGEN RESOURCES",
                    "ENERGY 2000",
                    "ENERVEST OPERATING",
                    "ENHANCED ENERGY PARTNERS",
                    "ENRE",
                    "ENRICH OIL",
                    "ENRON OIL AND GAS COMPANY",
                    "ENSERCH EXPLORATION",
                    "ENSIGN OPERATING COMPANY",
                    "ENTERPRISE PRODUCTS OPERATINGLLC",
                    "EOG RESOURCES",
                    "EP ENERGY E AND P COMPANY",
                    "EPIC PERMIAN OPERATING",
                    "ERNEST OPERATING COMPANY",
                    "EVEREST EXPLORATION COMPANY",
                    "EXCO OPERATING COMPANY",
                    "EXTEX OPERATING COMPANY",
                    "EXXCEL PRODUCTION COMPANY",
                    "EXXON MOBIL",
                    "FASKEN OIL AND RANCH",
                    "FAULCONER VERNON E",
                    "FDL OPERATING",
                    "FELDERHOFF PRODUCTION COMPANY",
                    "FELIX ENERGY HOLDINGS II",
                    "FINA OIL AND CHEMICAL COMPANY",
                    "FINLEY RESOURCES",
                    "FIREBIRD ENERGY LLC",
                    "FLINT OAK ENERGY",
                    "FOOTHILLS TEXAS",
                    "FOREST OIL",
                    "FOUNDATION ENERGY MANAGEMENT",
                    "FOUR CORNERS PETROLEUM II",
                    "FOURPOINT ENERGY",
                    "FROSTWOOD ENERGY",
                    "G AND F OIL",
                    "GAITHER PETROLEUM",
                    "GALVESTON BAY ENERGY",
                    "GEOMEG ENERGY OPERATING",
                    "GEOSOUTHERN ENERGY",
                    "GETTY OIL COMPANY",
                    "GINCO OPERATING COMPANY",
                    "GOLD FIELDS MINING",
                    "GOLDKING PRODUCTION COMPANY",
                    "GREAT PLAINS RESOURCES",
                    "GREAT WESTERN OPERATING COMPANY",
                    "GRIZZLY OP OF DELAWARE, LLC",
                    "GUIDANCE OIL DEVELOPERSINC1",
                    "GUIDON ENERGY MGMT SERVICES",
                    "GULF OIL",
                    "GUNN OIL COMPANY",
                    "HADLEY OIL COMPANY",
                    "HALCON OPERATING",
                    "HAMMAN OIL AND REFINING COMPANY",
                    "HAWKWOOD ENERGY OPERATING",
                    "HEADINGTON ENERGY PARTNERS",
                    "HENRY PETROLEUM",
                    "HENRY RESOURCES",
                    "HEXP OPERATING",
                    "HIGHMOUNT EXPLORATION AND PRODUCTION TEXAS",
                    "HILCORP ENERGY COMPANY",
                    "HNG OIL COMPANY",
                    "HOPEWELL OPERATING",
                    "HOUSTON OIL AND GAS",
                    "HOUTCHENS D D",
                    "HUBER J M",
                    "HUGHES DAN A COMPANY",
                    "HUMBLE OIL AND REFINING COMPANY",
                    "HUNT OIL COMPANY",
                    "IEC",
                    "INDEPENDENCE RESOURCES MGMT",
                    "ISKANDIA ENERGY OPERATING",
                    "J W RESOURCES",
                    "JACOBS C E COMPANY",
                    "JAGGED PEAK ENERGY",
                    "JAY MANAGEMENT COMPANY",
                    "JETTA OPERATING COMPANY",
                    "JM COX RESOURCES",
                    "JOHNSON AND ERNST OPERATING COMPANY",
                    "JONES COMPANY",
                    "JONES ENERGY",
                    "JUNO OPERATING COMPANY II",
                    "JUST OIL AND GAS",
                    "KAISERFRANCIS OIL COMPANY",
                    "KD ENERGY",
                    "KEBO OIL AND GAS",
                    "KERR MCGEE OIL AND GAS ONSHORE",
                    "KILLAM OIL",
                    "KILMARNOCK OIL COMPANY",
                    "KINDER MORGAN PRODUCTION",
                    "KJ ENERGY",
                    "KNIGHT MACK",
                    "KODIAK OPERATING",
                    "KOVAR OPERATING",
                    "KTC OIL ENTERPRISES",
                    "LAREDO ENERGY OPERATING",
                    "LAREDO PETROLEUM",
                    "LARGE OPERATING LLC",
                    "LARIO OIL AND GAS COMPANY",
                    "LATIGO PETROLEUM",
                    "LAYLINE ENERGY I",
                    "LCS PRODUCTION COMPANY",
                    "LECLAIR OPERATING",
                    "LEGACY RESERVES OPERATING",
                    "LEGEND NATURAL GAS II",
                    "LEWIS PETRO PROPERTIES",
                    "LIME ROCK RESOURCES IIIA",
                    "LINDER JOHN OPERATING",
                    "LINN OPERATING",
                    "LONESTAR OPERATING",
                    "MAC 5 OPERATING",
                    "MAGNOLIA OIL AND GAS OPERATING",
                    "MAGNUM PRODUCING",
                    "MAMMOTH EXPLORATION",
                    "MARATHON OIL COMPANY",
                    "MASSIE OIL COMPANY",
                    "MATADOR PRODUCTION COMPANY",
                    "MAVERICK ENERGY AND DEV",
                    "MAVERICK PRODUCTION",
                    "MCCLURE OIL COMPANY",
                    "MCDAY ENERGY",
                    "MCFADDEN OIL",
                    "MCGOWAN WORKING PARTNERS",
                    "MD AMERICA ENERGY",
                    "MECO IV",
                    "MEDDERS OIL COMPANY",
                    "MERCURY OPERATING",
                    "MERIT ENERGY COMPANY",
                    "MEWBOURNE OIL COMPANY",
                    "MILLENNIUM RESOURCES",
                    "MITCHELL ENERGY",
                    "MOBIL OIL",
                    "MOBIL PRODUCING TX AND NM",
                    "MOMENTUM OPERATING",
                    "MONROE WELL SERVICE",
                    "MUIRFIELD EXPLORATION",
                    "MURPHY EXPLORATION AND PRODUCTION COMPANY",
                    "MUSTANG EXPLORATION",
                    "MYERS JAMES B",
                    "NATIONAL LAND RESOURCES",
                    "NEUMIN PRODUCTION COMPANY",
                    "NEWFIELD EXPLORATION MIDCON",
                    "NEWMAN OPERATING COMPANY",
                    "NOBLE ENERGY",
                    "NORTH AMERICAN ROYALTIES",
                    "NORTH CENTRAL OIL",
                    "OAKRIDGE OIL AND GAS",
                    "OIL INVESTORS",
                    "OILEX INTL INVESTMENTS",
                    "OILWELL OPERATORS",
                    "OLSEN ENERGY",
                    "ORLAND OIL AND GAS",
                    "ORYAN OIL AND GAS",
                    "OXY",
                    "PAN AMERICAN PETROLEUM",
                    "PANTERA ENERGY COMPANY",
                    "PARALLEL PETROLEUM",
                    "PARKER AND PARSLEY DEVELOPMENT",
                    "PARSLEY ENERGY OPERATIONS",
                    "PATTERSON PETROLEUM",
                    "PEARL BILL H PRODUCTION",
                    "PEBA OIL AND GAS",
                    "PENN VIRGINIA OIL AND GAS",
                    "PETCO PETROLEUM",
                    "PETEX",
                    "PETROHAWK OPERATING COMPANY",
                    "PETROLEGACY ENERGY II",
                    "PETROLEUM CORPORATION OF TEXAS",
                    "PETROSAURUS",
                    "PGM INTERNATIONAL OPERATINGLLC",
                    "PHILLIPS PETROLEUM COMPANY",
                    "PIONEER NATURAL RESOURCES",
                    "PITCOCK",
                    "PITTS ENERGY COMPANY",
                    "POANDG OPERATING",
                    "POLARIS OPERATING LLC",
                    "PONDEROSA TX OPERATING",
                    "PRESIDIO PETROLEUM",
                    "PRIME OPERATING COMPANY",
                    "PRIMEXX OPERATING",
                    "PRODUCTION RESOURCES",
                    "PROLINE ENERGY RESOURCES",
                    "QEP ENERGY COMPANY",
                    "QUAIL CREEK OIL",
                    "QUATRO OIL AND GAS",
                    "QUICKSILVER RESOURCES",
                    "R LACY SERVICES",
                    "R2Q OPERATING",
                    "RADCO OPERATIONS",
                    "RANGE PRODUCTION COMPANY",
                    "RD OIL COMPANY",
                    "RED LINE COMPANY",
                    "RELENTLESS PERMIAN OPERATING",
                    "REMORA MANAGEMENT",
                    "REMORA OPERATING",
                    "REMUDA OPERATING COMPANY",
                    "RENEAU OIL COMPANY",
                    "REPSOL OIL & GAS USA, LLC",
                    "RHEACO OIL COMPANY",
                    "RIDGE OIL COMPANY",
                    "RIFE OIL PROPERTIES",
                    "RING ENERGY",
                    "RIVIERA OPERATING",
                    "RJD MANAGEMENT",
                    "ROBERTSON RESOURCES",
                    "ROCKCLIFF ENERGY OPERATING",
                    "ROCKER A OPERATING COMPANY",
                    "ROGERS DRILLING COMPANY",
                    "ROGERS S K OIL",
                    "ROMAC OIL COMPANY",
                    "ROSETTA RESOURCES OPERATING",
                    "ROVER PETROLEUM OPERATING",
                    "RSP PERMIAN",
                    "S AND J OPERATING COMPANY",
                    "SABINAL ENERGY OPERATING",
                    "SABINE OIL AND GAS",
                    "SABINE PRODUCTION COMPANY",
                    "SABLE PERMIAN RESOURCES LANDLLC",
                    "SAGE ENERGY COMPANY",
                    "SAGE NATURAL RESOURCES",
                    "SAMEDAN OIL",
                    "SAMSON LONE STAR",
                    "SANCHEZ ENERGY",
                    "SANDRIDGE EXPLORATION AND PRODUCTION",
                    "SARATOGA PRODUCTION COMPANY",
                    "SB STREET OPERATING",
                    "SCANDRILL COMPANY",
                    "SCHLACHTER OPERATING",
                    "SCOUT ENERGY MANAGEMENT",
                    "SEA EAGLE FORD",
                    "SEABOARD OPERATING COMPANY",
                    "SEAGULL OPERATING",
                    "SEM OPERATING COMPANY",
                    "SEVEN CROSS OPERATING",
                    "SHALLOW PRODUCTION OPER",
                    "SHARP IMAGE ENERGY",
                    "SHELL OIL COMPANY",
                    "SHERIDAN PRODUCTION CO III, LLC",
                    "SHERIDAN PRODUCTION COMPANY",
                    "SILVER CREEK OIL AND GAS",
                    "SILVERBOW RESOURCES OPER",
                    "SLANT OPERATING",
                    "SM ENERGY COMPANY",
                    "SMITH PIPE OF ABILENE",
                    "SMITH PRODUCTION",
                    "SOJOURNER DRILLING",
                    "SONAT EXPLORATION COMPANY",
                    "SOUTH SAM OPERATING COMPANY",
                    "SOUTHEASTERN RESOURCES",
                    "SOUTHWEST GAS SYSTEMS",
                    "SOUTHWEST ROYALTIES",
                    "STAMPER OPERATING",
                    "STANOLIND PRODUCTION",
                    "STASNEY WELL SERVICE",
                    "STEPHENS AND JOHNSON OPERATING COMPANY",
                    "STOUT ENERGY",
                    "STOVALL OPERATING COMPANY",
                    "STRAT LAND EXPLORATION COMPANY",
                    "STRONGHOLD ENERGY II OPER",
                    "SUEANN OPERATING LC",
                    "SULLIVAN HOLLIS R",
                    "SULPHUR RIVER EXPLORATION",
                    "SUMMIT PETROLEUM",
                    "SUN EXPLORATIONPRODUCTION COMPANY",
                    "SUNDOWN ENERGY",
                    "SUNOCO ENERGY DEVELOPMENT COMPANY",
                    "SURGE OPERATING",
                    "SWANNER PROPERTIES",
                    "TABULA RASA ENERGY",
                    "TALISMAN ENERGY",
                    "TAMARACK PETROLEUM COMPANY",
                    "TANDEM ENERGY",
                    "TANOS EXPLORATION II",
                    "TC OIL COMPANY",
                    "TEMPLAR OPERATING LLC",
                    "TENNECO OIL COMPANY",
                    "TENNECO URANIUM",
                    "TEP BARNETT",
                    "TERRA RESOURCES",
                    "TEXACO",
                    "TEXACO E AND P",
                    "TEXAS AMERICAN RESOURCES COMPANY",
                    "TEXAS ENERGY OPERATIONS LC",
                    "TEXAS OIL AND GAS",
                    "TEXAS PACIFIC OIL COMPANY",
                    "TEXAS PETROLEUM INVESTMENT COMPANY",
                    "TEXAS SECONDARY OIL",
                    "TEXASGULF",
                    "TEXLAND PETROLEUM",
                    "TEXLANDRECTOR AND SCHUMACHER",
                    "TEXXOL OPERATING COMPANY",
                    "THE ANACONDA",
                    "THE LONG TRUSTS",
                    "THE SUPERIOR OIL COMPANY",
                    "THOMPSON J CLEO",
                    "THOMPSON JOHN R OPERATING",
                    "THREE P OPERATING COGP",
                    "THREE R OIL COMPANY",
                    "THRONE PETROLEUM RESOURCES",
                    "TORRENT OIL",
                    "TREK RESOURCES",
                    "TRIC RESOURCES",
                    "TRINITY OPERATING USG",
                    "TRIVISTA OPERATING",
                    "TRIVIUM OPERATING",
                    "TXO MINERALS",
                    "TXO PRODUCTION",
                    "U S ENERGY DEVELOPMENT",
                    "U S OPERATING",
                    "UNIDENTIFIED",
                    "UNION OIL COMPANY OF CALIFORNIA",
                    "UNION PACIFIC RESOURCES COMPANY",
                    "UNION TEXAS PETROLEUM",
                    "UNIT PETROLEUM COMPANY",
                    "UNITEX OIL AND GAS",
                    "UNKNOWN",
                    "UPHAM OIL AND GAS COMPANY",
                    "UPP OPERATING LLC",
                    "URBAN OIL AND GAS GROUP",
                    "V AND H OIL",
                    "VALENCE OPERATING COMPANY",
                    "VAN OPERATING",
                    "VANCO OIL AND GAS",
                    "VANGUARD OPERATING",
                    "VANTAGE FORT WORTH ENERGY",
                    "VENADO OPERATING COMPANY",
                    "VERADO ENERGY",
                    "VERDUN OIL AND GAS",
                    "VESS OIL",
                    "VICEROY PETROLEUM",
                    "VINLAND TEXAS SERVICES LLC",
                    "VIRTEX OPERATING COMPANY",
                    "WAGNER OIL COMPANY",
                    "WALSH AND WATTS",
                    "WALSH PETROLEUM",
                    "WEATHERLY OIL AND GAS",
                    "WELDER EXPLORATION AND PRODUCTION",
                    "WESMOR DRILLING",
                    "WESTERN ENERGY GROUP",
                    "WFW PRODUCTION COMPANY",
                    "WHITE KNIGHT PRODUCTION",
                    "WHITE OAK OPERATING COMPANY",
                    "WHITE ROCK OIL AND GAS",
                    "WHITING OIL AND GAS",
                    "WILLOWBEND INVESTMENTS",
                    "WINCHESTER OIL COMPANY",
                    "WISCHKAEMPER KENNETH",
                    "WO OPERATING COMPANY",
                    "WOODBINE PRODUCTION",
                    "WPX ENERGY",
                    "WT WAGGONER ESTATE",
                    "WTG EXPLORATION",
                    "XOG OPERATING",
                    "XTO ENERGY",
                    "YOUNG MARSHALL R OIL COMPANY",

                        ];



function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

export default function FilterFormWell() {
  const classes = useStyles();
  const theme = useTheme();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const [typeName, setTypeName] = React.useState(
    stateNav.typeName ? stateNav.typeName : []
  );
  const [profileName, setProfileName] = React.useState(
    stateNav.profileName ? stateNav.profileName : []
  );
  const [statusName, setStatusName] = React.useState(
    stateNav.statusName ? stateNav.statusName : []
  );

  const [operatorName, setOperatorName] = React.useState(
    stateNav.operatorName ? stateNav.operatorName : []
  );

  const [types, setTypes] = React.useState(typesList);
  const [profiles, setProfiles] = React.useState(profileList);
  const [statuses, setStatuses] = React.useState(statusList);
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
 
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const setFilterProfile = profileNames => {
    let profileIds = [];
    profileNames.forEach(profileName => {
      profileListObjects.forEach(profileObj => {
        if (profileObj.name == profileName) {
          profileIds.push(profileObj.id);
        }
      });
    });
    let filter;
    if (profileIds.length > 0) {
      filter = ["all", ["match", ["get", "wellBoreProfileId"], profileIds, true, false]];
    } else {
      filter = null;
    }

    console.log("profile change filter", filter);
    setStateNav(stateNav => ({ ...stateNav, filterWellProfile: filter }));
  };

  const setFilterType = typeNames => {
    let typeIds = [];
    if (typeNames.length > 0) {
      typeNames.forEach(typeName => {
        typesListObjects.forEach(typeObj => {
          if (typeObj.name == typeName) {
            typeIds.push(typeObj.id);
          }
        });
      });
    }

    let filter;
    if (typeIds.length > 0) {
      filter = ["all",["match", ["get", "wellTypeId"], typeIds, true, false]];
    } else {
      filter = null;
    }

    console.log("type change filter", filter);
    setStateNav(stateNav => ({ ...stateNav, filterWellType: filter }));
  };

  const setFilterStatus = statusNames => {
    let statusIds = [];
    statusNames.forEach(statusName => {
      statusListObjects.forEach(statusObj => {
        if (statusObj.name == statusName) {
          statusIds.push(statusObj.id);
        }
      });
    });
    let filter;
    if (statusIds.length > 0) {
      filter = ["all",["match", ["get", "wellStatusId"], statusIds, true, false]];
    } else {
      filter = null;
    }

    console.log("status change filter", filter);
    setStateNav(stateNav => ({ ...stateNav, filterWellStatus: filter }));
  };

  const handleChangeStatus = event => {
    setStatusName(event.target.value);
    setFilterStatus(event.target.value);
    setStateNav(stateNav => ({ ...stateNav, statusName: event.target.value }));
  };

  const handleChangeType = event => {
    setTypeName(event.target.value);
    setFilterType(event.target.value);
    setStateNav(stateNav => ({ ...stateNav, typeName: event.target.value }));

 
  };

  const handleChangeProfile = event => {
    //console.log(event.target.value);
    setProfileName(event.target.value);
    setStateNav(stateNav => ({ ...stateNav, profileName: event.target.value }));
    setFilterProfile(event.target.value);
  };

  const deleteChipTypeName = value => () => {
    const removeChips = typeName.filter(chip => chip !== value);
    setStateNav(stateNav => ({ ...stateNav, typeName: removeChips }));
    setFilterType(removeChips);
    setTypeName(removeChips);

    if(value==undefined){
      console.log('zero')
    }


  };

  const deleteChipProfileName = value => () => {
    const removeChips = profileName.filter(chip => chip !== value);
    setProfileName(removeChips);
    setFilterProfile(removeChips);
    setStateNav(stateNav => ({ ...stateNav, profileName: removeChips }));
  };

  const deleteChipStatus = value => () => {
    const removeChips = statusName.filter(chip => chip !== value);
    setStatusName(removeChips);
    setFilterStatus(removeChips);
    setStateNav(stateNav => ({ ...stateNav, statusName: removeChips }));
  };


  const handleOperatorChange = value => {
    let filter;
    if(value && value.length) {
     filter = ['match', ['get', 'operator'], value, true, false]
     setStateNav(stateNav => ({ ...stateNav, operatorName:value}))
     setOperatorName(value)
    }
    else {
     filter = null
     setStateNav(stateNav => ({ ...stateNav, operatorName: null}))
    }
    setStateNav(stateNav => ({ ...stateNav, filterOperator: filter}))
   };






  return (
    <div className={classes.row}>
      <div className={classes.root}>

        <FormControl className={classes.formControl}>
          <OperatorFilterJ />
        </FormControl>

        <FormControl className={classes.formControl}>
          <OperatorAutoComplete />
        </FormControl>


        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} htmlFor="select-multiple-chip1">
            Well Type
          </InputLabel>
          <Select
            variant="outlined"
            multiple={true}
            labelWidth={labelWidth}
            value={typeName}
            onChange={handleChangeType}
 
            renderValue={selected => (
              <div
                className={classes.chips}
                onMouseDown={event => {
                  event.preventDefault()
                  event.stopPropagation();
                  }}
                                >
                {selected.map(value => (
                  <Chip
                    onDelete={deleteChipTypeName(value)}
                    key={value}
                    label={value}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          > 
            {types.map(type => (
              <MenuItem
                key={type}
                value={type}
                style={{ transformOrigin:'bottom' ? 'center top' : 'center bottom' }}
              >
                <Checkbox checked={typeName.indexOf(type) > -1} />
                <ListItemText primary={type} />
              </MenuItem>
              
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} htmlFor="select-multiple-chip-profile">
            Well Profile
          </InputLabel>
          <Select
            variant="outlined"
            multiple
            labelWidth={labelWidth}
            value={profileName}
            onChange={handleChangeProfile}
            
            renderValue={selected => (
              <div
                className={classes.chips}
                onMouseDown={event => {
                  event.preventDefault()
                  event.stopPropagation();
                  }}
              >
                {selected.map(value => (
                  <Chip
                    onDelete={deleteChipProfileName(value)}
                    key={value}
                    label={value}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {profiles.map(profile => (
              <MenuItem
                key={profile}
                value={profile}
                style={getStyles(profile, profileName, theme)}
              >
                <Checkbox checked={profileName.indexOf(profile) > -1} />
                <ListItemText primary={profile} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} htmlFor="select-multiple-chip-status">
            Well Status
          </InputLabel>
          <Select
            multiple
            variant="outlined"
            labelWidth={labelWidth}
            value={statusName}
            onChange={handleChangeStatus}
            renderValue={selected => (
              <div
                className={classes.chips}
                onMouseDown={event => {
                  event.preventDefault()
                  event.stopPropagation();
                  }}
              >
                {selected.map(value => (
                  <Chip
                    onDelete={deleteChipStatus(value)}
                    key={value}
                    label={value}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {statuses.map(status => (
              <MenuItem
                key={status}
                value={status}
                style={getStyles(status, statusName, theme)}
              >
                <Checkbox checked={statusName.indexOf(status) > -1} />
                <ListItemText primary={status} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      
     <div className={classes.datesRow}>
        <FilterDatePickerPermit labelDates={"Permit"} />
        <FilterDatePickerSpud labelDates={"Spud"} />
        <FilterDatePickerCompletetion labelDates={"Completetion"} />
        <FilterDatePickerFirstProd labelDates={"First Production"} />
      </div> 
      

    </div>
  );
}
