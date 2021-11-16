import PersonIcon from '@material-ui/icons/Person';
import WellIcon from "components/Shared/svgIcons/well";
import OwnershipIcon from "components/Shared/svgIcons/ownership";
import LeaseIcon from "components/Shared/svgIcons/lease";
import OperatorIcon from "components/Shared/svgIcons/operator";


export const platformDataInitialData = [
    { index: 0, value: 'well', Icon: WellIcon, label: "Wells" },
    { index: 1, value: 'owner', Icon: OwnershipIcon, label: "Owners" },
    { index: 2, value: 'operator', Icon: OperatorIcon, label: "Operators" },
    { index: 3, value: 'lease', Icon: LeaseIcon, label: "Leases" },
    { index: 4, value: 'contacts', Icon: PersonIcon, label: "Contacts" },
]