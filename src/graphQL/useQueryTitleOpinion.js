import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

export default function useQueryTitleOpinion(id) {
//   export const TITLEOPINIONQUERY = gql`
//   query getTitleOpinion($id: ID) {
//     titleOpinion(id: $id) {
//       legalDescription
//       preparedBy
//       certifiedDate
//       state
//       county
//       project
//       client
//       generalNotes
//       MORSections
//     }
//   }
// `;

  //////////////////temporary begin//////////////////////////////////////
  const data = {
    titleOpinion: {
      legalDescription: "N2SW4 and SESW4 of Section 8 T-17-S, R-35-E",
      preparedBy: "Lawrence Smith",
      certifiedDate: "07-21-2017",
      state: "NEW MEXICO",
      county: "LEA",
      project: "Project1",
      client: "Tap Rock Resources, LLC",
      generalNotes: `Note 1: Subject lands are HBP at all depths by the New Mexico NN State Com #001, API #30-025-24281, spud 11/5/1972, completed 3/2/1973 on an 80 acre spaced unit  comprised of the N2SW4 of Section 8, T-17-S, R35-E. Production is from the Morrow Formation at 12.425' TVD. Per NMOCD, the well is shown as "Active" with last production on 5/1/2017.`,
      MORSections: [
        {
          name: "Mineral Ownership",
          columns: [
            {
              key: "id0",
              name: "Owner Name",
              editable: true,
              resizable: true,
              width: 132
            },
            {
              key: "id1",
              name: "Owner Address",
              editable: true,
              resizable: true,
              width: 153
            },
            {
              key: "id2",
              name: "Net Acres",
              editable: true,
              resizable: true,
              width: 109
            },
            {
              key: "id3",
              name: "Surface Interest",
              editable: true,
              resizable: true,
              width: 155
            },
            {
              key: "id4",
              name: "Mineral Interest",
              editable: true,
              resizable: true,
              width: 153
            },
            {
              key: "id5",
              name: "Royalty Interest",
              editable: true,
              resizable: true,
              width: 155
            },
            {
              key: "id6",
              name: "ORRI",
              editable: true,
              resizable: true,
              width: 74
            },
            {
              key: "id7",
              name: "Record Title",
              editable: true,
              resizable: true,
              width: 127
            },
            {
              key: "id8",
              name: "Operating Rights",
              editable: true,
              resizable: true,
              width: 164
            },
            {
              key: "id9",
              name: "NRI",
              editable: true,
              resizable: true,
              width: 62
            },
            {
              key: "id10",
              name: "Status Leasee/ Optionee Filed At Exp DAte or HBP Royalty",
              editable: true,
              resizable: true,
              width: 480
            }
          ],
          rows: [
            {
              id0: "State of New Mexico",
              id1: "310 Old Santa Fe Trail, NM 87502",
              id2: "120",
              id3: "N/A",
              id4: "1.00000000",
              id5: "0.16666667",
              id6: "N/a",
              id7: "0.00000000",
              id8: "N/A",
              id9: "N/A",
              id10:
                "Lessee: Asher Enterprises Ltd Co. Recording Info: VO 6794 Primary Term: 5 Years Royalty: 1/6"
            },
            {
              id0: "",
              id1: "",
              id2: "",
              id3: "",
              id4: "",
              id5: "",
              id6: "",
              id7: "",
              id8: "",
              id9: "",
              id10: ""
            },
            {
              id0: "",
              id1: "",
              id2: "",
              id3: "",
              id4: "",
              id5: "",
              id6: "",
              id7: "",
              id8: "",
              id9: "",
              id10: ""
            }
          ]
        },
        {
          name:
            "Leasehold Ownership - From Surface Down to but not Including 12,014’",
          columns: [
            {
              key: "id0",
              name: "Owner Name",
              editable: true,
              resizable: true,
              width: 132
            },
            {
              key: "id1",
              name: "Owner Address",
              editable: true,
              resizable: true,
              width: 153
            },
            {
              key: "id2",
              name: "Net Acres",
              editable: true,
              resizable: true,
              width: 109
            },
            {
              key: "id3",
              name: "Surface Interest",
              editable: true,
              resizable: true,
              width: 155
            },
            {
              key: "id4",
              name: "Mineral Interest",
              editable: true,
              resizable: true,
              width: 153
            },
            {
              key: "id5",
              name: "Royalty Interest",
              editable: true,
              resizable: true,
              width: 155
            },
            {
              key: "id6",
              name: "ORRI",
              editable: true,
              resizable: true,
              width: 74
            },
            {
              key: "id7",
              name: "Record Title",
              editable: true,
              resizable: true,
              width: 127
            },
            {
              key: "id8",
              name: "Operating Rights",
              editable: true,
              resizable: true,
              width: 164
            },
            {
              key: "id9",
              name: "NRI",
              editable: true,
              resizable: true,
              width: 62
            },
            {
              key: "id10",
              name: "Status Leasee/ Optionee Filed At Exp DAte or HBP Royalty",
              editable: true,
              resizable: true,
              width: 480
            }
          ],
          rows: [
            {
              id0: "Mewbourne Oil Company",
              id1: "P.O. Box 7698 Tyler, Texas 75711",
              id2: "120",
              id3: "N/A",
              id4: "N/A",
              id5: "N/A",
              id6: "N/a",
              id7: "1.00000000",
              id8: "0.53500000",
              id9: "N/A",
              id10: "Per Stipulation of Interest found at 1676/587"
            },
            {
              id0: "",
              id1: "",
              id2: "",
              id3: "",
              id4: "",
              id5: "",
              id6: "",
              id7: "",
              id8: "",
              id9: "",
              id10: ""
            },
            {
              id0: "",
              id1: "",
              id2: "",
              id3: "",
              id4: "",
              id5: "",
              id6: "",
              id7: "",
              id8: "",
              id9: "",
              id10: ""
            }
          ]
        }
      ],
      runsheetSections: [
        {
          name: "Limited Title Runsheet",
          columns: [
            { key: "id0", name: "Doc #", editable: true, resizable: true },
            {
              key: "id1",
              name: "Instrument Type",
              editable: true,
              resizable: true
            },
            {
              key: "id2",
              name: "Party of the First Part (Grantor)",
              editable: true,
              resizable: true
            },
            {
              key: "id3",
              name: "Party of the Second Part (Grantee)",
              editable: true,
              resizable: true
            },
            {
              key: "id4",
              name: "Remainderman/ Life Estate",
              editable: true,
              resizable: true
            },
            {
              key: "id5",
              name: "Effective Date",
              editable: true,
              resizable: true
            },
            {
              key: "id6",
              name: "Instrument Date",
              editable: true,
              resizable: true
            },
            { key: "id7", name: "File Date", editable: true, resizable: true },
            {
              key: "id8",
              name: "Record Type",
              editable: true,
              resizable: true
            },
            { key: "id9", name: "Volume", editable: true, resizable: true },
            { key: "id10", name: "Page", editable: true, resizable: true },
            {
              key: "id11",
              name: "Legal Description (All Tracts Affected)",
              editable: true,
              resizable: true
            },
            {
              key: "id12",
              name: "Mineral Acres Reserved",
              editable: true,
              resizable: true
            },
            {
              key: "id13",
              name: "Mineral Acres Conveyed",
              editable: true,
              resizable: true
            },
            {
              key: "id14",
              name: "Abstractor's Notes",
              editable: true,
              resizable: true
            },
            { key: "id15", name: "Documents", editable: true, resizable: true }
          ],
          rows: [
            {
              id0: "1",
              id1: "Oil and Gas Lease",
              id2: "State of New Mexico",
              id3: "Asher Enterprises LTD Co.",
              id4: "",
              id5: "02/01/2003",
              id6: "02/01/2003",
              id7: "N/A",
              id8: "BLM Records",
              id9: "",
              id10: "",
              id11: "NW/4 & N/2 SW/4 of 21-18S-29E",
              id12: "0",
              id13: "120",
              id14: "5 Years; 1/6th Royalty - VO 6794",
              id15: ""
            },
            {
              id0: "2",
              id1: "Assignment and Bill of Sale",
              id2: "Newfield Exploration Mid-Continent,Inc",
              id3: "Asher Enterprises",
              id4: "",
              id5: "02/13/2003",
              id6: "02/13/2003",
              id7: "03/07/2003",
              id8: "Official Public Records",
              id9: "1209",
              id10: "815",
              id11: "1980' FSL and 660' FWL of Section 8, T17S, R35E",
              id12: "0",
              id13: "0",
              id14: `Conveys wellbore on the New Mexico "NN" State No. 1 Well (no longer producing)`,
              id15: ""
            },
            {
              id0: "",
              id1: "",
              id2: "",
              id3: "",
              id4: "",
              id5: "",
              id6: "",
              id7: "",
              id8: "",
              id9: "",
              id10: "",
              id11: "",
              id12: "",
              id13: "",
              id14: "",
              id15: ""
            },
            {
              id0: "",
              id1: "",
              id2: "",
              id3: "",
              id4: "",
              id5: "",
              id6: "",
              id7: "",
              id8: "",
              id9: "",
              id10: "",
              id11: "",
              id12: "",
              id13: "",
              id14: "",
              id15: ""
            },
            {
              id0: "",
              id1: "",
              id2: "",
              id3: "",
              id4: "",
              id5: "",
              id6: "",
              id7: "",
              id8: "",
              id9: "",
              id10: "",
              id11: "",
              id12: "",
              id13: "",
              id14: "",
              id15: ""
            }
          ]
        }
      ],
      feature: {
        id: "040907ea2926a135093a5c975add6d8c",
        type: "Feature",
        properties: {
          sdType: "",
          projectName: "",
          sdNotes: "",
          shapeArea: "5432.78 acres",
          shapeCenter: [-99.85684080014539, 28.4063135189325],
          shapeLabel: "",
          shapeLabelLayer: ""
        },
        geometry: {
          coordinates: [
            [
              [-99.88658957251833, 28.412445382111727],
              [-99.86750545439195, 28.424293198307936],
              [-99.87760881104705, 28.447820345655472],
              [-99.86282797445922, 28.453248944323818],
              [-99.85272461780413, 28.432684599271724],
              [-99.85627950255348, 28.43054567789264],
              [-99.82709202777244, 28.395658706904868],
              [-99.85721499853977, 28.376564746559552],
              [-99.88658957251833, 28.412445382111727]
            ]
          ],
          type: "Polygon"
        }
      }
    }
  };
  return { data, loading: false };

  //////////////////temporary end//////////////////////////////////////
  
}
