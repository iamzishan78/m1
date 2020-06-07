import React, {useContext, useEffect} from 'react';
import { AppContext } from "../../AppContext";
/// test filters
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
//// end of test filters
export default function DefaultFiltersTest() {
    const [stateApp, setStateApp] = useContext(AppContext);

    useEffect(() => {
      // funtion to set the filters up
      const setFilters = () => {
          // local none state variables
          let filters = [];
          let updateFilters;
          let filtersOnOffObj= {};
          let filtersDefaultsOnOffObj = {};
          let saved;
          if (stateApp.filtersMockDb) {
            // stateApp.filtersMockDb is where we store new filtes array modified
            // in filterDefault file updates delete & updated
            saved = stateApp.filtersMockDb;
          }
          if (stateApp.filtersAdd) {
            //when a new filter combo is saved stateApp.filtersAdd is where its stored
            // we add it to the filters array 
            let newFilter = stateApp.filtersAdd;
            filters.push(newFilter)
          }
          // check if save exsist other wise add test filters
          saved && saved.length > 0 ? updateFilters = saved : filters.push(test1,test2,test3);
          // loop below takes the lenght of the filters array and creates 
          // 2 object with the name and false value to creat the state in 
          // filter default for the filter list display checkbox and switch
          for (let index = 0; index < filters.length; index++) {
            const element = filters[index];
            let formatElement = element[0].name.split(" ").join("")
            filtersOnOffObj[formatElement] =  false;
            filtersDefaultsOnOffObj[formatElement] =  false;
          }
          // condition to see what to pass as an update to the filters in state nav context
          if (updateFilters && updateFilters.length > 0) {
            setStateApp((state) => ({
              ...state,
              filters:  updateFilters ,
              filtersOnOff: filtersOnOffObj,
              filtersDefaultOnoff: filtersDefaultsOnOffObj
              }))
          } else {
            setStateApp((state) => ({
              ...state,
              filters:  filters ,
              filtersOnOff: filtersOnOffObj,
              filtersDefaultOnoff: filtersDefaultsOnOffObj
              }))
          }
      }
      // flag to run the function 
      if (stateApp.user.authToken) {
        setFilters()
      }
      // Do not include setStateApp in the dependency array it will break
    },[stateApp.filtersAdd, stateApp.filtersMockDb, stateApp.user.authToken])

  return (
    /// empty div rendered on the map so it triggers the useEffect above
  <div></div>
  )

}