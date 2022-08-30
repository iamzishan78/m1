import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { debounce, get } from "lodash";

import { useLazyQuery, useMutation } from "@apollo/client";
import { makeStyles, withStyles } from "@material-ui/styles";
import { Typography, IconButton, Tabs, Tab, Button, Menu, MenuItem, ListItemIcon, ListItemText, Dialog } from "@material-ui/core";
import {
  DescriptionOutlined as DocumentIcon,
  InfoOutlined as InfoOutlinedIcon,
  MoreHoriz as MoreHorizIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

import { UPSERT_USER_DESCRIPTOR } from "graphQL/useMutationUserDescriptor";
import { UPDATE_PROPERTY } from "graphQL/useMutationUpdateProperty";
import { IFARECONTACTS } from "graphQL/useQueryIfOwnersAreContacts";
import { GET_PROPERTY } from "graphQL/useQueryGetProperty";
import { AppContext } from "AppContext";
import { GET_ASSOCIATED_WELL_PRODUCTION_DATA } from "graphQL/useQueryAssociatedWellProductionData";

import { WellCardContext, WellCardContextProvider } from "components/WellCard/WellCardContext";

// Components
import Tags from "components/Shared/Tagger";
import PropertyInterestDetailsSection from "./PropertyInterestDetailsSection";
import InterestDetailForm from "./InterestDetailForm";
import { ConvertOwnerToContactContainer } from "store/containers/entity";
import HeaderSection from "./HeaderSection";
import NavHeader from "components/Revenue/components/Common/NavHeader";
import MetadataDrawer from "components/Revenue/components/Common/MetadataDrawer";
import { MultipleOwnerToContactDrawerContainer } from "store/containers";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import DocViewer from "components/Shared/DocViewer";
import ValidationFilter from "./ValidationFilter";
import WellProdChartProvider from "components/WellProdChart/WellProdChartProvider";

const temp = [
  {
    "Id": "e7f132a3-fc12-48bb-8b23-a223c481366e",
    "ReportDate": "12/2021",
    "oil": 47.62,
    "gas": null,
    "water": null,
    "allocatedOil": 4.3290906,
    "allocatedGas": null,
    "allocatedWater": null
  },
  {
    "Id": "6d390259-e541-460b-97ca-762b8869997f",
    "ReportDate": "03/2021",
    "oil": 51.32,
    "gas": 0,
    "water": 0,
    "allocatedOil": 4.6654544,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "344c6721-39ea-49fa-840c-45e22bf77283",
    "ReportDate": "12/2020",
    "oil": 28.83,
    "gas": 0,
    "water": 0,
    "allocatedOil": 2.620909,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "50d16093-c59b-4de6-b52b-e542d435ed33",
    "ReportDate": "09/2020",
    "oil": 36.68,
    "gas": 0,
    "water": 0,
    "allocatedOil": 3.3345454,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "b9f20eb7-ebfe-41ac-9658-6c35a09a91cf",
    "ReportDate": "07/2020",
    "oil": 71.94,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.5400004,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "7c27fb76-080d-467e-a87c-7632509adaae",
    "ReportDate": "01/2020",
    "oil": 26.6,
    "gas": 0,
    "water": 0,
    "allocatedOil": 2.418182,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "50d72ff4-5a12-495b-bafe-792b16ed68bb",
    "ReportDate": "11/2019",
    "oil": 21.47,
    "gas": 0,
    "water": 0,
    "allocatedOil": 1.9518181,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1ae32266-74ae-4b8d-ac9e-b957cff4be5f",
    "ReportDate": "09/2019",
    "oil": 42.22,
    "gas": 0,
    "water": 0,
    "allocatedOil": 3.838182,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "8ecdd1ff-890a-48f4-89b3-3cbffc6363bb",
    "ReportDate": "07/2019",
    "oil": 55.22,
    "gas": 0,
    "water": 0,
    "allocatedOil": 5.02,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d05ece43-05f8-4d2b-a9ce-3babd168446c",
    "ReportDate": "04/2019",
    "oil": 44.5,
    "gas": 0,
    "water": 0,
    "allocatedOil": 4.0454545,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "27b5831e-c077-4779-968e-c45ce8d8f250",
    "ReportDate": "12/2018",
    "oil": 44.42,
    "gas": 0,
    "water": 0,
    "allocatedOil": 4.038182,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1946715b-b4d3-4ad9-87b5-aaf240c345d0",
    "ReportDate": "10/2018",
    "oil": 22.55,
    "gas": 0,
    "water": 0,
    "allocatedOil": 2.05,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "4e8fb4c2-8d8c-4c7c-9974-55259ee7a21b",
    "ReportDate": "09/2018",
    "oil": 40.35,
    "gas": 0,
    "water": 0,
    "allocatedOil": 3.6681817,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "962fa3cf-73f5-4c3c-ab08-192c4c9ee419",
    "ReportDate": "06/2018",
    "oil": 39.55,
    "gas": 0,
    "water": 0,
    "allocatedOil": 3.5954545,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "c78d1646-8046-47a2-9fe4-3dac37f3c9fc",
    "ReportDate": "04/2018",
    "oil": 51.24,
    "gas": 0,
    "water": 0,
    "allocatedOil": 4.658182,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "60993259-8be3-45ff-827c-d5bce6e7dcd2",
    "ReportDate": "12/2017",
    "oil": 38.32,
    "gas": 0,
    "water": 0,
    "allocatedOil": 3.4836364,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "41d02221-f7f5-4581-964d-0d5b295c3179",
    "ReportDate": "11/2017",
    "oil": 41.4,
    "gas": 0,
    "water": 0,
    "allocatedOil": 3.7636366,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "b2ccae95-eacf-427e-803d-408d60667b07",
    "ReportDate": "06/2017",
    "oil": 26.9,
    "gas": 0,
    "water": 0,
    "allocatedOil": 2.4454546,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "78c9055b-4f13-4ffe-bd4e-34f2886dd797",
    "ReportDate": "04/2017",
    "oil": 60.19,
    "gas": 0,
    "water": 0,
    "allocatedOil": 5.471818,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "23dc2cd1-ffd0-41d9-a6b9-302146cf9353",
    "ReportDate": "03/2017",
    "oil": 77.88,
    "gas": 0,
    "water": 0,
    "allocatedOil": 7.08,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f51d0fe1-763d-4393-b698-464b53e71d5e",
    "ReportDate": "12/2016",
    "oil": 73.34,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.6672726,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "3c77e726-bf3f-43ce-b1bb-6854f5c91401",
    "ReportDate": "08/2016",
    "oil": 43.59,
    "gas": 0,
    "water": 0,
    "allocatedOil": 3.9627273,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "26a625a9-036a-4522-ba58-76c3ad8fd0c9",
    "ReportDate": "06/2016",
    "oil": 46.99,
    "gas": 0,
    "water": 0,
    "allocatedOil": 4.271818,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "9d322296-70c6-4fbb-896e-d106effb8046",
    "ReportDate": "05/2016",
    "oil": 60.06,
    "gas": 0,
    "water": 0,
    "allocatedOil": 5.46,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "8b2e547c-d793-4dc2-94b4-d8262401eb4c",
    "ReportDate": "04/2016",
    "oil": 76.8,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.9818187,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "4cf6cb59-e18c-470e-982c-2d6282e5fa71",
    "ReportDate": "03/2016",
    "oil": 76.03,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.911818,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "db349fb7-88ec-4c4b-bd98-3e1bec44b497",
    "ReportDate": "11/2015",
    "oil": 38.2,
    "gas": 0,
    "water": 0,
    "allocatedOil": 3.4727273,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "0f7b4748-f76e-42c2-844b-51688c1bfc81",
    "ReportDate": "10/2015",
    "oil": 41.6,
    "gas": 0,
    "water": 0,
    "allocatedOil": 3.7818182,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "25dd036b-56e8-459e-b982-f7d916aeded5",
    "ReportDate": "06/2015",
    "oil": 26.71,
    "gas": 0,
    "water": 0,
    "allocatedOil": 2.4281816,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "165e30b2-3929-47c7-b40b-7572a28080dc",
    "ReportDate": "04/2015",
    "oil": 70.64,
    "gas": 0,
    "water": 0,
    "allocatedOil": 11.773334,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "59fbd426-5e80-4cb5-8c09-14ce8c8fc150",
    "ReportDate": "12/2014",
    "oil": 33.69,
    "gas": 0,
    "water": 0,
    "allocatedOil": 5.615,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "8d78a252-3ee8-48c3-ad2f-71c3c2f35be5",
    "ReportDate": "10/2014",
    "oil": 74.41,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.401668,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "b8e3844f-81d3-408e-bf98-bddfc9636773",
    "ReportDate": "08/2014",
    "oil": 26.32,
    "gas": 0,
    "water": 0,
    "allocatedOil": 2.3927271,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "65f083c5-2a05-4c9f-9b59-ebfe286c7ab9",
    "ReportDate": "07/2014",
    "oil": 45.99,
    "gas": 0,
    "water": 0,
    "allocatedOil": 7.6650004,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "a1dca7f5-54e0-41ac-af05-349f42d75a4d",
    "ReportDate": "04/2014",
    "oil": 35.54,
    "gas": 0,
    "water": 0,
    "allocatedOil": 5.9233336,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "7ded4847-443b-4149-99f4-0810e863408c",
    "ReportDate": "03/2014",
    "oil": 43.48,
    "gas": 0,
    "water": 0,
    "allocatedOil": 7.2466664,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "c59f72e5-5f85-480e-beed-9bc19e232d29",
    "ReportDate": "11/2013",
    "oil": 57.18,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.53,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "da063e05-d1da-4a6b-a05f-a65fde5dd3c6",
    "ReportDate": "09/2013",
    "oil": 54.81,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.135,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1459aaf9-d8a9-40b9-9631-b7ed5b4f14d1",
    "ReportDate": "07/2013",
    "oil": 49.58,
    "gas": 0,
    "water": 0,
    "allocatedOil": 8.263333,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "83cac7e2-8b0a-4a37-a1f4-76eec4340860",
    "ReportDate": "06/2013",
    "oil": 50.52,
    "gas": 0,
    "water": 0,
    "allocatedOil": 8.42,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "c8416410-2e43-4661-a58a-8d944e0182b0",
    "ReportDate": "04/2013",
    "oil": 53,
    "gas": 0,
    "water": 0,
    "allocatedOil": 8.833333,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "841d7265-5808-4837-b5c6-7568fcaf4f56",
    "ReportDate": "03/2013",
    "oil": 38.38,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.396667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "abe2fa2f-3e54-44c8-b41f-6bc02e7544c8",
    "ReportDate": "02/2013",
    "oil": 54.88,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.146667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "65f630ee-67b9-4ba2-9b9a-00d425a72bef",
    "ReportDate": "12/2012",
    "oil": 57.1,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.516666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "07a4f973-7ef1-4d40-a058-4958582feac9",
    "ReportDate": "10/2012",
    "oil": 52.64,
    "gas": 0,
    "water": 0,
    "allocatedOil": 8.773334,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "0e8fbbb5-6b11-4488-a342-57ce39536241",
    "ReportDate": "09/2012",
    "oil": 66.93,
    "gas": 0,
    "water": 0,
    "allocatedOil": 11.155,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "80f89fdb-6066-44e9-82bb-ba66e20c6c77",
    "ReportDate": "07/2012",
    "oil": 57.16,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.526667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "5c86495a-656b-46fa-84ee-475492bf2ea9",
    "ReportDate": "05/2012",
    "oil": 63.85,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.641666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "9ebadefa-8cce-487e-9405-c5f4e17450e3",
    "ReportDate": "03/2012",
    "oil": 74.05,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.341667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "b4b8970f-070a-4e25-bd94-86403d3fbaeb",
    "ReportDate": "01/2012",
    "oil": 67.93,
    "gas": 0,
    "water": 0,
    "allocatedOil": 11.321667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "418532d3-99ee-4104-b7d0-ad7b7d910461",
    "ReportDate": "12/2011",
    "oil": 65.43,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.905,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "73ac78aa-16f7-4d1a-892e-cdb221e55cb6",
    "ReportDate": "10/2011",
    "oil": 57.32,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.553333,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "ac7e88ea-46cb-4076-9f7f-d3910d1be1be",
    "ReportDate": "09/2011",
    "oil": 41.71,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.9516664,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "8f38cbfa-f98d-4be7-967f-56b4b2cf43e0",
    "ReportDate": "08/2011",
    "oil": 58.57,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.761666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "8ec63730-3217-4463-9b99-fef3a39eaa25",
    "ReportDate": "07/2011",
    "oil": 71.13,
    "gas": 0,
    "water": 0,
    "allocatedOil": 11.855,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d6d4d482-68b8-4483-b579-77e306fd6f48",
    "ReportDate": "06/2011",
    "oil": 79.2,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.2,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "ac3f44e7-28d8-40de-8be2-49509da969eb",
    "ReportDate": "05/2011",
    "oil": 77.12,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.853333,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "9ead9db9-9c7e-4a19-b414-6f44d05e9956",
    "ReportDate": "11/2009",
    "oil": 68.2,
    "gas": 0,
    "water": 0,
    "allocatedOil": 11.366666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "16e5b5c6-0d3e-43f1-91b8-3b3893f0946c",
    "ReportDate": "09/2009",
    "oil": 79.06,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.176666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "cd211316-7e3e-44cc-b39e-8ed8f84fb69b",
    "ReportDate": "07/2009",
    "oil": 47.52,
    "gas": 0,
    "water": 0,
    "allocatedOil": 7.92,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d36c70f2-a6a1-4a74-b147-08687f93f197",
    "ReportDate": "05/2009",
    "oil": 38.11,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.351667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f8428710-159f-4572-9d2e-1ee1f3aa157f",
    "ReportDate": "04/2009",
    "oil": 80.02,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.336666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "58d3397d-0b4c-49c1-aba5-1466e2d4d00a",
    "ReportDate": "02/2009",
    "oil": 78.6,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.099999,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "e59bdfd1-ff37-4f24-ae80-ca38f74b1d86",
    "ReportDate": "11/2008",
    "oil": 74.88,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.48,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "edd45159-fb19-40e1-a66a-d41bfb1deca3",
    "ReportDate": "10/2008",
    "oil": 60.07,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.011666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "e529395c-099c-4a5d-9ab2-2e3231077eeb",
    "ReportDate": "08/2008",
    "oil": 80.64,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.44,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "cced8764-20ce-40c6-a54a-9fee92b354b0",
    "ReportDate": "05/2008",
    "oil": 78.58,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.096667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "b10a4376-a5e6-4657-982c-c648313e50fc",
    "ReportDate": "04/2008",
    "oil": 72.64,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.106667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "bd3f5763-5fd8-4fc0-9db2-a42b2293ec3e",
    "ReportDate": "02/2008",
    "oil": 55.84,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.306666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f6c862de-a4b2-48f2-8dac-935ebb3c4d70",
    "ReportDate": "01/2008",
    "oil": 105.3,
    "gas": 0,
    "water": 0,
    "allocatedOil": 17.550001,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d68c3a01-f2c4-4deb-86d8-6cf2a7afdb65",
    "ReportDate": "11/2007",
    "oil": 80.55,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.425,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "17f7d2a6-80c3-4d70-9d53-eff1b77d294c",
    "ReportDate": "08/2007",
    "oil": 76.74,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.79,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "b5390e16-ed3a-432e-9e54-104a34ac2144",
    "ReportDate": "07/2007",
    "oil": 80.44,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.406667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "7043b066-7484-4dac-ba62-43016d9b52e8",
    "ReportDate": "05/2007",
    "oil": 75.57,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.595,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1e77f7cf-c802-41f6-935c-df896258d4ae",
    "ReportDate": "04/2006",
    "oil": 71.2,
    "gas": 0,
    "water": 0,
    "allocatedOil": 11.866666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "452330a9-3b9c-44f4-a0a6-206e36effbc6",
    "ReportDate": "02/2006",
    "oil": 78.91,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.151668,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "5a74aa0f-9786-4d67-99c0-81245730422f",
    "ReportDate": "12/2005",
    "oil": 73.76,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.293334,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "46cf7cde-df01-4b2c-af04-c82177b6d85b",
    "ReportDate": "10/2005",
    "oil": 81.99,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.665,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "329c0f57-06ff-46d9-b8a8-e89d7dde075d",
    "ReportDate": "07/2005",
    "oil": 73.43,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.238334,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "ee72f975-1906-4eac-9e86-f349878a5746",
    "ReportDate": "05/2005",
    "oil": 73.75,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.291667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f4f6c4ac-7a50-4127-848d-dafdc056c95c",
    "ReportDate": "03/2005",
    "oil": 73.67,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.278333,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1865f003-d7b2-4339-aa55-ffa33b0da679",
    "ReportDate": "10/2004",
    "oil": 44.3,
    "gas": 0,
    "water": 0,
    "allocatedOil": 7.383333,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "618744fa-d037-491d-9533-71d16f1600d7",
    "ReportDate": "08/2004",
    "oil": 80.37,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.395,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "a0e5dd48-5f3b-4380-93db-2cd72ec16e87",
    "ReportDate": "05/2004",
    "oil": 50.05,
    "gas": 0,
    "water": 0,
    "allocatedOil": 8.341666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "874e675c-7b5d-45cc-a40f-66b5a279e925",
    "ReportDate": "04/2004",
    "oil": 70.49,
    "gas": 0,
    "water": 0,
    "allocatedOil": 11.748333,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "ff012f99-4a8a-4778-8028-fe0e0cc681ac",
    "ReportDate": "02/2004",
    "oil": 76.86,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.81,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "052dd8b2-3d0c-40b5-a33a-21420f8479e8",
    "ReportDate": "12/2003",
    "oil": 80.23,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.371667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "75bb6769-feca-4b5f-88e1-6ded153c4e51",
    "ReportDate": "08/2003",
    "oil": 27.44,
    "gas": 0,
    "water": 0,
    "allocatedOil": 4.5733333,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "b8308df7-8682-426e-b61b-7b1f0ada57b6",
    "ReportDate": "07/2003",
    "oil": 68.57,
    "gas": 0,
    "water": 0,
    "allocatedOil": 11.428333,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "e7d98bb2-72dd-4975-8f78-f1992a8099ed",
    "ReportDate": "05/2003",
    "oil": 64.01,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.668334,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "46eb7305-f424-442b-81bd-f66cd1725139",
    "ReportDate": "03/2003",
    "oil": 78.52,
    "gas": 0,
    "water": 0,
    "allocatedOil": 13.086666,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "a05832a2-d3e5-4fd9-801c-ae4c01e8c456",
    "ReportDate": "02/2003",
    "oil": 74.99,
    "gas": 0,
    "water": 0,
    "allocatedOil": 12.498333,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d211a461-64f5-46ae-8202-74dad0e72b7e",
    "ReportDate": "12/2002",
    "oil": 63.88,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.646667,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "e993f0f7-ff7c-4992-91c6-15791faed1ad",
    "ReportDate": "10/2002",
    "oil": 54.24,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.78,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "53dcb087-e559-485f-b357-1cb0eb7fe7cc",
    "ReportDate": "09/2002",
    "oil": 49.54,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.1925,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "e61ee77b-7355-423b-ad6d-d32235fb006b",
    "ReportDate": "08/2002",
    "oil": 79.25,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.90625,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "58d633e6-bb4f-4bcc-8ce7-e5c926f1de26",
    "ReportDate": "05/2002",
    "oil": 48.01,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.00125,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "fb35b2a1-9cbc-49da-8a50-568d5b9d2f61",
    "ReportDate": "04/2002",
    "oil": 67.91,
    "gas": 0,
    "water": 0,
    "allocatedOil": 8.48875,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "92cd4486-bd6a-48e2-93f1-bd2567b6d2c7",
    "ReportDate": "01/2002",
    "oil": 32.52,
    "gas": 0,
    "water": 0,
    "allocatedOil": 4.065,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "0d9b422a-f1d5-4fdc-a6af-d3ab66a28f05",
    "ReportDate": "11/2001",
    "oil": 41.37,
    "gas": 0,
    "water": 0,
    "allocatedOil": 5.17125,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f19727d2-17d8-4343-8bff-941a19edd09e",
    "ReportDate": "10/2001",
    "oil": 49.25,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.15625,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "88434e74-a551-437c-98cd-c540c09aa346",
    "ReportDate": "09/2001",
    "oil": 48.74,
    "gas": 0,
    "water": 0,
    "allocatedOil": 6.0925,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "6b17eb15-a43e-497a-aa1e-9e4eea748653",
    "ReportDate": "08/2001",
    "oil": 56.73,
    "gas": 0,
    "water": 0,
    "allocatedOil": 7.09125,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "dab9b6eb-bdff-4581-beb9-510366ddf53f",
    "ReportDate": "07/2001",
    "oil": 80.32,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.04,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "582f6633-56d0-4ab4-9755-5a325c59d94b",
    "ReportDate": "06/2001",
    "oil": 79.73,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.96625,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "229a4863-0538-434d-a703-7e22586ad5e5",
    "ReportDate": "04/2001",
    "oil": 65.66,
    "gas": 0,
    "water": 0,
    "allocatedOil": 8.2075,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "b60459a8-b09d-4722-81b2-3b994c8a5eb1",
    "ReportDate": "03/2001",
    "oil": 78.53,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.81625,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "7d29e67b-6fea-4fa7-85c9-88972654f6df",
    "ReportDate": "01/2001",
    "oil": 47.42,
    "gas": 0,
    "water": 0,
    "allocatedOil": 5.9275,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "49802fcc-bb48-47bb-adb4-701ca8240f1c",
    "ReportDate": "11/2000",
    "oil": 74.04,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.255,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d7f001be-4851-4a2a-b741-620b9734ad37",
    "ReportDate": "10/2000",
    "oil": 64.16,
    "gas": 0,
    "water": 0,
    "allocatedOil": 8.02,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "016e42bf-fb21-42fd-95b6-9b49fc696cdc",
    "ReportDate": "09/2000",
    "oil": 81.9,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.2375,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "2b09f418-2d29-458a-bef9-0d584250f70a",
    "ReportDate": "08/2000",
    "oil": 81.3,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.1625,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "46d6c83f-3936-4e0e-9e1b-6d4478f4da6f",
    "ReportDate": "06/2000",
    "oil": 83.18,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.3975,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "89ce2c78-fd94-4f41-b0d7-a8786503ebd6",
    "ReportDate": "05/2000",
    "oil": 63.74,
    "gas": 0,
    "water": 0,
    "allocatedOil": 7.9675,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "dbbb084e-b783-49b7-8dde-feb5cade1832",
    "ReportDate": "03/2000",
    "oil": 57.28,
    "gas": 0,
    "water": 0,
    "allocatedOil": 7.16,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1593c61e-436e-4919-94c5-f049893007f5",
    "ReportDate": "12/1999",
    "oil": 78.74,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.8425,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "69002e28-8fb8-4572-a72e-fe7502b057b2",
    "ReportDate": "07/1999",
    "oil": 80.31,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.03875,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "48c3959f-3fed-4db5-a96a-52f4afd1ba21",
    "ReportDate": "11/1998",
    "oil": 162.72,
    "gas": 0,
    "water": 0,
    "allocatedOil": 20.34,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "2b233fc1-570c-47e2-92a7-b5253b452138",
    "ReportDate": "11/1997",
    "oil": 145.81,
    "gas": 0,
    "water": 0,
    "allocatedOil": 18.22625,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "a7e2145e-37ee-44d3-9ec2-bd3adfe11754",
    "ReportDate": "03/1997",
    "oil": 60.56,
    "gas": 0,
    "water": 0,
    "allocatedOil": 7.57,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "cea43105-1323-420a-9462-4a5e77b8a317",
    "ReportDate": "12/1996",
    "oil": 41.07,
    "gas": 0,
    "water": 0,
    "allocatedOil": 5.13375,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "87a37630-e573-42e8-a5a0-70cb75034d59",
    "ReportDate": "11/1996",
    "oil": 80.22,
    "gas": 0,
    "water": 0,
    "allocatedOil": 10.0275,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "6bf054cb-ec71-47d9-919a-74f981439f32",
    "ReportDate": "08/1996",
    "oil": 73.75,
    "gas": 0,
    "water": 0,
    "allocatedOil": 9.21875,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d546fafa-500e-46ca-a48e-750565a86470",
    "ReportDate": "07/1996",
    "oil": 67.31,
    "gas": 0,
    "water": 0,
    "allocatedOil": 8.41375,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "9c626760-3d21-44a2-82f5-059aef5d1715",
    "ReportDate": "04/1996",
    "oil": 113.9,
    "gas": 0,
    "water": 0,
    "allocatedOil": 14.2375,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "6a370ad6-b30e-49c3-a64c-a5481647fbf5",
    "ReportDate": "03/1996",
    "oil": 65.94,
    "gas": 0,
    "water": 0,
    "allocatedOil": 8.2425,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "46e44f3d-58f2-4f6a-9153-ecc52b051629",
    "ReportDate": "07/1994",
    "oil": 68,
    "gas": 0,
    "water": 0,
    "allocatedOil": 68,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "37e2639b-0ea7-470c-835b-e97cde64610a",
    "ReportDate": "05/1994",
    "oil": 80,
    "gas": 0,
    "water": 0,
    "allocatedOil": 80,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "901863d6-c2f8-48e7-934e-a01fe697a013",
    "ReportDate": "03/1994",
    "oil": 79,
    "gas": 0,
    "water": 0,
    "allocatedOil": 79,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "0d12b5a0-985c-48fb-8296-893f0ba308eb",
    "ReportDate": "04/1993",
    "oil": 56,
    "gas": 0,
    "water": 0,
    "allocatedOil": 56,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "02c5bb13-4246-4f20-8968-ad727ac52dc0",
    "ReportDate": "03/1993",
    "oil": 57,
    "gas": 0,
    "water": 0,
    "allocatedOil": 57,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "8f7b1286-4c29-4bee-bfb8-afb1cb972071",
    "ReportDate": "10/1992",
    "oil": 20,
    "gas": 0,
    "water": 0,
    "allocatedOil": 20,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1d994a6c-7119-4d89-94bd-a64606a1bfaf",
    "ReportDate": "08/1992",
    "oil": 24,
    "gas": 0,
    "water": 0,
    "allocatedOil": 24,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "7b1bb622-50da-4f4e-a727-b3c97056b432",
    "ReportDate": "07/1992",
    "oil": 37,
    "gas": 0,
    "water": 0,
    "allocatedOil": 37,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "ee10aaf1-3c65-4f27-b649-7ad13a0d4b6c",
    "ReportDate": "06/1992",
    "oil": 53,
    "gas": 0,
    "water": 0,
    "allocatedOil": 53,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "ba17a400-13de-4890-bae1-8cf0dcc53d75",
    "ReportDate": "10/1991",
    "oil": 17,
    "gas": 0,
    "water": 0,
    "allocatedOil": 17,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "90ee1235-ed20-4d8a-afa7-5a2fc1a378e9",
    "ReportDate": "08/1991",
    "oil": 30,
    "gas": 0,
    "water": 0,
    "allocatedOil": 30,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "820a525a-181d-4aca-8035-35188c5a5ef3",
    "ReportDate": "07/1991",
    "oil": 27,
    "gas": 0,
    "water": 0,
    "allocatedOil": 27,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "bc49c93f-589d-451e-8dfe-91676040d6d0",
    "ReportDate": "06/1991",
    "oil": 26,
    "gas": 0,
    "water": 0,
    "allocatedOil": 26,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "04236d1d-673f-4e41-a54c-c569635b7028",
    "ReportDate": "05/1991",
    "oil": 39,
    "gas": 0,
    "water": 0,
    "allocatedOil": 39,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "0e9007a8-28bf-4e47-9f72-449e5792ce79",
    "ReportDate": "04/1991",
    "oil": 72,
    "gas": 0,
    "water": 0,
    "allocatedOil": 72,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "c164f480-5d2b-4354-b631-4ee6e9f3f4a8",
    "ReportDate": "03/1991",
    "oil": 28,
    "gas": 0,
    "water": 0,
    "allocatedOil": 28,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "175e9fd9-101d-4070-8a6c-8aaca9db7496",
    "ReportDate": "02/1991",
    "oil": 62,
    "gas": 0,
    "water": 0,
    "allocatedOil": 62,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "676d0b56-6b92-4eb5-91b0-be499f5e8c23",
    "ReportDate": "12/1990",
    "oil": 21,
    "gas": 0,
    "water": 0,
    "allocatedOil": 21,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1b255b8d-549e-4beb-b116-a55c4cd7e4ca",
    "ReportDate": "11/1990",
    "oil": 52,
    "gas": 0,
    "water": 0,
    "allocatedOil": 52,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "72f0e4c2-fffc-4157-ad06-541899e29b26",
    "ReportDate": "10/1990",
    "oil": 38,
    "gas": 0,
    "water": 0,
    "allocatedOil": 38,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f0abe2c6-0395-42a5-8fc4-db3759ee0405",
    "ReportDate": "09/1990",
    "oil": 27,
    "gas": 0,
    "water": 0,
    "allocatedOil": 27,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f3cf31c3-a778-443f-9553-64d7d08fda7d",
    "ReportDate": "08/1990",
    "oil": 37,
    "gas": 0,
    "water": 0,
    "allocatedOil": 37,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "fec057a4-6b70-4f56-87c2-52f5310a04a0",
    "ReportDate": "06/1990",
    "oil": 14,
    "gas": 0,
    "water": 0,
    "allocatedOil": 14,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "3e8177b1-55f5-47c5-bc9b-1fc6f67dc2f2",
    "ReportDate": "05/1990",
    "oil": 72,
    "gas": 0,
    "water": 0,
    "allocatedOil": 72,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "28daf73d-93e2-4084-ac74-39556481c79c",
    "ReportDate": "03/1990",
    "oil": 29,
    "gas": 0,
    "water": 0,
    "allocatedOil": 29,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "5041bd3e-0118-4bc9-8023-f7cb31b941c1",
    "ReportDate": "02/1990",
    "oil": 44,
    "gas": 0,
    "water": 0,
    "allocatedOil": 44,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "575853e0-df8e-4560-8399-548b5bf317ad",
    "ReportDate": "01/1990",
    "oil": 33,
    "gas": 0,
    "water": 0,
    "allocatedOil": 33,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "b7cf9a2e-6760-410f-9a3c-5ebe05afd0b5",
    "ReportDate": "12/1989",
    "oil": 30,
    "gas": 0,
    "water": 0,
    "allocatedOil": 30,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d49e3e8b-fd22-44a2-b0cd-743a79d04990",
    "ReportDate": "11/1989",
    "oil": 58,
    "gas": 0,
    "water": 0,
    "allocatedOil": 58,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f3077387-4e8c-4bfd-8617-70d0f1d4c63b",
    "ReportDate": "09/1989",
    "oil": 19,
    "gas": 0,
    "water": 0,
    "allocatedOil": 19,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1a967974-79eb-4d09-82ac-4e502812971f",
    "ReportDate": "08/1989",
    "oil": 60,
    "gas": 0,
    "water": 0,
    "allocatedOil": 60,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "9ee39175-f9c1-4351-a89b-9b83ea6c2e0d",
    "ReportDate": "07/1989",
    "oil": 24,
    "gas": 0,
    "water": 0,
    "allocatedOil": 24,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "71fedc6c-c2b2-43cb-b220-fe75f1965fb6",
    "ReportDate": "06/1989",
    "oil": 61,
    "gas": 0,
    "water": 0,
    "allocatedOil": 61,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "4a351041-ce05-4900-9e4e-1728c2800845",
    "ReportDate": "05/1989",
    "oil": 31,
    "gas": 0,
    "water": 0,
    "allocatedOil": 31,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d8ec4059-5998-46f6-9907-acf7416a11a6",
    "ReportDate": "04/1989",
    "oil": 64,
    "gas": 0,
    "water": 0,
    "allocatedOil": 64,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d8ac380f-fddb-4f00-ae6d-93731d051b8b",
    "ReportDate": "03/1989",
    "oil": 40,
    "gas": 0,
    "water": 0,
    "allocatedOil": 40,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "bfdefd3c-fd6e-4d88-9dcb-5ee53a2d4c4a",
    "ReportDate": "02/1989",
    "oil": 57,
    "gas": 0,
    "water": 0,
    "allocatedOil": 57,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1e554b2b-5841-4c7d-b00e-3ed36e9881ea",
    "ReportDate": "12/1988",
    "oil": 55,
    "gas": 0,
    "water": 0,
    "allocatedOil": 55,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "4a6dad97-1b46-4557-8c93-0dfbd4f82c0a",
    "ReportDate": "11/1988",
    "oil": 20,
    "gas": 0,
    "water": 0,
    "allocatedOil": 20,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f32cc8d3-6177-4c61-87f7-5a7e7e2d4d1a",
    "ReportDate": "10/1988",
    "oil": 57,
    "gas": 0,
    "water": 0,
    "allocatedOil": 57,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "afc5ed68-01e0-4b30-b718-71e2726eab31",
    "ReportDate": "08/1988",
    "oil": 40,
    "gas": 0,
    "water": 0,
    "allocatedOil": 40,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "7eeafbb1-8d77-4293-b8d9-0091de82a29a",
    "ReportDate": "07/1988",
    "oil": 78,
    "gas": 0,
    "water": 0,
    "allocatedOil": 78,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "fe5f14d7-4b07-471d-8136-3792a3e531c3",
    "ReportDate": "06/1988",
    "oil": 153,
    "gas": 0,
    "water": 0,
    "allocatedOil": 153,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "a056934d-4d06-45b9-aca9-7bd793ee5a07",
    "ReportDate": "04/1988",
    "oil": 72,
    "gas": 0,
    "water": 0,
    "allocatedOil": 72,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "a0c94150-42c7-49ab-a20e-af210cb67325",
    "ReportDate": "03/1988",
    "oil": 58,
    "gas": 0,
    "water": 0,
    "allocatedOil": 58,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f28285d8-b4fb-4c75-881c-88c2e53e03a8",
    "ReportDate": "02/1988",
    "oil": 34,
    "gas": 0,
    "water": 0,
    "allocatedOil": 34,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "0b3afe2f-cc6a-4cf1-af04-5d4123025326",
    "ReportDate": "01/1988",
    "oil": 45,
    "gas": 0,
    "water": 0,
    "allocatedOil": 45,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "653d04a7-16d1-4c4d-af40-3cac016ab8d4",
    "ReportDate": "12/1987",
    "oil": 72,
    "gas": 0,
    "water": 0,
    "allocatedOil": 72,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "2d6f3561-d821-4978-b93e-841819ff9e5a",
    "ReportDate": "11/1987",
    "oil": 57,
    "gas": 0,
    "water": 0,
    "allocatedOil": 57,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "4ff37785-5f9c-4ab6-94e0-aa4115f3b4ec",
    "ReportDate": "10/1987",
    "oil": 73,
    "gas": 0,
    "water": 0,
    "allocatedOil": 73,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "85dd1ab5-1900-453e-9f52-580f054fec8d",
    "ReportDate": "09/1987",
    "oil": 54,
    "gas": 0,
    "water": 0,
    "allocatedOil": 54,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "af936add-9125-4e67-886f-9ce8e115ee41",
    "ReportDate": "08/1987",
    "oil": 90,
    "gas": 0,
    "water": 0,
    "allocatedOil": 90,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "11d78ebe-625b-4557-a6e2-f2e09cc42407",
    "ReportDate": "07/1987",
    "oil": 63,
    "gas": 0,
    "water": 0,
    "allocatedOil": 63,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "6fbfc255-01d7-4c39-85e0-28deae5f8e94",
    "ReportDate": "06/1987",
    "oil": 77,
    "gas": 0,
    "water": 0,
    "allocatedOil": 77,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "5d66a92f-3490-4bbc-9929-31d3711c8488",
    "ReportDate": "05/1987",
    "oil": 89,
    "gas": 0,
    "water": 0,
    "allocatedOil": 89,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d0a654c7-01ed-4c49-b3b7-203768bdda09",
    "ReportDate": "04/1987",
    "oil": 128,
    "gas": 0,
    "water": 0,
    "allocatedOil": 128,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "4f1767b9-13d8-465c-8dc0-5407a3d58b52",
    "ReportDate": "03/1987",
    "oil": 80,
    "gas": 0,
    "water": 0,
    "allocatedOil": 80,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "da595179-8eda-4370-ade2-c768468efe81",
    "ReportDate": "02/1987",
    "oil": 105,
    "gas": 0,
    "water": 0,
    "allocatedOil": 105,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "349b0438-7cef-4f05-99d7-0d2ea65028ce",
    "ReportDate": "01/1987",
    "oil": 124,
    "gas": 0,
    "water": 0,
    "allocatedOil": 124,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f0edc594-048d-42d6-bb48-085a5d6ab0fb",
    "ReportDate": "12/1986",
    "oil": 81,
    "gas": 0,
    "water": 0,
    "allocatedOil": 81,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "0967660c-b57d-4998-bc65-d1e083ec5e33",
    "ReportDate": "11/1986",
    "oil": 130,
    "gas": 0,
    "water": 0,
    "allocatedOil": 130,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "9ac54c9f-9013-44d5-bfea-6938d4140197",
    "ReportDate": "10/1986",
    "oil": 162,
    "gas": 0,
    "water": 0,
    "allocatedOil": 162,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "cde707ed-1986-4345-ab7f-9371d309ca20",
    "ReportDate": "09/1986",
    "oil": 79,
    "gas": 0,
    "water": 0,
    "allocatedOil": 79,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "64376e31-dc3d-4115-b9cf-003279c80117",
    "ReportDate": "08/1986",
    "oil": 81,
    "gas": 0,
    "water": 0,
    "allocatedOil": 81,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "92774c2c-fe96-4668-8c7a-2a65d72e387a",
    "ReportDate": "07/1986",
    "oil": 73,
    "gas": 0,
    "water": 0,
    "allocatedOil": 73,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "29294f5c-57f5-4ce6-b549-9f92bc52f033",
    "ReportDate": "06/1986",
    "oil": 100,
    "gas": 0,
    "water": 0,
    "allocatedOil": 100,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "155b4f55-3af5-4de1-856c-9bbfada5e675",
    "ReportDate": "05/1986",
    "oil": 176,
    "gas": 0,
    "water": 0,
    "allocatedOil": 176,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "197b9dfd-5a0e-454d-9aa7-7b3a626fcac1",
    "ReportDate": "04/1986",
    "oil": 98,
    "gas": 0,
    "water": 0,
    "allocatedOil": 98,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "e79604ac-6ad2-44fb-b1e0-0ae0805b87bd",
    "ReportDate": "03/1986",
    "oil": 285,
    "gas": 0,
    "water": 0,
    "allocatedOil": 285,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "fc68f31b-09f4-44f3-936c-9555828ec771",
    "ReportDate": "02/1986",
    "oil": 163,
    "gas": 0,
    "water": 0,
    "allocatedOil": 163,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1b507f06-4de2-4067-9a65-706e4be44af8",
    "ReportDate": "01/1986",
    "oil": 224,
    "gas": 0,
    "water": 0,
    "allocatedOil": 224,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "5da7621d-c64c-44fc-9034-3d1a9fd63257",
    "ReportDate": "12/1985",
    "oil": 340,
    "gas": 0,
    "water": 0,
    "allocatedOil": 340,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "940a6bda-e21e-4a8e-a17d-670a81a4cf92",
    "ReportDate": "11/1985",
    "oil": 156,
    "gas": 0,
    "water": 0,
    "allocatedOil": 156,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "725a1f03-907c-4133-b438-8835d315e830",
    "ReportDate": "10/1985",
    "oil": 146,
    "gas": 0,
    "water": 0,
    "allocatedOil": 146,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "36220097-8bdf-49ab-9899-cfc752983680",
    "ReportDate": "09/1985",
    "oil": 83,
    "gas": 0,
    "water": 0,
    "allocatedOil": 83,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "30e0ed1e-763e-44e5-aca0-b15e6410c924",
    "ReportDate": "08/1985",
    "oil": 47,
    "gas": 0,
    "water": 0,
    "allocatedOil": 47,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "bc9c8a4b-c280-4f66-a8cc-c5d40c3d072a",
    "ReportDate": "07/1985",
    "oil": 80,
    "gas": 0,
    "water": 0,
    "allocatedOil": 80,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "2c0b03ad-5c4a-4178-9960-19d7b42f089e",
    "ReportDate": "06/1985",
    "oil": 167,
    "gas": 0,
    "water": 0,
    "allocatedOil": 167,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "9890daeb-a91c-4fcf-92ef-323fabeafdc0",
    "ReportDate": "03/1985",
    "oil": 73,
    "gas": 0,
    "water": 0,
    "allocatedOil": 73,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "2974f120-6777-4416-9b00-9212d425c3df",
    "ReportDate": "01/1985",
    "oil": 127,
    "gas": 0,
    "water": 0,
    "allocatedOil": 127,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "5be6fbb3-cfc8-4cb5-99ec-b7922f2963c7",
    "ReportDate": "12/1984",
    "oil": 81,
    "gas": 0,
    "water": 0,
    "allocatedOil": 81,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "5ea23cd3-8c8a-42f8-a947-4a17d800ed81",
    "ReportDate": "11/1984",
    "oil": 82,
    "gas": 0,
    "water": 0,
    "allocatedOil": 82,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "6f3c0e1b-b04a-4348-9629-7af243b090ba",
    "ReportDate": "10/1984",
    "oil": 165,
    "gas": 0,
    "water": 0,
    "allocatedOil": 165,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "a43d1556-397c-4f99-bc0e-6f25a4ed5a4d",
    "ReportDate": "08/1984",
    "oil": 162,
    "gas": 0,
    "water": 0,
    "allocatedOil": 162,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d268220c-d292-49bf-8311-a5be2a3533fb",
    "ReportDate": "06/1984",
    "oil": 151,
    "gas": 0,
    "water": 0,
    "allocatedOil": 151,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d1203fff-9334-49b4-9f61-c0785f6f78bc",
    "ReportDate": "05/1984",
    "oil": 104,
    "gas": 0,
    "water": 0,
    "allocatedOil": 104,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f1755d10-6c2a-4360-8254-7d46513b3666",
    "ReportDate": "04/1984",
    "oil": 73,
    "gas": 0,
    "water": 0,
    "allocatedOil": 73,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "e95adf98-9afd-4f62-91e7-269ec0b981a1",
    "ReportDate": "03/1984",
    "oil": 140,
    "gas": 0,
    "water": 0,
    "allocatedOil": 140,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "0e5582bc-1fc6-4a6e-93b7-d120167e6350",
    "ReportDate": "01/1984",
    "oil": 130,
    "gas": 0,
    "water": 0,
    "allocatedOil": 130,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "274cf8d7-8050-4a32-87ba-9bfec2daa44a",
    "ReportDate": "11/1983",
    "oil": 157,
    "gas": 0,
    "water": 0,
    "allocatedOil": 157,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "f18ab326-4e3e-4156-ac8d-b7e4d741539a",
    "ReportDate": "10/1983",
    "oil": 160,
    "gas": 0,
    "water": 0,
    "allocatedOil": 160,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "3f99dfa2-0c05-4595-bb58-a6806a84023d",
    "ReportDate": "08/1983",
    "oil": 154,
    "gas": 0,
    "water": 0,
    "allocatedOil": 154,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "368497b1-c8e6-4193-8e25-4b15566e4dfa",
    "ReportDate": "07/1983",
    "oil": 160,
    "gas": 0,
    "water": 0,
    "allocatedOil": 160,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "36cb4ef4-52c9-4278-9f57-1520fc99c72e",
    "ReportDate": "06/1983",
    "oil": 145,
    "gas": 0,
    "water": 0,
    "allocatedOil": 145,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "2d658eaa-cb62-4e61-aa10-dad006c1c15f",
    "ReportDate": "04/1983",
    "oil": 153,
    "gas": 0,
    "water": 0,
    "allocatedOil": 153,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d4aee92e-7052-4984-866c-95a6e07f6cbc",
    "ReportDate": "03/1983",
    "oil": 160,
    "gas": 0,
    "water": 0,
    "allocatedOil": 160,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "efc27323-3ae8-4ded-8079-e74010662087",
    "ReportDate": "02/1983",
    "oil": 286,
    "gas": 0,
    "water": 0,
    "allocatedOil": 286,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "4d38b2d5-3d4e-4a3c-92ec-90f0eb51cb50",
    "ReportDate": "01/1983",
    "oil": 165,
    "gas": 0,
    "water": 0,
    "allocatedOil": 165,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "057333bc-7650-4d1c-98fc-ac4efaff9685",
    "ReportDate": "11/1982",
    "oil": 309,
    "gas": 0,
    "water": 0,
    "allocatedOil": 309,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "1bb4b935-0d06-4534-88e1-95e9c8b198b1",
    "ReportDate": "10/1982",
    "oil": 320,
    "gas": 0,
    "water": 0,
    "allocatedOil": 320,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "902d6314-a95a-4976-9979-1625e4707ac8",
    "ReportDate": "09/1982",
    "oil": 316,
    "gas": 0,
    "water": 0,
    "allocatedOil": 316,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "d2ce9051-9c6e-431f-aeb8-d50ee874aa13",
    "ReportDate": "07/1982",
    "oil": 147,
    "gas": 0,
    "water": 0,
    "allocatedOil": 147,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "8e486525-ed5b-45ab-a4d9-4eee945e43d7",
    "ReportDate": "06/1982",
    "oil": 162,
    "gas": 0,
    "water": 0,
    "allocatedOil": 162,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "5f3b5886-096f-404e-b491-f206b26d389a",
    "ReportDate": "04/1982",
    "oil": 307,
    "gas": 0,
    "water": 0,
    "allocatedOil": 307,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "69f59203-eb3c-4857-9608-1d4a0b73a6e6",
    "ReportDate": "03/1982",
    "oil": 145,
    "gas": 0,
    "water": 0,
    "allocatedOil": 145,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "913ce3c0-7408-4179-876c-3b97c8690a86",
    "ReportDate": "10/1981",
    "oil": 71,
    "gas": 0,
    "water": 0,
    "allocatedOil": 71,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "5d9e1c39-b389-4481-b666-2a1242f69c17",
    "ReportDate": "05/1981",
    "oil": 83,
    "gas": 0,
    "water": 0,
    "allocatedOil": 83,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "b09f10e7-ff37-47f3-a53d-71c365fb372f",
    "ReportDate": "12/1980",
    "oil": 70,
    "gas": 0,
    "water": 0,
    "allocatedOil": 70,
    "allocatedGas": 0,
    "allocatedWater": 0
  },
  {
    "Id": "7493267a-4973-4f40-8fe6-300239f6724b",
    "ReportDate": "06/1980",
    "oil": 60,
    "gas": 0,
    "water": 0,
    "allocatedOil": 60,
    "allocatedGas": 0,
    "allocatedWater": 0
  }
]

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "#f3f3f3",
    width: "100%",
  },
  navSection: {
    minHeight: "52px",
    padding: "10px 20px",
    backgroundColor: "#fff",
  },
  detailHeader: {
    backgroundColor: "#fff",
    padding: "20px 27px 0px 45px",
    marginTop: "7px",
  },
  title: {
    display: "flex",
  },
  titleText: {
    marginLeft: 16,
    width: "calc(65vw - 10px)",
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  highlighter: {
    background: "#263451",
    padding: "5px 16px",
    borderRadius: 16,
    width: "max-content",
    transform: "translateX(5px) translateY(11px)",
    height: "32px",
  },
  highlight: {
    color: "#ffffff",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  icon: {
    height: 80,
    width: 80,
    backgroundColor: "#d5f4ff",
    borderRadius: 12,
    "& svg": {
      fontSize: "3.1875rem",
      fill: "#263451",
    },
  },
  tabsHeader: {
    background: "#ffffff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabsSection: {},
  headerSection: {
    padding: "20px 30px",
    backgroundColor: "#fff",
    marginBottom: "20px",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  tabsDetailContainer: ({ showInterestDetails, collapse }) => ({
    padding: 20,
    width: showInterestDetails || !collapse ? "calc(100% - 644px)" : "100%",
  }),
  menuIcon: {
    background: "transparent",
    align: "center",
    "& svg": {
      fill: "#808080 !important",
    },
  },
  sideModal: {
    marginTop: 24,
    padding: "16px 10px",
    background: "#ffffff",
    borderRadius: 8,
    overflow: "auto",
    height: "calc(100vh - 280px)",
    maxHeight: "calc(100vh - 280px)",
    maxWidth: 360,
    width: "100%",
  },
  tags: {
    "& fieldset": {
      border: "none",
    },
    width: "100%",
  },
  actionsContainer: {
    display: "flex",
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  menu: {
    "& .MuiListItem-gutters": {
      paddingLeft: "10px !important",
      paddingRight: "10px !important",
    },
    "& .MuiListItem-root": {
      "& .MuiListItemIcon-root": {
        minWidth: "25px",
        "& .MuiSvgIcon-root": {
          fill: "red !important",
        },
      },
    },
  },
  metaActions: ({ collapse }) => ({
    marginTop: "2px",
    "& button": {
      backgroundColor: !collapse ? "#eceded" : "#fff",
      color: "grey",
      fontWeight: "bold",
      textTransform: "capitalize",
      padding: "6px 12px",
      "&:hover": {
        backgroundColor: !collapse ? "#eceded" : "#fff",
      },
    },
  }),
  tabsSectionDetails: {
    maxHeight: "calc(100vh - 280px)",
    overflow: "overlay",
    backgroundColor: "#f3f3f3",
  },
}));

const StyledTabs = withStyles({
  root: {
    textTransform: "capitalize",
  },
  indicator: {
    backgroundColor: "#12abe0",
    height: "5px",
  },
})(Tabs);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "uppercase",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "black",
      opacity: 1,
    },
    "&$selected": {
      color: "black",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "black",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

export default function DetailComponents(props) {
  const history = useHistory();
  const [stateApp, setStateApp] = useContext(AppContext);

  const propertyId = history.location.pathname.split("/")[history.location.pathname.split("/").length - 1];
  const [propertyOwnerContact, setPropertyOwnerContacts] = useState([]);
  const [showInterestDetails, setShowInterestDetails] = useState(false);
  const [showOwnerDialog, setShowOwnerDialog] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [tab, setTab] = useState(0);
  const [refetchContacts, setRefetchContacts] = useState(false);
  const selectedTabRef = useRef(null);
  const [collapse, setCollapse] = useState(true);
  const [anchorEl, setAnchorEl] = useState();
  const [isButtonScroll, setButtonScroll] = useState(false);
  const [propertyDetails, setProperty] = useState(null);
  const [entityToConvert, setEntityToConvert] = useState(null);

  const classes = useStyles({ ...props, showInterestDetails, collapse });

  const [updateMetaOwner] = useMutation(UPSERT_USER_DESCRIPTOR);
  const [updateProperty] = useMutation(UPDATE_PROPERTY);

  const [getProperty, { data: getPropertyResult }] = useLazyQuery(GET_PROPERTY, {
    fetchPolicy: "no-cache",
  });

  const [checkIfOwnersAreContacts, { data: checkIfOwnersAreContactsData }] = useLazyQuery(IFARECONTACTS, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    getProperty({
      variables: { id: propertyId },
    });
  }, [getProperty, propertyId]);

  useEffect(() => {
    if (getPropertyResult) setProperty(getPropertyResult?.getProperty.property);
    setStateApp((state) => ({
      ...state,
      selectedRevenueProperty: getPropertyResult?.getProperty.property,
    }));
  }, [getPropertyResult]);

  useEffect(() => {
    selectedTabRef.current &&
      selectedTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
  }, [tab]);

  useEffect(() => {
    const idsArray = [];
    if (propertyDetails?.owner) idsArray.push(propertyDetails.owner._id);
    if (propertyDetails?.operator) idsArray.push(propertyDetails.operator._id);
    if (idsArray.length > 0)
      checkIfOwnersAreContacts({
        variables: { idsArray },
      });
  }, [propertyDetails, refetchContacts]);

  useEffect(() => {
    if (checkIfOwnersAreContactsData?.ifAreContacts?.length > 0) {
      setPropertyOwnerContacts(
        checkIfOwnersAreContactsData?.ifAreContacts.map((c) => ({
          _id: c.isContact,
          name: c.name,
          entityId: c._id,
        }))
      );
    }
  }, [checkIfOwnersAreContactsData]);

  const handleScroll = (e) => {
    if (!isButtonScroll) {
      const { scrollTop } = e.target;
      if (scrollTop <= 150 && tab !== 0) setTab(0);
      else if (scrollTop > 150 && tab !== 1) setTab(1);
    }
    handleEndScroll();
  };

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        updateProperty({
          variables: {
            property: {
              _id: propertyDetails._id,
              IsDeleted: true,
            },
          },
        }).then((res) => {
          history.push("/revenue/properties");
        });
      }
    }
  };

  const handleEndScroll = useMemo(() => debounce(() => setButtonScroll(false), 1000), []);

  const onUpdateMetaData = (data) => {
    if (data.owner)
      updateMetaOwner({
        variables: {
          descriptorObject: data.owner,
          userId: stateApp.user.mongoId,
          relatedObject: propertyDetails._id,
          relatedObjectType: "Property",
        },
      });
    else {
      updateProperty({
        variables: {
          property: {
            _id: propertyId,
            ...data
          },
        },
        refetchQueries: ["getProperty"],
        awaitRefetchQueries: true,
      });
    }
  };

  return (
    <NavHeader title={`${get(propertyDetails, "number", "")}-${get(propertyDetails, "name", "")}`}>
      {/**
       * Detail title section
       */}
      <div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
        <div className="flex column alignStart justifyStart w-100">
          <div className={classes.title}>
            <IconButton className={classes.icon}>
              <DocumentIcon />
            </IconButton>
            <div className={classes.titleText}>
              {propertyDetails && (
                <Typography style={{ fontWeight: "bold", fontSize: "large", marginLeft: 8 }}>{propertyDetails.name}</Typography>
              )}
              <div className={classes.tagsContainer}>
                <div className={classes.highlighter}>
                  <Typography className={classes.highlight} variant="highlight">
                    Property
                  </Typography>
                </div>
                <div className={classes.tags}>
                  <Tags targetSourceId={propertyId} width="100%" targetLabel="check" publicLeftBottom onlyTags />
                </div>
              </div>
            </div>
          </div>

          <div className={classes.actionsContainer}>
            <div className={classes.tabsHeader}>
              <StyledTabs
                value={tab}
                onChange={(event, tab) => {
                  setButtonScroll(true);
                  setTab(tab);
                }}
                aria-label="ant example"
              >
                <StyledTab label="Details" />
                <StyledTab label="Validation" />
              </StyledTabs>
            </div>
            <div className={classes.metaActions}>
              <Button startIcon={<InfoOutlinedIcon />} onClick={() => setCollapse(!collapse)}>
                Metadata
              </Button>
              <IconButton size="small" component="span" className={classes.menuIcon} onClick={(event) => setAnchorEl(event.currentTarget)}>
                <MoreHorizIcon size="medium" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justifyBetween alignStart w-100">
        <div className={classes.tabsDetailContainer}>
          {/**
           * Detail tabs section
           */}
          <div className={classes.tabsSection} style={{ display: stateApp.viewDoc ? "none" : "" }}>
            {tab === 0 && (
              <div className={classes.tabsSectionDetails}>
                <div className={classes.headerSection}>
                  <HeaderSection
                    propertyId={propertyId}
                    propertyDetails={propertyDetails}
                    propertyOwnerContact={propertyOwnerContact}
                    setEntityToConvert={setEntityToConvert}
                  />
                </div>
                <div>
                  <PropertyInterestDetailsSection
                    propertyId={propertyId}
                    setSelectedInterest={setSelectedInterest}
                    showInterestDetails={showInterestDetails}
                    onClickAdd={() => setShowInterestDetails(true)}
                  />
                </div>
              </div>
            )}
            {tab === 1 && (
              <Validation  propertyId={propertyId} />
            )}
          </div>
          {stateApp.viewDoc && (
            <DocViewer divCondition={true} DocStyle={{ height: "calc(100vh - 280px)" }} />
          )}
        </div>
        {showOwnerDialog && (
          <ConvertOwnerToContactContainer
            propertyDetails={propertyDetails}
            onClose={() => setShowOwnerDialog(false)}
            onSuccess={() => setRefetchContacts(!refetchContacts)}
          />
        )}
        {showInterestDetails && (
          <InterestDetailForm
            propertyDetails={propertyDetails}
            selectedInterest={selectedInterest}
            setShowOwnerDialog={setShowOwnerDialog}
            propertyOwnerContact={propertyOwnerContact?.find((owner) => owner.entityId === propertyDetails?.owner?._id)}
            onClose={() => setShowInterestDetails(false)}
          />
        )}

        {entityToConvert && (
          <MultipleOwnerToContactDrawerContainer
            onClose={() => setEntityToConvert(null)}
            rows={[entityToConvert]}
            setM1nSelectedRowsIndexes={() => { }}
            onSuccess={() => setRefetchContacts(!refetchContacts)}
            setRows={() => { }}
          />
        )}

        {!collapse && !showInterestDetails && !showOwnerDialog && (
          <div
            style={{
              marginTop: 20,
              marginRight: 24,
              height: "calc(100vh - 270px)",
              width: "620px",
              maxWidth: "620px",
            }}
          >
            <MetadataDrawer
              data={propertyDetails}
              onUpdate={onUpdateMetaData}
              setCollapse={setCollapse}
              targetLabel="Property"
              targetSourceId={propertyId}
              setStateApp={setStateApp}
              ownerTitle="Approver"
              isApproval={true}
            />
          </div>
        )}
      </div>
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} fullWidth={true} maxWidth={"sm"}>
        <DeleteConfirmationDialogContent
          header={`Delete Property`}
          onClose={() => setOpenDeleteDialog(false)}
          deleteFunc={deleteFunc}
          m1nSelectedRowsIds={[propertyDetails?._id]}
          setM1nSelectedRowsIndexes={() => { }}
        >
          {`Do you want to delete this property?`}
        </DeleteConfirmationDialogContent>
      </Dialog>
      {/**
       * Menu for meta data
       */}
      <Menu
        id="revPropertyMenu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className={classes.menu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem onClick={() => setOpenDeleteDialog(true)}>
          <ListItemIcon>
            <DeleteIcon size="medium" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </NavHeader>
  );
}


