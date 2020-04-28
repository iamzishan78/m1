import React, {useContext, useEffect} from 'react';
import { AppContext } from "../../AppContext";

let defaultTypeName = ["GAS", "OIL"];
let defaultStatusName = ["ACTIVE", "PERMIT"];
let defaultTypeName2 = ["OIL"];
let defaultStatusName2 = ["ACTIVE", "PERMIT"];
let defaultTypeName3 = ["GAS"];
let defaultStatusName3 = ["ACTIVE", "PERMIT"];
let defaultFiltersWellStatus = [
  "match",
  ["get", "wellStatus"],
  defaultStatusName,
  true,
  false,
];
let defaultFiltersWellType = [
  "match",
  ["get", "wellType"],
  defaultTypeName,
  true,
  false,
];
let defaultFiltersWellStatus2 = [
    "match",
    ["get", "wellStatus"],
    defaultStatusName2,
    true,
    false,
  ];
  let defaultFiltersWellType2 = [
    "match",
    ["get", "wellType"],
    defaultTypeName2,
    true,
    false,
  ];
  let defaultFiltersWellStatus3 = [
    "match",
    ["get", "wellStatus"],
    defaultStatusName3,
    true,
    false,
  ];
  let defaultFiltersWellType3 = [
    "match",
    ["get", "wellType"],
    defaultTypeName3,
    true,
    false,
  ];
const test1 = [
  {
    name: "Test 1 Default Filters",
    filters: [defaultFiltersWellStatus, defaultFiltersWellType],
    on: false,
    default: false,
  },
];

const test2 = [
    {
      name: "Test 2  Default Filters",
      filters: [defaultFiltersWellStatus2, defaultFiltersWellType2],
      on: false,
      default: false,
    },
];

const test3 = [
    {
      name: "Test 3 Default Filters",
      filters: [defaultFiltersWellStatus3, defaultFiltersWellType3],
      on: false,
      default: false,
    },
];

export default function DefaultFiltersTest() {
    const [stateApp, setStateApp] = useContext(AppContext);

    useEffect(() => {
      const setFilters = () => {
        const filters = [];
        filters.push(test1, test2, test3)
        console.log("heoajfae")
        setStateApp((state) => ({
        ...state,
        filters:  filters ,
        })) 
      }
      if (stateApp.user.authToken) {
        setFilters()
      }
    },[setStateApp, stateApp.user])
   
  return (
  <div></div>
  )

}