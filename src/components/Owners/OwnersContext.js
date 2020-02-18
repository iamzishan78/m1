import React, { useState, createContext } from 'react'
const OwnersContext = createContext([{}, () => {}])


const columns = [
  {
   name: "Name",
   label: "Name",
   options: {
    filter: true,
    sort: true,
   }
  },
  {
   name: "OwnerType",
   label: "Entity",
   options: {
    filter: true,
    sort: false,
   }
  },
  {
   name: "OwnershipType",
   label: "Type",
   options: {
    filter: true,
    sort: true,
   }
  },
  {
   name: "OwnershipPercentage",
   label: "Interest",
   options: {
    filter: true,
    sort: false,
   }
  },
  {
    name: "AppraisedValue",
    label: "Value",
    options: {
     filter: true,
     sort: false,
    }
   },
   {
    name: "Address",
    label: "Address",
    options: {
     filter: true,
     sort: false,
    }
   },
   {
    name: "Phone",
    label: "Phone",
    options: {
     filter: true,
     sort: false,
    }
   },
   {
    name: "Email",
    label: "Email",
    options: {
     filter: true,
     sort: false,
    }
   },
   {
    name: "Tags",
    label: "Tags",
    options: {
     filter: true,
     sort: false,
    }
   },
   {
    name: "IsTracked",
    label: "Track",
    options: {
     filter: true,
     sort: false,
    }
   }
 ]


const OwnersContextProvider = props => {
  const [stateOwners, setStateOwners] = useState({
    selectedOwner: { Name: '' },
    openOwnerDetails: false,
    wellOwners:null,
    columns:columns,
    ownerToAdd:null

  })
  return (
    <OwnersContext.Provider value={[stateOwners, setStateOwners]}>
      {props.children}
    </OwnersContext.Provider>
  )
}

export { OwnersContext, OwnersContextProvider }


/* const ownerTable = {
  columns: [
    {
     name: "name",
     label: "Name",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "title",
     label: "Title",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "location",
     label: "Location",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "age",
     label: "Age",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
      name: "salary",
      label: "Salary",
      options: {
       filter: true,
       sort: false,
      }
     }
   ],
  data: [
    ["Gabby George", "Business Analyst", "Minneapolis", 30, "$100,000"],
    ["Aiden Lloyd", "Business Consultant", "Dallas", 55, "$200,000"],
    ["Jaden Collins", "Attorney", "Santa Ana", 27, "$500,000"],
    ["Franky Rees", "Business Analyst", "St. Petersburg", 22, "$50,000"],
    ["Aaren Rose", "Business Consultant", "Toledo", 28, "$75,000"],
    [
      "Blake Duncan",
      "Business Management Analyst",
      "San Diego",
      65,
      "$94,000"
    ],
    ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, "$210,000"],
    ["Lane Wilson", "Commercial Specialist", "Omaha", 19, "$65,000"],
    ["Robin Duncan", "Business Analyst", "Los Angeles", 20, "$77,000"],
    ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, "$135,000"],
    ["Harper White", "Attorney", "Pittsburgh", 52, "$420,000"],
    ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, "$150,000"],
    ["Frankie Long", "Industrial Analyst", "Austin", 31, "$170,000"],
    ["Brynn Robbins", "Business Analyst", "Norfolk", 22, "$90,000"],
    ["Justice Mann", "Business Consultant", "Chicago", 24, "$133,000"],
    ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, "$200,000"],
    ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, "$400,000"],
    ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, "$110,000"],
    ["Danny Leon", "Computer Scientist", "Newark", 60, "$220,000"],
    ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, "$180,000"],
    ["Jesse Hall", "Business Analyst", "Baltimore", 44, "$99,000"],
    ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, "$90,000"],
    ["Terry Macdonald", "Commercial Specialist", "Miami", 39, "$140,000"],
    ["Justice Mccarthy", "Attorney", "Tucson", 26, "$330,000"],
    ["Silver Carey", "Computer Scientist", "Memphis", 47, "$250,000"],
    ["Franky Miles", "Industrial Analyst", "Buffalo", 49, "$190,000"],
    ["Glen Nixon", "Corporate Counselor", "Arlington", 44, "$80,000"],
    ["Mason Ray", "Computer Scientist", "San Francisco", 39, "$142,000"]
  ]
} */