const Validation = ({ propertyId }) => {
  const esIndex = "properties_flat";
  const [esFilters, setESFilters] = useState([]);
  const [filterToggle, setFilterToggle] = useState(false);


  return (
    <div style={{ background: "white", padding: "10px" }}>
      <ValidationFilter
        field={"lastCheck.checkDate"}
        esIndex={esIndex}
        setESFilters={setESFilters}
        setFilterToggle={setFilterToggle}
        filterToggle={filterToggle}
        extraFitlers={["status", "propertyGroup"]}
      />

      {/* <WellCardContextProvider>
        <ValidationChart propertyId={propertyId} /> 
      </WellCardContextProvider> */}

      
    </div>
  )
}

const ValidationChart = ({ propertyId }) => {

  const [stateWellCard, setStateWellCard] = useContext(WellCardContext);
  const [getAssociatedWellProductionData, { data: associatedWells }] = useLazyQuery(GET_ASSOCIATED_WELL_PRODUCTION_DATA);

  useEffect(() => {
    setStateWellCard((state) => {
      return {
        ...state,
        wellProdHistory: temp,
      }
    });
  },[temp])

    // Fetching wells from descriptor
    useEffect(() => {
      getAssociatedWellProductionData({
        variables: {
          relatedObject: propertyId,
        },
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
      <WellProdChartProvider  />
  )
}