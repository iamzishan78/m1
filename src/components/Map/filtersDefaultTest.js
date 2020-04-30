import React, {useContext, useEffect} from 'react';
import { AppContext } from "../../AppContext";

let defaultTypeName = ["typeName",["OIL AND GAS", "OIL"]];
let defaultStatusName = ["statusName",["ACTIVE", "PERMIT"]];
let defaultTypeName2 = ["typeName",["OIL", "GAS"]];
let defaultStatusName2 = ["statusName",["PERMIT"]];;
let defaultTypeName3 = ["typeName",["GAS"]];
let defaultStatusName3 = ["statusName",["ACTIVE"]];

let defaultFiltersWellStatus = ["filterWellStatus",[
  "match",
  ["get", "wellStatus"],
  defaultStatusName[1],
  true,
  false,
]]
let defaultFiltersWellType = ["filterWellType",[
  "match",
  ["get", "wellType"],
  defaultTypeName[1],
  true,
  false,
]];
let defaultFiltersWellStatus2 = ["filterWellStatus",[
  "match",
  ["get", "wellStatus"],
  defaultStatusName2[1],
  true,
  false,
]]
  let defaultFiltersWellType2 = ["filterWellType",[
    "match",
    ["get", "wellType"],
    defaultTypeName2[1],
    true,
    false,
  ]];
  let defaultFiltersWellStatus3 = ["filterWellStatus",[
    "match",
    ["get", "wellStatus"],
    defaultStatusName3[1],
    true,
    false,
  ]]
  let defaultFiltersWellType3 = ["filterWellType",[
    "match",
    ["get", "wellType"],
    defaultTypeName3[1],
    true,
    false,
  ]];
const test1 = [
  {
    name: "Test 1 Default Filters",
    filters: [defaultFiltersWellStatus, defaultFiltersWellType],
    types:[defaultTypeName, defaultStatusName],
    on: false,
    default: false,
  },
];

const test2 = [
    {
      name: "Test 2  Default Filters",
      filters: [defaultFiltersWellStatus2, defaultFiltersWellType2],
      types:[defaultTypeName2, defaultStatusName2],
      on: false,
      default: false,
    },
];

const test3 = [
    {
      name: "Test 3 Default Filters",
      filters: [defaultFiltersWellStatus3, defaultFiltersWellType3],
      types:[defaultTypeName3, defaultStatusName3],
      on: false,
      default: false,
    },
];

export default function DefaultFiltersTest() {
    const [stateApp, setStateApp] = useContext(AppContext);

    useEffect(() => {
      const setFilters = () => {
          let filters = [];
          let filtersOnOffObj= {};
          let filtersDefaultsOnOffObj = {};

          if (stateApp.filtersMockDb) {
            let saved = stateApp.filtersMockDb;
            filters.push(saved)
          }
          filters.push(test1,test2,test3)
          for (let index = 0; index < filters.length; index++) {
            const element = filters[index];
            let formatElement = element[0].name.split(" ").join("")
            filtersOnOffObj[formatElement] =  false;
            filtersDefaultsOnOffObj[formatElement] =  false;
          }
          setStateApp((state) => ({
          ...state,
          filters:  filters ,
          filtersOnOff: filtersOnOffObj,
          filtersDefaultOnoff: filtersDefaultsOnOffObj
          }))
      }
      if (stateApp.user.authToken) {
        setFilters()
      }
    },[stateApp.filtersMockDb, stateApp.user.authToken])

  return (
  <div></div>
  )

}