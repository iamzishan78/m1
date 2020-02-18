import React, { useState, createContext } from 'react'
const WellsContext = createContext([{}, () => {}])

const wellTable = {
  columns: [
    {
     name: "API",
     label: "API",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "WellName",
     label: "Well",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "Operator",
     label: "Operator",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "WellType",
     label: "Type",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
      name: "WellBoreProfile",
      label: "Profile",
      options: {
       filter: true,
       sort: false,
      }
     }
   ],
  data: [
    {"OwnershipTypeTrusts":true,
    "LastSixMonthGas":12190,
    "LastMonthOil":0,
    "WellStatusId":"3ac3bad5-8c35-40e3-a266-c6af3630ee3e",
    "OwnerCount":12,
    "LeaseId":"246945",
    "State":"TX",
    "StateWellId":"",
    "WellTypeId":"58a67831-5573-49a4-afd7-1010d0b5f194",
    "BOETotal":78485.6664543301,
    "OwnershipTypeEducationalInstitutions":false,
    "InterestTypeWorkingInterest":true,
    "InterestTypeProductionPayment":false,
    "WellBoreProfile":"Horizontal",
    "LastMonthWater":0,
    "FirstSixMonthWater":0,
    "WellBoreProfileId":"e9a9a604-08e2-412e-9a0a-53cb24eae5ca",
    "LastMonthGas":2102,
    "WellType":"Gas",
    "WellName":"DUKE 7H",
    "FirstTwelveMonthGas":124294,
    "Longitude":-97.19769,
    "Basin":"",
    "OwnershipTypeNonProfits":false,
    "DateCataloged":"2019-04-07T17:29:23",
    "CompletionDate":"2008-12-07T00:00:00",
    "WellStatus":"Active",
    "HasLine":true,
    "LastSixMonthWater":0,
    "OwnershipTypeIndividuals":true,
    "OwnershipTypeUnknown":false,
    "Play":"",
    "PermitDate":"2008-05-29T00:00:00",
    "OwnershipTypeReligiousInstitutions":false,
    "FirstMonthOil":0,
    "Abstract":"OWEN, C B",
    "InterestTypeOverrideRoyalty":true,
    "LastTwelveMonthBOE":4131.5,
    "FirstThreeMonthOil":0,
    "SpudDate":"2008-09-28T00:00:00",
    "InterestTypeRoyaltyInterest":true,
    "Latitude":31.98408,
    "HasOwner":true,
    "OwnershipTypeCorporations":true,
    "LastTwelveMonthOil":0,
    "OwnershipTypeGovernmentalBodies":false,
    "FirstTwelveMonthOil":0,
    "CumulativeOil":0,
    "API":"4221730625",
    "CumulativeWater":0,
    "FirstSixMonthGas":83593,
    "LastSixMonthOil":0,
    "County":"HILL",
    "FirstMonthGas":17999,
    "LastTwelveMonthGas":24789,
    "FirstTwelveMonthWater":0,
    "Id":"2cd5bf38-6217-4fea-b627-6265f6a6c170",
    "Survey":"A-693",
    "FirstThreeMonthGas":50693,
    "FirstSixMonthOil":0,
    "LastTwelveMonthWater":0,
    "CumulativeGas":470914,
    "FirstThreeMonthWater":0,
    "FirstMonthWater":0,
    "Operator":"BLUESTONE NATURAL RES II"
  }]
}

const WellsContextProvider = props => {
  const [stateWells, setStateWells] = useState({
    selectedWell: { Name: '' },
    openWellCardDetails: false,
    wellTable:wellTable
  })
  return (
    <WellsContext.Provider value={[stateWells, setStateWells]}>
      {props.children}
    </WellsContext.Provider>
  )
}

export { WellsContext, WellsContextProvider }
