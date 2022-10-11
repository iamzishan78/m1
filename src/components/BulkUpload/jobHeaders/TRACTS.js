import { copy } from "components/Shared/functions";
import { landColumns } from "./COMMON";
import { addAfterLabel } from "./helper";

const PARCELINTERESTS_FIELDS = require("./PARCELINTERESTS").default

const fields = JSON.parse(JSON.stringify(PARCELINTERESTS_FIELDS))
fields.splice(PARCELINTERESTS_FIELDS.length - 1, 1)

const tracts = [
    ...copy(landColumns),
    ...copy(fields),
    {
        label: "Tags",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.tags"
    },
];

addAfterLabel(tracts, 'Parcel Name', {
    label: "Description",
    mapped_key: "",
    actual_key: "parcel.description",
})


// tracts.find((key) => key.actual_key === 'entityDetail.state').label = 'AddressState'

export default tracts