import { addAfterLabel } from "./helper";

const PARCELINTERESTS_FIELDS = require("./PARCELINTERESTS").default

const fields = JSON.parse(JSON.stringify(PARCELINTERESTS_FIELDS))
fields.splice(PARCELINTERESTS_FIELDS.length-1,1)

const tracts = [
    {
        label: "State",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level1Type.State",
    },
    {
        label: "County",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level2Type.County",
    },
    {
        label: "TXGrid Survey",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level3Type.Survey",
    },
    {
        label: "TXGrid Block",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level4Type.Block",
    },
    {
        label: "TXGrid Section",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level5Type.Section",
    },
    {
        label: "TXGrid Abstract",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level6Type.Abstract",
    },
    {
        label: "PLSS Meridian",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level3Type.Meridian",
    },
    {
        label: "PLSS Township",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level4Type.Township",
    },
    {
        label: "PLSS Range",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level4Type.Range",
    },
    {
        label: "PLSS Township/Range",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level5Type.TownshipRange",
    },
    {
        label: "PLSS Section",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.level6Type.Section",
    },
    {
        label: "LandGridGeom Id",
        mapped_key: "",
        required: true,
        actual_key: "landgrid._id",
    },
    {
        label: "LandGridGeom Name",
        mapped_key: "",
        required: true,
        actual_key: "landgrid.name",
    },
    ...fields,
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