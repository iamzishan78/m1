import LeaseIcon from "components/Shared/svgIcons/lease";
import WellIcon from "components/Shared/svgIcons/well";
import UnitIcon from "components/Shared/svgIcons/unit";
import TaxOwnerIcon from "@material-ui/icons/AccountBalance";
import DocumentsIcon from "@material-ui/icons/DescriptionOutlined";
import DealsIcon from "@material-ui/icons/MonetizationOn";
import ActivitiesIcon from '@material-ui/icons/Event';
import ContactInformationIcon from "components/Shared/svgIcons/ContactPhone";
import ParcelIcon from "components/Shared/svgIcons/tract";
import HistoryEduBlackIcon from "components/Shared/svgIcons/history_edu_black";
import { FEATURES } from "components/Shared/FeatureFlag/common";

// Icon: Prefixed Icon
// showCounts: show count of records 
// feature: Restrict module to show only if feature is avaialble 

export const contactDetailInitialData = [
  { index: 0, value: "contactInformation", Icon: ContactInformationIcon, label: "Contact Info", showCounts: false },
  { index: 4, value: "unitInterests", Icon: UnitIcon, label: "Unit Interests", showCounts: true },
  { index: 3, value: "wellInterests", Icon: WellIcon, label: "Well Interests", showCounts: true },
  { index: 5, value: "parcelInterests", Icon: ParcelIcon, label: "Tract Interests", showCounts: true },
  { index: 2, value: "taxRollInterests", Icon: TaxOwnerIcon, label: "Tax Roll Interests", showCounts: true },
  { index: 8, value: "relatedAgreements", Icon: HistoryEduBlackIcon, label: "Related Agreements", showCounts: true, feature: FEATURES.LANDMODULE },
  { index: 1, value: "activities", Icon: ActivitiesIcon, label: "Activities", showCounts: true },
  { index: 7, value: "documents", Icon: DocumentsIcon, label: "Documents", showCounts: true },
  { index: 6, value: "deals", Icon: DealsIcon, label: "Deals", showCounts: true },
];