//const owners = JSON.parse("[{\"Id\":\"ed8e313a-12c0-467d-8980-240ba7f5a343\",\"Name\":\"LARMON JIM S\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":190.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"a2046eea-3385-4855-9f59-bc8f56b368b9\",\"Name\":\"WHITESIDE SCHOLARSHIP\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":30.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"cbc0e278-d447-41ec-af65-b7f1c4ad285a\",\"Name\":\"WHITESIDE MURIEL CHARITABLE TR\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":20.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"3f6cfef3-a86e-4fd2-87b5-beb3df572944\",\"Name\":\"WHITESIDE JAMES E\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":30.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"be3cf943-1ffb-4959-976a-42f5d4badbde\",\"Name\":\"WHITESIDE DREW D\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":20.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"07c9defa-43e8-42fc-9c7c-7a1a5e78382b\",\"Name\":\"WALKER ALICE WHITFIELD\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":10.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"e9778641-2cb8-4dae-a08f-1b8b0f42ddc1\",\"Name\":\"WAIKIKI PARTNERS LP\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":10.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"cf88fc35-a778-4ba1-ba47-05d5188b9bb5\",\"Name\":\"UNKNOWN - C ROSE OIL CORP\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":30.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"60ffbabe-df42-48a0-a5d1-78027e9842d3\",\"Name\":\"SPENCER ROBERT L\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":10.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"1be56ff8-7712-4a0c-a5e4-a34b2f7abc35\",\"Name\":\"MAS OPERATING COMPANY\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":5940.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"328297c5-514d-4d21-8b29-3f7b7946616f\",\"Name\":\"NOLTE RUTH E\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":10.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"d0448b83-c990-4c95-afaf-5d57b9117b18\",\"Name\":\"OAK VALLEY MINERAL AND LAND LP\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":500.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"c1c73f70-95d4-43cd-8990-e6f650626d11\",\"Name\":\"PENN BROTHERS INC\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":80.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"db60c854-aae7-43ab-b31a-4d1c112626c3\",\"Name\":\"PERKINS KEN OIL & GAS INC\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":170.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"9292e48d-478b-477c-8079-a88b5ce137d9\",\"Name\":\"PETCO LTD\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":80.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"155210ee-bf12-4630-919b-2cb9c6e2b310\",\"Name\":\"OXY USA WTP LP\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":620.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"2b9ec43e-e48c-4367-a408-ef2e05c7ccb2\",\"Name\":\"MARION JOAN 1982 TRUST\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":50.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"7888a9e6-83e9-4766-8bb3-d7f37568d1d3\",\"Name\":\"KOEHN DWAYNE\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":10.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"e8bb7d34-2dab-4397-8114-72ae3765054a\",\"Name\":\"JENKINS JAMES MATTHEW SEP PROP\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":40.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"bdef1c09-ff2d-4008-87bf-c8484aae13ce\",\"Name\":\"JENKINS BENNY MAY SEP PROP\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":40.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"e2b6913b-1fc4-431c-b915-e418ecb57581\",\"Name\":\"HUBBARD WARDIE LECK\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":130.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"c2da1722-12d1-4a55-9e59-b921b7ab0a92\",\"Name\":\"HEALEY BURKE TRUST\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":30.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"6e42d250-8d68-47fd-bd30-482e9356dd83\",\"Name\":\"HEALEY BAREN ENERGY LLC\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":30.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"c260eb4e-3eb3-4da0-94c2-7f0013282afe\",\"Name\":\"HARLOW RUSSELL L\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":1240.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"4ebadcee-11ab-4a31-8fdd-9f428a135581\",\"Name\":\"HACKER LEANNE JENKINS SEP PROP\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":40.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"0b85b024-c1b0-4c61-aa92-33281ca431c3\",\"Name\":\"GIBSON MICHAEL A TRUST\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":10.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"2ee872d0-3312-45fe-b0c5-b7a8c1403e5c\",\"Name\":\"FLACKMAN DAVID J\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":10.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"abb8265f-a611-436a-9cbb-3fedcf1109bd\",\"Name\":\"ENERLEX INC\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":100.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"975f9ed0-52b6-493f-b9ba-c874a27f716f\",\"Name\":\"DAN MAR WELL SERVICING INC\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":500.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"7040e9cf-f6e9-404e-88c0-2cb5efdf0171\",\"Name\":\"CONCORD INVESTMENTS\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":80.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"06564766-0eb4-4299-a3e0-1079e6da7e68\",\"Name\":\"CLARK MARY RAMSEY\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":50.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"5f995311-a51a-46f2-b289-fea0eddafa08\",\"Name\":\"BROWN ROBERTA W\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":10.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"eaf4b2f9-e817-4eca-92e0-321f44d20477\",\"Name\":\"BRIGGS OIL INC\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":50.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"0d36f874-d510-4a89-b995-fe739d877d7c\",\"Name\":\"BLACK STONE MINERALS\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":160.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"0cbcc13e-5a5b-4464-a108-4037809edea5\",\"Name\":\"BENTLEY LORA\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":10.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"2238c9c2-69bc-4bbf-9a67-0ae93819e1f8\",\"Name\":\"ATHENA PENSON MINERALS LTD\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":110.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"95566ddb-260a-442e-a6a0-a7a0a42f7960\",\"Name\":\"ARTEMIS INVESTMENTS\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":50.00,\"IsTracked\":false,\"Tags\":[]},{\"Id\":\"2d2c6247-07f0-4a4f-a9d0-a8baaf775abc\",\"Name\":\"ANADARKO E & P ONSHORE LLC\",\"OwnerType\":null,\"ContactDetails\":null,\"OwnershipType\":null,\"OwnershipPercentage\":0.0000000000,\"AppraisedValue\":130.00,\"IsTracked\":false,\"Tags\":[]}]")
//console.log(owners)